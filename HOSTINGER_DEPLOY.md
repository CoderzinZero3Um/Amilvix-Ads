# Guia de Deploy na Hostinger para esta Landing Page

Este projeto é desenvolvido em **React** com **Vite**, que é **100% suportado nativamente pela Hostinger** (como listado na sua imagem: `Vite`, `React`, `Express`, etc.).

---

### Opção 1: Hospedagem Node.js / VPS / Cloud na Hostinger (Build & Run Automático)

Ao selecionar o framework na Hostinger:
1. **Framework:** Selecione **Vite** ou **React**.
2. **Build Command:** `npm run build`
3. **Output Directory / Pasta de Saída:** `dist`
4. **Install Command:** `npm install`
5. **Node version:** 18.x ou 20.x

---

### Opção 2: Hospedagem Compartilhada / Web Hosting Tradicional (Upload Direto)

Se você estiver em um plano de hospedagem compartilhada da Hostinger:
1. No seu ambiente, execute:
   ```bash
   npm run build
   ```
2. Uma pasta chamada **`dist`** será gerada.
3. Abra o **Gerenciador de Arquivos** no painel da Hostinger (hPanel).
4. Acesse a pasta `public_html/`.
5. Envie todo o conteúdo de dentro da pasta `dist/` para a `public_html/`.

---

### Observação Técnica:
O seu projeto já utiliza a combinação ideal suportada pela Hostinger:
- **React** (v19)
- **Vite** (v8)
- **Tailwind CSS**
- **Lucide React**

Não há necessidade de reescrever em outro framework, pois **Vite** e **React** são as principais opções da lista da Hostinger.
