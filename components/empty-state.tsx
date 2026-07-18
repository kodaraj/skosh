import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Button } from './ui/button';
import { Text } from './ui/text';
import { useTheme } from '@/theme/use-theme';

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * A designed empty state for carts, wishlists, searches, and order lists.
 */
export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxl, gap: spacing.sm }]}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.surfaceMuted, marginBottom: spacing.sm },
        ]}
      >
        <Feather name={icon} size={26} color={colors.textMuted} />
      </View>
      <Text variant="title" style={styles.centered}>
        {title}
      </Text>
      <Text variant="body" tone="muted" style={styles.centered}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="secondary"
          style={{ marginTop: spacing.lg }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
});
