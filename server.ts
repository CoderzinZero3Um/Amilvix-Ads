import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const distPath = path.join(__dirname, 'dist');

// Parse JSON request bodies
app.use(express.json());

// Configure Nodemailer transporter with official Hostinger SMTP specifications
const createMailTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'false' ? false : (port === 465);
  // Authenticated SMTP mailbox on Hostinger
  const user = process.env.SMTP_USER || 'smtp@amilvix.com.br';
  const pass = process.env.SMTP_PASS || 'Amilvix@2026';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
  });
};

// Quick healthcheck endpoint for SMTP connection
app.get('/api/test-smtp', async (req, res) => {
  try {
    const transporter = createMailTransporter();
    await transporter.verify();
    return res.status(200).json({
      success: true,
      message: 'Conexão com servidor SMTP Hostinger (smtp.hostinger.com:465) autenticada com sucesso!',
      user: process.env.SMTP_USER || 'smtp@amilvix.com.br',
      destination: process.env.SMTP_TO || 'vendas@amilvix.com.br',
    });
  } catch (error: any) {
    console.error('[SMTP VERIFY ERRO]', error);
    return res.status(500).json({
      success: false,
      message: 'Falha ao autenticar no servidor SMTP da Hostinger',
      error: error.message,
    });
  }
});

// API route to receive quote submissions and send authenticated email directly to sales
app.post('/api/cotacao', async (req, res) => {
  try {
    const { nome, empresa, email, telefone, descricao, protocolo } = req.body;

    if (!nome || !empresa || !email || !telefone || !descricao) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes.' });
    }

    const leadProtocolo = protocolo || 'AMV-' + Math.floor(100000 + Math.random() * 900000);
    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    console.log(`[NOVO LEAD RECEBIDO] Protocolo: ${leadProtocolo} | Empresa: ${empresa} | Solicitante: ${nome} | E-mail: ${email}`);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0b3b60; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">AMILVIX AUTOMAÇÃO</h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #38bdf8; font-weight: bold;">Nova Cotação Posital Fraba Recebida via Google Ads</p>
        </div>
        <div style="padding: 24px;">
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 6px; margin-bottom: 20px;">
            <strong style="color: #166534; font-size: 15px;">Protocolo do Orçamento: ${leadProtocolo}</strong><br>
            <span style="font-size: 12px; color: #4b5563;">Data e Hora: ${dataHora}</span>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;"><strong>Solicitante:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><strong>${nome}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Empresa / CNPJ:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${empresa}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>E-mail Corporativo:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: bold;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Telefone / WhatsApp:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><a href="https://wa.me/55${telefone.replace(/\D/g, '')}" target="_blank" style="color: #16a34a; text-decoration: none; font-weight: bold;">${telefone}</a></td>
            </tr>
            <tr>
              <td style="padding: 14px 0 6px 0; color: #64748b;" colspan="2"><strong>Código da Peça / Descrição da Aplicação:</strong></td>
            </tr>
            <tr>
              <td colspan="2" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 13px; color: #1e293b; white-space: pre-wrap; line-height: 1.6;">${descricao}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://wa.me/55${telefone.replace(/\D/g, '')}" style="background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: bold; display: inline-block;">Responder Cliente via WhatsApp</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Amilvix Automação e Instrumentação Industrial Ltda. • Distribuidor Autorizado Posital Fraba
        </div>
      </div>
    `;

    const transporter = createMailTransporter();
    const fromAddress = process.env.SMTP_FROM || `"Amilvix Automação" <smtp@amilvix.com.br>`;
    const toAddress = process.env.SMTP_TO || 'vendas@amilvix.com.br';
    
    // Send email using verified Hostinger SMTP
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `[Nova Cotação Posital Fraba] ${empresa} - Protocolo ${leadProtocolo}`,
      html: htmlContent,
      text: `NOVA COTAÇÃO POSITAL FRABA\nProtocolo: ${leadProtocolo}\nSolicitante: ${nome}\nEmpresa: ${empresa}\nE-mail: ${email}\nTelefone: ${telefone}\n\nDescrição:\n${descricao}`,
    });

    console.log(`[SMTP SUCESSO] E-mail enviado para ${toAddress}! MessageId: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      message: `Cotação enviada com sucesso para ${toAddress} via Hostinger SMTP!`,
      protocolo: leadProtocolo,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('[ERRO NO DISPARO DE E-MAIL]:', error);
    return res.status(500).json({
      success: false,
      error: 'Não foi possível enviar o e-mail no momento via servidor SMTP.',
      details: error.message,
    });
  }
});

// Serve static assets from the Vite build output
app.use(express.static(distPath));

// Fallback to index.html for Single Page Application (SPA) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
