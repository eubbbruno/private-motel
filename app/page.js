import Header from '../src/components/Header';
import HeroSection from '../src/components/sections/HeroSection';
import MotorReservaSection from '../src/components/sections/MotorReservaSection';
import GaleriaSuitesSection from '../src/components/sections/GaleriaSuitesSection';
import ExperienciasSection from '../src/components/sections/ExperienciasSection';
import RefeicoesSection from '../src/components/sections/RefeicoesSection';
import PromocoesSection from '../src/components/sections/PromocoesSection';
import SobreNosSection from '../src/components/sections/SobreNosSection';
import NewsletterSection from '../src/components/sections/NewsletterSection';
import Footer from '../src/components/Footer';
import PopupDesconto from '../src/components/PopupDesconto';
import PopupCookies from '../src/components/PopupCookies';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <PopupCookies />
      <Header />
      <main className={styles.main}>
        <HeroSection />
        <MotorReservaSection />
        <GaleriaSuitesSection />
        <ExperienciasSection />
        <RefeicoesSection />
        <PromocoesSection />
        <SobreNosSection />
        <NewsletterSection />
      </main>
      <Footer />
      <PopupDesconto />
      <div className={styles.particles}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>
    </div>
  );
}