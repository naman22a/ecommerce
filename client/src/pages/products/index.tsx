import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import * as api from '@/api';
import { Container, Pagination, Title } from '@mantine/core';
import { Product } from '../../api/cms/types';
import { ProductsList } from '../../components';

const Products = ({
    products
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(6);

    const lastProductIndex = currentPage * productsPerPage;
    const firstProductIndex = lastProductIndex - productsPerPage;
    const currentProducts = products.slice(firstProductIndex, lastProductIndex);

    return (
        <Container sx={{ padding: '30px' }}>
            <Title order={1} ta="left" mb={50}>
                Products
            </Title>

            <ProductsList products={currentProducts} />
            <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={Math.ceil(products.length / productsPerPage)}
                mt="md"
            />
        </Container>
    );
};

interface Data {
    products: Product[];
}

export const getStaticProps: GetStaticProps<Data> = async () => {
    const products: Product[] = await api.cms.getAllProducts();
    return {
        props: { products }
    };
};

export default Products;
