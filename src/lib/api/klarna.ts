const KLARNA_KEY = process.env.KLARNA_KEY!;
const KLARNA_SECRET = process.env.KLARNA_SECRET!;

const KLARNA_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://api.klarna.com'
    : 'https://api.playground.klarna.com';

const auth =
  'Basic ' + Buffer.from(`${KLARNA_KEY}:${KLARNA_SECRET}`).toString('base64');

const toCents = (v: number) => Math.round(v * 100);

type KlarnaCartItem = {
  id: string | number;
  name: string;
  price: number;   // euros
  quantity: number;
};

type KlarnaCustomer = {
  name: string;
  address: string;
  city: string;
  postal: string;
  email: string;
  phone: string;
};

export async function createKpSession(params: {
  items: KlarnaCartItem[];
  customer: KlarnaCustomer;
  vatRatePercent: number;
}) {
  const { items, customer, vatRatePercent } = params;

  const taxRate = Math.round(vatRatePercent * 100); // 25.5 -> 2550

  const order_lines = items.map((i) => {
    const unit_price = toCents(i.price);
    const total_amount = unit_price * i.quantity;
    const tax_amount =
      total_amount - Math.round(total_amount / (1 + vatRatePercent / 100));

    return {
      type: 'physical',
      reference: String(i.id),
      name: i.name,
      quantity: i.quantity,
      unit_price,
      total_amount,
      total_tax_amount: tax_amount,
      tax_rate: taxRate,
    };
  });

  const order_amount = order_lines.reduce((s, l) => s + l.total_amount, 0);
  const order_tax_amount = order_lines.reduce(
    (s, l) => s + l.total_tax_amount,
    0
  );

  const kp_body = {
    purchase_country: 'FI',
    purchase_currency: 'EUR',
    locale: 'fi-FI',
    order_amount,
    order_tax_amount,
    order_lines,
    billing_address: {
      given_name: customer.name,
      street_address: customer.address,
      postal_code: customer.postal,
      city: customer.city,
      email: customer.email,
      phone: customer.phone,
      country: 'FI',
    },
  };

  const kp_res = await fetch(`${KLARNA_BASE}/payments/v1/sessions`, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(kp_body),
  });

  const kp_text = await kp_res.text();
  if (!kp_res.ok) {
    throw new Error(`KP session error: ${kp_text}`);
  }

  const kp_json = JSON.parse(kp_text);
  // This contains client_token used on frontend
  return {
    client_token: kp_json.client_token as string,
    session_id: kp_json.session_id as string,
  };
}

export async function createKlarnaOrder(authorization_token: string) {
  // Here you finalize the order after authorize()
  const res = await fetch(
    `${KLARNA_BASE}/payments/v1/authorizations/${authorization_token}/order`,
    {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // use session data
    }
  );

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Create order error: ${text}`);
  }
  return JSON.parse(text); // contains order_id etc.
}
