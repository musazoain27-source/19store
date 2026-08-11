// -----------------------------------------------------------------------
// Simple JSON-file "database" so the whole project runs with zero external
// services and deploys straight to Vercel / GitHub with no setup.
//
// >>> IMPORTANT - READ THIS <<<
// Vercel's serverless filesystem is EPHEMERAL and read-only outside /tmp.
// Any writes made in production (new products, signups, orders placed)
// are stored in /tmp and WILL BE LOST on the next cold start or deploy.
// This is perfect for local development (`npm run dev`) and for demoing
// the UI/UX on Vercel, but it is NOT durable storage for a real store.
//
// To make data persistent in production, swap this file for a real
// database. Good free-tier options that plug into Next.js easily:
//   - Vercel Postgres     https://vercel.com/docs/storage/vercel-postgres
//   - Supabase (Postgres) https://supabase.com
//   - Neon (Postgres)     https://neon.tech
//   - Turso (SQLite edge) https://turso.tech
//   - MongoDB Atlas       https://www.mongodb.com/atlas
//
// Every read/write in this app goes through the functions exported below,
// so upgrading later means editing this one file, not the whole app.
// -----------------------------------------------------------------------
import fs from 'fs';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const DB_PATH = isProd ? path.join('/tmp', '19store-db.json') : path.join(process.cwd(), 'data', 'db.json');
const SEED_PATH = path.join(process.cwd(), 'data', 'seed.json');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function ensureDB() {
  if (!fs.existsSync(DB_PATH)) {
    const seed = readJSON(SEED_PATH);
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
  }
}

export function getDB() {
  ensureDB();
  return readJSON(DB_PATH);
}

export function saveDB(db) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return db;
}

// ---- products -------------------------------------------------------
export function getProducts() {
  return getDB().products;
}
export function getProductById(id) {
  return getDB().products.find((p) => p.id === id);
}
export function upsertProduct(product) {
  const db = getDB();
  const idx = db.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) db.products[idx] = product;
  else db.products.unshift(product);
  saveDB(db);
  return product;
}
export function deleteProduct(id) {
  const db = getDB();
  db.products = db.products.filter((p) => p.id !== id);
  saveDB(db);
}

// ---- users ------------------------------------------------------------
export function getUsers() {
  return getDB().users;
}
export function getUserByEmail(email) {
  return getDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
export function getUserById(id) {
  return getDB().users.find((u) => u.id === id);
}
export function createUser(user) {
  const db = getDB();
  db.users.push(user);
  saveDB(db);
  return user;
}
export function updateUser(id, patch) {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx < 0) return null;
  db.users[idx] = { ...db.users[idx], ...patch };
  saveDB(db);
  return db.users[idx];
}

// ---- orders -----------------------------------------------------------
export function getOrders() {
  return getDB().orders;
}
export function getOrdersByUser(userId) {
  return getDB().orders.filter((o) => o.userId === userId);
}
export function getOrderById(id) {
  return getDB().orders.find((o) => o.id === id);
}
export function createOrder(order) {
  const db = getDB();
  db.orders.unshift(order);
  saveDB(db);
  return order;
}
export function updateOrder(id, patch) {
  const db = getDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  db.orders[idx] = { ...db.orders[idx], ...patch };
  saveDB(db);
  return db.orders[idx];
}
