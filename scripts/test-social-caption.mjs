import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { captionFromResponse, captionInput, captionInstructions, validateCaptionRequest } from '../lib/social-caption.mjs';
import { readLimitedBody } from '../lib/read-body.mjs';

const valid = { title: 'Suíte Private', brief: 'Uma noite tranquila a dois.', channel: 'instagram', format: 'feed' };
assert.deepEqual(validateCaptionRequest(valid), valid);
assert.match(captionInput(valid), /Instagram/);
assert.match(captionInstructions, /Não invente preços/);
assert.throws(() => validateCaptionRequest({ ...valid, channel: 'unknown' }));
assert.throws(() => validateCaptionRequest({ ...valid, brief: 'x'.repeat(2001) }));
assert.equal(captionFromResponse({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'A sua noite começa aqui.' }] }] }), 'A sua noite começa aqui.');
assert.equal(captionFromResponse({ status: 'incomplete', output: [] }), null);

let authorized = false, providerCalls = 0, providerBody;
const environment = { OPENAI_API_KEY: 'mock-only' };
const sandbox = {
  dashboardAccess: async () => ({ user: { status: authorized ? 200 : 401 } }),
  readLimitedBody, captionFromResponse, captionInput, captionInstructions, validateCaptionRequest,
  NextResponse: { json: (body, options) => ({ body, ...options }) }, TextDecoder, AbortSignal,
  process: { env: environment },
  fetch: async (_url, options) => {
    providerCalls++;
    providerBody = JSON.parse(options.body);
    return { ok: true, json: async () => ({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'Um momento só de vocês.' }] }], usage: { input_tokens: 125, output_tokens: 25 } }) };
  },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('app/api/dashboard/social/caption/route.js', 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, '') + '\nglobalThis.handlers = { GET, POST };', sandbox);
const request = (body, token = true) => new Request('https://example.invalid/api/dashboard/social/caption', { method: 'POST', headers: token ? { Authorization: 'Bearer mock' } : {}, body: JSON.stringify(body) });
assert.equal((await sandbox.handlers.POST(request(valid, false))).status, 401);
assert.equal(providerCalls, 0);
authorized = true;
assert.equal((await sandbox.handlers.POST(request({ ...valid, channel: 'fake' }))).status, 400);
assert.equal(providerCalls, 0);
delete environment.OPENAI_API_KEY;
assert.equal((await sandbox.handlers.POST(request(valid))).status, 503);
environment.OPENAI_API_KEY = 'mock-only';
assert.equal((await sandbox.handlers.GET(request(valid))).body.configured, true);
const result = await sandbox.handlers.POST(request(valid));
assert.equal(result.status, 200);
assert.equal(result.body.caption, 'Um momento só de vocês.');
assert.equal(providerCalls, 1);
assert.equal(providerBody.store, false);
assert.equal(providerBody.max_output_tokens, 400);
assert.equal(providerBody.model, 'gpt-4.1-mini');
console.log('Assistente social: autorização, validação, falha de configuração e geração simulada OK. Nenhum crédito consumido.');
