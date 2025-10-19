'use client';
import { createContext, useContext, useState, ReactNode, useMemo, useRef, useCallback } from 'react';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number | string, options?: Record<string, string>) => void;
  clearCart: () => void;
  updateItemQuantity: (id: number | string, quantity: number, options?: Record<string, string>) => void;
  showPopup: boolean;
  togglePopup: (show?: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  updateItemQuantity: () => {},
  showPopup: false,
  togglePopup: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
      );
      if (existing) {
        return prev.map(i =>
          i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });

    setShowPopup(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPopup(false), 3000);
  }, []);

  const removeItem = useCallback((id: number | string, options?: Record<string, string>) => {
    setItems(prev =>
      prev.filter(i => i.id !== id || JSON.stringify(i.options) !== JSON.stringify(options))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const updateItemQuantity = useCallback((id: number | string, quantity: number, options?: Record<string, string>) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.id === id && JSON.stringify(i.options) === JSON.stringify(options) ? { ...i, quantity } : i
      )
    );
  }, []);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const togglePopup = useCallback((show?: boolean) => {
    if (show !== undefined) setShowPopup(show);
    else setShowPopup(prev => !prev);
  }, []);

  const value = useMemo(
    () => ({
      items,
      total,
      addItem,
      removeItem,
      clearCart,
      updateItemQuantity,
      showPopup,
      togglePopup,
    }),
    [items, total, addItem, removeItem, clearCart, updateItemQuantity, showPopup, togglePopup]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
