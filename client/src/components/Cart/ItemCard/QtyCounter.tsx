import React, { useState } from 'react';
import * as api from '@/api';
import { Item } from '@/api/cart/types';
import { Button, Group, Text } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BsCheckCircleFill } from 'react-icons/bs';
import { notifications } from '@mantine/notifications';
import { MdError } from 'react-icons/md';

interface Props extends Item {}

const QtyCounter: React.FC<Props> = ({ id, qty }) => {
    const queryClient = useQueryClient();
    const [iLoading, setILoading] = useState(false);
    const [dLoading, setDLoading] = useState(false);

    const { mutateAsync: updateItem } = useMutation(
        ['cart', 'items', 'update', id],
        api.cart.updateItem
    );

    const handleUpdateItem = async (x: number) => {
        if (qty + x <= 0) {
            return;
        }

        if (x === 1) {
            setILoading(true);
        } else if (x === -1) {
            setDLoading(true);
        }
        try {
            const res = await updateItem({ id, qty: qty + x });
            if (res.ok && !res.errors) {
                await queryClient.invalidateQueries(['cart', 'items']);
                notifications.show({
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message:
                        x > 0
                            ? 'Added one more item to cart.'
                            : 'Removed one item from cart'
                });
            } else {
                notifications.show({
                    withCloseButton: true,
                    message: 'Something went wrong.',
                    icon: <MdError />,
                    color: 'red'
                });
            }
        } catch (error) {
            notifications.show({
                withCloseButton: true,
                message: 'Something went wrong.',
                icon: <MdError />,
                color: 'red'
            });
        } finally {
            setILoading(false);
            setDLoading(false);
        }
    };

    return (
        <Group>
            <Button loading={dLoading} onClick={() => handleUpdateItem(-1)}>
                -
            </Button>
            <Text>{qty}</Text>

            <Button loading={iLoading} onClick={() => handleUpdateItem(1)}>
                +
            </Button>
        </Group>
    );
};

export default QtyCounter;
