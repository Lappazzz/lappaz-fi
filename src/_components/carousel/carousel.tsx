'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Category = {
    name: string;
    image: string;
    slug: string; // used for URL
};

interface CarouselProps {
    categories: Category[];
}

export default function Carousel({ categories }: CarouselProps) {
    const [index, setIndex] = useState(0);
    const router = useRouter();

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % categories.length);
    };

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + categories.length) % categories.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
        nextSlide();
        }, 8000); // 8 seconds
        return () => clearInterval(timer);
    }, [categories.length]);

    return (
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
        {categories.map((category, i) => (
            <div
            key={category.slug}
            className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={i !== index}
            >
            <Image
                src={category.image}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                priority={false}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
                <h2 className="text-3xl font-bold mb-4">{category.name}</h2>
                <button
                onClick={() => router.push(`/tuotteet/${category.slug}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
                >
                Näytä tuotteet
                </button>
            </div>
            </div>
        ))}

        {/* Prev / Next Buttons */}
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
