import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Product } from '../types/product.types';

interface WishlistContextValue {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]));
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product],
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ items, addItem, removeItem, toggleItem, isInWishlist }),
    [items, addItem, removeItem, toggleItem, isInWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist harus dipakai di dalam WishlistProvider');
  return context;
}
