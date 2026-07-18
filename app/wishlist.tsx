import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { WishlistCard } from '@/components/wishlist-card';
import { useAuthStore } from '@/store/auth-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useTheme } from '@/theme/use-theme';

export default function WishlistScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const items = useWishlistStore((state) => state.items);
  const sorted = [...items].sort((a, b) => b.addedAt.localeCompare(a.addedAt));

  if (!user) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Wishlist" />
        <EmptyState
          icon="lock"
          title="Sign in to see your wishlist"
          message="Saved items follow your account across sessions."
          actionLabel="Sign in"
          onAction={() => router.push('/auth/login')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Wishlist" />
      {sorted.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Nothing saved yet"
          message="Tap the heart on any product to keep it here."
          actionLabel="Browse products"
          onAction={() => router.replace('/(tabs)')}
        />
      ) : (
        <FlatList
          data={sorted}
          numColumns={2}
          keyExtractor={(item) => item.productId}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.duration(300).delay(Math.min(index, 6) * 50)}
              style={styles.cell}
            >
              <WishlistCard productId={item.productId} />
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cell: {
    flex: 1,
    maxWidth: '48%',
  },
});
