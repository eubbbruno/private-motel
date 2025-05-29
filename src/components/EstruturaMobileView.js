'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '../styles/EstruturaMobileView.module.css';

const EstruturaMobileView = ({ textos, galleryImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={styles.mobileContainer}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Nossa Estrutura</h1>
        
        <div className={styles.galleryContainer}>
          <div className={styles.imageContainer}>
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              fill
              priority={true}
              sizes="100vw"
              quality={80}
              className={styles.galleryImage}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.imageOverlay}>
              <span className={styles.imageCounter}>
                {currentImageIndex + 1}/{galleryImages.length}
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
        </div>
        
        <div className={styles.textBlocks}>
          {textos.map((item, index) => (
            <div key={index} className={styles.textBlock}>
              <h2 className={styles.textBlockTitle}>{item.title}</h2>
              <p className={styles.textBlockDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EstruturaMobileView; 