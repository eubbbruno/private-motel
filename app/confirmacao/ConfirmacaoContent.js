'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/ConfirmacaoPage.module.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const ConfirmacaoContent = ({ loading, reservation, error }) => {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState('');
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, (err) => {
      console.error('Erro ao copiar: ', err);
      setCopySuccess('Falha ao copiar');
    });
  };
  
  const handleBack = () => {
    router.push('/');
  };
  
  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Carregando informações da reserva...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !reservation) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Ops! Tivemos um problema.</h2>
            <p className={styles.errorMessage}>{error || 'Reserva não encontrada'}</p>
            <button onClick={handleBack} className={styles.button}>
              Voltar para o início
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const {
    id,
    suite_name,
    check_in_date,
    check_in_time,
    period_name,
    name,
    email,
    phone,
    payment_method,
    total_price,
    payment_status,
    status,
    payment_url,
    qr_code_url
  } = reservation;
  
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <motion.div
          className={styles.confirmationCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>Confirmação de Reserva</h1>
            <p className={styles.subtitle}>Obrigado por escolher o Private Motel!</p>
          </div>
          
          <div className={styles.reservationInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Número da reserva:</span>
              <span className={styles.value}>
                {id}
                <button 
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(id)}
                  title="Copiar número da reserva"
                >
                  {copySuccess || 'Copiar'}
                </button>
              </span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${styles.statusBadge} ${styles[status?.toLowerCase()]}`}>
                {status || 'Pendente'}
              </span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Suíte:</span>
              <span className={styles.value}>{suite_name}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Data:</span>
              <span className={styles.value}>{formatDate(check_in_date)}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Horário:</span>
              <span className={styles.value}>{check_in_time}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Período:</span>
              <span className={styles.value}>{period_name}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Nome:</span>
              <span className={styles.value}>{name}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{email}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Telefone:</span>
              <span className={styles.value}>{phone}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Forma de pagamento:</span>
              <span className={styles.value}>
                {payment_method === 'pix' ? 'PIX' : 'Cartão de Crédito'}
              </span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Valor total:</span>
              <span className={`${styles.value} ${styles.price}`}>{formatCurrency(total_price)}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Status do pagamento:</span>
              <span className={`${styles.value} ${styles.paymentStatus} ${styles[payment_status?.toLowerCase()]}`}>
                {payment_status || 'Pendente'}
              </span>
            </div>
          </div>
          
          {payment_status !== 'Pago' && payment_status !== 'Confirmado' && (
            <div className={styles.paymentSection}>
              <h2 className={styles.paymentTitle}>Complete seu pagamento</h2>
              
              {payment_method === 'pix' && qr_code_url && (
                <div className={styles.pixContainer}>
                  <p className={styles.pixInstructions}>
                    Escaneie o QR Code abaixo com o aplicativo do seu banco para pagar via PIX:
                  </p>
                  <div className={styles.qrCodeWrapper}>
                    <img src={qr_code_url} alt="QR Code PIX" className={styles.qrCode} />
                  </div>
                </div>
              )}
              
              {payment_method === 'credit-card' && payment_url && (
                <div className={styles.creditCardContainer}>
                  <p className={styles.creditCardInstructions}>
                    Clique no botão abaixo para pagar com cartão de crédito:
                  </p>
                  <a 
                    href={payment_url} 
                    className={styles.paymentButton}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pagar com Cartão
                  </a>
                </div>
              )}
            </div>
          )}
          
          <div className={styles.footer}>
            <p className={styles.thankYou}>
              Obrigado por escolher o Private Motel! Esperamos proporcionar uma experiência incrível.
            </p>
            <p className={styles.contact}>
              Em caso de dúvidas, entre em contato pelo WhatsApp: <strong>(43) 9 9646-6446</strong>
            </p>
            <button onClick={handleBack} className={styles.button}>
              Voltar para o início
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ConfirmacaoContent; 