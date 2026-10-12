'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaChartLine, FaDatabase, FaExternalLinkAlt, FaPlus, FaSearch, FaTools, FaUsers } from 'react-icons/fa';
import { dashboardClient } from '../client';
import { maintenanceCategories, maintenanceStatuses, maintenanceSuites, maintenanceTypes } from '../../../lib/maintenance.mjs';
import styles from '../dashboard.module.css';

const publicSite = process.env.NEXT_PUBLIC_DASHBOARD_STANDALONE === 'true' ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.privatemotel.com.br') : '/';
const statusLabel = { completed: 'Concluída', scheduled: 'Agendada', in_progress: 'Em andamento', cancelled: 'Cancelada' };
const typeLabel = { preventive: 'Preventiva', corrective: 'Corretiva', inspection: 'Inspeção', installation: 'Instalação' };
const itemSuggestions = ['Pintura', 'Gesso', 'Hidromassagem', 'Sauna', 'Ar-condicionado', 'TV', 'Iluminação', 'Som', 'Frigobar', 'Fechadura', 'Mobiliário', 'Elétrica', 'Hidráulica', 'Banheiro', 'Enxoval'];
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
const blank = () => ({ suite: 'Private Duplex', item: '', category: 'Outros', service_type: 'preventive', status: 'completed', performed_on: today(), next_due_on: '', description: '', provider: '', cost: '', notes: '' });
const date = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—';
const money = value => value === null || value === '' ? '—' : Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function Brand() {
  return <Link href={publicSite} className={styles.brand} aria-label="Private Motel — voltar ao site"><Image src="/images/logo.png" width={200} height={67} alt="Private Motel" priority /><span>ADMINISTRAÇÃO</span></Link>;
}

export default function MaintenancePanel() {
  const [state, setState] = useState({ loading: true, records: [], error: '' });
  const [draft, setDraft] = useState(blank);
  const [saved, setSaved] = useState(JSON.stringify(blank()));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [filters, setFilters] = useState({ suite: 'all', status: 'active', search: '' });
  const firstInput = useRef(null);
  const dirty = JSON.stringify(draft) !== saved;

  const request = useCallback(async (method = 'GET', payload) => {
    const client = dashboardClient();
    const { data } = client ? await client.auth.getSession() : { data: {} };
    if (!data.session) throw Error('Entre pelo painel para acessar a manutenção.');
    const response = await fetch('/api/dashboard/maintenance', {
      method, cache: 'no-store', headers: { Authorization: `Bearer ${data.session.access_token}`, ...(payload ? { 'Content-Type': 'application/json' } : {}) },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || 'Manutenção temporariamente indisponível.');
    return result;
  }, []);
  const load = useCallback(async () => {
    setState(current => ({ ...current, loading: true, error: '' }));
    try { const result = await request(); setState({ loading: false, records: result.records, error: '' }); }
    catch (error) { setState(current => ({ ...current, loading: false, error: error.message })); }
  }, [request]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!dirty) return;
    const warn = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function select(record) {
    if (dirty && !window.confirm('Descartar as alterações não salvas?')) return;
    const next = { ...record, cost: record.cost ?? '', performed_on: record.performed_on || '', next_due_on: record.next_due_on || '' };
    setDraft(next); setSaved(JSON.stringify(next)); setNotice(''); firstInput.current?.focus();
  }
  function create() {
    if (dirty && !window.confirm('Descartar as alterações não salvas?')) return;
    const next = blank(); setDraft(next); setSaved(JSON.stringify(next)); setNotice(''); firstInput.current?.focus();
  }
  async function save(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setNotice(''); setState(current => ({ ...current, error: '' }));
    try {
      const payload = { ...draft, cost: draft.cost === '' ? null : Number(draft.cost) };
      const result = await request(draft.id ? 'PATCH' : 'POST', payload);
      const next = { ...result.record, cost: result.record.cost ?? '', performed_on: result.record.performed_on || '', next_due_on: result.record.next_due_on || '' };
      setDraft(next); setSaved(JSON.stringify(next));
      setState(current => ({ ...current, records: [result.record, ...current.records.filter(item => item.id !== result.record.id)] }));
      setNotice(draft.id ? 'Registro atualizado no histórico.' : 'Manutenção adicionada ao histórico.');
    } catch (error) { setState(current => ({ ...current, error: error.message })); }
    finally { setBusy(false); }
  }

  const records = state.records;
  const metrics = useMemo(() => {
    const now = today(); const soon = new Date(); soon.setDate(soon.getDate() + 30); const soonDate = soon.toLocaleDateString('en-CA');
    return {
      overdue: records.filter(item => item.status !== 'cancelled' && item.next_due_on && item.next_due_on < now).length,
      upcoming: records.filter(item => item.status !== 'cancelled' && item.next_due_on && item.next_due_on >= now && item.next_due_on <= soonDate).length,
      completed: records.filter(item => item.status === 'completed').length,
      cost: records.filter(item => item.status === 'completed' && item.performed_on?.slice(0,4) === now.slice(0,4)).reduce((sum, item) => sum + Number(item.cost || 0), 0),
    };
  }, [records]);
  const latest = useMemo(() => {
    const map = new Map();
    records.filter(item => item.status === 'completed').forEach(item => { const key = `${item.suite}|${item.item.toLocaleLowerCase('pt-BR')}`; if (!map.has(key) || (item.performed_on || '') > (map.get(key).performed_on || '')) map.set(key, item); });
    return [...map.values()].sort((a,b) => a.suite.localeCompare(b.suite, 'pt-BR') || a.item.localeCompare(b.item, 'pt-BR'));
  }, [records]);
  const visible = records.filter(item => {
    const text = `${item.item} ${item.category} ${item.description} ${item.provider}`.toLocaleLowerCase('pt-BR');
    return (filters.suite === 'all' || item.suite === filters.suite) && (filters.status === 'all' || (filters.status === 'active' ? item.status !== 'cancelled' : item.status === filters.status)) && text.includes(filters.search.toLocaleLowerCase('pt-BR'));
  });
  const set = (key, value) => setDraft(current => ({ ...current, [key]: value }));

  return <main id="main-content" className={styles.shell}><aside className={styles.sidebar}><Brand /><p className={styles.kicker}>GESTÃO OPERACIONAL</p><nav aria-label="Painel administrativo"><Link href="/dashboard"><FaArrowLeft />Social e campanhas</Link><Link href="/dashboard/finance"><FaChartLine />Financeiro</Link><Link href="/dashboard/motel-plus"><FaDatabase />Motel+</Link><Link href="/dashboard/maintenance" aria-current="page"><FaTools />Manutenção</Link><Link href="/dashboard/payroll"><FaUsers />Folha e RH</Link><Link href={publicSite} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt />Ver site</Link></nav><p className={styles.signature}>CUIDADO REGISTRADO.<br />PADRÃO<br />PRESERVADO.</p></aside>
    <section className={`${styles.workspace} ${styles.maintenanceWorkspace}`}><header className={styles.heading}><div><p className={styles.kicker}>HISTÓRICO POR SUÍTE</p><h1>Manutenção</h1><p>Registre serviços, custos e próximas revisões de cada equipamento.</p></div><button className={styles.secondary} onClick={create} disabled={busy}><FaPlus />Nova manutenção</button></header>
      {state.error && <p role="alert" className={styles.error}>{state.error} <button type="button" onClick={load}>Tentar novamente</button></p>}
      <section className={styles.maintenanceKpis} aria-label="Resumo da manutenção"><article data-tone={metrics.overdue ? 'attention' : 'neutral'}><small>REVISÕES VENCIDAS</small><strong>{metrics.overdue}</strong></article><article><small>PRÓXIMOS 30 DIAS</small><strong>{metrics.upcoming}</strong></article><article><small>SERVIÇOS CONCLUÍDOS</small><strong>{metrics.completed}</strong></article><article><small>CUSTO NO ANO</small><strong>{money(metrics.cost)}</strong></article></section>
      <div className={styles.maintenanceColumns}><section className={styles.maintenanceHistory}><header><div><p className={styles.kicker}>CRONOLOGIA</p><h2>Histórico registrado</h2></div><span>{visible.length} registro(s)</span></header><div className={styles.maintenanceFilters}><label><span className={styles.srOnly}>Buscar</span><FaSearch /><input type="search" value={filters.search} onChange={event => setFilters({ ...filters, search: event.target.value })} placeholder="Buscar item, serviço ou fornecedor" /></label><select aria-label="Filtrar por suíte" value={filters.suite} onChange={event => setFilters({ ...filters, suite: event.target.value })}><option value="all">Todas as suítes</option>{maintenanceSuites.map(item => <option key={item}>{item}</option>)}</select><select aria-label="Filtrar por estado" value={filters.status} onChange={event => setFilters({ ...filters, status: event.target.value })}><option value="active">Ativas</option><option value="all">Todos os estados</option>{maintenanceStatuses.map(item => <option key={item} value={item}>{statusLabel[item]}</option>)}</select></div>
        {state.loading ? <p className={styles.empty}>Carregando histórico…</p> : visible.length ? <div className={styles.maintenanceList}>{visible.map(item => <button type="button" key={item.id} onClick={() => select(item)} aria-current={draft.id === item.id ? 'true' : undefined}><time dateTime={item.performed_on || item.next_due_on || ''}>{date(item.performed_on || item.next_due_on)}</time><span><strong>{item.item}</strong><small>{item.suite} · {item.category}</small><p>{item.description}</p></span><i data-status={item.status}>{statusLabel[item.status]}</i></button>)}</div> : <p className={styles.empty}>Nenhum registro corresponde aos filtros.</p>}
      </section>
      <form className={styles.maintenanceEditor} onSubmit={save}><header><p className={styles.kicker}>{draft.id ? 'EDITAR REGISTRO' : 'NOVO REGISTRO'}</p><h2>{draft.id ? draft.item : 'Registrar manutenção'}</h2></header><fieldset disabled={busy}><div className={styles.fieldPair}><label>Suíte<select value={draft.suite} onChange={event => set('suite', event.target.value)}>{maintenanceSuites.map(item => <option key={item}>{item}</option>)}</select></label><label>Categoria<select value={draft.category} onChange={event => set('category', event.target.value)}>{maintenanceCategories.map(item => <option key={item}>{item}</option>)}</select></label></div><label>Item ou equipamento<input ref={firstInput} list="maintenance-items" required maxLength={120} value={draft.item} onChange={event => set('item', event.target.value)} placeholder="Ex.: Ar-condicionado" /><datalist id="maintenance-items">{itemSuggestions.map(item => <option key={item} value={item} />)}</datalist></label><div className={styles.fieldPair}><label>Tipo<select value={draft.service_type} onChange={event => set('service_type', event.target.value)}>{maintenanceTypes.map(item => <option key={item} value={item}>{typeLabel[item]}</option>)}</select></label><label>Estado<select value={draft.status} onChange={event => set('status', event.target.value)}>{maintenanceStatuses.map(item => <option key={item} value={item}>{statusLabel[item]}</option>)}</select></label></div><div className={styles.fieldPair}><label>Data do serviço<input type="date" required={draft.status === 'completed'} value={draft.performed_on} onChange={event => set('performed_on', event.target.value)} /></label><label>Próxima revisão<input type="date" min={draft.performed_on || undefined} value={draft.next_due_on} onChange={event => set('next_due_on', event.target.value)} /></label></div><label>Serviço realizado / problema identificado<textarea required rows={4} maxLength={2000} value={draft.description} onChange={event => set('description', event.target.value)} placeholder="Descreva o que foi feito, peças trocadas e condição encontrada." /></label><div className={styles.fieldPair}><label>Responsável / fornecedor<input maxLength={160} value={draft.provider} onChange={event => set('provider', event.target.value)} /></label><label>Custo (R$)<input type="number" min="0" max="99999999.99" step="0.01" inputMode="decimal" value={draft.cost} onChange={event => set('cost', event.target.value)} /></label></div><label>Observações<textarea rows={3} maxLength={2000} value={draft.notes} onChange={event => set('notes', event.target.value)} placeholder="Garantia, modelo, número de série ou detalhes para a próxima visita." /></label></fieldset><div role="status" className={styles.message}>{notice}</div><div className={styles.actions}><button className={styles.primary} disabled={busy}>{busy ? 'Salvando…' : draft.id ? 'Salvar alterações' : 'Adicionar ao histórico'}</button>{draft.id && draft.status !== 'cancelled' && <button className={styles.secondary} type="button" disabled={busy} onClick={() => set('status', 'cancelled')}>Cancelar registro</button>}</div><p className={styles.hint}>Registros cancelados continuam no histórico para preservar a rastreabilidade. Nenhum dado é enviado ao Motel+.</p></form></div>
      {!!latest.length && <section className={styles.maintenanceOverview}><header><div><p className={styles.kicker}>INVENTÁRIO DE CUIDADOS</p><h2>Última manutenção por item</h2></div></header><div className={styles.financeTableWrap}><table className={styles.financeTable}><thead><tr><th>Suíte</th><th>Item</th><th>Categoria</th><th>Última manutenção</th><th>Próxima revisão</th></tr></thead><tbody>{latest.map(item => <tr key={`${item.suite}-${item.item.toLocaleLowerCase('pt-BR')}`}><td>{item.suite}</td><td><strong>{item.item}</strong></td><td>{item.category}</td><td>{date(item.performed_on)}</td><td>{date(item.next_due_on)}</td></tr>)}</tbody></table></div></section>}
    </section></main>;
}
