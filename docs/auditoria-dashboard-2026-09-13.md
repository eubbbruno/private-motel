# Auditoria e plano do dashboard — 13/09/2026

Estado auditado: branch preview/private-motel-redesign-2026, commit 971d732. Esta rodada é de diagnóstico e planejamento; não modifica integrações, produção ou dependências.

## Segurança: pendências antes de ampliar a operação

- npm audit --omit=dev: 15 alertas (4 críticos, 3 altos, 7 moderados, 1 baixo). São alertas de dependências, não prova de exploração. Dependências diretas sinalizadas: next, nodemailer, pagseguro-node, sweetalert2, swiper. O registry sugeriu Next 14.2.35; validar versão corrigida no momento da atualização e testar. Nodemailer/Swiper envolvem mudanças maiores; não executar audit fix --force.
- app/api/send-whatsapp/route.js, app/api/send-email/route.js e app/api/send-contact/route.js não apresentam autenticação ou rate limiting no handler. Com configuração ativa, podem permitir abuso de envios. send-email recebe destinatário e dados de confirmação do solicitante; templates interpolam HTML sem escape. Preservar consumidores conhecidos e proteger endpoints antes de habilitar operação.
- app/api/webhook/evolution/route.ts: ausência de verificação de assinatura/autenticidade no handler, processamento da resposta IA não aguardado, risco de perda/duplicação. Não ativar como substituto do atendimento sem corrigir.
- app/admin/reservas/AdminReservasContent.js verifica sessão no cliente e acessa reservations diretamente. A segurança depende das políticas reais do banco; elas não foram acessadas. supabase/migrations/001_initial.sql não habilita RLS nas tabelas de conversas. Ausência no arquivo não comprova estado remoto. Verificar autorização por função, RLS, sessões, MFA e trilha de auditoria antes do novo painel.
- Credenciais históricas permanecem potencialmente expostas até confirmação de rotação. Nomes documentados em integracoes-preview.md. Não foram lidos/exibidos valores nesta auditoria.
- Não houve testes de exploração, envio real, pagamento, alteração de banco ou rotação de credenciais.

## SEO e mobile

Verificação em navegador do build local, sete rotas: /, /suites, /cortesias, /experiencias, /estrutura, /contato, /reservas. Todas HTTP 200; titles/descriptions próprios, canonical e og:url corretos por rota, um H1, nenhuma imagem sem atributo alt e nenhum overflow horizontal em 375px. Sem pageerror. Isso não certifica qualidade de todos os textos alternativos ou todos os estados interativos.

Sitemap, robots e JSON-LD LodgingBusiness existentes. Administração usa noindex; robots não é controle de acesso. Ainda verificar Search Console, indexação real, host preferencial em produção e dados comerciais do Perfil da Empresa. Não prometer rankings. A expressão comercial “5 Estrelas” já existia; não foi validada como classificação oficial.

Última rodada funcional também validou 375/768/1024/1440, imagens, sobreposições e WhatsApp sem envio. Novo dashboard deve ter navegação própria e não carregar JS administrativo nas páginas públicas.

## Lighthouse mobile — diagnóstico local

Lighthouse 13.4.1, build de produção servido em localhost:3029, simulação mobile:

| Categoria/métrica | Resultado |
| --- | --- |
| Performance | 75 |
| Acessibilidade | 96 |
| Boas práticas | 100 |
| SEO | 100 |
| FCP | 1,7 s |
| LCP | 8,4 s |
| TBT | 0 ms |
| CLS | 0 |

O JSON do relatório foi gerado sem runtimeError/runWarnings; o comando terminou com EPERM na remoção da pasta temporária do Chrome. Resultados são de laboratório local, não PageSpeed remoto nem Core Web Vitals de usuários reais. Boas práticas 100 não é auditoria de segurança.

Prioridades: confirmar otimização real do endpoint /_next/image na Vercel (localmente algumas respostas mantiveram dimensões originais); otimizar versões do hero e fotos de suíte sem substituir originais; ajustar sizes; medir fontes/CSS da primeira dobra. Lighthouse estimou ~1,1 MiB economizável em imagens. Corrigir contraste do eyebrow gastronômico (#806438 sobre #e9e2d5: 4,29:1). Reavaliar depois com mobile/desktop no Preview e dados reais após lançamento. Meta: LCP <=2,5 s, INP <=200 ms, CLS <=0,1 no percentil 75; não prometer nota 100.

## Sequência proposta

1. Segurança e performance do site: corrigir dependências e exposição das APIs, confirmar políticas do banco, validar rotação, medir Preview.
2. Fundação do dashboard: login, permissões de proprietário/gerente/recepção/social, auditoria, navegação e estados sem dados fictícios apresentados como reais. Definir banco/autenticação a partir da operação existente antes de adicionar serviços.
3. Social Media e campanhas (prioridade 1 confirmada em 14/09): biblioteca de assets aprovados, calendário, criação de legendas/artes, revisão e exportação. Depois OAuth Meta, publicação/agendamento, renovação de tokens e tratamento de falhas. Incluir gestão de pop-ups do site conforme roadmap-dashboard.md.
4. Reservas e Motel+ (prioridade 2): primeiro integração somente leitura; depois criação, edição, cancelamento e motor de reservas. Checkout/gateway a definir. Confirmar sincronização com recepção, disponibilidade futura, concorrência e idempotência antes de vender online.
5. WhatsApp (prioridade 3): caixa compartilhada, distribuição de atendimento, respostas rápidas, notas e intervenção humana. Pilotar API oficial e validar migração antes de cancelar ManyChat.

## Custos e limites

Trocar ManyChat elimina sua assinatura somente após migração, mas continuam possíveis custos Meta, hospedagem, banco, armazenamento, IA e manutenção. Calcular economia com fatura atual, volume/categorias de mensagens e quantidade de atendentes. Não cancelar antes do piloto aprovado.

Social Media pode reduzir trabalho recorrente com geração de propostas e aprovação; não substitui automaticamente estratégia, captação de imagens reais ou julgamento editorial. Publicação por API depende de conta profissional, permissões e configuração Meta. Começar com criação/exportação reduz dependência da integração de publicação.

Fontes oficiais consultadas:
- https://nextjs.org/blog/security-update-2025-12-11
- https://whatsappbusiness.com/products/platform-pricing/
- https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api
- https://web.dev/articles/vitals

Atualização 14/09/2026: sistema confirmado Motel+; tutorial e OpenAPI acessíveis. Prioridades: Social Media, reservas e WhatsApp. Credenciais PlugPlay disponíveis com o proprietário, ainda não solicitadas nem utilizadas. Detalhes em roadmap-dashboard.md. Para orçamento comparativo ainda faltam custo ManyChat/social e volume mensal de atendimento/posts.
