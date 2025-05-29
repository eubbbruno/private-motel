"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/SobreNosPage.module.css';

// Log para debugging
console.log('Página Sobre Nós carregada (App Router)');

export default function SobreNosContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

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
            Sobre o Private Motel
          </motion.h1>
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            <p className={styles.sectionText}>
              O Private Motel 5 Estrelas foi fundado com a missão de oferecer uma experiência única para casais em Londrina e Cambé. Desde nossa inauguração, temos nos dedicado a proporcionar suítes exclusivas, gastronomia de alta qualidade e serviços personalizados que transformam cada estadia em um momento inesquecível.
            </p>
            <p className={styles.sectionText}>
              Nossa equipe está comprometida em garantir que cada detalhe da sua visita seja perfeito, desde a reserva online até o check-out. Com suítes equipadas com piscinas aquecidas, hidromassagens e saunas privativas, o Private Motel é o destino ideal para quem busca conforto, privacidade e romantismo.
            </p>
            <p className={styles.sectionText}>
              Localizado estrategicamente entre Londrina e Cambé, somos a escolha preferida de casais que desejam celebrar momentos especiais. Venha nos conhecer e descubra por que somos o melhor motel da região!
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}