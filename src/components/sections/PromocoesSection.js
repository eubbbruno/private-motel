'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from './PromocoesSection.module.css';

export default function PromocoesSection() {
  const [expanded, setExpanded] = useState(null);

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

  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.6, ease: 'easeOut' } },
  };

  const promocoes = [
    {
      title: 'Junte Selinhos',
      description: '5 selos = 20% OFF ou cortesia.',
      image: '/images/promo-selinhos.jpg',
    },
    {
      title: 'Marque no Story',
      description: 'Poste e ganhe 10% OFF.',
      image: '/images/promo-story.jpg',
    },
    {
      title: 'Recém-Casados',
      description: '15% OFF + decoração grátis.',
      image: '/images/promo-recem-casados.jpg',
    },
    {
      title: 'Aniversariantes',
      description: '10% OFF + frisante grátis.',
      image: '/images/promo-aniversariantes.jpg',
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
        Promoções Especiais
      </motion.h2>
      <motion.p
        className={styles.sectionText}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={textVariants}
      >
        Aproveite nossas ofertas exclusivas e viva experiências ainda mais incríveis!
      </motion.p>
      <motion.div
        className={styles.promocoesGrid}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={gridVariants}
      >
        {promocoes.map((promocao, index) => (
          <motion.div
            key={index}
            className={`${styles.promocaoCard} ${expanded === index ? styles.expanded : ''}`}
            onClick={() => setExpanded(expanded === index ? null : index)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className={styles.promocaoFront}>
              <img src={promocao.image} alt={promocao.title} className={styles.promocaoImage} />
              <div className={styles.promocaoOverlay}></div>
              <h3 className={styles.promocaoTitle}>{promocao.title}</h3>
              <p className={styles.promocaoDescription}>{promocao.description}</p>
            </div>
            <div className={styles.promocaoBack}>
              <p className={styles.promocaoDescription}>{promocao.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={ctaVariants}
      >
        <Link href="/reservas" className={styles.cta}>Aproveite as Ofertas</Link>
      </motion.div>
    </section>
  );
}