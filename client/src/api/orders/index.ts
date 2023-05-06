import API from '..';
import { CheckoutItem, Order } from './types';

export const checkout = async (
    items: CheckoutItem[]
): Promise<{ session: { id: string } }> => {
    const res = await API.post(`/orders/checkout`, items);
    return res.data;
};

export const orders = async (): Promise<Order[]> => {
    const res = await API.get(`/orders`);
    return res.data;
};
