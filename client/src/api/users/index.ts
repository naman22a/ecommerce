import API from '..';
import { User } from './types';

export const getUsers = async (): Promise<User[]> => {
    try {
        const res = await API.get('/users');
        return res.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const me = async (): Promise<User | null> => {
    try {
        const res = await API.get('/users/me');
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
