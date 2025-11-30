import { NextResponse } from 'next/server';
import { createKlarnaOrder } from '@/lib/api/klarna';

type KlarnaCartItem = {
  id: string | number;
  name: string;
  price: number;
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

type KlarnaOrderRequestBody = {
  authorization_token: string;
  items: KlarnaCartItem[];
  customer: KlarnaCustomer;
  vatRatePercent: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as KlarnaOrderRequestBody;
    const { authorization_token, items, customer, vatRatePercent } = body;

    const order = await createKlarnaOrder(authorization_token, {
      items,
      customer,
      vatRatePercent,
    });

    return NextResponse.json(order);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Klarna order failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
