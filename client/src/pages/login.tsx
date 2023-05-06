import { NextPage } from 'next';
import * as api from '@/api';
import { mapToErrors } from '@/utils';
import { useRouter } from 'next/router';
import { LoginInfo } from '@/interfaces';
import { setAccessToken } from '@/global';
import { ForgotPassword } from '@/components';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    TextInput,
    Group,
    Button,
    PasswordInput,
    Container,
    Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';

const Login: NextPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutateAsync: login, isLoading } = useMutation(
        ['auth', 'login'],
        api.auth.login
    );

    const form = useForm<LoginInfo>({
        initialValues: {
            email: '',
            password: ''
        },

        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email.',
            password: (value) =>
                value.length !== 0 ? null : 'Please enter a password.'
        }
    });

    const handleSubmit = async (values: LoginInfo) => {
        try {
            const res = await login(values);
            if (res.accessToken && !res.errors) {
                await queryClient.invalidateQueries(['users', 'me']);
                setAccessToken(res.accessToken);
                notifications.show({
                    title: 'Logged In',
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message: 'Hey there, your have successfully logged in.',
                    color: 'green'
                });
                await router.push('/');
            } else if (res.errors) {
                form.setErrors(mapToErrors(res.errors));
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
        <Container>
            <Title order={1} ta="center" mb={25}>
                Login
            </Title>
            <Box maw={300} mx="auto">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        autoComplete="off"
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Password"
                        autoComplete="off"
                        {...form.getInputProps('password')}
                    />
                    <ForgotPassword form={form} />
                    <Group position="right" mt="md">
                        <Button type="submit" loading={isLoading}>
                            Login
                        </Button>
                    </Group>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
