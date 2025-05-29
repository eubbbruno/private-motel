import { NextResponse } from 'next/server';
import { supabase } from '../../../supabase';
import { processNotification } from '../../../../src/services/pagseguroService';
import { sendPaymentConfirmation } from '../../../../src/services/notificationService';

/**
 * API para receber notificações de webhook do PagSeguro
 */
export async function POST(request) {
  try {
    // Verifica se a requisição é válida
    if (!request.body) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 });
    }

    // Extrai os dados da notificação
    const notificationData = await request.json();
    console.log('Notificação recebida do PagSeguro:', notificationData);

    // Processa a notificação
    const result = processNotification(notificationData);
    
    if (!result.success) {
      console.error('Erro ao processar notificação:', result.error);
      return NextResponse.json({ error: 'Falha ao processar notificação' }, { status: 500 });
    }

    // Busca a reserva no Supabase
    const { reservationId, status } = result;
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();

    if (fetchError || !reservation) {
      console.error(`Reserva não encontrada: ${reservationId}`, fetchError);
      return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
    }

    // Atualiza o status da reserva
    const { error: updateError } = await supabase
      .from('reservations')
      .update({
        status,
        payment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', reservationId);
    
    if (updateError) {
      console.error(`Erro ao atualizar reserva: ${reservationId}`, updateError);
      return NextResponse.json({ error: 'Falha ao atualizar reserva' }, { status: 500 });
    }

    console.log(`Reserva ${reservationId} atualizada para ${status}`);

    // Se o pagamento foi confirmado, envia notificações
    if (status === 'Confirmada') {
      // Enviar e-mail e notificação WhatsApp
      const notificationResult = await sendPaymentConfirmation({
        ...reservation,
        reservationId,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        suite: reservation.suite,
        checkInDate: reservation.check_in_date,
        checkInTime: reservation.check_in_time,
        period: reservation.period,
        totalPrice: reservation.total_price || 0
      });

      console.log('Notificações enviadas:', notificationResult);
    }

    return NextResponse.json({ success: true, message: 'Notificação processada com sucesso' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
} 