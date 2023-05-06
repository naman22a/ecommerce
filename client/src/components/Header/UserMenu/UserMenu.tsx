import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import * as api from '@/api';
import { Menu, Button, Loader, Anchor } from '@mantine/core';
import { setAccessToken } from '@/global';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Icons
import { FaUserCircle, FaHistory, FaShoppingCart } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { User } from '@/api/users/types';
import { MdError } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useRouter } from 'next/router';

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
    const router = useRouter();
    const toggleCart = useStore((state) => state.toggleCart);
    const queryClient = useQueryClient();
    const { mutateAsync: logout, isLoading } = useMutation(
        ['auth', 'users'],
        api.auth.logout
    );

    const handleLogout = async () => {
        try {
            const res = await logout();
            if (res.ok && !res.errors) {
                setAccessToken('');
                await queryClient.invalidateQueries(['users', 'me']);
                await router.push('/');
                notifications.show({
                    title: 'Logged out',
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message: 'Hey there, your have successfully logged out.',
                    color: 'green',
                    loading: isLoading
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
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button fz="md" leftIcon={<FaUserCircle />}>
                    {user.name}
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Anchor component={Link} href="/orders">
                    <Menu.Item icon={<FaHistory />}>Orders History</Menu.Item>
                </Anchor>
                <Menu.Item
                    onClick={() => toggleCart()}
                    icon={<FaShoppingCart />}
                >
                    Cart
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                {isLoading ? (
                    <Menu.Item>
                        <Loader color="orange" size="xs" />
                    </Menu.Item>
                ) : (
                    <Menu.Item
                        onClick={handleLogout}
                        color="orange"
                        icon={<BiLogOut />}
                    >
                        Logout
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
};

export default UserMenu;
