'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import styles from './Header.module.css';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Evitar rolagem do body quando o menu está aberto
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };
  
  const handleWhatsAppReservation = () => {
    const phoneNumber = "5543999936839";
    const message = encodeURIComponent("Olá! Gostaria de fazer uma reserva no Private Motel.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        {/* Banner promocional, se necessário */}
        <div className={styles.promoBanner}>
          <p>Bem-vindo ao Private Motel - O melhor motel 5 estrelas da região de Londrina e Cambé</p>
        </div>
        
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/images/logo.png" 
              alt="Private Motel" 
              width={180}
              height={60}
              priority
            />
          </Link>

          <nav className={styles.desktopNav}>
            <ul className={styles.menu}>
              <li><Link href="/" className={styles.menuLink}>Home</Link></li>
              <li><Link href="/suites" className={styles.menuLink}>Suítes</Link></li>
              <li><Link href="/cortesias" className={styles.menuLink}>Cortesias</Link></li>
              <li><Link href="/experiencias" className={styles.menuLink}>Experiências</Link></li>
              <li><Link href="/estrutura" className={styles.menuLink}>Estrutura</Link></li>
              <li><Link href="/contato" className={styles.menuLink}>Contato</Link></li>
              <li>
                <button 
                  onClick={handleWhatsAppReservation} 
                  className={`${styles.menuLink} ${styles.reservas}`}
                >
                  Reservas
                </button>
              </li>
            </ul>
          </nav>
          
          <div className={styles.socials}>
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

          <button 
            className={styles.mobileMenuButton} 
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <FaBars />
          </button>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={toggleMobileMenu} 
      />
    </>
  );
};

export default Header;