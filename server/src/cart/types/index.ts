import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateItemDto {
    @ApiProperty({
        example: 'some-product-id',
        description: 'product id of a product added to the cart',
    })
    @IsNotEmpty()
    pid: string;

    @ApiProperty({
        example: 2,
        description: 'product quantity of a product added to cart',
    })
    @Min(0)
    @IsInt()
    qty: number;
}

export class UpdateItemDto {
    @ApiProperty({
        example: 2,
        description: 'product quantity of a product added to cart',
    })
    @Min(0)
    @IsInt()
    qty: number;
}
