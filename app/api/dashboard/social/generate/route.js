import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { dashboardAccess } from '../../../../../lib/dashboard-server';
import { readLimitedBody } from '../../../../../lib/read-body.mjs';
import { isSiteMediaPath } from '../../../../../lib/site-media.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const sizes = new Set(['1024x1024', '1024x1536', '1536x1024']);
const qualities = new Set(['low', 'medium', 'high']);
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });

async function access(request) {
  const state = await dashboardAccess(request, 'social:write');
  if (state.user.status !== 200) return { error: reply({ error: 'Acesso não autorizado ou indisponível.' }, state.user.status) };
  return state;
}

export async function GET(request) {
  const state = await access(request);
  if (state.error) return state.error;
  return reply({ configured: Boolean(process.env.OPENAI_API_KEY), model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-flare' });
}

export async function POST(request) {
  const state = await access(request);
  if (state.error) return state.error;
  if (!process.env.OPENAI_API_KEY) return reply({ error: 'A geração por IA ainda não foi configurada. Adicione OPENAI_API_KEY somente no servidor.' }, 503);
  let input;
  try {
    input = JSON.parse(new TextDecoder().decode(await readLimitedBody(request, 6000)));
  } catch (error) { return reply({ error: error.message === 'BODY_LIMIT' ? 'Pedido muito grande.' : 'Pedido inválido.' }, 400); }
  const prompt = typeof input?.prompt === 'string' ? input.prompt.trim() : '';
  const size = sizes.has(input?.size) ? input.size : '1024x1536';
  const quality = qualities.has(input?.quality) ? input.quality : 'medium';
  const source = input?.source || '';
  if (prompt.length < 20 || prompt.length > 1500) return reply({ error: 'Descreva a cena em 20 a 1.500 caracteres.' }, 400);
  if (source && !isSiteMediaPath(source)) return reply({ error: 'A imagem de referência não pertence à biblioteca do site.' }, 400);

  const guardedPrompt = `${prompt}\n\nDireção obrigatória: fotografia editorial de hospitalidade premium, atmosfera noturna sofisticada do Private Motel, pessoas adultas fictícias com 25 anos ou mais, elegantes e plenamente vestidas. Sem nudez, ato sexual, vulgaridade, texto, logotipo ou marca d'água. ${source ? 'Preserve com fidelidade a arquitetura, mobiliário, iluminação e identidade visual da imagem de referência; acrescente as pessoas sem redesenhar a suíte.' : 'Não invente uma suíte específica do motel; crie uma cena conceitual de campanha.'}`;
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-flare';
  let providerResponse;
  if (source) {
    const sourceResponse = await fetch(new URL(source, request.url), { cache: 'force-cache' });
    if (!sourceResponse.ok) return reply({ error: 'Não foi possível abrir a imagem de referência.' }, 422);
    const form = new FormData();
    form.append('model', model); form.append('prompt', guardedPrompt); form.append('size', size); form.append('quality', quality); form.append('output_format', 'png');
    form.append('image[]', new Blob([await sourceResponse.arrayBuffer()], { type: sourceResponse.headers.get('content-type') || 'image/jpeg' }), 'private-reference.jpg');
    providerResponse = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: form });
  } else {
    providerResponse = await fetch('https://api.openai.com/v1/images/generations', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, prompt: guardedPrompt, size, quality, output_format: 'png', n: 1 }) });
  }
  const generated = await providerResponse.json().catch(() => null);
  if (!providerResponse.ok) {
    const exhausted = generated?.error?.code === 'credit_balance_exhausted';
    const message = exhausted ? 'A conta da OpenAI está sem saldo disponível. Revise o faturamento antes de gerar.' : providerResponse.status === 429 ? 'Limite temporário de geração atingido. Aguarde e tente novamente.' : 'A IA não conseguiu gerar a imagem. Nenhuma publicação foi feita.';
    return reply({ error: message }, providerResponse.status === 429 ? 429 : 502);
  }
  const encoded = generated?.data?.[0]?.b64_json;
  if (!encoded || encoded.length > 40_000_000) return reply({ error: 'A IA retornou uma imagem inválida.' }, 502);
  let webp;
  try { webp = await sharp(Buffer.from(encoded, 'base64'), { limitInputPixels: 20000000 }).resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer(); }
  catch { return reply({ error: 'Não foi possível preparar a imagem gerada.' }, 502); }
  const path = `${state.user.userId}/${randomUUID()}.webp`;
  const { error: uploadError } = await state.client.storage.from('social-media').upload(path, webp, { contentType: 'image/webp', upsert: false });
  if (uploadError) return reply({ error: 'A imagem foi gerada, mas não pôde ser salva. Tente novamente.' }, 503);
  const { data } = await state.client.storage.from('social-media').createSignedUrl(path, 600);
  return reply({ path, previewUrl: data?.signedUrl || null, model }, 201);
}
