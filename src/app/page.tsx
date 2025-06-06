'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Carousel from '../_components/carousel/carousel';
import { getPopularProducts } from '@/lib/api/api';

export default function Home() {
  const categoryImages = [
    { name: 'Autotarvikkeet', image: '/images/autotarvikkeet.webp', slug: 'autotarvikkeet' },
    { name: 'Sim modit', image: '/images/sim-modit.webp', slug: 'sim-racing-modit' },
    { name: 'Lisämittaritelineet', image: '/images/lisämittaritelineet.webp', slug: 'lisamittaritelineet' },
  ];

  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularProducts().then((data) => {
      setPopularProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-8 space-y-16">
      {/* Carousel section*/}
      <section className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Tuotekategoriat</h2>
        <Carousel categories={categoryImages} />
      </section>

      {/* Myydyimmät (most bought) */}
      <section className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Myydyimmät</h2>
        {loading ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <li key={index} className="border rounded-lg p-4 shadow-md flex flex-col items-center animate-pulse">
                <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
                <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
                <div className="w-1/2 h-5 bg-gray-300 rounded"></div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((product: any) => (
              <li key={product.id} className="border rounded-lg p-4 shadow-md flex flex-col items-center">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].src
                      : '/images/Tuotekuva-tulossa.webp'
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-md mb-4"
                  loading="lazy"
                />
                <h2 className="text-xl font-semibold text-center">{product.name}</h2>
                <p className="text-lg text-gray-700">{product.price} €</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
