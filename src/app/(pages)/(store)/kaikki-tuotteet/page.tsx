"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/api";
import Image from "next/image";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {loading ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <li key={index} className="border rounded-lg p-4 shadow-md flex flex-col items-center animate-pulse">
              <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
              <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
              <div className="w-1/2 h-5 bg-gray-300 rounded"></div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <li key={product.id} className="border rounded-lg p-4 shadow-md flex flex-col items-center">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[0].src
                    : "/images/Tuotekuva-tulossa.webp"
                }
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-md mb-4"
                loading="lazy"
                priority={false}
              />
              <h2 className="text-xl font-semibold text-center">{product.name}</h2>
              <p className="text-lg text-gray-700">{product.price} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;