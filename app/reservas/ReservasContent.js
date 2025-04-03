"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import styles from '../../src/styles/ReservasPage.module.css';

export default function ReservasContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [formData, setFormData] = useState({
    suite: '',
    checkInDate: '',
    checkInTime: '',
    period: '',
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'credit-card',
    immediateCheckIn: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const selectedDate = formData.immediateCheckIn
        ? new Date().toISOString().split('T')[0]
        : formData.checkInDate;
      const selectedTime = formData.immediateCheckIn
        ? new Date().toTimeString().split(' ')[0]
        : formData.checkInTime;
  
      // Verificação de disponibilidade
      const q = query(
        collection(db, 'reservations'),
        where('suite', '==', formData.suite),
        where('checkInDate', '==', selectedDate),
        where('checkInTime', '==', selectedTime),
        where('status', '!=', 'Cancelada')
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        setError('Desculpe, esta suíte já está reservada para o horário selecionado.');
        return;
      }
  
      // Calcular o valor da reserva (mockup)
      const prices = {
        'suite-private': { 'periodo-4h': 355, 'pernoite-12h': 407 },
        'suite-diamante-luxo': { 'periodo-4h': 299, 'pernoite-12h': 320 },
        'suite-prata': { 'periodo-4h': 155, 'pernoite-12h': 208 },
        'suite-bronze': { 'periodo-4h': 125, 'pernoite-12h': 175 },
      };
  
      const price = prices[formData.suite]?.[formData.period] || 0;
      if (!price) {
        setError('Preço não encontrado para a suíte e período selecionados.');
        return;
      }
  
      // Salvar a reserva no Firestore
      const reservation = {
        suite: formData.suite,
        checkInDate: selectedDate,
        checkInTime: selectedTime,
        period: formData.period,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'Pendente',
        status: 'Pendente',
        createdAt: new Date().toISOString(),
      };
  
      const docRef = await addDoc(collection(db, 'reservations'), reservation);
  
      // Simulação de pagamento (mockup)
      setSubmitted(true);
      setPaymentUrl(`https://pagseguro.uol.com.br/checkout?code=${docRef.id}`); // Mockup URL
    } catch (err) {
      setError(`Erro ao criar reserva: ${err.message}`); // Exibir a mensagem de erro completa
      console.error('Erro ao criar reserva:', err); // Logar o erro no console para depuração
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
              <div>
                <p className={styles.successMessage}>
                  Reserva enviada com sucesso! Finalize o pagamento para confirmar.
                </p>
                {paymentUrl && (
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className={styles.paymentButton}>
                    Pagar Agora
                  </a>
                )}
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
                  <label className={styles.formLabel}>
                    <input
                      type="checkbox"
                      name="immediateCheckIn"
                      checked={formData.immediateCheckIn}
                      onChange={handleChange}
                    />
                    Check-in Imediato (Agora)
                  </label>
                </div>
                {!formData.immediateCheckIn && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="checkInDate" className={styles.formLabel}>Data de Check-in</label>
                      <input
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="checkInTime" className={styles.formLabel}>Horário de Check-in</label>
                      <input
                        type="time"
                        id="checkInTime"
                        name="checkInTime"
                        value={formData.checkInTime}
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                      />
                    </div>
                  </>
                )}
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
                  <label htmlFor="email" className={styles.formLabel}>E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Seu E-mail"
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
                    placeholder="Seu Telefone"
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="paymentMethod" className={styles.formLabel}>Método de Pagamento</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value="credit-card">Cartão de Crédito</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>
                <button type="submit" className={styles.formButton}>Confirmar e Pagar</button>
              </form>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}