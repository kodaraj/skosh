import type { TemplateName } from '@/theme/tokens';

/**
 * Store-level configuration. The skosh CLI writes this file when scaffolding
 * a new app or switching templates; it is also the one place to edit by hand
 * when you want to change how your store looks and browses.
 */

/** The template this store renders. Changing it restyles the entire app. */
export const ACTIVE_TEMPLATE: TemplateName = 'fashion';

/**
 * Boundaries for the price filter buckets on the Search tab, in minor units.
 * Three boundaries produce four buckets: under the first, between each pair,
 * and over the last. Tune these to match your catalog's price spread.
 */
export const PRICE_BUCKET_BOUNDS_MINOR: [number, number, number] = [5000, 10000, 20000];
