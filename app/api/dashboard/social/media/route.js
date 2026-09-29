import { NextResponse } from 'next/server';
import { dashboardAccess } from '../../../../../lib/dashboard-server';
import { readLimitedBody } from '../../../../../lib/read-body.mjs';

export const dynamic = 'force-dynamic';
const mediaPath = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/i;
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });

export async function GET(request) {
  const { user, client } = await dashboardAccess(request, 'social:read');
  if (user.status !== 200) return reply({ error: 'Acesso não autorizado ou indisponível.' }, user.status);
  const path = new URL(request.url).searchParams.get('path') || '';
  if (!path) {
    const { data: files, error: listError } = await client.storage.from('social-media').list(user.userId, { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });
    if (listError) return reply({ error: 'Não foi possível carregar suas criações.' }, 503);
    const paths = (files || []).filter(file => /^[0-9a-f-]{36}\.webp$/i.test(file.name)).map(file => `${user.userId}/${file.name}`);
    if (!paths.length) return reply({ items: [] });
    const { data: signed, error: signedError } = await client.storage.from('social-media').createSignedUrls(paths, 600);
    if (signedError) return reply({ error: 'Não foi possível preparar as prévias.' }, 503);
    return reply({ items: paths.map((mediaPath, index) => ({ path: mediaPath, previewUrl: signed?.[index]?.signedUrl || null, createdAt: files.find(file => mediaPath.endsWith('/' + file.name))?.created_at || null })).filter(item => item.previewUrl) });
  }
  if (!mediaPath.test(path)) return reply({ error: 'Imagem inválida.' }, 400);
  const { data, error } = await client.storage.from('social-media').createSignedUrl(path, 600);
  return error ? reply({ error: 'Imagem indisponível.' }, 404) : reply({ previewUrl: data.signedUrl });
}

export async function DELETE(request) {
  const { user, client } = await dashboardAccess(request, 'social:write');
  if (user.status !== 200) return reply({ error: 'Acesso não autorizado ou indisponível.' }, user.status);
  let path;
  try { path = JSON.parse(new TextDecoder().decode(await readLimitedBody(request, 1000)))?.path || ''; }
  catch (error) { return reply({ error: error.message === 'BODY_LIMIT' ? 'Pedido muito grande.' : 'Pedido inválido.' }, 400); }
  if (!mediaPath.test(path)) return reply({ error: 'Imagem inválida.' }, 400);
  if (!path.startsWith(`${user.userId}/`)) return reply({ error: 'Você só pode excluir criações da sua própria biblioteca.' }, 403);
  const { data: linked, error: lookupError } = await client.from('dashboard_posts').select('id').eq('media_path', path).limit(1);
  if (lookupError) return reply({ error: 'Não foi possível verificar o uso da imagem.' }, 503);
  if (linked?.length) return reply({ error: 'Esta imagem está vinculada a um conteúdo. Troque ou remova a imagem desse conteúdo, salve e tente novamente.' }, 409);
  const { error: removeError } = await client.storage.from('social-media').remove([path]);
  if (removeError) return reply({ error: 'Não foi possível excluir a imagem.' }, 503);
  return reply({ deleted: true, path });
}
