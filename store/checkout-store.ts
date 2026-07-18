import { create } from 'zustand';

export interface Address {
  fullName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CheckoutState {
  address: Address | null;
  setAddress: (address: Address) => void;
  reset: () => void;
}

/**
 * Transient checkout state carried between the address form and the summary
 * screen. Deliberately not persisted; it resets with each checkout session.
 */
export const useCheckoutStore = create<CheckoutState>()((set) => ({
  address: null,
  setAddress: (address) => set({ address }),
  reset: () => set({ address: null }),
}));
