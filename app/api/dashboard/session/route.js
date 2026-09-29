import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authorizeDashboard } from '../../../../lib/dashboard-access.mjs';
import { verifiedUserResult } from '../../../../lib/dashboard-auth-result.mjs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Reuse the existing public Auth project; never use service-role credentials here.
  const url = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY;
  const verifyUser = url && key ? async (token) => {
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return verifiedUserResult(await client.auth.getUser(token));
  } : null;
  const result = await authorizeDashboard(request, verifyUser);
  const errors = {
    401: 'Autenticação necessária.',
    403: 'Você não tem acesso ao dashboard.',
    503: 'Acesso ao dashboard temporariamente indisponível.',
  };
  const body = result.status === 200
    ? { userId: result.userId, role: result.role, capabilities: result.capabilities }
    : { error: errors[result.status] };
  return NextResponse.json(body, {
    status: result.status,
    headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' },
  });
}
