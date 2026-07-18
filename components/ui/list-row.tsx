import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { Text } from './text';

interface ListRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  /** Small trailing text before the chevron, e.g. a count or current value. */
  detail?: string;
}

/**
 * A settings-style tappable row: leading icon, label, optional detail, chevron.
 */
export function ListRow({ icon, label, onPress, detail }: ListRowProps) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          paddingVertical: spacing.lg,
          gap: spacing.md,
          opacity: pressed ? 0.6 : 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Feather name={icon} size={18} color={colors.textMuted} />
      <Text variant="body" style={styles.label}>
        {label}
      </Text>
      {detail ? (
        <Text variant="bodySmall" tone="muted">
          {detail}
        </Text>
      ) : null}
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
  },
});
