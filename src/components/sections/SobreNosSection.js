'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from './SobreNosSection.module.css';

export default function SobreNosSection() {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  const videoVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
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
        <span>Sobre</span> Nós
      </motion.h2>
      <motion.div
        className={styles.sobreNosContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div
          className={styles.sobreNosText}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variants={textVariants}
        >
          <p className={styles.sectionText}>
            Descubra o Private Motel 5 Estrelas, onde o luxo encontra a intimidade. Nossas suítes exclusivas, equipadas com hidromassagens, saunas privativas e piscinas aquecidas, são perfeitas para momentos inesquecíveis. Desfrute de um atendimento 24 horas e cortesias que tornam cada visita única.
          </p>
          <Link href="/sobre" className={styles.cta}>Conheça Mais</Link>
        </motion.div>
        <motion.div
  className={styles.videoShowcase}
  variants={videoVariants}
>
  <iframe
    className={styles.videoFrame}
    src="https://www.youtube.com/embed/vS1PJ0DaHjY?autoplay=1&mute=1&loop=1&playlist=vS1PJ0DaHjY&controls=0&playsinline=1&rel=0"
    title="Private Motel Vídeo"
    frameBorder="0"
    allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
  <div className={styles.glowFrame}></div>
</motion.div>
      </motion.div>
    </section>
  );
}