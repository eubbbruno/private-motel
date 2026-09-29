'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';
import { dashboardClient } from './client';
import { mediaCategories, siteMedia } from '../../lib/site-media.mjs';
import styles from './dashboard.module.css';

async function token() {
  const { data } = await dashboardClient().auth.getSession();
  if (!data.session) throw Error('Sua sessão terminou. Entre novamente.');
  return data.session.access_token;
}

export default function SocialMediaStudio({ draft, setDraft, busy, setBusy, onNotice, onError }) {
  const [category, setCategory] = useState('private');
  const [preview, setPreview] = useState(draft.media_path?.startsWith('/images/') ? draft.media_path : '');
  const [size, setSize] = useState('1024x1536');
  const [quality, setQuality] = useState('medium');
  const [configured, setConfigured] = useState(null);
  const [generated, setGenerated] = useState([]);
  const items = useMemo(() => siteMedia.filter(item => item.category === category), [category]);
  const change = (key, value) => setDraft(current => ({ ...current, [key]: value }));

  useEffect(() => {
    let active = true;
    token().then(async value => {
      const headers = { Authorization: `Bearer ${value}` };
      const [configuration, library] = await Promise.all([fetch('/api/dashboard/social/generate', { headers }), fetch('/api/dashboard/social/media', { headers })]);
      if (!configuration.ok) throw Error();
      const configData = await configuration.json();
      const libraryData = library.ok ? await library.json() : { items: [] };
      return { configured: configData.configured, items: libraryData.items || [] };
    }).then(data => { if (active) { setConfigured(data.configured); setGenerated(data.items); } }).catch(() => { if (active) setConfigured(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!draft.media_path) { setPreview(''); return; }
    if (draft.media_path.startsWith('/images/')) { setPreview(draft.media_path); return; }
    const controller = new AbortController();
    token().then(value => fetch(`/api/dashboard/social/media?path=${encodeURIComponent(draft.media_path)}`, { headers: { Authorization: `Bearer ${value}` }, signal: controller.signal }))
      .then(response => response.ok ? response.json() : Promise.reject()).then(data => setPreview(data.previewUrl || '')).catch(() => { if (!controller.signal.aborted) setPreview(''); });
    return () => controller.abort();
  }, [draft.media_path]);

  function select(item) {
    setPreview(item.path); setDraft(current => ({ ...current, media_path: item.path, media_alt: item.label }));
    onNotice('Imagem real selecionada. Salve o conteúdo para vinculá-la ao planejamento.'); onError('');
  }
  function selectGenerated(item) {
    setPreview(item.previewUrl); setDraft(current => ({ ...current, media_path: item.path, media_alt: current.media_alt || 'Campanha editorial do Private Motel' }));
    onNotice('Criação selecionada. Salve o conteúdo para vinculá-la ao planejamento.'); onError('');
  }
  async function download() {
    if (!preview) return;
    try {
      const response = await fetch(preview); if (!response.ok) throw Error();
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement('a');
      const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
      link.href = url; link.download = `private-social-${draft.title?.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'imagem'}.${extension}`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      onNotice('Download preparado.'); onError('');
    } catch { onError('Não foi possível baixar esta imagem agora.'); }
  }
  function clearSelection() {
    setPreview('');
    setDraft(current => ({ ...current, media_path: '', media_alt: '' }));
    onNotice('Imagem removida deste rascunho. Salve o conteúdo para liberar uma arte já vinculada.'); onError('');
  }
  async function deleteGenerated(item) {
    if (busy || !window.confirm('Excluir esta criação permanentemente da biblioteca? Essa ação não pode ser desfeita.')) return;
    setBusy(true); onError(''); onNotice('Verificando se a imagem pode ser excluída…');
    try {
      const response = await fetch('/api/dashboard/social/media', { method: 'DELETE', headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ path: item.path }) });
      const data = await response.json(); if (!response.ok) throw Error(data.error);
      setGenerated(current => current.filter(media => media.path !== item.path));
      if (draft.media_path === item.path) clearSelection();
      else onNotice('Criação excluída permanentemente da biblioteca.');
    } catch (error) { onError(error.message || 'Não foi possível excluir esta criação.'); }
    finally { setBusy(false); }
  }
  async function generate() {
    if (busy) return;
    const prompt = draft.generation_prompt?.trim() || '';
    if (prompt.length < 20) { onError('Descreva a cena para a IA em pelo menos 20 caracteres.'); return; }
    setBusy(true); onError(''); onNotice('Gerando uma opção. Isso pode levar alguns segundos…');
    try {
      const response = await fetch('/api/dashboard/social/generate', { method: 'POST', headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, size, quality, source: draft.media_path?.startsWith('/images/') ? draft.media_path : '' }) });
      const data = await response.json(); if (!response.ok) throw Error(data.error);
      setPreview(data.previewUrl); setGenerated(current => [{ path: data.path, previewUrl: data.previewUrl }, ...current.filter(item => item.path !== data.path)]); setDraft(current => ({ ...current, media_path: data.path, media_alt: current.media_alt || 'Casal adulto em campanha editorial do Private Motel' }));
      onNotice('Imagem criada e guardada na biblioteca privada. Revise e salve o conteúdo.');
    } catch (error) { onError(error.message || 'Não foi possível gerar a imagem.'); }
    finally { setBusy(false); }
  }

  return <section className={styles.socialStudio} aria-label="Biblioteca e criação visual"><div className={styles.studioHeading}><div><p className={styles.kicker}>DIREÇÃO VISUAL</p><h2>Imagem do conteúdo</h2></div>{preview && <button type="button" className={styles.secondary} onClick={download}>Baixar imagem</button>}</div>
    <label>Biblioteca do site<select value={category} onChange={event => setCategory(event.target.value)}>{Object.entries(mediaCategories).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <div className={styles.mediaGrid}>{items.map(item => <button type="button" key={item.path} className={draft.media_path === item.path ? styles.mediaSelected : undefined} aria-label={`Selecionar ${item.label}`} onClick={() => select(item)}><img src={item.path} alt="" loading="lazy" /><span>{item.label}</span></button>)}</div>
    {generated.length > 0 && <section className={styles.generatedLibrary} aria-label="Minhas criações com IA"><div><p className={styles.kicker}>BIBLIOTECA PRIVADA</p><h3>Minhas criações</h3><p>Artes vinculadas a algum conteúdo ficam protegidas contra exclusão.</p></div><div className={styles.generatedRail}>{generated.map((item, index) => <article key={item.path} className={draft.media_path === item.path ? styles.generatedSelected : undefined}><button type="button" className={styles.generatedImage} aria-label={`Selecionar criação ${index + 1}`} onClick={() => selectGenerated(item)}><img src={item.previewUrl} alt="" loading="lazy" /></button><button type="button" className={styles.generatedDelete} disabled={busy} onClick={() => deleteGenerated(item)} aria-label={`Excluir criação ${index + 1}`}>Excluir</button></article>)}</div></section>}
    {preview && <><figure className={styles.socialPreview}><img src={preview} alt={draft.media_alt || 'Prévia da imagem social'} /><figcaption>Prévia da imagem vinculada ao conteúdo.</figcaption></figure><button type="button" className={styles.secondary} onClick={clearSelection}>Remover imagem do rascunho</button></>}
    <label>Descrição acessível da imagem<input maxLength={200} value={draft.media_alt || ''} onChange={event => change('media_alt', event.target.value)} placeholder="Ex.: Casal na piscina da Suíte Private" /></label>
    <div className={styles.aiCreator}><p className={styles.kicker}>ESTÚDIO COM IA</p><h3>Crie uma cena editorial</h3><p>Você pode selecionar uma suíte acima para usá-la como referência. A IA é instruída a preservar o ambiente real e trabalhar apenas com adultos fictícios, elegantes e sem conteúdo explícito.</p>
      <label>O que você quer criar?<textarea rows={4} maxLength={1500} value={draft.generation_prompt || ''} onChange={event => change('generation_prompt', event.target.value)} placeholder="Ex.: casal adulto elegante brindando próximo à piscina, luz noturna suave, campanha para Dia dos Namorados…" /></label>
      <div className={styles.fieldPair}><label>Formato da imagem<select value={size} onChange={event => setSize(event.target.value)}><option value="1024x1536">Retrato — Instagram</option><option value="1024x1024">Quadrado</option><option value="1536x1024">Paisagem</option></select></label><label>Qualidade<select value={quality} onChange={event => setQuality(event.target.value)}><option value="low">Econômica</option><option value="medium">Equilibrada</option><option value="high">Alta</option></select></label></div>
      <button type="button" className={styles.primary} onClick={generate} disabled={busy || configured !== true}>{busy ? 'Gerando…' : 'Gerar uma imagem'}</button>
      <p className={styles.hint}>{configured === true ? 'Cada clique gera e cobra uma única imagem. Nada é publicado automaticamente.' : configured === false ? 'Geração preparada. Falta configurar OPENAI_API_KEY no servidor para ativar o botão.' : 'Verificando configuração da IA…'}</p>
    </div>
  </section>;
}
