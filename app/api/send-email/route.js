import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Templates de email
const emailTemplates = {
  'reservation-confirmation': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <h1 style="color: #333; text-align: center;">Reserva Confirmada!</h1>
      <p>Olá ${data.name},</p>
      <p>Sua reserva no Private Motel foi confirmada com sucesso!</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Detalhes da Reserva:</h3>
        <p><strong>Suíte:</strong> ${data.suite}</p>
        <p><strong>Data:</strong> ${data.date}</p>
        <p><strong>Horário:</strong> ${data.time}</p>
        <p><strong>Período:</strong> ${data.period}</p>
        <p><strong>Valor Total:</strong> ${data.totalPrice}</p>
        <p><strong>Forma de Pagamento:</strong> ${data.paymentMethod}</p>
      </div>
      
      ${data.paymentUrl ? `
      <div style="text-align: center; margin: 25px 0;">
        <a href="${data.paymentUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Realizar Pagamento
        </a>
      </div>
      ` : ''}
      
      ${data.qrCodeUrl ? `
      <div style="text-align: center; margin: 25px 0;">
        <p><strong>Ou escaneie o QR Code abaixo para pagar:</strong></p>
        <img src="${data.qrCodeUrl}" alt="QR Code para Pagamento" style="max-width: 200px; margin: 0 auto; display: block;">
      </div>
      ` : ''}
      
      <p>Agradecemos pela preferência!</p>
      <p>Atenciosamente,<br>Equipe Private Motel</p>
    </div>
  `,
  
  'payment-confirmation': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <h1 style="color: #333; text-align: center;">Pagamento Confirmado!</h1>
      <p>Olá ${data.name},</p>
      <p>Seu pagamento para a reserva no Private Motel foi processado com sucesso!</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Detalhes da Reserva:</h3>
        <p><strong>Reserva ID:</strong> ${data.reservationId}</p>
        <p><strong>Suíte:</strong> ${data.suite}</p>
        <p><strong>Data:</strong> ${data.date}</p>
        <p><strong>Horário:</strong> ${data.time}</p>
        <p><strong>Período:</strong> ${data.period}</p>
        <p><strong>Valor Pago:</strong> ${data.amount}</p>
      </div>
      
      <p>Agradecemos pela preferência!</p>
      <p>Atenciosamente,<br>Equipe Private Motel</p>
    </div>
  `,
  
  'contact': (data) => ({
    subject: `Contato do site: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Assunto:</strong> ${data.subject}</p>
        <p><strong>Telefone:</strong> ${data.phone || 'Não informado'}</p>
        <h3 style="margin-top: 20px; color: #555;">Mensagem:</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 10px;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top: 20px; font-size: 0.9em; color: #777;">Esta mensagem foi enviada através do formulário de contato do site.</p>
      </div>
    `,
  }),
};

export async function POST(request) {
  try {
    const { templateName, subject, emailData } = await request.json();
    
    // Validar campos obrigatórios
    if (!templateName || !emailData) {
      return NextResponse.json(
        { error: 'Dados incompletos. templateName e emailData são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Obter o template de email correspondente
    const template = emailTemplates[templateName];
    if (!template) {
      return NextResponse.json(
        { error: `Template '${templateName}' não encontrado.` },
        { status: 400 }
      );
    }
    
    // Gerar o HTML do email
    const htmlContent = template(emailData);
    
    // Definir o destinatário com base no tipo de template
    let recipient = emailData.email;
    let emailSubject = subject || 'Mensagem do Private Motel';
    
    // Para emails de contato, enviar para o email da empresa
    if (templateName === 'contact') {
      recipient = 'contato@privatemotel.com.br';
      emailSubject = `Contato via site - ${emailData.name}`;
    }
    
    // Em ambiente de desenvolvimento, apenas simular o envio
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 [DEV] Simulando envio de email:');
      console.log(`📧 Template: ${templateName}`);
      console.log(`📝 Assunto: ${emailSubject}`);
      console.log(`👤 Destinatário: ${recipient}`);
      console.log('✅ Email simulado com sucesso em ambiente de desenvolvimento');
      
      return NextResponse.json({
        success: true,
        messageId: `dev-${Date.now()}`,
        message: 'Email simulado com sucesso (ambiente de desenvolvimento)'
      });
    }
    
    // Configurar o transporter com as credenciais de email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Enviar o email
    const info = await transporter.sendMail({
      from: `"Private Motel" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: emailSubject,
      html: htmlContent,
    });
    
    console.log('✅ Email enviado:', info.messageId);
    
    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email enviado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    return NextResponse.json(
      { 
        error: 'Falha ao enviar email',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 