import axios from 'axios';
import API from '..';
import { OkResponse } from '../types';
import {
    LoginDto,
    LoginResponse,
    RegisterDto,
    ResetPasswordDto
} from './types';

export const register = async (data: RegisterDto): Promise<OkResponse> => {
    try {
        const res = await API.post('/auth/register', data);
        return res.data;
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
};

export const login = async (data: LoginDto): Promise<LoginResponse> => {
    try {
        const res = await API.post('/auth/login', data);
        return res.data;
    } catch (error) {
        console.error(error);
        return { accessToken: '' };
    }
};

export const logout = async (): Promise<OkResponse> => {
    try {
        const res = await API.post('/auth/logout');
        return res.data;
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
};

export const confirmEmail = async (token: string): Promise<OkResponse> => {
    try {
        const res = await API.post(`/auth/confirm-email/${token}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
};

export const forgotPassword = async (email: string): Promise<OkResponse> => {
    try {
        const res = await API.post('/auth/forgot-password', { email });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        console.error(error);
        return { ok: false };
    }
};

export const resetPassword = async ({
    token,
    password
}: ResetPasswordDto): Promise<OkResponse> => {
    try {
        const res = await API.post(`/auth/reset-password/${token}`, {
            password
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        console.error(error);
        return { ok: false };
    }
};
