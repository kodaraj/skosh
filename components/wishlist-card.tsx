import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import { useProduct } from '@/lib/queries';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useTheme } from '@/theme/use-theme';
import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';
import { Button } from './ui/button';

interface WishlistCardProps {
  productId: string;
}

/**
 * A wishlist grid cell: the standard product card plus a move-to-cart action.
 * Moving adds the product's first variant and removes it from the wishlist.
 */
export function WishlistCard({ productId }: WishlistCardProps) {
  const { spacing } = useTheme();
  const { data: product, isLoading } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.remove);

  if (isLoading) return <ProductCardSkeleton />;
  if (!product) return null;

  const moveToCart = () => {
    const variant = product.variants[0];
    if (!variant) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(product, variant);
    removeFromWishlist(product.id);
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <ProductCard product={product} />
      <Button title="Move to cart" variant="secondary" onPress={moveToCart} />
    </View>
  );
}
