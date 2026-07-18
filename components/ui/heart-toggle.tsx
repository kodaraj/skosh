import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useAuthStore } from '@/store/auth-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useTheme } from '@/theme/use-theme';

interface HeartToggleProps {
  productId: string;
  size?: number;
  /** Renders a circular surface chip behind the icon, for use over images. */
  chip?: boolean;
}

/**
 * The wishlist heart. Reads membership straight from the wishlist store, so
 * every instance for the same product stays in sync across screens. Saving
 * requires an account: signed-out users are prompted to sign in first.
 */
export function HeartToggle({ productId, size = 20, chip = false }: HeartToggleProps) {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isWishlisted = useWishlistStore((state) =>
    state.items.some((item) => item.productId === productId),
  );
  const toggle = useWishlistStore((state) => state.toggle);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => {
    if (!user) {
      Alert.alert('Sign in to save items', 'Your wishlist lives in your account.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withSpring(1.3, { damping: 12, stiffness: 400 }),
      withSpring(1, { damping: 14, stiffness: 300 }),
    );
    toggle(productId);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      accessibilityState={{ selected: isWishlisted }}
      hitSlop={spacing.sm}
      onPress={onPress}
      style={chip && [styles.chip, { backgroundColor: colors.surface, padding: spacing.sm }]}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={isWishlisted ? 'heart' : 'heart-outline'}
          size={size}
          color={isWishlisted ? colors.danger : colors.text}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
  },
});
