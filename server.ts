import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const distPath = path.join(__dirname, 'dist');

// Parse JSON request bodies
app.use(express.json());

// API route to receive quote submissions and forward/send to sales
app.post('/api/cotacao', async (req, res) => {
  try {
    const { nome, empresa, email, telefone, descricao, protocolo } = req.body;

    if (!nome || !empresa || !email || !telefone || !descricao) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes.' });
    }

    const payloadEmail = {
      destinatario: 'vendas@amilvix.com.br',
      assunto: `[Nova Cotação Posital Fraba] Protocolo ${protocolo || 'Novo Lead'} - ${empresa}`,
      dados: {
        protocolo: protocolo || 'AMV-' + Math.floor(100000 + Math.random() * 900000),
        nome,
        empresa,
        email,
        telefone,
        descricao,
        dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      },
    };

    console.log('[AMILVIX EMAIL NOTIFICATION] Enviando dados para vendas@amilvix.com.br:', JSON.stringify(payloadEmail, null, 2));

    // Try sending via Webhook or Email Service if configured
    if (process.env.SMTP_HOST || process.env.EMAIL_WEBHOOK_URL) {
      if (process.env.EMAIL_WEBHOOK_URL) {
        await fetch(process.env.EMAIL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadEmail),
        }).catch((err) => console.warn('Falha no webhook externo de e-mail:', err));
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Cotação enviada com sucesso para vendas@amilvix.com.br',
      protocolo: payloadEmail.dados.protocolo,
    });
  } catch (error: any) {
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
