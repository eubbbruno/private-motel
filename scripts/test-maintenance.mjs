import assert from 'node:assert/strict';
import { validateMaintenance } from '../lib/maintenance.mjs';

const valid = {
  suite: 'Private Duplex', suite_number: '72', item: 'Ar-condicionado', category: 'Climatização',
  service_type: 'preventive', status: 'completed', performed_on: '2026-09-29',
  completed_on: '2026-09-30', next_due_on: '2027-03-29', description: 'Limpeza e revisão completa.', provider: 'Equipe interna', cost: 250, notes: '',
};
assert.deepEqual(validateMaintenance(valid), valid);
assert.equal(validateMaintenance({ ...valid, cost: '' }).cost, null);
assert.equal(validateMaintenance({ ...valid, status: 'scheduled' }).completed_on, null);
assert.equal(validateMaintenance({ ...valid, description: '' }).description, '');
for (const changed of [
  { suite: 'Inexistente' }, { suite: 'Bronze' }, { suite_number: '999' }, { category: 'Inexistente' }, { status: 'deleted' },
  { performed_on: '' }, { completed_on: '' }, { completed_on: '2026-01-01' }, { next_due_on: '2026-01-01' }, { cost: -1 }, { item: '' },
]) assert.throws(() => validateMaintenance({ ...valid, ...changed }));
assert.throws(() => validateMaintenance({ ...valid, unexpected: true }));
console.log('PASS maintenance validation: room mapping, optional details, completion dates and input safety.');
