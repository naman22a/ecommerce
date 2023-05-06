import React from 'react';
import * as api from '@/api';
import { mapToErrors } from '@/utils';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
    Box,
    Button,
    Container,
    Group,
    PasswordInput,
    Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';

const ResetPassword: React.FC = () => {
    const router = useRouter();
    const token = router.query.token as string;
    const [visible, { toggle }] = useDisclosure(false);
    const { mutateAsync: resetPassword, isLoading } = useMutation(
        ['auth', 'reset-password'],
        api.auth.resetPassword
    );

    const form = useForm({
        initialValues: {
            password: '',
            cpassword: ''
        }
    });

    const handleSubmit = async () => {
        const { password, cpassword } = form.values;

        if (password !== cpassword) {
            form.setFieldError('password', 'Passwords must be same.');
            return;
        }

        try {
            const res = await resetPassword({ token, password });

            if (res.ok && !res.errors) {
                notifications.show({
                    title: 'We have updated your password.',
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message: 'Hey there, now you can login'
                });
                await router.push('/login');
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
                Reset Password
            </Title>
            <Box maw={300} mx="auto">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <PasswordInput
                        label="Password"
                        placeholder="Password"
                        autoComplete="off"
                        visible={visible}
                        onVisibilityChange={toggle}
                        {...form.getInputProps('password')}
                    />
                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        autoComplete="off"
                        visible={visible}
                        onVisibilityChange={toggle}
                        {...form.getInputProps('cpassword')}
                    />

                    <Group position="right" mt="md">
                        <Button type="submit" loading={isLoading}>
                            Reset Password
                        </Button>
                    </Group>
                </form>
            </Box>
        </Container>
    );
};

export default ResetPassword;
