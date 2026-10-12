import assert from 'node:assert/strict';
import { authorizeDashboard } from '../lib/dashboard-access.mjs';

const request = (value) => new Request('https://example.invalid/api/dashboard/session', {
  headers: value ? { authorization: value } : {},
});
let calls = 0;
const verify = async (token) => {
  calls++;
  assert.equal(token, 'test-token');
  return { id: 'test-user', app_metadata: { private_motel_role: 'owner' } };
};
for (const header of [null, 'Basic abc', 'Bearer ', 'Bearer a b', `Bearer ${'a'.repeat(8193)}`]) {
  assert.equal((await authorizeDashboard(request(header), verify)).status, 401);
}
assert.equal(calls, 0);
const valid = request('Bearer test-token');
assert.equal((await authorizeDashboard(valid, null)).status, 503);
assert.equal((await authorizeDashboard(valid, async () => null)).status, 401);
assert.equal((await authorizeDashboard(valid, async () => { throw Error('provider failure'); })).status, 503);
for (const user of [
  { id: 'guest' },
  { id: 'guest', user_metadata: { private_motel_role: 'owner' } },
  { id: 'guest', app_metadata: { private_motel_role: '__proto__' } },
  { id: 'guest', app_metadata: { private_motel_role: 'admin' } },
  { id: 'guest', app_metadata: { private_motel_role: ['owner'] } },
]) assert.equal((await authorizeDashboard(valid, async () => user)).status, 403);
const editor = async () => ({ id: 'editor', app_metadata: { private_motel_role: 'editor' } });
assert.equal((await authorizeDashboard(valid, editor, 'campaigns:write')).status, 200);
assert.equal((await authorizeDashboard(valid, editor, 'campaigns:publish')).status, 403);
assert.equal((await authorizeDashboard(valid, editor, 'motel-plus:read')).status, 403);
assert.equal((await authorizeDashboard(valid, editor, 'finance:read')).status, 403);
assert.equal((await authorizeDashboard(valid, editor, 'maintenance:read')).status, 403);
assert.equal((await authorizeDashboard(valid, editor, 'maintenance:write')).status, 403);
assert.equal((await authorizeDashboard(valid, verify, 'campaigns:publish')).status, 200);
assert.equal((await authorizeDashboard(valid, verify, 'motel-plus:read')).status, 200);
assert.equal((await authorizeDashboard(valid, verify, 'finance:read')).status, 200);
assert.equal((await authorizeDashboard(valid, verify, 'maintenance:read')).status, 200);
assert.equal((await authorizeDashboard(valid, verify, 'maintenance:write')).status, 200);
assert.equal((await authorizeDashboard(valid, verify, 'unknown:permission')).status, 403);
assert.equal((await authorizeDashboard(valid, verify)).role, 'owner');
console.log('PASS dashboard access: invalid/missing token, configuration, provider failure, forged user metadata, unknown roles, editor/owner capabilities. No network.');
