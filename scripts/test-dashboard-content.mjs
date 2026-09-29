import assert from 'node:assert/strict';
import { validateContent } from '../lib/dashboard-content.mjs';
for (const resource of ['posts', 'campaigns']) {
  const validated = validateContent(resource, { title: ' Texto ', body: 'Conteúdo', status: 'draft' });
  assert.equal(validated.title, 'Texto');
  assert.equal(validated.body, 'Conteúdo');
  assert.equal(validated.status, 'draft');
  for (const value of [null, [], {}, { title: '', body: '', status: 'draft' },
    { title: 'x'.repeat(161), body: '', status: 'draft' },
    { title: 'x', body: 'x'.repeat(10001), status: 'draft' },
    { title: 'x', body: '', status: 'unknown' },
    { title: 'x', body: '', status: 'draft', created_by: 'forged' }]) {
    assert.throws(() => validateContent(resource, value));
  }
}
assert.throws(() => validateContent('reservations', { title: 'x', body: '', status: 'draft' }));
assert.throws(() => validateContent('posts', { title: 'x', body: '', status: 'published' }));
console.log('PASS dashboard content: title/body limits, resource/status allowlists, forged fields rejected.');
