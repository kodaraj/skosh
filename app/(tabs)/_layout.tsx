import { Feather } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { useAppStore } from '@/store/app-store';
import { selectCartCount, useCartStore } from '@/store/cart-store';
import { useTheme } from '@/theme/use-theme';

export default function TabsLayout() {
  const { colors } = useTheme();
  const cartCount = useCartStore(selectCartCount);
  const hydrated = useAppStore((state) => state.hydrated);
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);

  // Hold rendering until persisted state loads, then gate first launches.
  if (!hydrated) return null;
  if (!hasOnboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Feather name="shopping-bag" size={size} color={color} />
          ),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.primary, color: colors.onPrimary },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
