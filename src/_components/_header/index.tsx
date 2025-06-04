"use client";

import React, { useState } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [cartItems, setCartItems] = useState(4);
  const [totalPrice, setTotalPrice] = useState(83.96);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "ETUSIVU" },
    { href: "/kaikki-tuotteet", label: "KAIKKI TUOTTEET" },
    {
      label: "SIM MODIT",
      href: "/sim-racing-modit",
      subLinks: [
        { href: "/sim-racing-modit/", label: "Kaikki sim modit" },
        { href: "/sim-racing-modit/logitech", label: "Logitech modit" },
        { href: "/sim-racing-modit/thrustmaster", label: "Thrustmaster modit" },
        { href: "/sim-racing-modit/moza", label: "Moza modit" },
      ],
    },
    {
      label: "AUTOTARVIKKEET",
      href: "/autotarvikkeet",
      subLinks: [
        { href: "/autotarvikkeet/", label: "Kaikki autotarvikkeet" },
        { label: "Mercedes", href: "/autotarvikkeet/mercedes" },
        { label: "Toyota", href: "/autotarvikkeet/toyota" },
      ],
    },
    { href: "/about-us", label: "TIETOA MEISTÄ" },
  ];

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-neutral-800 text-white p-4 lg:px-6">
      {/* Top Section: Logo, Search Bar, Icons */}
      <div className="flex flex-row justify-between items-center pb-4">
        {/* Logo */}
        <div className="flex items-center mt-4 lg:mt-0">
          <Link href="/">
            <Image
              src="/Lappaz-logo-long.webp"
              alt="Lappaz Logo"
              width={160}
              height={40}
              priority
              className="hidden lg:block" // Hide on smaller screens
            />
            <Image
              src="/Lappaz-logo-512.webp"
              alt="Lappaz Logo"
              width={60}
              height={60}
              priority
              className="lg:hidden" // Show only on smaller screens
            />
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center mt-4 lg:mt-0 w-full lg:w-2/5 mr-2 ml-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none w-full pl-10" // Add padding-left for icon
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute left-3 text-white">
            <FaSearch />
          </button>
        </form>

        {/* Icons & Cart on mobile, grouped with Hamburger */}
        <div className="flex items-center gap-3 mt-4 lg:mt-0 lg:flex-row flex-row lg:space-x-4">
          <FaUser className="cursor-pointer text-xl" />
          <div className="relative cursor-pointer">
            <FaShoppingCart className="text-xl mt-1" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full px-1">
              {cartItems}
            </span>
          </div>
          <span className="hidden lg:block font-bold">{totalPrice.toFixed(2)} €</span>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white text-2xl mt-1 lg:mt-0" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Categories Menu */}
      <div className="lg:flex justify-center">
        <DesktopMenu navLinks={navLinks} openDropdowns={openDropdowns} toggleDropdown={toggleDropdown} />
      </div>

      {/* Mobile Menu */}
      <MobileMenu navLinks={navLinks} menuOpen={menuOpen} setMenuOpen={setMenuOpen} openDropdowns={openDropdowns} toggleDropdown={toggleDropdown} />
    </header>
  );
}
