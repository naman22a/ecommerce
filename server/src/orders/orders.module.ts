import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        CartModule,
        StripeModule.forRoot({
            apiKey: process.env.STRIPE_SECRET_KEY,
            apiVersion: '2022-11-15',
        }),
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
