'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { WooProduct, WooVariation } from '@/types/woocommerce';

interface ProductDetailsClientProps {
  product: WooProduct;
  variations?: WooVariation[];
}

export default function ProductDetailsClient({ product, variations = [] }: ProductDetailsClientProps) {
  const [selectedVariation, setSelectedVariation] = useState<WooVariation | null>(variations[0] || null);
  const [quantity, setQuantity] = useState(1);

  const price = selectedVariation
    ? selectedVariation.price
    : parseFloat(String(product.price));

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(prev + delta, 1));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Image
            src={selectedVariation?.image?.src || product.images?.[0]?.src || '/images/Tuotekuva-tulossa.webp'}
            alt={selectedVariation?.image?.alt || product.images?.[0]?.alt || product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <p className="text-xl font-semibold">{price.toFixed(2)} €</p>

          {variations.length > 0 && (
            <div>
              <label className="block font-medium mb-1">Valitse variaatio:</label>
              <select
                className="border px-3 py-2 rounded-md w-full"
                value={selectedVariation?.id || ''}
                onChange={e => {
                  const v = variations.find(v => v.id === Number(e.target.value));
                  setSelectedVariation(v || null);
                }}
              >
                {variations.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.attributes.map(attr => `${attr.name}: ${attr.option}`).join(', ')} – {v.price.toFixed(2)} €
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>

          <button className="mt-4 px-6 py-2 bg-black text-white rounded-md">
            Lisää ostoskoriin
          </button>
        </div>
      </div>

      {product.description && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Kuvaus</h2>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
}
