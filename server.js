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
  // Hostinger official settings:
  // Server: smtp.hostinger.com
  // Port: 465 (SSL) or 587 (TLS/STARTTLS)
  // Auth: Email address & password
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'false' ? false : (port === 465);
  const user = process.env.SMTP_USER || 'vendas@amilvix.com.br';
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    console.warn('[SMTP AVISO] SMTP_PASS não foi preenchida. Para enviar emails reais pela Hostinger, configure SMTP_PASS no .env da sua hospedagem.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      // Prevents TLS handshake failure on some hosting environments
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000,
  });
};

// API route to receive quote submissions and forward/send to sales
app.post('/api/cotacao', async (req, res) => {
  try {
    const { nome, empresa, email, telefone, descricao, protocolo } = req.body;

    if (!nome || !empresa || !email || !telefone || !descricao) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes.' });
    }

    const leadProtocolo = protocolo || 'AMV-' + Math.floor(100000 + Math.random() * 900000);
    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    console.log(`[NOVO LEAD RECEBIDO] Protocolo: ${leadProtocolo} | Empresa: ${empresa} | Solicitante: ${nome} | E-mail: ${email} | Tel: ${telefone}`);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0b3b60; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">AMILVIX AUTOMAÇÃO</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #38bdf8;">Nova Solicitação de Cotação - Posital Fraba</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <strong style="color: #166534; font-size: 14px;">Protocolo: ${leadProtocolo}</strong><br>
            <span style="font-size: 12px; color: #4b5563;">Recebido em: ${dataHora}</span>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;"><strong>Solicitante:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;"><strong>${nome}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Empresa / CNPJ:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${empresa}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>E-mail:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Telefone / Whats:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;"><a href="https://wa.me/55${telefone.replace(/\D/g, '')}" target="_blank" style="color: #16a34a; text-decoration: none; font-weight: bold;">${telefone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0 6px 0; color: #64748b;" colspan="2"><strong>Código da Peça / Descrição da Aplicação:</strong></td>
            </tr>
            <tr>
              <td colspan="2" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 13px; color: #334155; white-space: pre-wrap; line-height: 1.5;">${descricao}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://wa.me/55${telefone.replace(/\D/g, '')}" style="background-color: #25d366; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">Responder via WhatsApp</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Amilvix Automação e Instrumentação Industrial Ltda. • Vitória - ES
        </div>
      </div>
    `;

    // 1. Send via direct SMTP if configured
    const transporter = createMailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `Amilvix Automação <${process.env.SMTP_USER || 'vendas@amilvix.com.br'}>`,
          to: 'vendas@amilvix.com.br',
          replyTo: email,
          subject: `[Nova Cotação Posital Fraba] ${empresa} - Protocolo ${leadProtocolo}`,
          html: htmlContent,
          text: `NOVA COTAÇÃO POSITAL FRABA\nProtocolo: ${leadProtocolo}\nSolicitante: ${nome}\nEmpresa: ${empresa}\nE-mail: ${email}\nTelefone: ${telefone}\n\nDescrição:\n${descricao}`,
        });
        console.log(`[SMTP SUCESSO] E-mail enviado com sucesso diretamente para vendas@amilvix.com.br via SMTP.`);
      } catch (smtpErr) {
        console.error('[SMTP ERRO] Falha ao enviar via SMTP:', smtpErr);
      }
    } else {
      console.log('[SMTP INFO] SMTP_PASS não configurado no .env. Configure SMTP_PASS para envio SMTP direto.');
    }

    // 2. Also forward to Webhook if configured
    if (process.env.EMAIL_WEBHOOK_URL) {
      fetch(process.env.EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinatario: 'vendas@amilvix.com.br',
          assunto: `[Nova Cotação Posital Fraba] ${empresa} - Protocolo ${leadProtocolo}`,
          dados: { protocolo: leadProtocolo, nome, empresa, email, telefone, descricao, dataHora },
        }),
      }).catch((err) => console.warn('Falha no webhook externo:', err));
    }

    return res.status(200).json({
      success: true,
      message: 'Cotação registrada com sucesso para vendas@amilvix.com.br',
      protocolo: leadProtocolo,
    });
  } catch (error) {
    console.error('Erro ao processar cotação:', error);
    return res.status(500).json({ success: false, error: 'Erro interno ao processar cotação.' });
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
