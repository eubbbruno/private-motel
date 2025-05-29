"use client";

import { useState, useEffect } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from '../../src/styles/EstruturaPage.module.css';
import EstruturaMobileView from '../../src/components/EstruturaMobileView';

export default function EstruturaContent() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar se é um dispositivo móvel com base na largura da tela
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Verificar inicialmente
    checkIfMobile();
    
    // Adicionar listener para quando a tela for redimensionada
    window.addEventListener('resize', checkIfMobile);
    
    // Remover listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
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

  const galleryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
  };

  const textos = [
    {
      title: 'Nossa Estrutura',
      description: 'O Private Motel 5 Estrelas foi projetado para proporcionar o máximo de conforto e privacidade. Nossas instalações incluem suítes luxuosas equipadas com piscinas aquecidas, hidromassagens, saunas privativas e decoração sofisticada, garantindo uma experiência única e inesquecível. Com ambientes climatizados e garagens privativas para até 2 veículos por suíte, nossos hóspedes desfrutam de discrição e segurança em todos os momentos.'
    },
    {
      title: 'Lavanderia Própria',
      description: 'Contamos com uma lavanderia própria de última geração, operando 24 horas por dia para garantir a higienização impecável de todos os enxovais. Utilizamos produtos de alta qualidade e processos rigorosos de lavagem e esterilização, assegurando roupas de cama e banho sempre limpas, macias e perfumadas. Nossa equipe especializada cuida de cada detalhe para proporcionar o máximo de conforto e bem-estar durante sua estadia.'
    },
    {
      title: 'Cozinha 24 Horas',
      description: 'Nossa cozinha funciona 24 horas por dia, oferecendo um menu variado de opções gastronômicas para todos os gostos. Dos pratos mais simples às experiências culinárias mais sofisticadas, nossa equipe de chefs está sempre pronta para atender seus desejos. O serviço de quarto é ágil e discreto, permitindo que você desfrute de refeições deliciosas na privacidade da sua suíte, a qualquer hora do dia ou da noite.'
    }
  ];

  const galleryImages = [
    {
      src: '/images/IMG_0143.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0148-Edit.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0367_8_9.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0370_1_2.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0373_4_5.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0376_7_8.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0379_80_81.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0386_7_8.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0389_90_91.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0392_3_4.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0395_6_7.jpg',
      alt: 'Estrutura do Private Motel'
    },
    {
      src: '/images/IMG_0398_399_400.jpg',
      alt: 'Estrutura do Private Motel'
    }
  ];

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) {
      newIndex = galleryImages.length - 1;
    } else if (newIndex >= galleryImages.length) {
      newIndex = 0;
    }
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  // Se for um dispositivo móvel, renderizar o componente móvel específico
  if (isMobile) {
    return (
      <>
        <Header />
        <EstruturaMobileView textos={textos} galleryImages={galleryImages} />
        <Footer />
      </>
    );
  }

  // Caso contrário, renderizar a versão desktop
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
            Nossa Estrutura
          </motion.h1>
          <motion.p
            className={styles.sectionDescription}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Conheça nossas instalações modernas e sofisticadas, projetadas para proporcionar uma experiência única de conforto e privacidade.
          </motion.p>

          <div className={styles.textBlocks}>
            {textos.map((item, index) => (
              <motion.div
                key={index}
                className={styles.textBlock}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={textVariants}
                custom={index}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <h2 className={styles.textBlockTitle}>{item.title}</h2>
                <p className={styles.textBlockDescription}>{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.h2
            className={styles.galleryTitle}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Galeria de Imagens
          </motion.h2>

          <motion.div
            className={styles.gallery}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={galleryVariants}
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className={styles.galleryItem}
                onClick={() => openModal(image, index)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                  className={styles.galleryImage}
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />

      {selectedImage && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className={styles.modalImage}
              style={{ objectFit: 'contain' }}
            />
            <button className={styles.closeButton} onClick={closeModal}>
              <FaTimes />
            </button>
            <button className={`${styles.navigationButton} ${styles.prevButton}`} onClick={() => navigateImage(-1)}>
              <FaArrowLeft />
            </button>
            <button className={`${styles.navigationButton} ${styles.nextButton}`} onClick={() => navigateImage(1)}>
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}