'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaChartLine, FaDatabase, FaDownload, FaExternalLinkAlt, FaFilter, FaPrint, FaSearch, FaSyncAlt, FaTools, FaUsers, FaWallet } from 'react-icons/fa';
import { dashboardClient } from '../client';
import styles from '../dashboard.module.css';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const number = new Intl.NumberFormat('pt-BR');
const date = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—';
const money = value => currency.format(Number(value) || 0);
const today = new Date().toISOString().slice(0, 10);
const initialPeriod = Object.freeze({ mode: 'preset', months: 6, start: '', end: '' });
const publicSite = process.env.NEXT_PUBLIC_DASHBOARD_STANDALONE === 'true' ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.privatemotel.com.br') : '/';

function Brand() {
  return <Link href={publicSite} className={styles.brand} aria-label="Private Motel — voltar ao site">
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

function variation(value) {
  if (value === null || !Number.isFinite(value)) return 'Sem base anterior';
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}% sobre o mês anterior`;
}

function csvCell(value) {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename, rows) {
  const content = `\uFEFF${rows.map(row => row.map(csvCell).join(';')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const statusLabel = status => ({ paid: 'Pago', overdue: 'Vencido', open: 'Em aberto' }[status] || status);

export default function FinancePanel() {
  const [period, setPeriod] = useState(initialPeriod);
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  const [filters, setFilters] = useState({ query: '', category: 'all', status: 'all' });

  const load = useCallback(async currentPeriod => {
    setState(current => ({ ...current, loading: true, error: '' }));
    try {
      const client = dashboardClient();
      const { data } = client ? await client.auth.getSession() : { data: {} };
      if (!data.session) throw Error('Entre novamente no painel para consultar os dados financeiros.');
      const params = new URLSearchParams();
      if (currentPeriod.mode === 'custom') {
        if (!currentPeriod.start || !currentPeriod.end) throw Error('Informe as datas inicial e final.');
        params.set('start', currentPeriod.start);
        params.set('end', currentPeriod.end);
      } else params.set('months', String(currentPeriod.months));
      const response = await fetch(`/api/dashboard/finance?${params}`, { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'Consulta financeira indisponível.');
      setState({ loading: false, data: result, error: '' });
    } catch (error) {
      setState(current => ({ loading: false, data: current.data, error: error.message || 'Consulta financeira indisponível.' }));
    }
  }, []);

  useEffect(() => { load(initialPeriod); }, [load]);

  const data = state.data;
  const report = data?.report;
  const chartRows = report?.monthly || [];
  const categoryMax = Math.max(1, ...(report?.categories || []).map(item => item.value));
  const categories = useMemo(() => report?.categories?.map(item => item.name) || [], [report]);
  const filteredExpenses = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase('pt-BR');
    return (report?.expenses || []).filter(item => {
      const matchesQuery = !query || [item.description, item.party, item.category].some(value => value?.toLocaleLowerCase('pt-BR').includes(query));
      return matchesQuery && (filters.category === 'all' || item.category === filters.category) && (filters.status === 'all' || item.status === filters.status);
    });
  }, [report, filters]);
  const filteredTotal = filteredExpenses.reduce((total, item) => total + item.amount, 0);
  const latestMonth = chartRows.at(-1);

  function applyPeriod(event) { event.preventDefault(); load(period); }
  function exportExpenses() {
    downloadCsv(`private-despesas-${report.period.start}-${report.period.end}.csv`, [
      ['Competência', 'Vencimento', 'Pagamento', 'Descrição', 'Fornecedor', 'Categoria', 'Status', 'Valor'],
      ...filteredExpenses.map(item => [item.competenceDate, item.dueDate, item.paidDate, item.description, item.party, item.category, statusLabel(item.status), item.amount.toFixed(2).replace('.', ',')]),
    ]);
  }
  function exportReconciliation() {
    downloadCsv(`private-conciliacao-${report.period.start}-${report.period.end}.csv`, [
      ['Mês', 'Motel+ recebido', 'GestãoClick recebido', 'Diferença', 'Resultado gerencial', 'Caixa líquido'],
      ...chartRows.map(item => [item.key, item.revenue.toFixed(2).replace('.', ','), item.reconciledReceivables.toFixed(2).replace('.', ','), item.reconciliationDifference.toFixed(2).replace('.', ','), item.result.toFixed(2).replace('.', ','), item.cashNet.toFixed(2).replace('.', ',')]),
    ]);
  }

  return <main id="main-content" className={styles.shell}>
    <aside className={styles.sidebar}><Brand /><p className={styles.kicker}>INTELIGÊNCIA FINANCEIRA</p>
      <nav aria-label="Painel administrativo"><Link href="/dashboard"><FaArrowLeft />Social e campanhas</Link><Link href="/dashboard/finance" aria-current="page"><FaChartLine />Financeiro</Link><Link href="/dashboard/motel-plus"><FaDatabase />Motel+</Link><Link href="/dashboard/maintenance"><FaTools />Manutenção</Link><Link href="/dashboard/payroll"><FaUsers />Folha e RH</Link><Link href={publicSite} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt />Ver site</Link></nav>
      <p className={styles.signature}>NÚMEROS CLAROS.<br />DECISÕES<br />COM CONTEXTO.</p>
    </aside>
    <section className={`${styles.workspace} ${styles.financeWorkspace}`}>
      <header className={styles.heading}><div><p className={styles.kicker}>MOTEL+ × GESTÃOCLICK</p><h1>Financeiro</h1><p>Faturamento operacional, despesas, caixa e conciliação em uma visão somente leitura.</p></div></header>

      <form className={styles.financeToolbar} onSubmit={applyPeriod}>
        <label>Visualização<select value={period.mode} onChange={event => setPeriod(current => ({ ...current, mode: event.target.value }))}><option value="preset">Período rápido</option><option value="custom">Datas personalizadas</option></select></label>
        {period.mode === 'preset' ? <label>Período<select value={period.months} onChange={event => setPeriod(current => ({ ...current, months: Number(event.target.value) }))}><option value="1">Mês atual</option><option value="3">3 meses</option><option value="6">6 meses</option><option value="12">12 meses</option></select></label> : <>
          <label>Data inicial<input type="date" value={period.start} max={period.end || today} onChange={event => setPeriod(current => ({ ...current, start: event.target.value }))} required /></label>
          <label>Data final<input type="date" value={period.end} min={period.start} max={today} onChange={event => setPeriod(current => ({ ...current, end: event.target.value }))} required /></label>
        </>}
        <button className={styles.secondary} type="submit" disabled={state.loading}><FaSyncAlt />{state.loading ? 'Atualizando…' : 'Aplicar'}</button>
        {report && <div className={styles.exportActions}><button type="button" className={styles.ghostAction} onClick={exportReconciliation}><FaDownload />Conciliação CSV</button><button type="button" className={styles.ghostAction} onClick={() => window.print()}><FaPrint />Imprimir</button></div>}
      </form>

      {state.error && <section className={styles.integrationError} role="alert"><h2>Leitura indisponível</h2><p>{state.error}</p></section>}
      {data && <>
        <section className={styles.sourceGrid} aria-label="Estado das integrações">
          <SourceStatus label="Motel+" source={data.sources.motelPlus} detail={`${report.quality.revenueDays} dia(s) de faturamento recebido`} />
          <SourceStatus label="GestãoClick" source={data.sources.gestaoClick} detail={`${report.quality.payablesMapped} conta(s) a pagar · ${report.quality.receivablesMapped} recebimento(s) mapeado(s)`} />
          <div className={styles.readOnlyBadge}><FaWallet /><span>SOMENTE LEITURA<small>Nenhuma conta é paga ou alterada.</small></span></div>
        </section>
        {(!report.quality.revenueDays || !report.quality.payablesMapped) && <section className={styles.financeNotice} role="status"><strong>Visão parcial</strong><p>{!report.quality.revenueDays && 'O faturamento do Motel+ ainda não foi carregado. '}{!report.quality.payablesMapped && 'As despesas do GestãoClick ainda não estão disponíveis para o período.'}</p></section>}
        {data.sources.gestaoClick.truncated && <section className={styles.financeNotice} role="status"><strong>Período muito amplo</strong><p>O GestãoClick possui mais páginas do que o limite seguro desta leitura. Reduza o período para obter cobertura integral.</p></section>}

        <section className={styles.financeKpis} aria-label="Indicadores financeiros">
          <article><small>FATURAMENTO</small><strong>{money(report.kpis.revenue)}</strong><p>Motel+ · total recebido</p></article>
          <article><small>DESPESAS</small><strong>{money(report.kpis.expenses)}</strong><p>GestãoClick · competência</p></article>
          <article data-tone={report.kpis.operationalResult < 0 ? 'negative' : 'positive'}><small>RESULTADO GERENCIAL</small><strong>{money(report.kpis.operationalResult)}</strong><p>{report.kpis.margin === null ? 'Margem indisponível' : `${report.kpis.margin.toFixed(1)}% de margem`}</p></article>
          <article><small>CONTAS EM ATRASO</small><strong>{money(report.kpis.overdue)}</strong><p>{number.format(report.kpis.overdueCount)} título(s)</p></article>
        </section>

        {latestMonth && <section className={styles.financeTrendGrid} aria-label="Comparação com o mês anterior">
          <article><small>FATURAMENTO · {latestMonth.label}</small><strong>{money(latestMonth.revenue)}</strong><p>{variation(latestMonth.revenueChange)}</p></article>
          <article><small>DESPESAS · {latestMonth.label}</small><strong>{money(latestMonth.expenses)}</strong><p>{variation(latestMonth.expenseChange)}</p></article>
          <article><small>RESULTADO · {latestMonth.label}</small><strong>{money(latestMonth.result)}</strong><p>{variation(latestMonth.resultChange)}</p></article>
        </section>}

        <section className={styles.financeSplit}>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>EVOLUÇÃO</p><h2>Faturamento × despesas</h2></div><div className={styles.chartLegend}><span>Faturamento</span><span>Despesas</span></div></header><Bars rows={chartRows} /></article>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>OPERAÇÃO</p><h2>Indicadores do período</h2></div></header><dl className={styles.financeFacts}><div><dt>Ocupações encerradas</dt><dd>{report.kpis.occupancy === null ? '—' : number.format(report.kpis.occupancy)}</dd></div><div><dt>Ticket médio</dt><dd>{report.kpis.averageTicket === null ? '—' : money(report.kpis.averageTicket)}</dd></div><div><dt>Contas a pagar abertas</dt><dd>{money(report.kpis.openPayables)}</dd></div><div><dt>Itens sem categoria</dt><dd>{number.format(report.quality.unclassifiedExpenses)}</dd></div></dl>{!report.quality.occupancyAvailable && <p className={styles.financeFootnote}>O token atual fornece caixa, mas não ocupações. Esses indicadores permanecem indisponíveis até existir uma rota autorizada.</p>}</article>
        </section>

        <section className={styles.financeSplit}>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>RESULTADO PRELIMINAR</p><h2>DRE gerencial</h2></div></header><div className={styles.dreTable}>{report.dre.map(row => <div key={row.label} data-kind={row.kind}><span>{row.label}</span><strong>{money(row.value)}</strong></div>)}</div><p className={styles.financeFootnote}>Receita em regime de caixa e despesas por competência. A versão contábil depende da validação do plano de contas, impostos, depreciação e lançamentos não operacionais.</p></article>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>CAIXA REALIZADO</p><h2>Fluxo de caixa</h2></div></header><div className={styles.cashSummary}><div><small>ENTRADAS</small><strong>{money(report.kpis.cashIn)}</strong></div><div><small>SAÍDAS PAGAS</small><strong>{money(report.kpis.cashOut)}</strong></div><div><small>SALDO DO PERÍODO</small><strong>{money(report.kpis.cashNet)}</strong></div></div><p className={styles.financeFootnote}>Entradas usam o total recebido no Motel+. Saídas usam contas baixadas no GestãoClick.</p></article>
        </section>

        <section className={styles.financeCard}>
          <header><div><p className={styles.kicker}>CONFERÊNCIA ENTRE SISTEMAS</p><h2>Conciliação mensal</h2></div><button type="button" className={styles.ghostAction} onClick={exportReconciliation}><FaDownload />Exportar CSV</button></header>
          {(!data.sources.gestaoClick.reconciliationConnected || report.quality.receivablesMapped === 0) && <div className={styles.financeNotice}><strong>Sem base de conciliação</strong><p>O faturamento do Motel+ está disponível, mas o GestãoClick não retornou recebimentos mapeáveis. A diferença abaixo não deve ser interpretada como falta de caixa até validar se essas receitas são registradas no GestãoClick.</p></div>}
          <div className={styles.financeTableWrap}><table className={styles.financeTable}><thead><tr><th>Mês</th><th>Motel+ recebido</th><th>GestãoClick recebido</th><th>Diferença</th><th>Resultado gerencial</th><th>Caixa líquido</th></tr></thead><tbody>{chartRows.map(row => <tr key={row.key}><th scope="row">{row.label}</th><td>{money(row.revenue)}</td><td>{money(row.reconciledReceivables)}</td><td data-tone={Math.abs(row.reconciliationDifference) < .01 ? 'positive' : 'attention'}>{money(row.reconciliationDifference)}</td><td>{money(row.result)}</td><td>{money(row.cashNet)}</td></tr>)}</tbody></table></div>
        </section>

        <section className={styles.financeSplit}>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>CONCENTRAÇÃO</p><h2>Despesas por categoria</h2></div></header>{report.categories.length ? <div className={styles.categoryList}>{report.categories.slice(0, 12).map(item => <div key={item.name}><p><span>{item.name}</span><strong>{money(item.value)}</strong></p><i style={{ width: `${item.value / categoryMax * 100}%` }} /></div>)}</div> : <p className={styles.empty}>As categorias aparecerão após a primeira leitura válida do GestãoClick.</p>}</article>
          <article className={styles.financeCard}><header><div><p className={styles.kicker}>AGENDA FINANCEIRA</p><h2>Próximas contas</h2></div></header>{report.payables.length ? <div className={styles.payablesList}>{report.payables.map(item => <div key={item.id}><time dateTime={item.dueDate}>{date(item.dueDate)}</time><p><strong>{item.description}</strong><small>{item.category}{item.party ? ` · ${item.party}` : ''}</small></p><b>{money(item.amount)}</b></div>)}</div> : <p className={styles.empty}>Nenhuma conta aberta mapeada no período.</p>}</article>
        </section>

        <section className={styles.financeCard}>
          <header><div><p className={styles.kicker}>LANÇAMENTOS</p><h2>Despesas detalhadas</h2></div><button type="button" className={styles.ghostAction} onClick={exportExpenses} disabled={!filteredExpenses.length}><FaDownload />Exportar filtradas</button></header>
          <div className={styles.financeFilters}>
            <label className={styles.searchField}><FaSearch aria-hidden="true" /><span className={styles.srOnly}>Buscar despesas</span><input type="search" placeholder="Descrição, fornecedor ou categoria" value={filters.query} onChange={event => setFilters(current => ({ ...current, query: event.target.value }))} /></label>
            <label><FaFilter aria-hidden="true" /><span className={styles.srOnly}>Filtrar categoria</span><select value={filters.category} onChange={event => setFilters(current => ({ ...current, category: event.target.value }))}><option value="all">Todas as categorias</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
            <label><span className={styles.srOnly}>Filtrar situação</span><select value={filters.status} onChange={event => setFilters(current => ({ ...current, status: event.target.value }))}><option value="all">Todas as situações</option><option value="paid">Pagas</option><option value="open">Em aberto</option><option value="overdue">Vencidas</option></select></label>
          </div>
          <p className={styles.filterSummary}>{number.format(filteredExpenses.length)} lançamento(s) · {money(filteredTotal)}</p>
          <div className={styles.financeTableWrap}><table className={styles.financeTable}><thead><tr><th>Competência</th><th>Descrição</th><th>Categoria</th><th>Vencimento</th><th>Situação</th><th>Valor</th></tr></thead><tbody>{filteredExpenses.slice(0, 250).map(item => <tr key={`${item.id}-${item.competenceDate}`}><td>{date(item.competenceDate)}</td><td><strong>{item.description}</strong>{item.party && <small>{item.party}</small>}</td><td>{item.category}</td><td>{date(item.dueDate)}</td><td><span className={styles.financeStatus} data-status={item.status}>{statusLabel(item.status)}</span></td><td>{money(item.amount)}</td></tr>)}</tbody></table>{!filteredExpenses.length && <p className={styles.empty}>Nenhum lançamento corresponde aos filtros.</p>}{filteredExpenses.length > 250 && <p className={styles.financeFootnote}>Exibindo 250 de {number.format(filteredExpenses.length)} lançamentos. O CSV inclui todos os resultados filtrados.</p>}</div>
        </section>

        <section className={styles.financeAudit}><p><strong>Período:</strong> {date(report.period.start)} a {date(report.period.end)}</p><p><strong>Atualizado:</strong> {new Date(data.checkedAt).toLocaleString('pt-BR')}</p><p><strong>Cobertura:</strong> {number.format(report.quality.payablesMapped)} de {number.format(report.quality.payablesReceived)} despesas mapeadas</p><p><strong>Modo:</strong> somente leitura</p></section>
      </>}
    </section>
  </main>;
}
