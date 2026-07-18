import { dataProvider } from './data';
import type { CartItem, Order } from './data';

/**
 * Called when the user taps "Place order" on the checkout summary screen.
 *
 * Checkout in skosh is UI-only: this default implementation asks the
 * active DataProvider for a mock order confirmation. To take real payments,
 * replace this function's body with your payment flow (e.g. create a payment
 * intent, present the Stripe Payment Sheet, then create the order) and return
 * the resulting Order. The checkout screens need no other changes.
 */
export async function onPlaceOrder(cart: CartItem[]): Promise<Order> {
  return dataProvider.createOrder(cart);
}
