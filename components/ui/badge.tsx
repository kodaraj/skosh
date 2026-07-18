import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { Text } from './text';

type BadgeTone = 'neutral' | 'primary' | 'success' | 'danger';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}

/**
 * A small caption-style label for product states like "New" or order statuses.
 */
export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const { colors, radii, spacing } = useTheme();

  const tones: Record<BadgeTone, { background: string; text: string }> = {
    neutral: { background: colors.surfaceMuted, text: colors.textMuted },
    primary: { background: colors.primary, text: colors.onPrimary },
    success: { background: colors.success, text: colors.textInverse },
    danger: { background: colors.danger, text: colors.textInverse },
  };
  const { background, text } = tones[tone];

  return (
    <View
      style={[
        {
          backgroundColor: background,
          borderRadius: radii.sm,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text variant="caption" style={{ color: text }}>
        {label}
      </Text>
    </View>
  );
}
