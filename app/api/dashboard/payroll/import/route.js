import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { dashboardAccess } from '../../../../../lib/dashboard-server';
import { mapPayrollRows, parseCsv, payrollSources } from '../../../../../lib/payroll.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const maxBytes = 10 * 1024 * 1024;
const types = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
};
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });

function cellValue(cell) {
  const value = cell.value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === 'object') return value.result ?? value.text ?? value.richText?.map(item => item.text).join('') ?? '';
  return value ?? '';
}

async function spreadsheetRows(buffer, extension) {
  if (extension === 'csv') return parseCsv(buffer.toString('utf8').replace(/^\uFEFF/, ''));
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw Error('A planilha não possui abas.');
  const rows = [];
  sheet.eachRow({ includeEmpty: false }, row => {
    const values = [];
    for (let index = 1; index <= row.cellCount; index += 1) values.push(cellValue(row.getCell(index)));
    rows.push(values);
  });
  return rows;
}

export async function POST(request) {
  const state = await dashboardAccess(request, 'payroll:write');
  if (state.user.status !== 200) return reply({ error: state.user.status === 401 ? 'Entre novamente para importar a folha.' : 'Acesso exclusivo do proprietário.' }, state.user.status);
  let input;
  try { input = await request.json(); } catch { return reply({ error: 'Envio inválido.' }, 400); }
  const periodId = String(input?.periodId || ''); const source = String(input?.source || ''); const path = String(input?.path || ''); const originalName = String(input?.originalName || '');
  if (!uuid.test(periodId) || !payrollSources.includes(source)) return reply({ error: 'Competência ou tipo de documento inválido.' }, 400);
  const extension = path.split('.').pop()?.toLocaleLowerCase('pt-BR');
  if (!Object.hasOwn(types, extension)) return reply({ error: 'Envie um arquivo CSV, XLSX ou PDF.' }, 415);
  const pathPattern = new RegExp(`^${state.user.userId}/${periodId}/[0-9a-f-]{36}\\.${extension}$`, 'i');
  if (!pathPattern.test(path)) return reply({ error: 'Caminho do documento inválido.' }, 400);
  const { data: period } = await state.client.from('dashboard_payroll_periods').select('id').eq('id', periodId).maybeSingle();
  if (!period) return reply({ error: 'Competência não encontrada.' }, 404);
  const { data: stored, error: downloadError } = await state.client.storage.from('payroll-documents').download(path);
  if (downloadError || !stored) return reply({ error: 'Documento privado não encontrado.' }, 404);
  if (!stored.size || stored.size > maxBytes) return reply({ error: 'O arquivo deve ter até 10 MB.' }, 413);
  const bytes = Buffer.from(await stored.arrayBuffer());

  let processingStatus = 'review_required'; let processingNote = 'PDF armazenado com segurança. Transfira os totais para uma planilha modelo para conferência automática.';
  let rowCount = 0; let unmatched = []; let mapped = [];
  if (extension !== 'pdf') {
    try {
      const rows = await spreadsheetRows(bytes, extension);
      const { data: employees, error: employeesError } = await state.client.from('dashboard_employees').select('id,employee_code,full_name,status').limit(1000);
      if (employeesError) throw Error('Não foi possível consultar os funcionários.');
      const result = mapPayrollRows(rows, employees, source);
      unmatched = result.unmatched;
      mapped = [...new Map(result.entries.map(entry => [entry.employee_id, entry])).values()];
      if (mapped.length) {
        const records = mapped.map(entry => ({ ...entry, period_id: periodId, created_by: state.user.userId }));
        const { error } = await state.client.from('dashboard_payroll_entries').upsert(records, { onConflict: 'period_id,employee_id,source' });
        if (error) throw Error('Não foi possível registrar os lançamentos importados.');
      }
      rowCount = mapped.length; processingStatus = unmatched.length ? 'review_required' : 'processed';
      processingNote = unmatched.length ? `${mapped.length} funcionário(s) importado(s); ${unmatched.length} linha(s) sem correspondência.` : `${mapped.length} funcionário(s) importado(s) e associados.`;
    } catch (error) { processingStatus = 'failed'; processingNote = String(error.message || 'Falha ao processar a planilha.').slice(0, 1000); }
  }
  const safeName = originalName.replace(/[\u0000-\u001f]/g, '').slice(0, 180) || `documento.${extension}`;
  const { data: document, error: documentError } = await state.client.from('dashboard_payroll_documents').insert({
    period_id: periodId, kind: source, storage_path: path, original_name: safeName, mime_type: types[extension], size_bytes: stored.size,
    processing_status: processingStatus, row_count: rowCount, processing_note: processingNote, created_by: state.user.userId,
  }).select('id,period_id,kind,original_name,mime_type,size_bytes,processing_status,row_count,processing_note,created_at').single();
  if (documentError) return reply({ error: 'O arquivo foi recebido, mas o registro da importação falhou.' }, 503);
  return reply({ document, imported: rowCount, unmatched: unmatched.slice(0, 50), status: processingStatus, note: processingNote }, 201);
}
