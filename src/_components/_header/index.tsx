'use client';
import { useMemo, useState, useCallback } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import CartPopup from './CartPopup';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { items, total, showPopup, togglePopup } = useCart();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const navLinks = useMemo(() => ([
    { href: '/', label: 'ETUSIVU' },
    { href: '/kaikki-tuotteet', label: 'KAIKKI TUOTTEET' },
    { href: '/sim-racing-modit', label: 'SIM MODIT' },
    { href: '/autotarvikkeet', label: 'AUTOTARVIKKEET' },
    { href: '/about-us', label: 'TIETOA MEISTÄ' },
  ]), []);

  return (
    <header className="bg-neutral-800 text-white p-4 lg:px-6 relative sticky top-0 z-40">
      <div className="flex justify-between items-center pb-4">
        <Link href="/" className="flex items-center">
          <Image src="/Lappaz-logo-long.webp" alt="Logo" width={160} height={40} className="hidden lg:block" />
          <Image src="/Lappaz-logo-512.webp" alt="Logo" width={60} height={60} className="lg:hidden" />
        </Link>

        <form onSubmit={e => e.preventDefault()} className="relative flex items-center w-full lg:w-2/5 mx-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-lg bg-neutral-700 text-white w-full pl-10 focus:outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute left-3 text-white"><FaSearch /></button>
        </form>

        <div className="flex items-center gap-3 relative">
          <FaUser className="cursor-pointer text-xl" />
          <div className="relative cursor-pointer" onClick={() => togglePopup()}>
            <FaShoppingCart className="text-xl mt-1" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full px-1">
                {items.length}
              </span>
            )}
            {showPopup && <CartPopup />}
          </div>
          <span className="hidden lg:block font-bold">{total.toFixed(2)} €</span>

          <button className="lg:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>
      </div>

      <div className="lg:flex justify-center">
        <DesktopMenu navLinks={navLinks} openDropdowns={openDropdowns} toggleDropdown={toggleDropdown} />
      </div>

      <MobileMenu navLinks={navLinks} menuOpen={menuOpen} setMenuOpen={setMenuOpen} openDropdowns={openDropdowns} toggleDropdown={toggleDropdown} />
    </header>
  );
}
