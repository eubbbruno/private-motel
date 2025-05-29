import { NextResponse } from 'next/server';

// Chave da API do ManyChat
const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY;
const MANYCHAT_FLOW_ID = process.env.MANYCHAT_FLOW_ID;
const MANYCHAT_API = 'https://api.manychat.com/fb';

/**
 * API para envio de mensagens WhatsApp via ManyChat
 */
export async function POST(request) {
  // Determinar se estamos em ambiente de desenvolvimento
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  try {
    // Extrai os dados da requisição
    const { phone, message } = await request.json();
    
    // Valida os dados
    if (!phone || !message) {
      console.error('Dados incompletos:', { phone, message });
      return NextResponse.json(
        { error: 'Telefone e mensagem são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Em desenvolvimento, simular o envio com mais detalhes
    if (isDevelopment) {
      console.log('🚀 Simulando envio de WhatsApp em ambiente de desenvolvimento:');
      console.log('Para:', phone);
      console.log('Mensagem:', message);
      
      // Retornar sucesso simulado após breve delay para simular latência da rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({
        success: true,
        messageId: `dev-whatsapp-${Date.now()}`,
        simulated: true,
        message: 'WhatsApp simulado com sucesso em ambiente de desenvolvimento'
      });
    }
    
    // Verifica se as chaves da API estão configuradas
    if (!MANYCHAT_API_KEY || !MANYCHAT_FLOW_ID) {
      console.error('Configuração ManyChat ausente');
      return NextResponse.json(
        { error: 'Configuração do serviço de WhatsApp não encontrada' },
        { status: 500 }
      );
    }
    
    // Formata o número de telefone (remove caracteres não numéricos)
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Prepara os dados para o ManyChat
    const payload = {
      subscriber_id: formattedPhone,
      flow_id: MANYCHAT_FLOW_ID,
      custom_fields: {
        message: message
      }
    };
    
    // Envia a requisição para o ManyChat
    const response = await fetch(`${MANYCHAT_API}/sending/sendFlow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MANYCHAT_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ManyChat:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Erro ao enviar mensagem via ManyChat' },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    console.log('WhatsApp enviado com sucesso:', result);
    
    return NextResponse.json({
      success: true,
      messageId: result.message_id || result.id
    });
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    
    const errorMessage = isDevelopment 
      ? `Erro ao enviar WhatsApp: ${error.message}` 
      : 'Erro ao processar sua solicitação';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 