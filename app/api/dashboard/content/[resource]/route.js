import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authorizeDashboard } from '../../../../../lib/dashboard-access.mjs';
import { verifiedUserResult } from '../../../../../lib/dashboard-auth-result.mjs';
import { readLimitedBody } from '../../../../../lib/read-body.mjs';
import { campaignFields } from '../../../../../lib/campaign.mjs';
import { socialFields } from '../../../../../lib/social-planning.mjs';
import { dashboardTables, validateContent } from '../../../../../lib/dashboard-content.mjs';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, {
  status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' },
});

async function access(request, context, write = false) {
  const { resource } = await context.params;
  if (!Object.hasOwn(dashboardTables, resource)) return { error: reply({ error: 'Recurso não encontrado.' }, 404) };
  const url = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY;
  let client;
  const verify = url && key ? async token => {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    return verifiedUserResult(await client.auth.getUser(token));
  } : null;
  const permission = `${resource === 'posts' ? 'social' : 'campaigns'}:${write ? 'write' : 'read'}`;
  const user = await authorizeDashboard(request, verify, permission);
  if (user.status !== 200) return { error: reply({ error: 'Acesso indisponível ou não autorizado.' }, user.status) };
  return { resource, client, user };
}

export async function GET(request, context) {
  const state = await access(request, context);
  if (state.error) return state.error;
  const { data, error } = await state.client.from(dashboardTables[state.resource])
    .select('id,title,body,status,version,created_at,updated_at,' + (state.resource === 'campaigns' ? campaignFields : socialFields).join(',')).order('updated_at', { ascending: false }).limit(100);
  return error ? reply({ error: 'Não foi possível carregar o conteúdo.' }, 503) : reply({ items: data });
}

async function save(request, context, update) {
  const state = await access(request, context, true);
  if (state.error) return state.error;
  let payload;
  try {
    const text = new TextDecoder().decode(await readLimitedBody(request, 24000));
    if (text.length > 16000) return reply({ error: 'Conteúdo muito grande.' }, 413);
    payload = JSON.parse(text);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw Error('Conteúdo inválido.');
  } catch (error) { return reply({ error: error.message === 'BODY_LIMIT' ? 'Conteúdo muito grande.' : 'JSON inválido.' }, error.message === 'BODY_LIMIT' ? 413 : 400); }
  const { id, version, ...fields } = payload;
  let content;
  try { content = validateContent(state.resource, fields); }
  catch (error) { return reply({ error: error.message }, 400); }
  if (state.resource === 'campaigns' && content.status !== 'draft' && state.user.role !== 'owner') {
    return reply({ error: 'Somente o proprietário pode publicar, pausar ou arquivar campanhas.' }, 403);
  }
  if (update && (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '') || !Number.isSafeInteger(version) || version < 1)) {
    return reply({ error: 'Identificador ou versão inválidos.' }, 400);
  }
  if (!update && (id !== undefined || version !== undefined)) return reply({ error: 'Identificador não permitido na criação.' }, 400);
  const table = state.client.from(dashboardTables[state.resource]);
  const query = update
    ? table.update({ ...content, version: version + 1 }).eq('id', id).eq('version', version)
    : table.insert({ ...content, created_by: state.user.userId });
  const { data, error } = await query.select('id,title,body,status,version,created_at,updated_at,' + (state.resource === 'campaigns' ? campaignFields : socialFields).join(',')).maybeSingle();
  if (error) return reply({ error: 'Não foi possível salvar o conteúdo.' }, 503);
  if (!data) return reply({ error: 'O conteúdo mudou ou não está disponível. Recarregue antes de editar.' }, 409);
  return reply({ item: data }, update ? 200 : 201);
}
export const POST = (request, context) => save(request, context, false);
export const PATCH = (request, context) => save(request, context, true);
