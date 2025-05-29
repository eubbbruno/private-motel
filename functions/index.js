const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions/logger'); // Corrigir a importação do logger
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: 'smtp.locaweb.com.br',
  port: 587,
  secure: false,
  auth: {
    user: 'contato@privatemotel.com.br',
    pass: '@Contato123',
  },
});

// Função para enviar e-mail
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Private Motel" <contato@privatemotel.com.br>`,
      to,
      subject,
      text,
    });
    logger.info(`E-mail enviado para ${to}`);
  } catch (error) {
    logger.error('Erro ao enviar e-mail:', error);
    throw error;
  }
};

// Função para enviar mensagem WhatsApp via ManyChat
const sendWhatsAppMessage = async (to, message) => {
  try {
    // Garantir que o número tenha o formato internacional
    let formattedPhone = to;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+55${formattedPhone}`; // Adiciona o código do Brasil se não estiver presente
    }
    logger.info(`Enviando mensagem WhatsApp para ${formattedPhone}`);

    const response = await axios.post('https://api.manychat.com/sendMessage', {
      phone: formattedPhone,
      text: message,
    }, {
      headers: {
        Authorization: `Bearer 988817:2ac91c72402bd633a48d14f634857ad3`,
        'Content-Type': 'application/json',
      },
    });
    logger.info(`Mensagem WhatsApp enviada para ${formattedPhone}`, { response: response.data });
  } catch (error) {
    logger.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
};

// Função para criar transação no PagSeguro
const createPagSeguroTransaction = async (reservation, reservationId, price) => {
  try {
    logger.info('Iniciando criação de transação no PagSeguro', { reservationId, price });
    const response = await axios.post('https://ws.sandbox.pagseguro.uol.com.br/v2/checkout', {
      email: 'eubbbruno@gmail.com',
      token: '581e8852-d8a5-450b-b72b-a3a8b1e339a14e9b89ce42ed85e74446d927a71ec83fb2f3-1750-419c-9c59-3533e2be89f4',
      currency: 'BRL',
      reference: reservationId,
      itemId1: reservation.suite,
      itemDescription1: `Reserva - ${reservation.suite} (${reservation.period})`,
      itemAmount1: price.toFixed(2),
      itemQuantity1: 1,
      senderName: reservation.name,
      senderEmail: reservation.email,
      senderPhone: reservation.phone,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    logger.info('Resposta do PagSeguro recebida', { response: response.data });
    const xmlResponse = response.data;
    const codeMatch = xmlResponse.match(/<code>(.*?)<\/code>/);
    if (!codeMatch) {
      throw new Error('Código de transação não encontrado na resposta do PagSeguro');
    }
    const transactionCode = codeMatch[1];
    const paymentUrl = `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${transactionCode}`;
    logger.info('Link de pagamento gerado', { paymentUrl });
    return paymentUrl;
  } catch (error) {
    logger.error('Erro ao criar transação no PagSeguro:', error);
    throw error;
  }
};

// Função disparada quando uma nova reserva é criada
exports.onReservationCreated = onDocumentCreated('reservations/{reservationId}', async (event) => {
  logger.info('Cloud Function onReservationCreated iniciada');
  const reservation = event.data.data();
  const reservationId = event.params.reservationId;
  logger.info('Reserva recebida', { reservation, reservationId });

  // Calcular o valor da reserva
  const prices = {
    'suite-private': { 'periodo-4h': 355, 'pernoite-12h': 407 },
    'suite-diamante-luxo': { 'periodo-4h': 299, 'pernoite-12h': 320 },
    'suite-prata': { 'periodo-4h': 155, 'pernoite-12h': 208 },
    'suite-bronze': { 'periodo-4h': 125, 'pernoite-12h': 175 },
  };

  const price = prices[reservation.suite]?.[reservation.period] || 0;
  if (!price) {
    logger.error('Preço não encontrado para a suíte e período selecionados.');
    return;
  }

  // Criar transação no PagSeguro
  let paymentUrl;
  try {
    paymentUrl = await createPagSeguroTransaction(reservation, reservationId, price);

    // Atualizar a reserva com a URL de pagamento
    await admin.firestore().collection('reservations').doc(reservationId).update({
      paymentUrl,
      paymentStatus: 'Pendente',
      status: 'Pendente',
    });
    logger.info('Reserva atualizada com link de pagamento', { paymentUrl });
  } catch (error) {
    logger.error('Erro ao criar transação no PagSeguro:', error);
    return;
  }

  // Enviar e-mail para o cliente
  try {
    await sendEmail(
      reservation.email,
      'Confirmação de Reserva - Private Motel',
      `Olá ${reservation.name},\n\nSua reserva foi recebida com sucesso!\n\nDetalhes:\n- Suíte: ${reservation.suite}\n- Data: ${reservation.checkInDate}\n- Horário: ${reservation.checkInTime}\n- Período: ${reservation.period}\n- Valor: R$ ${price.toFixed(2)}\n\nFinalize o pagamento para confirmar sua reserva: ${paymentUrl}\n\nAguardamos sua chegada!\n\nAtenciosamente,\nEquipe Private Motel`
    );
  } catch (error) {
    logger.error('Erro ao enviar e-mail para o cliente:', error);
  }

  // Enviar mensagem WhatsApp para o cliente
  try {
    await sendWhatsAppMessage(
      reservation.phone,
      `Olá ${reservation.name}, sua reserva no Private Motel foi recebida! Suíte: ${reservation.suite}, Data: ${reservation.checkInDate}, Horário: ${reservation.checkInTime}. Valor: R$ ${price.toFixed(2)}. Finalize o pagamento: ${paymentUrl}`
    );
  } catch (error) {
    logger.error('Erro ao enviar mensagem WhatsApp para o cliente:', error);
  }

  // Enviar e-mail para o administrador
  try {
    await sendEmail(
      'contato@privatemotel.com.br',
      'Nova Reserva Recebida - Private Motel',
      `Nova reserva recebida:\n\n- Suíte: ${reservation.suite}\n- Data: ${reservation.checkInDate}\n- Horário: ${reservation.checkInTime}\n- Período: ${reservation.period}\n- Nome: ${reservation.name}\n- E-mail: ${reservation.email}\n- Telefone: ${reservation.phone}\n- Valor: R$ ${price.toFixed(2)}\n- Link de Pagamento: ${paymentUrl}`
    );
  } catch (error) {
    logger.error('Erro ao enviar e-mail para o administrador:', error);
  }
});

// Função disparada quando uma reserva é atualizada (ex.: cancelada)
exports.onReservationUpdated = onDocumentUpdated('reservations/{reservationId}', async (event) => {
  logger.info('Cloud Function onReservationUpdated iniciada');
  const before = event.data.before.data();
  const after = event.data.after.data();

  if (before.status !== 'Cancelada' && after.status === 'Cancelada') {
    // Enviar e-mail para o cliente
    try {
      await sendEmail(
        after.email,
        'Reserva Cancelada - Private Motel',
        `Olá ${after.name},\n\nSua reserva foi cancelada.\n\nDetalhes:\n- Suíte: ${after.suite}\n- Data: ${after.checkInDate}\n- Horário: ${after.checkInTime}\n\nSe precisar de ajuda, entre em contato conosco.\n\nAtenciosamente,\nEquipe Private Motel`
      );
    } catch (error) {
      logger.error('Erro ao enviar e-mail de cancelamento para o cliente:', error);
    }

    // Enviar mensagem WhatsApp para o cliente
    try {
      await sendWhatsAppMessage(
        after.phone,
        `Olá ${after.name}, sua reserva no Private Motel foi cancelada. Suíte: ${after.suite}, Data: ${after.checkInDate}, Horário: ${after.checkInTime}.`
      );
    } catch (error) {
      logger.error('Erro ao enviar mensagem WhatsApp de cancelamento para o cliente:', error);
    }
  }
});

const { onRequest } = require('firebase-functions/v2/https');

// Função temporária para testar a integração com o PagSeguro
exports.testPagSeguro = onRequest(async (req, res) => {
  try {
    logger.info('Iniciando teste de integração com o PagSeguro');
    const response = await axios.post('https://ws.sandbox.pagseguro.uol.com.br/v2/checkout', {
      email: 'eubbbruno@gmail.com',
      token: '581e8852-d8a5-450b-b72b-a3a8b1e339a14e9b89ce42ed85e74446d927a71ec83fb2f3-1750-419c-9c59-3533e2be89f4',
      currency: 'BRL',
      reference: 'TESTE-123',
      itemId1: 'teste',
      itemDescription1: 'Teste de Pagamento',
      itemAmount1: '100.00',
      itemQuantity1: 1,
      senderName: 'Teste da Silva',
      senderEmail: 'teste@exemplo.com',
      senderPhone: '+5543996466446',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    logger.info('Resposta do PagSeguro recebida', { response: response.data });
    const xmlResponse = response.data;
    const codeMatch = xmlResponse.match(/<code>(.*?)<\/code>/);
    if (!codeMatch) {
      throw new Error('Código de transação não encontrado na resposta do PagSeguro');
    }
    const transactionCode = codeMatch[1];
    const paymentUrl = `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${transactionCode}`;
    logger.info('Link de pagamento gerado', { paymentUrl });

    res.status(200).send({ paymentUrl });
  } catch (error) {
    logger.error('Erro ao criar transação no PagSeguro:', error);
    res.status(500).send({ error: error.message });
  }
});

// Função temporária para testar o envio de e-mails
exports.testEmail = onRequest(async (req, res) => {
  try {
    logger.info('Iniciando teste de envio de e-mail');
    await transporter.sendMail({
      from: `"Private Motel" <contato@privatemotel.com.br>`,
      to: 'teste@exemplo.com',
      subject: 'Teste de E-mail - Private Motel',
      text: 'Este é um e-mail de teste enviado pelo Private Motel.',
    });
    logger.info('E-mail de teste enviado para teste@exemplo.com');
    res.status(200).send({ message: 'E-mail de teste enviado com sucesso' });
  } catch (error) {
    logger.error('Erro ao enviar e-mail de teste:', error);
    res.status(500).send({ error: error.message });
  }
});

// Função temporária para testar o envio de mensagens WhatsApp
exports.testWhatsApp = onRequest(async (req, res) => {
  try {
    logger.info('Iniciando teste de envio de mensagem WhatsApp');
    const formattedPhone = '+5543996466446';
    const response = await axios.post('https://api.manychat.com/sendMessage', {
      phone: formattedPhone,
      text: 'Este é um teste de mensagem WhatsApp enviado pelo Private Motel.',
    }, {
      headers: {
        Authorization: `Bearer 988817:2ac91c72402bd633a48d14f634857ad3`,
        'Content-Type': 'application/json',
      },
    });
    logger.info('Mensagem WhatsApp de teste enviada', { response: response.data });
    res.status(200).send({ message: 'Mensagem WhatsApp de teste enviada com sucesso', response: response.data });
  } catch (error) {
    logger.error('Erro ao enviar mensagem WhatsApp de teste:', error);
    res.status(500).send({ error: error.message });
  }
});