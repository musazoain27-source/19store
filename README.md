# 19Store

A full-featured, modern clothing e-commerce site built with **Next.js 14 (App Router)** and **Tailwind CSS** — ready to run locally and deploy straight to **GitHub + Vercel**.

## What's included

### Customer-facing
- Home page with hero banner, promo banners, shop-by-category, featured products
- Product search and category filters (price range, size)
- Product detail page: image gallery, title, price, description, sizes (S–XXL), live stock, quantity selector, Add to Cart, Buy Now
- Shopping cart (persisted in localStorage)
- Checkout with shipping form + payment method selection (demo — no real payment gateway wired up)
- Customer accounts: sign up / log in / log out (JWT in httpOnly cookies)
- Order history and a real order-tracking timeline (Order Placed → Processing → Shipped → Out for Delivery → Delivered)
- Wishlist (synced to account when logged in, localStorage when a guest)
- Fully responsive, animated UI

### Admin panel (`/admin`)
- Separate, password-protected login (`/admin/login`) — protected by middleware, not just hidden UI
- Dashboard with key stats (products, orders, revenue, low stock)
- Add / edit / delete products, including multi-image upload, description, price, compare-at price, category, "featured" toggle, and per-size stock quantities
- Orders list with shipping details and a status dropdown that updates the customer's tracking timeline

## Do you need a backend? Yes — and it's already built in.

This project is **not** a static site. It has a real backend, built as Next.js API routes under `app/api/`:
- Auth (customer + admin), password hashing (bcrypt), JWTs in httpOnly cookies
- Product CRUD, order creation, stock decrementing, order status updates
- Image uploads (converted to base64 and stored with the product)

### ⚠️ Important: pick a storage mode before going live

To make the project run anywhere with **zero setup and zero external accounts**, it ships with a JSON-file data layer (`data/db.json`) as the default. This is great for:
- Running locally (`npm run dev`) — data persists in `data/db.json`
- Demoing the UI/UX on Vercel

But **Vercel's serverless functions have an ephemeral, mostly read-only filesystem.** In production, writes go to `/tmp` and **will be lost/inconsistent across devices** on the next cold start or redeploy. That means new products, signups, and orders placed on your live Vercel URL may not show up for other visitors, or may disappear later.

**Supabase support is built in — just switch it on.** `lib/db.js` automatically uses Supabase (a real, shared, persistent Postgres database) the moment two environment variables are set; otherwise it silently falls back to the JSON file. No code changes needed, only a few minutes of setup:

1. Create a free project at [supabase.com](https://supabase.com).
2. In your Supabase project, open **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql` from this project, and click **Run**. This creates the `products`, `users`, and `orders` tables and seeds them with the same demo data as the JSON file.
3. In Supabase, go to **Project Settings → API** and copy:
   - **Project URL** → this is your `SUPABASE_URL`
   - **service_role** secret key (not the `anon public` one) → this is your `SUPABASE_SERVICE_ROLE_KEY`
4. Add both as environment variables — in `.env.local` for local dev, and in **Vercel → Project Settings → Environment Variables** for production. Redeploy.

That's it — every device now reads/writes the same database, so products you add in the admin panel show up for everyone, permanently.

The `service_role` key is powerful (it bypasses Row Level Security) and must stay server-side only — it's only ever read inside `lib/supabaseClient.js`, which is never imported into client components. Never prefix it with `NEXT_PUBLIC_`.

Same image caveat applies either way (`app/api/upload/route.js`) — images are stored as base64 inside the product record for simplicity, in the file or in Postgres. For a real store with many/large images, use an image host like Cloudinary, S3, or Vercel Blob instead and store the returned URL.

## Getting started locally

```bash
npm install
cp .env.example .env.local   # then edit the values inside
npm run dev
```

Visit `http://localhost:3000`.

**Demo customer account:** `demo@19store.com` / `demo1234`

**Admin login:** `http://localhost:3000/admin/login` — credentials come from your `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`, defaults are `admin@19store.com` / `admin123` if unset — change these before deploying anywhere public).

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signs customer session tokens. Use a long random string. |
| `ADMIN_EMAIL` | Email required to log into `/admin`. |
| `ADMIN_PASSWORD` | Password required to log into `/admin`. |
| `ADMIN_JWT_SECRET` | Signs admin session tokens. Use a different long random string than `JWT_SECRET`. |
| `SUPABASE_URL` *(optional)* | Your Supabase project URL. Leave unset to use the local JSON file instead. |
| `SUPABASE_SERVICE_ROLE_KEY` *(optional)* | Your Supabase `service_role` secret key. Leave unset to use the local JSON file instead. |

Generate strong secrets with: `openssl rand -base64 32`

## Deploying to GitHub + Vercel

1. Push this project to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — no build config needed.
4. In the Vercel project's **Settings → Environment Variables**, add `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` (same as your `.env.local`, with strong values). Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` too if you've set up Supabase (strongly recommended — see above).
5. Deploy.

If you skipped Supabase: **product/order data won't persist reliably in production** until you set it up (see above) — the UI, auth, admin panel, and every flow will otherwise work correctly.

## Project structure

```
app/                     Next.js App Router pages + API routes
  admin/                 Admin panel pages (dashboard, products, orders)
  api/                   Backend API routes
  products/[id]/         Product detail page
  category/[slug]/       Category listing page
  account/                Account + order history + order tracking
components/              Shared React components (Header, Footer, Cart/Auth/Wishlist context, ProductCard, admin ProductForm)
lib/                     db.js (data layer, auto-switches file/Supabase), supabaseClient.js, auth.js (JWT + password hashing)
supabase/schema.sql      Run once in Supabase's SQL Editor to enable persistent storage
data/seed.json           Seed data used by the JSON-file fallback
middleware.js            Protects all /admin/* routes except /admin/login
public/                  Logo, favicon, and static assets
```

## Notes on the demo checkout

The checkout flow supports Cash on Delivery and a card-details form, but **no real payment processor is wired up** — this is a demo checkout that records the order and total. To take real payments, integrate a provider like Stripe or a local payment gateway inside `app/api/orders/route.js`.
