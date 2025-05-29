'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PopupCookies.module.css';

export default function PopupCookies() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setIsOpen(false);
    } else {
      // Pequeno atraso para melhor experiência de usuário
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsOpen(false);
  };

  // Função para testes de desenvolvimento
  const handleClearConsent = () => {
    localStorage.removeItem('cookieConsent');
    setIsOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.cookieToast}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className={styles.cookieIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14C7.9 14 7 13.1 7 12ZM15 18C13.9 18 13 17.1 13 16C13 14.9 13.9 14 15 14C16.1 14 17 14.9 17 16C17 17.1 16.1 18 15 18ZM16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5C17.1 5 18 5.9 18 7C18 8.1 17.1 9 16 9Z" fill="#d4a373"/>
              </svg>
            </div>
            <div className={styles.cookieContent}>
              <p className={styles.cookieText}>
                Este site usa cookies para melhorar sua experiência. 
                <Link href="/lgpd" className={styles.cookieLink}> Política de Privacidade</Link>
              </p>
            </div>
            <div className={styles.cookieButtons}>
              <button onClick={handleAccept} className={styles.cookieAcceptButton}>OK</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botão para desenvolvimento - remover em produção */}
      {process.env.NODE_ENV === 'development' && !isOpen && (
        <div className={styles.testButtonContainer}>
          <button onClick={handleClearConsent} className={styles.testButton}>
            Testar Cookies
          </button>
        </div>
      )}
    </>
  );
}