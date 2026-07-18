import { View, StyleSheet } from 'react-native';

import { PRICE_BUCKET_BOUNDS_MINOR } from '@/skosh.config';
import type { Category, ProductSort } from '@/lib/data/types';
import { formatPrice } from '@/lib/format-price';
import { useTheme } from '@/theme/use-theme';
import { BottomSheet } from './ui/bottom-sheet';
import { Button } from './ui/button';
import { Chip } from './ui/chip';
import { Text } from './ui/text';

const [LOW, MID, HIGH] = PRICE_BUCKET_BOUNDS_MINOR;

/** Price buckets offered in the filter sheet, built from the store config. */
export const PRICE_RANGES: { minPriceMinor?: number; maxPriceMinor?: number }[] = [
  { maxPriceMinor: LOW },
  { minPriceMinor: LOW, maxPriceMinor: MID },
  { minPriceMinor: MID, maxPriceMinor: HIGH },
  { minPriceMinor: HIGH },
];

const SORT_OPTIONS: { label: string; value: ProductSort }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price low to high', value: 'price-asc' },
  { label: 'Price high to low', value: 'price-desc' },
];

export interface ProductFilters {
  categoryId?: string;
  /** Index into PRICE_RANGES. */
  priceIndex?: number;
  sort: ProductSort;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  /** Currency for the price bucket labels. */
  currency: string;
}

function priceLabel(index: number, currency: string): string {
  const { minPriceMinor, maxPriceMinor } = PRICE_RANGES[index];
  if (minPriceMinor === undefined) return `Under ${formatPrice(maxPriceMinor!, currency)}`;
  if (maxPriceMinor === undefined) return `Over ${formatPrice(minPriceMinor, currency)}`;
  return `${formatPrice(minPriceMinor, currency)} to ${formatPrice(maxPriceMinor, currency)}`;
}

/**
 * The filter and sort bottom sheet on the Search tab. Selections apply
 * immediately; "Done" closes, "Clear all" resets everything but the sort.
 */
export function FilterSheet({
  visible,
  onClose,
  categories,
  filters,
  onChange,
  currency,
}: FilterSheetProps) {
  const { spacing } = useTheme();

  const section = (label: string, children: React.ReactNode) => (
    <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <View style={[styles.chips, { gap: spacing.sm }]}>{children}</View>
    </View>
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filter and sort">
      {section(
        'Category',
        categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            selected={filters.categoryId === category.id}
            onPress={() =>
              onChange({
                ...filters,
                categoryId: filters.categoryId === category.id ? undefined : category.id,
              })
            }
          />
        )),
      )}
      {section(
        'Price',
        PRICE_RANGES.map((range, index) => (
          <Chip
            key={priceLabel(index, currency)}
            label={priceLabel(index, currency)}
            selected={filters.priceIndex === index}
            onPress={() =>
              onChange({
                ...filters,
                priceIndex: filters.priceIndex === index ? undefined : index,
              })
            }
          />
        )),
      )}
      {section(
        'Sort by',
        SORT_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={filters.sort === option.value}
            onPress={() => onChange({ ...filters, sort: option.value })}
          />
        )),
      )}
      <View style={[styles.footer, { gap: spacing.md }]}>
        <Button
          title="Clear all"
          variant="ghost"
          onPress={() => onChange({ sort: 'newest' })}
          style={styles.footerButton}
        />
        <Button title="Done" onPress={onClose} style={styles.footerButton} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
  },
  footerButton: {
    flex: 1,
  },
});
