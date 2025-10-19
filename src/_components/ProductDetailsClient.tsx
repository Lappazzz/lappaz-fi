'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductDetailsClient({ product, variations }: any) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [localReviews, setLocalReviews] = useState(product.reviews || []);

  // Set default variation options
  useEffect(() => {
    if (product.type === 'variable') {
      const defaults: Record<string, string> = {};
      (product.attributes || []).forEach((attr: any) => {
        if (attr.variation && attr.options.length > 0) {
          defaults[attr.name] = attr.options[0];
        }
      });
      setSelectedOptions(defaults);
    }
  }, [product]);

  // Update selected variation when options change
  useEffect(() => {
    if (product.type === 'variable' && variations?.length) {
      const found = variations.find((v: any) =>
        Object.entries(selectedOptions).every(([key, val]) =>
          v.attributes?.some((a: any) => a.name === key && a.option === val)
        )
      );
      setSelectedVariation(found || null);
    }
  }, [selectedOptions, variations]);

  const getPriceDisplay = () => {
    if (product.type === 'variable' && variations?.length) {
      if (selectedVariation) {
        const price = parseFloat(selectedVariation.price);
        return !isNaN(price) ? `${price.toFixed(2)} €` : 'Hinta ei saatavilla';
      }

      const prices = variations
        .map(v => parseFloat(v.price))
        .filter(p => !isNaN(p))
        .sort((a, b) => a - b);

      if (!prices.length) return 'Hinta ei saatavilla';
      if (prices[0] === prices[prices.length - 1]) return `${prices[0].toFixed(2)} €`;
      return `${prices[0].toFixed(2)} - ${prices[prices.length - 1].toFixed(2)} €`;
    }

    const price = parseFloat(product.price);
    return !isNaN(price) ? `${price.toFixed(2)} €` : 'Hinta ei saatavilla';
  };

  const handleAddToCart = () => {
    if (product.type === 'variable' && !selectedVariation) return;

    addItem({
      id: selectedVariation?.id || product.id,
      name: product.name,
      price: parseFloat(selectedVariation?.price || product.price || 0),
      quantity,
      options: selectedOptions,
    });
  };

  const canAddToCart = product.type === 'variable' ? !!selectedVariation : true;

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <Image
            src={product.images?.[currentImageIndex]?.src || '/images/Tuotekuva-tulossa.webp'}
            width={600}
            height={600}
            alt={product.name}
            className="w-full object-cover rounded-md"
          />
          <div className="flex gap-4 mt-4 overflow-x-auto">
            {product.images?.map((img: any, idx: number) => (
              <Image
                key={idx}
                src={img.src}
                width={100}
                height={100}
                alt={`Kuva ${idx + 1}`}
                className="cursor-pointer w-24 h-24 rounded-md object-cover"
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4">{getPriceDisplay()}</p>

          {product.short_description && (
            <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: product.short_description }} />
          )}

          {/* Variation selectors */}
          {product.type === 'variable' && product.attributes.some((a: any) => a.variation) && (
            <div className="space-y-4 mb-6">
              {product.attributes
                .filter((attr: any) => attr.variation)
                .map((attr: any) => (
                  <div key={attr.name}>
                    <label className="block mb-1 font-medium">{attr.name}</label>
                    <ul className="flex gap-2 flex-wrap">
                      {attr.options.map((opt: string) => (
                        <li
                          key={opt}
                          className={`px-3 py-1 border rounded-md cursor-pointer ${
                            selectedOptions[attr.name] === opt ? 'bg-black text-white' : 'bg-gray-100'
                          }`}
                          onClick={() => setSelectedOptions({ ...selectedOptions, [attr.name]: opt })}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border">-</button>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border"
            />
            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border">+</button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`px-6 py-2 rounded-md text-white ${canAddToCart ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Lisää ostoskoriin
          </button>
        </div>
      </div>

      {/* Description, Details, Reviews */}
      <div className="mt-12 space-y-6">
        {product.description && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Kuvaus</h2>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-2">Lisätiedot</h2>
          {product.attributes?.filter((a: any) => !a.variation).length > 0 ? (
            <ul className="list-disc ml-6">
              {product.attributes
                .filter((a: any) => !a.variation)
                .map((a: any) => (
                  <li key={a.name}><strong>{a.name}:</strong> {a.options.join(', ')}</li>
                ))}
            </ul>
          ) : (
            <div>Ei lisätietoja saatavilla.</div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Arviot</h2>
          {localReviews.length ? (
            <ul className="space-y-4 mb-6">
              {localReviews.map((rev: any) => (
                <li key={rev.id} className="border rounded-md p-4 bg-gray-50">
                  <div className="font-semibold">{rev.author}</div>
                  <div>{'★'.repeat(rev.rating)}</div>
                  <div>{rev.content}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-6">Ei arvioita vielä.</div>
          )}
        </div>
      </div>
    </div>
  );
}
