"use client";

import { usePathname } from "next/navigation";
import { FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  const footerLinks = [
    { href: "/toimitus-ja-palautusehdot", label: "TOIMITUS- JA PALAUTUSEHDOT" },
    { href: "/tietosuojakaytanto", label: "TIETOSUOJAKÄYTÄNTÖ" },
    { href: "/about-us", label: "TIETOA MEISTÄ" },
    { href: "/ota-yhteytta", label: "OTA YHTEYTTÄ" },
  ];

  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className="flex flex-col items-center bg-neutral-800 p-6 text-white gap-4">
      
      {/* Social Icons */}
      <div className="text-white flex flex-wrap justify-center gap-4">
        <a href="https://www.instagram.com/lappaz.fi" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="cursor-pointer text-2xl hover:text-blue-400 transition" />
        </a>
        <a href="https://www.tiktok.com/@lappazz" target="_blank" rel="noopener noreferrer">
          <FaTiktok className="cursor-pointer text-2xl hover:text-blue-400 transition" />
        </a>
        <a href="https://wa.me/358469344198" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="cursor-pointer text-2xl hover:text-blue-400 transition" />
        </a>
      </div>

      {/* Links */}
      <div className="text-white text-sm text-center flex flex-wrap justify-center gap-2">
        {footerLinks.map(({ href, label }) => (
          <a 
            key={href} 
            href={href} 
            className={`px-2 font-bold transition ${pathname === href ? "text-blue-600" : "text-white"} hover:text-blue-400`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Copyright Text */}
      <p className="text-white text-center mt-2 font-bold">
        Copyright © {currentYear} - Lappaz
      </p>
    </footer>
  );
}
