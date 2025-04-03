"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/CortesiasPage.module.css';

export default function CortesiasContent() {
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

  const promocoes = [
    {
      title: 'Aniversariantes',
      image: '/images/promo-aniversariantes.jpg',
      description: 'Comemore seu aniversário com 10% de desconto na suíte e um brinde especial.',
    },
    {
      title: 'Recém-Casados',
      image: '/images/promo-recem-casados.jpg',
      description: 'Pacote especial para recém-casados com decoração romântica e espumante de cortesia.',
    },
    {
      title: 'Selinhos',
      image: '/images/promo-selinhos.jpg',
      description: 'Junte 5 selinhos e ganhe uma diária grátis na suíte de sua escolha.',
    },
    {
      title: 'Story',
      image: '/images/promo-story.jpg',
      description: 'Publique um story marcando o motel e ganhe 5% de desconto na próxima visita.',
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
            Nossas Cortesias
          </motion.h1>
          <motion.div
            className={styles.gridContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={gridVariants}
          >
            {promocoes.map((promo, index) => (
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardOverlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{promo.title}</h2>
                  <p className={styles.cardDescription}>{promo.description}</p>
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