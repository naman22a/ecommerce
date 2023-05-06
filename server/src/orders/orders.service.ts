import { Injectable } from '@nestjs/common';
import { EnvironmentVariables } from '../config';
import { ConfigService } from '@nestjs/config';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { CheckoutItem } from '../types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectStripe() private readonly stripe: Stripe,
        private configService: ConfigService<EnvironmentVariables>,
        private prisma: PrismaService,
    ) {}

    async checkout(items: CheckoutItem[]) {
        const YOUR_DOMAIN = this.configService.getOrThrow('CORS_ORIGIN');

        return await this.stripe.checkout.sessions.create({
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            line_items: items.map((item) => {
                const img = item.images[0].asset._ref;
                const newImage = img
                    .replace(
                        'image-',
                        'https://cdn.sanity.io/images/tsgoimac/production/',
                    )
                    .replace('-webp', '.webp')
                    .replace('-jpeg', '.jpeg')
                    .replace('-jpg', '.jpg')
                    .replace('-png', '.png');
                return {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: item.name,
                            images: [newImage],
                        },
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: { enabled: true, minimum: 1 },
                    quantity: item.qty,
                };
            }),
            success_url: `${YOUR_DOMAIN}/success`,
            cancel_url: `${YOUR_DOMAIN}/canceled`,
        });
    }

    async create(userId: number, data: Stripe.LineItem[]) {
        const order = await this.prisma.order.create({
            data: {
                userId,
            },
        });

        data.map(async (item) => {
            await this.prisma.orderHistoryItem.create({
                data: {
                    orderId: order.id,
                    description: item.description,
                    price: item.price.unit_amount / 100,
                    qty: item.quantity,
                },
            });
        });

        return await this.prisma.order.findUnique({ where: { id: order.id } });
    }

    async show(userId: number) {
        return await this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
        });
    }
}
