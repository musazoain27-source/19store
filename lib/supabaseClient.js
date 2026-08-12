import { createClient } from '@supabase/supabase-js';

// Server-side only. Uses the service_role key which bypasses Row Level
// Security, so it must NEVER be imported into client components or
// exposed with a NEXT_PUBLIC_ prefix. Every file that uses this client
// is a server component or an API route.
let client = null;

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false },
      // Next.js patches the global fetch() to cache requests by default.
      // That's great for static content but wrong for a live database —
      // it was causing newly-added products to appear once, then vanish
      // on refresh (a stale cached response). Forcing cache: 'no-store'
      // here makes every Supabase request always hit the real database.
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
      },
    });
  }
  return client;
}

export function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
