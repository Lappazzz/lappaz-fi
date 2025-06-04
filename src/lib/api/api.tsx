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
