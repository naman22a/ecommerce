export class FieldError {
    field: string;
    message: string;
}

export class OkResponse {
    ok: boolean;
    errors?: FieldError[];
}

export class AccessTokenPayload {
    userId: number;
}

export class RefreshTokenPayload {
    userId: number;
    tokenVersion: number;
}

export interface SanityImageType {
    _type: string;
    asset: {
        _ref: string;
        _type: string;
    };
}

export interface CheckoutItem {
    name: string;
    images: SanityImageType[];
    price: number;
    qty: number;
}

export interface OrderHistoryItem {
    description: string;
    price: number;
    qty: number;
}
