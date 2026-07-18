import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme/use-theme';
import { Text } from './text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  /** primary = filled, secondary = outlined, ghost = text only. */
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Shows a small inline spinner and blocks presses. */
  loading?: boolean;
  style?: ViewStyle;
}

/**
 * The app-wide button with a subtle press-down scale animation.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { colors, radii, spacing } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.03 }],
    opacity: 1 - pressed.value * 0.1,
  }));

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    ghost: { backgroundColor: 'transparent' },
  };
  const inactive = disabled || loading;
  const textTone = variant === 'primary' ? 'onPrimary' : 'default';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      onPressIn={() => (pressed.value = withTiming(1, { duration: 90 }))}
      onPressOut={() => (pressed.value = withTiming(0, { duration: 140 }))}
      style={[
        styles.base,
        {
          borderRadius: radii.md,
          paddingVertical: spacing.md + 2,
          paddingHorizontal: spacing.xl,
          opacity: disabled ? 0.45 : 1,
        },
        variantStyles[variant],
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.onPrimary : colors.text}
        />
      ) : (
        <Text variant="button" tone={textTone}>
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
