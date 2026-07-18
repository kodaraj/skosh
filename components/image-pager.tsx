import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';

import { useTheme } from '@/theme/use-theme';

interface ImagePagerProps {
  images: string[];
  /** width / height of each page. Defaults to a 3:4 portrait. */
  aspectRatio?: number;
}

/**
 * The swipeable image gallery on the product detail screen, with dot indicators.
 */
export function ImagePager({ images, aspectRatio = 3 / 4 }: ImagePagerProps) {
  const { colors, spacing } = useTheme();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const height = width / aspectRatio;

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={(uri) => uri}
        onMomentumScrollEnd={(event) =>
          setPage(Math.round(event.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{ width, height, backgroundColor: colors.surfaceMuted }}
            contentFit="cover"
            transition={300}
          />
        )}
      />
      {images.length > 1 ? (
        <View style={[styles.dots, { gap: spacing.sm, bottom: spacing.md }]}>
          {images.map((uri, index) => (
            <View
              key={uri}
              style={[
                styles.dot,
                { backgroundColor: index === page ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)' },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
