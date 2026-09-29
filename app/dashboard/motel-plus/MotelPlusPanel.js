'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaChartLine, FaDatabase, FaExternalLinkAlt } from 'react-icons/fa';
import { dashboardClient } from '../client';
import styles from '../dashboard.module.css';

export default function MotelPlusPanel() {
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  async function load() {
    setState(current => ({ ...current, loading: true, error: '' }));
    try {
      const client = dashboardClient(); const { data } = client ? await client.auth.getSession() : { data: {} };
      if (!data.session) throw Error('Entre novamente no painel para consultar o Motel+.');
      const response = await fetch('/api/dashboard/motel-plus', { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: 'no-store' });
      const result = await response.json(); if (!response.ok) throw Error(result.error);
      setState({ loading: false, data: result, error: '' });
    } catch (error) { setState({ loading: false, data: null, error: error.message || 'Consulta indisponível.' }); }
  }
  useEffect(() => { load(); }, []);
  const data = state.data;
  return <main id="main-content" className={styles.shell}><aside className={styles.sidebar}><Link href="/" className={styles.wordmark}>PRIVATE</Link><p className={styles.kicker}>PAINEL EDITORIAL</p><nav aria-label="Painel editorial"><Link href="/dashboard"><FaArrowLeft />Social e campanhas</Link><Link href="/dashboard/finance"><FaChartLine />Financeiro</Link><Link href="/dashboard/motel-plus" aria-current="page"><FaDatabase />Motel+</Link><Link href="/" target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt />Ver site</Link></nav><p className={styles.signature}>LEITURA SEGURA.<br />DECISÕES<br />COM CONTEXTO.</p></aside>
    <section className={styles.workspace}><header className={styles.heading}><div><p className={styles.kicker}>INTEGRAÇÃO OPERACIONAL</p><h1>Motel+</h1><p>Disponibilidade e estrutura do sistema interno, sem alterar a recepção.</p></div><button className={styles.secondary} onClick={load} disabled={state.loading}>{state.loading ? 'Consultando…' : 'Atualizar leitura'}</button></header>
      {state.error && <section className={styles.integrationError} role="alert"><h2>Conexão não concluída</h2><p>{state.error}</p><Link className={styles.secondary} href="/dashboard">Voltar ao painel</Link></section>}
      {data && <><section className={styles.integrationHero}><div><span className={styles.connectionDot} />Conectado em modo somente leitura</div><p>Última consulta: {new Date(data.checkedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p></section>
        <section className={styles.metricGrid} aria-label="Resumo do Motel+"><article><small>SUÍTES CADASTRADAS</small><strong>{data.suites.total}</strong></article><article><small>CATEGORIAS</small><strong>{data.categories.length}</strong></article><article><small>MODALIDADES</small><strong>{data.modalities.length}</strong></article><article><small>TABELAS LOCALIZADAS</small><strong>{data.priceTable.items}</strong></article></section>
        <section className={styles.integrationSection}><div><p className={styles.kicker}>AGORA</p><h2>Disponibilidade por categoria</h2></div><div className={styles.availabilityList}>{data.availability.map(item => <article key={item.categoryId}><div><h3>{item.category}</h3><p>{item.total} suíte(s) no sistema</p></div><strong>{item.available}<small> disponíveis</small></strong></article>)}</div></section>
        <section className={styles.integrationSection}><div><p className={styles.kicker}>MAPEAMENTO</p><h2>Categorias e modalidades</h2></div><div className={styles.mappingGrid}><div>{data.suites.byCategory.map(item => <p key={item.id}><span>{item.name}</span><strong>{item.suites} suíte(s)</strong></p>)}</div><div>{data.modalities.map(item => <p key={item.mode}><span>Modo {item.mode}</span><strong>{item.name}</strong></p>)}</div></div><p className={styles.hint}>Esta tela não cria reservas, não ocupa suítes e não consulta dados de hóspedes. O próximo passo é aprovar o mapeamento entre estas categorias e Private, Diamante Luxo, Prata e Bronze.</p></section></>}
    </section></main>;
}
