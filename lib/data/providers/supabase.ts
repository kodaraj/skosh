import { createClient } from '@supabase/supabase-js';

import type {
  CartItem,
  Category,
  DataProvider,
  Order,
  OrderStatus,
  Product,
  QueryOpts,
  Variant,
} from '../types';

/** Row shapes as returned by the schema in supabase/schema.sql. */
interface VariantRow {
  id: string;
  name: string;
  options: Variant['options'];
  price_override_minor: number | null;
  image: string | null;
}

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price_minor: number;
  currency: string;
  images: string[];
  category_id: string;
  featured: boolean;
  created_at: string;
  variants: VariantRow[];
}

const PRODUCT_SELECT =
  'id, name, description, price_minor, currency, images, category_id, featured, created_at, variants (id, name, options, price_override_minor, image)';

function mapVariant(row: VariantRow): Variant {
  return {
    id: row.id,
    name: row.name,
    options: row.options,
    ...(row.price_override_minor === null ? {} : { priceOverrideMinor: row.price_override_minor }),
    ...(row.image === null ? {} : { image: row.image }),
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceMinor: row.price_minor,
    currency: row.currency,
    images: row.images,
    categoryId: row.category_id,
    variants: row.variants.map(mapVariant),
    featured: row.featured,
    createdAt: row.created_at,
  };
}

/**
 * Reference implementation against the schema in supabase/schema.sql.
 * Requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.
 */
export function createSupabaseProvider(): DataProvider {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set to use the supabase provider.',
    );
  }
  // No Supabase Auth session is used, so session persistence stays off.
  const client = createClient(url, anonKey, { auth: { persistSession: false } });

  return {
    async getProducts(opts: QueryOpts = {}): Promise<Product[]> {
      let query = client.from('products').select(PRODUCT_SELECT);
      if (opts.categoryId !== undefined) query = query.eq('category_id', opts.categoryId);
      if (opts.featured !== undefined) query = query.eq('featured', opts.featured);
      if (opts.minPriceMinor !== undefined) query = query.gte('price_minor', opts.minPriceMinor);
      if (opts.maxPriceMinor !== undefined) query = query.lte('price_minor', opts.maxPriceMinor);
      switch (opts.sort ?? 'newest') {
        case 'price-asc':
          query = query.order('price_minor', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price_minor', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
      }
      if (opts.limit !== undefined) query = query.limit(opts.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data as ProductRow[]).map(mapProduct);
    },

    async getProduct(id: string): Promise<Product | null> {
      const { data, error } = await client
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapProduct(data as ProductRow) : null;
    },

    async getCategories(): Promise<Category[]> {
      const { data, error } = await client.from('categories').select('*').order('name');
      if (error) throw error;
      return data as Category[];
    },

    async searchProducts(q: string): Promise<Product[]> {
      // Commas and percent signs would break the .or() filter syntax.
      const term = q.replace(/[%,]/g, ' ').trim();
      if (!term) return [];
      const { data, error } = await client
        .from('products')
        .select(PRODUCT_SELECT)
        .or(`name.ilike.%${term}%, description.ilike.%${term}%`);
      if (error) throw error;
      return (data as ProductRow[]).map(mapProduct);
    },

    async createOrder(cart: CartItem[]): Promise<Order> {
      const subtotalMinor = cart.reduce(
        (sum, item) => sum + item.priceSnapshotMinor * item.quantity,
        0,
      );
      const { data: product, error: currencyError } = await client
        .from('products')
        .select('currency')
        .eq('id', cart[0]?.productId ?? '')
        .maybeSingle();
      if (currencyError) throw currencyError;
      const currency = product?.currency ?? 'USD';

      const { data: order, error: orderError } = await client
        .from('orders')
        .insert({ subtotal_minor: subtotalMinor, currency })
        .select()
        .single();
      if (orderError) throw orderError;

      const { error: itemsError } = await client.from('order_items').insert(
        cart.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price_snapshot_minor: item.priceSnapshotMinor,
        })),
      );
      if (itemsError) throw itemsError;

      return {
        id: order.id,
        items: cart,
        subtotalMinor,
        currency,
        createdAt: order.created_at,
        status: order.status as OrderStatus,
      };
    },
  };
}
