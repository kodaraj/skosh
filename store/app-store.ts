import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  /** True once the user has completed or skipped the onboarding slides. */
  hasOnboarded: boolean;
  /** True once persisted state has been loaded; gate navigation on this. */
  hydrated: boolean;
  completeOnboarding: () => void;
}

/**
 * App-level flags, currently just the onboarding gate. `hydrated` flips after
 * AsyncStorage rehydration so the router does not redirect on stale defaults.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      hydrated: false,
      completeOnboarding: () => set({ hasOnboarded: true }),
    }),
    {
      name: 'skosh-app',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasOnboarded: state.hasOnboarded }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);
