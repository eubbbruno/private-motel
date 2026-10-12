import assert from 'node:assert/strict';
import { validateMaintenance } from '../lib/maintenance.mjs';

const valid = {
  suite: 'Private Duplex', item: 'Ar-condicionado', category: 'Climatização',
  service_type: 'preventive', status: 'completed', performed_on: '2026-09-29',
  next_due_on: '2027-03-29', description: 'Limpeza e revisão completa.', provider: 'Equipe interna', cost: 250, notes: '',
};
assert.deepEqual(validateMaintenance(valid), valid);
assert.equal(validateMaintenance({ ...valid, cost: '' }).cost, null);
assert.equal(validateMaintenance({ ...valid, status: 'scheduled', performed_on: '' }).performed_on, null);
for (const changed of [
  { suite: 'Inexistente' }, { category: 'Inexistente' }, { status: 'deleted' },
  { performed_on: '' }, { next_due_on: '2026-01-01' }, { cost: -1 }, { item: '' },
]) assert.throws(() => validateMaintenance({ ...valid, ...changed }));
assert.throws(() => validateMaintenance({ ...valid, unexpected: true }));
console.log('PASS maintenance validation: suites, categories, states, dates, cost and unknown fields.');
