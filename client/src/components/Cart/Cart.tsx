import React from 'react';
import * as api from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ActionIcon,
    Drawer,
    Flex,
    Loader,
    Title,
    Text,
    Button
} from '@mantine/core';
import { useStore } from '@/store';
import { MdError } from 'react-icons/md';
import ItemCard from './ItemCard/ItemCard';
import { formatter } from '@/utils';
import getStripe from '@/lib/getStripe';
import { CheckoutItem } from '@/api/orders/types';
import { Stripe } from '@stripe/stripe-js';
import { notifications } from '@mantine/notifications';
import { BsCheckCircleFill } from 'react-icons/bs';

const Cart: React.FC = () => {
    const queryClient = useQueryClient();
    const cartIsOpen = useStore((state) => state.cartIsOpen);
    const toggleCart = useStore((state) => state.toggleCart);
    const subtotal = useStore((state) => state.subtotal);
    const setSubtotal = useStore((state) => state.setSubtotal);

    const { mutateAsync: checkout, isLoading: checkoutIsLoading } = useMutation(
        ['orders', 'checkout'],
        api.orders.checkout
    );
    const {
        data: items,
        isLoading,
        isError
    } = useQuery(['cart', 'items'], api.cart.getItems, {
        onSuccess: async (items) => {
            if (items.length === 0) {
                return;
            }
            const prices = items.map(async (item) => {
                const product = await api.cms.getProduct(item.pid);
                return product.price * item.qty;
            });

            const subtotal = prices.reduce(async (x, y) => {
                const a = await x;
                const b = await y;
                return a + b;
            });
            setSubtotal(await subtotal);
        }
    });

    const handleCheckout = async () => {
        try {
            const stripe = (await getStripe()) as Stripe;
            console.log(stripe);

            const is: CheckoutItem[] = [];

            for (const item of items!) {
                const product = await api.cms.getProduct(item.pid);

                is.push({
                    name: product.title,
                    images: product.images,
                    price: product.price,
                    qty: item.qty
                });
            }

            const res = await checkout(is);
            await queryClient.invalidateQueries(['cart', 'items']);
            notifications.show({
                withCloseButton: true,
                icon: <BsCheckCircleFill />,
                message: 'Redirecting',
                loading: checkoutIsLoading
            });
            stripe.redirectToCheckout({ sessionId: res.session.id });
        } catch (error) {
            console.error(error);
            notifications.show({
                withCloseButton: true,
                message: 'Something went wrong.',
                icon: <MdError />,
                color: 'red'
            });
        }
    };

    let body: any = null;

    if (isLoading) {
        body = <Loader />;
    } else if (isError || !items) {
        body = (
            <Flex gap="sm" align="center">
                <ActionIcon color="red" variant="light">
                    <MdError size={24} />
                </ActionIcon>
                <Title color="red" order={3} size="h3">
                    Something went wrong 😢
                </Title>
            </Flex>
        );
    } else {
        body = (
            <>
                {items.length > 0 ? (
                    <>
                        {items.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                        <Flex mt="xl" fw="bold" gap="sm">
                            <Text color="teal">Subtotal:</Text>{' '}
                            <Text>{formatter.format(subtotal)}</Text>
                        </Flex>
                        <Button
                            mt="lg"
                            fz="lg"
                            loading={checkoutIsLoading}
                            onClick={() => handleCheckout()}
                        >
                            Checkout
                        </Button>
                    </>
                ) : (
                    <Text>No items in your cart.</Text>
                )}
            </>
        );
    }

    return (
        <Drawer.Root opened={cartIsOpen} onClose={toggleCart}>
            <Drawer.Overlay />
            <Drawer.Content>
                <Drawer.Header mb="md">
                    <Drawer.Title fw="bold" fz="xl">
                        Shopping Cart
                    </Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body>{body}</Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    );
};

export default Cart;
