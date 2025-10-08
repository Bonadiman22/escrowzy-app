# Escrowzy 🎮💸 - Repositório de Desenvolvimento

**Bem-vindos ao desenvolvimento da Escrowzy! Este repositório serve como ponto central para o planejamento e desenvolvimento do back-end da nossa plataforma.**

---

### Status Atual do Projeto (Outubro de 2025)

* ✅ **Front-End (UI/UX):** Design e protótipo funcional criados na plataforma No-Code **Lovable**. As principais telas e fluxos de usuário estão definidos e podem ser visualizados na pasta `/assets`.
* ⏳ **Back-End:** **A iniciar.** O objetivo é construir a infraestrutura de back-end utilizando **Supabase**.
* 🎯 **Próximo Objetivo:** Estruturar o banco de dados e iniciar o desenvolvimento da lógica de autenticação e criação de campeonatos.

---

### 📝 Roadmap de Desenvolvimento do Back-end

Esta é a nossa lista de tarefas prioritárias. Vamos usar a aba "Issues" para detalhar cada item.

- [ ] **Fase 1: Fundação**
    - [ ] Definir e criar o esquema do banco de dados no Supabase (tabelas `users`, `tournaments`, `participants`, `transactions`).
    - [ ] Implementar autenticação de usuários (Login com E-mail/Senha e Google).
    - [ ] Criar API básica para gerenciamento de perfil de usuário.

- [ ] **Fase 2: Lógica Principal**
    - [ ] Desenvolver a lógica para criação de campeonatos e convites de amigos.
    - [ ] Implementar o sistema de "carteira virtual" (wallet) associado ao usuário.
    - [ ] Integrar com o Gateway de Pagamento para depósitos (funcionalidade de escrow).

- [ ] **Fase 3: O Árbitro Virtual (MVP)**
    - [ ] Criar a lógica para confirmação mútua de resultados de partidas.
    - [ ] Desenvolver o fluxo de "disputa" para mediação manual.
    - [ ] Implementar a liberação automática do pagamento para o vencedor após a confirmação.

- [ ] **Fase 4: Expansão (Pós-MVP)**
    - [ ] Pesquisar e integrar a primeira API de um jogo (ex: League of Legends) para automação de resultados.
    - [ ] Desenvolver o sistema de campeonatos públicos.

---

### 👨‍💻 Para o Desenvolvedor de Back-end (Nosso Guia)

O front-end no Lovable se comunicará com o back-end via API REST. O Supabase auto-gera grande parte dessa API a partir do banco de dados.

Nossa lógica customizada (pagamentos, validação de regras, etc.) será construída utilizando **Supabase Edge Functions** (TypeScript/JavaScript), que ficarão versionadas aqui na pasta `/backend`.

**Links Úteis:**
* [Documentação do Supabase](https://supabase.com/docs)
* [Guia sobre Edge Functions](https://supabase.com/docs/guides/functions)

---

### 🛠️ Tecnologias

* **Front-End:** [Lovable](https://lovable.dev/)
* **Back-End:** [Supabase](https://supabase.io/)
* **Banco de Dados:** A definir (Ex: PostgreSQL)
* **Gateway de Pagamento:** A definir (Ex: Stripe Connect, Pagar.me).

---

### 🖼️ Telas do Front-End

As telas finalizadas do front-end estão na pasta `/assets` para referência visual.

## Project info

**URL**: https://lovable.dev/projects/ca68a734-991b-433f-9633-e94d72b35bc7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ca68a734-991b-433f-9633-e94d72b35bc7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ca68a734-991b-433f-9633-e94d72b35bc7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
