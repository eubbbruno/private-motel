"use client";

import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import styles from '../../src/styles/TermosWhatsappPage.module.css';

export default function TermosWhatsappContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
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
      <main id="main-content" className={styles.main}>
        <section className={styles.section} ref={ref}>
          <motion.div
            className={styles.sectionDivider}
            initial={{ width: 0 }}
            animate={inView ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <motion.div
            className={styles.badgeWrapper}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            <span className={styles.badge}>WhatsApp · IA</span>
          </motion.div>
          <motion.h1
            className={styles.sectionTitle}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            Termos de Uso
          </motion.h1>
          <motion.p
            className={styles.sectionSubtitle}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            Atendimento via WhatsApp com Inteligência Artificial
          </motion.p>

          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={textVariants}
          >
            <div className={styles.infoBox}>
              <p className={styles.infoBoxText}>
                Ao iniciar uma conversa pelo nosso WhatsApp, você concorda automaticamente com os termos descritos nesta página. Recomendamos a leitura completa antes de prosseguir.
              </p>
            </div>

            <h2 className={styles.subTitle}>1. Atendimento por Inteligência Artificial</h2>
            <p className={styles.sectionText}>
              O atendimento inicial via WhatsApp do Private Motel é realizado por um assistente virtual com Inteligência Artificial, operado pela plataforma <strong className={styles.highlight}>ManyChat</strong>. Esse assistente foi treinado para responder dúvidas frequentes, auxiliar em reservas e fornecer informações sobre nossas suítes, serviços e experiências.
            </p>
            <p className={styles.sectionText}>
              Apesar de oferecer uma experiência de conversa natural e personalizada, trata-se de um sistema automatizado — não um atendente humano. Em situações que exijam atendimento especializado, o assistente poderá encaminhar sua solicitação à nossa equipe.
            </p>

            <h2 className={styles.subTitle}>2. Dados Coletados na Conversa</h2>
            <p className={styles.sectionText}>
              Durante a interação com o assistente virtual, poderão ser coletados os seguintes dados pessoais:
            </p>
            <ul className={styles.list}>
              <li><strong>Nome:</strong> para personalizar o atendimento e identificar o titular.</li>
              <li><strong>Número de telefone (WhatsApp):</strong> obtido automaticamente ao iniciar a conversa.</li>
              <li><strong>Preferências e escolhas:</strong> informações sobre tipo de suíte, datas de interesse, serviços desejados e outras preferências indicadas durante a conversa.</li>
              <li><strong>Histórico de mensagens:</strong> as interações ficam registradas na plataforma ManyChat para fins de continuidade do atendimento e melhoria do serviço.</li>
            </ul>
            <p className={styles.sectionText}>
              Esses dados são utilizados exclusivamente para prestar um atendimento mais eficiente e personalizado, e para aprimorar continuamente a experiência no Private Motel.
            </p>

            <h2 className={styles.subTitle}>3. Compartilhamento de Dados</h2>
            <p className={styles.sectionText}>
              Os dados coletados via WhatsApp <strong className={styles.highlight}>não são compartilhados, vendidos ou cedidos a terceiros</strong> para fins comerciais ou publicitários. As informações são acessadas apenas pela equipe interna do Private Motel e pelo sistema ManyChat, que atua como operador de dados sob as diretrizes desta política.
            </p>
            <p className={styles.sectionText}>
              O compartilhamento poderá ocorrer somente nas seguintes hipóteses:
            </p>
            <ul className={styles.list}>
              <li>Por determinação legal ou judicial.</li>
              <li>Para cumprimento de obrigações regulatórias.</li>
              <li>Com prestadores de serviço essenciais à operação da plataforma, vinculados por acordos de confidencialidade.</li>
            </ul>

            <h2 className={styles.subTitle}>4. Seus Direitos (LGPD)</h2>
            <p className={styles.sectionText}>
              Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>, você possui os seguintes direitos sobre seus dados pessoais:
            </p>
            <ul className={styles.list}>
              <li>Confirmação da existência de tratamento de dados.</li>
              <li>Acesso aos dados pessoais que coletamos sobre você.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Exclusão dos dados</strong> coletados na conversa, a qualquer momento.</li>
              <li>Revogação do consentimento para tratamento dos dados.</li>
              <li>Informação sobre o compartilhamento de dados.</li>
            </ul>
            <p className={styles.sectionText}>
              Para exercer qualquer um desses direitos, entre em contato conosco pelo e-mail abaixo. Atenderemos sua solicitação em até 15 dias úteis.
            </p>

            <h2 className={styles.subTitle}>5. Canal de Contato</h2>
            <p className={styles.sectionText}>
              Para dúvidas sobre estes termos, solicitações relacionadas aos seus dados pessoais ou qualquer outra questão, entre em contato com nossa equipe:
            </p>
            <div className={styles.contactBox}>
              <p className={styles.contactItem}>
                <span className={styles.contactLabel}>E-mail</span>
                <a href="mailto:contato@privatemotel.com.br" className={styles.contactLink}>
                  contato@privatemotel.com.br
                </a>
              </p>
            </div>

            <h2 className={styles.subTitle}>6. Consentimento e Aceitação</h2>
            <p className={styles.sectionText}>
              Ao enviar a primeira mensagem no WhatsApp do Private Motel, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso, incluindo a coleta e o tratamento dos dados descritos acima.
            </p>
            <p className={styles.sectionText}>
              Caso não concorde com alguma condição, recomendamos que não inicie a conversa via WhatsApp e entre em contato por outro canal disponível em nosso site.
            </p>

            <h2 className={styles.subTitle}>7. Alterações nestes Termos</h2>
            <p className={styles.sectionText}>
              O Private Motel reserva-se o direito de atualizar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação nesta página. Recomendamos a consulta periódica para manter-se informado.
            </p>

            <p className={styles.updateDate}>
              Última atualização: maio de 2025
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

