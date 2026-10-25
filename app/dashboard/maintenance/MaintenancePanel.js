'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaChartLine, FaCheck, FaDatabase, FaDownload, FaExternalLinkAlt, FaPlus, FaSearch, FaTools, FaUsers } from 'react-icons/fa';
import { dashboardClient } from '../client';
import { maintenanceCategories, maintenanceRooms, maintenanceStatuses, maintenanceSuites, maintenanceTypes } from '../../../lib/maintenance.mjs';
import styles from '../dashboard.module.css';

const publicSite = process.env.NEXT_PUBLIC_DASHBOARD_STANDALONE === 'true' ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.privatemotel.com.br') : '/';
const statusLabel = { completed: 'Concluída', scheduled: 'Agendada', in_progress: 'Em andamento', cancelled: 'Cancelada' };
const typeLabel = { preventive: 'Preventiva', corrective: 'Corretiva', inspection: 'Inspeção', installation: 'Instalação' };
const itemSuggestions = ['Pintura', 'Gesso', 'Hidromassagem', 'Sauna', 'Ar-condicionado', 'TV', 'Iluminação', 'Som', 'Frigobar', 'Fechadura', 'Mobiliário', 'Elétrica', 'Hidráulica', 'Banheiro', 'Enxoval'];
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
const blank = () => ({ suite: '', suite_number: '', item: '', category: 'Outros', service_type: 'corrective', status: 'scheduled', performed_on: today(), completed_on: '', next_due_on: '', description: '', provider: '', cost: '', notes: '' });
const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—';
const money = value => value === null || value === '' ? '—' : Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const editable = record => ({
  ...(record.id ? { id: record.id, version: record.version } : {}),
  suite: record.suite || '', suite_number: record.suite_number || '', item: record.item || '',
  category: record.category || 'Outros', service_type: record.service_type || 'corrective',
  status: record.status || 'scheduled', performed_on: record.performed_on || today(),
  completed_on: record.completed_on || '', next_due_on: record.next_due_on || '',
  description: record.description || '', provider: record.provider || '', cost: record.cost ?? '', notes: record.notes || '',
});
const csvCell = value => `"${String(value ?? '').replaceAll('"', '""')}"`;

function Brand() {
  return <Link href={publicSite} className={styles.brand} aria-label="Private Motel — voltar ao site"><Image src="/images/logo.png" width={200} height={67} alt="Private Motel" priority /><span>ADMINISTRAÇÃO</span></Link>;
}

export default function MaintenancePanel() {
  const [state, setState] = useState({ loading: true, records: [], error: '' });
  const [draft, setDraft] = useState(blank);
  const [saved, setSaved] = useState(JSON.stringify(blank()));
  const [busy, setBusy] = useState(false);
  const [completing, setCompleting] = useState('');
  const [notice, setNotice] = useState('');
  const [filters, setFilters] = useState({ suite: 'all', search: '' });
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
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function select(record) {
    if (dirty && !window.confirm('Descartar as alterações não salvas?')) return;
    const next = editable(record);
    setDraft(next); setSaved(JSON.stringify(next)); setNotice('');
    firstInput.current?.focus();
  }

  function create() {
    if (dirty && !window.confirm('Descartar as alterações não salvas?')) return;
    const next = blank();
    setDraft(next); setSaved(JSON.stringify(next)); setNotice('');
    firstInput.current?.focus();
  }

  function updateRecord(record) {
    setState(current => ({ ...current, records: [record, ...current.records.filter(item => item.id !== record.id)] }));
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setNotice(''); setState(current => ({ ...current, error: '' }));
    try {
      const payload = { ...draft, cost: draft.cost === '' ? null : Number(draft.cost) };
      const result = await request(draft.id ? 'PATCH' : 'POST', payload);
      const next = editable(result.record);
      setDraft(next); setSaved(JSON.stringify(next)); updateRecord(result.record);
      setNotice(draft.id ? 'Registro atualizado.' : 'Serviço adicionado ao checklist.');
    } catch (error) { setState(current => ({ ...current, error: error.message })); }
    finally { setBusy(false); }
  }

  async function complete(record) {
    if (completing) return;
    setCompleting(record.id); setNotice(''); setState(current => ({ ...current, error: '' }));
    try {
      const payload = { ...editable(record), status: 'completed', completed_on: today() };
      const result = await request('PATCH', payload);
      updateRecord(result.record);
      if (draft.id === record.id) {
        const next = editable(result.record);
        setDraft(next); setSaved(JSON.stringify(next));
      }
      setNotice(`${record.item} da suíte ${record.suite_number} foi movido para o histórico concluído.`);
    } catch (error) { setState(current => ({ ...current, error: error.message })); }
    finally { setCompleting(''); }
  }

  const matches = useCallback(item => {
    const haystack = `${item.suite_number} ${item.suite} ${item.item} ${item.category} ${item.description} ${item.provider}`.toLocaleLowerCase('pt-BR');
    return (filters.suite === 'all' || item.suite === filters.suite) && haystack.includes(filters.search.toLocaleLowerCase('pt-BR'));
  }, [filters]);
  const open = useMemo(() => state.records.filter(item => ['scheduled', 'in_progress'].includes(item.status) && matches(item)).sort((a,b) => (a.performed_on || '').localeCompare(b.performed_on || '')), [state.records, matches]);
  const completed = useMemo(() => state.records.filter(item => item.status === 'completed' && matches(item)).sort((a,b) => (b.completed_on || '').localeCompare(a.completed_on || '')), [state.records, matches]);
  const cancelled = useMemo(() => state.records.filter(item => item.status === 'cancelled' && matches(item)), [state.records, matches]);
  const metrics = useMemo(() => ({
    open: state.records.filter(item => ['scheduled', 'in_progress'].includes(item.status)).length,
    today: state.records.filter(item => item.status === 'completed' && item.completed_on === today()).length,
    completed: state.records.filter(item => item.status === 'completed').length,
    overdue: state.records.filter(item => ['scheduled', 'in_progress'].includes(item.status) && item.performed_on < today()).length,
  }), [state.records]);

  const set = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const chooseRoom = number => {
    const room = maintenanceRooms.find(item => item.number === number);
    setDraft(current => ({ ...current, suite_number: number, suite: room?.suite || '' }));
  };
  const changeStatus = value => setDraft(current => ({ ...current, status: value, completed_on: value === 'completed' ? (current.completed_on || today()) : '' }));

  function downloadCompleted() {
    const headings = ['Suíte', 'Categoria', 'Item', 'Data do serviço', 'Data de conclusão', 'Tipo', 'Responsável', 'Custo', 'Descrição', 'Observações'];
    const rows = completed.map(item => [item.suite_number, item.suite, item.item, item.performed_on, item.completed_on, typeLabel[item.service_type], item.provider, item.cost, item.description, item.notes]);
    const csv = '\uFEFF' + [headings, ...rows].map(row => row.map(csvCell).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `manutencoes-concluidas-${today()}.csv`; link.click(); URL.revokeObjectURL(url);
  }

  return <main id="main-content" className={styles.shell}>
    <aside className={styles.sidebar}><Brand /><p className={styles.kicker}>GESTÃO OPERACIONAL</p><nav aria-label="Painel administrativo"><Link href="/dashboard"><FaArrowLeft />Social e campanhas</Link><Link href="/dashboard/finance"><FaChartLine />Financeiro</Link><Link href="/dashboard/motel-plus"><FaDatabase />Motel+</Link><Link href="/dashboard/maintenance" aria-current="page"><FaTools />Manutenção</Link><Link href="/dashboard/payroll"><FaUsers />Folha e RH</Link><Link href={publicSite} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt />Ver site</Link></nav><p className={styles.signature}>CUIDADO REGISTRADO.<br />PADRÃO<br />PRESERVADO.</p></aside>
    <section className={`${styles.workspace} ${styles.maintenanceWorkspace}`}>
      <header className={styles.heading}><div><p className={styles.kicker}>CHECKLIST POR SUÍTE</p><h1>Manutenção</h1><p>Abra um serviço, acompanhe o que falta e marque como concluído com um clique.</p></div><button className={styles.secondary} onClick={create} disabled={busy}><FaPlus />Novo serviço</button></header>
      {state.error && <p role="alert" className={styles.error}>{state.error} <button type="button" onClick={load}>Tentar novamente</button></p>}
      {notice && <p role="status" className={styles.success}>{notice}</p>}
      <section className={styles.maintenanceKpis} aria-label="Resumo da manutenção"><article data-tone={metrics.overdue ? 'attention' : 'neutral'}><small>ATRASADAS</small><strong>{metrics.overdue}</strong></article><article><small>EM ABERTO</small><strong>{metrics.open}</strong></article><article><small>CONCLUÍDAS HOJE</small><strong>{metrics.today}</strong></article><article><small>TOTAL CONCLUÍDO</small><strong>{metrics.completed}</strong></article></section>

      <div className={styles.maintenanceColumns}>
        <section className={styles.maintenanceHistory}>
          <header><div><p className={styles.kicker}>PENDÊNCIAS</p><h2>Checklist em aberto</h2></div><span>{open.length} item(ns)</span></header>
          <div className={styles.maintenanceFilters}><label><span className={styles.srOnly}>Buscar</span><FaSearch /><input type="search" value={filters.search} onChange={event => setFilters({ ...filters, search: event.target.value })} placeholder="Buscar suíte ou item" /></label><select aria-label="Filtrar por categoria de suíte" value={filters.suite} onChange={event => setFilters({ ...filters, suite: event.target.value })}><option value="all">Todas as suítes</option>{maintenanceSuites.map(item => <option key={item}>{item}</option>)}</select></div>
          {state.loading ? <p className={styles.empty}>Carregando checklist…</p> : open.length ? <div className={styles.maintenanceChecklist}>{open.map(item => <article key={item.id} data-status={item.status}><button type="button" className={styles.checkAction} onClick={() => complete(item)} disabled={completing === item.id} aria-label={`Marcar ${item.item} da suíte ${item.suite_number} como concluído`}><FaCheck /></button><button type="button" className={styles.checkContent} onClick={() => select(item)}><span><strong>Suíte {item.suite_number}</strong><small>{item.suite}</small></span><span><b>{item.item}</b><small>{statusLabel[item.status]} · serviço em {formatDate(item.performed_on)}</small>{item.description && <p>{item.description}</p>}</span></button></article>)}</div> : <p className={styles.empty}>Nenhum serviço em aberto com estes filtros.</p>}
        </section>

        <form className={styles.maintenanceEditor} onSubmit={save}>
          <header><div><p className={styles.kicker}>{draft.id ? 'EDITAR SERVIÇO' : 'NOVO SERVIÇO'}</p><h2>{draft.id ? draft.item : 'Adicionar ao checklist'}</h2></div></header>
          <fieldset disabled={busy}>
            <div className={styles.fieldPair}><label>Número da suíte<select required value={draft.suite_number} onChange={event => chooseRoom(event.target.value)}><option value="">Selecione</option>{maintenanceSuites.map(suite => <optgroup key={suite} label={suite}>{maintenanceRooms.filter(room => room.suite === suite).map(room => <option key={room.number} value={room.number}>Suíte {room.number}</option>)}</optgroup>)}</select></label><label>Categoria da suíte<input value={draft.suite} readOnly placeholder="Preenchida automaticamente" /></label></div>
            <label>Item ou equipamento<input ref={firstInput} list="maintenance-items" required maxLength={120} value={draft.item} onChange={event => set('item', event.target.value)} placeholder="Ex.: Ar-condicionado" /><datalist id="maintenance-items">{itemSuggestions.map(item => <option key={item} value={item} />)}</datalist></label>
            <div className={styles.fieldPair}><label>Data do serviço<input type="date" required value={draft.performed_on} onChange={event => set('performed_on', event.target.value)} /></label><label>Estado<select value={draft.status} onChange={event => changeStatus(event.target.value)}>{maintenanceStatuses.map(item => <option key={item} value={item}>{statusLabel[item]}</option>)}</select></label></div>
            {draft.status === 'completed' && <label>Data de conclusão<input type="date" required min={draft.performed_on || undefined} value={draft.completed_on} onChange={event => set('completed_on', event.target.value)} /></label>}
            <details className={styles.maintenanceDetails}><summary>Detalhes adicionais <span>opcionais</span></summary><div className={styles.maintenanceDetailsBody}><div className={styles.fieldPair}><label>Área<select value={draft.category} onChange={event => set('category', event.target.value)}>{maintenanceCategories.map(item => <option key={item}>{item}</option>)}</select></label><label>Tipo<select value={draft.service_type} onChange={event => set('service_type', event.target.value)}>{maintenanceTypes.map(item => <option key={item} value={item}>{typeLabel[item]}</option>)}</select></label></div><label>Próxima revisão<input type="date" min={draft.performed_on || undefined} value={draft.next_due_on} onChange={event => set('next_due_on', event.target.value)} /></label><label>Serviço ou problema<textarea rows={3} maxLength={2000} value={draft.description} onChange={event => set('description', event.target.value)} placeholder="Opcional: descreva o que precisa ser feito." /></label><div className={styles.fieldPair}><label>Responsável / fornecedor<input maxLength={160} value={draft.provider} onChange={event => set('provider', event.target.value)} /></label><label>Custo (R$)<input type="number" min="0" max="99999999.99" step="0.01" inputMode="decimal" value={draft.cost} onChange={event => set('cost', event.target.value)} /></label></div><label>Observações<textarea rows={2} maxLength={2000} value={draft.notes} onChange={event => set('notes', event.target.value)} /></label></div></details>
          </fieldset>
          <div className={styles.actions}><button className={styles.primary} disabled={busy}>{busy ? 'Salvando…' : draft.id ? 'Salvar alterações' : 'Adicionar ao checklist'}</button>{draft.id && draft.status !== 'cancelled' && <button className={styles.secondary} type="button" disabled={busy} onClick={() => changeStatus('cancelled')}>Cancelar registro</button>}</div>
          <p className={styles.hint}>Somente número da suíte, item, data e estado são necessários. Os demais detalhes são opcionais.</p>
        </form>
      </div>

      <section className={styles.maintenanceOverview}>
        <header><div><p className={styles.kicker}>SERVIÇOS FINALIZADOS</p><h2>Histórico concluído</h2></div><button type="button" className={styles.secondary} onClick={downloadCompleted} disabled={!completed.length}><FaDownload />Baixar planilha</button></header>
        {completed.length ? <div className={styles.financeTableWrap}><table className={styles.financeTable}><thead><tr><th>Suíte</th><th>Item</th><th>Data do serviço</th><th>Concluído em</th><th>Responsável</th><th></th></tr></thead><tbody>{completed.map(item => <tr key={item.id}><td><strong>{item.suite_number}</strong><small>{item.suite}</small></td><td><strong>{item.item}</strong><small>{item.category}</small></td><td>{formatDate(item.performed_on)}</td><td>{formatDate(item.completed_on)}</td><td>{item.provider || '—'}</td><td><button type="button" className={styles.tableAction} onClick={() => select(item)}>Ver</button></td></tr>)}</tbody></table></div> : <p className={styles.empty}>Os itens marcados no checklist aparecerão aqui com a data de conclusão.</p>}
        {!!cancelled.length && <details className={styles.cancelledRecords}><summary>{cancelled.length} registro(s) cancelado(s)</summary><div>{cancelled.map(item => <button type="button" key={item.id} onClick={() => select(item)}>Suíte {item.suite_number || '—'} · {item.item}</button>)}</div></details>}
      </section>
    </section>
  </main>;
}
