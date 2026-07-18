import { ACTIVE_TEMPLATE } from '@/skosh.config';
import electronicsCategories from '../mock/electronics/categories.json';
import electronicsProducts from '../mock/electronics/products.json';
import fashionCategories from '../mock/fashion/categories.json';
import fashionProducts from '../mock/fashion/products.json';
import groceryCategories from '../mock/grocery/categories.json';
import groceryProducts from '../mock/grocery/products.json';
import type { CartItem, Category, DataProvider, Order, Product, QueryOpts } from '../types';

/** Each template ships a catalog for its vertical; the active one is served. */
const catalogs = {
  fashion: { products: fashionProducts, categories: fashionCategories },
  grocery: { products: groceryProducts, categories: groceryCategories },
  electronics: { products: electronicsProducts, categories: electronicsCategories },
} as const;

const catalog = catalogs[ACTIVE_TEMPLATE] ?? catalogs.fashion;
const products = catalog.products as Product[];
const categories = catalog.categories as Category[];

/** Simulated network latency so loading and skeleton states behave realistically. */
const ARTIFICIAL_DELAY_MS = 400;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY_MS));
}

function sortProducts(list: Product[], sort: QueryOpts['sort'] = 'newest'): Product[] {
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.priceMinor - b.priceMinor);
    case 'price-desc':
      return sorted.sort((a, b) => b.priceMinor - a.priceMinor);
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

/**
 * The default provider. Serves the bundled JSON in `lib/data/mock/` with a
 * short artificial delay, so the app runs fully offline with zero setup.
 * Replace the JSON files with your own products to reskin the catalog.
 */
export function createMockProvider(): DataProvider {
  return {
    async getProducts(opts: QueryOpts = {}): Promise<Product[]> {
      await delay();
      let result = products.filter(
        (p) =>
          (opts.categoryId === undefined || p.categoryId === opts.categoryId) &&
          (opts.featured === undefined || p.featured === opts.featured) &&
          (opts.minPriceMinor === undefined || p.priceMinor >= opts.minPriceMinor) &&
          (opts.maxPriceMinor === undefined || p.priceMinor <= opts.maxPriceMinor),
      );
      result = sortProducts(result, opts.sort);
      return opts.limit === undefined ? result : result.slice(0, opts.limit);
    },

    async getProduct(id: string): Promise<Product | null> {
      await delay();
      return products.find((p) => p.id === id) ?? null;
    },

    async getCategories(): Promise<Category[]> {
      await delay();
      return categories;
    },

    async searchProducts(q: string): Promise<Product[]> {
      await delay();
      const query = q.trim().toLowerCase();
      if (!query) return [];
      return products.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
      );
    },

    async createOrder(cart: CartItem[]): Promise<Order> {
      await delay();
      const subtotalMinor = cart.reduce(
        (sum, item) => sum + item.priceSnapshotMinor * item.quantity,
        0,
      );
      return {
        id: `ord-${Date.now().toString(36)}`,
        items: cart,
        subtotalMinor,
        currency: products[0]?.currency ?? 'USD',
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };
    },
  };
}
