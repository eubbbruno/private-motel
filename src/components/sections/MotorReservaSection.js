'use client';
import React from 'react';
import { FaGlobeAmericas, FaPlane, FaSuitcase, FaHotel } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './MotorReservaSection.module.css';

const MotorReservaSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const partners = [
    { name: 'Booking.com', icon: FaGlobeAmericas, url: 'https://www.booking.com' },
    { name: 'Expedia', icon: FaPlane, url: 'https://www.expedia.com' },
    { name: 'Hotels.com', icon: FaHotel, url: 'https://www.hotels.com' },
    { name: 'Decolar', icon: FaSuitcase, url: 'https://www.decolar.com' }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h3 
            className={styles.title}
            variants={fadeIn}
          >
            Conheça nossos parceiros que tornam sua experiência ainda mais especial
          </motion.h3>
          
          <motion.div 
            className={styles.partnersContainer}
            variants={staggerContainer}
          >
            {partners.map((partner, index) => (
              <motion.div 
                key={index}
                className={styles.partner}
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                onClick={() => window.open(partner.url, '_blank')}
              >
                <div className={styles.partnerLogo}>
                  <partner.icon />
                </div>
                <span className={styles.partnerName}>{partner.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MotorReservaSection;