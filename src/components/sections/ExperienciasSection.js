'use client';
import Link from 'next/link';
import Image from 'next/image';
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

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: 'easeOut' } },
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  const disclaimerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8, ease: 'easeOut' } },
  };

  const experiencias = [
    {
      title: 'Decoração Romântica',
      description: 'Hospedagem romântica com pétalas de rosas, arranjo de rosas, frisante, chocolates e tábua de frios.',
      cta: 'Reserve Agora',
      image: '/images/exp-decoracao-romantica.jpg',
    },
    {
      title: 'Gift Card',
      description: 'Presenteie alguém especial com um vale para uma estadia luxuosa.',
      cta: 'Compre Agora',
      image: '/images/exp-gift-card.jpg',
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
      
      <motion.p
        className={styles.sectionSubtitle}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={subtitleVariants}
      >
        Transforme momentos especiais em histórias que merecem ser vividas.
      </motion.p>
      
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
            <div className={styles.imageContainer}>
              <Image 
                src={exp.image}
                alt={exp.title}
                width={500}
                height={300}
                className={styles.cardImage}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={index === 0}
              />
            </div>
            <h3 className={styles.cardTitle}>{exp.title}</h3>
            <p className={styles.cardDescription}>{exp.description}</p>
            <Link 
              href="https://wa.me/5543999936839" 
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              {exp.cta}
            </Link>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.p
        className={styles.disclaimer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={disclaimerVariants}
      >
        *Imagens meramente ilustrativas. A disponibilidade dos serviços está sujeita à confirmação prévia.
      </motion.p>
    </section>
  );
}