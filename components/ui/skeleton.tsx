import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme/use-theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  /** width / height ratio for image placeholders. Takes precedence over height. */
  aspectRatio?: number;
  /** Corner radius. Defaults to the theme's small radius. */
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * A pulsing placeholder block. Compose several to mirror the layout of the
 * content being loaded; never show spinners for async content.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  aspectRatio,
  radius,
  style,
}: SkeletonProps) {
  const { colors, radii } = useTheme();
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value * 0.45,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          ...(aspectRatio ? { aspectRatio } : { height }),
          borderRadius: radius ?? radii.sm,
          backgroundColor: colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
