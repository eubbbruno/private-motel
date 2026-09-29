const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export function financeNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const clean = value.trim().replace(/[^0-9,.-]/g, '');
  if (!clean) return 0;
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function first(record, fields) {
  for (const field of fields) {
    const value = field.split('.').reduce((current, key) => current?.[key], record);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

function isoDate(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const br = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(value);
    if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function safeText(value, fallback, max = 120) {
  const text = typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
  return (text || fallback).slice(0, max);
}

export function normalizeGestaoClick(rows, kind) {
  const type = kind === 'receivable' ? 'receivable' : 'payable';
  return rows.map((row, index) => {
    const amount = Math.abs(financeNumber(first(row, ['valor_total', 'valor', 'valor_bruto', 'total', 'saldo'])));
    const dueDate = isoDate(first(row, ['data_vencimento', 'vencimento', 'dataVencimento']));
    const paidDate = isoDate(first(row, type === 'payable'
      ? ['data_pagamento', 'data_liquidacao', 'data_baixa', 'pago_em', 'dataPagamento']
      : ['data_recebimento', 'data_liquidacao', 'data_baixa', 'recebido_em', 'dataRecebimento']));
    const competenceDate = isoDate(first(row, ['data_competencia', 'competencia', 'data_emissao', 'data_lancamento'])) || dueDate;
    const rawStatus = safeText(first(row, ['status', 'situacao', 'estado']), '').toLocaleLowerCase('pt-BR');
    const rawLiquidated = first(row, ['liquidado']);
    const settled = Boolean(paidDate) || /(pago|quitado|baixado|recebido|liquidado)/.test(rawStatus)
      || rawLiquidated === true || rawLiquidated === 1 || /^(1|s|sim|pago|liquidado|recebido)$/i.test(String(rawLiquidated || ''));
    const category = safeText(first(row, ['categoria.nome', 'categoria', 'nome_plano_conta', 'plano_contas.nome', 'plano_conta.nome', 'nome_centro_custo', 'centro_custo.nome']), 'Sem categoria');
    const description = safeText(first(row, ['descricao', 'nome', 'historico', 'observacao']), type === 'payable' ? 'Despesa' : 'Receita');
    return {
      id: safeText(first(row, ['id', 'codigo', 'uuid']), `${type}-${index}`), type, amount, dueDate, paidDate,
      competenceDate, settled, category, description,
      party: safeText(first(row, type === 'payable' ? ['nome_fornecedor', 'fornecedor.nome', 'fornecedor', 'entidade.nome'] : ['nome_cliente', 'cliente.nome', 'cliente', 'entidade.nome']), ''),
      mapped: Boolean(amount && (dueDate || competenceDate)),
    };
  });
}

export function normalizeMotelRevenue(reports) {
  const days = reports.flatMap(report => Array.isArray(report?.items) ? report.items : []).map((item, index) => {
    const rawOccupancy = item.totalOcupacoes ?? item.ocupacoes;
    return {
      id: `motel-${index}-${item.data || item.dataF || item.dataBaseCaixa || ''}`,
      date: isoDate(item.data || item.dataF || item.dataBaseCaixa),
      revenue: financeNumber(item.totalRecebido ?? item.tot),
      occupancy: rawOccupancy === undefined || rawOccupancy === null ? null : Math.round(financeNumber(rawOccupancy)),
      consumption: financeNumber(item.consumo ?? item.totConsumos),
      discounts: Math.abs(financeNumber(item.desconto ?? item.totDescontos)),
    };
  }).filter(item => item.date);
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function monthKey(date) { return date?.slice(0, 7) || ''; }
function sum(items, selector) { return items.reduce((total, item) => total + selector(item), 0); }

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function financePeriod({ months = 6, start, end, now = new Date() } = {}) {
  const safeMonths = [1, 3, 6, 12].includes(Number(months)) ? Number(months) : 6;
  const today = new Date(now);
  const todayIso = today.toISOString().slice(0, 10);
  let periodStart;
  let periodEnd;

  if (start || end) {
    if (!validIsoDate(start) || !validIsoDate(end) || start > end || end > todayIso) throw Error('FINANCE_PERIOD');
    const span = (new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86_400_000;
    if (span > 731) throw Error('FINANCE_PERIOD');
    periodStart = start;
    periodEnd = end;
  } else {
    const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - safeMonths + 1, 1));
    periodStart = startDate.toISOString().slice(0, 10);
    periodEnd = todayIso;
  }

  const reportMonths = [];
  const cursor = new Date(`${periodStart.slice(0, 7)}-01T00:00:00Z`);
  const limit = new Date(`${periodEnd.slice(0, 7)}-01T00:00:00Z`);
  while (cursor <= limit && reportMonths.length < 25) {
    reportMonths.push({ mes: cursor.getUTCMonth() + 1, ano: cursor.getUTCFullYear() });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return { start: periodStart, end: periodEnd, months: reportMonths };
}

function percentChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function buildFinanceReport({ start, end, motelDays = [], payables = [], receivables = [] }) {
  const mappedPayables = payables.filter(item => item.mapped);
  const mappedReceivables = receivables.filter(item => item.mapped);
  const inPeriod = value => Boolean(value && value >= start && value <= end);
  const periodPayables = mappedPayables.filter(item => inPeriod(item.competenceDate));
  const keys = [];
  const cursor = new Date(`${start.slice(0, 7)}-01T00:00:00Z`);
  const limit = new Date(`${end.slice(0, 7)}-01T00:00:00Z`);
  while (cursor <= limit && keys.length < 24) {
    keys.push(cursor.toISOString().slice(0, 7));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  const monthly = keys.map(key => {
    const revenue = sum(motelDays.filter(item => monthKey(item.date) === key), item => item.revenue);
    const expenses = sum(periodPayables.filter(item => monthKey(item.competenceDate) === key), item => item.amount);
    const cashIn = revenue;
    const cashOut = sum(mappedPayables.filter(item => item.settled && inPeriod(item.paidDate) && monthKey(item.paidDate) === key), item => item.amount);
    const reconciledReceivables = sum(mappedReceivables.filter(item => item.settled && inPeriod(item.paidDate) && monthKey(item.paidDate) === key), item => item.amount);
    const date = new Date(`${key}-01T00:00:00Z`);
    return {
      key,
      label: monthFormatter.format(date).replace('.', ''),
      revenue,
      expenses,
      result: revenue - expenses,
      cashIn,
      cashOut,
      cashNet: cashIn - cashOut,
      reconciledReceivables,
      reconciliationDifference: revenue - reconciledReceivables,
    };
  });
  const monthlyWithComparison = monthly.map((item, index) => ({
    ...item,
    revenueChange: index ? percentChange(item.revenue, monthly[index - 1].revenue) : null,
    expenseChange: index ? percentChange(item.expenses, monthly[index - 1].expenses) : null,
    resultChange: index ? percentChange(item.result, monthly[index - 1].result) : null,
  }));
  const revenue = sum(motelDays, item => item.revenue);
  const expenses = sum(periodPayables, item => item.amount);
  const operationalResult = revenue - expenses;
  const occupancyAvailable = motelDays.some(item => Number.isFinite(item.occupancy));
  const occupancy = occupancyAvailable ? sum(motelDays, item => item.occupancy || 0) : null;
  const categories = Object.entries(periodPayables.reduce((map, item) => {
    map[item.category] = (map[item.category] || 0) + item.amount;
    return map;
  }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const today = new Date().toISOString().slice(0, 10);
  const openPayables = mappedPayables.filter(item => !item.settled && inPeriod(item.dueDate)).sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  const overdue = openPayables.filter(item => item.dueDate && item.dueDate < today);
  const cashOut = sum(mappedPayables.filter(item => item.settled && inPeriod(item.paidDate)), item => item.amount);
  const cashIn = revenue;
  const reconciledReceivables = sum(mappedReceivables.filter(item => item.settled && inPeriod(item.paidDate)), item => item.amount);
  const openReceivables = mappedReceivables.filter(item => !item.settled && inPeriod(item.dueDate));
  const reconciliationDifference = revenue - reconciledReceivables;
  const expenseRows = periodPayables.map(item => ({
    ...item,
    status: item.settled ? 'paid' : item.dueDate && item.dueDate < today ? 'overdue' : 'open',
  })).sort((a, b) => (b.competenceDate || '').localeCompare(a.competenceDate || ''));
  return {
    period: { start, end },
    kpis: {
      revenue, expenses, operationalResult,
      margin: revenue ? (operationalResult / revenue) * 100 : null,
      occupancy,
      averageTicket: occupancy ? revenue / occupancy : null,
      cashIn, cashOut, cashNet: cashIn - cashOut,
      openPayables: sum(openPayables, item => item.amount), overdue: sum(overdue, item => item.amount), overdueCount: overdue.length,
      openReceivables: sum(openReceivables, item => item.amount),
      reconciledReceivables,
      reconciliationDifference,
      reconciliationRate: revenue ? (reconciledReceivables / revenue) * 100 : null,
    },
    monthly: monthlyWithComparison,
    dre: [
      { label: 'Receita recebida — Motel+', value: revenue, kind: 'revenue' },
      { label: 'Despesas por competência — GestãoClick', value: -expenses, kind: 'expense' },
      { label: 'Resultado operacional gerencial', value: operationalResult, kind: 'result' },
    ],
    categories,
    payables: openPayables.slice(0, 12),
    expenses: expenseRows,
    quality: {
      payablesReceived: payables.length,
      payablesMapped: mappedPayables.length,
      receivablesReceived: receivables.length,
      receivablesMapped: mappedReceivables.length,
      revenueDays: motelDays.length,
      occupancyAvailable,
      unclassifiedExpenses: periodPayables.filter(item => item.category === 'Sem categoria').length,
    },
  };
}
