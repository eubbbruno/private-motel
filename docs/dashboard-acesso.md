# Fundação de acesso ao dashboard

Atualização 15/09/2026: o novo projeto Supabase está conectado localmente por NEXT_PUBLIC_DASHBOARD_SUPABASE_URL/KEY, separado do legado. Interface em /dashboard implementada. Tabelas e RLS aplicadas e testadas no projeto bdsotvkxmnvadrjogdxr. Ver supabase-dashboard-setup.md para estado atual e criação do usuário pessoal; os limites abaixo registram a etapa anterior.

## Implementado localmente

`GET /api/dashboard/session` aceita Bearer token e confirma o usuário com Supabase Auth `getUser(token)` no servidor. Não confia em JWT apenas decodificado nem em sessão informada pelo navegador. Usa exclusivamente `NEXT_PUBLIC_DASHBOARD_SUPABASE_URL` e `NEXT_PUBLIC_DASHBOARD_SUPABASE_KEY`; nunca usa service role nesse endpoint. O usuário pessoal já foi autorizado como owner e o login real foi validado.

Sem autenticação retorna 401; usuário confirmado sem função autorizada, 403; configuração ausente ou falha de comunicação, 503. Respostas são privadas e não armazenáveis. Nenhum token, e-mail ou erro interno é retornado/logado.

As funções ficam em `app_metadata.private_motel_role`, que só deve ser alterado por administração confiável do Supabase. `user_metadata` não é fonte de autorização. Funções inicialmente definidas:

- `owner`: leitura/edição de Social Media e campanhas, e publicação de campanhas.
- `editor`: leitura/edição; sem publicação de campanhas.

O helper `authorizeDashboard` permite exigir uma permissão por operação. **Toda futura API de leitura/escrita do dashboard deve repetir a validação no servidor.** Consultar o endpoint de sessão no frontend não protege outra rota. APIs futuras que adotarem cookies também precisam de proteção CSRF e verificação de origem adequadas.

## Limites e recursos ainda necessários

- Não há nova tela de login, sessão em cookie, criação de usuário, recuperação de senha ou CRUD de campanhas nesta entrega.
- O painel legado `/admin/reservas` e as APIs de e-mail/ManyChat/Evolution não foram modificados por esta proteção. Não estão automaticamente protegidos por ela.
- Confirmar acesso e propriedade do projeto Supabase existente, configuração de Auth, usuários autorizados e políticas reais de RLS. Não foi usado token local privilegiado para consultar ou alterar o serviço.
- Antes de persistir Social Media/campanhas: preparar tabelas, políticas RLS, armazenamento privado de rascunhos, acesso público limitado a campanhas publicadas e registro de ações. Avisar o proprietário antes de criar esses recursos. Não armazenar artes no filesystem efêmero da Vercel.
- Atribuir `owner` ao proprietário apenas por procedimento administrativo privado no projeto confirmado. Não implementar cadastro público que atribua funções nem promover automaticamente o primeiro usuário.
- Resend não é necessário para esta fundação; não foi adicionado. Avaliar entrega de convites/recuperação de senha depois de confirmar o Auth existente e seu envio de e-mail.
- Testes em `scripts/test-dashboard-access.mjs` simulam o verificador de usuário. Não certificam login, projeto, RLS ou permissões remotas. Não houve provisionamento nem deploy.
