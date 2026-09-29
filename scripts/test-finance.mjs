import assert from 'node:assert/strict';
import { buildFinanceReport, financeNumber, normalizeGestaoClick, normalizeMotelRevenue } from '../lib/finance.mjs';
import { gestaoClickConfig, rowsFromGestaoClick } from '../lib/gestao-click.mjs';

assert.equal(financeNumber('R$ 1.234,56'), 1234.56);
assert.equal(financeNumber('250.50'), 250.5);
assert.equal(gestaoClickConfig({}).configured, false);
assert.equal(gestaoClickConfig({ GESTAO_CLICK_BASE_URL: 'http://api.gestaoclick.com', GESTAO_CLICK_ACCESS_TOKEN: 'a', GESTAO_CLICK_SECRET_ACCESS_TOKEN: 'b' }).configured, false);
assert.equal(gestaoClickConfig({ GESTAO_CLICK_BASE_URL: 'https://example.com/api', GESTAO_CLICK_ACCESS_TOKEN: 'a', GESTAO_CLICK_SECRET_ACCESS_TOKEN: 'b' }).configured, false);
assert.equal(gestaoClickConfig({ GESTAO_CLICK_ACCESS_TOKEN: 'a', GESTAO_CLICK_SECRET_ACCESS_TOKEN: 'b' }).configured, true);
assert.equal(gestaoClickConfig({ GESTAOCLICK_ACCESS_TOKEN: 'a', GESTAOCLICK_SECRET_TOKEN: 'b' }).configured, true);
assert.deepEqual(rowsFromGestaoClick({ data: [{ id: 1 }] }), [{ id: 1 }]);

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
const report = buildFinanceReport({ start: '2026-09-01', end: '2026-09-30', motelDays, payables, receivables: [] });
assert.equal(report.kpis.revenue, 6000);
assert.equal(report.kpis.expenses, 1550);
assert.equal(report.kpis.operationalResult, 4450);
assert.equal(report.kpis.cashIn, 6000);
assert.equal(report.kpis.cashOut, 1250);
assert.equal(report.kpis.averageTicket, 200);
assert.equal(report.quality.unclassifiedExpenses, 1);
assert.equal(report.monthly.length, 1);
console.log('PASS financeiro: formatos monetários, configuração segura, normalização, DRE e fluxo de caixa. Sem rede.');
