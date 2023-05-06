import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { ImageType } from '../api/cms/types';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2022-03-25',
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

const builder = imageUrlBuilder(client);

export function urlFor(source: ImageType) {
    return builder.image(source);
}
