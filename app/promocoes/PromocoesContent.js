"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/PromocoesPage.module.css';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

const promocoes = [
  {
    id: 1,
    titulo: 'Pacote Romântico',
    descricao: 'Suite luxuosa com hidromassagem, champanhe e decoração especial para casais.',
    imagem: '/images/suite-private-6.jpg',
    preco: 'R$ 299,90'
  },
  {
    id: 2,
    titulo: 'Pacote Aniversário',
    descricao: 'Celebre seu dia especial com nossa suite premium, bolo personalizado e decoração festiva.',
    imagem: '/images/suite-diamante-luxo-7.jpg',
    preco: 'R$ 349,90'
  },
  {
    id: 3,
    titulo: 'Pacote Relax',
    descricao: 'Suite com spa privativo, massagem a quatro mãos e jantar romântico incluso.',
    imagem: '/images/suite-prata-3.jpg',
    preco: 'R$ 399,90'
  }
];

export default function PromocoesContent() {
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

  const handleWhatsAppReservation = (pacote) => {
    const phoneNumber = "5543999936839";
    const message = encodeURIComponent(`Olá! Gostaria de reservar o ${pacote} do Private Motel. Poderia me passar mais informações?`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

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
            Promoções Especiais
          </motion.h1>
          <motion.p
            className={styles.sectionText}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Aproveite nossos pacotes exclusivos com condições especiais. 
            Cada pacote foi cuidadosamente elaborado para proporcionar momentos únicos e memoráveis.
          </motion.p>
          <motion.div
            className={styles.gridContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={gridVariants}
          >
            {promocoes.map((promocao) => (
              <motion.div
                key={promocao.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={promocao.imagem}
                    alt={promocao.titulo}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.content}>
                  <h2 className={styles.cardTitle}>{promocao.titulo}</h2>
                  <p className={styles.cardDescription}>{promocao.descricao}</p>
                  <p className={styles.preco}>{promocao.preco}</p>
                  <button 
                    onClick={() => handleWhatsAppReservation(promocao.titulo)}
                    className={styles.link}
                  >
                    <FaWhatsapp style={{ marginRight: '8px' }} /> Reservar Agora
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.p
            className={styles.disclaimer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            *As promoções não são cumulativas. Consulte nossos atendentes para mais informações.
          </motion.p>
        </section>
      </main>
      <Footer />
    </div>
  );
} 