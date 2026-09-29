import { NextResponse } from 'next/server';
import { publicDashboardClient } from '../../../../lib/dashboard-server';
import { publicCampaignColumns } from '../../../../lib/campaign.mjs';
export const dynamic = 'force-dynamic';
export async function GET() {
  const reply = campaign => NextResponse.json({ campaign }, { headers: { 'Cache-Control': 'no-store' } });
  if (process.env.DASHBOARD_CAMPAIGNS_ENABLED !== 'true') return reply(null);
  const client = publicDashboardClient(); if (!client) return reply(null);
  try {
    const { data, error } = await client.from('dashboard_campaigns').select(publicCampaignColumns).order('priority', { ascending: false }).order('starts_at', { ascending: false }).order('id').limit(1).maybeSingle();
    if (error || !data) return reply(null);
    const signed = await client.storage.from('campaign-art').createSignedUrl(data.image_path, 60);
    if (!signed.data?.signedUrl) return reply(null);
    const { image_path, ...campaign } = data;
    return reply({ ...campaign, imageUrl: signed.data.signedUrl });
  } catch { return reply(null); }
}
