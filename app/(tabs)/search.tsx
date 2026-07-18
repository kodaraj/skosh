import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { FilterSheet, PRICE_RANGES, type ProductFilters } from '@/components/filter-sheet';
import { ProductGrid } from '@/components/product-grid';
import { useCategories, useProducts, useProductSearch } from '@/lib/queries';
import type { Product } from '@/lib/data/types';
import { useTheme } from '@/theme/use-theme';

function applyFilters(products: Product[] | undefined, filters: ProductFilters) {
  if (!products) return products;
  const range = filters.priceIndex === undefined ? {} : PRICE_RANGES[filters.priceIndex];
  const filtered = products.filter(
    (product) =>
      (filters.categoryId === undefined || product.categoryId === filters.categoryId) &&
      (range.minPriceMinor === undefined || product.priceMinor >= range.minPriceMinor) &&
      (range.maxPriceMinor === undefined || product.priceMinor <= range.maxPriceMinor),
  );
  return [...filtered].sort((a, b) => {
    if (filters.sort === 'price-asc') return a.priceMinor - b.priceMinor;
    if (filters.sort === 'price-desc') return b.priceMinor - a.priceMinor;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export default function SearchScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({ sort: 'newest' });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seenCategoryParam, setSeenCategoryParam] = useState<string>();

  // Category taps on Home land here with a param; fold it into filters once.
  if (params.category && params.category !== seenCategoryParam) {
    setSeenCategoryParam(params.category);
    setFilters((current) => ({ ...current, categoryId: params.category }));
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const categories = useCategories();
  const searching = debounced.trim().length > 0;
  const range = filters.priceIndex === undefined ? {} : PRICE_RANGES[filters.priceIndex];
  const browse = useProducts(
    { categoryId: filters.categoryId, sort: filters.sort, ...range },
    !searching,
  );
  const search = useProductSearch(debounced);

  const active = searching ? search : browse;
  const products = searching ? applyFilters(search.data, filters) : browse.data;
  const hasActiveFilters = filters.categoryId !== undefined || filters.priceIndex !== undefined;
  const currency = products?.[0]?.currency ?? 'USD';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          gap: spacing.md,
        }}
      >
        <View style={[styles.searchRow, { gap: spacing.md }]}>
          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.surfaceMuted,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.lg,
                gap: spacing.sm,
              },
            ]}
          >
            <Feather name="search" size={18} color={colors.textMuted} />
            <TextInput
              accessibilityLabel="Search products"
              placeholder="Search products"
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
              style={[styles.input, { color: colors.text, fontSize: typography.body.fontSize }]}
            />
            {query.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={spacing.sm}
                onPress={() => setQuery('')}
              >
                <Feather name="x" size={18} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filter and sort"
            onPress={() => setSheetOpen(true)}
            style={({ pressed }) => [
              styles.filterButton,
              {
                borderColor: hasActiveFilters ? colors.primary : colors.border,
                backgroundColor: hasActiveFilters ? colors.primary : colors.surface,
                borderRadius: radii.pill,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name="sliders"
              size={18}
              color={hasActiveFilters ? colors.onPrimary : colors.text}
            />
          </Pressable>
        </View>
      </View>
      <ProductGrid
        products={products}
        isLoading={active.isLoading}
        isError={active.isError}
        onRetry={() => active.refetch()}
        refreshing={active.isRefetching}
        onRefresh={() => active.refetch()}
        emptyState={
          searching ? (
            <EmptyState
              icon="search"
              title="No results"
              message={`Nothing matches "${debounced.trim()}". Try a different search.`}
            />
          ) : (
            <EmptyState
              icon="filter"
              title="No products found"
              message="No products match these filters."
              actionLabel="Clear filters"
              onAction={() => {
                setFilters({ sort: 'newest' });
                router.setParams({ category: undefined });
              }}
            />
          )
        }
      />
      <FilterSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        categories={categories.data ?? []}
        filters={filters}
        onChange={setFilters}
        currency={currency}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  filterButton: {
    borderWidth: 1,
    padding: 11,
  },
});
