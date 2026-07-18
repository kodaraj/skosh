import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import type { Category } from '@/lib/data/types';
import { useTheme } from '@/theme/use-theme';
import { Skeleton } from './ui/skeleton';
import { Text } from './ui/text';

const TILE_SIZE = 88;
const SKELETON_COUNT = 5;

interface CategoryRailProps {
  categories: Category[] | undefined;
  isLoading: boolean;
}

/**
 * The horizontal category tiles on Home. Tapping a tile opens the Search tab
 * pre-filtered to that category.
 */
export function CategoryRail({ categories, isLoading }: CategoryRailProps) {
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg }}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} width={TILE_SIZE} height={TILE_SIZE + 24} radius={radii.md} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={(category) => category.id}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInRight.duration(300).delay(Math.min(index, 5) * 50)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Browse ${item.name}`}
            onPress={() =>
              router.push({ pathname: '/(tabs)/search', params: { category: item.id } })
            }
            style={({ pressed }) => [styles.tile, { opacity: pressed ? 0.7 : 1, gap: spacing.sm }]}
          >
            <Image
              source={item.image}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                borderRadius: radii.md,
                backgroundColor: colors.surfaceMuted,
              }}
              contentFit="cover"
              transition={200}
            />
            <Text variant="caption" tone="muted">
              {item.name}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
  },
});
