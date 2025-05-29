'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './GaleriaSuitesSection.module.css';

const suitesItems = [
  {
    id: 1,
    title: 'Suíte Private',
    keywords: ['Duplex', 'Piscina com Cascata', 'Hidromassagem', 'Sauna', 'Pole Dance'],
    price: 'A partir de R$355',
    image: '/images/suite-private.jpg'
  },
  {
    id: 2,
    title: 'Suíte Diamante Luxo',
    keywords: ['Piscina', 'Hidromassagem', 'Sauna', 'Ar Condicionado'],
    price: 'A partir de R$299',
    image: '/images/suite-diamante-luxo.jpg'
  },
  {
    id: 3,
    title: 'Suíte Prata',
    keywords: ['Cama King', 'Hidromassagem', 'Ar Condicionado'],
    price: 'A partir de R$155',
    image: '/images/suite-prata.jpg'
  },
  {
    id: 4,
    title: 'Suíte Bronze',
    keywords: ['Cama King', 'Ar Condicionado', 'Chuveiro'],
    price: 'A partir de R$125',
    image: '/images/suite-bronze.jpg'
  }
];

export default function GaleriaSuitesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, delay: 0.3, ease: "easeOut" }
    }
  };

  return (
    <section id="galeria-suites" className={styles.section}>
      <motion.div
        className={styles.sectionDivider}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.h2 
        className={styles.sectionTitle}
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Nossas Suítes
      </motion.h2>
      <motion.p 
        className={styles.sectionSubtitle}
        variants={subtitleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Escolha a suíte ideal e desfrute de momentos inesquecíveis.
      </motion.p>

      <motion.div 
        className={styles.gridContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {suitesItems.map((suite) => (
          <motion.div key={suite.id} className={styles.card} variants={itemVariants}>
            <div className={styles.imageWrapper}>
              <Image
                src={suite.image}
                alt={suite.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.cardImage}
                priority={suite.id <= 2}
                style={{ objectFit: 'cover' }}
              />
              <motion.div 
                className={styles.priceTag}
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (suite.id * 0.1), duration: 0.5 }}
              >
                {suite.price}
              </motion.div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{suite.title}</h3>
              <div className={styles.keywords}>
                {suite.keywords.map((keyword, index) => (
                  <span key={index} className={styles.keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}