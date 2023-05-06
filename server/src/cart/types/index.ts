import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateItemDto {
    @IsNotEmpty()
    pid: string;

    @Min(0)
    @IsInt()
    qty: number;
}

export class UpdateItemDto {
    @Min(0)
    @IsInt()
    qty: number;
}
