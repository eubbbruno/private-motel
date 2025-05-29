import { NextResponse } from 'next/server';

// Chaves da API do PagSeguro
const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;
const PAGSEGURO_API = process.env.NODE_ENV === 'production' 
  ? 'https://ws.pagseguro.uol.com.br/v2' 
  : 'https://ws.sandbox.pagseguro.uol.com.br/v2';

/**
 * API para verificar o status de um pagamento no PagSeguro
 */
export async function GET(request) {
  try {
    // Extrai o ID do pagamento da URL
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    
    // Valida o ID do pagamento
    if (!paymentId) {
      return NextResponse.json({ error: 'ID do pagamento não especificado' }, { status: 400 });
    }
    
    // Em desenvolvimento, simula a verificação
    if (process.env.NODE_ENV !== 'production') {
      console.log('Ambiente de desenvolvimento: Simulando verificação de pagamento');
      console.log('ID do pagamento:', paymentId);
      
      // Simula um status aleatório para testes
      const statuses = ['PENDING', 'PAID', 'CANCELED', 'REFUNDED'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return NextResponse.json({
        success: true,
        paymentId,
        status: randomStatus,
        simulated: true
      });
    }
    
    // Verifica o status do pagamento no PagSeguro
    const response = await fetch(`${PAGSEGURO_API}/charges/${paymentId}?email=${PAGSEGURO_EMAIL}&token=${PAGSEGURO_TOKEN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro PagSeguro:', errorText);
      return NextResponse.json({ error: 'Erro ao verificar pagamento' }, { status: 500 });
    }
    
    const data = await response.json();
    console.log('Status do pagamento:', data);
    
    // Mapeia o status do PagSeguro para o nosso formato
    let status = 'PENDING';
    if (data.status === 'PAID') {
      status = 'PAID';
    } else if (data.status === 'CANCELED') {
      status = 'CANCELED';
    } else if (data.status === 'REFUNDED') {
      status = 'REFUNDED';
    }
    
    return NextResponse.json({
      success: true,
      paymentId,
      status,
      data
    });
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
} 