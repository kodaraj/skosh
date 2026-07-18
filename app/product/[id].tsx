import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/error-state';
import { ImagePager } from '@/components/image-pager';
import { ProductRail } from '@/components/product-rail';
import { VariantSelector } from '@/components/variant-selector';
import { Button } from '@/components/ui/button';
import { HeartToggle } from '@/components/ui/heart-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { formatPrice } from '@/lib/format-price';
import { useProduct, useProducts } from '@/lib/queries';
import { useCartStore } from '@/store/cart-store';
import { useTheme } from '@/theme/use-theme';

const ADDED_FEEDBACK_MS = 1600;

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const related = useProducts({ categoryId: product?.categoryId }, Boolean(product));
  const addItem = useCartStore((state) => state.addItem);

  const [variantId, setVariantId] = useState<string>();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [added]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Skeleton aspectRatio={3 / 4} radius={0} />
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Skeleton width="70%" height={22} />
          <Skeleton width="30%" height={18} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="85%" height={14} />
        </View>
      </View>
    );
  }
  if (isError || !product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <ErrorState onRetry={refetch} message="We could not load this product." />
      </View>
    );
  }

  const variant = product.variants.find((entry) => entry.id === variantId) ?? product.variants[0];
  const priceMinor = variant?.priceOverrideMinor ?? product.priceMinor;
  const relatedProducts = related.data?.filter((entry) => entry.id !== product.id).slice(0, 6);

  const addToCart = () => {
    if (!variant) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(product, variant);
    setAdded(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <ImagePager images={product.images} />
        <Animated.View
          entering={FadeInDown.duration(350)}
          style={{ padding: spacing.lg, gap: spacing.md }}
        >
          <Text variant="title">{product.name}</Text>
          <Text variant="heading">{formatPrice(priceMinor, product.currency)}</Text>
          <Text variant="body" tone="muted">
            {product.description}
          </Text>
          {variant ? (
            <VariantSelector
              product={product}
              selectedVariant={variant}
              onSelect={(next) => setVariantId(next.id)}
            />
          ) : null}
        </Animated.View>
        <ProductRail
          title="You may also like"
          products={relatedProducts}
          isLoading={related.isLoading}
        />
      </ScrollView>
      <View
        style={[styles.topBar, { top: insets.top + spacing.sm, paddingHorizontal: spacing.lg }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backChip,
            { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <HeartToggle productId={product.id} chip />
      </View>
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            padding: spacing.lg,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        <Button
          title={added ? 'Added to cart' : 'Add to cart'}
          onPress={addToCart}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backChip: {
    borderRadius: 999,
    padding: 8,
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addButton: {
    width: '100%',
  },
});
