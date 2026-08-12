-- =============================================================
-- 19Store database schema for Supabase (Postgres)
-- Run this once in your Supabase project's SQL Editor:
--   Dashboard -> SQL Editor -> New query -> paste this -> Run
-- =============================================================

create table if not exists products (
  id text primary key,
  title text not null,
  category text not null default 'Uncategorized',
  price integer not null,
  compare_at_price integer,
  description text not null default '',
  images jsonb not null default '[]',
  sizes jsonb not null default '{"S":0,"M":0,"L":0,"XL":0,"XXL":0}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  wishlist jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  user_id text not null references users(id),
  items jsonb not null default '[]',
  shipping jsonb not null default '{}',
  total integer not null,
  status text not null default 'Processing',
  tracking jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Row Level Security is left OFF for these tables on purpose:
-- every read/write goes through this app's own Next.js API routes
-- (using the service_role key, server-side only), which already
-- enforce their own auth checks (customer JWT cookie / admin JWT
-- cookie). The service_role key bypasses RLS anyway, so enabling
-- RLS here would not add protection, only extra complexity.
-- Never expose the service_role key to the browser.

-- Seed data (safe to re-run; skips rows that already exist)
insert into products (id, title, category, price, compare_at_price, description, images, sizes, featured, created_at) values
('p1','Oversized Cotton Hoodie','Hoodies',4499,5499,'A heavyweight 400gsm cotton hoodie with a relaxed, oversized fit. Brushed fleece interior for everyday comfort, ribbed cuffs and hem, and a kangaroo pocket. Pairs perfectly with joggers or straight-leg denim.',
  '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80","https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=900&q=80","https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=80"]',
  '{"S":8,"M":14,"L":10,"XL":5,"XXL":0}', true, '2026-01-10T10:00:00Z'),
('p2','Classic Crewneck Tee','T-Shirts',1799,null,'Our best-selling essential tee, cut from soft combed cotton jersey. A true-to-size fit with a clean crew neckline that holds its shape wash after wash.',
  '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80","https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80"]',
  '{"S":20,"M":25,"L":18,"XL":12,"XXL":6}', true, '2026-01-08T10:00:00Z'),
('p3','Slim Fit Denim Jacket','Jackets',6999,8999,'A wardrobe staple rebuilt for a modern silhouette. Rigid selvedge denim that softens beautifully over time, button-through front, and dual chest pockets.',
  '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80","https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=900&q=80"]',
  '{"S":5,"M":9,"L":7,"XL":3,"XXL":0}', true, '2026-01-05T10:00:00Z'),
('p4','Tapered Jogger Pants','Bottoms',3299,null,'Technical stretch-cotton joggers with a tapered leg, elastic waistband, and zip side pockets built for movement without sacrificing style.',
  '["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900&q=80","https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80"]',
  '{"S":12,"M":16,"L":14,"XL":8,"XXL":4}', false, '2026-01-02T10:00:00Z'),
('p5','Premium Wool Overcoat','Jackets',12999,15999,'A tailored wool-blend overcoat with a notch lapel and horn-effect buttons. Fully lined for warmth without the bulk — an investment piece for cold weather.',
  '["https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900&q=80","https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=80"]',
  '{"S":3,"M":6,"L":5,"XL":2,"XXL":0}', true, '2025-12-20T10:00:00Z'),
('p6','Striped Polo Shirt','T-Shirts',2499,null,'A pique-cotton polo with a classic stripe pattern, ribbed collar, and two-button placket. Smart enough for the office, easy enough for the weekend.',
  '["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=900&q=80","https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=80"]',
  '{"S":10,"M":15,"L":11,"XL":6,"XXL":3}', false, '2025-12-18T10:00:00Z'),
('p7','Cargo Utility Trousers','Bottoms',3899,4599,'Durable cotton-ripstop cargo trousers with multiple utility pockets, an adjustable waist, and a tapered leg for a modern, non-baggy fit.',
  '["https://images.unsplash.com/photo-1517438476312-10d79c077509?w=900&q=80","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80"]',
  '{"S":7,"M":11,"L":9,"XL":4,"XXL":2}', false, '2025-12-15T10:00:00Z'),
('p8','Quilted Puffer Vest','Jackets',5499,null,'Lightweight quilted puffer vest with recycled fill insulation, a stand collar, and zip hand pockets. Layers cleanly under or over a hoodie.',
  '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80","https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900&q=80"]',
  '{"S":6,"M":10,"L":8,"XL":5,"XXL":1}', false, '2025-12-10T10:00:00Z')
on conflict (id) do nothing;

insert into users (id, name, email, password_hash, wishlist, created_at) values
('u_demo','Demo Customer','demo@19store.com','$2b$10$sI2lrdXawe4C.YXX055YA.CwaqCVweRuszYRNck.FVaOROflQS4iC','["p1","p5"]','2026-01-01T10:00:00Z')
on conflict (id) do nothing;
