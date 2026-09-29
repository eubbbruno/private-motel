'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaChartLine, FaDatabase, FaExternalLinkAlt, FaSyncAlt, FaWallet } from 'react-icons/fa';
import { dashboardClient } from '../client';
import styles from '../dashboard.module.css';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const number = new Intl.NumberFormat('pt-BR');
const date = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—';
const money = value => currency.format(Number(value) || 0);

function Brand() {
  return <Link href="/" className={styles.brand} aria-label="Private Motel — voltar ao site">
    <Image src="/images/logo.png" width={200} height={67} alt="Private Motel" priority />
    <span>ADMINISTRAÇÃO</span>
  </Link>;
}

function SourceStatus({ label, source, detail }) {
  const state = source.connected ? 'connected' : source.configured ? 'error' : 'pending';
  return <article className={styles.sourceCard} data-state={state}>
    <span className={styles.sourceDot} /><div><strong>{label}</strong><p>{source.connected ? detail : source.error || 'Credenciais ainda não configuradas no servidor local.'}</p></div>
  </article>;
}

function Bars({ rows }) {
  const max = Math.max(1, ...rows.flatMap(row => [row.revenue, row.expenses]));
  return <div className={styles.financeChart} role="img" aria-label="Comparativo mensal de faturamento e despesas">
    {rows.map(row => <div className={styles.chartColumn} key={row.key}>
      <div className={styles.bars}><span title={`Faturamento ${money(row.revenue)}`} style={{ height: `${Math.max(2, row.revenue / max * 100)}%` }} /><span title={`Despesas ${money(row.expenses)}`} style={{ height: `${Math.max(2, row.expenses / max * 100)}%` }} /></div>
      <small>{row.label}</small>
    </div>)}
  </div>;
}

export default function FinancePanel() {
  const [months, setMonths] = useState(6);
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  const load = useCallback(async () => {
    setState(current => ({ ...current, loading: true, error: '' }));
    try {
      const client = dashboardClient();
      const { data } = client ? await client.auth.getSession() : { data: {} };
      if (!data.session) throw Error('Entre novamente no painel para consultar os dados financeiros.');
      const response = await fetch(`/api/dashboard/finance?months=${months}`, { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'Consulta financeira indisponível.');
      setState({ loading: false, data: result, error: '' });
    } catch (error) {
      setState({ loading: false, data: null, error: error.message || 'Consulta financeira indisponível.' });
    }
  }, [months]);
  useEffect(() => { load(); }, [load]);
  const data = state.data;
  const report = data?.report;
  const hasRevenue = Boolean(report?.quality.revenueDays);
  const hasExpenses = Boolean(report?.quality.payablesMapped);
  const chartRows = useMemo(() => report?.monthly || [], [report]);
  const categoryMax = Math.max(1, ...(report?.categories || []).map(item => item.value));

  return <main id="main-content" className={styles.shell}>
    <aside className={styles.sidebar}><Brand /><p className={styles.kicker}>INTELIGÊNCIA FINANCEIRA</p>
      <nav aria-label="Painel administrativo"><Link href="/dashboard"><FaArrowLeft />Social e campanhas</Link><Link href="/dashboard/finance" aria-current="page"><FaChartLine />Financeiro</Link><Link href="/dashboard/motel-plus"><FaDatabase />Motel+</Link><Link href="/" target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt />Ver site</Link></nav>
      <p className={styles.signature}>NÚMEROS CLAROS.<br />DECISÕES<br />COM CONTEXTO.</p>
    </aside>
    <section className={`${styles.workspace} ${styles.financeWorkspace}`}>
      <header className={styles.heading}><div><p className={styles.kicker}>MOTEL+ × GESTÃOCLICK</p><h1>Financeiro</h1><p>Faturamento operacional, despesas, caixa e resultado em uma visão única.</p></div>
        <div className={styles.financeActions}><label>Período<select value={months} onChange={event => setMonths(Number(event.target.value))}><option value="1">Mês atual</option><option value="3">3 meses</option><option value="6">6 meses</option><option value="12">12 meses</option></select></label><button className={styles.secondary} onClick={load} disabled={state.loading}><FaSyncAlt />{state.loading ? 'Atualizando…' : 'Atualizar'}</button></div>
      </header>
      {state.error && <section className={styles.integrationError} role="alert"><h2>Leitura indisponível</h2><p>{state.error}</p><Link className={styles.secondary} href="/dashboard">Voltar ao painel</Link></section>}
      {data && <>
        <section className={styles.sourceGrid} aria-label="Estado das integrações">
          <SourceStatus label="Motel+" source={data.sources.motelPlus} detail={`${report.quality.revenueDays} dia(s) de faturamento recebido`} />
          <SourceStatus label="GestãoClick" source={data.sources.gestaoClick} detail={`${report.quality.payablesMapped} conta(s) a pagar mapeada(s)`} />
          <div className={styles.readOnlyBadge}><FaWallet /><span>SOMENTE LEITURA<small>Nenhuma conta é paga ou alterada.</small></span></div>
        </section>
        {(!hasRevenue || !hasExpenses) && <section className={styles.financeNotice} role="status"><strong>Visão parcial</strong><p>{!hasRevenue && 'O faturamento do Motel+ ainda não foi carregado. '}{!hasExpenses && 'As despesas do GestãoClick aparecerão após configurar e validar os dois tokens e as rotas financeiras.'}</p></section>}
        {data.sources.gestaoClick.truncated && <section className={styles.financeNotice} role="status"><strong>Período muito amplo</strong><p>O GestãoClick possui mais páginas do que o limite seguro desta leitura. Reduza o período para obter cobertura integral.</p></section>}
        <section className={styles.financeKpis} aria-label="Indicadores financeiros">
          <article><small>FATURAMENTO</small><strong>{money(report.kpis.revenue)}</strong><p>Motel+ · total recebido</p></article>
          <article><small>DESPESAS</small><strong>{money(report.kpis.expenses)}</strong><p>GestãoClick · competência</p></article>
          <article data-tone={report.kpis.operationalResult < 0 ? 'negative' : 'positive'}><small>RESULTADO GERENCIAL</small><strong>{money(report.kpis.operationalResult)}</strong><p>{report.kpis.margin === null ? 'Margem indisponível' : `${report.kpis.margin.toFixed(1)}% de margem`}</p></article>
          <article><small>CONTAS EM ATRASO</small><strong>{money(report.kpis.overdue)}</strong><p>{number.format(report.kpis.overdueCount)} título(s)</p></article>
        </section>
        <section className={styles.financeSplit}>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>EVOLUÇÃO</p><h2>Faturamento × despesas</h2></div><div className={styles.chartLegend}><span>Faturamento</span><span>Despesas</span></div></header><Bars rows={chartRows} /></article>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>OPERAÇÃO</p><h2>Indicadores do período</h2></div></header><dl className={styles.financeFacts}><div><dt>Ocupações encerradas</dt><dd>{report.kpis.occupancy === null ? '—' : number.format(report.kpis.occupancy)}</dd></div><div><dt>Ticket médio</dt><dd>{report.kpis.averageTicket === null ? '—' : money(report.kpis.averageTicket)}</dd></div><div><dt>Contas a pagar abertas</dt><dd>{money(report.kpis.openPayables)}</dd></div><div><dt>Itens sem categoria</dt><dd>{number.format(report.quality.unclassifiedExpenses)}</dd></div></dl>{!report.quality.occupancyAvailable && <p className={styles.financeFootnote}>O token atual fornece caixa, mas não ocupações. Esses dois indicadores permanecem indisponíveis até existir uma rota autorizada.</p>}</article>
        </section>
        <section className={styles.financeSplit}>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>RESULTADO PRELIMINAR</p><h2>DRE gerencial</h2></div></header><div className={styles.dreTable}>{report.dre.map(row => <div key={row.label} data-kind={row.kind}><span>{row.label}</span><strong>{money(row.value)}</strong></div>)}</div><p className={styles.financeFootnote}>A receita está em regime de caixa e as despesas usam competência. A versão contábil exige validar impostos, depreciação, lançamentos não operacionais e o plano de contas.</p></article>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>CAIXA REALIZADO</p><h2>Fluxo de caixa</h2></div></header><div className={styles.cashSummary}><div><small>ENTRADAS</small><strong>{money(report.kpis.cashIn)}</strong></div><div><small>SAÍDAS PAGAS</small><strong>{money(report.kpis.cashOut)}</strong></div><div><small>SALDO DO PERÍODO</small><strong>{money(report.kpis.cashNet)}</strong></div></div><p className={styles.financeFootnote}>Entradas usam o total recebido no Motel+. Saídas usam contas baixadas no GestãoClick.</p></article>
        </section>
        <section className={styles.financeSplit}>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>CONCENTRAÇÃO</p><h2>Despesas por categoria</h2></div></header>{report.categories.length ? <div className={styles.categoryList}>{report.categories.map(item => <div key={item.name}><p><span>{item.name}</span><strong>{money(item.value)}</strong></p><i style={{ width: `${item.value / categoryMax * 100}%` }} /></div>)}</div> : <p className={styles.empty}>As categorias aparecerão após a primeira leitura válida do GestãoClick.</p>}</article>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>AGENDA FINANCEIRA</p><h2>Próximas contas</h2></div></header>{report.payables.length ? <div className={styles.payablesList}>{report.payables.map(item => <div key={item.id}><time dateTime={item.dueDate}>{date(item.dueDate)}</time><p><strong>{item.description}</strong><small>{item.category}{item.party ? ` · ${item.party}` : ''}</small></p><b>{money(item.amount)}</b></div>)}</div> : <p className={styles.empty}>Nenhuma conta aberta mapeada no período.</p>}</article>
        </section>
        <section className={styles.financeAudit}><p><strong>Período:</strong> {date(report.period.start)} a {date(report.period.end)}</p><p><strong>Atualizado:</strong> {new Date(data.checkedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p><p><strong>Cobertura:</strong> {report.quality.payablesMapped}/{report.quality.payablesReceived} despesas e {report.quality.receivablesMapped}/{report.quality.receivablesReceived} recebíveis reconhecidos.</p></section>
      </>}
    </section>
  </main>;
}
