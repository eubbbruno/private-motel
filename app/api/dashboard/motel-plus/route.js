import { NextResponse } from 'next/server';
import { dashboardAccess } from '../../../../lib/dashboard-server';
import { motelPlusConfig, motelPlusGet } from '../../../../lib/motel-plus.mjs';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization' } });
const text = (value, max = 100) => typeof value === 'string' ? value.slice(0, max) : '';
const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;

export async function GET(request) {
  const { user } = await dashboardAccess(request, 'motel-plus:read');
  if (user.status !== 200) return reply({ error: 'Acesso exclusivo do proprietário ou integração indisponível.' }, user.status);
  if (!motelPlusConfig().configured) return reply({ error: 'Credenciais do Motel+ ainda não configuradas no servidor.' }, 503);
  try {
    const [categoriesRaw, suitesRaw, modalitiesRaw, priceRaw, availabilityRaw] = await Promise.all([
      motelPlusGet('categories'), motelPlusGet('suites'), motelPlusGet('modalities'), motelPlusGet('priceTable'), motelPlusGet('availability'),
    ]);
    const categories = (Array.isArray(categoriesRaw) ? categoriesRaw : []).map(item => ({ id: number(item.id), name: text(item.nome) }));
    const availability = (Array.isArray(availabilityRaw) ? availabilityRaw : []).map(item => ({ categoryId: number(item.categoriaId), category: text(item.categoria), available: number(item.disponiveis), total: number(item.total) }));
    const modalities = (Array.isArray(modalitiesRaw) ? modalitiesRaw : []).map(item => ({ mode: number(item.modo), name: text(item.nome) }));
    const suites = Array.isArray(suitesRaw) ? suitesRaw : [];
    const suitesByCategory = categories.map(category => ({ ...category, suites: suites.filter(item => number(item.categoriaId) === category.id).length }));
    return reply({ connected: true, checkedAt: new Date().toISOString(), categories, availability, modalities, suites: { total: suites.length, byCategory: suitesByCategory }, priceTable: { categories: Array.isArray(priceRaw?.categorias) ? priceRaw.categorias.length : 0, items: Array.isArray(priceRaw?.items) ? priceRaw.items.length : 0 } });
  } catch (error) {
    const auth = error.message === 'MOTEL_AUTH';
    return reply({ error: auth ? 'O Motel+ recusou o ID ou token configurado.' : 'Não foi possível consultar o Motel+ agora. Nenhuma alteração foi enviada.' }, auth ? 502 : 503);
  }
}
