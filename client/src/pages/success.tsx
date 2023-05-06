import React, { useEffect } from 'react';
import {
    Container,
    Paper,
    ThemeIcon,
    Title,
    Text,
    Anchor,
    Flex,
    Button
} from '@mantine/core';
import { BsBagCheckFill } from 'react-icons/bs';
import Link from 'next/link';
import { showFireworks } from '../utils';

const Success: React.FC = () => {
    useEffect(() => {
        showFireworks();
    }, []);

    return (
        <Container>
            <Paper shadow="md" p="md" withBorder mt="lg">
                <Flex justify="center" align="center" direction="column">
                    <ThemeIcon color="green">
                        <BsBagCheckFill />
                    </ThemeIcon>
                    <Title order={2} my="md" ta="center">
                        Thank you for your order
                    </Title>
                    <Text mb="sm">Check your email inbox for receipt.</Text>
                    <Text ta="center">
                        If you have an questions please email{' '}
                        <Anchor
                            color="teal"
                            fw="bold"
                            href="mailto:ecommerce@example.com"
                        >
                            ecommerce@example.com
                        </Anchor>
                    </Text>

                    <Button mt="md" component={Link} href="/" color="pink">
                        Continue shopping
                    </Button>
                </Flex>
            </Paper>
        </Container>
    );
};

export default Success;
