import React from 'react';
import Link from 'next/link';
import * as api from '@/api';
import {
    Anchor,
    Button,
    Flex,
    Indicator,
    MediaQuery,
    Title
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import UserMenu from './UserMenu/UserMenu';
import { FaShoppingCart } from 'react-icons/fa';
import { useStore } from '@/store';

const Header: React.FC = () => {
    const toggleCart = useStore((state) => state.toggleCart);
    const { data: items } = useQuery(['cart', 'items'], api.cart.getItems);
    const {
        data: user,
        isLoading,
        isError
    } = useQuery(['users', 'me'], api.users.me);

    return (
        <Flex
            justify="space-between"
            align="center"
            px="lg"
            py="md"
            bg="teal"
            mb="lg"
            c="white"
        >
            <Anchor
                component={Link}
                href="/"
                sx={{ textDecoration: 'none', color: 'inherit' }}
                fw={500}
            >
                <Title order={1} size="h3">
                    Ecommerce
                </Title>
            </Anchor>
            {isLoading || isError || !user ? (
                <Flex align="center" gap="md">
                    <Anchor
                        component={Link}
                        href="/login"
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        Login
                    </Anchor>
                    <Anchor
                        component={Link}
                        href="/register"
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        Register
                    </Anchor>
                </Flex>
            ) : (
                <>
                    <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                        <Flex align="center" gap="md">
                            <UserMenu user={user} />
                            <Indicator
                                label={items ? items.length : 0}
                                color="red"
                                size={20}
                                offset={4}
                            >
                                <Button
                                    onClick={toggleCart}
                                    variant="white"
                                    leftIcon={<FaShoppingCart />}
                                >
                                    Cart
                                </Button>
                            </Indicator>
                        </Flex>
                    </MediaQuery>

                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Flex align="center" gap="xs">
                            <UserMenu user={user} />
                            <Indicator
                                label={items ? items.length : 0}
                                color="red"
                                size={20}
                                offset={4}
                            >
                                <Button
                                    onClick={toggleCart}
                                    variant="white"
                                    leftIcon={<FaShoppingCart />}
                                    size="xs"
                                >
                                    Cart
                                </Button>
                            </Indicator>
                        </Flex>
                    </MediaQuery>
                </>
            )}
        </Flex>
    );
};

export default Header;
