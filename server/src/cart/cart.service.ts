import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './types';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async showCart(userId: number) {
        return await this.prisma.item.findMany({
            where: { userId },
        });
    }

    async addItem(userId: number, item: CreateItemDto) {
        return await this.prisma.item.create({ data: { userId, ...item } });
    }

    async findOneById(userId: number, id: number) {
        return (await this.prisma.item.findMany({ where: { userId, id } }))[0];
    }

    async findOneByPId(userId: number, pid: string) {
        return (await this.prisma.item.findMany({ where: { userId, pid } }))[0];
    }

    async incrementQty(userId: number, id: number) {
        await this.prisma.item.updateMany({
            where: { userId, id },
            data: {
                qty: { increment: 1 },
            },
        });
    }

    async delete(userId: number, id: number) {
        return await this.prisma.item.deleteMany({
            where: { userId, id },
        });
    }

    async updateQty(userId: number, id: number, qty: number) {
        return await this.prisma.item.updateMany({
            where: { userId, id },
            data: { qty },
        });
    }

    async resetCart(userId: number) {
        return await this.prisma.item.deleteMany({
            where: { userId },
        });
    }
}
