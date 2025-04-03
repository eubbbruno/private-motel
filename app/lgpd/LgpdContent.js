"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/LgpdPage.module.css';

export default function LgpdContent() {
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
            LGPD - Lei Geral de Proteção de Dados
          </motion.h1>
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            <h2 className={styles.subTitle}>1. Compromisso com a LGPD</h2>
            <p className={styles.sectionText}>
              O Private Motel 5 Estrelas está comprometido em proteger os dados pessoais de seus clientes, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Esta página detalha como implementamos as práticas exigidas pela LGPD para garantir a segurança e a transparência no tratamento de dados.
            </p>

            <h2 className={styles.subTitle}>2. Dados Pessoais Tratados</h2>
            <p className={styles.sectionText}>
              Tratamos os seguintes dados pessoais, conforme descrito em nossa Política de Privacidade:
            </p>
            <ul className={styles.list}>
              <li>Dados de identificação (nome, e-mail, telefone).</li>
              <li>Dados de navegação (cookies, endereço IP).</li>
              <li>Dados de pagamento (processados de forma segura).</li>
            </ul>

            <h2 className={styles.subTitle}>3. Finalidades do Tratamento</h2>
            <p className={styles.sectionText}>
              Os dados pessoais são tratados para as seguintes finalidades:
            </p>
            <ul className={styles.list}>
              <li>Execução de reservas e prestação de serviços.</li>
              <li>Comunicação com os clientes (confirmações, promoções, etc.).</li>
              <li>Melhoria do site e dos serviços com base em análises de uso.</li>
              <li>Cumprimento de obrigações legais.</li>
            </ul>

            <h2 className={styles.subTitle}>4. Base Legal para o Tratamento</h2>
            <p className={styles.sectionText}>
              O tratamento de dados é realizado com base nas seguintes bases legais da LGPD:
            </p>
            <ul className={styles.list}>
              <li>Consentimento do titular (ex.: ao aceitar cookies ou enviar um formulário).</li>
              <li>Execução de contrato (ex.: para processar reservas).</li>
              <li>Cumprimento de obrigação legal ou regulatória.</li>
              <li>Legítimo interesse do controlador, quando aplicável, sem prejudicar os direitos do titular.</li>
            </ul>

            <h2 className={styles.subTitle}>5. Direitos do Titular dos Dados</h2>
            <p className={styles.sectionText}>
              Como titular dos dados, você tem os seguintes direitos, conforme a LGPD:
            </p>
            <ul className={styles.list}>
              <li>Confirmação da existência de tratamento de dados.</li>
              <li>Acesso aos seus dados pessoais tratados por nós.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço.</li>
              <li>Eliminação de dados tratados com base no consentimento, quando solicitado.</li>
              <li>Informação sobre o compartilhamento de dados com terceiros.</li>
              <li>Revogação do consentimento, quando aplicável.</li>
            </ul>
            <p className={styles.sectionText}>
              Para exercer seus direitos, entre em contato conosco pelo e-mail contato@privatemotel.com.br.
            </p>

            <h2 className={styles.subTitle}>6. Medidas de Segurança</h2>
            <p className={styles.sectionText}>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia, controles de acesso e políticas internas de segurança. Nossos sistemas são regularmente auditados para garantir a conformidade com a LGPD.
            </p>

            <h2 className={styles.subTitle}>7. Encarregado de Proteção de Dados (DPO)</h2>
            <p className={styles.sectionText}>
              Nosso Encarregado de Proteção de Dados (DPO) é o responsável por atuar como canal de comunicação entre o Private Motel, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD). Você pode contatá-lo pelo e-mail: dpo@privatemotel.com.br.
            </p>

            <h2 className={styles.subTitle}>8. Contato</h2>
            <p className={styles.sectionText}>
              Para dúvidas ou solicitações relacionadas à LGPD, entre em contato conosco:
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