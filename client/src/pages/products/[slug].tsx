import {
    GetServerSideProps,
    GetStaticPaths,
    GetStaticProps,
    InferGetStaticPropsType
} from 'next';
import * as api from '@/api';
import { getSlugs } from '@/api/cms';
import { Product } from '@/api/cms/types';
import { ProductInfo } from '@/components';
import { Container, Flex, MediaQuery } from '@mantine/core';

const ProductDetails = ({
    product
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Container pt="xl">
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Flex>
                    <ProductInfo {...product} />
                </Flex>
            </MediaQuery>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Flex direction="column">
                    <ProductInfo {...product} />
                </Flex>
            </MediaQuery>
        </Container>
    );
};

interface Data {
    product: Product;
}

export const getStaticProps: GetStaticProps<Data> = async (context) => {
    const product: Product = await api.cms.getProductBySlug(
        context.params!.slug as string
    );

    return {
        props: { product }
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = (await getSlugs()).map((slug) => ({ params: { slug } }));
    return { paths, fallback: false };
};

export default ProductDetails;
