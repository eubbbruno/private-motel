'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegFileAlt, FaBullhorn, FaExternalLinkAlt, FaSignOutAlt, FaPlus, FaDatabase, FaChartLine } from 'react-icons/fa';
import { dashboardClient } from './client';
import styles from './dashboard.module.css';
import CampaignEditor from './CampaignEditor';
import { campaignFields } from '../../lib/campaign.mjs';
import { socialFields } from '../../lib/social-planning.mjs';
import { SocialFields, SocialCalendar } from './SocialPlanner';
import CampaignStatus from './CampaignStatus';

const labels = { draft: 'Rascunho', review: 'Em revisão', approved: 'Aprovado', archived: 'Arquivado', published: 'Publicada / agendada', paused: 'Pausada' };
const blank = () => ({ title: '', body: '', status: 'draft' });

function DashboardBrand() {
  return <Link href="/" className={styles.brand} aria-label="Private Motel — voltar ao site">
    <Image src="/images/logo.png" width={200} height={67} alt="Private Motel" priority />
    <span>ADMINISTRAÇÃO</span>
  </Link>;
}

function campaignSaveLabel(draft) {
  if (draft.status !== 'published') return draft.id ? 'Salvar alterações' : 'Salvar rascunho';
  if (draft.starts_at && Date.parse(draft.starts_at) > Date.now()) return 'Agendar popup';
  return 'Publicar popup';
}

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [ready, setReady] = useState(false);
  const [resource, setResource] = useState('posts');
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(blank);
  const [saved, setSaved] = useState(JSON.stringify(blank()));
  const [search, setSearch] = useState('');
  const [archived, setArchived] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [sessionCheck, setSessionCheck] = useState(0);
  const titleInput = useRef(null);
  const dirty = JSON.stringify(draft) !== saved;

  useEffect(() => {
    const client = dashboardClient();
    if (!client) { setReady(true); return; }
    let active = true;
    client.auth.getSession().then(({ data }) => { if (active) { setSession(data.session); setReady(true); } });
    const { data } = client.auth.onAuthStateChange((_event, next) => { if (active) setSession(next); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const prevent = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [dirty]);

  useEffect(() => {
    const controller = new AbortController();
    setIdentity(null); setItems([]);
    if (session) {
      fetch('/api/dashboard/session', { headers: { Authorization: `Bearer ${session.access_token}` }, signal: controller.signal })
        .then(async response => { const data = await response.json(); if (!response.ok) throw Error(data.error); return data; })
        .then(data => { setIdentity(data); setError(''); })
        .catch(e => { if (e.name !== 'AbortError') setError(e.message || 'Não foi possível verificar seu acesso.'); });
    }
    return () => controller.abort();
  }, [session, sessionCheck]);

  useEffect(() => {
    if (!identity || !session) return;
    const controller = new AbortController();
    setLoading(true); setError('');
    fetch(`/api/dashboard/content/${resource}`, { headers: { Authorization: `Bearer ${session.access_token}` }, signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw Error(data.error); return data.items; })
      .then(setItems).catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [identity, resource, session]);

  function select(item) { setDraft(item); setSaved(JSON.stringify(item)); setNotice(''); setError(''); }
  function canLeave() { return !dirty || window.confirm('Descartar as alterações não salvas?'); }
  function changeResource(value) {
    if (busy || value === resource || !canLeave()) return;
    setResource(value); setItems([]); select(blank()); setArchived(false); setSearch('');
  }
  async function login(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      const { error: authError } = await dashboardClient().auth.signInWithPassword({ email: data.get('email'), password: data.get('password') });
      if (authError) throw Error('Não foi possível entrar. Confira seu e-mail e senha.');
      event.target.reset();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function logout() {
    if (busy || !canLeave()) return;
    setBusy(true);
    try {
      const { error: signoutError } = await dashboardClient().auth.signOut({ scope: 'local' });
      if (signoutError) throw signoutError;
      setSession(null); setIdentity(null); setItems([]); select(blank());
    } catch { setError('Não foi possível sair. Tente novamente.'); } finally { setBusy(false); }
  }
  async function save(event, status) {
    event?.preventDefault(); if (busy || !identity) return;
    if (!draft.title.trim()) { setError('Informe um título.'); titleInput.current?.focus(); return; }
    if (status === 'archived' && !window.confirm('Arquivar este conteúdo? Você poderá restaurá-lo depois.')) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const { data } = await dashboardClient().auth.getSession();
      if (!data.session) throw Error('Sua sessão terminou. Entre novamente.');
      const payload = { title: draft.title, body: draft.body, status: status || draft.status,
        ...Object.fromEntries((resource === 'campaigns' ? campaignFields : socialFields).map(key => [key, draft[key]])), ...(draft.id ? { id: draft.id, version: draft.version } : {}) };
      const response = await fetch(`/api/dashboard/content/${resource}`, {
        method: draft.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` }, body: JSON.stringify(payload),
      });
      const result = await response.json(); if (!response.ok) throw Error(result.error);
      select(result.item); setItems(current => [result.item, ...current.filter(item => item.id !== result.item.id)]);
      setArchived(result.item.status === 'archived');
      if (resource === 'campaigns' && result.item.status === 'published') {
        setNotice(Date.parse(result.item.starts_at) > Date.now() ? 'Popup agendado. Ele será ativado automaticamente na data inicial.' : 'Popup publicado. Ele já está disponível na Home durante o período configurado.');
      } else setNotice('Conteúdo salvo no painel.');
    } catch (e) { setError(e.message || 'Não foi possível salvar. Seu texto foi preservado.'); } finally { setBusy(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft.body); setNotice('Texto copiado.'); }
    catch { setError('Não foi possível copiar. Selecione o texto e copie manualmente.'); }
  }
  function duplicate() {
    if (busy || !canLeave()) return;
    const fields = resource === 'posts' ? socialFields : campaignFields;
    setDraft({ title: `${draft.title} — cópia`.slice(0,160), body: draft.body, status: 'draft', ...Object.fromEntries(fields.map(key=>[key,draft[key]])) });
    setSaved(JSON.stringify(blank())); setNotice('Cópia em rascunho. Salve para adicioná-la ao painel.'); setError(''); titleInput.current?.focus();
  }

  const configured = ready && !!dashboardClient();
  if (!identity) return <main id="main-content" className={styles.login}>
    <DashboardBrand />
    <div className={styles.loginBox}><p className={styles.kicker}>GESTÃO PRIVATE</p><h1>Seu espaço de criação.</h1>
      {!ready ? <p>Carregando…</p> : !configured ? <p>O acesso ao painel ainda não foi configurado.</p> : session ? <><p>Verificando suas permissões…</p>{error && <p role="alert">{error}</p>}<button className={styles.secondary} onClick={logout}>Sair desta conta</button></> :
      <form onSubmit={login}><label>E-mail<input name="email" type="email" autoComplete="username" required /></label><label>Senha<input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p role="alert">{error}</p>}<button className={styles.primary} disabled={busy}>{busy ? 'Entrando…' : 'Entrar no painel'}</button><p className={styles.hint}>Acesso exclusivo da equipe Private. Use o usuário cadastrado no Supabase.</p></form>}
      {session && error && <button className={styles.primary} onClick={() => { setError(''); setSessionCheck(value => value + 1); }}>Tentar novamente</button>}
    </div></main>;

  const visible = items.filter(item => (item.status === 'archived') === archived && `${item.title} ${item.body}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
  const canEdit = resource === 'posts' || identity.role === 'owner' || draft.status === 'draft';
  const statuses = resource === 'posts' ? ['draft', 'review', 'approved'] : identity.role === 'owner' ? ['draft', 'published', 'paused'] : ['draft'];
  return <main id="main-content" className={styles.shell}>
    <aside className={styles.sidebar}><DashboardBrand /><p className={styles.kicker}>CENTRAL DE GESTÃO</p>
      <nav aria-label="Painel editorial"><button aria-current={resource === 'posts' ? 'page' : undefined} onClick={() => changeResource('posts')} disabled={busy}><FaRegFileAlt />Social Media</button><button aria-current={resource === 'campaigns' ? 'page' : undefined} onClick={() => changeResource('campaigns')} disabled={busy}><FaBullhorn />Campanhas</button><Link href="/dashboard/finance"><FaChartLine />Financeiro</Link><Link href="/dashboard/motel-plus"><FaDatabase />Motel+</Link><Link href="/" target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt />Ver site</Link><button onClick={logout} disabled={busy}><FaSignOutAlt />Sair</button></nav>
      <p className={styles.signature}>DISCRIÇÃO TAMBÉM<br />É UMA FORMA<br />DE LIBERDADE.</p></aside>
    <section className={styles.workspace}><header className={styles.heading}><div><h1>{resource === 'posts' ? 'Social Media' : 'Campanhas'}</h1><p>Planeje. Escreva. Revise.</p></div><button className={styles.secondary} disabled={busy} onClick={() => { if (canLeave()) { select(blank()); titleInput.current?.focus(); } }}><FaPlus />Novo conteúdo</button></header>
      <div className={styles.columns}><section className={styles.list} aria-label="Conteúdos"><label className={styles.search}>Buscar conteúdo<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Título ou texto" /></label><div className={styles.tabs}><button aria-pressed={!archived} onClick={() => setArchived(false)}>Ativos ({items.filter(i => i.status !== 'archived').length})</button><button aria-pressed={archived} onClick={() => setArchived(true)}>Arquivados ({items.filter(i => i.status === 'archived').length})</button></div>
        {loading ? <p className={styles.empty}>Carregando conteúdos…</p> : visible.length ? visible.map(item => <button key={item.id} className={styles.row} aria-current={draft.id === item.id ? 'true' : undefined} disabled={busy} onClick={() => { if (canLeave()) select(item); }}><span><strong>{item.title}</strong><small>Atualizado em {new Date(item.updated_at).toLocaleDateString('pt-BR')}</small></span><small className={styles.status}>{labels[item.status]}</small></button>) : <p className={styles.empty}>{search ? 'Nenhum resultado para esta busca.' : archived ? 'Nenhum conteúdo arquivado.' : 'Seu próximo conteúdo começa aqui. Crie o primeiro rascunho.'}</p>}
        {items.length === 100 && <p className={styles.hint}>Exibindo os 100 conteúdos mais recentes.</p>}</section>
      <form className={styles.editor} onSubmit={save}><fieldset disabled={busy || !canEdit}><label>{resource === 'posts' ? 'Título' : 'Nome interno da campanha'}<input ref={titleInput} required maxLength={160} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label><label>{resource === 'posts' ? 'Legenda / briefing' : 'Anotações internas (opcional)'}<textarea rows={resource === 'posts' ? 9 : 3} maxLength={10000} value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} /></label><label>{resource === 'campaigns' ? 'Publicação' : 'Estado'}<select aria-label={resource === 'campaigns' ? 'Publicação' : 'Estado'} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })}>{[...new Set([...statuses, draft.status])].map(status => <option key={status} value={status}>{resource === 'campaigns' && status === 'draft' ? 'Rascunho — não aparece no site' : resource === 'campaigns' && status === 'published' ? 'Publicado / agendado — segue as datas' : resource === 'campaigns' && status === 'paused' ? 'Pausado — não aparece no site' : labels[status]}</option>)}</select></label>{resource === 'posts' && <SocialFields draft={draft} setDraft={setDraft} busy={busy} setBusy={setBusy} onNotice={setNotice} onError={setError} />}{resource === 'campaigns' && <CampaignEditor draft={draft} setDraft={setDraft} busy={busy} setBusy={setBusy} onError={setError} />}</fieldset>
        <div role="status" className={styles.message}>{notice}</div>{error && <p role="alert" className={styles.error}>{error} {draft.id && <button type="button" onClick={() => { if (canLeave()) window.location.reload(); }}>Recarregar</button>}</p>}
        <div className={styles.actions}><button className={styles.primary} disabled={busy || !canEdit}>{busy ? 'Salvando…' : resource === 'campaigns' ? campaignSaveLabel(draft) : 'Salvar conteúdo'}</button><button type="button" className={styles.secondary} onClick={copy} disabled={!draft.body}>Copiar texto</button>{draft.id && <button type="button" className={styles.secondary} disabled={busy} onClick={duplicate}>Duplicar</button>}{draft.id && canEdit && <button type="button" className={styles.secondary} disabled={busy} onClick={() => save(null, draft.status === 'archived' ? 'draft' : 'archived')}>{draft.status === 'archived' ? 'Restaurar' : 'Arquivar'}</button>}</div>
        <p className={styles.hint}>{resource === 'posts' ? 'Publicação nas redes ainda não conectada. O texto salvo pode ser copiado para Instagram ou Facebook.' : 'Para aparecer na Home: escolha “Publicado / agendado”, informe um período que inclua a data atual e salve. Se o início for futuro, a ativação acontece automaticamente.'}</p>
      {resource === 'campaigns' && <CampaignStatus key={`${draft.id}-${draft.version}`} draft={draft} dirty={dirty} />}</form></div>{resource === 'posts' && <SocialCalendar items={items} busy={busy} onSelect={item => { if (canLeave()) { select(item); titleInput.current?.focus(); } }} />}</section>
  </main>;
}
