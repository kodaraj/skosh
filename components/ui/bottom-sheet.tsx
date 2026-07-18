import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/use-theme';
import { Text } from './text';

const SLIDE_DISTANCE = 480;
const DISMISS_DRAG_DISTANCE = 120;

interface BottomSheetProps {
  visible: boolean;
  /** Called when the user taps the scrim, drags down, or the system requests close. */
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * A lightweight bottom sheet for variant selection and filters. Slides up over
 * a scrim, dismisses on scrim tap or drag-down. Content height fits itself.
 */
export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  const { colors, radii, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the modal must mount before the entrance animation can run
      setMounted(true);
      dragY.value = 0;
      progress.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
    } else if (mounted) {
      progress.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
  }, [visible, mounted, progress, dragY]);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      dragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (dragY.value > DISMISS_DRAG_DISTANCE || event.velocityY > 800) {
        runOnJS(onClose)();
      } else {
        dragY.value = withTiming(0, { duration: 180 });
      }
    });

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * SLIDE_DISTANCE + dragY.value }],
  }));

  if (!mounted) return null;

  return (
    <Modal transparent statusBarTranslucent visible onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.scrim, { backgroundColor: colors.overlay }, scrimStyle]}>
          <Pressable accessibilityLabel="Close" style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.panel,
              {
                backgroundColor: colors.surface,
                borderTopLeftRadius: radii.lg,
                borderTopRightRadius: radii.lg,
                paddingBottom: insets.bottom + spacing.lg,
                paddingHorizontal: spacing.lg,
              },
              panelStyle,
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            {title ? (
              <Text variant="heading" style={{ marginBottom: spacing.md }}>
                {title}
              </Text>
            ) : null}
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panel: {
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
});
