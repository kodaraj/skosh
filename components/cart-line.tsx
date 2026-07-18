import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CartItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/format-price';
import { useProduct } from '@/lib/queries';
import { useCartStore } from '@/store/cart-store';
import { useTheme } from '@/theme/use-theme';
import { Skeleton } from './ui/skeleton';
import { Stepper } from './ui/stepper';
import { Text } from './ui/text';

const IMAGE_WIDTH = 84;

interface CartLineProps {
  item: CartItem;
}

/**
 * One cart row: product image, variant, quantity stepper, line total, remove.
 */
export function CartLine({ item }: CartLineProps) {
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(item.productId);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (isLoading) {
    return (
      <View style={[styles.row, { gap: spacing.md }]}>
        <Skeleton width={IMAGE_WIDTH} aspectRatio={3 / 4} radius={radii.md} />
        <View style={[styles.info, { gap: spacing.sm }]}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="35%" height={12} />
        </View>
      </View>
    );
  }
  if (!product) return null;

  const variant = product.variants.find((entry) => entry.id === item.variantId);

  const remove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removeItem(item.productId, item.variantId);
  };

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${product.name}`}
        onPress={() => router.push(`/product/${product.id}`)}
      >
        <Image
          source={variant?.image ?? product.images[0]}
          style={{
            width: IMAGE_WIDTH,
            aspectRatio: 3 / 4,
            borderRadius: radii.md,
            backgroundColor: colors.surfaceMuted,
          }}
          contentFit="cover"
          transition={200}
        />
      </Pressable>
      <View style={[styles.info, { gap: spacing.sm }]}>
        <Text variant="body" numberOfLines={1}>
          {product.name}
        </Text>
        {variant && product.variants.length > 1 ? (
          <Text variant="bodySmall" tone="muted">
            {variant.name}
          </Text>
        ) : null}
        <Stepper
          value={item.quantity}
          onChange={(next) => setQuantity(item.productId, item.variantId, next)}
        />
      </View>
      <View style={[styles.side, { gap: spacing.md }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${product.name} from cart`}
          hitSlop={spacing.sm}
          onPress={remove}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Feather name="x" size={18} color={colors.textMuted} />
        </Pressable>
        <Text variant="heading">
          {formatPrice(item.priceSnapshotMinor * item.quantity, product.currency)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  side: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});
