'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/lib/api/api';
import ProductLoading from '@/_components/productloading/ProductLoading';
import Image from 'next/image';

export default function MainCategoryPage() {
  const params = useParams();
  const mainCategory = params.mainCategory as string;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      const filtered = data.filter((product) =>
        product.categories?.some((cat) => cat.slug === mainCategory)
      );
      setProducts(filtered);
      setLoading(false);
    });
  }, [mainCategory]);

  const toTitle = (slug: string | undefined) =>
    slug?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ?? '';

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{toTitle(mainCategory)}</h1>

      {loading ? (
        <ProductLoading />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <li
              key={product.id}
              className="border rounded-lg shadow-md cursor-pointer overflow-hidden transition-shadow duration-200 hover:shadow-lg"
            >
              <Link
                href={`/tuote/${product.slug}`}
                className="flex flex-col items-center p-4"
              >
                <Image
                  src={product.images?.[0]?.src || '/images/Tuotekuva-tulossa.webp'}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-center">{product.name}</h2>
                <p className="text-lg text-gray-700">{product.price} €</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
