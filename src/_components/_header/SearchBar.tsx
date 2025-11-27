'use client';

import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import type { WooProduct } from '@/types/woocommerce';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchActive(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Disable scroll + blur background when active
  useEffect(() => {
    if (searchActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchActive]);

  // Debounced fetch to /api/products/search
  useEffect(() => {
    if (!searchActive) return;

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        if (!res.ok) {
          setSearchResults([]);
        } else {
          const data: WooProduct[] = await res.json();
          setSearchResults(data);
        }
      } catch (e) {
        console.error('Search error:', e);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, searchActive]);

  const showDropdown = searchActive && (loading || searchQuery.trim().length >= 2);

  return (
    <>
      {/* Background overlay for blur + click-to-close */}
      {searchActive && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSearchActive(false)}
        />
      )}

      <div
        ref={containerRef}
        className="relative flex items-center w-full lg:w-2/5 mx-2 z-40"
      >
        <input
          type="text"
          placeholder="Hae tuotteita..."
          className="px-4 py-2 rounded-lg bg-neutral-700 text-white w-full pl-10 focus:outline-none"
          value={searchQuery}
          onFocus={() => setSearchActive(true)}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute left-3 text-white" />

        {showDropdown && (
          <div className="absolute top-full left-0 w-full bg-neutral-700 border border-neutral-600 rounded-lg mt-1 max-h-96 overflow-auto shadow-lg">
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <FaSpinner className="animate-spin text-gray-300 text-lg" />
              </div>
            ) : searchQuery.trim().length < 2 ? (
              <div className="p-3 text-center text-gray-300">
                Kirjoita vähintään 2 merkkiä
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map(product => (
                <Link
                  key={product.id}
                  href={`/tuote/${product.slug}`}
                  className="flex items-center gap-3 p-2 hover:bg-neutral-600 transition"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchActive(false);
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
                    {product.price && (
                      <span className="text-sm text-gray-300">
                        {product.price} €
                      </span>
                    )}
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
