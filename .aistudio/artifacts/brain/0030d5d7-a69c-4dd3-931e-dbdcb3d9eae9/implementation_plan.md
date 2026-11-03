# Plano de Implementação: Formulário 100% Funcional com Hostinger SMTP

## Diagnóstico do Problema
1. O backend Node.js (`server.ts` e `server.js`) possui a lógica de envio SMTP via Nodemailer, porém **não estava carregando o `dotenv`** explicitamente na inicialização nem lendo as credenciais fornecidas no arquivo `.env`.
2. Em ambiente de desenvolvimento local (`npm run dev`), o Vite roda na porta 3000 de forma isolada sem proxy para a rota `/api/cotacao`, fazendo com que o `fetch('/api/cotacao')` retorne 404/HTML em vez de acionar o Nodemailer.
3. No front-end (`App.tsx`), requisições paralelas para serviços externos gratuitos estavam mascarando o status real da conexão SMTP e gerando falsos positivos na tela.

---

## Etapas do Plano de Ação

### 1. Backend e Credenciais Hostinger (`server.ts`, `server.js`, `.env`)
- Criar o arquivo `.env` definitivo contendo as credenciais reais informadas:
  - `SMTP_HOST="smtp.hostinger.com"`
  - `SMTP_PORT="465"`
  - `SMTP_SECURE="true"`
  - `SMTP_USER="vendas@amilvix.com.br"`
  - `SMTP_PASS="Amilvix@2026"`
  - `SMTP_FROM="Amilvix Automação <vendas@amilvix.com.br>"`
- Carregar `dotenv.config()` no topo de `server.ts` e `server.js`.
- Ajustar o transporter do Nodemailer para fazer `transporter.verify()` no start e retornar status HTTP detalhado na rota `/api/cotacao` (200 com confirmação de entrega ou 500 com o erro exato do SMTP).
- Criar endpoint de teste de conectividade `/api/test-smtp` para diagnosticar a conexão com `smtp.hostinger.com:465`.

### 2. Integração no Vite para Desenvolvimento (`vite.config.ts`)
- Adicionar plugin ou middleware Express no `vite.config.ts` (ou proxy) para que `/api/cotacao` funcione nativamente durante o desenvolvimento e no preview da AI Studio, processando os envios reais via Nodemailer.

### 3. Front-end (`src/App.tsx`)
- Atualizar a função `handleSubmit` para aguardar a resposta da rota oficial `/api/cotacao`.
- Exibir mensagens claras de erro caso o SMTP recuse a conexão ou a autenticação falhe, eliminando falsos positivos de sucesso.
- Manter o protocolo único `AMV-XXXXXX` e o disparo de conversão Google Ads assim que o e-mail for aceito e despachado pelo servidor da Hostinger.

### 4. Verificação e Teste
- Testar a rota de e-mail e conferir o log de disparo do Nodemailer.
- Executar `compile_applet` e `lint_applet` para assegurar build 100% limpo para produção na Hostinger.
