# 🌙 Pousada Sol e Lua – Sistema de Reservas Online

Este projeto é uma aplicação web completa para a **Pousada Sol e Lua**, que reúne:

- **Site institucional** com páginas de apresentação da pousada;
- **Sistema de reservas online**, permitindo que o hóspede simule e registre reservas pela internet;
- **Autenticação de usuários**, com controle de sessão;
- **Painel administrativo**, para acompanhamento e gestão de reservas;
- **Área de perfil**, para o usuário gerenciar seus próprios dados.

O objetivo é digitalizar o processo de reservas, evitando controles manuais (planilhas, cadernos, mensagens soltas em aplicativos) e centralizando tudo em uma única interface.

---

## 🧱 Tecnologias utilizadas

As principais tecnologias usadas no projeto são:

- **Vite + React + TypeScript** – base do frontend, garantindo rápida inicialização e tipagem estática;
- **React Router** – para navegação entre as páginas da aplicação (home, reservas, admin etc.);
- **Tailwind CSS** – estilização e responsividade;
- **shadcn/ui** – biblioteca de componentes prontos (botões, modais, cards, formulários);
- **date-fns** – manipulação e formatação de datas (cálculo de diárias, bloqueio de datas, etc.);
- **Supabase** – responsável por:
  - Autenticação de usuários (login/cadastro);
  - Banco de dados (Postgres) para reservas, perfis, papéis de usuário;
- **React Hook Form + Zod** – formulários com validação.

---

## 🗂 Visão geral da estrutura do projeto

A estrutura pode variar um pouco, mas, em geral, você encontrará algo como:

- `src/`
  - `pages/`
    - `Index.tsx` – página inicial (apresentação da pousada);
    - `Acomodacoes.tsx` – lista de quartos/acomodações disponíveis;
    - `Reservas.tsx` – fluxo da reserva online (escolha de datas e quarto);
    - `Galeria.tsx` – fotos da pousada;
    - `Contato.tsx` – informações de contato e formulário;
    - `Admin.tsx` – painel de administração de reservas (somente para administradores);
    - `Profile.tsx` – perfil do usuário logado;
    - `Auth.tsx` – telas de login/cadastro;
    - `NotFound.tsx` – página 404;
  - `components/` – cabeçalho, rodapé, cards, formulários, layout etc.;
  - `hooks/`
    - `useAuth.ts` – lida com autenticação, dados do usuário logado e papéis (admin/usuário);
    - `useRoomAvailability.ts` – lida com a lógica de disponibilidade das acomodações;
  - `integrations/supabase/`
    - `client.ts` – configuração do cliente Supabase;
    - `types.ts` – tipagens vinculadas ao banco de dados.
- `supabase/`
  - `migrations/` – scripts SQL que criam as tabelas, relacionamentos e funções do banco.

---

## 🎯 Funcionalidades principais

### 1. Site institucional

Sem precisar de login, qualquer visitante consegue:

- Ver a **página inicial**, com:
  - Apresentação da pousada;
  - Seções de destaque (serviços, diferenciais, localização etc.);
- Acessar a página de **Acomodações**, com:
  - Tipos de quartos (ex.: Standard, Suíte, Chalé);
  - Descrições, capacidade e informações gerais;
- Ver a **Galeria**, com fotos da pousada;
- Entrar em **Contato**, por meio de:
  - Formulário no site;
  - Botões de ação rápida (ex.: WhatsApp, telefone, e-mail).

### 2. Sistema de reservas online

Na página de **Reservas**, o visitante (logado ou não) pode:

1. **Escolher uma acomodação**;
2. **Selecionar datas de check-in e check-out**;
3. Informar **quantidade de hóspedes**;
4. Preencher seus **dados de contato**;
5. Confirmar a reserva.

Por trás, o sistema:

- Consulta no banco se já existem reservas para aquela acomodação;
- Bloqueia as datas que já estão ocupadas;
- Impede reservas em intervalos que gerariam conflito;
- Calcula o valor total com base no número de diárias;
- Salva a reserva no banco, geralmente com status inicial `pending` (pendente).

### 3. Autenticação e perfis

O sistema conta com autenticação via **Supabase Auth**:

- Usuário pode **criar conta** (cadastro) com e-mail e senha;
- Usuário pode **fazer login**;
- Depois de logado, consegue acessar:
  - Sua **área de perfil**;
  - Suas próprias informações usadas em reservas;
- Dependendo do papel, o usuário tem mais ou menos permissões:
  - `user` – usuário comum;
  - `admin` – usuário administrador (acesso ao painel admin).

### 4. Painel administrativo

A página **Admin** é protegida e liberada apenas para usuários com papel de **admin**.

Nela, normalmente é possível:

- Visualizar uma **lista de todas as reservas** cadastradas;
- Ver dados como:
  - Nome do hóspede;
  - Acomodação;
  - Datas de check-in e check-out;
  - Quantidade de hóspedes;
  - Valor total e status;
- Atualizar o **status da reserva** (ex.: de pendente para confirmada ou cancelada);
- Conferir reservas futuras, reservas em andamento e reservas passadas.

### 5. Perfil do usuário

Na página de **Perfil**, o usuário logado pode:

- Visualizar seus dados básicos (nome, e-mail, telefone etc.);
- Atualizar alguns dados pessoais (conforme implementado no projeto);
- Em certos cenários, visualizar o histórico das reservas ligadas à sua conta.

---

## ⚙️ Pré-requisitos para executar o projeto

Antes de rodar o projeto localmente, você precisa ter:

1. **Node.js** instalado  
   - Recomenda-se a versão **18** ou superior.

2. Um gerenciador de pacotes:
   - `npm` (já vem com o Node.js);
   - ou `yarn`, ou `pnpm` (se você preferir).

3. Uma conta no **Supabase**:
   - Para criar o banco de dados;
   - Para configurar a autenticação.

Se ainda não tiver uma conta no Supabase, crie gratuitamente em:  
[https://supabase.com](https://supabase.com)

---

## 🛢️ Configurando o Supabase (banco e autenticação)

### 1. Criar projeto no Supabase

1. Acesse o painel do Supabase;
2. Clique em **New project**;
3. Defina:
   - Nome do projeto (ex.: `pousada-sol-e-lua`);
   - Senha do banco de dados;
   - Região;
4. Aguarde o Supabase criar a infraestrutura.

### 2. Criar as tabelas via migrations (SQL)

Dentro do projeto, existe uma pasta semelhante a:

`supabase/migrations/`

Você pode usar o conteúdo do arquivo principal de migração para criar o esquema do banco.

Passos usando o próprio painel do Supabase:

1. No painel, vá até **SQL Editor**;
2. Crie uma nova query;
3. Copie e cole o conteúdo do arquivo `.sql` da pasta `migrations`;
4. Clique em **Run** para executar o script;
5. Confirme, no menu **Table Editor**, se as tabelas foram criadas (ex.: `bookings`, `profiles`, `user_roles`, etc.).

> Se preferir, também é possível usar o **Supabase CLI** para rodar as migrations, mas o caminho via SQL Editor costuma ser mais simples.

### 3. Obter URL e chave pública (para o frontend)

No painel do Supabase:

1. Acesse **Project Settings > API**;
2. Copie:
   - **Project URL** (URL base do seu projeto);
   - **anon public key** (chave pública usada pelo frontend).

Esses dados serão usados nas variáveis de ambiente do Vite/React.

---

## 🔐 Variáveis de ambiente

O cliente do Supabase no frontend é configurado por variáveis de ambiente.  
Crie um arquivo na raiz do projeto chamado **`.env.local`** com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_ANON_PUBLIC_KEY_AQUI
```

Substitua:

- `SEU-PROJETO` pela parte correta da URL do seu projeto;
- `SUA_ANON_PUBLIC_KEY_AQUI` pela chave `anon` que você copiou no painel.

> Importante:
> - O prefixo **`VITE_`** é obrigatório para que o Vite consiga acessar a variável;
> - Nunca exponha a **Service Role Key** no frontend (use apenas a chave pública `anon` no navegador).

---

## ▶️ Como executar o projeto em modo de desenvolvimento

Depois de configurar o Supabase e o arquivo `.env.local`, siga os passos:

### 1. Abrir o projeto

Se ainda não clonou o repositório:

```bash
git clone <url-do-repositorio>
cd PousadaSolELua
```

(Se você já tem a pasta do projeto pronta na sua máquina, apenas navegue até ela.)

### 2. Instalar dependências

Execute:

```bash
npm install
# ou
# yarn
# ou
# pnpm install
```

Isso vai baixar todas as bibliotecas necessárias (React, Tailwind, Supabase, etc.).

### 3. Rodar o servidor de desenvolvimento

Execute:

```bash
npm run dev
```

O Vite mostrará no terminal um endereço local, normalmente:

```bash
http://localhost:5173/
```

Abra esse endereço no navegador para acessar o sistema.

Sempre que você alterar um arquivo, a página será recarregada automaticamente (hot reload).

---

## 🏗️ Build e preview de produção

Quando o projeto estiver pronto para ser publicado em produção, você pode gerar o build:

```bash
npm run build
```

Os arquivos finais ficarão na pasta `dist/`.

Para testar localmente o comportamento do build de produção:

```bash
npm run preview
```

Em seguida, acesse o endereço exibido no terminal (geralmente também `http://localhost:4173` ou semelhante).

---

## 🧭 Fluxo de utilização do sistema

A seguir, um resumo do fluxo típico de uso por cada tipo de usuário.

### 1. Visitante (não logado)

- Acessa o site;
- Navega entre:
  - Home;
  - Acomodações;
  - Galeria;
  - Contato;
- Pode ir até a página de **Reservas** e simular uma reserva;
- Ao tentar finalizar uma reserva, dependendo da implementação, pode:
  - Concluir informando apenas dados pessoais e contato; ou
  - Ser convidado a criar uma conta para acompanhar a reserva.

### 2. Hóspede (usuário logado comum)

Depois de criar uma conta e fazer login:

- Pode acessar mais facilmente a página de Reservas, já com seus dados preenchidos;
- Consegue acompanhar suas próprias reservas (conforme a lógica implementada);
- Tem acesso à página de **Perfil**, onde pode:
  - Atualizar nome;
  - Alterar telefone ou outros dados de contato;
- Em alguns casos, pode cancelar ou solicitar alterações em reservas futuras (caso o projeto tenha essa funcionalidade).

### 3. Administrador (admin)

Usuário com papel de administrador:

- Faz login normalmente;
- Ao autenticar, pode ser redirecionado para o **Painel Admin**;
- No painel, consegue:
  - Ver todas as reservas;
  - Filtrar por status (pendente, confirmada, cancelada);
  - Atualizar o status de uma reserva;
  - Visualizar detalhes completos de cada reserva.

Este fluxo permite que a pousada tenha uma visão centralizada de todas as reservas, ajudando no controle de ocupação dos quartos.

---

## ✅ Resumo final

Em resumo, o projeto **Pousada Sol e Lua** é um sistema de reservas online com:

- **Frontend moderno** em React + Vite + TypeScript;
- **Estilização responsiva** com Tailwind e shadcn/ui;
- **Autenticação e banco de dados** via Supabase;
- **Site institucional completo**, com páginas de apresentação, fotos e contato;
- **Módulo de reservas**, com controle de disponibilidade por datas;
- **Área de perfil** para o usuário;
- **Painel administrativo** para gestão das reservas pela equipe da pousada.

Seguindo os passos descritos acima, você será capaz de:

1. Preparar o banco e o Supabase;
2. Configurar as variáveis de ambiente;
3. Rodar o projeto localmente em modo de desenvolvimento;
4. Gerar o build de produção para publicar o sistema em um servidor ou serviço de hospedagem.

Este README foi inteiramente escrito em português e explica, de forma detalhada, **como executar o projeto** e **qual é a sua funcionalidade geral**.
