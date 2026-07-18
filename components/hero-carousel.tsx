import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import type { Product } from '@/lib/data/types';
import { useTheme } from '@/theme/use-theme';
import { Skeleton } from './ui/skeleton';
import { Text } from './ui/text';

const HERO_ASPECT_RATIO = 0.8;

interface HeroCarouselProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

/**
 * The full-width paging banner at the top of Home, fed by featured products.
 */
export function HeroCarousel({ products, isLoading }: HeroCarouselProps) {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const height = width / HERO_ASPECT_RATIO;

  if (isLoading) {
    return <Skeleton width="100%" height={height} radius={0} />;
  }
  if (!products || products.length === 0) return null;

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={products}
        keyExtractor={(product) => product.id}
        onMomentumScrollEnd={(event) =>
          setPage(Math.round(event.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Shop ${item.name}`}
            onPress={() => router.push(`/product/${item.id}`)}
            style={{ width }}
          >
            <Image
              source={item.images[0]}
              style={{ width, height, backgroundColor: colors.surfaceMuted }}
              contentFit="cover"
              transition={300}
            />
            <View
              style={[styles.caption, { backgroundColor: colors.overlay, padding: spacing.lg }]}
            >
              <Text variant="caption" style={styles.inverseText}>
                Featured
              </Text>
              <Text variant="title" style={styles.inverseText} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </Pressable>
        )}
      />
      <View style={[styles.dots, { gap: spacing.sm, bottom: spacing.md }]}>
        {products.map((product, index) => (
          <View
            key={product.id}
            style={[
              styles.dot,
              { backgroundColor: index === page ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)' },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  inverseText: {
    color: '#FFFFFF',
  },
  dots: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
