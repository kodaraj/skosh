import { createMockProvider } from './providers/mock';
import { createRestProvider } from './providers/rest';
import { createSupabaseProvider } from './providers/supabase';
import type { DataProvider } from './types';

export * from './types';

const providerName = process.env.EXPO_PUBLIC_DATA_PROVIDER ?? 'mock';

function createProvider(): DataProvider {
  switch (providerName) {
    case 'mock':
      return createMockProvider();
    case 'supabase':
      return createSupabaseProvider();
    case 'rest':
      return createRestProvider();
    default:
      throw new Error(
        `Unknown EXPO_PUBLIC_DATA_PROVIDER "${providerName}". Expected "mock", "supabase", or "rest".`,
      );
  }
}

/**
 * The app-wide DataProvider instance, selected by EXPO_PUBLIC_DATA_PROVIDER.
 * Import this from screens and hooks; never import a concrete provider directly.
 */
export const dataProvider: DataProvider = createProvider();
