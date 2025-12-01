'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Category = {
  name: string;
  image: string;
  slug: string;
};

interface CarouselProps {
  categories: Category[];
}

export default function Carousel({ categories }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % categories.length);
  }, [categories.length]);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const activeCategory = categories[index];
  const isFirst = index === 0;

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <Image
        key={activeCategory.slug}
        src={activeCategory.image}
        alt={activeCategory.name}
        fill
        className="rounded-lg object-cover"
        // Mobiilissa 100vw, muuten noin 721px leveys (Lighthousein mukaan)
        sizes="(max-width: 768px) 100vw, 721px"
        priority={isFirst}
        fetchPriority={isFirst ? 'high' : 'auto'}
        loading={isFirst ? 'eager' : 'lazy'}
      />

      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">{activeCategory.name}</h2>
        <button
          onClick={() => router.push(`/tuotteet/${activeCategory.slug}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
        >
          Näytä tuotteet
        </button>
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 text-black z-20"
        aria-label="Previous slide"
      >
        &#10094;
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 text-black z-20"
        aria-label="Next slide"
      >
        &#10095;
      </button>
    </div>
  );
}
