import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { readLimitedBody } from '../lib/read-body.mjs';

const userId = '00000000-0000-4000-8000-000000000001';
const ownPath = `${userId}/00000000-0000-4000-8000-000000000002.webp`;
let authorized = true, linked = [], lookupError = null, removeError = null, removes = 0;
const query = { select() { return this; }, eq() { return this; }, limit: async () => ({ data: linked, error: lookupError }) };
const storage = { remove: async paths => { removes++; assert.equal(paths.length, 1); assert.equal(paths[0], ownPath); return { error: removeError }; } };
const sandbox = {
  dashboardAccess: async () => ({ user: { status: authorized ? 200 : 401, userId }, client: { from: () => query, storage: { from: () => storage } } }), readLimitedBody,
  NextResponse: { json: (body, options) => ({ body, ...options }) }, URL, TextDecoder,
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('app/api/dashboard/social/media/route.js', 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, '') + '\nglobalThis.handlers={DELETE}', sandbox);
const remove = path => sandbox.handlers.DELETE(new Request('https://example.invalid/api/dashboard/social/media', { method: 'DELETE', body: JSON.stringify({ path }) }));
authorized = false; assert.equal((await remove(ownPath)).status, 401); assert.equal(removes, 0);
authorized = true; assert.equal((await remove('../../secret.webp')).status, 400);
assert.equal((await remove(`00000000-0000-4000-8000-000000000009/00000000-0000-4000-8000-000000000002.webp`)).status, 403);
linked = [{ id: 'post' }]; assert.equal((await remove(ownPath)).status, 409); assert.equal(removes, 0);
linked = []; lookupError = { message: 'offline' }; assert.equal((await remove(ownPath)).status, 503); assert.equal(removes, 0);
lookupError = null; removeError = { message: 'denied' }; assert.equal((await remove(ownPath)).status, 503); assert.equal(removes, 1);
removeError = null; const result = await remove(ownPath); assert.equal(result.status, 200); assert.equal(result.body.deleted, true); assert.equal(removes, 2);
console.log('Limpeza social: autorização, pasta própria, bloqueio de arte vinculada e exclusão simulada OK. Nenhum arquivo real apagado.');
