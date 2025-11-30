import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Lappaz.fi | 3D-tulostukset',
    template: 'Lappaz.fi',
  },
  description: 'Lappaz.fi tarjoaa 3D-tulostettuja autotarvikkeita ja mittaritelineitä.',
};

// Components import
import Footer from "../_components/footer";
import Header from "../_components/_header/index";
import { CartProvider } from "@/_context/CartContext";

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
