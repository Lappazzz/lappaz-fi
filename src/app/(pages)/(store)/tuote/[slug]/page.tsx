'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api/api';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import ProductPageLoading from '@/_components/productloading/ProductPageLoading';
import Link from 'next/link';

type ProductAttribute = {
  name: string;
  option: string;
};

type ProductVariation = {
  id: number;
  price: string;
  attributes: ProductAttribute[];
};

type ProductImage = {
  src: string;
};

type Product = {
  name: string;
  slug: string;
  type: 'simple' | 'variable';
  price?: string;
  short_description?: string;
  description?: string;
  images: ProductImage[];
  attributes: {
    name: string;
    options: string[];
    variation: boolean;
  }[];
  default_attributes?: ProductAttribute[];
  variations: ProductVariation[];
};

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'kuvaus' | 'lisatiedot' | 'arviot'>('kuvaus');
  const [variation, setVariation] = useState<ProductVariation | null>(null);

  useEffect(() => {
    getProducts().then((products: Product[]) => {
      const found = products.find((p) => p.slug === slug);
      if (!found) return;

      const defaults: Record<string, string> = {};
      found.default_attributes?.forEach((attr) => {
        defaults[attr.name] = attr.option;
      });

      setProduct(found);
      setSelectedOptions(defaults);

      if (found.variations?.length) {
        const matching = found.variations.find((v) =>
          Object.entries(defaults).every(
            ([key, val]) => v.attributes.find((a) => a.name === key)?.option === val
          )
        );
        if (matching) setVariation(matching);
      }
    });
  }, [slug]);

useEffect(() => {
  if (!product || !product.variations?.length) return;

  const matched = product.variations.find((v: any) => {
    return Object.entries(selectedOptions).every(([key, val]) => {
      if (!Array.isArray(v.attributes)) return false;
      return v.attributes.find((a: any) => a.name === key)?.option === val;
    });
  });

  setVariation(matched || null);
}, [selectedOptions, product]);


  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (product?.type === 'variable' && !variation) return;

    console.log('Lisätään ostoskoriin:', {
      product,
      quantity,
      selectedOptions,
      variation,
    });
  };

  if (!product) return <ProductPageLoading />;

  const changeImage = (index: number) => {
    if (index === currentImageIndex) return;
    setFade(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setFade(false);
    }, 300);
  };

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPriceDisplay = () => {
    if (variation?.price) return `${variation.price} €`;

    if (product.type === 'variable' && product.variations?.length) {
      const prices = product.variations
        .map((v) => parseFloat(v.price))
        .filter((price) => !isNaN(price) && Number.isFinite(price));

      if (prices.length === 0) return 'Ei hintaa saatavilla';

      const min = Math.min(...prices);
      const max = Math.max(...prices);

      return min !== max ? `${min} € - ${max} €` : `${min} €`;
    }

    return product.price ? `${product.price} €` : 'Ei hintaa saatavilla';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-sm text-gray-600 mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="text-black hover:underline">
          home
        </Link>

        {(product.categories?.slice().reverse() || []).map((cat, i) => (
          <div key={cat.name} className="flex items-center gap-1">
            <span>&gt;</span>
            <Link href={`/category/${cat.slug || cat.name}`} className="text-black hover:underline">
              {cat.name}
            </Link>
          </div>
        ))}

        <span>&gt;</span>
        <span className="font-medium">{product.name}</span>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="relative">
            <Image
              key={product.images[currentImageIndex]?.src}
              src={product.images[currentImageIndex]?.src || '/images/Tuotekuva-tulossa.webp'}
              alt={product.name}
              width={600}
              height={600}
              className={`w-full object-cover rounded-md transition-opacity duration-300 ${
                fade ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    changeImage(
                      currentImageIndex > 0
                        ? currentImageIndex - 1
                        : product.images.length - 1
                    )
                  }
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 shadow"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    changeImage(
                      currentImageIndex < product.images.length - 1 ? currentImageIndex + 1 : 0
                    )
                  }
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 shadow"
                >
                  →
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4 mt-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.src}
                  alt={`Kuva ${idx + 1}`}
                  width={100}
                  height={100}
                  onClick={() => changeImage(idx)}
                  className={`cursor-pointer rounded-md object-cover w-24 h-24 ${
                    currentImageIndex === idx ? 'ring-2 ring-black' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4">{getPriceDisplay()}</p>

          {product.short_description && (
            <div
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {product.type === 'variable' &&
            product.attributes
              .filter((attr) => attr.variation)
              .map((attr) => (
                <div key={attr.name} className="mb-4">
                  <label className="block mb-1 font-medium">{attr.name}</label>
                  <select
                    value={selectedOptions[attr.name] || ''}
                    onChange={(e) => handleOptionChange(attr.name, e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                  >
                    <option value="">Valitse vaihtoehto</option>
                    {attr.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <button onClick={handleDecrease} className="px-3 py-1 text-lg font-bold">
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center border-l border-r"
              />
              <button onClick={handleIncrease} className="px-3 py-1 text-lg font-bold">
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.type === 'variable' && !variation}
              className={`px-6 py-2 rounded-md text-white ${
                product.type === 'variable'
                  ? variation
                    ? 'bg-black hover:bg-gray-800'
                    : 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              Lisää ostoskoriin
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex gap-6 border-b pb-2 mb-4">
          {(['kuvaus', 'lisatiedot', 'arviot'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`pb-1 ${
                tab === tabKey ? 'border-b-2 border-black font-semibold' : ''
              }`}
            >
              {tabKey === 'kuvaus'
                ? 'Kuvaus'
                : tabKey === 'lisatiedot'
                ? 'Lisätiedot'
                : 'Arviot (0)'}
            </button>
          ))}
        </div>

        {tab === 'kuvaus' && product.description && (
          <div
            className="text-gray-700 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {tab === 'lisatiedot' && (
          <div className="text-gray-600">Ei lisätietoja saatavilla.</div>
        )}

        {tab === 'arviot' && (
          <div className="text-gray-600">Ei arvioita vielä.</div>
        )}
      </div>
    </div>
  );
}
