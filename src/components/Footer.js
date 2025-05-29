'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import { SiWaze, SiGooglemaps } from 'react-icons/si';
import styles from './Footer.module.css';

const Footer = () => {
  const whatsappLink = "https://wa.me/5543999936839";

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <Image
              src="/images/logo.png"
              alt="Private Motel Logo"
              width={120}
              height={60}
              className={styles.logo}
            />
            <p className={styles.footerText}>
              Momentos inesquecíveis em um ambiente exclusivo e discreto, projetado para proporcionar experiências únicas.
            </p>
            <div className={styles.socials}>
              <Link href="https://instagram.com/private_motel" target="_blank" rel="noopener noreferrer">
                <FaInstagram className={styles.socialIcon} />
              </Link>
              <Link href="https://facebook.com/privatemotel" target="_blank" rel="noopener noreferrer">
                <FaFacebook className={styles.socialIcon} />
              </Link>
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className={styles.socialIcon} />
              </Link>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Links Rápidos</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/suites" className={styles.footerLink}>
                  Suítes
                </Link>
              </li>
              <li>
                <Link href="/cortesias" className={styles.footerLink}>
                  Cortesias
                </Link>
              </li>
              <li>
                <Link href="/contato" className={styles.footerLink}>
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className={styles.footerLink}>
                  Política de Privacidade
                </Link>
              </li>
            </ul>
            <Link href={whatsappLink} className={styles.footerCta} target="_blank" rel="noopener noreferrer">
              Reserve Agora
            </Link>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Mapa</h3>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.4912864976735!2d-51.27461312491346!3d-23.1457450841386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eb43f271e65555%3A0x5ebd4b3bec0c9094!2sRua%20Adelino%20Bianchini%2C%2086%20-%20Camb%C3%A9%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1689543215926!5m2!1spt-BR!2sbr"
                width="250"
                height="150"
                allowFullScreen=""
                loading="lazy"
                className={styles.mapIframe}
              ></iframe>
            </div>
            <div className={styles.mapButtons}>
              <a
                href="https://www.google.com/maps/place/Rua+Adelino+Bianchini,+86+-+Camb%C3%A9,+PR"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLogoButton}
              >
                <SiGooglemaps className={styles.mapIcon} /> Google Maps
              </a>
              <a
                href="https://ul.waze.com/ul?ll=-23.2769073,-51.2720431&navigate=yes&address=Rua+Adelino+Bianchini,+86,+Cambe,+PR"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLogoButton}
              >
                <SiWaze className={styles.mapIcon} /> Waze
              </a>
            </div>
            <div className={styles.googleReview}>
              <div className={styles.stars}>
                <FaStar className={styles.starIcon} />
                <FaStar className={styles.starIcon} />
                <FaStar className={styles.starIcon} />
                <FaStar className={styles.starIcon} />
                <FaStar className={styles.starIcon} />
              </div>
              <a
                href="https://g.page/r/CVGRfyW8ecVjEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.reviewButton}
              >
                Avalie-nos no Google
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contato</h3>
            <div className={styles.contatoContainer}>
              <div className={styles.contatoInfo}>
                <FaMapMarkerAlt />
                <a
                  href="https://www.google.com/maps/place/Rua+Adelino+Bianchini,+86+-+Camb%C3%A9,+PR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rua Adelino Bianchini, 86 - Cambé, PR
                </a>
              </div>
              <div className={styles.contatoInfo}>
                <FaPhone />
                <a href="tel:+554331746600">
                  (43) 3174-6600
                </a>
              </div>
              <div className={styles.contatoInfo}>
                <FaWhatsapp />
                <a href="https://wa.me/5543999936839">
                  (43) 99993-6839
                </a>
              </div>
              <div className={styles.contatoInfo}>
                <FaEnvelope />
                <a href="mailto:contato@privatemotel.com.br">
                  contato@privatemotel.com.br
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerPolicyLinks}>
            <Link href="/termos-de-uso" className={styles.footerLink}>
              Termos de Uso
            </Link>
            <Link href="/politica-de-privacidade" className={styles.footerLink}>
              Política de Privacidade
            </Link>
            <Link href="/politica-de-cookies" className={styles.footerLink}>
              Política de Cookies
            </Link>
          </div>
          <p className={styles.footerBottomText}>
            &copy; {new Date().getFullYear()} Private Motel. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;