import { useColorScheme } from 'react-native';

import { ACTIVE_TEMPLATE } from '@/skosh.config';
import { useThemeStore } from '@/store/theme-store';
import { templates } from './templates';
import type { Theme } from './tokens';

/**
 * Resolves the active theme from the configured template and color scheme.
 * The single source of design tokens for every screen and component.
 */
export function useTheme(): Theme {
  const preference = useThemeStore((state) => state.schemePreference);
  const systemScheme = useColorScheme();

  const scheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const tokens = templates[ACTIVE_TEMPLATE] ?? templates.fashion!;
  return tokens[scheme];
}
