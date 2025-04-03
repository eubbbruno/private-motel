'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from './GaleriaSuitesSection.module.css';

export default function GaleriaSuitesSection() {
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

  const suites = [
    {
      title: 'Suíte Private',
      image: '/images/suite-private.jpg',
      description: 'Luxo em dois pisos com piscina aquecida.',
      size: 'Dois Pisos',
      amenities: {
        inferior: ['Piscina Aquecida', 'Sauna', 'Hidromassagem'],
        superior: ['Bar', 'TV LED 32"', '2 Garagens'],
      },
      pricing: {
        periodo: 'R$ 355,00',
        pernoite: 'R$ 407,00',
        horaExtra: 'R$ 65,00',
      },
      keywords: ['Piscina Aquecida', 'Sauna', 'Hidromassagem', 'Bar', 'TV LED', '2 Garagens'],
    },
    {
      title: 'Suíte Diamante Luxo',
      image: '/images/suite-diamante-luxo.jpg',
      description: 'Elegância com piscina e hidromassagem.',
      size: '70m²',
      amenities: {
        geral: ['Piscina', 'Sauna', 'Minibar'],
      },
      pricing: {
        periodo: 'R$ 299,00',
        pernoiteSemana: 'R$ 320,00',
        pernoiteFimSemana: 'R$ 350,00',
        horaExtra: 'R$ 59,00',
      },
      keywords: ['Cama Super King', 'Ducha', 'Sauna', 'Ar Condicionado', 'Piscina Aquecida', 'Hidromassagem', 'Frigobar', 'TV LED 32"', '2 Garagens'],
    },
    {
      title: 'Suíte Prata',
      image: '/images/suite-prata.jpg',
      description: 'Conforto com hidromassagem.',
      size: '50m²',
      amenities: {
        geral: ['Hidromassagem', 'Frigobar', 'TV LED'],
      },
      pricing: {
        periodo: 'R$ 155,00',
        pernoiteSemana: 'R$ 208,00',
        pernoiteFimSemana: 'R$ 235,00',
        horaExtra: 'R$ 48,00',
      },
      keywords: ['Cama Super King', 'Ducha', 'Ar Condicionado', 'Hidromassagem', 'Frigobar', 'TV LED 32"', '1 Garagem'],
    },
    {
      title: 'Suíte Bronze',
      image: '/images/suite-bronze.jpg',
      description: 'Simplicidade e conforto.',
      size: '40m²',
      amenities: {
        geral: ['Frigobar', 'TV LED', 'Ducha'],
      },
      pricing: {
        periodo: 'R$ 125,00',
        pernoiteSemana: 'R$ 175,00',
        pernoiteFimSemana: 'R$ 203,00',
        horaExtra: 'R$ 35,00',
      },
      keywords: ['Cama Super King', 'Ducha', 'Ar Condicionado', 'Frigobar', 'TV LED 32"', '1 Garagem'],
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
        Nossas Suítes
      </motion.h2>
      <motion.div
        className={styles.gridContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={gridVariants}
      >
        {suites.map((suite, index) => (
          <motion.div
            key={index}
            className={styles.card}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={suite.image}
                alt={suite.title}
                layout="fill"
                objectFit="cover"
                className={styles.cardImage}
              />
              <div className={styles.cardOverlay}></div>
              <div className={styles.priceTag}>
                <span className={styles.priceTagText}>{suite.pricing.periodo}</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{suite.title}</h3>
              <div className={styles.keywords}>
                {suite.keywords.map((keyword, i) => (
                  <span key={i} className={styles.keyword}>{keyword}</span>
                ))}
              </div>
              <Link href="/reservas" className={styles.cardCta}>Reservar</Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}