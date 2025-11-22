# 🌙 Pousada Sol e Lua – Sistema de Reservas Online

Este projeto é uma aplicação web completa para a **Pousada Sol & Lua**, com:

- **Site institucional** (home, acomodações, galeria, contato)
- **Sistema de reservas online** com verificação de disponibilidade
- **Autenticação de usuários** (cliente e administrador)
- **Painel administrativo** para gestão de reservas
- **Área de perfil** para o usuário atualizar seus dados

A interface é toda em **português**, responsiva e construída com componentes modernos (shadcn/ui + Tailwind).

---

## 🧱 Tecnologias utilizadas

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (design de componentes)
- **React Router** (rotas / navegação)
- **React Query** (@tanstack/react-query – cache e requisições)
- **Framer Motion** (animações de transição de página)
- **Supabase**  
  - Autenticação de usuários
  - Banco de dados Postgres (reservas, perfis, papéis)
- **date-fns** (manipulação de datas)
- **Zod** / **React Hook Form** (validação de formulários)

---

## 🗂 Estrutura básica do projeto

Algumas pastas importantes:

- `src/`
  - `pages/`
    - `Index.tsx` – página inicial (hero, sobre, serviços, depoimentos, etc.)
    - `Acomodacoes.tsx` – listagem das acomodações/quartos
    - `Galeria.tsx` – galeria de fotos da pousada
    - `Contato.tsx` – formulário de contato e informações
    - `Reservas.tsx` – fluxo completo de reserva online
    - `Auth.tsx` – tela de login/cadastro
    - `Admin.tsx` – painel de administração de reservas
    - `Profile.tsx` – perfil do usuário logado
    - `NotFound.tsx` – página 404
  - `components/` – cabeçalho, rodapé, formulários, cards, botões, etc.
  - `hooks/`
    - `useAuth.tsx` – controle de sessão, login, logout, papéis (admin/user)
    - `useRoomAvailability.tsx` – lógica de disponibilidade de quartos
  - `integrations/supabase/`
    - `client.ts` – cliente configurado do Supabase
    - `types.ts` – tipagem gerada a partir do schema do banco
- `supabase/`
  - `migrations/` – scripts SQL para criar as tabelas no banco
  - `functions/setup-initial-users/` – função para criar usuários iniciais (admin e usuário comum)

---

## ⚙️ Pré-requisitos

Para executar o projeto localmente, você precisa de:

1. **Node.js** (recomendado: versão 18 ou superior)  
2. **Gerenciador de pacotes**:
   - `npm` (padrão do Node) – ou, se preferir, `yarn` / `pnpm`
3. Uma conta no **Supabase** (gratuita) para usar:
   - Autenticação
   - Banco de dados Postgres

> 💡 Se você já possui um projeto Supabase configurado, basta reutilizar a URL e a chave pública (anon key) dele.

---

## 🛢️ Configurando o Supabase (banco + auth)

### 1. Criar o projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)  
2. Crie um novo projeto:
   - Defina o nome (ex: `pousada-sol-e-lua`)
   - Escolha região e senha do banco
3. Aguarde o provisionamento do projeto.

### 2. Obter URL e chave pública (anon/public key)

No painel do Supabase:

1. Vá em **Project Settings → API**
2. Anote:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (chave pública para o frontend)

### 3. Aplicar as tabelas (migrations)

Você tem algumas opções:

#### ✅ Opção 1 – Aplicar via SQL Editor (mais simples)

1. Abra o arquivo de migração no projeto local:  
   `supabase/migrations/20251114200331_remix_migration_from_pg_dump.sql`
2. Acesse o painel do Supabase → **SQL Editor**
3. Cole o conteúdo desse arquivo e execute o script.
4. Isso irá criar:
   - Tabelas de reservas (`bookings`)
   - Tabela de perfis (`profiles`)
   - Tabela de papéis de usuário (`user_roles`)
   - Demais estruturas necessárias.

#### ✅ Opção 2 – Usar o Supabase CLI (avançado)

Se você tiver o Supabase CLI instalado:

```bash
# Dentro da pasta do projeto
supabase link        # vincula ao projeto remoto
supabase db push     # aplica as migrations do diretório supabase/migrations
