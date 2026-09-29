'use client';
/* eslint-disable @next/next/no-img-element -- Already resized WebP artwork uses private, expiring URLs; avoid a public optimizer cache. */
import { useEffect, useRef, useState } from 'react';
import { dashboardClient } from './client';
import { brasiliaInput, brasiliaISO } from '../../lib/campaign.mjs';
import styles from './dashboard.module.css';

export default function CampaignEditor({ draft, setDraft, busy, setBusy, onError }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const dialog = useRef(null);
  const change = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  useEffect(() => {
    let active = true; setPreviewUrl('');
    if (draft.image_path) {
      dashboardClient().auth.getSession().then(async ({ data }) => {
        if (!data.session) return;
        const response = await fetch(`/api/dashboard/media?path=${encodeURIComponent(draft.image_path)}`, { headers: { Authorization: `Bearer ${data.session.access_token}` } });
        const result = await response.json();
        if (active && response.ok) setPreviewUrl(result.previewUrl);
        else if (active) onError('Não foi possível carregar a prévia da arte.');
      }).catch(() => { if (active) onError('Não foi possível carregar a prévia da arte.'); });
    }
    return () => { active = false; };
  }, [draft.image_path, onError]);
  async function upload(event) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    if (file.size > 6 * 1024 * 1024) { onError('Envie uma imagem de até 6 MB.'); return; }
    setBusy(true); onError('');
    try {
      const { data } = await dashboardClient().auth.getSession();
      if (!data.session) throw Error('Sua sessão terminou. Entre novamente.');
      const response = await fetch('/api/dashboard/media', { method: 'POST', headers: { Authorization: `Bearer ${data.session.access_token}`, 'Content-Type': file.type || 'application/octet-stream' }, body: file });
      const result = await response.json(); if (!response.ok) throw Error(result.error);
      setDraft(current => ({ ...current, image_path: result.path, image_alt: current.image_alt || `Arte da campanha ${current.popup_title || current.title || 'Private Motel'}` })); setPreviewUrl(result.previewUrl || '');
    } catch (error) { onError(error.message || 'Não foi possível enviar a arte.'); } finally { setBusy(false); }
  }
  return <section className={styles.campaignFields} aria-label="Configuração do pop-up">
    <h2>Conteúdo do popup</h2><p className={styles.hint}>Envie a arte, escreva o título e escolha o período. A descrição da imagem é preenchida automaticamente e pode ser ajustada.</p>
    <label>Arte da campanha<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} /></label>
    {previewUrl && <div className={styles.artPreview}>{/* User upload is served by an expiring signed URL. */}{/* eslint-disable-next-line @next/next/no-img-element */}<img src={previewUrl} alt={draft.image_alt || 'Prévia da arte enviada'} /></div>}
    <label>Descrição acessível da imagem<input maxLength={200} value={draft.image_alt || ''} onChange={e => change('image_alt', e.target.value)} /></label>
    <label>Título público<input maxLength={100} value={draft.popup_title || ''} onChange={e => change('popup_title', e.target.value)} /></label>
    <label>Texto público<textarea rows={3} maxLength={500} value={draft.popup_text || ''} onChange={e => change('popup_text', e.target.value)} /></label>
    <div className={styles.fieldPair}><label>Texto do botão<input maxLength={50} value={draft.cta_label || ''} onChange={e => change('cta_label', e.target.value)} placeholder="Conhecer as suítes" /></label><label>Destino do botão<input maxLength={500} value={draft.cta_url || ''} onChange={e => change('cta_url', e.target.value)} placeholder="/suites" /></label></div>
    <div className={styles.fieldPair}><label>Início — Brasília (UTC−3)<input type="datetime-local" value={brasiliaInput(draft.starts_at)} onChange={e => change('starts_at', brasiliaISO(e.target.value))} onBlur={e => change('starts_at', brasiliaISO(e.target.value))} /></label><label>Fim — Brasília (UTC−3)<input type="datetime-local" value={brasiliaInput(draft.ends_at)} onChange={e => change('ends_at', brasiliaISO(e.target.value))} onBlur={e => change('ends_at', brasiliaISO(e.target.value))} /></label></div>
    <details className={styles.advanced}><summary>Opções avançadas</summary><label>Prioridade (0–100)<input type="number" min={0} max={100} value={draft.priority ?? 0} onChange={e => change('priority', Number(e.target.value))} /></label><p>Se houver duas campanhas ativas ao mesmo tempo, aparece primeiro a de maior prioridade.</p></details>
    <p className={styles.hint}>Na Home, o popup abre após 8 segundos. Depois que o visitante fecha, ele só reaparece para essa pessoa após 24 horas.</p>
    <button type="button" className={styles.secondary} disabled={!previewUrl} onClick={() => dialog.current.showModal()}>Pré-visualizar pop-up</button>
    <dialog ref={dialog} className={styles.previewDialog} aria-label="Prévia do pop-up"><button type="button" className={styles.secondary} onClick={() => dialog.current.close()}>Fechar prévia</button>{previewUrl && <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={previewUrl} alt={draft.image_alt || 'Arte da campanha'} /></>}<h2>{draft.popup_title || 'Título da campanha'}</h2><p>{draft.popup_text}</p>{draft.cta_label && <span className={styles.primary}>{draft.cta_label}</span>}<p className={styles.hint}>Prévia. O botão não navega e nenhuma publicação é feita aqui.</p></dialog>
  </section>;
}
