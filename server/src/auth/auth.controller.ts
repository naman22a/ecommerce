import {
    Body,
    Controller,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { OkResponse, RefreshTokenPayload } from '../types';
import {
    ForgotPasswordDto,
    LoginDto,
    LoginResponse,
    RegisterDto,
    ResetPasswordDto,
} from './types';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { AuthService, MailService } from './services';
import { redis } from '../redis';
import { CONFIRMATION_PREFIX, FORGOT_PASSWORD_PREFIX } from '../constants';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config';
import { AuthGuard } from './auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private mailService: MailService,
        private authService: AuthService,
        private configService: ConfigService<EnvironmentVariables>,
    ) {}

    @Post('register')
    async register(@Body() body: RegisterDto): Promise<OkResponse> {
        const { name, email, password } = body;

        // check if user already exists in db
        const userExists = await this.usersService.findOneByEmail(email);
        if (userExists) {
            return {
                ok: false,
                errors: [{ field: 'email', message: 'Email already in use.' }],
            };
        }

        // hash user password
        const hashedPassword = await argon2.hash(password);

        // create the user in database
        const user = await this.usersService.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // send confirmation email
        const metadata = await this.mailService.createConfirmationMetadata(
            user.id,
        );
        await this.mailService.sendEmail(email, metadata);

        return { ok: true };
    }

    @Post('confirm-email/:token')
    async confirmEmail(
        @Param('token', new ParseUUIDPipe({ version: '4' })) token: string,
    ): Promise<OkResponse> {
        if (!token) return { ok: false };

        // get userId from redis
        const userId = await redis.get(CONFIRMATION_PREFIX + token);
        if (!userId) return { ok: false };

        // check if user exists in database
        const user = await this.usersService.findOneById(parseInt(userId, 10));
        if (!user) return { ok: false };

        // verify the user
        await this.usersService.verify(user.id);

        // delete token from redis
        await redis.del(CONFIRMATION_PREFIX + token);

        return { ok: true };
    }

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponse> {
        const { email, password } = body;

        // check if user exists in database
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return {
                accessToken: '',
                errors: [{ field: 'email', message: 'User not found.' }],
            };
        }

        // check if password is correct
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return {
                accessToken: '',
                errors: [{ field: 'password', message: 'Incorrect Password.' }],
            };
        }

        // check is user is verified
        if (!user.isVerified) {
            return {
                accessToken: '',
                errors: [
                    { field: 'email', message: 'Please verify your email.' },
                ],
            };
        }

        // send access and refresh tokens
        const accessToken = this.authService.createAcessToken(user);
        const refreshToken = this.authService.createRefreshToken(user);
        this.authService.sendRefreshToken(res, refreshToken);

        return { accessToken };
    }

    @Post('refresh_token')
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponse> {
        const token = req.cookies['jid'];
        const secret = this.configService.get('REFRESH_TOKEN_SECRET');

        // check if token exists
        if (!token) return { accessToken: '' };

        let payload: RefreshTokenPayload | null = null;

        try {
            // decode the token
            payload = verify(token, secret) as RefreshTokenPayload;
        } catch (error) {
            console.error(error);
            return { accessToken: '' };
        }

        // check if user exists
        const user = await this.usersService.findOneById(payload.userId);
        if (!user) return { accessToken: '' };

        // check if token version of user and jwt are equal
        if (user.tokenVersion !== payload.tokenVersion) {
            return { accessToken: '' };
        }

        // send access and refresh tokens
        const accessToken = this.authService.createAcessToken(user);
        const refreshToken = this.authService.createRefreshToken(user);
        this.authService.sendRefreshToken(res, refreshToken);

        return { accessToken };
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response): OkResponse {
        this.authService.sendRefreshToken(res, '');
        return { ok: true };
    }

    @Post('forgot-password')
    async forgotPassword(
        @Body() { email }: ForgotPasswordDto,
    ): Promise<OkResponse> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return { ok: true };
        }

        // send forgot password email
        const metadata = await this.mailService.createForgotpasswordMetadata(
            user.id,
        );
        await this.mailService.sendEmail(email, metadata);

        return { ok: true };
    }

    @Post('reset-password/:token')
    async resetPassword(
        @Param('token', new ParseUUIDPipe({ version: '4' })) token: string,
        @Body() { password }: ResetPasswordDto,
    ): Promise<OkResponse> {
        if (!token) return { ok: false };

        // find user id in redis
        const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
        if (!userId) return { ok: false };

        // check if user exists for the found user id
        const user = await this.usersService.findOneById(parseInt(userId, 10));
        if (!user) return { ok: false };

        // hash the password
        const hashedPassword = await argon2.hash(password);

        // update user password
        await this.usersService.updatePassword(user.id, hashedPassword);

        // increment token version
        await this.usersService.incrementTokenVersion(user.id);

        // delete token from redis
        await redis.del(FORGOT_PASSWORD_PREFIX + token);

        return { ok: true };
    }
}
