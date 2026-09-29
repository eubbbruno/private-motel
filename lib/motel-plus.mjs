const resources = Object.freeze({
  categories: '/api/Entidades/SuiteCategoria?exibeInativo=false',
  suites: '/api/Entidades/Suite?exibeInativo=false',
  modalities: '/api/Entidades/Modalidade',
  priceTable: '/api/Entidades/TabelaPreco',
  availability: '/api/CategoriaDisponibilidade',
  revenueMonth: '/api/Relatorios/FaturamentoPorMesAno',
  cashMonth: '/api/Caixa/AgrupadoMensal',
});

export function motelPlusConfig(env = process.env) {
  const id = env.MOTELMAIS_PLUG_PLAY_ID || env.MOTEL_PLUS_PLUG_PLAY_ID || '';
  const token = env.MOTELMAIS_PLUG_PLAY_TOKEN || env.MOTEL_PLUS_PLUG_PLAY_TOKEN || '';
  const base = (env.MOTEL_PLUS_BASE_URL || 'https://oxpi.com.br/api/PlugPlay').replace(/\/+$/, '');
  let url;
  try { url = new URL(base); } catch { return { configured: false }; }
  if (url.protocol !== 'https:' || url.hostname !== 'oxpi.com.br' || !id || !token) return { configured: false };
  return { configured: true, id, token, base };
}

export async function motelPlusGet(resource, env = process.env, query = {}) {
  if (!Object.hasOwn(resources, resource)) throw Error('MOTEL_RESOURCE');
  const config = motelPlusConfig(env);
  if (!config.configured) throw Error('MOTEL_CONFIG');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const url = new URL(`${config.base}${resources[resource]}`);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    }
    const response = await fetch(url, {
      headers: { 'PLUG-PLAY-ID': config.id, 'PLUG-PLAY-TOKEN': config.token, Accept: 'application/json' },
      cache: 'no-store', signal: controller.signal,
    });
    if (!response.ok) throw Error(response.status === 401 ? 'MOTEL_AUTH' : response.status === 403 ? 'MOTEL_PERMISSION' : 'MOTEL_UPSTREAM');
    const text = await response.text();
    if (text.length > 3_000_000) throw Error('MOTEL_SIZE');
    return JSON.parse(text);
  } catch (error) {
    if (error.name === 'AbortError') throw Error('MOTEL_TIMEOUT');
    if (error.message?.startsWith('MOTEL_')) throw error;
    throw Error('MOTEL_UPSTREAM');
  } finally { clearTimeout(timeout); }
}
