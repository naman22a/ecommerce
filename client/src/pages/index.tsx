import { InferGetStaticPropsType, GetStaticProps } from 'next';
import Link from 'next/link';
import * as api from '@/api';
import { Product } from '@/api/cms/types';
import { ProductsList } from '@/components';
import { Button, Container, Stack, Title } from '@mantine/core';

const Index = ({
    products
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Container>
            <Stack>
                <Title order={1} ta="center" mb={50}>
                    Our Latest Products
                </Title>
                <ProductsList products={products} />

                <Button
                    component={Link}
                    href="/products"
                    variant="subtle"
                    ta="center"
                    mb={5}
                >
                    See all Products
                </Button>
            </Stack>
        </Container>
    );
};

interface Data {
    products: Product[];
}

export const getStaticProps: GetStaticProps<Data> = async () => {
    const products: Product[] = await api.cms.getLatestProducts(3);

    return {
        props: { products }
    };
};

export default Index;
