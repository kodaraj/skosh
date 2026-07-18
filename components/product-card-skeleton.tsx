import { View, type DimensionValue } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { Skeleton } from './ui/skeleton';

interface ProductCardSkeletonProps {
  width?: DimensionValue;
}

/**
 * Loading placeholder matching ProductCard's layout and image ratio.
 */
export function ProductCardSkeleton({ width }: ProductCardSkeletonProps) {
  const { components, radii, spacing } = useTheme();

  return (
    <View style={[{ width }, !width && { flex: 1 }, { gap: spacing.sm }]}>
      <Skeleton aspectRatio={components.productCard.imageAspectRatio} radius={radii.md} />
      <Skeleton width="70%" height={14} />
      <Skeleton width="40%" height={14} />
    </View>
  );
}
