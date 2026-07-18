import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { formatPrice } from '@/lib/format-price';
import { useOrdersStore } from '@/store/orders-store';
import { useTheme } from '@/theme/use-theme';

export default function CheckoutConfirmationScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // The order placed moments ago is the newest entry.
  const order = useOrdersStore((state) => state.orders[0]);

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + spacing.lg,
          padding: spacing.xl,
        },
      ]}
    >
      <View style={[styles.body, { gap: spacing.md }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.success }]}>
          <Feather name="check" size={30} color={colors.textInverse} />
        </View>
        <Text variant="title" style={styles.centered}>
          Order confirmed
        </Text>
        {order ? (
          <>
            <Text variant="body" tone="muted" style={styles.centered}>
              Thanks for your order. A confirmation is on its way.
            </Text>
            <Text variant="caption" tone="muted">
              Order {order.id}
            </Text>
            <Text variant="heading">{formatPrice(order.subtotalMinor, order.currency)}</Text>
          </>
        ) : (
          <Text variant="body" tone="muted" style={styles.centered}>
            Your order has been placed.
          </Text>
        )}
      </View>
      <Button title="Continue shopping" onPress={() => router.dismissAll()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    textAlign: 'center',
  },
});
