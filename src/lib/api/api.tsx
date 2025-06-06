import axios from "axios";

export const getProducts = async () => {
  try {
    let allProducts = [];
    let page = 1;
    const perPage = 100; // Set the number of products per page (up to 100 per request in WooCommerce)

    while (true) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WC_STORE_URL}/wp-json/wc/v3/products`,
        {
          params: {
            per_page: perPage,
            page: page,
          },
          auth: {
            username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY!,
            password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET!,
          },
        }
      );
      
      // Add the fetched products to the array
      allProducts = [...allProducts, ...response.data];

      // If the number of products returned is less than perPage, it means it's the last page
      if (response.data.length < perPage) {
        break;
      }

      // Otherwise, fetch the next page
      page++;
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_STORE_URL}/wp-json/wc/v3/products/${id}`,
      {
        auth: {
          username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY!,
          password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET!,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching product ID ${id}:`, error);
    throw new Error("Failed to fetch product");
  }
};

// in api.ts
export async function getProductVariations(productId: number) {
  const res = await fetch(
    `${process.env.WC_API_URL}/wp-json/wc/v3/products/${productId}/variations?per_page=100`,
    {
      headers: {
        Authorization: `Basic ${process.env.WC_API_AUTH}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch variations');
  }

  return res.json();
}


export const getPopularProducts = async (limit = 6) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_STORE_URL}/wp-json/wc/v3/products`,
      {
        params: {
          per_page: limit,
          orderby: 'popularity',
          order: 'desc',
        },
        auth: {
          username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY!,
          password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET!,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};
