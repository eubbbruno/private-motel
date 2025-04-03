"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/ExperienciasPage.module.css';

export default function ExperienciasContent() {
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

  const experiencias = [
    {
      title: 'Noite Romântica',
      image: '/images/experiencia-noite-romantica.jpg',
      description: 'Um pacote especial com decoração romântica, espumante e jantar à luz de velas.',
    },
    {
      title: 'Spa a Dois',
      image: '/images/experiencia-spa-a-dois.jpg',
      description: 'Relaxe com uma sessão de massagem para casais e acesso à sauna privativa.',
    },
    {
      title: 'Jantar Temático',
      image: '/images/experiencia-jantar-tematico.jpg',
      description: 'Desfrute de um jantar temático com menu personalizado na suíte.',
    },
    {
      title: 'Escapada de Fim de Semana',
      image: '/images/experiencia-escapada-fim-de-semana.jpg',
      description: 'Um fim de semana inesquecível com café da manhã e late checkout.',
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
            Nossas Experiências
          </motion.h1>
          <motion.div
            className={styles.gridContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={gridVariants}
          >
            {experiencias.map((experiencia, index) => (
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={experiencia.image}
                    alt={experiencia.title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardOverlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{experiencia.title}</h2>
                  <p className={styles.cardDescription}>{experiencia.description}</p>
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