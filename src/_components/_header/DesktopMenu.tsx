"use client";

import React from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubLink {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href?: string;
  subLinks?: SubLink[];
}

interface DesktopMenuProps {
  navLinks: NavLink[];
  openDropdowns?: Record<string, boolean>;
  toggleDropdown?: (label: string) => void;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ navLinks, openDropdowns, toggleDropdown }) => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center space-x-6">
      {navLinks.map(({ href, label, subLinks }) => (
        <div key={label} className="relative group">
          <Link
            href={href || "#"}
            className={`font-bold flex items-center ${
              pathname === href ? "text-blue-600" : "text-white"
            } hover:text-blue-600 transition`}
            onMouseEnter={() => toggleDropdown?.(label)}
            onMouseLeave={() => toggleDropdown?.(label)}
          >
            {label}
            {subLinks && <FaChevronDown className="ml-2 text-sm" />}
          </Link>

          {subLinks && (
            <div
              className={`absolute left-0 w-48 bg-neutral-800 shadow-lg rounded-lg transition-all duration-200 z-10 ${
                openDropdowns?.[label] ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
              }`}
            >
              {subLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="block px-4 py-2 text-white hover:bg-blue-600 flex items-center"
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default DesktopMenu;
