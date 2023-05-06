import { NextPage } from 'next';
import * as api from '@/api';
import { mapToErrors } from '@/utils';
import { RegisterInfo } from '@/interfaces';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
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
import { useMutation } from '@tanstack/react-query';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';

const Register: NextPage = () => {
    const [visible, { toggle }] = useDisclosure(false);
    const { mutateAsync: register, isLoading } = useMutation(
        ['auth', 'register'],
        api.auth.register
    );

    const form = useForm<RegisterInfo>({
        initialValues: {
            name: '',
            email: '',
            password: '',
            cpassword: ''
        },

        validate: {
            name: (value) =>
                value.length !== 0 ? null : 'Please enter a name.',
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email.',
            password: (value) =>
                value.length >= 6
                    ? null
                    : 'Password must be atleast 6 characters long.',
            cpassword: (value) =>
                value.length >= 6
                    ? null
                    : 'Password must be atleast 6 characters long.'
        }
    });

    const handleSubmit = async (values: RegisterInfo) => {
        const { name, email, password, cpassword } = values;

        if (password !== cpassword) {
            form.setFieldError('cpassword', 'Passwords must be same.');
            return;
        }
        try {
            const res = await register({ name, email, password });
            if (res.ok && !res.errors) {
                notifications.show({
                    title: 'Please check your email.',
                    withCloseButton: true,
                    icon: <BsCheckCircleFill />,
                    message: 'Hey there, we have sent you a confirmation email.'
                });
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
                Register
            </Title>
            <Box maw={300} mx="auto">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Name"
                        placeholder="Name"
                        autoComplete="off"
                        {...form.getInputProps('name')}
                    />
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
                            Register
                        </Button>
                    </Group>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
