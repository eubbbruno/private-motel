'use client';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from './NewsletterSection.module.css';

export default function NewsletterSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
  };

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
        Fique por Dentro das Novidades
      </motion.h2>
      <motion.p
        className={styles.sectionText}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={textVariants}
      >
        Inscreva-se na nossa newsletter e receba promoções exclusivas, novidades e dicas para tornar sua estadia ainda mais especial.
      </motion.p>
      <motion.div
        className={styles.formContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={formVariants}
      >
        {submitted ? (
          <p className={styles.successMessage}>Obrigado por se inscrever! Você receberá nossas novidades em breve.</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.newsletterForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              className={styles.newsletterInput}
            />
            <button type="submit" className={styles.cta}>Inscrever-se</button>
          </form>
        )}
      </motion.div>
    </section>
  );
}