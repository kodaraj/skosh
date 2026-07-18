import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Product, Variant } from '@/lib/data/types';
import { useTheme } from '@/theme/use-theme';
import { BottomSheet } from './ui/bottom-sheet';
import { Button } from './ui/button';
import { Chip } from './ui/chip';
import { Text } from './ui/text';

interface VariantSelectorProps {
  product: Product;
  selectedVariant: Variant;
  onSelect: (variant: Variant) => void;
}

function uniqueOption(variants: Variant[], key: 'size' | 'color'): string[] {
  return [...new Set(variants.map((variant) => variant.options[key]).filter(Boolean))] as string[];
}

/**
 * The variant picker on the product detail screen: a summary row that opens a
 * bottom sheet with size and color chips. Hidden for single-variant products.
 */
export function VariantSelector({ product, selectedVariant, onSelect }: VariantSelectorProps) {
  const { colors, radii, spacing } = useTheme();
  const [open, setOpen] = useState(false);
  const sizes = uniqueOption(product.variants, 'size');
  const colorOptions = uniqueOption(product.variants, 'color');

  if (product.variants.length <= 1) return null;

  const pick = (key: 'size' | 'color', value: string) => {
    const other = key === 'size' ? 'color' : 'size';
    const match =
      product.variants.find(
        (variant) =>
          variant.options[key] === value &&
          variant.options[other] === selectedVariant.options[other],
      ) ?? product.variants.find((variant) => variant.options[key] === value);
    if (match) onSelect(match);
  };

  const axis = (label: string, key: 'size' | 'color', values: string[]) =>
    values.length > 1 ? (
      <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <View style={[styles.chips, { gap: spacing.sm }]}>
          {values.map((value) => (
            <Chip
              key={value}
              label={value}
              selected={selectedVariant.options[key] === value}
              onPress={() => pick(key, value)}
            />
          ))}
        </View>
      </View>
    ) : null;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Change selection, currently ${selectedVariant.name}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            borderColor: colors.border,
            borderRadius: radii.md,
            padding: spacing.lg,
            opacity: pressed ? 0.6 : 1,
          },
        ]}
      >
        <Text variant="body">{selectedVariant.name}</Text>
        <Feather name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)} title="Select options">
        {axis('Size', 'size', sizes)}
        {axis('Color', 'color', colorOptions)}
        <Button title="Done" onPress={() => setOpen(false)} />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
