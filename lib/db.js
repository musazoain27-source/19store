// -----------------------------------------------------------------------
// Data layer with two backends, chosen automatically:
//
//   1. Supabase (Postgres) — used automatically when SUPABASE_URL and
//      SUPABASE_SERVICE_ROLE_KEY are set. Data is real, shared, and
//      persistent across every server/device. This is what you want
//      in production. See supabase/schema.sql to set it up (~5 min).
//
//   2. Local JSON file — used automatically when those env vars are
//      NOT set, so the project still runs instantly with zero setup
//      for local development (`npm run dev`). On Vercel specifically,
//      this file-backed mode is NOT durable (serverless filesystems
//      are ephemeral/per-instance) — that's the exact issue this
//      Supabase mode fixes.
//
// Every function below is async and returns the same shape regardless
// of which backend is active, so nothing else in the app needs to know
// or care which one is in use.
// -----------------------------------------------------------------------
import fs from 'fs';
import path from 'path';
import { getSupabase, isSupabaseConfigured } from './supabaseClient';

// ================== JSON FILE BACKEND (fallback / local dev) ==================

const isProd = process.env.NODE_ENV === 'production';
const DB_PATH = isProd ? path.join('/tmp', '19store-db.json') : path.join(process.cwd(), 'data', 'db.json');
const SEED_PATH = path.join(process.cwd(), 'data', 'seed.json');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}
function ensureFileDB() {
  if (!fs.existsSync(DB_PATH)) {
    const seed = readJSON(SEED_PATH);
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
  }
}
function readFileDB() {
  ensureFileDB();
  return readJSON(DB_PATH);
}
function writeFileDB(db) {
  ensureFileDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return db;
}

// ================== Supabase <-> JS field mapping ==================

function productFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    description: row.description,
    images: row.images || [],
    sizes: row.sizes || { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    featured: row.featured,
    createdAt: row.created_at,
  };
}
function productToRow(p) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    description: p.description,
    images: p.images || [],
    sizes: p.sizes || { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    featured: !!p.featured,
    created_at: p.createdAt,
  };
}
function userFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    wishlist: row.wishlist || [],
    createdAt: row.created_at,
  };
}
function orderFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    items: row.items || [],
    shipping: row.shipping || {},
    paymentMethod: row.payment_method || 'cod',
    deliveryFee: row.delivery_fee ?? 0,
    discountCode: row.discount_code || null,
    discountAmount: row.discount_amount ?? 0,
    total: row.total,
    status: row.status,
    tracking: row.tracking || [],
    createdAt: row.created_at,
  };
}

// ================== Products ==================

export async function getProducts() {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(productFromRow);
  }
  return readFileDB().products;
}

export async function getProductById(id) {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('products').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return productFromRow(data);
  }
  return readFileDB().products.find((p) => p.id === id);
}

export async function upsertProduct(product) {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from('products').upsert(productToRow(product));
    if (error) throw error;
    return product;
  }
  const db = readFileDB();
  const idx = db.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) db.products[idx] = product;
  else db.products.unshift(product);
  writeFileDB(db);
  return product;
}

export async function deleteProduct(id) {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from('products').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const db = readFileDB();
  db.products = db.products.filter((p) => p.id !== id);
  writeFileDB(db);
}

// ================== Users ==================

export async function getUserByEmail(email) {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('users').select('*').ilike('email', email).maybeSingle();
    if (error) throw error;
    return userFromRow(data);
  }
  return readFileDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function getUserById(id) {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('users').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return userFromRow(data);
  }
  return readFileDB().users.find((u) => u.id === id);
}

export async function createUser(user) {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from('users').insert({
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.passwordHash,
      wishlist: user.wishlist || [],
      created_at: user.createdAt,
    });
    if (error) throw error;
    return user;
  }
  const db = readFileDB();
  db.users.push(user);
  writeFileDB(db);
  return user;
}

export async function updateUser(id, patch) {
  if (isSupabaseConfigured()) {
    const row = {};
    if (patch.wishlist !== undefined) row.wishlist = patch.wishlist;
    if (patch.name !== undefined) row.name = patch.name;
    const { data, error } = await getSupabase().from('users').update(row).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return userFromRow(data);
  }
  const db = readFileDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx < 0) return null;
  db.users[idx] = { ...db.users[idx], ...patch };
  writeFileDB(db);
  return db.users[idx];
}

// ================== Orders ==================

export async function getOrders() {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(orderFromRow);
  }
  return readFileDB().orders;
}

export async function getOrdersByUser(userId) {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(orderFromRow);
  }
  return readFileDB().orders.filter((o) => o.userId === userId);
}

export async function getOrderById(id) {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('orders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return orderFromRow(data);
  }
  return readFileDB().orders.find((o) => o.id === id);
}

export async function createOrder(order) {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from('orders').insert({
      id: order.id,
      user_id: order.userId,
      items: order.items,
      shipping: order.shipping,
      payment_method: order.paymentMethod || 'cod',
      delivery_fee: order.deliveryFee ?? 0,
      discount_code: order.discountCode || null,
      discount_amount: order.discountAmount ?? 0,
      total: order.total,
      status: order.status,
      tracking: order.tracking,
      created_at: order.createdAt,
    });
    if (error) throw error;
    return order;
  }
  const db = readFileDB();
  db.orders.unshift(order);
  writeFileDB(db);
  return order;
}

export async function updateOrder(id, patch) {
  if (isSupabaseConfigured()) {
    const row = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.tracking !== undefined) row.tracking = patch.tracking;
    const { data, error } = await getSupabase().from('orders').update(row).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return orderFromRow(data);
  }
  const db = readFileDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  db.orders[idx] = { ...db.orders[idx], ...patch };
  writeFileDB(db);
  return db.orders[idx];
}

// ================== Discount Codes ==================

function discountFromRow(row) {
  if (!row) return null;
  return {
    code: row.code,
    type: row.type,
    value: row.value,
    expiresAt: row.expires_at,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function getDiscounts() {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('discounts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(discountFromRow);
  }
  const db = readFileDB();
  return db.discounts || [];
}

export async function getDiscountByCode(code) {
  const normalized = (code || '').trim().toUpperCase();
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('discounts').select('*').eq('code', normalized).maybeSingle();
    if (error) throw error;
    return discountFromRow(data);
  }
  const db = readFileDB();
  return (db.discounts || []).find((d) => d.code === normalized) || null;
}

export async function createDiscount(discount) {
  const code = discount.code.trim().toUpperCase();
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from('discounts').insert({
      code,
      type: discount.type,
      value: discount.value,
      expires_at: discount.expiresAt || null,
      active: discount.active !== false,
      created_at: discount.createdAt,
    });
    if (error) throw error;
    return { ...discount, code };
  }
  const db = readFileDB();
  db.discounts = db.discounts || [];
  if (db.discounts.some((d) => d.code === code)) {
    throw new Error('A discount code with this name already exists');
  }
  const record = { ...discount, code };
  db.discounts.unshift(record);
  writeFileDB(db);
  return record;
}

export async function updateDiscount(code, patch) {
  const normalized = (code || '').trim().toUpperCase();
  if (isSupabaseConfigured()) {
    const row = {};
    if (patch.active !== undefined) row.active = patch.active;
    if (patch.expiresAt !== undefined) row.expires_at = patch.expiresAt;
    const { data, error } = await getSupabase().from('discounts').update(row).eq('code', normalized).select().maybeSingle();
    if (error) throw error;
    return discountFromRow(data);
  }
  const db = readFileDB();
  db.discounts = db.discounts || [];
  const idx = db.discounts.findIndex((d) => d.code === normalized);
  if (idx < 0) return null;
  db.discounts[idx] = { ...db.discounts[idx], ...patch };
  writeFileDB(db);
  return db.discounts[idx];
}

export async function deleteDiscount(code) {
  const normalized = (code || '').trim().toUpperCase();
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from('discounts').delete().eq('code', normalized);
    if (error) throw error;
    return;
  }
  const db = readFileDB();
  db.discounts = (db.discounts || []).filter((d) => d.code !== normalized);
  writeFileDB(db);
}
