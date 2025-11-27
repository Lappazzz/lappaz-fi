'use client';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import type { WooProduct } from '@/types/woocommerce';
import { getProducts } from '@/lib/api/api';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WooProduct[]>([]);
  const [allProducts, setAllProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  /** Load all products once */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const products = await getProducts();
        if (mounted) setAllProducts(products);
      } catch (err) {
        console.error('❌ Product preload failed:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /** Disable body scroll when search is active */
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  /** Debounced local search */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      if (q.length > 1 && allProducts.length) {
        setLoading(true);
        const results = allProducts.filter(p => p.name.toLowerCase().includes(q));
        setSearchResults(results);
        setLoading(false);
      } else {
        setSearchResults([]);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, allProducts]);

  /** Click outside closes search */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** Dynamic height */
  const containerHeight = Math.min(500, Math.max(150, searchResults.length * 70));

  return (
    <>
      {/* Overlay for blur + disable interaction */}
      {active && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 cursor-pointer"
          onClick={() => setActive(false)}
        />
      )}

      {/* Search container */}
      <div
        ref={searchRef}
        className="relative flex items-center w-full lg:w-2/5 mx-2 z-50"
      >
        <input
          type="text"
          placeholder="Hae tuotteita..."
          className="px-4 py-2 rounded-lg bg-neutral-700 text-white w-full pl-10 focus:outline-none"
          value={searchQuery}
          onFocus={() => setActive(true)}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute left-3 text-white" />

        {active && (
          <div
            className="absolute top-full left-0 w-full bg-neutral-700 border border-neutral-600 rounded-lg mt-1 overflow-auto z-50 transition-all"
            style={{ maxHeight: `${containerHeight}px` }}
          >
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <FaSpinner className="animate-spin text-gray-300 text-lg" />
              </div>
            ) : searchQuery.length <= 1 ? (
              <div className="p-3 text-center text-gray-300">Kirjoita vähintään 2 merkkiä</div>
            ) : searchResults.length > 0 ? (
              searchResults.map(product => (
                <Link
                  key={product.id}
                  href={`/tuote/${product.slug}`}
                  className="flex items-center gap-3 p-2 hover:bg-neutral-600 transition"
                  onClick={() => {
                    setSearchQuery('');
                    setActive(false);
                  }}
                >
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0].src}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="truncate">{product.name}</span>
                    <span className="text-sm text-gray-300">{product.price} €</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-3 text-center text-gray-300">
                Haulla ei löytynyt tuotteita
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
