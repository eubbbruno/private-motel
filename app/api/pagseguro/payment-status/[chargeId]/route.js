import { NextResponse } from 'next/server';

/**
 * API para verificar o status de um pagamento no PagSeguro
 * Como estamos em desenvolvimento, esta API simula uma resposta
 */
export async function GET(request, { params }) {
  try {
    const { chargeId } = params;
    
    // Registra a solicitação para debug
    console.log(`Verificando status do pagamento: ${chargeId}`);
    
    // Simula um pequeno atraso (como se estivesse chamando uma API externa)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Constrói uma resposta simulada
    const statusResponse = {
      id: chargeId,
      reference_id: chargeId.replace('payment-', 'res-'),
      status: 'PENDING', // Poderia ser 'PAID', 'CANCELED', 'DECLINED'
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json(statusResponse);
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
} 