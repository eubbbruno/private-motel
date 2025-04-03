'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './RefeicoesSection.module.css';

export default function RefeicoesSection() {
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

  const swiperVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
  };

  const noteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.6, ease: 'easeOut' } },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8, ease: 'easeOut' } },
  };

  const refeicoes = [
    {
      title: 'Café da Manhã (6h - 10h30)',
      subtitle: 'Misto quente, ovos mexidos, frutas, bolinho, suco de laranja, café, leite.',
      image: '/images/cafe-manha.jpg',
    },
    {
      title: 'Almoço Executivo (11h30 - 14h)',
      subtitle: 'Contra filé, bife à milanesa, frango grelhado ou fettuccine. Acompanha arroz, fritas e salada.',
      image: '/images/almoco-executivo.jpg',
    },
    {
      title: 'Chá da Tarde (16h - 19h)',
      subtitle: 'Pães, salgadinhos, bolinhos, manteiga, geleia, chá e suco.',
      image: '/images/cha-tarde.jpg',
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
        Refeições Gratuitas
      </motion.h2>
      <motion.p
        className={styles.sectionText}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={textVariants}
      >
        Desfrute de refeições deliciosas que complementam sua estadia com conforto e sabor.
      </motion.p>
      <motion.div
        className={styles.refeicoesSwiper}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={swiperVariants}
      >
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation
          loop={true}
        >
          {refeicoes.map((refeicao, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className={styles.refeicaoCard}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Image
                  src={refeicao.image}
                  alt={refeicao.title}
                  layout="fill"
                  objectFit="cover"
                  className={styles.cardImage}
                />
                <div className={styles.cardOverlay}></div>
                <div className={styles.cardContent}>
                  <h3 className={styles.refeicaoTitle}>{refeicao.title}</h3>
                  <p className={styles.refeicaoSubtitle}>{refeicao.subtitle}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
      <motion.p
        className={styles.note}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={noteVariants}
      >
        *Apenas uma refeição por período, não cumulativas.
      </motion.p>
      <motion.p
        className={styles.disclaimer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={noteVariants}
      >
        Imagens meramente ilustrativas.
      </motion.p>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={ctaVariants}
      >
        <Link href="/refeicoes" className={styles.ctaSmall}>Saiba Mais</Link>
      </motion.div>
    </section>
  );
}