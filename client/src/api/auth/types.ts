import { FieldError } from '../types';

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    errors?: FieldError[];
}

export interface ResetPasswordDto {
    token: string;
    password: string;
}
