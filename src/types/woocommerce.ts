export interface WooAttribute {
  id: number;
  name: string;
  option?: string;
  options?: string[];
  variation?: boolean;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  type: 'simple' | 'variable';
  description?: string;
  short_description?: string;
  images?: { id?: number; src: string; alt?: string }[];
  attributes?: WooAttribute[];
  reviews?: { id: number; author: string; rating: number; content: string }[];
  categories?: { id: number; name: string; slug: string }[];
}

export interface WooVariation {
  id: number;
  price: number;
  attributes: { name: string; option: string }[];
  image?: { src: string; alt?: string };
}

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: Record<string, string | number>;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  type: 'simple' | 'variable';
  images?: { src: string }[];
  categories?: { id: number; name: string; slug: string }[];
  description?: string; // add this
}
