import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CartItem, Product, Variant } from '@/lib/data/types';

interface CartState {
  items: CartItem[];
  /** Adds a variant to the cart, snapshotting its current price. Merges quantity if already present. */
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  /** Sets an exact quantity; quantities below 1 remove the line. */
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
}

/**
 * Persisted cart state. Updates are synchronous (and therefore optimistic);
 * the backend is only involved at checkout via `dataProvider.createOrder`.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, variant, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id && item.variantId === variant.id,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item === existing ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            };
          }
          const newItem: CartItem = {
            productId: product.id,
            variantId: variant.id,
            quantity,
            priceSnapshotMinor: variant.priceOverrideMinor ?? product.priceMinor,
          };
          return { items: [...state.items, newItem] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId),
          ),
        })),

      setQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter(
                  (item) => !(item.productId === productId && item.variantId === variantId),
                )
              : state.items.map((item) =>
                  item.productId === productId && item.variantId === variantId
                    ? { ...item, quantity }
                    : item,
                ),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'skosh-cart',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** Total number of units in the cart, for the tab badge. */
export const selectCartCount = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

/** Cart subtotal in minor units. */
export const selectCartSubtotal = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.priceSnapshotMinor * item.quantity, 0);
