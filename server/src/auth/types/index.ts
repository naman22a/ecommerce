import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { FieldError } from '../../types';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'test', description: 'name of the user' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'test@test.com', description: 'email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'password of the user',
        minLength: 6,
    })
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'test@test.com', description: 'email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'password of the user',
    })
    @IsNotEmpty()
    password: string;
}

export class LoginResponse {
    accessToken: string;
    errors?: FieldError[];
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'test@test.com', description: 'email of the user' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        example: 'password123',
        description: 'password of the user',
        minLength: 6,
    })
    @MinLength(6)
    password: string;
}
