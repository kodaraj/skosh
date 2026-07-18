import type { CartItem, Category, DataProvider, Order, Product, QueryOpts } from '../types';

/**
 * Skeleton provider for connecting your own REST API.
 *
 * Fill in the TODOs below, map your responses to the types in `lib/data/types.ts`,
 * then set EXPO_PUBLIC_DATA_PROVIDER=rest and EXPO_PUBLIC_API_BASE_URL in .env.
 * Nothing outside this file needs to change.
 */
export function createRestProvider(): DataProvider {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL is not set. Add it to your .env to use the rest provider.',
    );
  }

  async function request<T>(path: string): Promise<T> {
    // TODO: add auth headers, retries, or error mapping as your API requires.
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  return {
    async getProducts(opts: QueryOpts = {}): Promise<Product[]> {
      // TODO: translate opts (categoryId, featured, price bounds, sort, limit)
      // into your API's query parameters.
      const params = new URLSearchParams();
      if (opts.categoryId) params.set('category', opts.categoryId);
      if (opts.limit !== undefined) params.set('limit', String(opts.limit));
      const query = params.toString();
      return request<Product[]>(`/products${query ? `?${query}` : ''}`);
    },

    async getProduct(id: string): Promise<Product | null> {
      // TODO: return null (not an error) when your API responds 404.
      return request<Product>(`/products/${encodeURIComponent(id)}`);
    },

    async getCategories(): Promise<Category[]> {
      return request<Category[]>('/categories');
    },

    async searchProducts(q: string): Promise<Product[]> {
      return request<Product[]>(`/products/search?q=${encodeURIComponent(q)}`);
    },

    async createOrder(cart: CartItem[]): Promise<Order> {
      // TODO: POST the cart to your orders endpoint and return the created order.
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      if (!response.ok) {
        throw new Error(`Order creation failed with status ${response.status}`);
      }
      return response.json() as Promise<Order>;
    },
  };
}
