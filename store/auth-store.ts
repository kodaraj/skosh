import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  /** Demo sign-in: stores the user locally. Wire to your auth backend here. */
  signIn: (user: User) => void;
  signOut: () => void;
}

/**
 * UI-only auth state. The login and signup screens are fully built; this store
 * is the single place to connect a real authentication backend later.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    {
      name: 'skosh-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
