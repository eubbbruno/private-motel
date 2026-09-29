import assert from 'node:assert/strict';
import { motelPlusConfig, motelPlusGet } from '../lib/motel-plus.mjs';

assert.equal(motelPlusConfig({}).configured, false);
assert.equal(motelPlusConfig({ MOTEL_PLUS_BASE_URL: 'http://oxpi.com.br', MOTELMAIS_PLUG_PLAY_ID: 'id', MOTELMAIS_PLUG_PLAY_TOKEN: 'token' }).configured, false);
assert.equal(motelPlusConfig({ MOTEL_PLUS_BASE_URL: 'https://example.com', MOTELMAIS_PLUG_PLAY_ID: 'id', MOTELMAIS_PLUG_PLAY_TOKEN: 'token' }).configured, false);
assert.equal(motelPlusConfig({ MOTEL_PLUS_BASE_URL: 'https://oxpi.com.br/api/PlugPlay/', MOTELMAIS_PLUG_PLAY_ID: 'id', MOTELMAIS_PLUG_PLAY_TOKEN: 'token' }).configured, true);
assert.equal(motelPlusConfig({ MOTEL_PLUS_PLUG_PLAY_ID: 'id', MOTEL_PLUS_PLUG_PLAY_TOKEN: 'token' }).configured, true);
await assert.rejects(() => motelPlusGet('reservations', { MOTELMAIS_PLUG_PLAY_ID: 'id', MOTELMAIS_PLUG_PLAY_TOKEN: 'token' }), /MOTEL_RESOURCE/);
console.log('PASS Motel+: server-only configuration, HTTPS host restriction, aliases and resource allowlist. No network.');
