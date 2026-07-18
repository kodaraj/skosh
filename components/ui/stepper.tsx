import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { Text } from './text';

interface StepperProps {
  value: number;
  /** Called with the next value after + or - is pressed. */
  onChange: (next: number) => void;
  /** Decrementing below this is blocked. Set 0 to let parents treat 0 as "remove". */
  min?: number;
  max?: number;
}

/**
 * A quantity stepper used in the cart and on grocery-style product cards.
 */
export function Stepper({ value, onChange, min = 1, max = 99 }: StepperProps) {
  const { colors, radii, spacing } = useTheme();

  const step = (delta: number) => {
    const next = value + delta;
    if (next < min || next > max) return;
    Haptics.selectionAsync();
    onChange(next);
  };

  const buttonStyle = {
    padding: spacing.sm,
    borderRadius: radii.pill,
  };

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: colors.border,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.xs,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={value <= min}
        onPress={() => step(-1)}
        style={({ pressed }) => [buttonStyle, { opacity: value <= min ? 0.3 : pressed ? 0.5 : 1 }]}
      >
        <Feather name="minus" size={16} color={colors.text} />
      </Pressable>
      <Text variant="heading" style={styles.value} accessibilityLiveRegion="polite">
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        disabled={value >= max}
        onPress={() => step(1)}
        style={({ pressed }) => [buttonStyle, { opacity: value >= max ? 0.3 : pressed ? 0.5 : 1 }]}
      >
        <Feather name="plus" size={16} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  value: {
    minWidth: 32,
    textAlign: 'center',
  },
});
