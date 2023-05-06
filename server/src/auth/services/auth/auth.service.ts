import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { EnvironmentVariables } from '../../../config';
import { AccessTokenPayload, RefreshTokenPayload } from '../../../types';
import { Response } from 'express';
import { COOKIE_NAME, __prod__ } from '../../../constants';

@Injectable()
export class AuthService {
    constructor(private configService: ConfigService<EnvironmentVariables>) {}

    createAcessToken(user: User) {
        const secret = this.configService.get('ACCESS_TOKEN_SECRET');
        return sign({ userId: user.id } as AccessTokenPayload, secret, {
            expiresIn: '15m',
        });
    }

    createRefreshToken(user: User) {
        const secret = this.configService.get('REFRESH_TOKEN_SECRET');
        return sign(
            {
                userId: user.id,
                tokenVersion: user.tokenVersion,
            } as RefreshTokenPayload,
            secret,
            { expiresIn: '7d' },
        );
    }

    sendRefreshToken(res: Response, token: string) {
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: !__prod__,
            sameSite: 'lax',
            path: '/auth/refresh_token',
        });
    }
}
