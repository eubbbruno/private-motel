'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './PopupCookies.module.css';

export default function PopupCookies() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsOpen(false);
  };

  // Função temporária para limpar o localStorage e testar o popup
  const handleClearConsent = () => {
    localStorage.removeItem('cookieConsent');
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <div className={styles.testButtonContainer}>
        <button onClick={handleClearConsent} className={styles.testButton}>
          Mostrar Popup de Cookies (Limpar Consentimento)
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <div className={styles.cookieOverlay}>
      <motion.div
        className={styles.cookiePopup}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={contentVariants}>
          <h3 className={styles.cookieTitle}>Aviso de Cookies e LGPD</h3>
          <p className={styles.cookieText}>
            Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{' '}
            <Link href="/lgpd" className={styles.cookieLink}>Política de Privacidade</Link> e{' '}
            <Link href="/termos-uso" className={styles.cookieLink}>Termos de Uso</Link>, conforme a LGPD. Para motéis no Brasil, seus dados são protegidos e usados apenas para serviços personalizados.
          </p>
          <div className={styles.cookieButtons}>
            <button onClick={handleAccept} className={styles.cookieButton}>Aceitar</button>
            <Link href="/lgpd" className={styles.cookieButton}>Saber Mais</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}