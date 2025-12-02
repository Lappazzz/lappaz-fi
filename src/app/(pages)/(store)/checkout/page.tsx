'use client';
import { useCart } from '@/_context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import type { CartItem } from '@/types/woocommerce';

export default function CheckoutPage() {
  const { items, total, removeItem, updateItemQuantity } = useCart();

  const VAT_RATE = 25.5;
  const vatAmount = total * (VAT_RATE / (100 + VAT_RATE));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Ostoskori on tyhjä</h1>
        <Link href="/" className="px-6 py-2 bg-black text-white rounded-md">
          Palaa kauppaan
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ostoskori</h1>

      <ul className="space-y-4 mb-6">
        {items.map((item: CartItem) => {
          const options = item.options as Record<string, string> | undefined;

          return (
            <li
              key={`${item.id}-${JSON.stringify(item.options)}`}
              className="border rounded-md p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="rounded-md object-cover"
                  />
                )}

                <div>
                  <div className="font-semibold">{item.name}</div>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <ul className="text-sm text-gray-700 mt-1">
                      {Object.entries(item.options).map(([key, val]) => (
                        <li key={key}>
                          {key}: {val}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center gap-2 mt-2 text-gray-800">
                    <button
                      className="px-2 py-1 border rounded-md"
                      onClick={() =>
                        updateItemQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1),
                          options
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 py-1 border rounded-md"
                      onClick={() =>
                        updateItemQuantity(
                          item.id,
                          item.quantity + 1,
                          options
                        )
                      }
                    >
                      +
                    </button>
                    <span>= {(item.quantity * item.price).toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id, options)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Poista
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mb-6 text-right space-y-1">
        <div className="text-xl font-bold">
          Arvioitu kokonaissumma: {total.toFixed(2)} €
        </div>
        <div className="text-gray-700 text-sm">
          Sisältäen {vatAmount.toFixed(2)} € alv {VAT_RATE}%
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link href="/kassa" className="px-6 py-2 bg-black text-white rounded-md">
          Siirry kassalle
        </Link>
      </div>
    </div>
  );
}
