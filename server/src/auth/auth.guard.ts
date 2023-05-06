import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AccessTokenPayload } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request;
        const authorization = req.headers['authorization'];

        if (!authorization) {
            throw new UnauthorizedException();
        }

        try {
            const token = authorization.split(' ')[1];
            const payload = verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
            ) as AccessTokenPayload;
            req.userId = payload.userId;

            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
