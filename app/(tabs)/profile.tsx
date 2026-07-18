import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { ListRow } from '@/components/ui/list-row';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store/auth-store';
import { useOrdersStore } from '@/store/orders-store';
import { useThemeStore, type SchemePreference } from '@/store/theme-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useTheme } from '@/theme/use-theme';

const SCHEME_OPTIONS: { label: string; value: SchemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function ProfileScreen() {
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const orderCount = useOrdersStore((state) => state.orders.length);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const schemePreference = useThemeStore((state) => state.schemePreference);
  const setSchemePreference = useThemeStore((state) => state.setSchemePreference);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Profile" showBack={false} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}>
        <View
          style={{
            backgroundColor: colors.surfaceMuted,
            borderRadius: radii.md,
            padding: spacing.lg,
            gap: spacing.md,
          }}
        >
          {user ? (
            <>
              <View style={{ gap: spacing.xs }}>
                <Text variant="heading">{user.name}</Text>
                <Text variant="bodySmall" tone="muted">
                  {user.email}
                </Text>
              </View>
              <Button title="Sign out" variant="secondary" onPress={signOut} />
            </>
          ) : (
            <>
              <View style={{ gap: spacing.xs }}>
                <Text variant="heading">Welcome</Text>
                <Text variant="bodySmall" tone="muted">
                  Sign in to keep your orders and wishlist with you.
                </Text>
              </View>
              <Button title="Sign in" onPress={() => router.push('/auth/login')} />
              <Button
                title="Create account"
                variant="secondary"
                onPress={() => router.push('/auth/signup')}
              />
            </>
          )}
        </View>
        <View>
          <ListRow
            icon="package"
            label="Orders"
            detail={orderCount > 0 ? String(orderCount) : undefined}
            onPress={() => router.push('/orders')}
          />
          <ListRow
            icon="heart"
            label="Wishlist"
            detail={user && wishlistCount > 0 ? String(wishlistCount) : undefined}
            onPress={() => router.push('/wishlist')}
          />
        </View>
        <View style={{ gap: spacing.md }}>
          <Text variant="caption" tone="muted">
            Appearance
          </Text>
          <View style={[styles.chips, { gap: spacing.sm }]}>
            {SCHEME_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={schemePreference === option.value}
                onPress={() => setSchemePreference(option.value)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
