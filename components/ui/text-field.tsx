import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { Text } from './text';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

/**
 * A themed labeled input used by the auth and checkout forms.
 */
export function TextField({ label, error, style, ...rest }: TextFieldProps) {
  const { colors, radii, spacing, typography } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[
          {
            backgroundColor: colors.surfaceMuted,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: error ? colors.danger : 'transparent',
            color: colors.text,
            fontSize: typography.body.fontSize,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="bodySmall" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
