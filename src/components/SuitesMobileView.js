'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaSwimmingPool, FaHotTub, 
         FaBed, FaTv, FaWifi, FaStar, FaWhatsapp, FaSnowflake, FaShower } from 'react-icons/fa';
import styles from '../styles/SuitesMobileView.module.css';

const SuitesMobileView = ({ suites }) => {
  const [currentSuiteIndex, setCurrentSuiteIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'amenities', 'prices'
  
  const currentSuite = suites[currentSuiteIndex];
  
  const handleNextSuite = () => {
    setCurrentSuiteIndex((prev) => (prev === suites.length - 1 ? 0 : prev + 1));
    setCurrentImageIndex(0);
    setActiveTab('info');
  };
  
  const handlePrevSuite = () => {
    setCurrentSuiteIndex((prev) => (prev === 0 ? suites.length - 1 : prev - 1));
    setCurrentImageIndex(0);
    setActiveTab('info');
  };
  
  const handleNextImage = (e) => {
    e.preventDefault();
    const imagesLength = currentSuite.images.length;
    setCurrentImageIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
  };
  
  const handlePrevImage = (e) => {
    e.preventDefault();
    const imagesLength = currentSuite.images.length;
    setCurrentImageIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
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

  if (!currentSuite) return null;
  
  return (
    <div className={styles.mobileContainer}>
      <div className={styles.carousel}>
        <div className={styles.imageContainer}>
          <Image
            src={currentSuite.images[currentImageIndex]}
            alt={`${currentSuite.title} - Imagem ${currentImageIndex + 1}`}
            fill
            sizes="100vw"
            priority
            quality={80}
            className={styles.suiteImage}
          />
          <div className={styles.imageOverlay}>
            <span className={styles.imageCounter}>
              {currentImageIndex + 1}/{currentSuite.images.length}
            </span>
          </div>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={handlePrevImage}
            aria-label="Imagem anterior"
          >
            <FaChevronLeft />
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNextImage}
            aria-label="Próxima imagem"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.suiteNavigation}>
          <button
            className={styles.suiteNavButton}
            onClick={handlePrevSuite}
            aria-label="Suíte anterior"
          >
            <FaChevronLeft /> Anterior
          </button>
          <h2 className={styles.suiteTitle}>{currentSuite.title}</h2>
          <button
            className={styles.suiteNavButton}
            onClick={handleNextSuite}
            aria-label="Próxima suíte"
          >
            Próxima <FaChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Informações
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'amenities' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('amenities')}
        >
          Comodidades
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'prices' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('prices')}
        >
          Preços
        </button>
      </div>

      <div className={styles.contentContainer}>
        {activeTab === 'info' && (
          <div className={styles.infoTab}>
            <p className={styles.suiteDescription}>{currentSuite.description}</p>
            <div className={styles.suiteSize}>
              <h3>Tamanho:</h3>
              <p>{currentSuite.size}</p>
            </div>
            <div className={styles.highlightsContainer}>
              {currentSuite.highlights.map((highlight, i) => (
                <div key={i} className={styles.highlightBadge}>
                  {getAmenityIcon(highlight)}
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'amenities' && (
          <div className={styles.amenitiesTab}>
            {currentSuite.amenities.inferior && (
              <div className={styles.amenitiesSection}>
                <h3>Piso Inferior:</h3>
                <ul className={styles.amenitiesList}>
                  {currentSuite.amenities.inferior.map((amenity, i) => (
                    <li key={i}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
            {currentSuite.amenities.superior && (
              <div className={styles.amenitiesSection}>
                <h3>Piso Superior:</h3>
                <ul className={styles.amenitiesList}>
                  {currentSuite.amenities.superior.map((amenity, i) => (
                    <li key={i}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
            {currentSuite.amenities.geral && (
              <div className={styles.amenitiesSection}>
                <h3>Comodidades:</h3>
                <ul className={styles.amenitiesList}>
                  {currentSuite.amenities.geral.map((amenity, i) => (
                    <li key={i}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'prices' && (
          <div className={styles.pricesTab}>
            <div className={styles.priceCard}>
              <h3>Período (6 horas)</h3>
              <p className={styles.priceValue}>{currentSuite.pricing.periodo}</p>
            </div>

            {currentSuite.pricing.pernoite && (
              <div className={styles.priceCard}>
                <h3>Pernoite (12 horas)</h3>
                <p className={styles.priceValue}>{currentSuite.pricing.pernoite}</p>
              </div>
            )}

            {currentSuite.pricing.pernoiteSemana && (
              <div className={styles.priceCard}>
                <h3>Pernoite (Dom-Qui)</h3>
                <p className={styles.priceValue}>{currentSuite.pricing.pernoiteSemana}</p>
              </div>
            )}

            {currentSuite.pricing.pernoiteFimSemana && (
              <div className={styles.priceCard}>
                <h3>Pernoite (Sex-Sáb)</h3>
                <p className={styles.priceValue}>{currentSuite.pricing.pernoiteFimSemana}</p>
              </div>
            )}

            <div className={styles.priceCard}>
              <h3>Hora Extra</h3>
              <p className={styles.priceValue}>{currentSuite.pricing.horaExtra}</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => handleWhatsAppReservation(currentSuite)}
        className={styles.reserveButton}
      >
        <FaWhatsapp className={styles.whatsappIcon} /> Reservar Agora
      </button>
    </div>
  );
};

export default SuitesMobileView; 