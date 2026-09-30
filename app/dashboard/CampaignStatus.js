'use client';
import { useState } from 'react';
import styles from './dashboard.module.css';
const publicSite = process.env.NEXT_PUBLIC_DASHBOARD_STANDALONE === 'true' ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.privatemotel.com.br') : '';
export default function CampaignStatus({ draft, dirty }) {
  const [result,setResult] = useState('');
  const [checking,setChecking] = useState(false);
  async function check() {
    setChecking(true); setResult('');
    try {
      const response = await fetch('/api/campaigns/active',{cache:'no-store'});
      if(!response.ok) throw Error();
      const {campaign} = await response.json();
      if(campaign?.id === draft.id) setResult('Sua campanha está disponível na Home local. O teste ignora espera e limite de 24 horas, mas respeita o aviso de cookies.');
      else if(draft.status !== 'published') setResult('Esta campanha não está publicada.');
      else if(Date.parse(draft.starts_at)>Date.now()) setResult('Publicação agendada: o início ainda não chegou.');
      else if(Date.parse(draft.ends_at)<=Date.now()) setResult('O período de exibição já terminou.');
      else if(campaign) setResult('Outra campanha está selecionada por prioridade ou data de início.');
      else setResult('Não há campanha disponível. Confira as datas, a arte e se a exibição está habilitada neste ambiente.');
    } catch {setResult('Não foi possível verificar a exibição. Tente novamente.');}
    finally {setChecking(false);}
  }
  const now=Date.now();
  const state=draft.status!=='published'?'Não publicado':Date.parse(draft.starts_at)>now?'Agendado':Date.parse(draft.ends_at)<=now?'Encerrado':'Publicado agora';
  return <aside className={styles.campaignCheck} aria-label="Verificação da campanha"><div className={styles.publicationState}><span>Estado no site</span><strong>{dirty ? `${state} · alterações não salvas` : state}</strong></div><div className={styles.actions}><button type="button" className={styles.secondary} disabled={!draft.id || dirty || checking} onClick={check}>{checking?'Verificando…':'Verificar exibição'}</button>{draft.id && draft.status === 'published' && !dirty && <a className={styles.secondary} target="_blank" rel="noopener noreferrer" href={`${publicSite}/?testarCampanha=${encodeURIComponent(draft.id)}`}>Testar popup na Home</a>}</div>{dirty && <p>Salve as alterações para atualizar o site.</p>}<p role="status">{result}</p></aside>;
}
