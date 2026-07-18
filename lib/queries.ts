import { useQuery } from '@tanstack/react-query';

import { dataProvider } from './data';
import type { QueryOpts } from './data';

/**
 * TanStack Query hooks over the active DataProvider. Screens use these
 * exclusively; they never call the provider (or a backend) directly.
 */

export function useProducts(opts?: QueryOpts, enabled = true) {
  return useQuery({
    queryKey: ['products', opts ?? {}],
    queryFn: () => dataProvider.getProducts(opts),
    enabled,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => dataProvider.getProduct(id),
    enabled: id.length > 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => dataProvider.getCategories(),
  });
}

/** Runs only when the query is non-empty; callers debounce the input. */
export function useProductSearch(q: string) {
  const query = q.trim();
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => dataProvider.searchProducts(query),
    enabled: query.length > 0,
  });
}
