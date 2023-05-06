import React from 'react';
import * as api from '@/api';
import {
    Badge,
    Button,
    Card,
    Group,
    Text,
    Image,
    Rating,
    Flex
} from '@mantine/core';
import { Product } from '@/api/cms/types';
import { urlFor } from '@/lib';
import Link from 'next/link';
import Slider from 'react-slick';
import { formatter } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';

interface Props extends Product {}

const ProductCard: React.FC<Props> = (props) => {
    const { images, title, description, price, rating, slug, _id } = props;
    const queryClient = useQueryClient();

    const { mutateAsync: addItem, isLoading } = useMutation(
        ['cart', 'add', slug],
        api.cart.addItem
    );

    const handleAddToCart = async () => {
        try {
            const res = await addItem({
                pid: _id,
                qty: 1
            });
            await queryClient.invalidateQueries(['cart', 'items']);

            if (res) {
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
        <Card shadow="md" padding="lg" radius="md">
            <Card.Section pb="md">
                <Slider dots={true} speed={400} infinite={false}>
                    {images.map((image) => (
                        <Image
                            key={image.asset._ref}
                            src={urlFor(image).url()}
                            height={160}
                            alt="Image"
                            fit="contain"
                        />
                    ))}
                </Slider>
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{title}</Text>
                <Badge color="teal" variant="light">
                    {formatter.format(price)}
                </Badge>
            </Group>

            <Flex align="center" gap="sm">
                <Text size="md">{rating}</Text>
                <Rating value={rating} fractions={5} readOnly />
            </Flex>

            <Text size="sm" color="dimmed">
                {description.slice(0, 100)} ...
            </Text>

            <Group grow>
                <Button
                    variant="filled"
                    mt="md"
                    radius="md"
                    component={Link}
                    href={`/products/${slug.current}`}
                >
                    View
                </Button>
                <Button
                    loading={isLoading}
                    variant="outline"
                    mt="md"
                    radius="md"
                    onClick={() => handleAddToCart()}
                >
                    Add to cart
                </Button>
            </Group>
        </Card>
    );
};

export default ProductCard;
