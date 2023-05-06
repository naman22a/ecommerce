import React, { useState } from 'react';
import * as api from '@/api';
import { Product } from '@/api/cms/types';
import { urlFor } from '@/lib';
import { formatter } from '@/utils';
import {
    Flex,
    MediaQuery,
    Stack,
    Title,
    Badge,
    Rating,
    Group,
    Button,
    Image,
    Text
} from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';
import { useStore } from '@/store';

const ProductInfo: React.FC<Product> = (product) => {
    const toggleCart = useStore((state) => state.toggleCart);
    const queryClient = useQueryClient();
    const [currentImage, setCurrentImage] = useState(0);
    const [qty, setQty] = useState(1);
    const { _id, title, slug, rating, price, images, description } = product;

    const { mutateAsync: addItem, isLoading } = useMutation(
        ['cart', 'add', slug],
        api.cart.addItem
    );

    const handleAddToCart = async () => {
        try {
            const res = await addItem({
                pid: _id,
                qty
            });

            if (res) {
                await queryClient.invalidateQueries(['cart', 'items']);
                setQty(1);
                notifications.show({
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message: 'Added Item to cart.'
                });
            }
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

    return (
        <>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Flex>
                    <Stack>
                        {images.map((image, index) => (
                            <Image
                                key={image.asset._ref}
                                src={urlFor(image).height(100).width(100).url()}
                                alt={`${title}-${index}`}
                                fit="contain"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setCurrentImage(index)}
                            />
                        ))}
                    </Stack>
                    <Image
                        p="lg"
                        src={urlFor(images[currentImage])
                            .width(700)
                            .height(700)
                            .url()}
                        alt={title}
                    />
                </Flex>
            </MediaQuery>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Flex direction="column-reverse">
                    <Flex>
                        {images.map((image, index) => (
                            <Image
                                key={image.asset._ref}
                                src={urlFor(image).height(300).width(300).url()}
                                alt={`${title}-${index}`}
                                fit="contain"
                                m="sm"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setCurrentImage(index)}
                            />
                        ))}
                    </Flex>
                    <Image
                        p="lg"
                        src={urlFor(images[currentImage]).url()}
                        fit="contain"
                        alt={title}
                    />
                </Flex>
            </MediaQuery>
            <Stack justify="flex-start" align="start">
                <Title order={1} mb={20}>
                    {title}
                </Title>
                <Badge color="teal" fz="lg" variant="filled" mb="sm">
                    {formatter.format(price)}
                </Badge>
                <Flex align="center" gap="sm" mb="md">
                    <Text size="md">{rating}</Text>
                    <Rating value={rating} fractions={5} readOnly />
                </Flex>
                <Text>{description}</Text>
                <Group>
                    <Button
                        onClick={() => {
                            if (qty - 1 <= 0) {
                                return;
                            }
                            setQty(qty - 1);
                        }}
                    >
                        -
                    </Button>
                    <Text>{qty}</Text>
                    <Button onClick={() => setQty(qty + 1)}>+</Button>
                </Group>
                <Group>
                    <Button
                        loading={isLoading}
                        variant="outline"
                        mt="md"
                        radius="md"
                        onClick={() => handleAddToCart()}
                    >
                        Add to cart
                    </Button>
                    <Button
                        loading={isLoading}
                        variant="filled"
                        mt="md"
                        radius="md"
                        onClick={() => {
                            handleAddToCart();
                            toggleCart();
                        }}
                    >
                        Buy Now
                    </Button>
                </Group>
            </Stack>
        </>
    );
};

export default ProductInfo;
