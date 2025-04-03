'use client';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from './ExperienciasSection.module.css';

export default function ExperienciasSection() {
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
      title: 'Jantar Romântico',
      description: 'Uma noite inesquecível com menu exclusivo e decoração personalizada.',
      cta: 'Reserve Agora',
    },
    {
      title: 'Decoração Romântica',
      description: 'Hospedagem romântica com pétalas de rosas, arranjo de rosas, frisante, chocolates e frutas da estação.',
      cta: 'Reserve Agora',
    },
    {
      title: 'Gift Card',
      description: 'Presenteie alguém especial com um vale para uma estadia luxuosa.',
      cta: 'Compre Agora',
    },
  ];

  return (
    <section className={styles.section} ref={ref}>
      <motion.div
        className={styles.sectionDivider}
        initial={{ width: 0 }}
        animate={inView ? { width: '100%' } : { width: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <motion.h2
        className={styles.sectionTitle}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        Experiências Únicas
      </motion.h2>
      <motion.div
        className={styles.gridContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={gridVariants}
      >
        {experiencias.map((exp, index) => (
          <motion.div
            key={index}
            className={styles.card}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h3 className={styles.cardTitle}>{exp.title}</h3>
            <p className={styles.cardDescription}>{exp.description}</p>
            <Link href="/reservas" className={styles.cta}>{exp.cta}</Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}