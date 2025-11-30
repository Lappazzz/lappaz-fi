import type { WooProduct, WooVariation } from '@/types/woocommerce';

const API_URL = process.env.WC_STORE_URL || '';
const WC_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || '';

/**
 * Palauttaa valmiit Authorization-headerit, tai null jos konffit puuttuu.
 */
const getAuthHeaders = (): HeadersInit | null => {
  if (!API_URL) {
    console.error('❌ WC_STORE_URL is not set');
    return null;
  }
  if (!WC_KEY || !WC_SECRET) {
    console.error('❌ WooCommerce credentials missing: WC_CONSUMER_KEY / WC_CONSUMER_SECRET');
    return null;
  }

  const token = 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
  return { Authorization: token };
};

// ---- SEARCH PRODUCTS ----
export const searchProducts = async (query: string): Promise<WooProduct[]> => {
  const q = query.trim();
  if (!q) return [];

  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const url = `${API_URL}/wp-json/wc/v3/products?search=${encodeURIComponent(q)}&per_page=10`;

    const res = await fetch(url, {
      headers,
      cache: 'no-store', // haun kannattaa olla tuore
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ searchProducts error:', res.status, text);
      return [];
    }

    const data: WooProduct[] = await res.json();
    return data;
  } catch (error) {
    console.error('❌ Error searching products:', error);
    return [];
  }
};

// ---- LIST PRODUCTS (PAGINATED) ----
export const getProducts = async (): Promise<WooProduct[]> => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    let allProducts: WooProduct[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const res = await fetch(
        `${API_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}`,
        {
          headers,
          next: { revalidate: 86400 },
        }
      );

      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();

      if (!res.ok) {
        console.error('Woo error status:', res.status, text.slice(0, 500));
        throw new Error('Failed to fetch products');
      }

      if (!contentType.includes('application/json')) {
        console.error('Woo returned non-JSON:', res.status, text.slice(0, 500));
        throw new Error('Woo API did not return JSON');
      }

      const data: WooProduct[] = JSON.parse(text);
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

// ---- SINGLE PRODUCT BY SLUG ----
export async function getProductBySlug(slug: string): Promise<WooProduct | undefined> {
  const headers = getAuthHeaders();
  if (!headers) return undefined;

  try {
    const url = `${API_URL}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}`;

    const res = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ getProductBySlug error for slug "${slug}":`, res.status, text);
      return undefined;
    }

    const data: WooProduct[] = await res.json();
    return data[0];
  } catch (error) {
    console.error('❌ getProductBySlug threw:', error);
    return undefined;
  }
}

// ---- VARIATIONS ----
export async function getProductVariations(productId: number): Promise<WooVariation[]> {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const url = `${API_URL}/wp-json/wc/v3/products/${productId}/variations?per_page=100`;
    const res = await fetch(url, {
      headers,
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ getProductVariations error for ${productId}:`, res.status, text);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('❌ getProductVariations threw:', error);
    return [];
  }
}

export async function getVariationById(
  productId: number,
  variationId: number,
): Promise<WooVariation | null> {
  const headers = getAuthHeaders();
  if (!headers) return null;

  try {
    const url = `${API_URL}/wp-json/wc/v3/products/${productId}/variations/${variationId}`;
    const res = await fetch(url, {
      headers,
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ getVariationById error for ${variationId}:`, res.status, text);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('❌ getVariationById threw:', error);
    return null;
  }
}

export const getPopularProducts = async (limit = 6): Promise<WooProduct[]> => {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const url = `${API_URL}/wp-json/wc/v3/products?per_page=${limit}&orderby=popularity&order=desc`;

    const res = await fetch(url, {
      headers,
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ getPopularProducts error:', res.status, text);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('❌ Error fetching popular products:', error);
    return [];
  }
};
