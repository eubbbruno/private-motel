const resources = Object.freeze({
  payables: '/pagamentos',
  receivables: '/recebimentos',
});

function resourcePath(resource, env) {
  const override = resource === 'payables'
    ? env.GESTAO_CLICK_PAYABLES_PATH
    : env.GESTAO_CLICK_RECEIVABLES_PATH;
  const value = override || resources[resource];
  return typeof value === 'string' && /^\/[A-Za-z0-9/_-]+$/.test(value) ? value : null;
}

export function gestaoClickConfig(env = process.env) {
  const accessToken = env.GESTAO_CLICK_ACCESS_TOKEN || env.GESTAOCLICK_ACCESS_TOKEN || '';
  const secretAccessToken = env.GESTAO_CLICK_SECRET_ACCESS_TOKEN || env.GESTAO_CLICK_SECRET_ACCESS || env.GESTAOCLICK_SECRET_TOKEN || '';
  const base = (env.GESTAO_CLICK_BASE_URL || 'https://api.gestaoclick.com').replace(/\/+$/, '');
  let url;
  try { url = new URL(base); } catch { return { configured: false }; }
  const officialHost = ['gestaoclick.com', 'gestaoclick.com.br'].some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
  if (url.protocol !== 'https:' || !officialHost || !accessToken || !secretAccessToken) return { configured: false };
  return { configured: true, accessToken, secretAccessToken, base };
}

export async function gestaoClickGet(resource, query = {}, env = process.env) {
  if (!Object.hasOwn(resources, resource)) throw Error('GESTAO_CLICK_RESOURCE');
  const config = gestaoClickConfig(env);
  const path = resourcePath(resource, env);
  if (!config.configured || !path) throw Error('GESTAO_CLICK_CONFIG');
  const url = new URL(`${config.base}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      headers: {
        'access-token': config.accessToken,
        'secret-access-token': config.secretAccessToken,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw Error('GESTAO_CLICK_AUTH');
      if (response.status === 404) throw Error('GESTAO_CLICK_PATH');
      throw Error('GESTAO_CLICK_UPSTREAM');
    }
    const body = await response.text();
    if (body.length > 4_000_000) throw Error('GESTAO_CLICK_SIZE');
    const data = JSON.parse(body);
    const bodyCode = Number(data?.code);
    if (bodyCode === 401) throw Error('GESTAO_CLICK_AUTH');
    if (bodyCode === 403) throw Error('GESTAO_CLICK_PERMISSION');
    if (bodyCode >= 400 || data?.status === 'error') throw Error('GESTAO_CLICK_UPSTREAM');
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw Error('GESTAO_CLICK_TIMEOUT');
    if (error.message?.startsWith('GESTAO_CLICK_')) throw error;
    throw Error('GESTAO_CLICK_UPSTREAM');
  } finally {
    clearTimeout(timeout);
  }
}

export async function gestaoClickList(resource, query = {}, env = process.env) {
  const firstPage = await gestaoClickGet(resource, { ...query, pagina: 1, limit: 100 }, env);
  const totalPages = Math.max(1, Number(firstPage?.meta?.total_paginas) || 1);
  const pages = Math.min(60, totalPages);
  const payloads = [firstPage];
  for (let page = 2; page <= pages; page += 5) {
    const batch = Array.from({ length: Math.min(5, pages - page + 1) }, (_, index) =>
      gestaoClickGet(resource, { ...query, pagina: page + index, limit: 100 }, env));
    payloads.push(...await Promise.all(batch));
  }
  return {
    rows: payloads.flatMap(rowsFromGestaoClick),
    total: Number(firstPage?.meta?.total_registros) || 0,
    truncated: totalPages > pages,
  };
}

export function rowsFromGestaoClick(payload) {
  if (Array.isArray(payload)) return payload;
  for (const key of ['data', 'dados', 'items', 'registros', 'resultados']) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}
