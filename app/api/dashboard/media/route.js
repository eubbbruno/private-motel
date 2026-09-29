import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { dashboardAccess } from '../../../../lib/dashboard-server';
import { readLimitedBody } from '../../../../lib/read-body.mjs';
import { mediaPathPattern } from '../../../../lib/campaign.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });
export async function POST(request) {
  const { user, client } = await dashboardAccess(request, 'campaigns:write');
  if (user.status !== 200) return reply({ error: 'Acesso não autorizado ou indisponível.' }, user.status);
  let buffer;
  try {
    const bytes = await readLimitedBody(request, 6 * 1024 * 1024);
    const input = sharp(Buffer.from(bytes), { limitInputPixels: 16000000 });
    const metadata = await input.metadata();
    if (!['jpeg','png','webp'].includes(metadata.format) || metadata.pages > 1 || metadata.width < 320 || metadata.height < 320) throw Error('IMAGE_FORMAT');
    buffer = await input.rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    if (buffer.length > 6 * 1024 * 1024) throw Error('BODY_LIMIT');
  } catch (error) { return reply({ error: error.message === 'BODY_LIMIT' ? 'Envie uma imagem de até 6 MB.' : 'Use JPG, PNG ou WebP estático, com pelo menos 320 × 320 px e até 16 megapixels.' }, 400); }
  const path = `${user.userId}/${randomUUID()}.webp`;
  const { error } = await client.storage.from('campaign-art').upload(path, buffer, { contentType: 'image/webp', upsert: false });
  if (error) return reply({ error: 'Não foi possível guardar a arte. Tente novamente.' }, 503);
  const { data } = await client.storage.from('campaign-art').createSignedUrl(path, 600);
  return reply({ path, previewUrl: data?.signedUrl || null }, 201);
}
export async function GET(request) {
  const { user, client } = await dashboardAccess(request, 'campaigns:read');
  if (user.status !== 200) return reply({ error: 'Acesso não autorizado ou indisponível.' }, user.status);
  const path = new URL(request.url).searchParams.get('path') || '';
  if (!mediaPathPattern.test(path)) return reply({ error: 'Arte inválida.' }, 400);
  const { data, error } = await client.storage.from('campaign-art').createSignedUrl(path, 600);
  return error ? reply({ error: 'Arte indisponível.' }, 404) : reply({ previewUrl: data.signedUrl });
}
