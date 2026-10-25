import { NextResponse } from 'next/server';
import { dashboardAccess } from '../../../../lib/dashboard-server';
import { readLimitedBody } from '../../../../lib/read-body.mjs';
import { validateMaintenance } from '../../../../lib/maintenance.mjs';

export const dynamic = 'force-dynamic';
const columns = 'id,suite,suite_number,item,category,service_type,status,performed_on,completed_on,next_due_on,description,provider,cost,notes,version,created_at,updated_at';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const reply = (body, status = 200) => NextResponse.json(body, {
  status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' },
});

async function access(request, write = false) {
  const state = await dashboardAccess(request, `maintenance:${write ? 'write' : 'read'}`);
  if (state.user.status !== 200) return { error: reply({ error: state.user.status === 401 ? 'Entre novamente para acessar a manutenção.' : 'Acesso à manutenção exclusivo do proprietário.' }, state.user.status) };
  return state;
}

async function body(request) {
  const text = new TextDecoder().decode(await readLimitedBody(request, 16000));
  if (text.length > 12000) throw Error('BODY_LIMIT');
  return JSON.parse(text);
}

export async function GET(request) {
  const state = await access(request);
  if (state.error) return state.error;
  const { data, error } = await state.client.from('dashboard_maintenance').select(columns)
    .order('performed_on', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }).limit(1000);
  return error ? reply({ error: 'Não foi possível carregar o histórico de manutenção.' }, 503) : reply({ records: data });
}

async function save(request, update) {
  const state = await access(request, true);
  if (state.error) return state.error;
  let payload;
  try { payload = await body(request); }
  catch (error) { return reply({ error: error.message === 'BODY_LIMIT' ? 'Registro muito grande.' : 'Dados inválidos.' }, error.message === 'BODY_LIMIT' ? 413 : 400); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return reply({ error: 'Registro inválido.' }, 400);
  const { id, version, ...fields } = payload;
  if (update && (!uuid.test(id || '') || !Number.isSafeInteger(version) || version < 1)) return reply({ error: 'Identificador ou versão inválidos.' }, 400);
  if (!update && (id !== undefined || version !== undefined)) return reply({ error: 'Identificador não permitido na criação.' }, 400);
  let record;
  try { record = validateMaintenance(fields); }
  catch (error) { return reply({ error: error.message }, 400); }
  const table = state.client.from('dashboard_maintenance');
  const query = update
    ? table.update({ ...record, version: version + 1 }).eq('id', id).eq('version', version)
    : table.insert({ ...record, created_by: state.user.userId });
  const { data, error } = await query.select(columns).maybeSingle();
  if (error) return reply({ error: 'Não foi possível salvar a manutenção.' }, 503);
  if (!data) return reply({ error: 'Este registro mudou. Recarregue antes de editar.' }, 409);
  return reply({ record: data }, update ? 200 : 201);
}

export const POST = request => save(request, false);
export const PATCH = request => save(request, true);
