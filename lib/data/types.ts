/**
 * Domain models and the DataProvider contract.
 *
 * Screens and components never talk to a backend directly. They consume a
 * DataProvider, and the active implementation is selected in `lib/data/index.ts`
 * via the EXPO_PUBLIC_DATA_PROVIDER environment variable.
 *
 * All monetary amounts are integers in minor units (cents for USD) and are
 * formatted exclusively through `formatPrice` in `lib/format-price.ts`.
 */

/** Sort orders accepted by product queries. */
export type ProductSort = 'newest' | 'price-asc' | 'price-desc';

/** Optional filters for `getProducts`. All fields combine with AND semantics. */
export interface QueryOpts {
  /** Restrict results to a single category. */
  categoryId?: string;
  /** Only products flagged for the home screen's featured rail. */
  featured?: boolean;
  /** Inclusive lower price bound, in minor units. */
  minPriceMinor?: number;
  /** Inclusive upper price bound, in minor units. */
  maxPriceMinor?: number;
  /** Sort order. Defaults to `newest`. */
  sort?: ProductSort;
  /** Maximum number of products to return. */
  limit?: number;
}

/** The option axes a variant can vary on. */
export interface VariantOptions {
  size?: string;
  color?: string;
}

/** A purchasable variation of a product, e.g. "M / Black". */
export interface Variant {
  id: string;
  /** Display name, e.g. "M / Black". */
  name: string;
  options: VariantOptions;
  /** Overrides the parent product's price when set, in minor units. */
  priceOverrideMinor?: number;
  /** Variant-specific image URL, when it differs from the product images. */
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Base price in minor units. Variants may override it. */
  priceMinor: number;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  /** Image URLs, first entry is the primary image. */
  images: string[];
  categoryId: string;
  variants: Variant[];
  /** Shown in the home screen's featured rail. */
  featured: boolean;
  /** ISO 8601 timestamp, drives "new arrivals" ordering. */
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  /** Image URL for category tiles and rails. */
  image: string;
}

/** A line in the cart. The price is snapshotted at add-to-cart time. */
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  /** Unit price at the moment the item was added, in minor units. */
  priceSnapshotMinor: number;
}

export interface WishlistItem {
  productId: string;
  /** ISO 8601 timestamp of when the product was saved. */
  addedAt: string;
}

export type OrderStatus = 'confirmed' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  /** Sum of line totals in minor units. */
  subtotalMinor: number;
  /** ISO 4217 currency code shared by all items. */
  currency: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
  status: OrderStatus;
}

/**
 * The single boundary between the app and any backend.
 *
 * Implementations live in `lib/data/providers/`. To connect your own API,
 * implement these five methods in `providers/rest.ts` and set
 * EXPO_PUBLIC_DATA_PROVIDER=rest.
 */
export interface DataProvider {
  getProducts(opts?: QueryOpts): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  searchProducts(q: string): Promise<Product[]>;
  createOrder(cart: CartItem[]): Promise<Order>;
}
