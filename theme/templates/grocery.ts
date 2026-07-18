import type {
  ColorTokens,
  ComponentTokens,
  RadiusTokens,
  TemplateTokens,
  TypographyTokens,
} from '../tokens';
import { spacing } from '../tokens';

/**
 * Grocery: fresh and friendly. Rounded corners, a green-leaning palette,
 * denser square-image grids, and quantity-first product cards.
 */

const typography: TypographyTokens = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  heading: { fontSize: 16, lineHeight: 21, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: '600', letterSpacing: 0.4 },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '700' },
};

const radii: RadiusTokens = { xs: 6, sm: 10, md: 14, lg: 20, pill: 999 };

const components: ComponentTokens = {
  productCard: { variant: 'quantity', imageAspectRatio: 1 },
};

const light: ColorTokens = {
  background: '#F6F9F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EAF2E6',
  text: '#1B2419',
  textMuted: '#5F6E5A',
  textInverse: '#F6F9F4',
  primary: '#2F7D44',
  onPrimary: '#FFFFFF',
  border: '#DCE7D6',
  danger: '#C24E33',
  success: '#2F7D44',
  overlay: 'rgba(20, 30, 18, 0.45)',
  skeleton: '#E6EEE1',
  skeletonHighlight: '#F0F6EC',
};

const dark: ColorTokens = {
  background: '#141A13',
  surface: '#1C231A',
  surfaceMuted: '#242E22',
  text: '#EDF3EA',
  textMuted: '#9FAE99',
  textInverse: '#141A13',
  primary: '#6FBF82',
  onPrimary: '#0E1F12',
  border: '#2E3A2B',
  danger: '#E07856',
  success: '#6FBF82',
  overlay: 'rgba(0, 0, 0, 0.6)',
  skeleton: '#212B20',
  skeletonHighlight: '#2A3628',
};

export const grocery: TemplateTokens = {
  light: {
    template: 'grocery',
    scheme: 'light',
    colors: light,
    typography,
    spacing,
    radii,
    components,
  },
  dark: {
    template: 'grocery',
    scheme: 'dark',
    colors: dark,
    typography,
    spacing,
    radii,
    components,
  },
};
