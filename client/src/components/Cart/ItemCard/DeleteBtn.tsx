import React from 'react';
import * as api from '@/api';
import { Button } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { MdError } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';

interface Props {
    id: number;
}

const DeleteBtn: React.FC<Props> = ({ id }) => {
    const queryClient = useQueryClient();
    const { mutateAsync: deleteItem, isLoading } = useMutation(
        ['cart', 'delete', id],
        api.cart.deleteItem
    );

    const handleDeleteItem = async () => {
        try {
            const res = await deleteItem(id);

            if (res.ok && !res.errors) {
                await queryClient.invalidateQueries(['cart', 'items']);
                notifications.show({
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message: 'Deleted Item from cart.'
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
        }
    };

    return (
        <Button
            size="xs"
            color="red"
            onClick={handleDeleteItem}
            loading={isLoading}
            leftIcon={<AiFillDelete />}
        >
            Delete
        </Button>
    );
};

export default DeleteBtn;
