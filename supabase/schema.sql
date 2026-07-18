-- skosh reference schema for Supabase (Postgres).
--
-- Run this once in the Supabase SQL editor, then run the seed file matching
-- your template (seed.fashion.sql, seed.grocery.sql, or seed.electronics.sql).
-- Column names are snake_case; the provider in lib/data/providers/supabase.ts
-- maps them to the camelCase domain models.

create table categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  image text not null
);

create table products (
  id text primary key,
  name text not null,
  description text not null,
  price_minor integer not null check (price_minor >= 0),
  currency text not null default 'USD',
  images jsonb not null default '[]'::jsonb,
  category_id text not null references categories (id),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table variants (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  name text not null,
  options jsonb not null default '{}'::jsonb,
  price_override_minor integer check (price_override_minor >= 0),
  image text
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  subtotal_minor integer not null check (subtotal_minor >= 0),
  currency text not null,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'processing', 'shipped', 'delivered')),
  created_at timestamptz not null default now()
);

create table order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders (id) on delete cascade,
  product_id text not null references products (id),
  variant_id text not null references variants (id),
  quantity integer not null check (quantity > 0),
  price_snapshot_minor integer not null check (price_snapshot_minor >= 0)
);

create index products_category_id_idx on products (category_id);
create index products_featured_idx on products (featured) where featured;
create index variants_product_id_idx on variants (product_id);
create index order_items_order_id_idx on order_items (order_id);

-- Row Level Security.
-- The catalog is publicly readable. Orders are open to the anon role so the
-- template works without accounts; once you add auth, replace the two order
-- policies with user-scoped ones (e.g. auth.uid() = user_id).

alter table categories enable row level security;
alter table products enable row level security;
alter table variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read variants" on variants for select using (true);

create policy "Anon create orders" on orders for insert with check (true);
create policy "Anon read orders" on orders for select using (true);
create policy "Anon create order items" on order_items for insert with check (true);
create policy "Anon read order items" on order_items for select using (true);
