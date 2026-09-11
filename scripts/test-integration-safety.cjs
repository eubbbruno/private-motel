const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadRoute(path, env = {}, fetch = () => { throw new Error('Unexpected network request'); }) {
  const context = {
    process: { env: { NODE_ENV: 'production', ...env } }, fetch,
    console: { log() {}, error() {} },
    NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) },
  };
  vm.createContext(context);
  const source = fs.readFileSync(path, 'utf8')
    .replace(/^import .*;\r?\n/gm, '')
    .replace(/export /g, '');
  vm.runInContext(source, context);
  return context;
}

(async () => {
  const route = 'app/api/send-whatsapp/route.js';
  const request = body => ({ json: async () => body });
  let calls = 0;
  const configured = loadRoute(route, { MANYCHAT_API_KEY: 'mock-server-token', MANYCHAT_FLOW_ID: 'mock-flow' }, async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.manychat.com/fb/sending/sendFlow');
    assert.equal(options.headers.Authorization, 'Bearer mock-server-token');
    assert.deepEqual(JSON.parse(options.body), {
      subscriber_id: '5543999999999', flow_id: 'mock-flow', custom_fields: { message: 'Mensagem de teste' },
    });
    return { ok: true, json: async () => ({ message_id: 'mock-id' }) };
  });
  assert.equal((await configured.POST(request({}))).status, 400);
  assert.equal(calls, 0);
  const response = await configured.POST(request({ phone: '+55 (43) 99999-9999', message: 'Mensagem de teste' }));
  assert.equal(response.status, 200);
  assert.equal(response.body.messageId, 'mock-id');
  assert.equal(calls, 1);
  assert.equal((await loadRoute(route).POST(request({ phone: '5543999999999', message: 'Teste' }))).status, 500);
  const failed = loadRoute(route, { MANYCHAT_API_KEY: 'mock', MANYCHAT_FLOW_ID: 'mock' }, async () => ({ ok: false, status: 429, json: async () => ({ message: 'Rate limited' }) }));
  assert.equal((await failed.POST(request({ phone: '5543999999999', message: 'Teste' }))).status, 429);
  for (const [path, method] of [['create-payment', 'POST'], ['notifications', 'POST'], ['check-status', 'GET'], ['payment-status/[chargeId]', 'GET']]) {
    const handler = loadRoute(`app/api/pagseguro/${path}/route.js`);
    assert.equal((await handler[method](request({}))).status, 410);
  }
  for (const file of ['src/services/notificationService.js', 'src/services/pagseguroService.js']) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /NEXT_PUBLIC_\w*(TOKEN|API_KEY)/);
  }
  console.log('PASS: ManyChat contract, invalid input, missing configuration, provider error, four disabled payment endpoints, no public service tokens. All network calls mocked.');
})().catch(error => { console.error(error); process.exitCode = 1; });
