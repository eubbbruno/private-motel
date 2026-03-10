"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSwimmingPool, FaHotTub, FaBed, FaTv, FaWifi, FaStar, FaClock, FaInfoCircle, FaWhatsapp, FaSnowflake, FaShower, FaTimes, FaExpand, FaImages } from 'react-icons/fa';
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
        periodo: 'R$ 365,00',
        pernoite: 'R$ 417,00',
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
        periodo: 'R$ 305,00',
        pernoiteSemana: 'R$ 330,00',
        pernoiteFimSemana: 'R$ 360,00',
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
        periodo: 'R$ 165,00',
        pernoiteSemana: 'R$ 218,00',
        pernoiteFimSemana: 'R$ 245,00',
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
        periodo: 'R$ 135,00',
        pernoiteSemana: 'R$ 185,00',
        pernoiteFimSemana: 'R$ 213,00',
        horaExtra: 'R$ 35,00',
      },
      keywords: ['Cama Super King', 'Ar Condicionado', 'Frigobar'],
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(suites.map(() => 0));
  const [filteredSuites, setFilteredSuites] = useState(suites);
  const [filter, setFilter] = useState('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuiteIndex, setModalSuiteIndex] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

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

  const openModal = (suiteIndex, imageIndex) => {
    setModalSuiteIndex(suiteIndex);
    setModalImageIndex(imageIndex);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSuiteIndex(null);
    setModalImageIndex(0);
    document.body.style.overflow = 'auto';
  };

  const handleModalPrev = () => {
    if (modalSuiteIndex === null) return;
    const suite = suites[modalSuiteIndex];
    setModalImageIndex((prev) => (prev === 0 ? suite.images.length - 1 : prev - 1));
  };

  const handleModalNext = () => {
    if (modalSuiteIndex === null) return;
    const suite = suites[modalSuiteIndex];
    setModalImageIndex((prev) => (prev === suite.images.length - 1 ? 0 : prev + 1));
  };

  const handleModalThumbnailClick = (index) => {
    setModalImageIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        if (modalSuiteIndex === null) return;
        const suite = suites[modalSuiteIndex];
        setModalImageIndex((prev) => (prev === 0 ? suite.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        if (modalSuiteIndex === null) return;
        const suite = suites[modalSuiteIndex];
        setModalImageIndex((prev) => (prev === suite.images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, modalImageIndex, modalSuiteIndex]);

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
      
      {/* Modal de Galeria */}
      <AnimatePresence>
        {modalOpen && modalSuiteIndex !== null && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{suites[modalSuiteIndex].title}</h2>
                <button 
                  className={styles.modalCloseButton} 
                  onClick={closeModal}
                  aria-label="Fechar galeria"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className={styles.modalImageContainer}>
                <motion.img
                  key={modalImageIndex}
                  src={suites[modalSuiteIndex].images[modalImageIndex]}
                  alt={`${suites[modalSuiteIndex].title} - Imagem ${modalImageIndex + 1}`}
                  className={styles.modalImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <button 
                  className={`${styles.modalNavButton} ${styles.prev}`}
                  onClick={handleModalPrev}
                  aria-label="Imagem anterior"
                >
                  <FaChevronLeft />
                </button>
                
                <button 
                  className={`${styles.modalNavButton} ${styles.next}`}
                  onClick={handleModalNext}
                  aria-label="Próxima imagem"
                >
                  <FaChevronRight />
                </button>
                
                <div className={styles.modalImageCounter}>
                  {modalImageIndex + 1} / {suites[modalSuiteIndex].images.length}
                </div>
              </div>
              
              <div className={styles.modalThumbnailsContainer}>
                {suites[modalSuiteIndex].images.map((image, idx) => (
                  <div
                    key={idx}
                    className={`${styles.modalThumbnail} ${modalImageIndex === idx ? styles.active : ''}`}
                    onClick={() => handleModalThumbnailClick(idx)}
                  >
                    <Image
                      src={image}
                      alt={`${suites[modalSuiteIndex].title} - Miniatura ${idx + 1}`}
                      fill
                      sizes="100px"
                      loading="lazy"
                      quality={60}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
            className={styles.suitesContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={gridVariants}
          >
            {filteredSuites.map((suite, index) => {
              const originalIndex = suites.findIndex(s => s.title === suite.title);
              const isReversed = index % 2 !== 0; // Alterna o lado da imagem
              
              return (
                <motion.div
                  key={index}
                  className={`${styles.suiteCard} ${isReversed ? styles.reversed : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  {/* Seção de Imagem */}
                  <div className={styles.suiteImageSection}>
                    <div 
                      className={styles.suiteCarousel}
                      onClick={() => openModal(originalIndex, currentImageIndex[originalIndex])}
                    >
                      <Image
                        src={suite.images[currentImageIndex[originalIndex]]}
                        alt={`${suite.title} - Imagem ${currentImageIndex[originalIndex] + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={90}
                        className={styles.suiteMainImage}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.imageOverlay}></div>
                      
                      <button
                        className={styles.viewGalleryButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(originalIndex, currentImageIndex[originalIndex]);
                        }}
                        aria-label="Ver galeria completa"
                      >
                        <FaImages /> Ver Todas as {suite.images.length} Fotos
                      </button>
                      
                      <button
                        className={`${styles.navButton} ${styles.prevButton}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage(originalIndex, e);
                        }}
                        aria-label="Imagem anterior"
                      >
                        <FaChevronLeft />
                      </button>
                      
                      <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage(originalIndex, e);
                        }}
                        aria-label="Próxima imagem"
                      >
                        <FaChevronRight />
                      </button>
                      
                      <div className={styles.imageCounter}>
                        {currentImageIndex[originalIndex] + 1} / {suite.images.length}
                      </div>
                    </div>
                    
                    {/* Thumbnails */}
                    <div className={styles.thumbnailsRow}>
                      {suite.images.slice(0, 6).map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className={`${styles.thumbnailItem} ${currentImageIndex[originalIndex] === imgIndex ? styles.activeThumbnail : ''}`}
                          onClick={() => handleThumbnailClick(originalIndex, imgIndex)}
                        >
                          <Image
                            src={image}
                            alt={`${suite.title} - Miniatura ${imgIndex + 1}`}
                            fill
                            sizes="80px"
                            loading="lazy"
                            quality={60}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                      {suite.images.length > 6 && (
                        <div 
                          className={styles.moreThumbs}
                          onClick={() => openModal(originalIndex, 6)}
                        >
                          +{suite.images.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Seção de Informações */}
                  <div className={styles.suiteInfoSection}>
                    <div className={styles.suiteHeader}>
                      <h2 className={styles.suiteTitle}>{suite.title}</h2>
                      <span className={styles.suiteSize}>{suite.size}</span>
                    </div>
                    
                    <div className={styles.highlightsRow}>
                      {suite.highlights.map((highlight, i) => (
                        <div key={i} className={styles.highlightBadge}>
                          {getAmenityIcon(highlight)}
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className={styles.suiteDescription}>{suite.description}</p>
                    
                    {/* Amenidades */}
                    <div className={styles.amenitiesSection}>
                      <h3 className={styles.sectionSubtitle}>
                        <FaStar /> Amenidades
                      </h3>
                      <div className={styles.amenitiesGrid}>
                        {suite.amenities.inferior && (
                          <div className={styles.amenitiesColumn}>
                            <h4 className={styles.columnTitle}>Piso Inferior</h4>
                            <ul className={styles.amenitiesList}>
                              {suite.amenities.inferior.map((amenity, i) => (
                                <li key={i}>
                                  {getAmenityIcon(amenity)}
                                  <span>{amenity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {suite.amenities.superior && (
                          <div className={styles.amenitiesColumn}>
                            <h4 className={styles.columnTitle}>Piso Superior</h4>
                            <ul className={styles.amenitiesList}>
                              {suite.amenities.superior.map((amenity, i) => (
                                <li key={i}>
                                  {getAmenityIcon(amenity)}
                                  <span>{amenity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {suite.amenities.geral && (
                          <ul className={styles.amenitiesList}>
                            {suite.amenities.geral.map((amenity, i) => (
                              <li key={i}>
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    
                    {/* Preços */}
                    <div className={styles.pricingSection}>
                      <h3 className={styles.sectionSubtitle}>
                        <FaClock /> Valores
                      </h3>
                      <div className={styles.pricingGrid}>
                        <div className={styles.priceCard}>
                          <span className={styles.priceLabel}>Período</span>
                          <span className={styles.priceValue}>{suite.pricing.periodo}</span>
                          <span className={styles.priceTime}>6 horas</span>
                        </div>
                        
                        {suite.pricing.pernoite && (
                          <div className={styles.priceCard}>
                            <span className={styles.priceLabel}>Pernoite</span>
                            <span className={styles.priceValue}>{suite.pricing.pernoite}</span>
                            <span className={styles.priceTime}>12 horas</span>
                          </div>
                        )}
                        
                        {suite.pricing.pernoiteSemana && (
                          <div className={styles.priceCard}>
                            <span className={styles.priceLabel}>Pernoite</span>
                            <span className={styles.priceValue}>{suite.pricing.pernoiteSemana}</span>
                            <span className={styles.priceTime}>Dom-Qui</span>
                          </div>
                        )}
                        
                        {suite.pricing.pernoiteFimSemana && (
                          <div className={styles.priceCard}>
                            <span className={styles.priceLabel}>Pernoite</span>
                            <span className={styles.priceValue}>{suite.pricing.pernoiteFimSemana}</span>
                            <span className={styles.priceTime}>Sex-Sáb</span>
                          </div>
                        )}
                        
                        <div className={`${styles.priceCard} ${styles.extraHour}`}>
                          <span className={styles.priceLabel}>Hora Extra</span>
                          <span className={styles.priceValue}>{suite.pricing.horaExtra}</span>
                          <span className={styles.priceTime}>adicional</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleWhatsAppReservation(suite)} 
                      className={styles.reserveButton}
                    >
                      <FaWhatsapp /> Reservar {suite.title}
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

        {/* Seção de Tabela de Preços */}
        <section className={styles.precosSection}>
          <div className={styles.precosContainer}>
            <Image
              src="/images/precos-private-site.png"
              alt="Tabela de Preços Motel Private"
              width={1200}
              height={800}
              className={styles.precosImage}
              loading="lazy"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}