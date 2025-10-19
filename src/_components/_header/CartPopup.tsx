"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import { memo } from "react";

function CartPopupInner() {
    const { items, total } = useCart();

    if (!items || items.length === 0) return null;

    return (
        <>
            {/* Desktop / Tablet dropdown */}
            <div className="hidden md:block absolute right-0 top-full mt-2 w-64 bg-white text-black border rounded-md p-4 z-50 animate-cart-popup-enter shadow-lg">
                <ul>
                    {items.map((item) => (
                        <li key={item.id} className="flex justify-between mb-2">
                            <span>{item.name} x {item.quantity}</span>
                            <span>{item.price} €</span>
                        </li>
                    ))}
                </ul>
                <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                    <span>Yhteensä</span>
                    <span>{total.toFixed(2)} €</span>
                </div>
                <Link href="/checkout">
                    <button className="mt-2 w-full bg-black text-white px-4 py-2 rounded-md">
                        Siirry kassalle
                    </button>
                </Link>
            </div>

            {/* Mobile panel under header */}
            <div className="md:hidden fixed left-0 right-0 top-20 bg-white text-black border-t border-b p-4 z-30 animate-cart-popup-enter shadow-md">
                <div className="max-w-6xl mx-auto">
                    <ul>
                        {items.map((item) => (
                            <li key={item.id} className="flex justify-between mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{item.price} €</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                        <span>Yhteensä</span>
                        <span>{total.toFixed(2)} €</span>
                    </div>
                    <Link href="/checkout">
                        <button className="mt-2 w-full bg-black text-white px-4 py-2 rounded-md">
                            Siirry kassalle
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}

const CartPopup = memo(CartPopupInner);

export default CartPopup;
