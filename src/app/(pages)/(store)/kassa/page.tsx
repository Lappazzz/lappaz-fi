'use client';
import { useState, useMemo } from 'react';
import { useCart } from '@/_context/CartContext';
import type { CartItem } from '@/types/woocommerce';
import KlarnaWidget from '@/_components/KlarnaWidget';
import { useRouter } from 'next/navigation';

export default function CheckoutDetailsPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal: '',
    email: '',
    phone: '',
  });

  // orderId poistettu, ei enää käytössä
  const [error, setError] = useState<string | null>(null);

  const VAT_RATE = 25.5;
  const vatAmount = total * (VAT_RATE / (100 + VAT_RATE));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const canUseKlarna = useMemo(
    () =>
      items.length > 0 &&
      formData.name &&
      formData.address &&
      formData.city &&
      formData.postal &&
      formData.email &&
      formData.phone,
    [items.length, formData]
  );

  const klarnaPayload = useMemo(
    () => ({
      items: items.map((item: CartItem) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      customer: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal: formData.postal,
        email: formData.email,
        phone: formData.phone,
      },
    }),
    [items, formData]
  );

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Toimitustiedot</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {['name', 'address', 'city', 'postal', 'email', 'phone'].map(
            (field) => (
              <input
                key={field}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={
                  field === 'postal'
                    ? 'Postinumero'
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                type={field === 'email' ? 'email' : 'text'}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
            )
          )}
        </form>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Maksu</h3>

          <KlarnaWidget
            payload={klarnaPayload}
            disabled={!canUseKlarna}
            onSuccess={async (klarnaOrderId) => {
              try {
                setError(null);

                // 1) luo WooCommerce-tilaus backendin API:n kautta
                const res = await fetch('/api/woocommerce/order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    items: klarnaPayload.items,
                    customer: klarnaPayload.customer,
                    klarna_order_id: klarnaOrderId,
                  }),
                });

                if (!res.ok) {
                  const errJson = (await res.json().catch(() => ({}))) as {
                    error?: string;
                  };
                  throw new Error(
                    errJson.error || 'WooCommerce order failed'
                  );
                }

                const wooOrder: { id: number } = await res.json();

                const wooOrderId = wooOrder.id;

                clearCart();

                router.push(
                  `/tilaus-vahvistus?orderId=${encodeURIComponent(
                    String(wooOrderId)
                  )}&klarnaOrderId=${encodeURIComponent(klarnaOrderId)}`
                );
              } catch (e: unknown) {
                console.error('❌ Checkout Woo error:', e);
                const message =
                  e instanceof Error
                    ? e.message
                    : 'Tilausta ei voitu tallentaa kauppaan.';
                setError(message);
              }
            }}
            onError={(msg) => setError(msg)}
          />

          {!canUseKlarna && (
            <div className="mt-2 text-sm text-gray-600">
              Täytä kaikki toimitustiedot ja varmista, että ostoskorissa on
              tuotteita, jotta voit maksaa Klarnalla.
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded bg-red-100 text-red-800">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Order Summary */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Tilauksen yhteenveto</h2>
        <ul className="space-y-4 mb-4">
          {items.map((item: CartItem) => (
            <li key={item.id} className="flex justify-between">
              <div>
                <div className="font-semibold">{item.name}</div>
                {item.options && Object.keys(item.options).length > 0 && (
                  <ul className="text-sm text-gray-700">
                    {Object.entries(item.options).map(([key, val]) => (
                      <li key={key}>
                        {key}: {val}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="text-gray-800">
                  {item.quantity} × {item.price.toFixed(2)} €
                </div>
              </div>
              <div className="font-semibold">
                {(item.quantity * item.price).toFixed(2)} €
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t pt-4 space-y-1">
          <div className="flex justify-between font-semibold">
            <span>Alv {VAT_RATE}% osuus:</span>
            <span>{vatAmount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Yhteensä:</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
