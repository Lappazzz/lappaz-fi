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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center bg-neutral-800 p-6 text-white gap-4">

      {/* Social Icons */}
      <div className="text-white flex flex-wrap justify-center gap-4">
        <a
          href="https://www.instagram.com/lappaz.fi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lappaz.fi Instagram"
          className="inline-flex items-center"
        >
          <FaInstagram aria-hidden="true" className="cursor-pointer text-2xl hover:text-blue-400 transition" />
          <span className="sr-only">Lappaz.fi Instagram</span>
        </a>

        <a
          href="https://www.tiktok.com/@lappazz"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lappaz.fi TikTok"
          className="inline-flex items-center"
        >
          <FaTiktok aria-hidden="true" className="cursor-pointer text-2xl hover:text-blue-400 transition" />
          <span className="sr-only">Lappaz.fi TikTok</span>
        </a>

        <a
          href="https://wa.me/358453338998"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp-viesti Lappaz.fi:lle"
          className="inline-flex items-center"
        >
          <FaWhatsapp aria-hidden="true" className="cursor-pointer text-2xl hover:text-blue-400 transition" />
          <span className="sr-only">WhatsApp-viesti Lappaz.fi:lle</span>
        </a>
      </div>

      {/* Footer navigation links */}
      <div className="text-white text-sm text-center flex flex-wrap justify-center gap-2">
        {footerLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={`px-2 font-bold transition ${
              pathname === href ? "text-blue-600" : "text-white"
            } hover:text-blue-400`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-white text-center mt-2 font-bold">
        Copyright © {currentYear} - Lappaz
      </p>
    </footer>
  );
}
