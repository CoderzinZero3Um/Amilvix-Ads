# CONFIGURAÇÃO DE E-MAIL SMTP DA HOSTINGER (AMILVIX AUTOMAÇÃO)

Para que o formulário da Landing Page envie os dados diretamente e sem intermediários para **vendas@amilvix.com.br**, preencha as variáveis de ambiente no painel da sua hospedagem na **Hostinger**.

---

### Dados Oficiais do Servidor SMTP da Hostinger:

| Campo | Valor Recomendado | Valor Alternativo |
| :--- | :--- | :--- |
| **Servidor SMTP (Host)** | `smtp.hostinger.com` | `smtp.hostinger.com` |
| **Porta SMTP** | `465` (SSL) | `587` (TLS / STARTTLS) |
| **Segurança / SSL** | `true` (para porta 465) | `false` (para porta 587) |
| **Usuário SMTP** | `vendas@amilvix.com.br` | `vendas@amilvix.com.br` |
| **Senha SMTP** | *(A senha que você criou para o e-mail no painel da Hostinger)* | *(mesma senha)* |
| **Remetente (From)** | `Amilvix Automação <vendas@amilvix.com.br>` | `vendas@amilvix.com.br` |

---

### Onde colar essas configurações na Hostinger:

#### Opção A: No arquivo `.env` na raiz do seu projeto
Abra o Gerenciador de Arquivos da Hostinger, crie ou edite o arquivo `.env` na raiz da aplicação com o conteúdo:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=vendas@amilvix.com.br
SMTP_PASS=COLOQUE_AQUI_A_SENHA_DO_EMAIL_VENDAS
SMTP_FROM="Amilvix Automação <vendas@amilvix.com.br>"
```

#### Opção B: Nas Variáveis de Ambiente da Hostinger (Se estiver usando aplicação Node.js)
1. No painel da Hostinger (hPanel), acesse a sua aplicação Node.js.
2. Vá em **Environment Variables / Variáveis de Ambiente**.
3. Adicione cada chave e valor:
   - `SMTP_HOST` = `smtp.hostinger.com`
   - `SMTP_PORT` = `465`
   - `SMTP_SECURE` = `true`
   - `SMTP_USER` = `vendas@amilvix.com.br`
   - `SMTP_PASS` = *(sua senha)*
   - `SMTP_FROM` = `Amilvix Automação <vendas@amilvix.com.br>`
4. Clique em **Salvar** e reinicie a aplicação.

---

### O que o servidor faz:
Assim que o solicitante envia o formulário, o servidor conecta via SSL criptografado (TLS v1.2+) diretamente no servidor `smtp.hostinger.com` e dispara o e-mail autenticado com layout profissional para `vendas@amilvix.com.br`, contendo protocolo, nome, empresa, e-mail, telefone e descrição da peça.
