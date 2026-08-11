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

### ⚠️ Important: the built-in database is file-based (read this before going live)

To make the project run anywhere with **zero setup and zero external accounts**, data (products/users/orders) is stored in a JSON file (`lib/db.js`). This is great for:
- Running locally (`npm run dev`) — data persists in `data/db.json`
- Demoing the UI/UX on Vercel

But **Vercel's serverless functions have an ephemeral, mostly read-only filesystem.** In production, writes go to `/tmp` and **will be lost** on the next cold start or redeploy. That means new products, signups, and orders placed on your live Vercel URL won't stick around.

**For a real store, swap in a real database.** Every read/write in the app goes through the small set of functions exported from `lib/db.js`, so this is a contained change. Good options that pair well with Next.js on Vercel:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com) (Postgres)
- [Neon](https://neon.tech) (Postgres)
- [Turso](https://turso.tech) (SQLite at the edge)

Same caveat applies to product images (`app/api/upload/route.js`) — they're stored as base64 inside the product record for simplicity. For a real store with many/large images, use an image host like Cloudinary, S3, or Vercel Blob instead and store the returned URL.

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

Generate strong secrets with: `openssl rand -base64 32`

## Deploying to GitHub + Vercel

1. Push this project to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — no build config needed.
4. In the Vercel project's **Settings → Environment Variables**, add `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` (same as your `.env.local`, with strong values).
5. Deploy.

Remember: **product/order data won't persist in production** until you swap in a real database (see above) — the UI, auth, admin panel, and every flow will otherwise work correctly.

## Project structure

```
app/                     Next.js App Router pages + API routes
  admin/                 Admin panel pages (dashboard, products, orders)
  api/                   Backend API routes
  products/[id]/         Product detail page
  category/[slug]/       Category listing page
  account/                Account + order history + order tracking
components/              Shared React components (Header, Footer, Cart/Auth/Wishlist context, ProductCard, admin ProductForm)
lib/                     db.js (data layer), auth.js (JWT + password hashing), format.js
data/seed.json           Seed data for products/users/orders
middleware.js            Protects all /admin/* routes except /admin/login
public/                  Logo, favicon, and static assets
```

## Notes on the demo checkout

The checkout flow supports Cash on Delivery and a card-details form, but **no real payment processor is wired up** — this is a demo checkout that records the order and total. To take real payments, integrate a provider like Stripe or a local payment gateway inside `app/api/orders/route.js`.
