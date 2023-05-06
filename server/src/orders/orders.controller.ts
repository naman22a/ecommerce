import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config';
import { AuthGuard } from '../auth/auth.guard';
import { CartService } from '../cart/cart.service';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CheckoutItem } from '../types';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(
        @InjectStripe() private readonly stripe: Stripe,
        private ordersService: OrdersService,
        private configService: ConfigService<EnvironmentVariables>,
        private cartService: CartService,
    ) {}

    @Post('checkout')
    async payment(@Body() items: CheckoutItem[], @Req() req: Request) {
        try {
            const projectId =
                this.configService.getOrThrow('SANITY_PROJECT_ID');

            // checkout
            const session = await this.ordersService.checkout(items);
            const data = (
                await this.stripe.checkout.sessions.listLineItems(session.id)
            ).data;

            // reset cart
            await this.cartService.resetCart(req.userId);

            // order history
            await this.ordersService.create(req.userId, data);

            return {
                session,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }
    }

    @Get()
    async show(@Req() req: Request) {
        return await this.ordersService.show(req.userId);
    }
}
