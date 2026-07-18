import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { Product } from '@/lib/data/types';
import { useTheme } from '@/theme/use-theme';
import { ErrorState } from './error-state';
import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';

const SKELETON_COUNT = 6;

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
  /** Rendered when loading succeeded but there are no products. */
  emptyState: React.ReactElement;
}

/**
 * The standard two-column product grid with skeleton, error, empty, and
 * pull-to-refresh states built in. Used by Search and category browsing.
 */
export function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
  refreshing,
  onRefresh,
  emptyState,
}: ProductGridProps) {
  const { colors, spacing } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.skeletonGrid, { padding: spacing.lg, gap: spacing.md }]}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <View key={index} style={styles.skeletonCell}>
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    );
  }
  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(product) => product.id}
      columnWrapperStyle={{ gap: spacing.md }}
      contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.md }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.textMuted}
        />
      }
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInDown.duration(300).delay(Math.min(index, 6) * 50)}
          style={styles.cell}
        >
          <ProductCard product={item} />
        </Animated.View>
      )}
      ListEmptyComponent={emptyState}
    />
  );
}

const styles = StyleSheet.create({
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skeletonCell: {
    width: '47%',
  },
  cell: {
    flex: 1,
    maxWidth: '48%',
  },
  content: {
    flexGrow: 1,
  },
});
