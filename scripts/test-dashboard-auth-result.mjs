import assert from 'node:assert/strict';
import { verifiedUserResult } from '../lib/dashboard-auth-result.mjs';
import { authorizeDashboard } from '../lib/dashboard-access.mjs';
const request = new Request('https://example.invalid', { headers: { Authorization: 'Bearer test' } });
for (const error of [{ name: 'AuthRetryableFetchError', status: 0 }, { status: 503 }, { status: 429 }]) {
  assert.equal((await authorizeDashboard(request, async () => verifiedUserResult({ error }))).status, 503);
}
assert.equal((await authorizeDashboard(request, async () => verifiedUserResult({ error: { status: 401 } }))).status, 401);
assert.equal(verifiedUserResult({ data: { user: { id: 'test' } } }).id, 'test');
console.log('PASS: network/provider/rate-limit errors return 503; invalid credentials remain 401.');
