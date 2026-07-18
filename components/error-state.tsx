import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Button } from './ui/button';
import { Text } from './ui/text';
import { useTheme } from '@/theme/use-theme';

interface ErrorStateProps {
  /** Re-runs the failed queries, wired to TanStack Query's refetch. */
  onRetry: () => void;
  message?: string;
}

/**
 * A friendly error state with a retry action, shown when queries fail.
 */
export function ErrorState({ onRetry, message }: ErrorStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxl, gap: spacing.sm }]}>
      <Feather name="cloud-off" size={28} color={colors.textMuted} />
      <Text variant="heading" style={styles.centered}>
        Something went wrong
      </Text>
      <Text variant="body" tone="muted" style={styles.centered}>
        {message ?? 'We could not load this right now. Check your connection and try again.'}
      </Text>
      <Button
        title="Try again"
        onPress={onRetry}
        variant="secondary"
        style={{ marginTop: spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
});
