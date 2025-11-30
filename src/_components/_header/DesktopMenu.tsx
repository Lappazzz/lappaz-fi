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

const DesktopMenu: React.FC<DesktopMenuProps> = ({
  navLinks,
  openDropdowns,
  toggleDropdown,
}) => {
  const pathname = usePathname();

  const isActive = (href?: string) =>
    href && pathname === href ? "text-blue-600" : "text-white";

  return (
    <nav className="hidden lg:flex items-center space-x-6">
      {navLinks.map(({ href, label, subLinks }) => {
        const hasStateControl =
          openDropdowns !== undefined && toggleDropdown !== undefined;
        const isOpen = hasStateControl ? !!openDropdowns?.[label] : false;

        return (
          <div
            key={label}
            className="relative group"
            // käytä statea vain jos se on annettu
            onMouseEnter={
              hasStateControl ? () => toggleDropdown?.(label) : undefined
            }
            onMouseLeave={
              hasStateControl ? () => toggleDropdown?.(label) : undefined
            }
          >
            <Link
              href={href || "#"}
              className={`font-bold flex items-center ${isActive(
                href
              )} hover:text-blue-600 transition`}
            >
              {label}
              {subLinks && <FaChevronDown className="ml-2 text-sm" />}
            </Link>

            {subLinks && (
              <div
                className={[
                  "absolute left-0 w-48 bg-neutral-800 shadow-lg rounded-lg transition-all duration-200 z-10",
                  hasStateControl
                    ? isOpen
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                    : // fallback: puhdas CSS hover
                      "opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto",
                ].join(" ")}
              >
                {subLinks.map(({ href: subHref, label: subLabel }) => (
                  <Link
                    key={subLabel}
                    href={subHref}
                    className="block px-4 py-2 text-white hover:bg-blue-600 flex items-center"
                  >
                    {subLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default DesktopMenu;
