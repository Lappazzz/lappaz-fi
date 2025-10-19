const authHeader = () => {
  const user = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY!;
  const pass = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET!;
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
};

// Base URL for WooCommerce API
const API_URL = process.env.NEXT_PUBLIC_WC_STORE_URL;

if (!API_URL) {
  throw new Error("❌ NEXT_PUBLIC_WC_STORE_URL is not defined in .env.local");
}

export const getProducts = async () => {
  try {
    let allProducts: any[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const res = await fetch(
        `${API_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}`,
        {
          headers: { Authorization: authHeader() },
          next: { revalidate: 3600 }, // cache 1 hour
        }
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      allProducts = [...allProducts, ...data];

      if (data.length < perPage) break;
      page++;
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  const res = await fetch(`${API_URL}/wp-json/wc/v3/products/${id}`, {
    headers: { Authorization: authHeader() },
    next: { revalidate: 86400 }, // cache 24h
  });

  if (!res.ok) {
    console.error(`Error fetching product ID ${id}`);
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export async function getProductVariations(productId: number) {
  const res = await fetch(
    `${API_URL}/wp-json/wc/v3/products/${productId}/variations?per_page=100`,
    {
      headers: { Authorization: authHeader() },
      next: { revalidate: 86400 }, // cache 24h
    }
  );

  if (!res.ok) throw new Error("Failed to fetch variations");

  return res.json();
}

export const getPopularProducts = async (limit = 6) => {
  try {
    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/products?per_page=${limit}&orderby=popularity&order=desc`,
      {
        headers: { Authorization: authHeader() },
        next: { revalidate: 86400 }, // cache 24h
      }
    );

    if (!res.ok) throw new Error("Failed to fetch popular products");
    return res.json();
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};

export async function getProductBySlug(slug: string) {
  const res = await fetch(
    `${API_URL}/wp-json/wc/v3/products?slug=${slug}`,
    {
      headers: { Authorization: authHeader() },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch product by slug: ${slug}`);

  const data = await res.json();
  return data[0]; // WooCommerce returns an array
}

export async function getVariationById(productId: number, variationId: number) {
  const res = await fetch(
    `${API_URL}/wp-json/wc/v3/products/${productId}/variations/${variationId}`,
    {
      headers: { Authorization: authHeader() },
      next: { revalidate: 86400 }, // cache 24h
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch variation ${variationId}`);

  return res.json();
}
