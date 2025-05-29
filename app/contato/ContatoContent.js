"use client";

import { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaInstagram, FaStar } from 'react-icons/fa';
import styles from '../../src/styles/ContatoPage.module.css';
import FormularioContato from '../../src/components/FormularioContato';

export default function ContatoContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  const infoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' } },
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
          <motion.p
            className={styles.sectionDescription}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Estamos aqui para ajudar! Envie sua mensagem ou entre em contato diretamente.
          </motion.p>

          <motion.div 
            className={styles.textBlock}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            <p>
              O Private Motel é um espaço exclusivo para você aproveitar momentos especiais com muito conforto e privacidade. 
              Estamos sempre à disposição para atender suas necessidades, tirar dúvidas e receber sugestões. 
              Entre em contato através do nosso formulário ou pelos canais de atendimento disponíveis. 
              Ficaremos felizes em proporcionar a melhor experiência para você!
            </p>
          </motion.div>

          <div className={styles.contactGrid}>
            <motion.div
              className={styles.formContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={formVariants}
            >
              <FormularioContato />
            </motion.div>

            <motion.div
              className={styles.infoContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={infoVariants}
            >
              <h2 className={styles.infoTitle}>Informações de Contato</h2>
              
              <div className={styles.infoItem}>
                <FaMapMarkerAlt className={styles.infoIcon} />
                <p className={styles.infoText}>
                  R. Adelino Bianchini, 86 - Chacara Manella<br />
                  Cambé - PR, 86186-019
                </p>
              </div>

              <div className={styles.infoItem}>
                <FaPhone className={styles.infoIcon} />
                <p className={styles.infoText}>
                  Celular: (43) 99993-6839<br />
                  Fixo: (43) 3174-6600
                </p>
              </div>

              <div className={styles.infoItem}>
                <FaEnvelope className={styles.infoIcon} />
                <p className={styles.infoText}>
                  contato@privatemotel.com.br
                </p>
              </div>

              <div className={styles.infoItem}>
                <FaClock className={styles.infoIcon} />
                <p className={styles.infoText}>
                  Atendimento 24 horas<br />
                  Cozinha e hospedagem todos os dias
                </p>
              </div>

              <div className={styles.infoItem}>
                <FaInstagram className={styles.infoIcon} />
                <p className={styles.infoText}>
                  <a href="https://instagram.com/private_motel" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    @private_motel
                  </a>
                </p>
              </div>

              <div className={styles.infoItem}>
                <FaStar className={styles.infoIcon} />
                <p className={styles.infoText}>
                  <a href="https://g.page/r/CVGRfyW8ecVjEAE/review" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    Avalie-nos no Google
                  </a>
                </p>
              </div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.5196842119467!2d-51.2332569!3d-23.2968962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eb5bb26dcd5f2d%3A0x63c579bc257f9151!2sMotel%20Private!5e0!3m2!1spt-BR!2sbr!4v1744397660961!5m2!1spt-BR!2sbr"
                className={styles.map}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}