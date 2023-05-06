export interface FieldError {
    field: string;
    message: string;
}

export interface OkResponse {
    ok: boolean;
    errors?: FieldError[];
}

export interface AccessTokenPayload {
    userId: number;
}

export interface RefreshTokenPayload {
    userId: number;
    tokenVersion: number;
}
