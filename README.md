# skosh

A production-quality, open source e-commerce storefront template for React Native and Expo. Pick a template style, plug in your products, and ship a polished store app in minutes, not months.

```bash
npx skosh-cli create my-store --template fashion
```

Skosh ships with three complete visual templates, a fully typed data layer you can point at any backend, and a mock data mode that runs with zero setup. Every screen is built to a modern design standard: skeleton loaders, designed empty states, optimistic updates, haptics, dark mode, and smooth micro-interactions out of the box.

> **Status: early development.** The template and CLI are being built in public. Watch the repo for the first release.

## Features

- **Three templates, one codebase.** Fashion, grocery, and electronics styles built entirely from design tokens. Pick one at scaffold time, and switch any time with `npx skosh-cli template`.
- **Bring your own backend.** All data flows through a single typed `DataProvider` interface. Ships with a mock provider (default), a Supabase reference implementation, and a REST skeleton ready for your API.
- **Runs instantly.** The default mock provider uses local JSON with realistic seed data. No accounts, no API keys, no config.
- **Complete storefront.** Home, search with filters, product detail with variant selection, cart, wishlist, checkout flow (UI only), auth screens, order history, onboarding.
- **Dark mode everywhere.** Every template ships light and dark palettes, respects the system preference, and supports manual override.
- **Modern stack.** Expo Router with typed routes, TypeScript strict mode, TanStack Query for server state, Zustand for cart and wishlist, Reanimated micro-interactions, plain StyleSheet with design tokens.
- **Quality baseline on every screen.** Skeleton loaders, designed empty states, error states with retry, pull-to-refresh, optimistic cart and wishlist updates, safe areas, accessibility labels.

## Quickstart

Three commands to a running store with mock data:

```bash
npx skosh-cli create my-store
cd my-store
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator. The app boots against bundled mock products, so it works before you touch a single config file.

Running `npx skosh-cli` with no arguments opens an interactive menu instead: create a new app, or switch the template of the app you are in. Every prompt has a flag or argument equivalent for CI and scripted setups:

```bash
npx skosh-cli create my-store --template grocery --no-install
npx skosh-cli template electronics
```

## Template gallery

All three templates render the same screens and components. Only the design tokens and a few card layout variants differ.

| Template        | Personality                                                                      | Palette           |
| --------------- | -------------------------------------------------------------------------------- | ----------------- |
| **fashion**     | Minimal and editorial. Generous whitespace, serif-accented type, large imagery.  | Muted neutrals    |
| **grocery**     | Fresh and friendly. Rounded corners, denser grids, quantity-first product cards. | Green-leaning     |
| **electronics** | Technical and dark-friendly. Sharp corners, spec-highlight cards.                | Blue and graphite |

<!-- screenshot: home screen, all three templates side by side -->

<!-- screenshot: product detail, all three templates side by side -->

<!-- screenshot: dark mode, all three templates side by side -->

The template is a developer choice, not an end-user setting. The CLI writes your pick to `ACTIVE_TEMPLATE` in `skosh.config.ts`, and `npx skosh-cli template <name>` switches it later; changing that one line restyles the entire app, which is the proof that the token architecture holds.

## Bring your own API

Screens never talk to a backend directly. They call a typed `DataProvider`:

```ts
export interface DataProvider {
  getProducts(opts?: QueryOpts): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  searchProducts(q: string): Promise<Product[]>;
  createOrder(cart: CartItem[]): Promise<Order>;
}
```

To connect your own API:

1. Open `lib/data/providers/rest.ts`. It is a skeleton with `fetch` calls and TODO comments marking exactly what to fill in for each method.
2. Implement the five methods against your endpoints, mapping responses to the domain types in `lib/data/types.ts`.
3. Set the provider in `.env`:

```bash
EXPO_PUBLIC_DATA_PROVIDER=rest
```

That is the whole integration surface. Nothing else in the app knows or cares where the data comes from.

### Replacing the mock data

If you just want your own products without a backend yet, edit the JSON in `lib/data/mock/`. The files are plain, readable JSON matching the domain types. The mock provider adds a small artificial delay so loading states stay honest.

## Supabase setup

Skosh includes a complete Supabase reference implementation.

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql`, then the seed file for your template (`supabase/seed.fashion.sql`, `seed.grocery.sql`, or `seed.electronics.sql`). The seeds are generated from the bundled mock JSON, so the app looks identical either way.
3. Add your credentials to `.env`:

```bash
EXPO_PUBLIC_DATA_PROVIDER=supabase
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart the dev server. Products, categories, search, and orders now come from your Supabase project.

## What is and is not included

Included in v1:

- Products with variants (size, color) and per-variant price overrides
- Cart, wishlist, and theme state persisted locally with Zustand (the wishlist asks users to sign in first, matching production behavior)
- Checkout flow UI: address form, order summary, confirmation
- Auth screen UI (login and signup)
- Prices as integer minor units, formatted through a single `formatPrice` utility

Deliberately out of scope for v1:

- Real payment processing. Checkout ends at a documented `onPlaceOrder` callback that returns a mock order confirmation. Wire it to Stripe, your API, or anything else.
- Inventory tracking
- Server-side auth logic (the Supabase provider shows the pattern; the screens are ready)

## Project structure

```
skosh.config.ts       Active template and store-level settings (set by the CLI)
app/                  Expo Router routes (tabs, product, checkout, onboarding)
components/           Shared UI primitives and product components
theme/                Token contract and the three template token sets
lib/data/             DataProvider interface, providers, and per-vertical mock JSON
supabase/             schema.sql and per-template seed SQL for the reference backend
```

## Roadmap

- [ ] v1: three templates, mock + Supabase + REST providers, skosh CLI
- [ ] Screenshot and video gallery
- [ ] Example `onPlaceOrder` integrations (Stripe Payment Sheet guide)
- [ ] Localization scaffolding
- [ ] Additional template verticals (beauty, home goods)
- [ ] Web support audit

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, project conventions, and the checks to run before opening a pull request.

## License

MIT
