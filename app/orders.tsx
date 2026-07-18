import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatPrice } from '@/lib/format-price';
import { useOrdersStore } from '@/store/orders-store';
import { useTheme } from '@/theme/use-theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OrdersScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const orders = useOrdersStore((state) => state.orders);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Orders" />
      {orders.length === 0 ? (
        <EmptyState
          icon="package"
          title="No orders yet"
          message="Your order history will appear here after checkout."
          actionLabel="Start shopping"
          onAction={() => router.replace('/(tabs)')}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.duration(250).delay(Math.min(index, 6) * 40)}>
              <Card style={{ padding: spacing.lg, gap: spacing.sm }}>
                <View style={styles.row}>
                  <Text variant="heading">{formatDate(item.createdAt)}</Text>
                  <Badge label={item.status} tone="success" />
                </View>
                <View style={styles.row}>
                  <Text variant="bodySmall" tone="muted">
                    {item.items.reduce((sum, line) => sum + line.quantity, 0)} items
                  </Text>
                  <Text variant="body">{formatPrice(item.subtotalMinor, item.currency)}</Text>
                </View>
                <Text variant="caption" tone="muted">
                  {item.id}
                </Text>
              </Card>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
