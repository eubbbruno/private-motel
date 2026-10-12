import { NextResponse } from 'next/server';
import { dashboardAccess } from '../../../../lib/dashboard-server';
import { readLimitedBody } from '../../../../lib/read-body.mjs';
import { validateEmployee, validatePeriod, validateTermination } from '../../../../lib/payroll.mjs';

export const dynamic = 'force-dynamic';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });
const configs = {
  employee: { table: 'dashboard_employees', columns: 'id,employee_code,full_name,role_title,department,admission_date,experience_end_date,status,termination_date,notes,version,created_at,updated_at', validate: validateEmployee },
  period: { table: 'dashboard_payroll_periods', columns: 'id,reference_month,status,notes,version,created_at,updated_at', validate: validatePeriod },
  termination: { table: 'dashboard_terminations', columns: 'id,employee_id,termination_date,last_workday,status,notice_type,gross_amount,deduction_amount,expected_net_amount,paid_amount,paid_on,notes,version,created_at,updated_at', validate: validateTermination },
};

async function access(request, write = false) {
  const state = await dashboardAccess(request, `payroll:${write ? 'write' : 'read'}`);
  if (state.user.status !== 200) return { error: reply({ error: state.user.status === 401 ? 'Entre novamente para acessar a Folha e RH.' : 'Acesso à Folha e RH exclusivo do proprietário.' }, state.user.status) };
  return state;
}

async function readBody(request) {
  const text = new TextDecoder().decode(await readLimitedBody(request, 24000));
  if (text.length > 20000) throw Error('BODY_LIMIT');
  return JSON.parse(text);
}

export async function GET(request) {
  const state = await access(request); if (state.error) return state.error;
  const periodId = new URL(request.url).searchParams.get('period');
  if (periodId && !uuid.test(periodId)) return reply({ error: 'Competência inválida.' }, 400);
  const requests = [
    state.client.from('dashboard_employees').select(configs.employee.columns).order('full_name').limit(1000),
    state.client.from('dashboard_payroll_periods').select(configs.period.columns).order('reference_month', { ascending: false }).limit(120),
    state.client.from('dashboard_terminations').select(configs.termination.columns).order('termination_date', { ascending: false }).limit(1000),
  ];
  if (periodId) {
    requests.push(state.client.from('dashboard_payroll_entries').select('id,period_id,employee_id,source,night_hours,overtime_50_hours,overtime_100_hours,absence_hours,medical_certificate_hours,net_amount,source_row,version,updated_at').eq('period_id', periodId).limit(3000));
    requests.push(state.client.from('dashboard_payroll_documents').select('id,period_id,kind,original_name,mime_type,size_bytes,processing_status,row_count,processing_note,created_at').eq('period_id', periodId).order('created_at', { ascending: false }).limit(100));
  }
  const results = await Promise.all(requests);
  if (results.some(result => result.error)) return reply({ error: 'Não foi possível carregar os dados da Folha e RH.' }, 503);
  return reply({ employees: results[0].data, periods: results[1].data, terminations: results[2].data, entries: results[3]?.data || [], documents: results[4]?.data || [] });
}

async function save(request, update) {
  const state = await access(request, true); if (state.error) return state.error;
  let payload;
  try { payload = await readBody(request); } catch (error) { return reply({ error: error.message === 'BODY_LIMIT' ? 'Registro muito grande.' : 'Dados inválidos.' }, error.message === 'BODY_LIMIT' ? 413 : 400); }
  const { entity, id, version, data } = payload || {}; const config = configs[entity];
  if (!config) return reply({ error: 'Tipo de registro inválido.' }, 400);
  if (update && (!uuid.test(id || '') || !Number.isSafeInteger(version) || version < 1)) return reply({ error: 'Identificador ou versão inválidos.' }, 400);
  let record;
  try { record = config.validate(data); } catch (error) { return reply({ error: error.message }, 400); }
  const table = state.client.from(config.table);
  const query = update ? table.update(record).eq('id', id).eq('version', version) : table.insert({ ...record, created_by: state.user.userId });
  const { data: saved, error } = await query.select(config.columns).maybeSingle();
  if (error) {
    if (error.code === '23505') return reply({ error: entity === 'employee' ? 'Já existe um funcionário com esta matrícula.' : 'Já existe uma competência para este mês.' }, 409);
    return reply({ error: 'Não foi possível salvar o registro.' }, 503);
  }
  if (!saved) return reply({ error: 'Este registro mudou. Recarregue antes de editar.' }, 409);
  return reply({ record: saved }, update ? 200 : 201);
}

export const POST = request => save(request, false);
export const PATCH = request => save(request, true);
