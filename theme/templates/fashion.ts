import { Platform } from 'react-native';

import type {
  ColorTokens,
  ComponentTokens,
  RadiusTokens,
  TemplateTokens,
  TypographyTokens,
} from '../tokens';
import { spacing } from '../tokens';

/**
 * Fashion: minimal and editorial. Generous whitespace, serif-accented display
 * type, large portrait imagery, and a warm muted palette.
 */

const serif = Platform.select({ ios: 'Georgia', default: 'serif' });

const typography: TypographyTokens = {
  display: { fontFamily: serif, fontSize: 32, lineHeight: 38, fontWeight: '400' },
  title: { fontFamily: serif, fontSize: 24, lineHeight: 30, fontWeight: '400' },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  button: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0.8 },
};

const radii: RadiusTokens = { xs: 2, sm: 4, md: 8, lg: 16, pill: 999 };

const components: ComponentTokens = {
  productCard: { variant: 'editorial', imageAspectRatio: 3 / 4 },
};

const light: ColorTokens = {
  background: '#FAF9F7',
  surface: '#FFFFFF',
  surfaceMuted: '#F1EFEA',
  text: '#1C1B18',
  textMuted: '#6E6A62',
  textInverse: '#FAF9F7',
  primary: '#1C1B18',
  onPrimary: '#FAF9F7',
  border: '#E6E3DC',
  danger: '#B3402A',
  success: '#4A6B4F',
  overlay: 'rgba(22, 20, 17, 0.45)',
  skeleton: '#ECE9E2',
  skeletonHighlight: '#F5F3EE',
};

const dark: ColorTokens = {
  background: '#161513',
  surface: '#1F1E1B',
  surfaceMuted: '#2A2825',
  text: '#F2F0EB',
  textMuted: '#A5A098',
  textInverse: '#161513',
  primary: '#F2F0EB',
  onPrimary: '#161513',
  border: '#343029',
  danger: '#D9705A',
  success: '#7FA184',
  overlay: 'rgba(0, 0, 0, 0.6)',
  skeleton: '#26241F',
  skeletonHighlight: '#2F2D27',
};

export const fashion: TemplateTokens = {
  light: {
    template: 'fashion',
    scheme: 'light',
    colors: light,
    typography,
    spacing,
    radii,
    components,
  },
  dark: {
    template: 'fashion',
    scheme: 'dark',
    colors: dark,
    typography,
    spacing,
    radii,
    components,
  },
};
