'use client';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import CartPopup from './CartPopup';
import SearchBar from './SearchBar';
import { useCart } from '@/_context/CartContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, total, showPopup, togglePopup } = useCart();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const cartRef = useRef<HTMLDivElement>(null);

  /** ---- MENU LINKS ---- **/
  const navLinks = useMemo(
    () => [
      { href: '/', label: 'ETUSIVU' },
      { href: '/kaikki-tuotteet', label: 'KAIKKI TUOTTEET' },
      { href: '/sim-racing-modit', label: 'SIM MODIT' },
      { href: '/autotarvikkeet', label: 'AUTOTARVIKKEET' },
      { href: '/about-us', label: 'TIETOA MEISTÄ' },
    ],
    []
  );

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  }, []);

  /** ---- CLOSE CART ON OUTSIDE CLICK ---- **/
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        togglePopup(false); // explicit boolean, OK for your signature
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [togglePopup]);

  return (
    <header className="bg-neutral-800 text-white p-4 lg:px-6 relative sticky top-0 z-40">
      <div className="flex justify-between items-center pb-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Lappaz-logo-long.webp"
            alt="Logo"
            width={160}
            height={40}
            className="hidden lg:block"
          />
          <Image
            src="/Lappaz-logo-512.webp"
            alt="Logo"
            width={60}
            height={60}
            className="lg:hidden"
          />
        </Link>

        {/* ---- SEARCH ---- */}
        <SearchBar />

        {/* ---- CART + MENU ---- */}
        <div className="flex items-center gap-3 relative" ref={cartRef}>
          <button
            type="button"
            className="relative cursor-pointer"
            onClick={() => togglePopup()}
            aria-label="Ostoskori"
          >
            <FaShoppingCart className="text-xl mt-1" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full px-1">
                {items.length}
              </span>
            )}
          </button>

          {showPopup && <CartPopup />}

          <span className="hidden lg:block font-bold">{total.toFixed(2)} €</span>

          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Avaa valikko"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ---- NAVIGATION ---- */}
      <div className="lg:flex justify-center">
        <DesktopMenu
          navLinks={navLinks}
          openDropdowns={openDropdowns}
          toggleDropdown={toggleDropdown}
        />
      </div>

      <MobileMenu
        navLinks={navLinks}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        openDropdowns={openDropdowns}
        toggleDropdown={toggleDropdown}
      />
    </header>
  );
}
