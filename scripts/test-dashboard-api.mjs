import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { authorizeDashboard } from '../lib/dashboard-access.mjs';
import { verifiedUserResult } from '../lib/dashboard-auth-result.mjs';
import { dashboardTables, validateContent } from '../lib/dashboard-content.mjs';
import { campaignFields } from '../lib/campaign.mjs';
import { socialFields } from '../lib/social-planning.mjs';
import { readLimitedBody } from '../lib/read-body.mjs';

let role = 'owner', writes = 0, conflict = false;
const chain = {
  select() { return this; }, order() { return this; }, eq() { return this; },
  limit: async () => ({ data: [], error: null }),
  insert(value) { writes++; this.value = value; return this; },
  update(value) { writes++; this.value = value; return this; },
  maybeSingle: async () => ({ data: conflict ? null : { id: 'test', title: 'Teste' }, error: null }),
};
const sandbox = {
  authorizeDashboard, dashboardTables, validateContent, verifiedUserResult, campaignFields, socialFields, readLimitedBody, TextDecoder,
  process: { env: { NEXT_PUBLIC_DASHBOARD_SUPABASE_URL: 'https://example.invalid', NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY: 'mock-public-key' } },
  NextResponse: { json: (body, options) => ({ body, ...options }) },
  createClient: () => ({ auth: { getUser: async () => ({ data: { user: { id: 'test-user', app_metadata: { private_motel_role: role } } } }) }, from: () => chain }),
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('app/api/dashboard/content/[resource]/route.js', 'utf8')
  .replace(/^import .*;\r?\n/gm, '').replace(/export /g, '') + '\nglobalThis.handlers = { GET, POST, PATCH };', sandbox);
const call = (method, resource, body, token = true) => sandbox.handlers[method](
  new Request('https://example.invalid', { method: method === 'GET' ? 'GET' : 'POST',
    headers: token ? { Authorization: 'Bearer mock-token' } : {},
    ...(method === 'GET' ? {} : { body: JSON.stringify(body) }) }), { params: Promise.resolve({ resource }) });
assert.equal((await call('GET', 'posts', null, false)).status, 401);
assert.equal((await call('POST', 'campaigns', {}, false)).status, 401);
assert.equal(writes, 0);
assert.equal((await call('GET', 'unknown')).status, 404);
assert.equal((await call('GET', 'posts')).status, 200);
const draft = { title: 'Teste', body: 'Texto', status: 'draft' };
const published = { ...draft, status: 'published', image_path: '00000000-0000-4000-8000-000000000001/00000000-0000-4000-8000-000000000002.webp', image_alt: 'Arte teste', popup_title: 'Campanha', starts_at: '2026-09-15T12:00:00Z', ends_at: '2026-09-16T12:00:00Z' };
assert.equal((await call('POST', 'posts', draft)).status, 201);
assert.equal(chain.value.created_by, 'test-user');
assert.equal((await call('POST', 'posts', { ...draft, created_by: 'forged' })).status, 400);
role = 'editor';
const before = writes;
assert.equal((await call('POST', 'campaigns', published)).status, 403);
assert.equal(writes, before);
role = 'owner';
assert.equal((await call('POST', 'campaigns', published)).status, 201);
assert.equal((await call('PATCH', 'posts', draft)).status, 400);
conflict = true;
assert.equal((await call('PATCH', 'posts', { ...draft, id: '00000000-0000-4000-8000-000000000001', version: 1 })).status, 409);
assert.equal(chain.value.version, 2);
console.log('PASS mocked API: unauthorized reads/writes, unknown resources, create, spoofed fields, publication permission and optimistic conflict. No remote database.');
