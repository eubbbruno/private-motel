import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sua-url-supabase.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima-supabase';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Funções auxiliares para operações comuns no Supabase
 */

/**
 * Busca todas as reservas
 * @returns {Promise<Array>} Lista de reservas
 */
export const getReservations = async () => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Busca uma reserva pelo ID
 * @param {string} id ID da reserva
 * @returns {Promise<Object>} Dados da reserva
 */
export const getReservationById = async (id) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Cria uma nova reserva
 * @param {Object} reservation Dados da reserva
 * @returns {Promise<Object>} Reserva criada
 */
export const createReservation = async (reservation) => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('reservations')
    .insert([{ 
      ...reservation, 
      created_at: now,
      updated_at: now 
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Atualiza uma reserva existente
 * @param {string} id ID da reserva
 * @param {Object} updates Campos a serem atualizados
 * @returns {Promise<Object>} Reserva atualizada
 */
export const updateReservation = async (id, updates) => {
  try {
    console.log('Atualizando reserva:', id, 'com dados:', JSON.stringify(updates, null, 2));
    
    if (!id) {
      throw new Error('ID da reserva não fornecido');
    }
    
    // Remover campos que não existem na tabela de reservas
    const validUpdates = { ...updates };
    if (validUpdates.notes !== undefined) {
      console.warn('Campo "notes" removido pois não existe na tabela');
      delete validUpdates.notes;
    }
    
    // Assegura que updated_at esteja definido
    if (!validUpdates.updated_at) {
      validUpdates.updated_at = new Date().toISOString();
    }
    
    console.log('Campos atualizados após validação:', JSON.stringify(validUpdates, null, 2));
    
    const { data, error } = await supabase
      .from('reservations')
      .update(validUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro Supabase ao atualizar reserva:', 
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      throw new Error(JSON.stringify({
        code: error.code,
        message: error.message,
        details: error.details
      }));
    }
    
    if (!data) {
      console.error('Nenhum dado retornado após atualização');
      throw new Error('Reserva não encontrada ou não foi atualizada');
    }
    
    console.log('Reserva atualizada com sucesso:', data.id);
    return data;
  } catch (error) {
    console.error('Erro completo ao atualizar reserva:', 
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    // Gerar mensagem de erro mais informativa
    const errorMessage = error.message || String(error);
    throw new Error(`Falha ao atualizar reserva: ${errorMessage}`);
  }
};

/**
 * Verifica a disponibilidade de uma suíte
 * @param {string} suiteId ID da suíte
 * @param {string} date Data da reserva
 * @param {string} period Período (periodo-4h, pernoite-12h)
 * @param {string} time Horário da reserva
 * @returns {Promise<Object>} Resultado da verificação
 */
export const checkSuiteAvailability = async (suiteId, date, period, time) => {
  try {
    console.log(`Verificando disponibilidade: suite=${suiteId}, data=${date}, hora=${time}, período=${period}`);
    
    // Define o início e fim do dia para a data selecionada
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Busca reservas para esta suíte e data
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('suite', suiteId)
      .gte('check_in_date', dayStart.toISOString())
      .lte('check_in_date', dayEnd.toISOString());
    
    if (error) throw error;
    
    // Se não houver reservas, a suíte está disponível
    if (!reservations || reservations.length === 0) {
      return { available: true };
    }
    
    // Verifica conflitos com reservas existentes
    let hasConflict = false;
    let conflictReason = '';
    
    const selectedTime = parseInt(time.split(':')[0]);
    
    for (const reservation of reservations) {
      // Ignora reservas canceladas ou recusadas
      if (reservation.status === 'Cancelada' || reservation.status === 'Recusada') {
        continue;
      }
      
      const reservationTime = parseInt(reservation.check_in_time.split(':')[0]);
      
      // Verifica se há sobreposição de horários com base no período
      let conflict = false;
      
      if (period === 'pernoite-12h' || reservation.period === 'pernoite-12h') {
        // Pernoites sempre geram conflito no mesmo dia
        conflict = true;
        conflictReason = 'Já existe uma reserva de pernoite para esta data';
      } else if (period === 'periodo-4h' || reservation.period === 'periodo-4h') {
        // Verifica se o horário está dentro de uma janela de 4 horas
        const timeDiff = Math.abs(selectedTime - reservationTime);
        if (timeDiff < 4) {
          conflict = true;
          conflictReason = `Horário indisponível. Próximo horário disponível: ${reservationTime + 4}:00`;
        }
      } else {
        // Para períodos de 2h
        const timeDiff = Math.abs(selectedTime - reservationTime);
        if (timeDiff < 2) {
          conflict = true;
          conflictReason = `Horário indisponível. Próximo horário disponível: ${reservationTime + 2}:00`;
        }
      }
      
      if (conflict) {
        hasConflict = true;
        break;
      }
    }
    
    return { 
      available: !hasConflict,
      reason: hasConflict ? conflictReason : ''
    };
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return { 
      available: false, 
      reason: 'Erro ao verificar disponibilidade. Tente novamente.'
    };
  }
}; 