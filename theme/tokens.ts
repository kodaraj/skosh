import type { TextStyle } from 'react-native';

/**
 * The design token contract every template must satisfy.
 *
 * Screens and components read tokens exclusively through `useTheme()` and never
 * hardcode colors, spacing, or type styles. Adding a new template means writing
 * one file in `theme/templates/` that exports a full `TemplateTokens` set. If a
 * new template would require touching screen code, the contract below is wrong
 * and should be extended instead.
 */

export type TemplateName = 'fashion' | 'grocery' | 'electronics';

export type ColorSchemeName = 'light' | 'dark';

export interface ColorTokens {
  /** Screen background. */
  background: string;
  /** Cards, sheets, and other raised surfaces. */
  surface: string;
  /** Subdued fills: input backgrounds, image placeholders, quiet sections. */
  surfaceMuted: string;
  text: string;
  textMuted: string;
  /** Text rendered on `primary` or other dark-on-light inversions. */
  textInverse: string;
  /** Main action color: primary buttons, active states, selection. */
  primary: string;
  /** Text and icons rendered on top of `primary`. */
  onPrimary: string;
  border: string;
  danger: string;
  success: string;
  /** Scrim behind bottom sheets and modals. */
  overlay: string;
  skeleton: string;
  skeletonHighlight: string;
}

/** A complete text style. Font families come from the template, never screens. */
export interface TypeStyle {
  /** Omit to use the platform system font. */
  fontFamily?: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
  textTransform?: TextStyle['textTransform'];
}

export interface TypographyTokens {
  /** Hero and screen-level statements. */
  display: TypeStyle;
  /** Screen and section titles. */
  title: TypeStyle;
  /** Card titles, list headers. */
  heading: TypeStyle;
  body: TypeStyle;
  bodySmall: TypeStyle;
  /** Eyebrows, metadata, badges. */
  caption: TypeStyle;
  button: TypeStyle;
}

/** The shared 4pt spacing grid. Identical across templates by design. */
export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface RadiusTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  pill: number;
}

/**
 * How product cards render. Templates pick a variant; the card component
 * owns the layouts. `editorial` is image-forward (fashion), `quantity` puts a
 * stepper on the card (grocery), `spec` highlights key attributes (electronics).
 */
export type ProductCardVariant = 'editorial' | 'quantity' | 'spec';

export interface ComponentTokens {
  productCard: {
    variant: ProductCardVariant;
    /** width / height of the card image. */
    imageAspectRatio: number;
  };
}

/** Everything a resolved theme provides to the app for one color scheme. */
export interface Theme {
  template: TemplateName;
  scheme: ColorSchemeName;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radii: RadiusTokens;
  components: ComponentTokens;
}

/** What each template file exports: a full token set for both schemes. */
export interface TemplateTokens {
  light: Theme;
  dark: Theme;
}

/** The canonical 4pt spacing grid shared by all templates. */
export const spacing: SpacingTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};
