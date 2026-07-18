import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ColorSchemeName } from '@/theme/tokens';

/** 'system' follows the OS appearance; 'light' / 'dark' are manual overrides. */
export type SchemePreference = 'system' | ColorSchemeName;

interface ThemeState {
  schemePreference: SchemePreference;
  setSchemePreference: (preference: SchemePreference) => void;
}

/**
 * Persisted appearance preference. The template itself is a build-time choice
 * (see ACTIVE_TEMPLATE in theme/templates); only light/dark is user-facing.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      schemePreference: 'system',
      setSchemePreference: (schemePreference) => set({ schemePreference }),
    }),
    {
      name: 'skosh-theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
