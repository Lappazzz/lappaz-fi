'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CheckoutDetailsPage() {
  const { items, total, removeItem, updateItemQuantity } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal: '',
    email: '',
    phone: '',
  });

  const VAT_RATE = 25.5;
  const vatAmount = total * (VAT_RATE / (100 + VAT_RATE));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Tilauksesi on vastaanotettu!');
    // Clear cart or send order
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Delivery Details */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Toimitustiedot</h2>
        <form className="space-y-4" onSubmit={handlePlaceOrder}>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nimi"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Katuosoite"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Kaupunki"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            name="postal"
            value={formData.postal}
            onChange={handleInputChange}
            placeholder="Postinumero"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Sähköposti"
            type="email"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Puhelin"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-md mt-4"
          >
            Lähetä tilaus
          </button>
        </form>
      </div>

      {/* Right: Order Summary */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Tilauksen yhteenveto</h2>
        <ul className="space-y-4 mb-4">
          {items.map((item: any) => (
            <li key={item.id} className="flex justify-between">
              <div>
                <div className="font-semibold">{item.name}</div>
                {item.options && Object.keys(item.options).length > 0 && (
                  <ul className="text-sm text-gray-700">
                    {Object.entries(item.options).map(([key, val]) => (
                      <li key={key}>
                        {key}: {val}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="text-gray-800">
                  {item.quantity} × {item.price.toFixed(2)} €
                </div>
              </div>
              <div className="font-semibold">{(item.quantity * item.price).toFixed(2)} €</div>
            </li>
          ))}
        </ul>

        <div className="border-t pt-4 space-y-1">
          <div className="flex justify-between font-semibold">
            <span>Alv {VAT_RATE}% sisältyy:</span>
            <span>{vatAmount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Yhteensä:</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
