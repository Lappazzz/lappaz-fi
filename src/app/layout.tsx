import "./globals.css";

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
