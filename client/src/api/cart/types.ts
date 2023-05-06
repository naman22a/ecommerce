export interface Item {
    id: number;
    pid: string;
    qty: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

export interface CreateItemDto {
    pid: string;
    qty: number;
}
