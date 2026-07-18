import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme/use-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  /** When set, the card becomes pressable with a gentle scale-down effect. */
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A themed surface container. Pass `onPress` to make it an animated pressable,
 * used by product cards and list tiles.
 */
export function Card({ children, onPress, accessibilityLabel, style }: CardProps) {
  const { colors, radii } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.02 }],
    opacity: 1 - pressed.value * 0.08,
  }));

  const surface: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    overflow: 'hidden',
  };

  if (!onPress) {
    return <View style={[surface, style]}>{children}</View>;
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => (pressed.value = withTiming(1, { duration: 90 }))}
      onPressOut={() => (pressed.value = withTiming(0, { duration: 140 }))}
      style={[surface, animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
