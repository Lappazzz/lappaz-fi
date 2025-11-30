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

/**
 * Turvallinen JSON-parseri: loggaa virheet, palauttaa null jos jotain menee pieleen.
 */
async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!res.ok) {
    console.error('❌ Woo error:', res.status, text.slice(0, 500));
    return null;
  }

  if (!contentType.includes('application/json')) {
    console.error(
      '❌ Woo returned non-JSON:',
      res.status,
      contentType,
      text.slice(0, 500),
    );
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error('❌ JSON parse failed:', err, text.slice(0, 500));
    return null;
  }
}

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

    const data = await parseJsonSafe<WooProduct[]>(res);
    return data ?? [];
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
      const url = `${API_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}`;
      console.log('Fetching products from:', url);

      const res = await fetch(url, {
        headers,
        next: { revalidate: 86400 },
      });

      const data = await parseJsonSafe<WooProduct[]>(res);
      if (!data) {
        // Jos joku sivu epäonnistuu, palautetaan mitä on ehditty hakea
        return allProducts;
      }

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

    const data = await parseJsonSafe<WooProduct[]>(res);
    if (!data || data.length === 0) return undefined;

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

    const data = await parseJsonSafe<WooVariation[]>(res);
    return data ?? [];
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

    const data = await parseJsonSafe<WooVariation>(res);
    return data ?? null;
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

    const data = await parseJsonSafe<WooProduct[]>(res);
    return data ?? [];
  } catch (error) {
    console.error('❌ Error fetching popular products:', error);
    return [];
  }
};
