export const mediaPathPattern = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/i;
export const campaignFields = ['image_path', 'image_alt', 'popup_title', 'popup_text', 'cta_label', 'cta_url', 'starts_at', 'ends_at', 'priority'];
export const publicCampaignColumns = 'id,version,image_path,image_alt,popup_title,popup_text,cta_label,cta_url,starts_at,ends_at,priority';
export function safeCampaignUrl(value) {
  if (!value) return true;
  if (/^\/[A-Za-z0-9/?#&=%._~+\-]*$/.test(value) && !value.startsWith('//')) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !/[\s\\]/.test(value); } catch { return false; }
}
export function validateCampaign(input) {
  const result = {};
  for (const [field, limit] of Object.entries({ image_path: 100, image_alt: 200, popup_title: 100, popup_text: 500, cta_label: 50, cta_url: 500 })) {
    const value = input[field] ?? '';
    if (typeof value !== 'string' || value.length > limit) throw Error(`Campo ${field} inválido ou muito longo.`);
    result[field] = value.trim();
  }
  if (result.image_path && !mediaPathPattern.test(result.image_path)) throw Error('Arte inválida. Envie a imagem pelo painel.');
  if (!safeCampaignUrl(result.cta_url)) throw Error('Use um endereço HTTPS ou caminho interno, como /reservas.');
  if (!!result.cta_label !== !!result.cta_url) throw Error('Informe o texto e o destino do botão juntos.');
  for (const field of ['starts_at', 'ends_at']) {
    const value = input[field];
    if (value == null || value === '') result[field] = null;
    else { if (typeof value !== 'string' || !/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) throw Error('Data inválida.'); result[field] = new Date(value).toISOString(); }
  }
  if (result.starts_at && result.ends_at && result.starts_at >= result.ends_at) throw Error('O encerramento precisa ser depois do início.');
  result.priority = input.priority ?? 0;
  if (!Number.isInteger(result.priority) || result.priority < 0 || result.priority > 100) throw Error('Prioridade deve ser um número entre 0 e 100.');
  if (input.status === 'published' && (!result.image_path || !result.image_alt || !result.popup_title || !result.starts_at || !result.ends_at)) throw Error('Para publicar, preencha arte, descrição da imagem, título e datas.');
  return result;
}
export function brasiliaInput(iso) {
  if (!iso) return '';
  const parts = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).format(new Date(iso));
  return parts.replace(' ', 'T');
}
export function brasiliaISO(value) { return value ? new Date(`${value}:00-03:00`).toISOString() : null; }
