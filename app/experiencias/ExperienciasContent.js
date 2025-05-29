"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FaGift, FaHeart, FaUtensils, FaStar, FaBirthdayCake, FaUserTie, FaArchive, FaCamera, FaWhatsapp } from 'react-icons/fa';
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

  const cardsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' } },
  };

  const disclaimerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: 'easeOut' } },
  };

  const handleWhatsAppContact = (message) => {
    const phoneNumber = "5543999936839";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const experiencias = [
    {
      icon: <FaHeart className={styles.expIcon} />,
      title: 'Decoração Romântica',
      description: 'Hospedagem romântica com pétalas de rosas, arranjo de rosas, frisante, chocolates e frutas da estação. Perfeito para comemorações de aniversário de namoro e ocasiões especiais.',
      details: [
        'Pétalas de rosas espalhadas na cama e suíte',
        'Arranjo de flores',
        'Frisante ou espumante',
        'Chocolates variados',
        'Tábua de Frios'
      ],
      image: '/images/exp-decoracao-romantica.jpg',
      message: 'Olá! Gostaria de mais informações sobre a Decoração Romântica. Poderia me informar disponibilidade e preços?'
    },
    {
      icon: <FaGift className={styles.expIcon} />,
      title: 'Gift Card',
      description: 'Presenteie alguém especial com um vale para uma estadia luxuosa. Um presente inesquecível para aniversários, Dia dos Namorados, ou qualquer ocasião especial.',
      details: [
        'Cartão-presente personalizado',
        'Validade de 3 meses',
        'Valor escolhido pelo comprador',
        'Possibilidade de adicionar serviços extras',
        'Entrega digital ou física'
      ],
      image: '/images/exp-gift-card.jpg',
      message: 'Olá! Gostaria de mais informações sobre o Gift Card. Como posso adquirir e quais são as opções disponíveis?'
    }
  ];

  const promocoes = [
    {
      icon: <FaBirthdayCake className={styles.promoIcon} />,
      title: 'Aniversariantes',
      description: '10% de desconto na suíte.',
      image: '/images/promo-aniversariantes.jpg',
      message: 'Olá! Gostaria de mais informações sobre a promoção para Aniversariantes.'
    },
    {
      icon: <FaUserTie className={styles.promoIcon} />,
      title: 'Recém-Casados',
      description: '15% de desconto na suíte.',
      image: '/images/promo-recem-casados.jpg',
      message: 'Olá! Gostaria de mais informações sobre a promoção para Recém-Casados.'
    },
    {
      icon: <FaArchive className={styles.promoIcon} />,
      title: 'Junte Selinhos',
      description: '10 selos = período grátis!',
      image: '/images/promo-selinhos.jpg',
      message: 'Olá! Gostaria de mais informações sobre o programa de fidelidade "Junte Selinhos".'
    },
    {
      icon: <FaCamera className={styles.promoIcon} />,
      title: 'Marque no Story',
      description: 'Poste e ganhe 10% OFF.',
      image: '/images/promo-story.jpg',
      message: 'Olá! Gostaria de mais informações sobre a promoção "Marque no Story".'
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
          
          {/* Seção de Experiências Especiais */}
          <motion.h1
            className={styles.sectionTitle}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Experiências Exclusivas
          </motion.h1>
          
          <motion.p
            className={styles.sectionDescription}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Torne sua estadia ainda mais especial com nossas experiências cuidadosamente elaboradas
          </motion.p>
          
          <motion.div
            className={styles.experienciasContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={cardsVariants}
          >
            {experiencias.map((exp, index) => (
              <motion.div
                key={index}
                className={styles.expCard}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={styles.expImageContainer}>
                  <Image 
                    src={exp.image}
                    alt={exp.title}
                    width={400}
                    height={250}
                    className={styles.expImage}
                  />
                  <div className={styles.expImageOverlay}></div>
                </div>
                
                <div className={styles.expContent}>
                  <div className={styles.expHeader}>
                    {exp.icon}
                    <h2 className={styles.expTitle}>{exp.title}</h2>
                  </div>
                  
                  <p className={styles.expDescription}>{exp.description}</p>
                  
                  <div className={styles.expDetails}>
                    <h3 className={styles.expDetailsTitle}>Inclui:</h3>
                    <ul className={styles.expDetailsList}>
                      {exp.details.map((detail, i) => (
                        <li key={i} className={styles.expDetailItem}>
                          <FaStar className={styles.expDetailIcon} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    className={styles.expCta}
                    onClick={() => handleWhatsAppContact(exp.message)}
                  >
                    <FaWhatsapp className={styles.whatsappIcon} />
                    Solicitar Informações
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.h1
            className={`${styles.sectionTitle} ${styles.secondTitle}`}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Promoções Especiais
          </motion.h1>
          
          <motion.p
            className={styles.sectionDescription}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Aproveite nossas ofertas exclusivas e economize em sua próxima visita
          </motion.p>
          
          <motion.div
            className={styles.promocoesContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={gridVariants}
          >
            {promocoes.map((promo, index) => (
              <motion.div
                key={index}
                className={styles.promoCard}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={styles.promoImageWrapper}>
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    width={500}
                    height={900}
                    className={styles.promoImage}
                  />
                  <div className={styles.promoOverlay}></div>
                </div>
                
                <div className={styles.promoContent}>
                  <div className={styles.promoHeader}>
                    {promo.icon}
                    <h2 className={styles.promoTitle}>{promo.title}</h2>
                  </div>
                  <p className={styles.promoDescription}>{promo.description}</p>
                  <button 
                    className={styles.promoCta}
                    onClick={() => handleWhatsAppContact(promo.message)}
                  >
                    <FaWhatsapp className={styles.whatsappIcon} />
                    Mais Informações
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className={styles.disclaimer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={disclaimerVariants}
          >
            <p className={styles.disclaimerText}>
              * As promoções não são cumulativas. Consulte disponibilidade e condições específicas para cada promoção e experiência.
              Imagens meramente ilustrativas. Preços sujeitos a alterações sem aviso prévio.
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}