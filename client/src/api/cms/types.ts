export interface BaseData {
    _id: string;
    _type: string;
    _rev: string;
    _createdAt: string;
    _updatedAt: string;
}

export interface ImageType {
    _type: string;
    asset: {
        _ref: string;
        _type: string;
    };
}

export interface Slug {
    current: string;
    _type: string;
}

export interface Category extends BaseData {
    name: string;
}

export interface Product extends BaseData {
    title: string;
    description: string;
    slug: Slug;
    rating: number;
    price: number;
    images: ImageType[];
}
