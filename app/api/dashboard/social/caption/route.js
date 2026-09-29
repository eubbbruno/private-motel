import { NextResponse } from 'next/server';
import { dashboardAccess } from '../../../../../lib/dashboard-server';
import { readLimitedBody } from '../../../../../lib/read-body.mjs';
import { captionFromResponse, captionInput, captionInstructions, validateCaptionRequest } from '../../../../../lib/social-caption.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });

async function access(request) {
  const state = await dashboardAccess(request, 'social:write');
  return state.user.status === 200 ? state : { error: reply({ error: 'Acesso não autorizado ou indisponível.' }, state.user.status) };
}

export async function GET(request) {
  const state = await access(request);
  if (state.error) return state.error;
  return reply({ configured: Boolean(process.env.OPENAI_API_KEY), provider: 'OpenAI', model: process.env.OPENAI_TEXT_MODEL || 'gpt-4.1-mini' });
}

export async function POST(request) {
  const state = await access(request);
  if (state.error) return state.error;
  if (!process.env.OPENAI_API_KEY) return reply({ error: 'Configure OPENAI_API_KEY no servidor para gerar legendas.' }, 503);
  let input;
  try { input = validateCaptionRequest(JSON.parse(new TextDecoder().decode(await readLimitedBody(request, 5000)))); }
  catch (error) { return reply({ error: error.message === 'BODY_LIMIT' ? 'Pedido muito grande.' : error.message || 'Pedido inválido.' }, 400); }

  const model = process.env.OPENAI_TEXT_MODEL || 'gpt-4.1-mini';
  let response;
  try {
    response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', signal: AbortSignal.timeout(30000),
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, instructions: captionInstructions, input: captionInput(input), max_output_tokens: 400, store: false }),
    });
  } catch { return reply({ error: 'A IA não respondeu a tempo. Tente novamente.' }, 503); }
  const generated = await response.json().catch(() => null);
  if (!response.ok) {
    const message = generated?.error?.code === 'credit_balance_exhausted' ? 'A conta da OpenAI está sem saldo disponível.' : response.status === 429 ? 'Limite temporário da IA atingido. Aguarde e tente novamente.' : 'Não foi possível gerar a legenda agora.';
    return reply({ error: message }, response.status === 429 ? 429 : 502);
  }
  const caption = captionFromResponse(generated);
  return caption ? reply({ caption, model, usage: { inputTokens: generated.usage?.input_tokens ?? null, outputTokens: generated.usage?.output_tokens ?? null } }) : reply({ error: 'A IA não retornou uma legenda completa. Tente novamente.' }, 502);
}
