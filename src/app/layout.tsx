import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components import
import Footer from "../_components/footer";
import Header from "../_components/_header/index";
import { CartProvider } from "@/context/CartContext"; // <-- import cart context

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-grow pb-12">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
