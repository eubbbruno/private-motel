"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FaCoffee, FaUtensils, FaMugHot, FaRegClock, FaExclamationCircle } from 'react-icons/fa';
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

  const mealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' } },
  };

  const disclaimerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: 'easeOut' } },
  };

  const refeicoes = [
    {
      icon: <FaCoffee className={styles.mealIcon} />,
      title: 'Café da Manhã',
      horario: 'Servido das 6h às 10h30',
      cardapio: [
        'Misto quente',
        'Ovos mexidos',
        'Frutas',
        'Bolinho',
        'Suco de laranja',
        'Café',
        'Leite'
      ]
    },
    {
      icon: <FaUtensils className={styles.mealIcon} />,
      title: 'Almoço Executivo',
      horario: 'Servido das 11h30 às 14h (exceto suíte bronze)',
      cardapio: [
        'Contra filé, arroz, fritas, salada verde ou caesar',
        'Bife à milanesa, arroz, fritas, salada verde ou caeser',
        'Peito de frango grelhado, arroz, fritas, salada verde ou caeser',
        'Filé de frango à milanesa, arroz, fritas, salada verde ou caeser',
        'Fetuccine ao molho branco, bacon, champignon, salada verde ou caesar'
      ]
    },
    {
      icon: <FaMugHot className={styles.mealIcon} />,
      title: 'Chá da Tarde',
      horario: 'Servido das 16h às 19h',
      cardapio: [
        'Pães',
        'Salgadinhos',
        'Bolinhos',
        'Manteiga',
        'Geleia',
        'Chá',
        'Suco de laranja'
      ]
    }
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
            Refeições Gratuitas
          </motion.h1>
          
          <motion.p
            className={styles.sectionDescription}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Refeições por conta da casa, para tornar seu momento ainda mais especial.
          </motion.p>
          
          <motion.div
            className={styles.mealsContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={mealVariants}
          >
            {refeicoes.map((refeicao, index) => (
              <div className={styles.mealCard} key={index}>
                <div className={styles.mealHeader}>
                  {refeicao.icon}
                  <h2 className={styles.mealTitle}>{refeicao.title}</h2>
                </div>
                <div className={styles.mealTime}>
                  <FaRegClock className={styles.clockIcon} />
                  <span>{refeicao.horario}</span>
                </div>
                <div className={styles.mealMenu}>
                  <h3 className={styles.menuTitle}>Cardápio:</h3>
                  <ul className={styles.menuItems}>
                    {refeicao.cardapio.map((item, i) => (
                      <li key={i} className={styles.menuItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            className={styles.disclaimer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={disclaimerVariants}
          >
            <FaExclamationCircle className={styles.disclaimerIcon} />
            <p className={styles.disclaimerText}>
              Em relação às refeições gratuitas e promoções, somente é permitido uma (1) por período, assim sendo não cumulativas.
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}