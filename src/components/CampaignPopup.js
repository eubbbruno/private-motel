'use client';
import { useEffect, useRef, useState } from 'react';
import { safeCampaignUrl } from '../../lib/campaign.mjs';
import styles from './CampaignPopup.module.css';

export default function CampaignPopup() {
  const [campaign, setCampaign] = useState(null);
  const modal = useRef(null);
  useEffect(() => {
    let stopped = false, attempted = false, finished = false, nextAttempt = 0, attempts = 0;
    const started = Date.now();
    const testId = new URLSearchParams(window.location.search).get('testarCampanha');
    const controller = new AbortController();
    async function consider() {
      if (finished || attempted || Date.now() < nextAttempt || (!testId && Date.now() - started < 8000) || document.querySelector('.cookie-toast, dialog[open]')) return;
      attempted = true;
      attempts++;
      try {
        const response = await fetch('/api/campaigns/active', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) return;
        const { campaign: next } = await response.json();
        if (!next || !safeCampaignUrl(next.cta_url) || (testId && testId !== next.id)) return;
        const key = `private-campaign-${next.id}`;
        try { if (!testId && Date.now() - Number(localStorage.getItem(key)) < 86400000) { finished = true; clearInterval(timer); return; } } catch {}
        if (!stopped && !document.querySelector('.cookie-toast, dialog[open]')) {
          setCampaign({ ...next, testing: !!testId });
          finished = true;
          clearInterval(timer);
          return;
        }
      } catch { /* Campaign availability must never interrupt the public site. */ }
      finally {
        if (!finished && attempts < 3) { attempted = false; nextAttempt = Date.now() + 15000; }
        else if (!finished) { clearInterval(timer); }
      }
    }
    const timer = setInterval(consider, 2000);
    return () => { stopped = true; controller.abort(); clearInterval(timer); };
  }, []);
  function dismiss() {
    if (!campaign?.testing) { try { localStorage.setItem(`private-campaign-${campaign.id}`, String(Date.now())); } catch {} }
    setCampaign(null);
  }
  useEffect(() => {
    if (!campaign) return;
    const dialog = modal.current; const previous = document.activeElement; const overflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    const expiration = setTimeout(() => setCampaign(null), Math.max(0, Math.min(2147483647, Date.parse(campaign.ends_at) - Date.now())));
    return () => { clearTimeout(expiration); dialog.close(); document.body.style.overflow = overflow; if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true }); };
  }, [campaign]);
  if (!campaign) return null;
  return <dialog ref={modal} className={styles.popup} aria-labelledby="campaign-popup-title" onCancel={event => { event.preventDefault(); dismiss(); }}>
    <button className={styles.close} type="button" onClick={dismiss} aria-label="Fechar campanha">×</button>
    {/* Signed, short-lived uploaded artwork; not passed through a public image cache. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={campaign.imageUrl} alt={campaign.image_alt} onError={() => setCampaign(null)} />
    <div className={styles.copy}><h2 id="campaign-popup-title">{campaign.popup_title}</h2>{campaign.popup_text && <p>{campaign.popup_text}</p>}{campaign.cta_label && <a className="button" href={campaign.cta_url} onClick={dismiss}>{campaign.cta_label}</a>}</div>
  </dialog>;
}
