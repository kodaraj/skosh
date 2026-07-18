import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { CartItem } from '@/lib/data/types';
import { onPlaceOrder } from '@/lib/checkout';
import { formatPrice } from '@/lib/format-price';
import { useProduct } from '@/lib/queries';
import { selectCartSubtotal, useCartStore } from '@/store/cart-store';
import { useCheckoutStore } from '@/store/checkout-store';
import { useOrdersStore } from '@/store/orders-store';
import { useTheme } from '@/theme/use-theme';

function SummaryLine({ item }: { item: CartItem }) {
  const { spacing } = useTheme();
  const { data: product } = useProduct(item.productId);
  if (!product) return null;
  const variant = product.variants.find((entry) => entry.id === item.variantId);

  return (
    <View style={[styles.line, { gap: spacing.md }]}>
      <Text variant="body" tone="muted" style={styles.lineName} numberOfLines={1}>
        {item.quantity} x {product.name}
        {variant && product.variants.length > 1 ? ` (${variant.name})` : ''}
      </Text>
      <Text variant="body">
        {formatPrice(item.priceSnapshotMinor * item.quantity, product.currency)}
      </Text>
    </View>
  );
}

export default function CheckoutSummaryScreen() {
  const { colors, radii, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const subtotalMinor = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((state) => state.clear);
  const address = useCheckoutStore((state) => state.address);
  const addOrder = useOrdersStore((state) => state.addOrder);
  const { data: firstProduct } = useProduct(items[0]?.productId ?? '');

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string>();

  const placeOrder = async () => {
    setPlacing(true);
    setError(undefined);
    try {
      const order = await onPlaceOrder(items);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addOrder(order);
      clearCart();
      useCheckoutStore.getState().reset();
      router.replace('/checkout/confirmation');
    } catch {
      setError('We could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Order summary" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}>
        <View style={{ gap: spacing.md }}>
          <Text variant="caption" tone="muted">
            Items
          </Text>
          {items.map((item) => (
            <SummaryLine key={`${item.productId}:${item.variantId}`} item={item} />
          ))}
          <View
            style={[
              styles.line,
              {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.border,
                paddingTop: spacing.md,
              },
            ]}
          >
            <Text variant="heading" style={styles.lineName}>
              Subtotal
            </Text>
            <Text variant="heading">
              {formatPrice(subtotalMinor, firstProduct?.currency ?? 'USD')}
            </Text>
          </View>
        </View>
        {address ? (
          <View
            style={{
              backgroundColor: colors.surfaceMuted,
              borderRadius: radii.md,
              padding: spacing.lg,
              gap: spacing.xs,
            }}
          >
            <Text variant="caption" tone="muted">
              Deliver to
            </Text>
            <Text variant="body">{address.fullName}</Text>
            <Text variant="bodySmall" tone="muted">
              {address.line1}, {address.city} {address.postalCode}, {address.country}
            </Text>
          </View>
        ) : null}
        <Text variant="bodySmall" tone="muted">
          This template stops before payment. Placing the order returns a mock confirmation via the
          onPlaceOrder callback in lib/checkout.ts.
        </Text>
      </ScrollView>
      <View
        style={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.md, gap: spacing.sm }}
      >
        {error ? (
          <Text variant="bodySmall" tone="danger">
            {error}
          </Text>
        ) : null}
        <Button title="Place order" onPress={placeOrder} loading={placing} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineName: {
    flex: 1,
  },
});
