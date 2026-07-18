import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useCheckoutStore, type Address } from '@/store/checkout-store';
import { useTheme } from '@/theme/use-theme';

const EMPTY_ADDRESS: Address = {
  fullName: '',
  line1: '',
  city: '',
  postalCode: '',
  country: '',
};

const FIELD_LABELS: Record<keyof Address, string> = {
  fullName: 'Full name',
  line1: 'Street address',
  city: 'City',
  postalCode: 'Postal code',
  country: 'Country',
};

export default function CheckoutAddressScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setAddress = useCheckoutStore((state) => state.setAddress);

  const [address, setLocalAddress] = useState<Address>(
    useCheckoutStore.getState().address ?? EMPTY_ADDRESS,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const submit = () => {
    const nextErrors: typeof errors = {};
    for (const key of Object.keys(FIELD_LABELS) as (keyof Address)[]) {
      if (!address[key].trim()) nextErrors[key] = `${FIELD_LABELS[key]} is required`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setAddress(address);
    router.push('/checkout/summary');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScreenHeader title="Delivery address" />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        {(Object.keys(FIELD_LABELS) as (keyof Address)[]).map((key) => (
          <TextField
            key={key}
            label={FIELD_LABELS[key]}
            value={address[key]}
            error={errors[key]}
            autoCapitalize={key === 'postalCode' ? 'characters' : 'words'}
            onChangeText={(value) => setLocalAddress((current) => ({ ...current, [key]: value }))}
          />
        ))}
      </ScrollView>
      <View style={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.md }}>
        <Button title="Continue to summary" onPress={submit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
