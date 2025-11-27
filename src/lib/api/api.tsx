import type { WooProduct, WooVariation } from '@/types/woocommerce';

const authHeader = (): string => {
  const user = process.env.WC_CONSUMER_KEY!;
  const pass = process.env.WC_CONSUMER_SECRET!;
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
};

const API_URL = process.env.WC_STORE_URL;

if (!API_URL) {
  throw new Error('❌ NEXT_PUBLIC_WC_STORE_URL is not defined in .env.local');
}
// Search products by query
export const searchProducts = async (query: string): Promise<WooProduct[]> => {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/products?search=${encodeURIComponent(query)}&per_page=10`,
      {
        headers: { Authorization: authHeader() },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const getProducts = async (): Promise<WooProduct[]> => {
  try {
    let allProducts: WooProduct[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const res = await fetch(
        `${API_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}`,
        {
          headers: { Authorization: authHeader() },
          next: { revalidate: 86400 },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch products');

      const data: WooProduct[] = await res.json();
      allProducts = [...allProducts, ...data];

      if (data.length < perPage) break;
      page++;
    }

    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export async function getProductBySlug(slug: string): Promise<WooProduct | undefined> {
  const res = await fetch(`${API_URL}/wp-json/wc/v3/products?slug=${slug}`, {
    headers: { Authorization: authHeader() },
    next: { revalidate: 86400 },
  });

  if (!res.ok) throw new Error(`Failed to fetch product by slug: ${slug}`);

  const data: WooProduct[] = await res.json();
  return data[0];
}


export async function getProductVariations(productId: number): Promise<WooVariation[]> {
  const res = await fetch(
    `${API_URL}/wp-json/wc/v3/products/${productId}/variations?per_page=100`,
    {
      headers: { Authorization: authHeader() },
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch variations');
  return res.json();
}

export async function getVariationById(productId: number, variationId: number): Promise<WooVariation> {
  const res = await fetch(
    `${API_URL}/wp-json/wc/v3/products/${productId}/variations/${variationId}`,
    {
      headers: { Authorization: authHeader() },
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch variation ${variationId}`);
  return res.json();
}

export const getPopularProducts = async (limit = 6): Promise<WooProduct[]> => {
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/products?per_page=${limit}&orderby=popularity&order=desc`,
      {
        headers: { Authorization: authHeader() },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) throw new Error('Failed to fetch popular products');
    return res.json();
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
};