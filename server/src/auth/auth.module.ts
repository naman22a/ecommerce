import { Module } from '@nestjs/common';
import { AuthService, MailService } from './services';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [UsersModule],
    providers: [AuthService, MailService],
    controllers: [AuthController],
})
export class AuthModule {}
