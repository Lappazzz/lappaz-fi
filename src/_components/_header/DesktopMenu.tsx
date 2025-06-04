"use client";

import React, { use } from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DesktopMenu = ({ navLinks, openDropdowns, toggleDropdown }) => {
    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center space-x-6">
        {navLinks.map(({ href, label, subLinks }) => (
            <div key={label} className="relative group">
            <Link
                href={href || "#"}
                className={`font-bold flex items-center ${pathname === href ? "text-blue-600" : "text-white"} hover:text-blue-600 transition`}
            >
                {label}
                {subLinks && <FaChevronDown className="ml-2 text-sm" />}
            </Link>

            {subLinks && (
                <div className="absolute left-0 w-48 bg-neutral-800 shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none group-hover:pointer-events-auto">
                {subLinks.map(({ href, label }) => (
                    <Link key={label} href={href} className="block px-4 py-2 text-white hover:bg-blue-600 flex items-center">
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
