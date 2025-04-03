"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import styles from '../../src/styles/ContatoPage.module.css';

export default function ContatoContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

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
            Entre em Contato
          </motion.h1>
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
            className={styles.contactContainer}
          >
            <div className={styles.contactInfo}>
              <h2 className={styles.infoTitle}>Informações de Contato</h2>
              <p className={styles.infoText}>
                <FaPhone /> (43) 3174-6600
              </p>
              <p className={styles.infoText}>
                <FaWhatsapp /> (43) 9 9993-6839
              </p>
              <p className={styles.infoText}>
                <FaEnvelope /> contato@privatemotel.com.br
              </p>
              <p className={styles.infoText}>
                <FaMapMarkerAlt /> Localizado entre Londrina e Cambé - Veja no mapa
              </p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.5196842119467!2d-51.2332569!3d-23.2968962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eb5bb26dcd5f2d%3A0x63c579bc257f9151!2sMotel%20Private!5e0!3m2!1spt-BR!2sbr!4v1742293541938!5m2!1spt-BR!2sbr"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className={styles.mapIframe}
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>Envie sua Mensagem</h2>
              {submitted ? (
                <p className={styles.successMessage}>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu Nome"
                    required
                    className={styles.formInput}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Seu E-mail"
                    required
                    className={styles.formInput}
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Sua Mensagem"
                    required
                    className={styles.formTextarea}
                  />
                  <button type="submit" className={styles.formButton}>Enviar</button>
                </form>
              )}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}