# Conectar o novo projeto Private Motel

## Estado atual — campanhas, 15/09/2026

O usuário pessoal brunobriote@hotmail.com já existe, tem owner em app_metadata e o login/CRUD real foi validado. Não criar outra conta nem repetir migrações. Esta seção substitui as pendências históricas abaixo.

Migrações dashboard_content e dashboard_campaign_media aplicadas. Bucket privado campaign-art criado com WebP e limite de 6 MB. Upload server-side autentica, verifica formato/dimensões, remove metadados e redimensiona até 1800 px. Usa sessão do próprio usuário e RLS, sem service role. Artes não são sobrescritas; limpeza de uploads não referenciados fica para gestão posterior da biblioteca.

DASHBOARD_CAMPAIGNS_ENABLED=true foi definido apenas em .env.local; nenhuma variável Vercel foi alterada. A Home consulta uma campanha de maior prioridade vigente após 8 segundos, sem exigir rolagem e sem sobrepor aviso de cookies/diálogo. A frequência local de 24h começa quando o visitante fecha o popup ou usa o CTA. O link de teste do painel ignora espera e frequência. Anônimos não leem briefing/título interno. URLs assinadas públicas duram 60 segundos; pausa impede novas consultas, mas um arquivo já carregado não é recolhido do navegador.

Lint/typecheck/build e testes de lógica/Sharp/API aprovados. RLS de campanhas/artes foi testada no Postgres em transação revertida. Login e salvamento real de rascunho passaram. Uma campanha QA permanece arquivada. O upload real do proprietário, o armazenamento privado, a prévia assinada e o popup na Home foram verificados no navegador. Advisor de segurança atual aponta proteção contra senhas vazadas desativada: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . Nenhuma configuração Auth foi modificada para ocultar o aviso.

## Atualização de 15/09/2026 — configuração feita pelo conector

**Não execute novamente o SQL abaixo.** O projeto `bdsotvkxmnvadrjogdxr` foi confirmado pelo conector e a migração `dashboard_content` já foi aplicada. As tabelas dashboard_posts/dashboard_campaigns estão com RLS. A função de autorização está no schema não exposto private_dashboard. Advisors de segurança retornaram lista vazia.

Testes no Postgres real cobriram proprietário, editor, usuário sem função (incluindo user_metadata forjado), acesso anônimo e incremento de versão. Toda a transação de teste foi revertida; nenhum usuário de teste permaneceu.

A conexão LOCAL usa variáveis exclusivas `NEXT_PUBLIC_DASHBOARD_SUPABASE_URL` e `NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY` (publishable), mantendo as variáveis antigas intocadas. Não alterar as variáveis antigas conforme o procedimento histórico abaixo. Nenhuma variável remota da Vercel foi alterada.

O painel está em `/dashboard`, com login Supabase, sessão por aba, CRUD editorial, busca, revisão/aprovação, arquivamento/restauração e cópia de texto. APIs validam a sessão e o banco valida a função atual. A interface não apresenta aprovação como postagem real em rede social nem como pop-up exibido no site.

**Única pendência do proprietário:** no Supabase, Authentication → Users → Add user → Create new user; definir e-mail e senha privada. Informar ao assistente somente o e-mail usado para atribuição explícita de owner. Não enviar senha nem credenciais privilegiadas. Ainda não foi criado ou promovido nenhum usuário pessoal.

QA visual/funcional simulado em 1440/768/375px passou para login, criação, edição, arquivamento, restauração, navegação e logout. Login pessoal e CRUD via sessão real ainda dependem do usuário acima. Publicação Meta, geração de artes, upload e exibição de pop-ups não estão implementados nesta entrega. Produção não foi alterada.

---
Procedimento histórico de preparação (substituído pela atualização acima):

O proprietário criou o projeto `private-motel` na organização `private-motel`. O projeto ainda não foi conectado nem alterado por esta tarefa. Não executar a migração legada 001: ela pertence ao atendimento Evolution/Bella.

## 1. Identificar a conexão (sem senhas)

No projeto, use Connect ou Settings/API para encontrar a Project URL. Informe ao assistente somente a URL `https://….supabase.co` para confirmar o destino. A chave pública publishable/anon pode ser configurada localmente; nunca usar secret/service_role no navegador.

Em `.env.local`, preservar as outras variáveis e preencher:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=URL_DO_NOVO_PROJETO
NEXT_PUBLIC_SUPABASE_ANON_KEY=CHAVE_PUBLICA_PUBLISHABLE_OU_ANON
```

Não colar senha do banco, secret key ou service_role no chat. Não editar `.env.production` ou variáveis da Vercel nesta etapa. Reiniciar o servidor local após mudar estas variáveis. A mudança da conexão pública também afeta o painel legado; ele não deve ser considerado um painel de reservas funcional no novo banco vazio.

## 2. Criar as tabelas preparadas

Após revisar o arquivo, abra **SQL Editor → New query**, cole integralmente `supabase/migrations/002_dashboard_content.sql` e execute uma única vez no projeto novo. Ele cria apenas duas tabelas de conteúdo, funções, índices, triggers e políticas RLS. Não cria reservas nem altera tarifas. Se houver erro, não desative RLS: informe a mensagem, sem credenciais.

Os recursos preparados são posts editoriais e registros de campanhas. Status published ainda NÃO exibe pop-up no site: upload de arte, datas, leitura pública e componente de exibição pertencem à próxima entrega. Nenhum conteúdo é liberado para visitantes por esta migração.

## 3. Criar seu usuário

Em **Authentication → Users → Add user**, crie seu usuário com seu e-mail e uma senha exclusiva. Guarde a senha; não a envie ao assistente. Copie o UUID do usuário criado.

No SQL Editor, substitua APENAS o UUID abaixo pelo seu usuário. Este comando não cria nem troca senha:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"private_motel_role":"owner"}'::jsonb
where id = 'COLE-O-UUID-DO-SEU-USUARIO'::uuid;
```

Verifique que o resultado corresponde a uma linha. Nunca atribua owner via user_metadata ou cadastro público. O perfil editor tem edição de rascunhos, mas não pode alterar campanhas publicadas. Permissões são verificadas novamente no banco usando o registro atual do usuário.

## Estado da entrega

- APIs privadas GET/POST/PATCH `/api/dashboard/content/posts` e `/api/dashboard/content/campaigns` preparadas. Limite de listagem de 100 registros; título até 160 caracteres; texto até 10.000. PATCH exige id e version para recusar alterações concorrentes com 409.
- Arquivamento usa status archived; não há exclusão física. Posts têm draft/review/approved/archived; campanhas draft/published/paused/archived.
- Nenhuma publicação Instagram/Facebook ou pop-up real, agendamento, upload, geração de arte/IA ou integração Resend foi ativada.
- Esquema SQL ainda precisa ser executado e testado no Supabase; validação de código não comprova RLS real. Próximo passo é testar usuário owner/editor/sem função e anônimo com dados de teste, antes de habilitar a interface operacional.
- Não houve deploy, criação remota automática, mudança em produção ou modificação do atendimento ManyChat.
