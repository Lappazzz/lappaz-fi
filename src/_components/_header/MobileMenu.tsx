"use client";

import React from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

interface SubLink {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href?: string;
  subLinks?: SubLink[];
}

interface MobileMenuProps {
  navLinks: NavLink[];
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  openDropdowns: Record<string, boolean>;
  toggleDropdown: (label: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  navLinks,
  menuOpen,
  setMenuOpen,
  openDropdowns,
  toggleDropdown,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 w-3/5 h-full bg-neutral-800 p-6 flex flex-col items-start space-y-4 shadow-lg transform transition-all duration-300 ease-in-out lg:hidden
        ${
          menuOpen
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
    >
      <button
        className="text-white text-2xl self-end mb-4"
        onClick={() => setMenuOpen(false)}
        aria-label="Sulje valikko"
      >
        {/* voidaan pitää ChevronDown, mutta tämä olisi selkeämpi X:lläkin */}
        <FaChevronDown className="rotate-180" />
      </button>

      {navLinks.map(({ label, href, subLinks }) => {
        const isOpen = !!openDropdowns[label];

        // jos ei sublinkkejä → suora linkki
        if (!subLinks || subLinks.length === 0) {
          return (
            <div key={label} className="w-full">
              <Link
                href={href || "#"}
                className="text-lg font-bold block text-white hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </div>
          );
        }

        // jos on sublinkkejä → dropdown
        return (
          <div key={label} className="w-full">
            <button
              type="button"
              onClick={() => toggleDropdown(label)}
              className="text-lg font-bold w-full text-left text-white hover:text-blue-400 transition flex items-center justify-between"
            >
              <span>{label}</span>
              <FaChevronDown
                className={`ml-2 text-sm transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                } transition-transform`}
              />
            </button>

            {isOpen && (
              <div className="pl-4 mt-2 space-y-2">
                {subLinks.map(({ href: linkHref, label: subLabel }) => (
                  <Link
                    key={subLabel}
                    href={linkHref}
                    className="block text-white hover:text-blue-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    {subLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MobileMenu;
