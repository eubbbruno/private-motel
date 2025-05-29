'use client';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styles from './HeroSection.module.css';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className={`${styles.hero} ${styles.fadeIn}`}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className={styles.swiper}
      >
        <SwiperSlide>
          <div className={styles.slide}>
            <div className={styles.slideImageWrapper}>
              <Image
                src="/images/suite-private.jpg"
                alt="Suíte Private no Private Motel"
                fill
                priority
                className={styles.slideImage}
              />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.slideContent}>
              <h1 className={styles.title}>Viva Momentos Inesquecíveis</h1>
              <p className={styles.subtitle}>Um refúgio 5 estrelas espera por você</p>
              <Link 
                href="https://wa.me/5543999936839?text=Gostaria%20de%20fazer%20uma%20reserva..." 
                className={styles.cta}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reserve Agora
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.slide}>
            <div className={styles.slideImageWrapper}>
              <Image
                src="/images/suite-diamante-luxo-4.jpg"
                alt="Suíte Diamante Luxo no Private Motel"
                fill
                priority
                className={styles.slideImage}
              />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.slideContent}>
              <h1 className={styles.title}>Bem-Vindo ao Private Motel</h1>
              <p className={styles.subtitle}>Sua experiência começa aqui</p>
              <Link 
                href="https://wa.me/5543999936839?text=Gostaria%20de%20fazer%20uma%20reserva..." 
                className={styles.cta}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reserve Agora
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.slide}>
            <div className={styles.slideImageWrapper}>
              <Image
                src="/images/motel-entrada.jpg"
                alt="Entrada do Private Motel"
                fill
                priority
                className={styles.slideImage}
              />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.slideContent}>
              <h1 className={styles.title}>Luxo e Conforto</h1>
              <p className={styles.subtitle}>Para momentos inesquecíveis</p>
              <Link 
                href="https://wa.me/5543999936839?text=Gostaria%20de%20fazer%20uma%20reserva..." 
                className={styles.cta}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reserve Agora
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}