import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.promoBanner}>
        <p>10% de desconto durante todo o mês do seu aniversário! 🥳</p>
      </div>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <img src="/images/logo.png" alt="Private Motel Logo" />
        </Link>
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            <li><Link href="/">HOME</Link></li>
            <li><Link href="/suites">SUÍTES</Link></li>
            <li><Link href="/cortesias">CORTESIAS</Link></li>
            <li><Link href="/experiencias">EXPERIÊNCIAS</Link></li>
            <li><Link href="/estrutura">ESTRUTURA</Link></li>
            <li><Link href="/contato">CONTATO</Link></li>
            <li><Link href="/reservas" className={styles.reservas}>RESERVAS</Link></li>
          </ul>
        </nav>
        <div className={styles.socials}>
          <a href="https://facebook.com/privatemotel" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://instagram.com/private_motel" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://wa.me/5543999936839" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
        </div>
      </div>
    </header>
  );
}