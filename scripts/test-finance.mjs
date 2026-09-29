import assert from 'node:assert/strict';
import { buildFinanceReport, financeNumber, financePeriod, normalizeGestaoClick, normalizeMotelRevenue } from '../lib/finance.mjs';
import { gestaoClickConfig, rowsFromGestaoClick } from '../lib/gestao-click.mjs';

assert.equal(financeNumber('R$ 1.234,56'), 1234.56);
assert.equal(financeNumber('250.50'), 250.5);
assert.equal(gestaoClickConfig({}).configured, false);
assert.equal(gestaoClickConfig({ GESTAO_CLICK_BASE_URL: 'http://api.gestaoclick.com', GESTAO_CLICK_ACCESS_TOKEN: 'a', GESTAO_CLICK_SECRET_ACCESS_TOKEN: 'b' }).configured, false);
assert.equal(gestaoClickConfig({ GESTAO_CLICK_BASE_URL: 'https://example.com/api', GESTAO_CLICK_ACCESS_TOKEN: 'a', GESTAO_CLICK_SECRET_ACCESS_TOKEN: 'b' }).configured, false);
assert.equal(gestaoClickConfig({ GESTAO_CLICK_ACCESS_TOKEN: 'a', GESTAO_CLICK_SECRET_ACCESS_TOKEN: 'b' }).configured, true);
assert.equal(gestaoClickConfig({ GESTAOCLICK_ACCESS_TOKEN: 'a', GESTAOCLICK_SECRET_TOKEN: 'b' }).configured, true);
assert.deepEqual(rowsFromGestaoClick({ data: [{ id: 1 }] }), [{ id: 1 }]);
assert.deepEqual(financePeriod({ months: 3, now: new Date('2026-09-29T12:00:00Z') }), {
  start: '2026-07-01', end: '2026-09-29', months: [{ mes: 7, ano: 2026 }, { mes: 8, ano: 2026 }, { mes: 9, ano: 2026 }],
});
assert.equal(financePeriod({ start: '2026-08-10', end: '2026-09-12', now: new Date('2026-09-29T12:00:00Z') }).months.length, 2);
assert.throws(() => financePeriod({ start: '2026-09-30', end: '2026-09-01' }), /FINANCE_PERIOD/);
assert.throws(() => financePeriod({ start: '2026-01-01', end: '2027-01-01', now: new Date('2026-09-29T12:00:00Z') }), /FINANCE_PERIOD/);

const payables = normalizeGestaoClick([
  { id: 1, valor: '1.200,00', data_vencimento: '10/09/2026', data_pagamento: '11/09/2026', descricao: 'Energia', categoria: { nome: 'Utilidades' } },
  { id: 2, valor_total: 300, data_vencimento: '15/09/2026', descricao: 'Lavanderia' },
  { id: 3, valor_total: 50, data_vencimento: '20/09/2026', data_liquidacao: '21/09/2026', liquidado: '1', nome_plano_conta: 'Manutenção', nome_fornecedor: 'Fornecedor teste' },
], 'payable');
assert.equal(payables[0].amount, 1200);
assert.equal(payables[0].settled, true);
assert.equal(payables[1].category, 'Sem categoria');
assert.equal(payables[2].settled, true);
assert.equal(payables[2].category, 'Manutenção');

const motelDays = normalizeMotelRevenue([{ items: [
  { data: '2026-09-10T00:00:00', totalRecebido: 4000, totalOcupacoes: 20 },
  { data: '2026-09-11T00:00:00', totalRecebido: 2000, totalOcupacoes: 10 },
] }]);
const cashDays = normalizeMotelRevenue([{ items: [{ dataBaseCaixa: '2026-09-12T00:00:00', totalRecebido: 500 }] }]);
assert.equal(cashDays[0].revenue, 500);
assert.equal(cashDays[0].occupancy, null);
const receivables = normalizeGestaoClick([
  { id: 10, valor: 5900, data_vencimento: '10/09/2026', data_recebimento: '10/09/2026', descricao: 'Recebimentos do período' },
], 'receivable');
const report = buildFinanceReport({ start: '2026-09-01', end: '2026-09-30', motelDays, payables, receivables });
assert.equal(report.kpis.revenue, 6000);
assert.equal(report.kpis.expenses, 1550);
assert.equal(report.kpis.operationalResult, 4450);
assert.equal(report.kpis.cashIn, 6000);
assert.equal(report.kpis.cashOut, 1250);
assert.equal(report.kpis.averageTicket, 200);
assert.equal(report.quality.unclassifiedExpenses, 1);
assert.equal(report.monthly.length, 1);
assert.equal(report.kpis.reconciledReceivables, 5900);
assert.equal(report.kpis.reconciliationDifference, 100);
assert.equal(report.monthly[0].reconciliationDifference, 100);
assert.equal(report.expenses.find(item => item.id === '2').status, 'overdue');
assert.equal(report.categories.length, 3);
console.log('PASS financeiro: períodos, formatos, normalização, DRE, fluxo, filtros e conciliação. Sem rede.');
