import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './types';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    async findOneById(id: number) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    async findOneByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: CreateUserDto): Promise<User> {
        return await this.prisma.user.create({ data });
    }

    async verify(id: number) {
        await this.prisma.user.update({
            where: { id },
            data: { isVerified: true },
        });
    }

    async updatePassword(id: number, password: string) {
        await this.prisma.user.update({
            where: { id },
            data: { password },
        });
    }

    async incrementTokenVersion(id: number) {
        await this.prisma.user.update({
            where: { id },
            data: {
                tokenVersion: {
                    increment: 1,
                },
            },
        });
    }
}
