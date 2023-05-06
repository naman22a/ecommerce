import React from 'react';
import * as api from '@/api';
import { Item } from '@/api/cart/types';
import { Flex, Loader, Title, Image, Group, Button } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { urlFor } from '@/lib';
import DeleteBtn from './DeleteBtn';
import QtyCounter from './QtyCounter';

interface Props {
    item: Item;
}

const ItemCard: React.FC<Props> = ({ item }) => {
    const {
        data: product,
        isLoading,
        isError
    } = useQuery(['cms', 'product', item.pid], () =>
        api.cms.getProduct(item.pid)
    );

    if (isLoading || isError || !product) {
        return <Loader />;
    }

    return (
        <Flex key={item.id} gap={20} my="lg">
            <Image
                src={urlFor(product.images[0]).width(70).height(70).url()}
                alt={product.title}
                fit="contain"
                height={70}
                width={70}
            />
            <Flex direction="column">
                <Title order={5} mb={15}>
                    {product.title}
                </Title>
                <Group>
                    <QtyCounter {...item} />
                    <DeleteBtn id={item.id} />
                </Group>
            </Flex>
        </Flex>
    );
};

export default ItemCard;
