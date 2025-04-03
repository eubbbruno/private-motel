'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaWhatsapp, FaMapMarkerAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

export default function Footer() {
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

  const bottomVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' } },
  };

  const handleWhatsAppClick = () => {
    window.location.href = 'https://wa.me/554399936839';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+554331746600';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contato@privatemotel.com.br';
  };

  return (
    <footer className={styles.footer} ref={ref}>
      <motion.div
        className={styles.footerContent}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div
          className={styles.footerGrid}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={gridVariants}
        >
          {/* Logo e Descrição */}
          <div className={styles.footerSection}>
            <Image
              src="/images/logo.png"
              alt="Private Motel"
              width={120}
              height={48}
              className={styles.logo}
            />
            <p className={styles.footerText}>
              O melhor motel de Londrina e Cambé, com suítes exclusivas e experiências únicas.
            </p>
          </div>

          {/* Links Úteis */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Links Úteis</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/sobre-nos" className={styles.footerLink}>Sobre Nós</Link></li>
              <li><Link href="/suites" className={styles.footerLink}>Suítes</Link></li>
              <li><Link href="/cortesias" className={styles.footerLink}>Cortesias</Link></li>
              <li><Link href="/experiencias" className={styles.footerLink}>Experiências</Link></li>
              <li><Link href="/estrutura" className={styles.footerLink}>Estrutura</Link></li>
              <li><Link href="/contato" className={styles.footerLink}>Contato</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contato</h3>
            <p className={styles.footerText} onClick={handleWhatsAppClick}><FaWhatsapp /> (43) 9 9993-6839</p>
            <p className={styles.footerText} onClick={handlePhoneClick}><FaLock /> (43) 3174-6600</p>
            <p className={styles.footerText} onClick={handleEmailClick}><FaEnvelope /> contato@privatemotel.com.br</p>
            <Link href="/reservas" className={styles.footerCta}>
              Reservas
            </Link>
            <div className={styles.socials}>
              <Link href="https://instagram.com/privatemotel" target="_blank"><FaInstagram className={styles.socialIcon} /></Link>
              <Link href="https://facebook.com/privatemotel" target="_blank"><FaFacebook className={styles.socialIcon} /></Link>
              <Link href="https://wa.me/554399936839" target="_blank"><FaWhatsapp className={styles.socialIcon} /></Link>
            </div>
          </div>

          {/* Mapa */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Como Chegar</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.5196842119467!2d-51.2332569!3d-23.2968962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eb5bb26dcd5f2d%3A0x63c579bc257f9151!2sMotel%20Private!5e0!3m2!1spt-BR!2sbr!4v1742293541938!5m2!1spt-BR!2sbr"
              width="100%"
              height="250" /* Aumentado para maior visibilidade */
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className={styles.mapIframe}
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className={styles.mapButtons}>
              <Link href="https://maps.app.goo.gl/zcQJjiMuGF6h6LB77" target="_blank" className={styles.mapButton}>
                Google Maps
              </Link>
              <Link href="https://waze.com/ul?ll=-23.2968962,-51.2332569&navigate=yes" target="_blank" className={styles.mapButton}>
                Waze
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.footerBottom}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={bottomVariants}
        >
          <div className={styles.footerPolicyLinks}>
            <Link href="/politica-privacidade" className={styles.footerLink}>Política de Privacidade</Link>
            <Link href="/termos-uso" className={styles.footerLink}>Termos de Uso</Link>
            <Link href="/lgpd" className={styles.footerLink}>LGPD</Link>
          </div>
          <p className={styles.footerBottomText}>© 2025 Private Motel. Todos os direitos reservados.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}