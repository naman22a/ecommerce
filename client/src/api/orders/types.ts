import { ImageType } from '../cms/types';

export interface CheckoutItem {
    name: string;
    images: ImageType[];
    price: number;
    qty: number;
}

export interface Order {
    id: number;
    items: {
        id: number;
        description: string;
        price: number;
        qty: number;
    }[];
    isDelivered: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
}
