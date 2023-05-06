import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { redis } from '../../../redis';
import {
    CONFIRMATION_PREFIX,
    FORGOT_PASSWORD_PREFIX,
} from '../../../constants';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../config';
import * as nodemailer from 'nodemailer';

interface Metadata {
    url: string;
    subject: string;
}

@Injectable()
export class MailService {
    constructor(private configService: ConfigService<EnvironmentVariables>) {}

    async sendEmail(email: string, { url, subject }: Metadata) {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        let info = await transporter.sendMail({
            from: '"Ecommerce 🛒" <ecommerce@ecommerce.com>',
            to: email,
            subject,
            html: `<a href="${url}">${url}</a>`,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    async createConfirmationMetadata(userId: number): Promise<Metadata> {
        const token = v4();
        const cors_origin = this.configService.get('CORS_ORIGIN');

        await redis.set(
            CONFIRMATION_PREFIX + token,
            userId,
            'EX',
            3600 * 24 * 3, // 3 days
        );

        return {
            url: `${cors_origin}/confirm/${token}`,
            subject: 'Confirmation Email',
        };
    }

    async createForgotpasswordMetadata(userId: number): Promise<Metadata> {
        const token = v4();
        const cors_origin = this.configService.get('CORS_ORIGIN');

        await redis.set(
            FORGOT_PASSWORD_PREFIX + token,
            userId,
            'EX',
            3600 * 5, // 5 hours
        );

        return {
            url: `${cors_origin}/reset-password/${token}`,
            subject: 'Reset Password',
        };
    }
}
