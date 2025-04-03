"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/EstruturaPage.module.css';

export default function EstruturaContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  const estrutura = [
    {
      title: 'Suítes de Luxo',
      image: '/images/estrutura-suites-luxo.jpg',
      description: 'Suítes equipadas com piscinas aquecidas, hidromassagens e saunas privativas.',
    },
    {
      title: 'Gastronomia',
      image: '/images/estrutura-gastronomia.jpg',
      description: 'Restaurante interno com menu variado e serviço de quarto 24 horas.',
    },
    {
      title: 'Área de Lazer',
      image: '/images/estrutura-area-lazer.jpg',
      description: 'Espaço para relaxamento com áreas comuns e decoração sofisticada.',
    },
    {
      title: 'Estacionamento Privativo',
      image: '/images/estrutura-estacionamento.jpg',
      description: 'Garagens privativas para até 2 veículos por suíte, garantindo total discrição.',
    },
  ];

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
            Nossa Estrutura
          </motion.h1>
          <motion.div
            className={styles.gridContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={gridVariants}
          >
            {estrutura.map((item, index) => (
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardOverlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}