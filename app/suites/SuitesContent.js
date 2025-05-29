"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSwimmingPool, FaHotTub, FaBed, FaTv, FaWifi, FaStar, FaClock, FaInfoCircle, FaWhatsapp, FaSnowflake, FaShower } from 'react-icons/fa';
import styles from '../../src/styles/SuitesPage.module.css';
import SuitesMobileView from '../../src/components/SuitesMobileView';

export default function SuitesContent() {
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

  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: 'easeOut' } },
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.15, ease: 'easeOut' } },
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
      description: 'Nossa suíte mais luxuosa distribuída em dois andares, oferecendo total privacidade e exclusividade. Conta com piscina aquecida privativa com cascata, hidromassagem e sauna para uma experiência inesquecível de relaxamento e romance.',
      size: 'Dois Pisos',
      category: 'premium',
      highlights: ['Piscina Aquecida', 'Hidromassagem', 'Dois Pisos'],
      amenities: {
        inferior: [
          'Cama Super King',
          'Ducha Dupla',
          'Sauna',
          'Ar Condicionado',
          'Pole Dance',
          'Piscina Aquecida c/ Cascata',
          'Hidromassagem',
          'Frigobar',
          'TV LED 40″',
          'Cadeira Erótica'
        ],
        superior: [
          'Cama Super King',
          'Ducha Dupla',
          'Bar',
          'Ar Condicionado',
          'TV LED 32″',
          '2 Garagens'
        ],
      },
      pricing: {
        periodo: 'R$ 355,00',
        pernoite: 'R$ 407,00',
        horaExtra: 'R$ 65,00',
      },
      keywords: ['Piscina Aquecida', 'Hidromassagem', 'Sauna', 'Pole Dance', 'Dois Andares', 'Cascata'],
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
      description: 'Elegância e conforto em 70m² com piscina privativa aquecida, sauna e hidromassagem. Ambiente luxuoso e aconchegante para casais que buscam sofisticação e momentos de relaxamento total.',
      size: '70m²',
      category: 'luxo',
      highlights: ['Piscina Aquecida', 'Sauna', 'Hidromassagem'],
      amenities: {
        geral: [
          'Cama Super King',
          'Ducha',
          'Sauna',
          'Ar Condicionado',
          'Piscina Aquecida',
          'Hidromassagem',
          'Frigobar',
          'TV LED 32″',
          '2 Garagens'
        ],
      },
      pricing: {
        periodo: 'R$ 299,00',
        pernoiteSemana: 'R$ 320,00',
        pernoiteFimSemana: 'R$ 350,00',
        horaExtra: 'R$ 59,00',
      },
      keywords: ['Piscina Aquecida', 'Hidromassagem', 'Sauna', '2 Garagens'],
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
      description: 'Suíte de 50m² que combina conforto com excelente custo-benefício. Desfrute da hidromassagem e decoração aconchegante em um ambiente perfeito para casais que valorizam praticidade e privacidade.',
      size: '50m²',
      category: 'padrao',
      highlights: ['Hidromassagem', 'Cama Super King', 'Ar Condicionado'],
      amenities: {
        geral: [
          'Cama Super King',
          'Ducha',
          'Ar Condicionado',
          'Hidromassagem',
          'Frigobar',
          'TV LED 32″',
          '1 Garagem'
        ],
      },
      pricing: {
        periodo: 'R$ 155,00',
        pernoiteSemana: 'R$ 208,00',
        pernoiteFimSemana: 'R$ 235,00',
        horaExtra: 'R$ 48,00',
      },
      keywords: ['Hidromassagem', 'Cama Super King', 'Ar Condicionado'],
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
      description: 'Opção econômica com 40m² que não abre mão do essencial para seu conforto. Decoração moderna, ar-condicionado e cama super king em um ambiente aconchegante e funcional para momentos a dois.',
      size: '40m²',
      category: 'economica',
      highlights: ['Cama Super King', 'Ar Condicionado', 'TV LED 32″'],
      amenities: {
        geral: [
          'Cama Super King',
          'Ducha',
          'Ar Condicionado',
          'Frigobar',
          'TV LED 32″',
          '1 Garagem'
        ],
      },
      pricing: {
        periodo: 'R$ 125,00',
        pernoiteSemana: 'R$ 175,00',
        pernoiteFimSemana: 'R$ 203,00',
        horaExtra: 'R$ 35,00',
      },
      keywords: ['Cama Super King', 'Ar Condicionado', 'Frigobar'],
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(suites.map(() => 0));
  const [filteredSuites, setFilteredSuites] = useState(suites);
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    if (filter === 'todas') {
      setFilteredSuites(suites);
    } else {
      setFilteredSuites(suites.filter(suite => suite.category === filter));
    }
  }, [filter]);

  const handlePrevImage = (suiteIndex, e) => {
    if (e) e.preventDefault();
    setCurrentImageIndex((prev) => {
      const newIndexes = [...prev];
      newIndexes[suiteIndex] = prev[suiteIndex] === 0 ? suites[suiteIndex].images.length - 1 : prev[suiteIndex] - 1;
      return newIndexes;
    });
  };

  const handleNextImage = (suiteIndex, e) => {
    if (e) e.preventDefault();
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

  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('piscina')) return <FaSwimmingPool />;
    if (amenity.toLowerCase().includes('hidro')) return <FaHotTub />;
    if (amenity.toLowerCase().includes('cama')) return <FaBed />;
    if (amenity.toLowerCase().includes('tv')) return <FaTv />;
    if (amenity.toLowerCase().includes('wi-fi')) return <FaWifi />;
    if (amenity.toLowerCase().includes('ar condicionado')) return <FaSnowflake />;
    if (amenity.toLowerCase().includes('ducha')) return <FaShower />;
    return <FaStar />;
  };

  const handleWhatsAppReservation = (suite) => {
    const phoneNumber = "5543999936839";
    const message = `Olá! Gostaria de fazer uma reserva para a suíte *${suite.title}*.

*Informações da suíte:*
• Categoria: ${suite.category}
• Preço período: ${suite.pricing.periodo}
• ${suite.pricing.pernoite ? `Preço pernoite: ${suite.pricing.pernoite}` : 
    `${suite.pricing.pernoiteSemana ? `Preço pernoite (Dom-Qui): ${suite.pricing.pernoiteSemana}` : ''} 
     ${suite.pricing.pernoiteFimSemana ? `Preço pernoite (Sex-Sáb): ${suite.pricing.pernoiteFimSemana}` : ''}`}

Gostaria de verificar a disponibilidade para reserva. Aguardo retorno!`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Se for um dispositivo móvel, renderizar o componente móvel específico
  if (isMobile) {
    return (
      <>
        <Header />
        <SuitesMobileView suites={suites} />
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
            Nossas Suítes
          </motion.h1>

          <motion.div 
            className={styles.filtersContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={filterVariants}
          >
            <button 
              className={`${styles.filterButton} ${filter === 'todas' ? styles.activeFilter : ''}`}
              onClick={() => setFilter('todas')}
            >
              Todas
            </button>
            <button 
              className={`${styles.filterButton} ${filter === 'premium' ? styles.activeFilter : ''}`}
              onClick={() => setFilter('premium')}
            >
              Premium
            </button>
            <button 
              className={`${styles.filterButton} ${filter === 'luxo' ? styles.activeFilter : ''}`}
              onClick={() => setFilter('luxo')}
            >
              Luxo
            </button>
            <button 
              className={`${styles.filterButton} ${filter === 'padrao' ? styles.activeFilter : ''}`}
              onClick={() => setFilter('padrao')}
            >
              Padrão
            </button>
            <button 
              className={`${styles.filterButton} ${filter === 'economica' ? styles.activeFilter : ''}`}
              onClick={() => setFilter('economica')}
            >
              Econômica
            </button>
          </motion.div>
          
          <motion.div
            className={styles.gridContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={gridVariants}
          >
            {filteredSuites.map((suite, index) => {
              const originalIndex = suites.findIndex(s => s.title === suite.title);
              return (
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
                        src={suite.images[currentImageIndex[originalIndex]]}
                        alt={`${suite.title} - Imagem ${currentImageIndex[originalIndex] + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={80}
                        className={styles.carouselImage}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.carouselOverlay}></div>
                      <button
                        className={styles.carouselButton}
                        onClick={(e) => {
                          handlePrevImage(originalIndex, e);
                        }}
                        style={{ left: '10px' }}
                        aria-label="Imagem anterior"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        className={styles.carouselButton}
                        onClick={(e) => {
                          handleNextImage(originalIndex, e);
                        }}
                        style={{ right: '10px' }}
                        aria-label="Próxima imagem"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                    <div className={styles.thumbnails}>
                      {suite.images.slice(0, 8).map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className={`${styles.thumbnail} ${currentImageIndex[originalIndex] === imgIndex ? styles.activeThumbnail : ''}`}
                          onClick={() => handleThumbnailClick(originalIndex, imgIndex)}
                        >
                          <Image
                            src={image}
                            alt={`${suite.title} - Miniatura ${imgIndex + 1}`}
                            fill
                            sizes="50px"
                            loading="lazy"
                            quality={60}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                      {suite.images.length > 8 && (
                        <div className={styles.moreImagesIndicator} onClick={() => handleThumbnailClick(originalIndex, 8 % suite.images.length)}>
                          +{suite.images.length - 8}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h2 className={styles.cardTitle}>{suite.title}</h2>
                    
                    <div className={styles.highlightsContainer}>
                      {suite.highlights.map((highlight, i) => (
                        <div key={i} className={styles.highlightBadge}>
                          {getAmenityIcon(highlight)}
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
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
                      <div className={styles.pricingContainer}>
                        <div className={styles.pricingCard}>
                          <h4 className={styles.pricingTitle}>Período</h4>
                          <p className={styles.pricingValue}>{suite.pricing.periodo}</p>
                          <span className={styles.pricingDescription}>6 horas</span>
                        </div>
                        
                        {suite.pricing.pernoite && (
                          <div className={styles.pricingCard}>
                            <h4 className={styles.pricingTitle}>Pernoite</h4>
                            <p className={styles.pricingValue}>{suite.pricing.pernoite}</p>
                            <span className={styles.pricingDescription}>12 horas</span>
                          </div>
                        )}
                        
                        {suite.pricing.pernoiteSemana && (
                          <div className={styles.pricingCard}>
                            <h4 className={styles.pricingTitle}>Pernoite</h4>
                            <p className={styles.pricingValue}>{suite.pricing.pernoiteSemana}</p>
                            <span className={styles.pricingDescription}>Dom a Qui e Feriado</span>
                          </div>
                        )}
                        
                        {suite.pricing.pernoiteFimSemana && (
                          <div className={styles.pricingCard}>
                            <h4 className={styles.pricingTitle}>Pernoite</h4>
                            <p className={styles.pricingValue}>{suite.pricing.pernoiteFimSemana}</p>
                            <span className={styles.pricingDescription}>Sex, Sáb e Vésp. Feriado</span>
                          </div>
                        )}
                        
                        <div className={styles.pricingCard}>
                          <h4 className={styles.pricingTitle}>Hora Extra</h4>
                          <p className={styles.pricingValue}>{suite.pricing.horaExtra}</p>
                          <span className={styles.pricingDescription}>adicional</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.keywords}>
                      {suite.keywords.map((keyword, i) => (
                        <span key={i} className={styles.keyword}>{keyword}</span>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleWhatsAppReservation(suite)} 
                      className={styles.cardCta}
                    >
                      <FaWhatsapp className={styles.whatsappIcon} /> Reservar Agora
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div
            className={styles.infoTableContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={tableVariants}
          >
            <div className={styles.infoTable}>
              <div className={styles.infoTableSection}>
                <h3 className={styles.infoTableTitle}>
                  <FaClock /> Períodos
                </h3>
                <div className={styles.infoTableContent}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Domingo a Quinta-feira:</div>
                    <div className={styles.infoValue}>Os períodos são de <strong>6 horas</strong></div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Feriados:</div>
                    <div className={styles.infoValue}>Das 00h às 6h59 - períodos de <strong>4 horas</strong><br />A partir das 7h - períodos de <strong>6 horas</strong></div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Sexta, Sábado e Véspera de Feriados:</div>
                    <div className={styles.infoValue}>Os períodos são de <strong>4 horas</strong></div>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoTableSection}>
                <h3 className={styles.infoTableTitle}>
                  <FaClock /> Pernoite
                </h3>
                <div className={styles.infoTableContent}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Domingo a Quinta-feira e Feriados:</div>
                    <div className={styles.infoValue}>Entrada após as <strong>20h</strong>, permanência de <strong>12 horas</strong></div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Sexta, Sábado e Véspera de Feriados:</div>
                    <div className={styles.infoValue}>Entrada após as <strong>23h59</strong> e permanência até <strong>12h</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}