import { NextResponse } from 'next/server';
import { dashboardAccess } from '../../../../lib/dashboard-server';
import { motelPlusConfig, motelPlusGet } from '../../../../lib/motel-plus.mjs';
import { gestaoClickConfig, gestaoClickList } from '../../../../lib/gestao-click.mjs';
import { buildFinanceReport, normalizeGestaoClick, normalizeMotelRevenue } from '../../../../lib/finance.mjs';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });

function period(monthCount) {
  const endDate = new Date();
  const end = endDate.toISOString().slice(0, 10);
  const startDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - monthCount + 1, 1));
  const start = startDate.toISOString().slice(0, 10);
  const months = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    months.push({ mes: cursor.getUTCMonth() + 1, ano: cursor.getUTCFullYear() });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return { start, end, months };
}

function sourceError(error, source) {
  if (error?.message?.endsWith('_AUTH')) return `${source} recusou as credenciais configuradas.`;
  if (error?.message === 'MOTEL_PERMISSION') return 'O token do Motel+ funciona, mas ainda não possui permissão para o relatório de faturamento.';
  if (error?.message === 'GESTAO_CLICK_PERMISSION') return 'O token do GestãoClick não possui permissão para este recurso financeiro.';
  if (error?.message === 'GESTAO_CLICK_PATH') return 'A rota financeira do GestãoClick precisa ser confirmada na documentação da sua conta.';
  return `Não foi possível consultar ${source} agora.`;
}

export async function GET(request) {
  const { user } = await dashboardAccess(request, 'finance:read');
  if (user.status !== 200) return reply({ error: 'Acesso financeiro exclusivo do proprietário.' }, user.status);
  const rawMonths = Number(new URL(request.url).searchParams.get('months') || 6);
  const range = period([1, 3, 6, 12].includes(rawMonths) ? rawMonths : 6);
  const motelConfigured = motelPlusConfig().configured;
  const gestaoConfigured = gestaoClickConfig().configured;

  const motelPromise = motelConfigured
    ? Promise.all(range.months.map(item => motelPlusGet('cashMonth', process.env, item)))
    : Promise.reject(Error('MOTEL_CONFIG'));
  const query = { data_inicio: range.start, data_fim: range.end };
  const payablesPromise = gestaoConfigured ? gestaoClickList('payables', query) : Promise.reject(Error('GESTAO_CLICK_CONFIG'));
  const receivablesPromise = gestaoConfigured ? gestaoClickList('receivables', query) : Promise.reject(Error('GESTAO_CLICK_CONFIG'));
  const [motel, payables, receivables] = await Promise.allSettled([motelPromise, payablesPromise, receivablesPromise]);

  const motelDays = motel.status === 'fulfilled' ? normalizeMotelRevenue(motel.value) : [];
  const payableRows = payables.status === 'fulfilled' ? payables.value.rows : [];
  const receivableRows = receivables.status === 'fulfilled' ? receivables.value.rows : [];
  const report = buildFinanceReport({
    start: range.start,
    end: range.end,
    motelDays,
    payables: normalizeGestaoClick(payableRows, 'payable'),
    receivables: normalizeGestaoClick(receivableRows, 'receivable'),
  });
  return reply({
    checkedAt: new Date().toISOString(),
    report,
    sources: {
      motelPlus: { configured: motelConfigured, connected: motel.status === 'fulfilled', error: motel.status === 'rejected' && motelConfigured ? sourceError(motel.reason, 'o Motel+') : '' },
      gestaoClick: {
        configured: gestaoConfigured,
        connected: payables.status === 'fulfilled',
        reconciliationConnected: receivables.status === 'fulfilled',
        truncated: payables.status === 'fulfilled' && payables.value.truncated,
        error: payables.status === 'rejected' && gestaoConfigured ? sourceError(payables.reason, 'o GestãoClick') : receivables.status === 'rejected' && gestaoConfigured ? sourceError(receivables.reason, 'o GestãoClick') : '',
      },
    },
    readOnly: true,
  });
}
