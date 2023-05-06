import { client } from '@/lib';
import { Category, Product } from './types';

export const getLatestProducts = async (n: number = 5): Promise<Product[]> => {
    return await client.fetch(
        `*[_type == 'product'][0...${n}] | order(_createdAt desc)`
    );
};

export const getAllProducts = async (): Promise<Product[]> => {
    return await client.fetch(`*[_type == 'product'] | order(_createdAt desc)`);
};

export const getProduct = async (_id: string): Promise<Product> => {
    return (await client.fetch(`*[_id == '${_id}']`))[0];
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
    return (
        await client.fetch(`*[_type == 'product' && slug.current == '${slug}']`)
    )[0];
};

export const getSlugs = async (): Promise<string[]> => {
    const products = (await client.fetch(`*[_type == 'product']`)) as Product[];
    return products.map((p) => p.slug.current);
};
