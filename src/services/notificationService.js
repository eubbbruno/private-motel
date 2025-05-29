/**
 * Serviço para envio de notificações (e-mail e WhatsApp via ManyChat)
 */

// Configurações do ManyChat
const MANYCHAT_API = 'https://api.manychat.com';
const MANYCHAT_API_KEY = process.env.NEXT_PUBLIC_MANYCHAT_API_KEY || '988817:2ac91c72402bd633a48d14f634857ad3'; // Substitua pelo seu token
const MANYCHAT_FLOW_ID = process.env.NEXT_PUBLIC_MANYCHAT_FLOW_ID || 'content20250406193838_142165'; // ID do fluxo de trabalho no ManyChat

/**
 * Envia e-mail de confirmação para o usuário
 * @param {object} reservation Dados da reserva
 * @returns {Promise<object>} Resposta da API
 */
export async function sendConfirmationEmail(reservation) {
  try {
    const { 
      name, email, suite, date, time, period, totalPrice, 
      paymentMethod, paymentUrl, qrCodeUrl 
    } = reservation;

    // Formatar a data para exibição
    const formattedDate = formatDateForDisplay(date);
    
    // Construir URL absoluta da API
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://privatemotel.com.br';
    
    const apiUrl = `${baseUrl}/api/send-email`;
    
    console.log('Enviando email de confirmação para:', email);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateName: 'reservation-confirmation',
        subject: 'Confirmação de Reserva - Private Motel',
        emailData: {
          email,
          name,
          suite,
          date: formattedDate,
          time,
          period,
          totalPrice: formatCurrency(totalPrice),
          paymentMethod,
          paymentUrl,
          qrCodeUrl
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = data.error || 'Erro ao enviar email de confirmação';
      console.error(errorMsg, data);
      throw new Error(errorMsg);
    }
    
    console.log('Email de confirmação enviado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Falha ao enviar email de confirmação:', error);
    throw error;
  }
}

/**
 * Envia mensagem de WhatsApp via ManyChat
 * @param {Object} reservation - Dados da reserva
 * @returns {Promise<Object>} - Resultado do envio
 */
export const sendWhatsAppNotification = async (reservation) => {
  try {
    console.log('Enviando notificação WhatsApp para:', reservation.phone);
    
    // Construir URL absoluta para a API de WhatsApp
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/send-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: reservation.phone,
        message: `Olá ${reservation.name}! Sua reserva no Private Motel foi confirmada. Detalhes: Suíte ${reservation.suite_name || reservation.suite}, Data: ${formatDate(reservation.check_in_date)}, Horário: ${reservation.check_in_time}, Período: ${reservation.period_name || reservation.period}. Para mais informações, acesse: ${baseUrl}/confirmacao?id=${reservation.id}`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar WhatsApp:', errorData);
      throw new Error(`Erro ao enviar WhatsApp: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('WhatsApp enviado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao enviar notificação WhatsApp:', error);
    // Não lançamos o erro para não interromper o fluxo da reserva
    return { success: false, error: error.message };
  }
};

/**
 * Envia email de confirmação de pagamento
 * @param {object} payment Dados do pagamento
 * @returns {Promise<object>} Resposta da API
 */
export async function sendPaymentConfirmation(payment) {
  try {
    const { 
      reservation: { name, email, suite, date, time, period }, 
      amount, reservationId 
    } = payment;

    // Formatar a data para exibição
    const formattedDate = formatDateForDisplay(date);
    
    // Construir URL absoluta da API
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://privatemotel.com.br';
    
    const apiUrl = `${baseUrl}/api/send-email`;
    
    console.log('Enviando confirmação de pagamento para:', email);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateName: 'payment-confirmation',
        subject: 'Pagamento Confirmado - Private Motel',
        emailData: {
          email,
          name,
          suite,
          date: formattedDate,
          time,
          period,
          amount: formatCurrency(amount),
          reservationId
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = data.error || 'Erro ao enviar confirmação de pagamento';
      console.error(errorMsg, data);
      throw new Error(errorMsg);
    }
    
    console.log('Confirmação de pagamento enviada com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Falha ao enviar confirmação de pagamento:', error);
    throw error;
  }
}

// Funções auxiliares
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
} 