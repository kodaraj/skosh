import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View, type DimensionValue } from 'react-native';

import type { Product } from '@/lib/data/types';
import { formatPrice } from '@/lib/format-price';
import { useTheme } from '@/theme/use-theme';
import { QuantityControl } from './quantity-control';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { HeartToggle } from './ui/heart-toggle';
import { Text } from './ui/text';

const NEW_BADGE_WINDOW_MS = 45 * 24 * 60 * 60 * 1000;
/** Products created after this moment (app launch) count as "New". */
const NEW_BADGE_CUTOFF = Date.now() - NEW_BADGE_WINDOW_MS;

interface ProductCardProps {
  product: Product;
  /** Fixed width for rail usage; omit to fill the grid cell. */
  width?: DimensionValue;
}

/** Up to two variant-derived highlights for spec-style (electronics) cards. */
function specHighlights(product: Product): string[] {
  const sizes = [...new Set(product.variants.map((v) => v.options.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.options.color).filter(Boolean))];
  const specs: string[] = [];
  if (sizes.length > 1) specs.push(`${sizes.length} options`);
  else if (sizes[0] && sizes[0] !== 'One Size') specs.push(sizes[0]!);
  if (colors.length > 1) specs.push(`${colors.length} colors`);
  else if (colors[0]) specs.push(colors[0]!);
  return specs.slice(0, 2);
}

/**
 * The product card used in every grid and rail. The active template's
 * `productCard` tokens choose the layout: `editorial` (image-forward),
 * `quantity` (stepper on card), or `spec` (variant highlights).
 */
export function ProductCard({ product, width }: ProductCardProps) {
  const { colors, components, spacing } = useTheme();
  const router = useRouter();
  const { variant: cardVariant, imageAspectRatio } = components.productCard;
  const isNew = new Date(product.createdAt).getTime() > NEW_BADGE_CUTOFF;
  const price = formatPrice(product.priceMinor, product.currency);

  return (
    <Card
      onPress={() => router.push(`/product/${product.id}`)}
      accessibilityLabel={`${product.name}, ${price}`}
      style={[{ width }, !width && styles.fill]}
    >
      <View>
        <Image
          source={product.images[0]}
          style={{
            width: '100%',
            aspectRatio: imageAspectRatio,
            backgroundColor: colors.surfaceMuted,
          }}
          contentFit="cover"
          transition={200}
        />
        {isNew ? <Badge label="New" style={[styles.badge, { margin: spacing.sm }]} /> : null}
        <View style={[styles.heart, { margin: spacing.sm }]}>
          <HeartToggle productId={product.id} size={18} chip />
        </View>
      </View>
      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        <Text variant="bodySmall" numberOfLines={1}>
          {product.name}
        </Text>
        {cardVariant === 'spec' && specHighlights(product).length > 0 ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {specHighlights(product).join('  ·  ')}
          </Text>
        ) : null}
        {cardVariant === 'quantity' ? (
          <View style={styles.priceRow}>
            <Text variant="heading">{price}</Text>
            <QuantityControl product={product} />
          </View>
        ) : (
          <Text variant="bodySmall" tone="muted">
            {price}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heart: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
