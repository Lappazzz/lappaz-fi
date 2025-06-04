import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

//Components import
import Footer from "../_components/footer"
import Header from "../_components/_header/index"

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pb-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
