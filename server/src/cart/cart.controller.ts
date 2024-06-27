import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateItemDto, UpdateItemDto } from './types';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { Item } from '@prisma/client';
import { OkResponse } from '../types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    async show(@Req() req: Request): Promise<Item[]> {
        return await this.cartService.showCart(req.userId);
    }

    @Post()
    async add(
        @Body() body: CreateItemDto,
        @Req() req: Request,
    ): Promise<Item | null> {
        try {
            const item = await this.cartService.findOneByPId(
                req.userId,
                body.pid,
            );

            if (item) {
                await this.cartService.incrementQty(req.userId, item.id);
                return await this.cartService.findOneById(req.userId, item.id);
            }

            return await this.cartService.addItem(req.userId, body);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    @Delete(':id')
    async deleteItem(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ): Promise<OkResponse> {
        try {
            const x = await this.cartService.delete(req.userId, id);
            if (x.count <= 0) {
                return {
                    ok: false,
                    errors: [{ field: 'id', message: 'No item found.' }],
                };
            }
            return { ok: true };
        } catch (error) {
            console.error(error);
            return { ok: false };
        }
    }

    @Patch(':id')
    async updateItem(
        @Param('id', ParseIntPipe) id: number,
        @Body() { qty }: UpdateItemDto,
        @Req() req: Request,
    ): Promise<OkResponse> {
        try {
            const x = await this.cartService.updateQty(req.userId, id, qty);
            if (x.count <= 0) {
                return {
                    ok: false,
                    errors: [{ field: 'id', message: 'No item found.' }],
                };
            }
            return { ok: true };
        } catch (error) {
            console.error(error);
            return { ok: false };
        }
    }
}
