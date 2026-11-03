import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables for dev server
dotenv.config();

// Custom Vite plugin to handle /api/cotacao directly during dev
function hostingerSmtpDevPlugin(): Plugin {
  return {
    name: 'hostinger-smtp-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/test-smtp' && req.method === 'GET') {
          try {
            const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
            const port = Number(process.env.SMTP_PORT) || 465;
            const user = process.env.SMTP_USER || 'vendas@amilvix.com.br';
            const pass = process.env.SMTP_PASS || 'Amilvix@2026';

            const transporter = nodemailer.createTransport({
              host,
              port,
              secure: port === 465,
              auth: { user, pass },
              tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
            });

            await transporter.verify();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, message: 'Hostinger SMTP autenticado com sucesso no Dev Server!' }));
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        if (req.url === '/api/cotacao' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const data = JSON.parse(body);
              const { nome, empresa, email, telefone, descricao, protocolo } = data;

              const leadProtocolo = protocolo || 'AMV-' + Math.floor(100000 + Math.random() * 900000);
              const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

              const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
              const port = Number(process.env.SMTP_PORT) || 465;
              const user = process.env.SMTP_USER || 'vendas@amilvix.com.br';
              const pass = process.env.SMTP_PASS || 'Amilvix@2026';

              const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
                tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
                connectionTimeout: 15000,
              });

              const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                  <div style="background-color: #0b3b60; color: #ffffff; padding: 24px; text-align: center;">
                    <h2 style="margin: 0; font-size: 22px;">AMILVIX AUTOMAÇÃO</h2>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #38bdf8; font-weight: bold;">Nova Cotação Posital Fraba Recebida</p>
                  </div>
                  <div style="padding: 24px;">
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 6px; margin-bottom: 20px;">
                      <strong style="color: #166534; font-size: 15px;">Protocolo: ${leadProtocolo}</strong><br>
                      <span style="font-size: 12px; color: #4b5563;">Data: ${dataHora}</span>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr><td style="padding: 8px 0; color: #64748b;"><strong>Solicitante:</strong></td><td style="padding: 8px 0; color: #0f172a;">${nome}</td></tr>
                      <tr><td style="padding: 8px 0; color: #64748b;"><strong>Empresa / CNPJ:</strong></td><td style="padding: 8px 0; color: #0f172a;">${empresa}</td></tr>
                      <tr><td style="padding: 8px 0; color: #64748b;"><strong>E-mail:</strong></td><td style="padding: 8px 0; color: #0284c7;">${email}</td></tr>
                      <tr><td style="padding: 8px 0; color: #64748b;"><strong>WhatsApp:</strong></td><td style="padding: 8px 0; color: #16a34a; font-weight: bold;">${telefone}</td></tr>
                      <tr><td colspan="2" style="padding-top: 12px; color: #64748b;"><strong>Descrição:</strong></td></tr>
                      <tr><td colspan="2" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 13px; white-space: pre-wrap;">${descricao}</td></tr>
                    </table>
                  </div>
                </div>
              `;

              const info = await transporter.sendMail({
                from: process.env.SMTP_FROM || `"Amilvix Automação" <${user}>`,
                to: 'vendas@amilvix.com.br',
                replyTo: email,
                subject: `[Nova Cotação Posital Fraba] ${empresa} - Protocolo ${leadProtocolo}`,
                html: htmlContent,
                text: `Nova cotação recebida para vendas@amilvix.com.br:\nProtocolo: ${leadProtocolo}\nNome: ${nome}\nEmpresa: ${empresa}\nEmail: ${email}\nTel: ${telefone}\nDescrição:\n${descricao}`,
              });

              console.log('[Dev Server SMTP Sucesso] MessageId:', info.messageId);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                message: 'Cotação enviada com sucesso para vendas@amilvix.com.br via Hostinger SMTP!',
                protocolo: leadProtocolo,
                messageId: info.messageId,
              }));
            } catch (error: any) {
              console.error('[Dev Server SMTP Erro]', error);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              return res.end(JSON.stringify({
                success: false,
                error: 'Falha no envio via Hostinger SMTP',
                details: error.message,
              }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), hostingerSmtpDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
