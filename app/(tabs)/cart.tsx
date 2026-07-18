import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartLine } from '@/components/cart-line';
import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { formatPrice } from '@/lib/format-price';
import { useProduct } from '@/lib/queries';
import { selectCartSubtotal, useCartStore } from '@/store/cart-store';
import { useTheme } from '@/theme/use-theme';

export default function CartScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const subtotalMinor = useCartStore(selectCartSubtotal);
  // All cart items share one currency; read it from the first line's product.
  const { data: firstProduct } = useProduct(items[0]?.productId ?? '');
  const currency = firstProduct?.currency ?? 'USD';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Cart" showBack={false} />
      {items.length === 0 ? (
        <EmptyState
          icon="shopping-bag"
          title="Your cart is empty"
          message="Items you add will appear here, ready when you are."
          actionLabel="Start shopping"
          onAction={() => router.push('/(tabs)')}
        />
      ) : (
        <>
          <Animated.FlatList
            data={items}
            keyExtractor={(item) => `${item.productId}:${item.variantId}`}
            contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
            itemLayoutAnimation={LinearTransition.duration(220)}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.duration(250).delay(Math.min(index, 5) * 40)}
                exiting={FadeOutLeft.duration(200)}
              >
                <CartLine item={item} />
              </Animated.View>
            )}
          />
          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.border,
              padding: spacing.lg,
              paddingBottom: insets.bottom + spacing.md,
              gap: spacing.md,
            }}
          >
            <View style={styles.subtotalRow}>
              <Text variant="body" tone="muted">
                Subtotal
              </Text>
              <Text variant="heading">{formatPrice(subtotalMinor, currency)}</Text>
            </View>
            <Text variant="bodySmall" tone="muted">
              Shipping and taxes are calculated at checkout.
            </Text>
            <Button title="Checkout" onPress={() => router.push('/checkout')} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  subtotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
