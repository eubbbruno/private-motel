'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={`${styles.hero} ${styles.fadeIn}`}>
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        className={styles.swiper}
      >
        <SwiperSlide>
          <div className={styles.slide}>
            <Image
              src="/images/suite-private.jpg"
              alt="Suíte Private no Private Motel"
              layout="fill"
              objectFit="cover"
              className={styles.slideImage}
              priority
            />
            <div className={styles.slideContent}>
              <h1 className={styles.title}>Viva Momentos Inesquecíveis</h1>
              <p className={styles.subtitle}>Um refúgio 5 estrelas espera por você</p>
              <Link href="/reservas" className={styles.cta}>Reserve Agora</Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.slide}>
            <Image
              src="/images/motel-entrada.jpg"
              alt="Entrada do Private Motel"
              layout="fill"
              objectFit="cover"
              className={styles.slideImage}
              priority
            />
            <div className={styles.slideContent}>
              <h1 className={styles.title}>Bem-Vindo ao Private Motel</h1>
              <p className={styles.subtitle}>Sua experiência começa aqui</p>
              <Link href="/reservas" className={styles.cta}>Reserve Agora</Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}