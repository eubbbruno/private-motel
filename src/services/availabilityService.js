/**
 * Serviço para verificação de disponibilidade
 */

import { supabase } from '../../app/supabase';

/**
 * Verifica se uma suíte está disponível para a data e período desejados
 * @param {string} suiteId - ID da suíte
 * @param {string} date - Data no formato ISO (YYYY-MM-DD)
 * @param {string} period - Período (2h, 4h, Pernoite)
 * @returns {Promise<boolean>} - Se a suíte está disponível
 */
export const checkSuiteAvailability = async (suiteId, date, period, time) => {
  try {
    console.log(`Verificando disponibilidade: suite=${suiteId}, data=${date}, hora=${time}, período=${period}`);
    
    // Define o início e fim do dia para a data selecionada
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Consulta reservas existentes para esta suíte e data
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('suite', suiteId)
      .gte('check_in_date', dayStart.toISOString())
      .lte('check_in_date', dayEnd.toISOString());
    
    if (error) {
      console.error('Erro ao consultar reservas:', error);
      return { available: false, reason: 'Erro ao verificar disponibilidade' };
    }
    
    // Se não houver reservas, a suíte está disponível
    if (!reservations || reservations.length === 0) {
      return { available: true };
    }
    
    // Verifica conflitos com reservas existentes
    let hasConflict = false;
    let conflictReason = '';
    
    const selectedTime = parseInt(time.split(':')[0]);
    
    // Percorre todas as reservas para verificar conflitos
    for (const reservation of reservations) {
      // Pula reservas canceladas
      if (reservation.status === 'Cancelada') {
        continue;
      }
      
      const reservationTime = parseInt(reservation.check_in_time.split(':')[0]);
      const reservationPeriod = reservation.period;
      
      let hoursNeeded = 0;
      
      // Determina a duração com base no período
      if (period === 'periodo-2h') hoursNeeded = 2;
      else if (period === 'periodo-4h') hoursNeeded = 4;
      else if (period === 'pernoite-12h') hoursNeeded = 12;
      
      let existingHours = 0;
      
      // Determina a duração da reserva existente
      if (reservationPeriod === 'periodo-2h') existingHours = 2;
      else if (reservationPeriod === 'periodo-4h') existingHours = 4;
      else if (reservationPeriod === 'pernoite-12h') existingHours = 12;
      
      // Verifica sobreposição de horários
      const selectedEnd = selectedTime + hoursNeeded;
      const existingEnd = reservationTime + existingHours;
      
      // Há sobreposição se:
      // - O início da nova reserva estiver dentro da duração da reserva existente
      // - O fim da nova reserva estiver dentro da duração da reserva existente
      // - A nova reserva englobar completamente a reserva existente
      if (
        (selectedTime >= reservationTime && selectedTime < existingEnd) ||
        (selectedEnd > reservationTime && selectedEnd <= existingEnd) ||
        (selectedTime <= reservationTime && selectedEnd >= existingEnd)
      ) {
        hasConflict = true;
        conflictReason = `Conflito de horário com reserva existente (${reservationTime}:00 - ${existingEnd}:00)`;
        break;
      }
    }
    
    return {
      available: !hasConflict,
      reason: hasConflict ? conflictReason : null
    };
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return {
      available: false,
      reason: 'Erro ao verificar disponibilidade. Por favor, tente novamente mais tarde.'
    };
  }
}; 