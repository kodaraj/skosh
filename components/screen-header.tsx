import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './ui/text';
import { useTheme } from '@/theme/use-theme';

interface ScreenHeaderProps {
  title: string;
  /** Hides the back button on tab roots and modal entry screens. */
  showBack?: boolean;
  right?: React.ReactNode;
}

/**
 * The custom themed header used on every screen, replacing the native one so
 * templates fully control typography and color.
 */
export function ScreenHeader({ title, showBack = true, right }: ScreenHeaderProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.row,
        {
          paddingTop: insets.top + spacing.sm,
          paddingBottom: spacing.md,
          paddingHorizontal: spacing.lg,
          backgroundColor: colors.background,
          gap: spacing.md,
        },
      ]}
    >
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={spacing.md}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
      ) : null}
      <Text variant="title" style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
});
