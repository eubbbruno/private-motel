"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '../../src/styles/SuitesPage.module.css';

export default function SuitesContent() {
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
      images: [
        '/images/suite-private-1.jpg',
        '/images/suite-private-2.jpg',
        '/images/suite-private-3.jpg',
        '/images/suite-private-4.jpg',
        '/images/suite-private-5.jpg',
        '/images/suite-private-6.jpg',
        '/images/suite-private-7.jpg',
        '/images/suite-private-8.jpg',
        '/images/suite-private-9.jpg',
        '/images/suite-private-10.jpg',
        '/images/suite-private-11.jpg',
        '/images/suite-private-12.jpg',
        '/images/suite-private-13.jpg',
        '/images/suite-private-14.jpg',
        '/images/suite-private-15.jpg',
        '/images/suite-private-16.jpg',
        '/images/suite-private-17.jpg',
        '/images/suite-private-18.jpg',
      ],
      description: 'A Suíte Private oferece uma experiência de luxo em dois pisos, ideal para casais que buscam exclusividade. Com uma piscina aquecida privativa e uma sauna, é perfeita para momentos inesquecíveis.',
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
      images: [
        '/images/suite-diamante-luxo-1.jpg',
        '/images/suite-diamante-luxo-2.jpg',
        '/images/suite-diamante-luxo-3.jpg',
        '/images/suite-diamante-luxo-4.jpg',
        '/images/suite-diamante-luxo-5.jpg',
        '/images/suite-diamante-luxo-6.jpg',
        '/images/suite-diamante-luxo-7.jpg',
        '/images/suite-diamante-luxo-8.jpg',
        '/images/suite-diamante-luxo-9.jpg',
        '/images/suite-diamante-luxo-10.jpg',
        '/images/suite-diamante-luxo-11.jpg',
        '/images/suite-diamante-luxo-12.jpg',

      ],
      description: 'A Suíte Diamante Luxo combina elegância e conforto, com uma piscina privativa e hidromassagem. Ideal para quem busca sofisticação e romantismo.',
      size: '70m²',
      amenities: {
        geral: ['Piscina', 'Sauna', 'Minibar', 'Cama Super King', 'Ducha', 'Ar Condicionado', 'Hidromassagem', 'Frigobar', 'TV LED 32"', '2 Garagens'],
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
      images: [
        '/images/suite-prata-1.jpg',
        '/images/suite-prata-2.jpg',
        '/images/suite-prata-3.jpg',
        '/images/suite-prata-4.jpg',
        '/images/suite-prata-5.jpg',
        '/images/suite-prata-6.jpg',
        '/images/suite-prata-7.jpg',
      ],
      description: 'A Suíte Prata oferece conforto e praticidade, com hidromassagem e uma decoração aconchegante, perfeita para uma escapada romântica.',
      size: '50m²',
      amenities: {
        geral: ['Hidromassagem', 'Frigobar', 'TV LED', 'Cama Super King', 'Ducha', 'Ar Condicionado'],
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
      images: [
        '/images/suite-bronze-1.jpg',
        '/images/suite-bronze-2.jpg',
        '/images/suite-bronze-3.jpg',
        '/images/suite-bronze-4.jpg',
        '/images/suite-bronze-5.jpg',
        '/images/suite-bronze-6.jpg',
        '/images/suite-bronze-7.jpg',
        '/images/suite-bronze-8.jpg',
      ],
      description: 'A Suíte Bronze é ideal para quem busca simplicidade sem abrir mão do conforto, com uma decoração moderna e funcional.',
      size: '40m²',
      amenities: {
        geral: ['Frigobar', 'TV LED', 'Ducha', 'Cama Super King', 'Ar Condicionado'],
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

  const [currentImageIndex, setCurrentImageIndex] = useState(suites.map(() => 0));

  const handlePrevImage = (suiteIndex) => {
    setCurrentImageIndex((prev) => {
      const newIndexes = [...prev];
      newIndexes[suiteIndex] = prev[suiteIndex] === 0 ? suites[suiteIndex].images.length - 1 : prev[suiteIndex] - 1;
      return newIndexes;
    });
  };

  const handleNextImage = (suiteIndex) => {
    setCurrentImageIndex((prev) => {
      const newIndexes = [...prev];
      newIndexes[suiteIndex] = prev[suiteIndex] === suites[suiteIndex].images.length - 1 ? 0 : prev[suiteIndex] + 1;
      return newIndexes;
    });
  };

  const handleThumbnailClick = (suiteIndex, imageIndex) => {
    setCurrentImageIndex((prev) => {
      const newIndexes = [...prev];
      newIndexes[suiteIndex] = imageIndex;
      return newIndexes;
    });
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
            Nossas Suítes
          </motion.h1>
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
                <div className={styles.carouselWrapper}>
                  <div className={styles.carousel}>
                    <Image
                      src={suite.images[currentImageIndex[index]]}
                      alt={`${suite.title} - Imagem ${currentImageIndex[index] + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className={styles.carouselImage}
                    />
                    <div className={styles.carouselOverlay}></div>
                    <button
                      className={styles.carouselButton}
                      onClick={() => handlePrevImage(index)}
                      style={{ left: '10px' }}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className={styles.carouselButton}
                      onClick={() => handleNextImage(index)}
                      style={{ right: '10px' }}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                  <div className={styles.thumbnails}>
                    {suite.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`${styles.thumbnail} ${currentImageIndex[index] === imgIndex ? styles.activeThumbnail : ''}`}
                        onClick={() => handleThumbnailClick(index, imgIndex)}
                      >
                        <Image
                          src={image}
                          alt={`${suite.title} - Thumbnail ${imgIndex + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{suite.title}</h2>
                  <p className={styles.cardDescription}>{suite.description}</p>
                  <div className={styles.cardDetails}>
                    <h3 className={styles.detailsTitle}>Tamanho</h3>
                    <p className={styles.detailsText}>{suite.size}</p>
                    <h3 className={styles.detailsTitle}>Amenidades</h3>
                    {suite.amenities.inferior && (
                      <>
                        <h4 className={styles.amenitiesSubtitle}>Piso Inferior</h4>
                        <ul className={styles.amenitiesList}>
                          {suite.amenities.inferior.map((amenity, i) => (
                            <li key={i}>{amenity}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {suite.amenities.superior && (
                      <>
                        <h4 className={styles.amenitiesSubtitle}>Piso Superior</h4>
                        <ul className={styles.amenitiesList}>
                          {suite.amenities.superior.map((amenity, i) => (
                            <li key={i}>{amenity}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {suite.amenities.geral && (
                      <ul className={styles.amenitiesList}>
                        {suite.amenities.geral.map((amenity, i) => (
                          <li key={i}>{amenity}</li>
                        ))}
                      </ul>
                    )}
                    <h3 className={styles.detailsTitle}>Preços</h3>
                    <ul className={styles.pricingList}>
                      <li>Período: {suite.pricing.periodo}</li>
                      {suite.pricing.pernoite && <li>Pernoite: {suite.pricing.pernoite}</li>}
                      {suite.pricing.pernoiteSemana && <li>Pernoite (Semana): {suite.pricing.pernoiteSemana}</li>}
                      {suite.pricing.pernoiteFimSemana && <li>Pernoite (Fim de Semana): {suite.pricing.pernoiteFimSemana}</li>}
                      <li>Hora Extra: {suite.pricing.horaExtra}</li>
                    </ul>
                  </div>
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
      </main>
      <Footer />
    </div>
  );
}