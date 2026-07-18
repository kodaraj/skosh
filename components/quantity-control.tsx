import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';

import type { Product } from '@/lib/data/types';
import { useCartStore } from '@/store/cart-store';
import { useTheme } from '@/theme/use-theme';
import { Stepper } from './ui/stepper';

interface QuantityControlProps {
  product: Product;
}

/**
 * The quantity-first control on grocery-style product cards. Adds the
 * product's first variant on tap; once in the cart it becomes a stepper,
 * where stepping down to zero removes the line.
 */
export function QuantityControl({ product }: QuantityControlProps) {
  const { colors, radii, spacing } = useTheme();
  const variant = product.variants[0];
  const quantity = useCartStore(
    (state) =>
      state.items.find((item) => item.productId === product.id && item.variantId === variant?.id)
        ?.quantity ?? 0,
  );
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);

  if (!variant) return null;

  if (quantity === 0) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${product.name} to cart`}
        hitSlop={spacing.xs}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          addItem(product, variant);
        }}
        style={({ pressed }) => ({
          backgroundColor: colors.primary,
          borderRadius: radii.pill,
          padding: spacing.sm,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Feather name="plus" size={16} color={colors.onPrimary} />
      </Pressable>
    );
  }

  return (
    <Stepper
      value={quantity}
      min={0}
      onChange={(next) => setQuantity(product.id, variant.id, next)}
    />
  );
}
