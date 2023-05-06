import { NextPage } from 'next';
import * as api from '@/api';
import { useRouter } from 'next/router';
import { Button, Container, Flex, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { MdError } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';

const ConfirmEmail: NextPage = () => {
    const router = useRouter();
    const token = router.query.token as string;
    const { mutateAsync: confirmEmail, isLoading } = useMutation(
        ['auth', 'confirm'],
        api.auth.confirmEmail
    );

    const handleSumbit = async () => {
        try {
            const res = await confirmEmail(token);
            if (res.ok && !res.errors) {
                notifications.show({
                    title: 'Email confirmed!',
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message:
                        'Hey there, we have successfully verified your email.',
                    color: 'green'
                });
                await router.push('/login');
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
            <Flex maw={300} mx="auto" direction="column">
                <Title order={1} ta="center" mb={25}>
                    Confirm Email
                </Title>
                <Button onClick={handleSumbit} loading={isLoading}>
                    Confirm Email
                </Button>
            </Flex>
        </Container>
    );
};

export default ConfirmEmail;
