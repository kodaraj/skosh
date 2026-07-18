import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import type { TypographyTokens } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type TextTone = 'default' | 'muted' | 'inverse' | 'onPrimary' | 'danger' | 'success';

interface TextProps extends RNTextProps {
  /** Type style from the template's typography tokens. Defaults to `body`. */
  variant?: keyof TypographyTokens;
  /** Semantic color. Defaults to the theme's main text color. */
  tone?: TextTone;
}

/**
 * Themed text. Always use this instead of React Native's Text so typography
 * and color stay driven by the active template.
 */
export function Text({ variant = 'body', tone = 'default', style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();

  const toneColors: Record<TextTone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    inverse: colors.textInverse,
    onPrimary: colors.onPrimary,
    danger: colors.danger,
    success: colors.success,
  };

  return (
    <RNText
      {...rest}
      style={[typography[variant] as TextStyle, { color: toneColors[tone] }, style]}
    />
  );
}
