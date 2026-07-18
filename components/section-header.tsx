import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from './ui/text';
import { useTheme } from '@/theme/use-theme';

interface SectionHeaderProps {
  title: string;
  /** Optional trailing action, e.g. "View all". */
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * A home/detail section title row with an optional trailing action link.
 */
export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const { spacing } = useTheme();

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.lg, marginBottom: spacing.md }]}>
      <Text variant="title">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}: ${title}`}
          onPress={onAction}
          hitSlop={spacing.sm}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text variant="caption" tone="muted">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});
