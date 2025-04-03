'use client';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from './MotorReservaSection.module.css';

export default function MotorReservaSection() {
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

  const ctaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
  };

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
        Reserve Online com Facilidade
      </motion.h2>
      <motion.p
        className={styles.sectionText}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={textVariants}
      >
        Com nosso novo motor de reservas online, você pode garantir sua suíte em poucos cliques. Escolha a data, selecione sua suíte preferida e personalize sua experiência, tudo de forma rápida e segura.
      </motion.p>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={ctaVariants}
      >
        <Link href="/reservas" className={styles.cta}>Reserve Agora</Link>
      </motion.div>
    </section>
  );
}