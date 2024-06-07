import { Pagination } from './pagination';

export interface Products extends Pagination {
  products: Product[];
}

export interface Product {
  _id: string;
  brand: string;
  category: ProductCategory;
  description: string;
  images: string[];
  issueDate: string;
  price: ProductPrice;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
  warranty: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  image: string;
}

export interface ProductPrice {
  current: number;
  currency: string;
  beforeDiscount: number;
  discountPercentage: number;
}