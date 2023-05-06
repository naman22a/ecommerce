import React from 'react';
import * as api from '@/api';
import { Container, Table, ThemeIcon, Title, Text, Flex } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AiFillCheckSquare } from 'react-icons/ai';
import { MdOutlinePendingActions } from 'react-icons/md';
import { formatter } from '@/utils';
dayjs.extend(relativeTime);

const Orders: React.FC = () => {
    const {
        data: orders,
        isLoading,
        isError
    } = useQuery(['orders'], api.orders.orders);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError || !orders) {
        return <p>Something went wrong</p>;
    }

    const rows = orders.map((order) => (
        <tr key={order.id}>
            <td>{order.id}</td>
            <td>
                {order.items.map((item) => (
                    <>
                        <Text>{item.description}</Text>
                        <Text>Qty: {item.qty}</Text>
                        <Text>{formatter.format(item.price * item.qty)}</Text>
                    </>
                ))}
            </td>
            <td>
                {order.isDelivered ? (
                    <Flex gap="sm" align="center">
                        <ThemeIcon>
                            <AiFillCheckSquare />
                        </ThemeIcon>
                        <Text>Delivered</Text>
                    </Flex>
                ) : (
                    <Flex gap="sm" align="center">
                        <ThemeIcon>
                            <MdOutlinePendingActions />
                        </ThemeIcon>
                        <Text>Pending</Text>
                    </Flex>
                )}
            </td>
            <td>{dayjs(order.createdAt).fromNow()}</td>
        </tr>
    ));

    return (
        <Container>
            <Title order={1} mb="md">
                Order History
            </Title>
            <Table striped>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Items</th>
                        <th>is Delivered</th>
                        <th>Ordered at</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Container>
    );
};

export default Orders;
