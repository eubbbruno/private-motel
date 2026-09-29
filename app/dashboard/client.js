'use client';
import { createClient } from '@supabase/supabase-js';
let client;
export function dashboardClient() {
  const url = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY;
  if (!url || !key || typeof window === 'undefined') return null;
  if (!client) client = createClient(url, key, {
    auth: { storage: window.sessionStorage, storageKey: 'private-editorial-auth', persistSession: true, detectSessionInUrl: false },
  });
  return client;
}
