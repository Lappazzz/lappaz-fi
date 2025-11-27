// src/app/api/products/search/route.ts
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_WC_STORE_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET!;

const authHeader = () =>
  'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `${API_URL}/wp-json/wc/v3/products?search=${encodeURIComponent(
        q
      )}&per_page=20`,
      {
        headers: { Authorization: authHeader() },
        // server only, so we can cache if we want
        next: { revalidate: 6000 },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('Woo search failed:', res.status, text);
      return NextResponse.json([], { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Woo search error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
