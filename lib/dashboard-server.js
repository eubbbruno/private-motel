import { createClient } from '@supabase/supabase-js';
import { authorizeDashboard } from './dashboard-access.mjs';
import { verifiedUserResult } from './dashboard-auth-result.mjs';

export function publicDashboardClient() {
  const url = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}
export async function dashboardAccess(request, permission) {
  let client;
  const url = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY;
  const user = await authorizeDashboard(request, url && key ? async token => {
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
    return verifiedUserResult(await client.auth.getUser(token));
  } : null, permission);
  return { user, client };
}
