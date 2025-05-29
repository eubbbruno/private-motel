'use client';

import React from 'react';
import Link from 'next/link';
import { FaTimes, FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose }) => {
  const handleWhatsAppReservation = () => {
    const phoneNumber = "5543999936839";
    const message = encodeURIComponent("Olá! Gostaria de fazer uma reserva no Private Motel.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onClose();
  };

  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.isOpen : ''}`}>
      <button 
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <FaTimes />
      </button>
      
      <div className={styles.menuContent}>
        <Link href="/" className={styles.menuItem} onClick={onClose}>
          Home
        </Link>
        <Link href="/suites" className={styles.menuItem} onClick={onClose}>
          Suítes
        </Link>
        <Link href="/cortesias" className={styles.menuItem} onClick={onClose}>
          Cortesias
        </Link>
        <Link href="/experiencias" className={styles.menuItem} onClick={onClose}>
          Experiências
        </Link>
        <Link href="/estrutura" className={styles.menuItem} onClick={onClose}>
          Estrutura
        </Link>
        <Link href="/contato" className={styles.menuItem} onClick={onClose}>
          Contato
        </Link>
        
        <button 
          onClick={handleWhatsAppReservation} 
          className={styles.reservasButton}
        >
          <FaWhatsapp className={styles.whatsappIcon} /> Fazer Reserva
        </button>
        
        <div className={styles.socialLinks}>
          <a href="https://instagram.com/private_motel" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://facebook.com/privatemotel" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a 
            href="https://wa.me/5543999936839" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 