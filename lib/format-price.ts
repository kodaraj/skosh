/** ISO 4217 currencies whose minor unit is the whole unit (no decimal places). */
const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'VND', 'CLP', 'ISK']);

/**
 * Formats an amount in minor units (e.g. cents) as a localized currency string.
 *
 * Every price shown anywhere in the app goes through this function, so
 * currency symbols and decimal handling stay consistent and swappable.
 *
 * @example formatPrice(12800, 'USD') // "$128.00"
 */
export function formatPrice(amountMinor: number, currency: string): string {
  const divisor = ZERO_DECIMAL_CURRENCIES.has(currency) ? 1 : 100;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amountMinor / divisor);
}
