import React from 'react';
import * as api from '@/api';
import { LoginInfo } from '@/interfaces';
import { Group, Loader, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { MdError } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';

interface Props {
    form: UseFormReturnType<LoginInfo, (values: LoginInfo) => LoginInfo>;
}

const ForgotPassword: React.FC<Props> = ({ form }) => {
    const { mutateAsync: forgotPassword, isLoading } = useMutation(
        ['auth', 'forgot-password'],
        api.auth.forgotPassword
    );

    const handleForgotPassword = async () => {
        const email = form.values.email;
        const { error, hasError } = form.validateField('email');

        if (hasError) {
            form.setFieldError('email', error);
            return;
        }

        try {
            const res = await forgotPassword(email);
            if (res.ok && !res.errors) {
                notifications.show({
                    title: 'Please check your email.',
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    autoClose: 3000,
                    message:
                        'Hey there, we have sent you a reset password email.'
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
        <Group position="right" mt="md" onClick={() => handleForgotPassword()}>
            {isLoading && <Loader size="sm" />}
            <Text fw={500} c="teal" fz="sm" sx={{ cursor: 'pointer' }}>
                Forgot Password ?
            </Text>
        </Group>
    );
};

export default ForgotPassword;
