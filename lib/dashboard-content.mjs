import { campaignFields, validateCampaign } from './campaign.mjs';
import { socialFields, validateSocial } from './social-planning.mjs';
const states = {
  posts: ['draft', 'review', 'approved', 'archived'],
  campaigns: ['draft', 'published', 'paused', 'archived'],
};
export const dashboardTables = Object.freeze({ posts: 'dashboard_posts', campaigns: 'dashboard_campaigns' });
export function validateContent(resource, input) {
  if (!Object.hasOwn(states, resource) || !input || typeof input !== 'object' || Array.isArray(input)) throw Error('Conteúdo inválido.');
  const allowed = ['title', 'body', 'status'];
  if (resource === 'campaigns') allowed.push(...campaignFields);
  else allowed.push(...socialFields);
  if (Object.keys(input).some(key => !allowed.includes(key))) throw Error('Campos desconhecidos.');
  if (typeof input.title !== 'string' || !input.title.trim() || input.title.trim().length > 160) throw Error('Informe um título de até 160 caracteres.');
  if (typeof input.body !== 'string' || input.body.length > 10000) throw Error('O texto deve ter até 10.000 caracteres.');
  if (!states[resource].includes(input.status)) throw Error('Estado inválido.');
  return { title: input.title.trim(), body: input.body, status: input.status, ...(resource === 'campaigns' ? validateCampaign(input) : validateSocial(input)) };
}
