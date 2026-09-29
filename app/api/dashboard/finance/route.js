import { NextResponse } from 'next/server';
import { dashboardAccess } from '../../../../lib/dashboard-server';
import { motelPlusConfig, motelPlusGet } from '../../../../lib/motel-plus.mjs';
import { gestaoClickConfig, gestaoClickList } from '../../../../lib/gestao-click.mjs';
import { buildFinanceReport, financePeriod, normalizeGestaoClick, normalizeMotelRevenue } from '../../../../lib/finance.mjs';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });

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
  const search = new URL(request.url).searchParams;
  let range;
  try {
    range = financePeriod({ months: search.get('months'), start: search.get('start'), end: search.get('end') });
  } catch {
    return reply({ error: 'Período inválido. Use datas completas, sem data futura, com intervalo máximo de 24 meses.' }, 400);
  }
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
