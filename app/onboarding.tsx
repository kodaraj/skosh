import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppStore } from '@/store/app-store';
import { useTheme } from '@/theme/use-theme';

const SLIDES = [
  {
    key: 'curated',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80',
    title: 'Curated for you',
    message: 'A storefront with taste. Browse editorial collections, save what you love.',
  },
  {
    key: 'effortless',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
    title: 'Effortless shopping',
    message: 'Pick your size and color, add to cart, and check out in a few taps.',
  },
  {
    key: 'yours',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80',
    title: 'Make it yours',
    message: 'Wishlist, order history, dark mode, and themes that follow your style.',
  },
];

export default function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const listRef = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  const lastSlide = page === SLIDES.length - 1;

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const next = () => {
    if (lastSlide) {
      finish();
    } else {
      listRef.current?.scrollToIndex({ index: page + 1, animated: true });
    }
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <View style={[styles.skipRow, { paddingHorizontal: spacing.lg }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          hitSlop={spacing.sm}
          onPress={finish}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text variant="caption" tone="muted">
            Skip
          </Text>
        </Pressable>
      </View>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={SLIDES}
        keyExtractor={(slide) => slide.key}
        onMomentumScrollEnd={(event) =>
          setPage(Math.round(event.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <View style={{ width, padding: spacing.lg, gap: spacing.xl }}>
            <Image
              source={item.image}
              style={[styles.image, { backgroundColor: colors.surfaceMuted }]}
              contentFit="cover"
              transition={300}
            />
            <View style={{ gap: spacing.sm }}>
              <Text variant="display">{item.title}</Text>
              <Text variant="body" tone="muted">
                {item.message}
              </Text>
            </View>
          </View>
        )}
      />
      <View style={[styles.footer, { paddingHorizontal: spacing.lg, gap: spacing.lg }]}>
        <View style={[styles.dots, { gap: spacing.sm }]}>
          {SLIDES.map((slide, index) => (
            <View
              key={slide.key}
              style={[
                styles.dot,
                { backgroundColor: index === page ? colors.text : colors.border },
              ]}
            />
          ))}
        </View>
        <Button title={lastSlide ? 'Get started' : 'Next'} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  skipRow: {
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
  },
  footer: {
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
