import React from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Anchor,
    Flex,
    Button
} from '@mantine/core';
import Link from 'next/link';

const Canceled: React.FC = () => {
    return (
        <Container>
            <Paper shadow="md" p="md" withBorder mt="lg">
                <Flex justify="center" align="center" direction="column">
                    <Title order={2} my="md" ta="center" color="red">
                        Something went wrong 😭
                    </Title>
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

export default Canceled;
