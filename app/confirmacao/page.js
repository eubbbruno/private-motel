'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../supabase';
import ConfirmacaoContent from './ConfirmacaoContent';

// Componente que usa useSearchParams
function ConfirmacaoInner() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('id');
  const simulado = searchParams.get('simulado');
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchReservation() {
      try {
        if (!reservationId && !simulado) {
          setError('ID da reserva não especificado');
          setLoading(false);
          return;
        }
        
        // Se for um pagamento simulado, criamos dados fictícios
        if (simulado === 'true') {
          console.log('Mostrando dados de reserva simulada para fins de demonstração');
          
          // Gerar dados simulados mais realistas
          const suiteOptions = [
            'Suíte Private', 
            'Suíte Diamante Luxo', 
            'Suíte Prata', 
            'Suíte Bronze'
          ];
          
          const randomSuite = suiteOptions[Math.floor(Math.random() * suiteOptions.length)];
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
          const randomHour = Math.floor(Math.random() * 12) + 12; // Entre 12h e 23h
          const formattedTime = `${randomHour}:00`;
          
          const simulatedPrice = Math.floor(Math.random() * 300) + 150; // Entre R$150 e R$450
          
          setReservation({
            id: 'simulado-' + Date.now(),
            suite: randomSuite.toLowerCase().replace(/\s+/g, '-'),
            suite_name: randomSuite,
            check_in_date: formattedDate,
            check_in_time: formattedTime,
            period: 'periodo-4h',
            period_name: 'Período (4 horas)',
            name: 'Cliente Demonstração',
            email: 'demonstracao@privatemotel.com.br',
            phone: '(43) 99999-9999',
            payment_method: 'pix',
            total_price: simulatedPrice,
            payment_status: 'Pendente',
            status: 'Pendente',
            payment_url: '#',
            qr_code_url: 'https://chart.googleapis.com/chart?cht=qr&chl=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426655440000%5204000053039865802BR5913PRIVATE%20MOTEL%206014LONDRINA-PARANA%2762070503***63044682&chs=300x300&chld=L|0'
          });
          setLoading(false);
          return;
        }
        
        // Buscar dados da reserva do Supabase
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', reservationId)
          .single();
        
        if (error) {
          console.error('Erro ao buscar reserva:', error);
          setError('Não foi possível encontrar a reserva. Por favor, verifique o ID.');
          setLoading(false);
          return;
        }
        
        // Mapear nomes mais amigáveis para suítes e períodos
        const suiteMap = {
          'suite-private': 'Suíte Private',
          'suite-diamante-luxo': 'Suíte Diamante Luxo',
          'suite-prata': 'Suíte Prata',
          'suite-bronze': 'Suíte Bronze',
        };
        
        const periodMap = {
          'periodo-4h': 'Período (4 horas)',
          'pernoite-12h': 'Pernoite (12 horas)',
        };
        
        // Enriquecer os dados com nomes amigáveis
        data.suite_name = suiteMap[data.suite] || data.suite;
        data.period_name = periodMap[data.period] || data.period;
        
        setReservation(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro:', err);
        setError('Ocorreu um erro ao carregar os dados da reserva.');
        setLoading(false);
      }
    }
    
    fetchReservation();
  }, [reservationId, simulado]);
  
  return <ConfirmacaoContent 
    loading={loading} 
    reservation={reservation} 
    error={error} 
  />;
}

// Componente principal com Suspense
export default function Confirmacao() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmacaoInner />
    </Suspense>
  );
} 