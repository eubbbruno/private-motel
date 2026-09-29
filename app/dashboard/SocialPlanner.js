'use client';
import { useEffect, useState } from 'react';
import { channels, formats, editorialDay, calendarDays, editorialCSV } from '../../lib/social-planning.mjs';
import { brasiliaInput, brasiliaISO } from '../../lib/campaign.mjs';
import styles from './dashboard.module.css';
import SocialMediaStudio from './SocialMediaStudio';
import { dashboardClient } from './client';

export function SocialFields({ draft, setDraft, busy, setBusy, onNotice, onError }) {
  const [captionConfig, setCaptionConfig] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const change = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const fingerprint = JSON.stringify([draft.title, draft.body, draft.channel || 'instagram', draft.format || 'feed']);
  useEffect(() => {
    let active = true;
    dashboardClient().auth.getSession().then(({ data }) => {
      if (!data.session) throw Error('Sessão encerrada.');
      return fetch('/api/dashboard/social/caption', { headers: { Authorization: `Bearer ${data.session.access_token}` } });
    }).then(async response => { if (!response.ok) throw Error(); return response.json(); })
      .then(data => { if (active) setCaptionConfig(data); }).catch(() => { if (active) setCaptionConfig({ configured: false }); });
    return () => { active = false; };
  }, []);
  async function generateCaption() {
    if (busy) return;
    if (!draft.title?.trim()) { onError('Informe um título antes de gerar a legenda.'); return; }
    setBusy(true); setSuggestion(null); onError(''); onNotice('Preparando uma sugestão de legenda…');
    try {
      const { data } = await dashboardClient().auth.getSession();
      if (!data.session) throw Error('Sua sessão terminou. Entre novamente.');
      const response = await fetch('/api/dashboard/social/caption', {
        method: 'POST', headers: { Authorization: `Bearer ${data.session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: draft.title, brief: draft.body || '', channel: draft.channel || 'instagram', format: draft.format || 'feed' }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      setSuggestion({ caption: result.caption, fingerprint });
      onNotice('Sugestão pronta. Revise antes de aplicar ao rascunho. Nenhum conteúdo foi salvo ou publicado.');
    } catch (error) { onError(error.message || 'Não foi possível gerar a legenda.'); }
    finally { setBusy(false); }
  }
  return <section className={styles.campaignFields} aria-label="Planejamento da publicação"><h2>Próximo encontro com a marca</h2>
    <div className={styles.fieldPair}><label>Canal<select value={draft.channel || 'instagram'} onChange={e => change('channel',e.target.value)}>{Object.entries(channels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>Formato<select value={draft.format || 'feed'} onChange={e => change('format',e.target.value)}>{Object.entries(formats).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div>
    <label>Data planejada — Brasília (UTC−3)<input type="datetime-local" value={brasiliaInput(draft.planned_at)} onChange={e => change('planned_at',brasiliaISO(e.target.value))} onBlur={e => change('planned_at',brasiliaISO(e.target.value))} /></label>
    <p className={styles.hint}>A data organiza o calendário. Não dispara publicação automática. Aprovação e postagem nas redes são etapas diferentes.</p>
    <section className={styles.captionAssistant} aria-label="Assistente de legenda"><p className={styles.kicker}>ASSISTÊNCIA EDITORIAL</p><h3>Uma legenda para revisar</h3><p>Use o título e o texto acima como briefing. A OpenAI gera uma sugestão por clique; você escolhe se deseja aplicá-la. Pode haver cobrança da API.</p>
      <button type="button" className={styles.secondary} onClick={generateCaption} disabled={busy || captionConfig?.configured !== true}>{busy ? 'Aguarde…' : 'Sugerir legenda'}</button>
      <p className={styles.hint}>{captionConfig?.configured === false ? 'OPENAI_API_KEY não está disponível no servidor.' : captionConfig ? `Provedor: ${captionConfig.provider} · Modelo: ${captionConfig.model} · Limite de 400 tokens de saída por pedido.` : 'Verificando configuração da IA…'}</p>
      {suggestion && <div className={styles.captionSuggestion}><strong>Sugestão da IA — revise fatos e tom</strong><p>{suggestion.caption}</p><button type="button" className={styles.secondary} disabled={busy || suggestion.fingerprint !== fingerprint} onClick={() => { change('body', suggestion.caption); setSuggestion(null); onNotice('Legenda aplicada ao rascunho. Revise e clique em Salvar conteúdo quando estiver pronta.'); }}>Usar no rascunho</button>{suggestion.fingerprint !== fingerprint && <small>O briefing mudou. Gere uma nova sugestão para aplicá-la.</small>}</div>}
    </section>
    <SocialMediaStudio draft={draft} setDraft={setDraft} busy={busy} setBusy={setBusy} onNotice={onNotice} onError={onError} />
  </section>;
}
export function SocialCalendar({ items, onSelect, busy }) {
  const [month, setMonth] = useState(() => editorialDay(new Date().toISOString()).slice(0,7));
  const active = items.filter(item => item.status !== 'archived');
  const days = calendarDays(month);
  const offset = days.length ? (new Date(`${days[0]}T12:00:00Z`).getUTCDay() + 6) % 7 : 0;
  function download() {
    const url = URL.createObjectURL(new Blob([editorialCSV(active)],{type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a'); link.href=url; link.download='private-calendario-editorial.csv'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <section className={styles.calendar} aria-label="Calendário editorial"><div className={styles.calendarHeading}><h2>Calendário editorial</h2><button type="button" className={styles.secondary} onClick={download} disabled={!active.length}>Exportar CSV</button></div><label>Mês do calendário<input type="month" value={month} onChange={e=>setMonth(e.target.value)} /></label>
    <div className={styles.calendarGrid}>{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(day=><span className={styles.weekday} key={day}>{day}</span>)}{Array.from({length:offset},(_,i)=><span className={styles.blankDay} key={`blank-${i}`} />)}{days.map(day=><div className={styles.calendarDay} key={day}><time dateTime={day}>{Number(day.slice(-2))}</time>{active.filter(item=>editorialDay(item.planned_at)===day).sort((a,b)=>a.planned_at.localeCompare(b.planned_at)).map(item=><button type="button" key={item.id} disabled={busy} onClick={()=>onSelect(item)}><small>{brasiliaInput(item.planned_at).slice(11)} · {channels[item.channel]}</small>{item.title}</button>)}</div>)}</div>
    <p className={styles.hint}>{active.filter(item=>!item.planned_at).length} conteúdo(s) sem data. O calendário inclui os conteúdos carregados no painel; não representa postagens confirmadas pela Meta.</p>
  </section>;
}
