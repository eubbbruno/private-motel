import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaComment, FaTag, FaWhatsapp } from 'react-icons/fa';
import styles from '../styles/FormularioContato.module.css';

const FormularioContato = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      // Formatar a mensagem para o WhatsApp
      const message = encodeURIComponent(
        `*Contato via Site - Private Motel*\n\n` +
        `*Nome:* ${formData.name}\n` +
        `*Email:* ${formData.email}\n` +
        `*Telefone:* ${formData.phone || 'Não informado'}\n` +
        `*Assunto:* ${formData.subject}\n\n` +
        `*Mensagem:*\n${formData.message}`
      );
      
      // Número do WhatsApp do motel
      const whatsappNumber = '5543999936839';
      
      // Abrir WhatsApp com a mensagem
      window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank');
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setSubmitError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.formContainer}>
      {submitSuccess && (
        <div className={styles.successMessage}>
          <FaWhatsapp /> Você será redirecionado para o WhatsApp para finalizar o envio da sua mensagem.
        </div>
      )}
      
      {submitError && (
        <div className={styles.errorMessage}>
          {submitError}
        </div>
      )}
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            <FaUser className={styles.icon} /> Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Seu nome completo"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            <FaEnvelope className={styles.icon} /> Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seu.email@exemplo.com"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="subject">
            <FaTag className={styles.icon} /> Assunto
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className={styles.input}
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Assunto da mensagem"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phone">
            <FaPhone className={styles.icon} /> Telefone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="message">
            <FaComment className={styles.icon} /> Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Digite sua mensagem aqui..."
            rows={5}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'} <FaWhatsapp style={{ marginLeft: '8px' }} />
        </button>
      </form>
    </div>
  );
};

export default FormularioContato; 