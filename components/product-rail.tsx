import { FlatList, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import type { Product } from '@/lib/data/types';
import { useTheme } from '@/theme/use-theme';
import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';
import { SectionHeader } from './section-header';

const CARD_WIDTH = 180;
const SKELETON_COUNT = 3;

interface ProductRailProps {
  title: string;
  products: Product[] | undefined;
  isLoading: boolean;
  onSeeAll?: () => void;
}

/**
 * A horizontal product carousel with a section title, used on Home and for
 * related products. Shows card skeletons while loading.
 */
export function ProductRail({ title, products, isLoading, onSeeAll }: ProductRailProps) {
  const { spacing } = useTheme();

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <View>
      <SectionHeader
        title={title}
        actionLabel={onSeeAll ? 'View all' : undefined}
        onAction={onSeeAll}
      />
      {isLoading ? (
        <View style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg }}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProductCardSkeleton key={index} width={CARD_WIDTH} />
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={products}
          keyExtractor={(product) => product.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.duration(300).delay(Math.min(index, 4) * 60)}>
              <ProductCard product={item} width={CARD_WIDTH} />
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}
