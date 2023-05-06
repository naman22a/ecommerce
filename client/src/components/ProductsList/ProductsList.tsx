import React from 'react';
import { Product } from '@/api/cms/types';
import { SimpleGrid } from '@mantine/core';
import ProductCard from './ProductCard/ProductCard';

interface Props {
    products: Product[];
}

const ProductsList: React.FC<Props> = ({ products }) => {
    return (
        <SimpleGrid
            breakpoints={[
                { minWidth: 'sm', cols: 1 },
                { minWidth: 'md', cols: 2 },
                { minWidth: 1200, cols: 3 }
            ]}
        >
            {products.map((product) => (
                <ProductCard key={product._id} {...product} />
            ))}
        </SimpleGrid>
    );
};

export default ProductsList;
