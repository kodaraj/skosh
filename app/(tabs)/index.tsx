import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryRail } from '@/components/category-rail';
import { ErrorState } from '@/components/error-state';
import { HeroCarousel } from '@/components/hero-carousel';
import { ProductCard } from '@/components/product-card';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { ProductRail } from '@/components/product-rail';
import { SectionHeader } from '@/components/section-header';
import { Text } from '@/components/ui/text';
import { useCategories, useProducts } from '@/lib/queries';
import { useTheme } from '@/theme/use-theme';

const NEW_ARRIVALS_LIMIT = 6;

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const categories = useCategories();
  const featured = useProducts({ featured: true });
  const arrivals = useProducts({ sort: 'newest', limit: NEW_ARRIVALS_LIMIT });

  const onRefresh = () => {
    categories.refetch();
    featured.refetch();
    arrivals.refetch();
  };
  const refreshing = categories.isRefetching && featured.isRefetching;
  const allFailed = categories.isError && featured.isError && arrivals.isError;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg }}>
        <Text variant="display">Skosh</Text>
      </View>
      {allFailed ? (
        <ErrorState onRetry={onRefresh} />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxl }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.textMuted}
            />
          }
        >
          <HeroCarousel products={featured.data?.slice(0, 3)} isLoading={featured.isLoading} />
          <View style={{ height: spacing.xl }} />
          <SectionHeader title="Categories" />
          <CategoryRail categories={categories.data} isLoading={categories.isLoading} />
          <View style={{ height: spacing.xl }} />
          <ProductRail
            title="Featured"
            products={featured.data}
            isLoading={featured.isLoading}
            onSeeAll={() => router.push('/(tabs)/search')}
          />
          <View style={{ height: spacing.xl }} />
          <SectionHeader title="New arrivals" />
          <View style={[styles.grid, { paddingHorizontal: spacing.lg, gap: spacing.md }]}>
            {arrivals.isLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <View key={index} style={styles.cell}>
                    <ProductCardSkeleton />
                  </View>
                ))
              : arrivals.data?.map((product, index) => (
                  <Animated.View
                    key={product.id}
                    entering={FadeInDown.duration(300).delay(Math.min(index, 6) * 50)}
                    style={styles.cell}
                  >
                    <ProductCard product={product} />
                  </Animated.View>
                ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '48%',
    flexGrow: 1,
  },
});
