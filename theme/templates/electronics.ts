import type {
  ColorTokens,
  ComponentTokens,
  RadiusTokens,
  TemplateTokens,
  TypographyTokens,
} from '../tokens';
import { spacing } from '../tokens';

/**
 * Electronics: technical and dark-friendly. Sharp corners, a blue and graphite
 * palette, and spec-highlight product cards.
 */

const typography: TypographyTokens = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '600', letterSpacing: -0.5 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600', letterSpacing: -0.3 },
  heading: { fontSize: 16, lineHeight: 21, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  button: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0.4 },
};

const radii: RadiusTokens = { xs: 0, sm: 2, md: 4, lg: 8, pill: 999 };

const components: ComponentTokens = {
  productCard: { variant: 'spec', imageAspectRatio: 4 / 3 },
};

const light: ColorTokens = {
  background: '#F5F6F8',
  surface: '#FFFFFF',
  surfaceMuted: '#E9EBEF',
  text: '#14171C',
  textMuted: '#5C6470',
  textInverse: '#F5F6F8',
  primary: '#2563EB',
  onPrimary: '#FFFFFF',
  border: '#D9DDE3',
  danger: '#C13A2E',
  success: '#1F8A4C',
  overlay: 'rgba(10, 14, 20, 0.5)',
  skeleton: '#E4E7EC',
  skeletonHighlight: '#EFF1F5',
};

const dark: ColorTokens = {
  background: '#0F1216',
  surface: '#171B21',
  surfaceMuted: '#20262E',
  text: '#E8EBEF',
  textMuted: '#8C95A1',
  textInverse: '#0F1216',
  primary: '#4C8DFF',
  onPrimary: '#0B1220',
  border: '#2A313B',
  danger: '#E4604F',
  success: '#3FAE6A',
  overlay: 'rgba(0, 0, 0, 0.65)',
  skeleton: '#1D232B',
  skeletonHighlight: '#252C36',
};

export const electronics: TemplateTokens = {
  light: {
    template: 'electronics',
    scheme: 'light',
    colors: light,
    typography,
    spacing,
    radii,
    components,
  },
  dark: {
    template: 'electronics',
    scheme: 'dark',
    colors: dark,
    typography,
    spacing,
    radii,
    components,
  },
};
