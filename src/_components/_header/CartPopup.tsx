'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

export default function CartPopup() {
  const { items, total, removeItem, clearCart, showPopup } = useCart();

  if (!showPopup) return null;

  return (
    <div className="absolute top-12 right-0 w-80 bg-white text-black shadow-lg p-4 rounded-md z-50">
      {items.length === 0 ? (
        <div className="flex items-center gap-2">
          <FaShoppingCart /> Ostoskori on tyhjä
        </div>
      ) : (
        <>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FaShoppingCart /> Ostoskori
          </h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item, idx) => (
              <li key={`${item.id}-${idx}`} className="flex justify-between items-center border-b pb-1">
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <div className="text-sm text-gray-600">
                      {Object.entries(item.options).map(([key, val]) => `${key}: ${val}`).join(', ')}
                    </div>
                  )}
                  <div className="text-sm">{item.quantity} × {item.price.toFixed(2)} €</div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">X</button>
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold">Yhteensä: {total.toFixed(2)} €</div>
          <Link href="/checkout">
            <button className="mt-2 w-full bg-black text-white py-2 rounded-md">Siirry kassalle</button>
          </Link>
          <button onClick={clearCart} className="mt-2 w-full bg-gray-200 text-black py-1 rounded-md">Tyhjennä kori</button>
        </>
      )}
    </div>
  );
}
