import API from '..';
import { OkResponse } from '../types';
import { CreateItemDto, Item } from './types';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

export const getItems = async (): Promise<Item[]> => {
    const res = await API.get('/cart');
    return res.data;
};

export const addItem = async (item: CreateItemDto): Promise<Item | null> => {
    try {
        const res = await API.post('/cart', item);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                notifications.show({
                    title: 'Not logged in',
                    message: 'Please login to continue.',
                    autoClose: 3000,
                    color: 'red'
                });
            }
        }
        return null;
    }
};

export const deleteItem = async (id: number): Promise<OkResponse> => {
    const res = await API.delete(`/cart/${id}`);
    return res.data;
};

export const updateItem = async ({
    id,
    qty
}: {
    id: number;
    qty: number;
}): Promise<OkResponse> => {
    const res = await API.patch(`/cart/${id}`, { qty });
    return res.data;
};
