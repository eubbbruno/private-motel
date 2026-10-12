export const employeeStatuses = Object.freeze(['active', 'leave', 'terminated']);
export const periodStatuses = Object.freeze(['draft', 'review', 'completed', 'archived']);
export const payrollSources = Object.freeze(['timecard', 'payslip', 'payment']);
export const terminationStatuses = Object.freeze(['draft', 'review', 'ready', 'paid', 'archived']);
export const noticeTypes = Object.freeze(['worked', 'indemnified', 'waived', 'not_informed']);

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clean = (value, max, required = false) => {
  if (typeof value !== 'string') throw Error('Preencha os campos obrigatórios.');
  const result = value.trim();
  if ((required && !result) || result.length > max) throw Error(required ? 'Preencha os campos obrigatórios.' : 'Um campo excede o tamanho permitido.');
  return result;
};
const date = (value, required = false) => {
  if ((value === '' || value === null || value === undefined) && !required) return null;
  if (typeof value !== 'string' || !datePattern.test(value) || Number.isNaN(Date.parse(`${value}T12:00:00Z`))) throw Error('Informe uma data válida.');
  return value;
};
const amount = value => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 9999999999.99) throw Error('Informe um valor válido.');
  return Math.round(parsed * 100) / 100;
};
const exactKeys = (input, allowed) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Registro inválido.');
  if (Object.keys(input).some(key => !allowed.includes(key))) throw Error('Campos desconhecidos.');
};

export function validateEmployee(input) {
  exactKeys(input, ['employee_code','full_name','role_title','department','admission_date','experience_end_date','status','termination_date','notes']);
  const admission_date = date(input.admission_date, true);
  const experience_end_date = date(input.experience_end_date);
  const termination_date = date(input.termination_date);
  if (!employeeStatuses.includes(input.status)) throw Error('Situação do funcionário inválida.');
  if ((input.status === 'terminated') !== Boolean(termination_date)) throw Error('Informe a data de desligamento apenas para funcionário desligado.');
  if (experience_end_date && experience_end_date < admission_date) throw Error('O fim da experiência não pode ser anterior à admissão.');
  if (termination_date && termination_date < admission_date) throw Error('O desligamento não pode ser anterior à admissão.');
  return {
    employee_code: clean(input.employee_code, 40, true), full_name: clean(input.full_name, 160, true),
    role_title: clean(input.role_title || '', 120), department: clean(input.department || '', 120),
    admission_date, experience_end_date, status: input.status, termination_date, notes: clean(input.notes || '', 2000),
  };
}

export function validatePeriod(input) {
  exactKeys(input, ['reference_month','status','notes']);
  const reference_month = date(input.reference_month, true);
  if (!reference_month.endsWith('-01')) throw Error('Use o primeiro dia do mês de referência.');
  if (!periodStatuses.includes(input.status)) throw Error('Estado da competência inválido.');
  return { reference_month, status: input.status, notes: clean(input.notes || '', 2000) };
}

export function validateTermination(input) {
  exactKeys(input, ['employee_id','termination_date','last_workday','status','notice_type','gross_amount','deduction_amount','expected_net_amount','paid_amount','paid_on','notes']);
  if (!uuidPattern.test(input.employee_id || '')) throw Error('Funcionário inválido.');
  const termination_date = date(input.termination_date, true); const last_workday = date(input.last_workday, true); const paid_on = date(input.paid_on);
  if (last_workday > termination_date) throw Error('O último dia trabalhado não pode ser posterior ao desligamento.');
  if (!terminationStatuses.includes(input.status)) throw Error('Estado da rescisão inválido.');
  if (!noticeTypes.includes(input.notice_type)) throw Error('Tipo de aviso inválido.');
  const paid_amount = amount(input.paid_amount);
  if (input.status === 'paid' && (!paid_on || paid_amount === null)) throw Error('Informe data e valor do pagamento da rescisão.');
  return { employee_id: input.employee_id, termination_date, last_workday, status: input.status, notice_type: input.notice_type,
    gross_amount: amount(input.gross_amount), deduction_amount: amount(input.deduction_amount), expected_net_amount: amount(input.expected_net_amount), paid_amount, paid_on, notes: clean(input.notes || '', 3000) };
}

export function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, ' ').trim();
}

const aliases = Object.freeze({
  employee_code: ['matricula','codigo','codigo funcionario','registro','id funcionario','chapa'],
  employee_name: ['funcionario','nome','nome funcionario','colaborador','empregado'],
  night_hours: ['horas noturnas','hora noturna','horas adicional noturno','adicional noturno horas'],
  overtime_50_hours: ['horas extras 50','hora extra 50','he 50','extra 50'],
  overtime_100_hours: ['horas extras 100','hora extra 100','he 100','extra 100'],
  absence_hours: ['horas falta','horas de falta','faltas horas','falta horas'],
  medical_certificate_hours: ['horas atestado','horas de atestado','atestado horas','atestados horas'],
  net_amount: ['valor liquido','liquido','total liquido','valor pago','pagamento liquido'],
});

export function detectColumns(headers) {
  const normalized = headers.map(normalizeText);
  const columns = {};
  for (const [field, names] of Object.entries(aliases)) {
    const index = normalized.findIndex(item => names.includes(item));
    if (index >= 0) columns[field] = index;
  }
  return columns;
}

export function parseLocaleNumber(value, kind = 'number') {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (kind === 'hours' && /^\d{1,3}:\d{2}$/.test(raw)) { const [hours, minutes] = raw.split(':').map(Number); return hours + minutes / 60; }
  const cleanValue = raw.replace(/R\$\s?/gi, '').replace(/\s/g, '');
  const normalized = cleanValue.includes(',') ? cleanValue.replace(/\./g, '').replace(',', '.') : cleanValue;
  const parsed = Number(normalized.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

export function mapPayrollRows(rows, employees, source) {
  if (!payrollSources.includes(source)) throw Error('Tipo de documento inválido.');
  if (!Array.isArray(rows) || rows.length < 2) throw Error('A planilha não contém linhas suficientes.');
  const columns = detectColumns(rows[0]);
  if (columns.employee_code === undefined && columns.employee_name === undefined) throw Error('Inclua uma coluna Matrícula/Código ou Funcionário/Nome.');
  const metricFields = source === 'payment' ? ['net_amount'] : ['night_hours','overtime_50_hours','overtime_100_hours','absence_hours','medical_certificate_hours','net_amount'];
  if (!metricFields.some(field => columns[field] !== undefined)) throw Error('Nenhuma coluna reconhecida. Use os cabeçalhos do modelo da Folha e RH.');
  const byCode = new Map(employees.map(item => [normalizeText(item.employee_code), item]));
  const byName = new Map(employees.map(item => [normalizeText(item.full_name), item]));
  const entries = []; const unmatched = [];
  rows.slice(1).forEach((row, offset) => {
    if (!Array.isArray(row) || row.every(cell => String(cell ?? '').trim() === '')) return;
    const code = columns.employee_code === undefined ? '' : normalizeText(row[columns.employee_code]);
    const name = columns.employee_name === undefined ? '' : normalizeText(row[columns.employee_name]);
    const employee = (code && byCode.get(code)) || (name && byName.get(name));
    if (!employee) { unmatched.push({ row: offset + 2, identifier: String(row[columns.employee_code ?? columns.employee_name] ?? '').slice(0, 100) }); return; }
    const values = { night_hours: 0, overtime_50_hours: 0, overtime_100_hours: 0, absence_hours: 0, medical_certificate_hours: 0, net_amount: null };
    metricFields.forEach(field => { if (columns[field] !== undefined) values[field] = parseLocaleNumber(row[columns[field]], field === 'net_amount' ? 'money' : 'hours') ?? (field === 'net_amount' ? null : 0); });
    entries.push({ employee_id: employee.id, source, source_row: offset + 2, ...values });
  });
  return { entries, unmatched, columns };
}

const metricLabels = { night_hours: 'horas noturnas', overtime_50_hours: 'horas extras 50%', overtime_100_hours: 'horas extras 100%', absence_hours: 'faltas (horas)', medical_certificate_hours: 'atestados (horas)' };
export function reconcilePayroll(employees, entries, hourTolerance = 0.02, moneyTolerance = 0.05) {
  const byEmployee = new Map();
  entries.forEach(entry => { const group = byEmployee.get(entry.employee_id) || {}; group[entry.source] = entry; byEmployee.set(entry.employee_id, group); });
  return employees.filter(employee => employee.status !== 'terminated' || byEmployee.has(employee.id)).map(employee => {
    const sources = byEmployee.get(employee.id) || {}; const issues = [];
    if (!sources.timecard) issues.push({ severity: 'pending', field: 'timecard', message: 'Cartão-ponto não localizado.' });
    if (!sources.payslip) issues.push({ severity: 'pending', field: 'payslip', message: 'Holerite não localizado.' });
    if (!sources.payment) issues.push({ severity: 'pending', field: 'payment', message: 'Pagamento não localizado.' });
    if (sources.timecard && sources.payslip) Object.entries(metricLabels).forEach(([field, label]) => {
      const expected = Number(sources.timecard[field] || 0); const reported = Number(sources.payslip[field] || 0); const difference = reported - expected;
      if (Math.abs(difference) > hourTolerance) issues.push({ severity: 'error', field, expected, reported, difference, message: `${label}: ponto ${expected.toFixed(2)}h × holerite ${reported.toFixed(2)}h.` });
    });
    if (sources.payslip && sources.payment && sources.payslip.net_amount !== null && sources.payment.net_amount !== null) {
      const expected = Number(sources.payslip.net_amount); const reported = Number(sources.payment.net_amount); const difference = reported - expected;
      if (Math.abs(difference) > moneyTolerance) issues.push({ severity: 'error', field: 'net_amount', expected, reported, difference, message: `Líquido do holerite e pagamento divergem em R$ ${Math.abs(difference).toFixed(2).replace('.', ',')}.` });
    }
    return { employee, sources, issues, status: issues.some(item => item.severity === 'error') ? 'error' : issues.length ? 'pending' : 'ok' };
  });
}

export function parseCsv(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  const delimiter = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ';' : ',';
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]; const next = text[index + 1];
    if (char === '"' && quoted && next === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === delimiter && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && next === '\n') index += 1; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
