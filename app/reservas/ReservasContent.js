"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from '../../src/styles/ReservasPage.module.css';
import { createPayment } from '../../src/services/pagseguroService';
import { sendConfirmationEmail, sendWhatsAppNotification } from '../../src/services/notificationService';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { supabase, createReservation, updateReservation, checkSuiteAvailability } from '../supabase';

// Registra o locale pt-BR
registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

export default function ReservasContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('18:00');

  const [formData, setFormData] = useState({
    suite: '',
    period: '',
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'pix',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentQrCode, setPaymentQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [reservationId, setReservationId] = useState('');

  useEffect(() => {
    // Gerar horários disponíveis (a cada hora) das 7h às 23h
    const generateTimeOptions = () => {
      const times = [];
      for (let hour = 7; hour <= 23; hour++) {
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
        times.push(`${formattedHour}:00`);
      }
      return times;
    };

    setAvailableTimes(generateTimeOptions());
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };
  
  // Função para validar o formulário
  const validateForm = () => {
    if (!formData.suite) {
      setError('Por favor, selecione uma suíte');
      return false;
    }
    
    if (!formData.period) {
      setError('Por favor, selecione um período');
      return false;
    }
    
    if (!selectedDate) {
      setError('Por favor, selecione uma data de check-in');
      return false;
    }
    
    if (!selectedTime) {
      setError('Por favor, selecione um horário de check-in');
      return false;
    }
    
    if (!formData.name || formData.name.trim().length < 3) {
      setError('Por favor, informe seu nome completo');
      return false;
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      setError('Por favor, informe um e-mail válido');
      return false;
    }
    
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um telefone válido com DDD');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Função para calcular o preço da reserva
      const calculatePrice = (suite, period) => {
        const prices = {
          'suite-private': { 'periodo-4h': 355, 'pernoite-12h': 407 },
          'suite-diamante-luxo': { 'periodo-4h': 299, 'pernoite-12h': 320 },
          'suite-prata': { 'periodo-4h': 155, 'pernoite-12h': 208 },
          'suite-bronze': { 'periodo-4h': 125, 'pernoite-12h': 175 },
        };
        
        return prices[suite]?.[period] || 0;
      };
      
      // Calcular preço com base na suíte e período
      const price = calculatePrice(formData.suite, formData.period);
      
      // Mapeamento de valores legíveis
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
      
      // Formatar data para exibição
      const formattedDate = selectedDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      // Criar mensagem de WhatsApp com os dados da reserva
      const mensagemWhatsApp = encodeURIComponent(
        `Olá, gostaria de fazer uma reserva:\n\n` +
        `🏨 *${suiteMap[formData.suite]}*\n` +
        `📅 *Data:* ${formattedDate}\n` +
        `🕒 *Horário:* ${selectedTime}\n` +
        `⏱️ *Período:* ${periodMap[formData.period]}\n` +
        `💰 *Valor:* R$ ${price.toFixed(2)}\n\n` +
        `👤 *Nome:* ${formData.name}\n` +
        `📱 *Telefone:* ${formData.phone}\n` +
        `📧 *Email:* ${formData.email}\n\n` +
        `💳 *Forma de Pagamento:* ${formData.paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}`
      );
      
      // Número de telefone do motel
      const telefoneMotel = '5543999936839'; // Formato: 55 + DDD + número
      
      // Redirecionar para o WhatsApp
      window.open(`https://api.whatsapp.com/send?phone=${telefoneMotel}&text=${mensagemWhatsApp}`, '_blank');
      
      // Exibir confirmação para o usuário
      Swal.fire({
        title: 'Redirecionando para WhatsApp',
        text: 'Você será redirecionado para finalizar sua reserva via WhatsApp. Um atendente irá confirmar os detalhes.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8B5CF6',
      });
      
      // Limpar o formulário
      setFormData({
        suite: '',
        period: '',
        name: '',
        email: '',
        phone: '',
        paymentMethod: 'pix',
      });
      setSelectedDate(new Date());
      setSelectedTime('18:00');
      
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      setError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  const suites = [
    { name: 'Suíte Private', value: 'suite-private' },
    { name: 'Suíte Diamante Luxo', value: 'suite-diamante-luxo' },
    { name: 'Suíte Prata', value: 'suite-prata' },
    { name: 'Suíte Bronze', value: 'suite-bronze' },
  ];

  const periods = [
    { name: 'Período (4 horas)', value: 'periodo-4h' },
    { name: 'Pernoite (12 horas)', value: 'pernoite-12h' },
  ];

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section className={styles.section} ref={ref}>
          <motion.div
            className={styles.sectionDivider}
            initial={{ width: 0 }}
            animate={inView ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <motion.h1
            className={styles.sectionTitle}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Faça Sua Reserva
          </motion.h1>
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={formVariants}
            className={styles.formContainer}
          >
            <h2 className={styles.formTitle}>Preencha os Dados da Reserva</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {submitted ? (
              <div className={styles.successContainer}>
                <p className={styles.successMessage}>
                  Reserva enviada com sucesso! Por favor, finalize o pagamento para confirmar.
                </p>
                
                {formData.paymentMethod === 'pix' && paymentQrCode && (
                  <div className={styles.paymentQrCode}>
                    <p>Escaneie o QR Code abaixo para pagar com PIX:</p>
                    <img src={paymentQrCode} alt="QR Code PIX" className={styles.qrCodeImage} />
                  </div>
                )}
                
                {formData.paymentMethod === 'credit-card' && paymentUrl && (
                  <a 
                    href={paymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.paymentButton}
                  >
                    Pagar com Cartão
                  </a>
                )}
                
                <div className={styles.reservationInfo}>
                  <p>ID da Reserva: <strong>{reservationId}</strong></p>
                  <p>Você também receberá um e-mail com os detalhes da reserva.</p>
                </div>
                
                <button 
                  onClick={() => setSubmitted(false)} 
                  className={styles.newReservationButton}
                >
                  Fazer Nova Reserva
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.reservaForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="suite" className={styles.formLabel}>Escolha a Suíte</label>
                  <select
                    id="suite"
                    name="suite"
                    value={formData.suite}
                    onChange={handleChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value="">Selecione uma suíte</option>
                    {suites.map((suite, index) => (
                      <option key={index} value={suite.value}>{suite.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="checkInDate" className={styles.formLabel}>Data de Check-in</label>
                  <DatePicker
                    id="checkInDate"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="checkInTime" className={styles.formLabel}>Horário de Check-in</label>
                  <select
                    id="checkInTime"
                    name="checkInTime"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value="">Selecione o horário</option>
                    {availableTimes.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="period" className={styles.formLabel}>Período</label>
                  <select
                    id="period"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value="">Selecione o período</option>
                    {periods.map((period, index) => (
                      <option key={index} value={period.value}>{period.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu Nome"
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Forma de Pagamento</label>
                  <div className={styles.paymentOptions}>
                    <label className={styles.paymentOption}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleChange}
                      />
                      <span>Cartão de Crédito</span>
                    </label>
                    <label className={styles.paymentOption}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pix"
                        checked={formData.paymentMethod === 'pix'}
                        onChange={handleChange}
                      />
                      <span>PIX</span>
                    </label>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Reservar Agora'}
                </button>
              </form>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
      <div className={styles.particles}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>
    </div>
  );
}