import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WishlistItem } from '@/lib/data/types';

interface WishlistState {
  items: WishlistItem[];
  /** Adds the product if absent, removes it if present. */
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
}

/**
 * Persisted wishlist state. Heart toggles across all product cards and the
 * product detail screen read membership from here, so they stay in sync.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],

      toggle: (productId) =>
        set((state) => {
          const exists = state.items.some((item) => item.productId === productId);
          return {
            items: exists
              ? state.items.filter((item) => item.productId !== productId)
              : [...state.items, { productId, addedAt: new Date().toISOString() }],
          };
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
    }),
    {
      name: 'skosh-wishlist',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** Whether a product is wishlisted. Use inside a store selector for reactivity. */
export const selectIsWishlisted =
  (productId: string) =>
  (state: WishlistState): boolean =>
    state.items.some((item) => item.productId === productId);
