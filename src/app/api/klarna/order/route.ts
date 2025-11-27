import { NextResponse } from 'next/server';
import { createKlarnaOrder } from '@/lib/api/klarna';

type KlarnaOrderRequestBody = {
  authorization_token: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as KlarnaOrderRequestBody;
    const { authorization_token } = body;

    const order = await createKlarnaOrder(authorization_token);
    return NextResponse.json(order);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Klarna order failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
