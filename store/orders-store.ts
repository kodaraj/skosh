import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Order } from '@/lib/data/types';

interface OrdersState {
  /** Newest first. */
  orders: Order[];
  addOrder: (order: Order) => void;
}

/**
 * Locally persisted order history, populated when checkout completes. With a
 * real backend you would typically fetch this instead; it lives here so the
 * demo works end to end without accounts.
 */
export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    {
      name: 'skosh-orders',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
