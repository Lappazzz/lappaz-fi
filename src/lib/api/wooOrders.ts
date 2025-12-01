import type { KlarnaCartItem, KlarnaCustomer } from '@/lib/api/klarna';

const API_URL = process.env.WC_STORE_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;

const authHeader = () =>
  'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

export type WooOrderCreateInput = {
  items: KlarnaCartItem[];
  customer: KlarnaCustomer;
  klarna_order_id: string;
};

type WooOrderResponse = {
  id: number;
  [key: string]: unknown;
};

export async function createWooOrder(
  input: WooOrderCreateInput
): Promise<WooOrderResponse> {
  const { items, customer, klarna_order_id } = input;

  const line_items = items.map((i) => ({
    product_id: Number(i.id),
    quantity: i.quantity,
    total: i.price.toFixed(2),
  }));

  const body = {
    payment_method: 'klarna',
    payment_method_title: 'Klarna',
    set_paid: true,

    billing: {
      first_name: customer.name,
      last_name: '',
      address_1: customer.address,
      address_2: '',
      city: customer.city,
      postcode: customer.postal,
      country: 'FI',
      email: customer.email,
      phone: customer.phone,
    },
    shipping: {
      first_name: customer.name,
      last_name: '',
      address_1: customer.address,
      address_2: '',
      city: customer.city,
      postcode: customer.postal,
      country: 'FI',
    },

    line_items,
    meta_data: [
      {
        key: '_klarna_order_id',
        value: klarna_order_id,
      },
    ],
  };

  const res = await fetch(`${API_URL}/wp-json/wc/v3/orders`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('❌ Woo order create failed:', res.status, text);
    throw new Error(`Woo order create failed: ${res.status} ${text}`);
  }

  return JSON.parse(text) as WooOrderResponse;
}
