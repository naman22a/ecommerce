import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { FieldError } from '../../types';

export class RegisterDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class LoginResponse {
    accessToken: string;
    errors?: FieldError[];
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @MinLength(6)
    password: string;
}
