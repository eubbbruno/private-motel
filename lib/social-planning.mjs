export const socialFields = ['channel', 'format', 'planned_at', 'media_path', 'media_alt', 'generation_prompt'];
export const channels = { instagram: 'Instagram', facebook: 'Facebook', both: 'Instagram e Facebook' };
export const formats = { feed: 'Feed', story: 'Story', reel: 'Reel', carousel: 'Carrossel' };
export function validateSocial(input) {
  const channel = input.channel ?? 'instagram', format = input.format ?? 'feed';
  if (!Object.hasOwn(channels, channel) || !Object.hasOwn(formats, format)) throw Error('Canal ou formato inválido.');
  let planned_at = input.planned_at ?? null;
  if (planned_at === '') planned_at = null;
  if (planned_at !== null) {
    if (typeof planned_at !== 'string' || !/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(planned_at) || !Number.isFinite(Date.parse(planned_at))) throw Error('Data de planejamento inválida.');
    planned_at = new Date(planned_at).toISOString();
  }
  const media_path = typeof input.media_path === 'string' ? input.media_path.trim() : '';
  const media_alt = typeof input.media_alt === 'string' ? input.media_alt.trim() : '';
  const generation_prompt = typeof input.generation_prompt === 'string' ? input.generation_prompt.trim() : '';
  const publicMedia = /^\/images\/[A-Za-z0-9][A-Za-z0-9._/-]*\.(?:jpg|jpeg|png|webp)$/i;
  const privateMedia = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/i;
  if (media_path && !publicMedia.test(media_path) && !privateMedia.test(media_path)) throw Error('Imagem social inválida.');
  if (media_path.length > 240 || media_alt.length > 200 || generation_prompt.length > 2000) throw Error('Dados da imagem social excedem o limite permitido.');
  if (media_path && !media_alt) throw Error('Descreva a imagem selecionada.');
  return { channel, format, planned_at, media_path, media_alt, generation_prompt };
}
export const editorialDay = iso => iso ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso)) : '';
export function calendarDays(month) {
  if (!/^\d{4}-\d{2}$/.test(month)) return [];
  const [year, number] = month.split('-').map(Number);
  const count = new Date(Date.UTC(year, number, 0)).getUTCDate();
  return Array.from({ length: count }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`);
}
export function editorialCSV(items) {
  const cell = value => { let text = String(value ?? ''); if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; };
  const rows = [['Título', 'Legenda', 'Canal', 'Formato', 'Data planejada (UTC)', 'Imagem', 'Estado'], ...items.map(item => [item.title,item.body,channels[item.channel] || '',formats[item.format] || '',item.planned_at || '',item.media_path || '',item.status])];
  return '\uFEFF' + rows.map(row => row.map(cell).join(';')).join('\r\n');
}
