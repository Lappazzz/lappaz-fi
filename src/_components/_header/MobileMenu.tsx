// MobileMenu.js
import React from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

const MobileMenu = ({ navLinks, menuOpen, setMenuOpen, openDropdowns, toggleDropdown }) => {
    return (
        <div
        className={`fixed top-0 right-0 w-3/5 h-full bg-neutral-800 p-6 flex flex-col items-start space-y-4 shadow-lg transform transition-all duration-300 ease-in-out lg:hidden
            ${menuOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"}`}
        >
        <button className="text-white text-2xl self-end mb-4" onClick={() => setMenuOpen(false)}>
            <FaChevronDown />
        </button>

        {navLinks.map(({ href, label, subLinks }) => (
            <div key={label} className="w-full">
            <button
                onClick={() => toggleDropdown(label)}
                className="text-lg font-bold w-full text-left text-white hover:text-blue-400 transition flex items-center"
            >
                {label}
                {subLinks && <FaChevronDown className={`ml-2 text-sm transform ${openDropdowns[label] ? "rotate-180" : "rotate-0"} transition-transform`} />}
            </button>

            {subLinks && openDropdowns[label] && (
                <div className="pl-4 mt-2 space-y-2">
                {subLinks.map(({ href, label }) => (
                    <Link key={label} href={href} className="block text-white hover:text-blue-400" onClick={() => setMenuOpen(false)}>
                    {label}
                    </Link>
                ))}
                </div>
            )}
            </div>
        ))}
        </div>
    );
};

export default MobileMenu;
