import { NextResponse } from 'next/server';
import { createKpSession } from '@/lib/api/klarna';

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

type KlarnaSessionRequestBody = {
  items: KlarnaCartItem[];
  customer: KlarnaCustomer;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as KlarnaSessionRequestBody;
    const { items, customer } = body;

    const result = await createKpSession({
      items,
      customer,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Klarna session failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
