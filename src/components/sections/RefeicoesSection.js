'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './RefeicoesSection.module.css';

const RefeicoesSection = () => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [textRef, textInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [gridRef, gridInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const refeicoes = [
    {
      id: 1,
      title: 'Café da Manhã',
      subtitle: 'Misto quente, ovos mexidos, frutas, bolinho, suco de laranja, café e leite',
      image: '/images/cafe-manha.jpg',
    },
    {
      id: 2,
      title: 'Almoço Executivo',
      subtitle: 'Contra file, bife à milanesa, peito de frango, filé de frango à milanesa ou fetuccine',
      image: '/images/almoco-executivo.jpg',
    },
    {
      id: 3,
      title: 'Chá da Tarde',
      subtitle: 'Pães, salgadinhos, bolinhos, manteiga, geleia, chá e suco de laranja',
      image: '/images/cha-tarde.jpg',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className={styles.section}
      id="refeicoes"
    >
      <motion.div 
        className={styles.sectionDivider}
        initial={{ width: 0 }}
        animate={sectionInView ? { width: '100%' } : { width: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      
      <motion.h2 
        ref={titleRef}
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        Refeições Gratuitas
      </motion.h2>
      
      <motion.p 
        ref={textRef}
        className={styles.sectionText}
        initial={{ opacity: 0, y: 20 }}
        animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      >
        Reforce sua experiência com refeições gratuitas e irresistíveis.
      </motion.p>
      
      <motion.div 
        ref={gridRef}
        className={styles.refeicoesGrid}
        initial={{ opacity: 0, y: 30 }}
        animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
        {refeicoes.map((refeicao) => (
          <div key={refeicao.id} className={styles.refeicaoCard}>
            <div 
              className={styles.cardImage} 
              style={{ backgroundImage: `url(${refeicao.image})` }}
            />
            <div className={styles.cardOverlay} />
            <div className={styles.cardContent}>
              <h3 className={styles.refeicaoTitle}>{refeicao.title}</h3>
              <p className={styles.refeicaoSubtitle}>{refeicao.subtitle}</p>
            </div>
          </div>
        ))}
      </motion.div>
      
      <p className={styles.disclaimer}>
        * As refeições não são cumulativas e devem ser solicitadas com antecedência. 
        Imagens meramente ilustrativas.
      </p>
      
      <div className={styles.ctaContainer}>
        <Link href="/cortesias" className={styles.ctaSmall}>
          Saiba Mais
        </Link>
      </div>
    </section>
  );
};

export default RefeicoesSection;