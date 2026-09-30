import assert from 'node:assert/strict';
import { dashboardRedirect } from '../lib/dashboard-standalone.mjs';

const enabled = { DASHBOARD_STANDALONE: 'true' };
assert.equal(dashboardRedirect('/', enabled), '/dashboard');
assert.equal(dashboardRedirect('/suites', enabled), '/dashboard');
assert.equal(dashboardRedirect('/reservas', enabled), '/dashboard');
assert.equal(dashboardRedirect('/dashboard', enabled), null);
assert.equal(dashboardRedirect('/dashboard/finance', enabled), null);
assert.equal(dashboardRedirect('/api/dashboard/finance', enabled), null);
assert.equal(dashboardRedirect('/api/campaigns/active', enabled), null);
assert.equal(dashboardRedirect('/images/logo.png', enabled), null);
assert.equal(dashboardRedirect('/dashboard-falso', enabled), '/dashboard');
assert.equal(dashboardRedirect('/suites', {}), null);
console.log('PASS dashboard standalone: site isolado, rotas administrativas e assets preservados.');
