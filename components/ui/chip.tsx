import { Pressable } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { Text } from './text';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/**
 * A selectable pill used for variant options, filters, and settings choices.
 */
export function Chip({ label, selected, onPress }: ChipProps) {
  const { colors, radii, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : colors.surface,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text variant="bodySmall" tone={selected ? 'onPrimary' : 'default'}>
        {label}
      </Text>
    </Pressable>
  );
}
