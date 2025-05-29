# Guia de Configuração do Supabase

Este guia mostra como configurar o Supabase para o Private Motel.

## 1. Criar uma conta no Supabase

1. Acesse o site do Supabase: https://supabase.com/
2. Clique em "Start your project" ou "Sign up" para criar uma conta
3. Você pode se cadastrar usando GitHub, GitLab, Google ou email/senha

## 2. Criar um novo projeto

1. Depois de fazer login, clique em "New Project"
2. Escolha uma organização (ou crie uma nova)
3. Preencha os detalhes do projeto:
   - **Name**: `private-motel` (ou outro nome de sua escolha)
   - **Database Password**: Crie uma senha forte e anote-a em um local seguro
   - **Region**: Escolha a região mais próxima de você (ex: `sa-saopaulo` para Brasil)
   - **Pricing Plan**: O plano gratuito é suficiente para começar

4. Clique em "Create new project" e aguarde a criação (pode levar alguns minutos)

## 3. Configurar as variáveis de ambiente

1. Dentro do painel do projeto, vá para "Settings" > "API" na barra lateral
2. Copie os valores de:
   - **Project URL**: Copie para `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: Copie para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Adicione estes valores ao arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

## 4. Criar a tabela de reservas

1. No painel do Supabase, vá para "Table Editor" na barra lateral
2. Clique em "New Table"
3. Configure a tabela:

   - **Name**: `reservations`
   - **Enable Row Level Security (RLS)**: Deixe desmarcado por enquanto
   - **Columns**:
     - `id` (tipo: `uuid`, Primary Key, Default: `uuid_generate_v4()`)
     - `suite` (tipo: `text`, Not Null)
     - `check_in_date` (tipo: `timestamp with time zone`, Not Null)
     - `check_in_time` (tipo: `text`, Not Null)
     - `period` (tipo: `text`, Not Null)
     - `name` (tipo: `text`, Not Null)
     - `email` (tipo: `text`, Not Null)
     - `phone` (tipo: `text`, Not Null)
     - `payment_method` (tipo: `text`, Not Null)
     - `total_price` (tipo: `numeric`, Not Null)
     - `payment_status` (tipo: `text`, Default: 'Pendente')
     - `status` (tipo: `text`, Default: 'Pendente')
     - `created_at` (tipo: `timestamp with time zone`, Default: `now()`)
     - `updated_at` (tipo: `timestamp with time zone`, Nullable)
     - `payment_url` (tipo: `text`, Nullable)
     - `qr_code_url` (tipo: `text`, Nullable)

4. Clique em "Save" para criar a tabela

## 5. Integrar no código

Já integramos o Supabase no código do projeto. Aqui está o que foi feito:

1. Instalamos a biblioteca `@supabase/supabase-js`:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Criamos o arquivo `app/supabase.js` para configurar a conexão e funções auxiliares

3. Nos componentes, substituímos as chamadas do Firebase pelas do Supabase

## 6. Testes e migração de dados

1. Você pode importar dados existentes do Firebase para o Supabase usando o formato CSV ou JSON
2. Para exportar do Firebase:
   - No console do Firebase, vá para Firestore Database
   - Escolha a coleção `reservations`
   - Clique nos três pontos e escolha "Export Collection"

3. Para importar no Supabase:
   - No painel do Supabase, vá para "Table Editor" > `reservations`
   - Clique em "Import" e siga as instruções para carregar seus dados

## Notas importantes

- O Supabase usa PostgreSQL, que é mais estruturado que o Firestore (NoSQL)
- As consultas são similares a SQL, mais previsíveis e com melhor desempenho
- O Supabase oferece autenticação, armazenamento e funções de borda, similares ao Firebase
- O plano gratuito inclui:
  - 500MB de banco de dados
  - 1GB de armazenamento
  - 2GB de transferência
  - 50.000 usuários ativos mensais
  - Adequado para desenvolvimento e projetos pequenos

## Próximos passos

1. Considere implementar Row Level Security (RLS) quando for para produção
2. Configure backups regulares do banco de dados
3. Crie usuários e permissões para controle de acesso
4. Explore a API de armazenamento para gerenciar arquivos e imagens 