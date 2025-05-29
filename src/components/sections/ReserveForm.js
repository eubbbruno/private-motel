import React, { useState } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaUser, FaWhatsapp, FaEnvelope, FaCreditCard } from 'react-icons/fa';
import styles from './ReserveForm.module.css';

const ReserveForm = ({ suiteId, suiteName, suitePrice }) => {
  const [formData, setFormData] = useState({
    suite: suiteName || '',
    date: '',
    time: '',
    period: '3 horas',
    name: '',
    phone: '',
    email: '',
    paymentMethod: 'Pix',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Formatar a mensagem para o WhatsApp
    const whatsappMessage = encodeURIComponent(
      `Olá, gostaria de fazer uma reserva no Private Motel:\n\n` +
      `Suite: ${formData.suite}\n` +
      `Data: ${formData.date}\n` +
      `Horário: ${formData.time}\n` +
      `Período: ${formData.period}\n` +
      `Nome: ${formData.name}\n` +
      `Telefone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `Forma de pagamento: ${formData.paymentMethod}`
    );
    
    // Redirecionar para o WhatsApp
    window.open(`https://wa.me/5543999936839?text=${whatsappMessage}`, '_blank');
    
    // Limpar o formulário e mostrar mensagem de sucesso
    setSubmitSuccess(true);
    setFormData({
      suite: suiteName || '',
      date: '',
      time: '',
      period: '3 horas',
      name: '',
      phone: '',
      email: '',
      paymentMethod: 'Pix',
    });
    
    // Esconder mensagem de sucesso após 5 segundos
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  return (
    <div className={styles.reserveFormContainer}>
      <h2 className={styles.formTitle}>Fazer Reserva</h2>
      
      {submitSuccess && (
        <div className={styles.successMessage}>
          Redirecionando para WhatsApp para finalizar sua reserva!
        </div>
      )}
      
      {submitError && (
        <div className={styles.errorMessage}>
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.reserveForm}>
        <div className={styles.formGroup}>
          <label htmlFor="suite" className={styles.label}>
            <FaCalendarAlt className={styles.formIcon} /> Suíte
          </label>
          <input
            type="text"
            id="suite"
            name="suite"
            value={formData.suite}
            onChange={handleChange}
            className={styles.input}
            required
            readOnly={!!suiteName}
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              <FaCalendarAlt className={styles.formIcon} /> Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="time" className={styles.label}>
              <FaClock className={styles.formIcon} /> Horário
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="period" className={styles.label}>
            <FaClock className={styles.formIcon} /> Período
          </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="3 horas">3 horas</option>
            <option value="6 horas">6 horas</option>
            <option value="12 horas">12 horas</option>
            <option value="pernoite">Pernoite</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            <FaUser className={styles.formIcon} /> Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              <FaWhatsapp className={styles.formIcon} /> WhatsApp
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="(43) 99999-9999"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <FaEnvelope className={styles.formIcon} /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="paymentMethod" className={styles.label}>
            <FaCreditCard className={styles.formIcon} /> Forma de pagamento
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="Pix">Pix</option>
            <option value="Crédito">Cartão de Crédito</option>
            <option value="Débito">Cartão de Débito</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>
        
        <div className={styles.totalPrice}>
          {suitePrice && (
            <p className={styles.priceValue}>
              Valor: R$ {suitePrice.toFixed(2).replace('.', ',')}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processando...' : 'Fazer Reserva via WhatsApp'}
        </button>
        
        <p className={styles.disclaimer}>
          Ao fazer a reserva, você concorda com nossos{' '}
          <Link href="/termos-de-uso" className={styles.termsLink}>
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/politica-de-privacidade" className={styles.termsLink}>
            Política de Privacidade
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default ReserveForm; 