import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, message } = data;

    // Validação básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Configuração do email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const formattedPhone = phone ? phone : 'Não informado';

    // Conteúdo do email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@seumotel.com.br',
      to: process.env.EMAIL_TO || 'contato@seumotel.com.br',
      subject: `Contato do site - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 2px solid #FFBB00; padding-bottom: 10px;">Nova mensagem do site</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${formattedPhone}</p>
          <h3 style="color: #555; margin-top: 20px;">Mensagem:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #FFBB00; border-radius: 3px;">
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
            Esta mensagem foi enviada através do formulário de contato do site.
          </p>
        </div>
      `,
    };

    // Em desenvolvimento, simula o envio sem realmente enviar
    if (process.env.NODE_ENV === 'development') {
      console.log('Simulando envio de email em ambiente de desenvolvimento:');
      console.log(mailOptions);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email simulado com sucesso (ambiente de desenvolvimento)' 
      });
    }

    // Envio do email em produção
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso' 
    });
    
  } catch (error) {
    console.error('Erro ao enviar email de contato:', error);
    
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
} 