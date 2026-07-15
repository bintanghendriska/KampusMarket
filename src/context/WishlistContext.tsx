import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
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
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);

  // Key derived from current user ID or username
  const storageKey = useMemo(() => {
    return user ? `uasprak:wishlist:${user.id}` : null;
  }, [user]);

  // Load wishlist when user/storageKey changes
  useEffect(() => {
    if (!storageKey) {
      setItems([]);
      return;
    }

    const loadWishlist = async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) {
          setItems(JSON.parse(raw) as Product[]);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error('Failed to load wishlist', e);
        setItems([]);
      }
    };

    loadWishlist();
  }, [storageKey]);

  // Helper to persist wishlist changes
  const saveWishlist = useCallback(async (newItems: Product[]) => {
    if (!storageKey) return;
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [storageKey]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const next = prev.some((item) => item.id === product.id) ? prev : [...prev, product];
      saveWishlist(next);
      return next;
    });
  }, [saveWishlist]);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      saveWishlist(next);
      return next;
    });
  }, [saveWishlist]);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      const next = prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
      saveWishlist(next);
      return next;
    });
  }, [saveWishlist]);

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
