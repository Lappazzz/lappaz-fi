// src/app/api/woocommerce/order/route.ts
import { NextResponse } from 'next/server';
import { createWooOrder } from '@/lib/api/wooOrders';
import type { KlarnaCartItem, KlarnaCustomer } from '@/lib/api/klarna';

type WooOrderRequestBody = {
  items: KlarnaCartItem[];
  customer: KlarnaCustomer;
  klarna_order_id: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WooOrderRequestBody;
    const { items, customer, klarna_order_id } = body;

    if (!klarna_order_id) {
      return NextResponse.json(
        { error: 'Missing klarna_order_id' },
        { status: 400 }
      );
    }

    const order = await createWooOrder({
      items,
      customer,
      klarna_order_id,
    });

    return NextResponse.json(order);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'WooCommerce order failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
