import { NextResponse } from 'next/server';

// Chaves da API do PagSeguro
const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;
const PAGSEGURO_API = process.env.NODE_ENV === 'production' 
  ? 'https://ws.pagseguro.uol.com.br/v2' 
  : 'https://ws.sandbox.pagseguro.uol.com.br/v2';

/**
 * API para criar pagamentos no PagSeguro
 */
export async function POST(request) {
  try {
    // Extrai os dados da requisição
    const { 
      reservationId, 
      name, 
      email, 
      phone, 
      suite, 
      checkInDate, 
      checkInTime, 
      period, 
      totalPrice, 
      paymentMethod 
    } = await request.json();
    
    // Valida os dados
    if (!reservationId || !name || !email || !phone || !suite || !checkInDate || !checkInTime || !period || !totalPrice || !paymentMethod) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }
    
    // Em desenvolvimento, simula a criação do pagamento
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 Ambiente de desenvolvimento: Simulando criação de pagamento');
      console.log('Dados da reserva:', { 
        reservationId, 
        name, 
        email, 
        phone, 
        suite, 
        checkInDate, 
        checkInTime, 
        period, 
        totalPrice, 
        paymentMethod 
      });
      
      // Gera um ID de pagamento simulado
      const paymentId = `dev-${Date.now()}`;
      
      // Prepara o URL base
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (typeof globalThis.location !== 'undefined' ? globalThis.location.origin : 'http://localhost:3000');
      
      // Gera um QR Code de teste para PIX
      // Usando um placeholder real que funciona em todos os ambientes
      const qrCodeUrl = 'https://chart.googleapis.com/chart?cht=qr&chl=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426655440000%5204000053039865802BR5913PRIVATE%20MOTEL%206014LONDRINA-PARANA%2762070503***63044682&chs=300x300&chld=L|0';
      
      // Gera uma URL de pagamento completa
      const paymentUrl = `${baseUrl}/confirmacao?id=${reservationId}&simulado=true`;
      
      const simulatedResponse = {
        success: true,
        paymentId,
        status: 'PENDING',
        paymentUrl,
        qrCodeUrl: paymentMethod === 'pix' ? qrCodeUrl : null,
        simulated: true
      };
      
      // Adicionar também os dados na estrutura esperada pelo cliente
      simulatedResponse.data = {
        id: paymentId,
        status: 'PENDING',
        qrCodeUrl: paymentMethod === 'pix' ? qrCodeUrl : null
      };
      
      console.log('Resposta simulada:', simulatedResponse);
      
      // Adiciona um pequeno delay para simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json(simulatedResponse);
    }
    
    // Formata o número de telefone (remove caracteres não numéricos)
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Prepara os dados para o PagSeguro
    const payload = {
      reference_id: reservationId,
      customer: {
        name: name,
        email: email,
        tax_id: '00000000000', // CPF fictício para testes
        phones: [
          {
            country: '55',
            area: formattedPhone.substring(0, 2),
            number: formattedPhone.substring(2)
          }
        ]
      },
      items: [
        {
          reference_id: reservationId,
          name: `Reserva - ${suite}`,
          quantity: 1,
          unit_amount: Math.round(totalPrice * 100) // PagSeguro espera valores em centavos
        }
      ],
      shipping: {
        address: {
          street: 'Rua Exemplo',
          number: '123',
          complement: 'Apto 45',
          locality: 'Centro',
          city: 'Londrina',
          region_code: 'PR',
          country: 'BRA',
          postal_code: '86010000'
        }
      },
      notification_urls: [
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pagseguro/notifications`
      ],
      charges: [
        {
          reference_id: reservationId,
          description: `Reserva - ${suite} - ${checkInDate} ${checkInTime} - ${period}`,
          amount: {
            value: Math.round(totalPrice * 100), // PagSeguro espera valores em centavos
            currency: 'BRL'
          },
          payment_method: {
            type: paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD',
            installments: 1,
            capture: true,
            card: paymentMethod === 'credit-card' ? {
              number: '4111111111111111',
              exp_month: '12',
              exp_year: '2030',
              security_code: '123',
              holder: {
                name: name
              }
            } : undefined
          }
        }
      ]
    };
    
    // Cria o pagamento no PagSeguro
    const response = await fetch(`${PAGSEGURO_API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGSEGURO_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro PagSeguro:', errorText);
      return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
    }
    
    const data = await response.json();
    console.log('Pagamento criado:', data);
    
    // Extrai as informações relevantes
    const charge = data.charges[0];
    const paymentId = charge.id;
    const status = charge.status;
    const paymentUrl = charge.payment_response?.qr_codes?.[0]?.text || null;
    const qrCodeUrl = charge.payment_response?.qr_codes?.[0]?.links?.[0]?.href || null;
    
    return NextResponse.json({
      success: true,
      paymentId,
      status,
      paymentUrl,
      qrCodeUrl
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
} 