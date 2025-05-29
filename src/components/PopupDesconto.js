'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './PopupDesconto.module.css';

export default function PopupDesconto() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 10 segundos de atraso
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setIsOpen(false), 3000);
  };

  if (!isOpen || submitted) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <div className={styles.popupOverlay}>
      <motion.div
        className={styles.popup}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={contentVariants}>
          <div className={styles.popupImageWrapper}>
            <Image
              src="/images/discount-icon.png"
              alt="Desconto"
              width={50}
              height={50}
              className={styles.popupImage}
            />
          </div>
          <h2 className={styles.popupTitle}>Ganhe 10% de Desconto!</h2>
          <p className={styles.popupText}>Cadastre-se agora e receba seu cupom.</p>
          <form onSubmit={handleSubmit} className={styles.popupForm}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu Nome"
              required
              className={styles.popupInput}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu E-mail"
              required
              className={styles.popupInput}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Seu Celular (ex: 11999999999)"
              required
              className={styles.popupInput}
            />
            <button type="submit" className={styles.popupButton}>Enviar</button>
          </form>
          <button onClick={() => setIsOpen(false)} className={styles.popupClose}>×</button>
        </motion.div>
      </motion.div>
    </div>
  );
}