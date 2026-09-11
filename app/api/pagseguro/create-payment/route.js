import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Pagamentos não fazem parte da operação atual. Ver docs/integracoes-preview.md.
export async function POST() {
  return NextResponse.json(
    { error: 'Pagamentos online indisponíveis. Entre em contato pelo WhatsApp.' },
    { status: 410 }
  );
}
