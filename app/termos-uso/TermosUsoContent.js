"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/TermosUsoPage.module.css';

export default function TermosUsoContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section className={styles.section} ref={ref}>
          <motion.div
            className={styles.sectionDivider}
            initial={{ width: 0 }}
            animate={inView ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <motion.h1
            className={styles.sectionTitle}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Termos de Uso
          </motion.h1>
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            <h2 className={styles.subTitle}>1. Aceitação dos Termos</h2>
            <p className={styles.sectionText}>
              Ao acessar ou utilizar o site do Private Motel 5 Estrelas, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve usar o site ou os serviços oferecidos.
            </p>

            <h2 className={styles.subTitle}>2. Uso do Site</h2>
            <p className={styles.sectionText}>
              O site do Private Motel 5 Estrelas é destinado a usuários maiores de 18 anos. Você concorda em usar o site apenas para fins legais e de acordo com todas as leis e regulamentos aplicáveis. É proibido:
            </p>
            <ul className={styles.list}>
              <li>Usar o site para qualquer atividade ilegal ou não autorizada.</li>
              <li>Tentar acessar áreas restritas do site sem permissão.</li>
              <li>Publicar ou transmitir conteúdo ofensivo, difamatório ou que viole os direitos de terceiros.</li>
            </ul>

            <h2 className={styles.subTitle}>3. Reservas e Pagamentos</h2>
            <p className={styles.sectionText}>
              As reservas realizadas através do site estão sujeitas à disponibilidade e às políticas de cancelamento do motel. Os pagamentos são processados de forma segura, e você concorda em fornecer informações precisas e completas ao realizar uma reserva.
            </p>

            <h2 className={styles.subTitle}>4. Propriedade Intelectual</h2>
            <p className={styles.sectionText}>
              Todo o conteúdo do site, incluindo textos, imagens, logotipos e design, é de propriedade do Private Motel 5 Estrelas ou de seus licenciadores e está protegido por leis de direitos autorais. Você não pode reproduzir, distribuir ou usar esse conteúdo sem autorização expressa.
            </p>

            <h2 className={styles.subTitle}>5. Limitação de Responsabilidade</h2>
            <p className={styles.sectionText}>
              O Private Motel 5 Estrelas não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequentes decorrentes do uso ou da incapacidade de usar o site ou os serviços, incluindo, mas não se limitando a, interrupções, erros ou falhas técnicas.
            </p>

            <h2 className={styles.subTitle}>6. Alterações nos Termos</h2>
            <p className={styles.sectionText}>
              Podemos atualizar estes Termos de Uso periodicamente. A versão mais recente estará sempre disponível nesta página, e a data da última atualização será indicada no topo do documento. Recomendamos que você revise os termos regularmente.
            </p>

            <h2 className={styles.subTitle}>7. Lei Aplicável</h2>
            <p className={styles.sectionText}>
              Estes Termos de Uso são regidos pelas leis da República do Brasil. Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes de Londrina, Paraná.
            </p>

            <h2 className={styles.subTitle}>8. Contato</h2>
            <p className={styles.sectionText}>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <p className={styles.sectionText}>
              E-mail: contato@privatemotel.com.br<br />
              Telefone: (43) 3174-6600
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}