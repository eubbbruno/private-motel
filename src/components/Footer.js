import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp, FaWaze } from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si';
import { site, whatsappUrl } from '../data/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Link href="/"><Image src="/images/logo.png" width={194} height={69} alt="Private Motel" /></Link>
          <p>Um lugar reservado<br />para viver o seu momento.</p>
          <div className="footer-social">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
        <nav aria-label="Explore o Private">
          <h2>Explore</h2>
          {[[ 'Suítes', '/suites' ], [ 'Cortesias', '/cortesias' ], [ 'Experiências', '/experiencias' ], [ 'Promoções', '/promocoes' ], [ 'Estrutura', '/estrutura' ], [ 'Sobre nós', '/sobre-nos' ]].map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <a href={site.menuPdf} target="_blank" rel="noopener noreferrer">Cardápio</a>
        </nav>
        <div>
          <h2>Encontre seu momento</h2>
          <a className="contact-icon-link" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden="true" /><span>WhatsApp {site.whatsappLabel}</span></a>
          <a href={'tel:' + site.phone}>{site.phoneLabel}</a>
          <a href={'mailto:' + site.email}>{site.email}</a>
          <Link href="/reservas">Planejar reserva</Link>
          <Link href="/contato">Contato e localização</Link>
        </div>
      </div>
      <section className="wrap footer-location" aria-labelledby="footer-location-title">
        <div className="footer-location-copy">
          <p className="eyebrow">O caminho até aqui</p>
          <h2 id="footer-location-title">Seu destino.<br /><em>Em Cambé.</em></h2>
          <a className="footer-address" href={site.maps} target="_blank" rel="noopener noreferrer">{site.address}</a>
          <div className="footer-directions">
            <a className="contact-icon-link" href={site.maps} target="_blank" rel="noopener noreferrer"><SiGooglemaps aria-hidden="true" />Google Maps</a>
            <a className="contact-icon-link" href={site.waze} target="_blank" rel="noopener noreferrer"><FaWaze aria-hidden="true" />Waze</a>
          </div>
        </div>
        <iframe className="footer-map" title="Mapa do Private Motel — Rua Adelino Bianchini, 86, Cambé" src="https://maps.google.com/maps?q=Rua%20Adelino%20Bianchini%2086%20Camb%C3%A9%20PR&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </section>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Private Motel</span>
        <nav aria-label="Informações legais"><Link href="/politica-privacidade">Privacidade</Link><Link href="/termos-uso">Termos de uso</Link><Link href="/lgpd">LGPD e cookies</Link><Link href="/termos-whatsapp">Termos WhatsApp</Link></nav>
      </div>
    </footer>
  );
}
