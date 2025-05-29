/**
 * Serviço para integração com a API do PagSeguro
 */

const PAGSEGURO_API = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_PAGSEGURO_PRODUCTION_URL || 'https://api.pagseguro.com/'
  : process.env.NEXT_PUBLIC_PAGSEGURO_SANDBOX_URL || 'https://sandbox.api.pagseguro.com/';

const API_TOKEN = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_PAGSEGURO_PRODUCTION_TOKEN || '581e8852-d8a5-450b-b72b-a3a8b1e339a14e9b89ce42ed85e74446d927a71ec83fb2f3-1750-419c-9c59-3533e2be89f4'
  : process.env.NEXT_PUBLIC_PAGSEGURO_SANDBOX_TOKEN || '581e8852-d8a5-450b-b72b-a3a8b1e339a14e9b89ce42ed85e74446d927a71ec83fb2f3-1750-419c-9c59-3533e2be89f4';

/**
 * Cria um pagamento no PagSeguro
 * @param {Object} reservation - Dados da reserva
 * @returns {Promise<Object>} - Resposta da API do PagSeguro
 */
export const createPayment = async (reservation) => {
  try {
    console.log('Criando pagamento para reserva:', reservation.id);
    
    // Construir URL absoluta para a API de pagamento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/pagseguro/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservationId: reservation.id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        suite: reservation.suite,
        checkInDate: reservation.check_in_date,
        checkInTime: reservation.check_in_time,
        period: reservation.period,
        totalPrice: reservation.total_price,
        paymentMethod: reservation.payment_method
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao criar pagamento:', errorData);
      throw new Error(`Erro ao criar pagamento: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('Pagamento criado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
};

/**
 * Verifica o status de um pagamento no PagSeguro
 * @param {string} paymentId - ID do pagamento no PagSeguro
 * @returns {Promise<Object>} - Resposta da API do PagSeguro
 */
export const checkPaymentStatus = async (paymentId) => {
  try {
    console.log('Verificando status do pagamento:', paymentId);
    
    // Construir URL absoluta para a API de verificação de status
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/pagseguro/check-status?paymentId=${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao verificar status do pagamento:', errorData);
      throw new Error(`Erro ao verificar status do pagamento: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('Status do pagamento:', result);
    return result;
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
};

/**
 * Processa notificações de webhook do PagSeguro
 * @param {Object} notificationData - Dados da notificação
 * @returns {Object} - Resultado do processamento
 */
export const processNotification = (notificationData) => {
  try {
    const { reference_id, status } = notificationData;
    
    // Mapeia os status do PagSeguro para os status da aplicação
    const statusMap = {
      'PAID': 'Confirmada',
      'CANCELED': 'Cancelada',
      'DECLINED': 'Recusada',
      'PENDING': 'Pendente'
    };
    
    return {
      success: true,
      reservationId: reference_id,
      status: statusMap[status] || 'Pendente'
    };
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao processar notificação'
    };
  }
}; 