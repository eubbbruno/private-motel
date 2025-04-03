"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/PoliticaPrivacidadePage.module.css';

export default function PoliticaPrivacidadeContent() {
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
            Política de Privacidade
          </motion.h1>
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            <h2 className={styles.subTitle}>1. Introdução</h2>
            <p className={styles.sectionText}>
              No Private Motel 5 Estrelas, valorizamos a privacidade dos nossos clientes. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras regulamentações aplicáveis.
            </p>

            <h2 className={styles.subTitle}>2. Dados Coletados</h2>
            <p className={styles.sectionText}>
              Coletamos os seguintes dados pessoais quando você interage com nosso site ou serviços:
            </p>
            <ul className={styles.list}>
              <li>Nome, e-mail e telefone fornecidos em formulários de contato ou reservas.</li>
              <li>Informações de navegação, como cookies e endereço IP, para melhorar sua experiência no site.</li>
              <li>Dados de pagamento, processados de forma segura para reservas online.</li>
            </ul>

            <h2 className={styles.subTitle}>3. Uso dos Dados</h2>
            <p className={styles.sectionText}>
              Utilizamos seus dados para:
            </p>
            <ul className={styles.list}>
              <li>Processar reservas e fornecer os serviços solicitados.</li>
              <li>Enviar comunicações, como confirmações de reserva e promoções (caso você tenha optado por recebê-las).</li>
              <li>Melhorar nosso site e serviços com base em análises de uso.</li>
              <li>Cumprir obrigações legais e proteger seus dados contra uso não autorizado.</li>
            </ul>

            <h2 className={styles.subTitle}>4. Compartilhamento de Dados</h2>
            <p className={styles.sectionText}>
              Não compartilhamos seus dados pessoais com terceiros, exceto:
            </p>
            <ul className={styles.list}>
              <li>Com prestadores de serviços que nos ajudam a operar o site (ex.: processadores de pagamento), sob contratos que garantem a proteção dos dados.</li>
              <li>Quando exigido por lei ou para proteger nossos direitos legais.</li>
            </ul>

            <h2 className={styles.subTitle}>5. Cookies</h2>
            <p className={styles.sectionText}>
              Utilizamos cookies para melhorar sua experiência no site. Você pode gerenciar suas preferências de cookies através do nosso popup de consentimento ou nas configurações do seu navegador.
            </p>

            <h2 className={styles.subTitle}>6. Segurança dos Dados</h2>
            <p className={styles.sectionText}>
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. No entanto, nenhum sistema é 100% seguro, e recomendamos que você também adote práticas seguras, como não compartilhar suas informações de login.
            </p>

            <h2 className={styles.subTitle}>7. Seus Direitos</h2>
            <p className={styles.sectionText}>
              De acordo com a LGPD, você tem os seguintes direitos:
            </p>
            <ul className={styles.list}>
              <li>Acessar, corrigir ou excluir seus dados pessoais.</li>
              <li>Solicitar a portabilidade dos seus dados.</li>
              <li>Revogar o consentimento para o uso de dados, quando aplicável.</li>
              <li>Apresentar reclamações à Autoridade Nacional de Proteção de Dados (ANPD).</li>
            </ul>
            <p className={styles.sectionText}>
              Para exercer seus direitos, entre em contato conosco pelo e-mail contato@privatemotel.com.br.
            </p>

            <h2 className={styles.subTitle}>8. Alterações nesta Política</h2>
            <p className={styles.sectionText}>
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível nesta página, e a data da última atualização será indicada no topo do documento.
            </p>

            <h2 className={styles.subTitle}>9. Contato</h2>
            <p className={styles.sectionText}>
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco:
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