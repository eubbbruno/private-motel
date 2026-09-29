# Dashboard Private — roadmap atualizado em 15/09/2026

## Fundação financeira local — 24/09/2026

Criada a área `/dashboard/finance`, exclusiva do proprietário e somente leitura. O Motel+ é a fonte de faturamento recebido e ocupações; o GestãoClick é a fonte planejada para contas a pagar, despesas, baixas e conferência de recebíveis. A página reúne KPIs, evolução mensal, DRE gerencial, fluxo de caixa realizado, despesas por categoria, títulos em atraso e agenda de pagamentos. O cálculo expõe cobertura e lacunas de classificação e não estima dados ausentes.

O conector GestãoClick aceita apenas host oficial HTTPS e credenciais server-side. Os nomes e o procedimento de configuração estão em `docs/gestao-click-financeiro.md`. A documentação pública confirma Access Token e Secret Access, mas deixa o contrato detalhado dentro do ERP; a primeira leitura real precisa validar caminhos, paginação e nomes de campos antes de considerar a integração concluída.

Próxima etapa financeira: configurar as credenciais localmente, comparar um mês fechado com os relatórios nativos, validar o plano de contas com a contabilidade e então acrescentar conciliação, exportação e metas. Nenhuma escrita, baixa ou pagamento automático foi habilitado.

## Continuação local em 22/09/2026

O Social Media ganhou assistência de legenda por OpenAI no próprio painel: título, canal, formato e texto existente formam o briefing; uma solicitação gera uma sugestão privada, que só altera o rascunho após escolha explícita e ainda exige salvar. A chamada usa `OPENAI_API_KEY` apenas no servidor, `OPENAI_TEXT_MODEL` opcional (padrão `gpt-4.1-mini`), resposta sem armazenamento na API e limite de 400 tokens de saída. Autorização, entradas, resultado e falhas foram testados com provedor simulado; nenhuma chamada paga ou publicação Meta foi feita. Lint, typecheck e build aprovados.

Próxima evolução de Social Media: limpar com segurança artes geradas que não estejam vinculadas a conteúdos, mantendo confirmação e trilha de uso; depois revisar o fluxo editorial completo antes de qualquer conexão com Meta. A integração Motel+ permanece somente leitura. As novas tarifas de outubro são tratadas na fonte compartilhada do site e reservas, sem sincronização de escrita com Motel+ nesta etapa.

## Biblioteca de artes — 22/09/2026

A limpeza segura da biblioteca foi implementada. Cada criação possui exclusão explícita e confirmação; a API aceita somente caminhos válidos da pasta do usuário autenticado, consulta `dashboard_posts` antes de apagar e responde com conflito quando qualquer conteúdo, inclusive arquivado, ainda referencia a arte. O usuário pode retirar a imagem do rascunho e salvar antes de tentar novamente. A exclusão permanente usa a Storage API, nunca SQL direto. A política RLS `social_media_staff_delete_own` foi aplicada ao projeto Supabase e restringe DELETE ao proprietário real do objeto, à própria pasta e aos papéis owner/editor. Nenhum arquivo real foi removido nos testes.

Próxima etapa: QA integrado do fluxo Social Media (criar rascunho, gerar legenda/arte, revisar, salvar, duplicar, exportar e limpar arte sem uso) e correções encontradas. Depois iniciar o mapeamento de tarifas e disponibilidade do Motel+ em modo leitura, sem criar reservas ainda.

## Entrega de 15/09/2026

Conector Supabase operacional; login pessoal de proprietário e salvamento real de campanha validados. Social Media tem textos, revisão, aprovação, busca e arquivamento. Campanhas receberam upload autenticado, conversão WebP, campos públicos separados do briefing, botão, datas de Brasília, prioridade e prévia. O popup foi integrado à Home, habilitado somente no build local por DASHBOARD_CAMPAIGNS_ENABLED=true. O bucket campaign-art é privado; anônimos só leem campos e artes de campanhas publicadas vigentes. Nenhum deploy.

Validação desta entrega: lint sem avisos, typecheck e build aprovados; testes de API, limites, URLs, datas e conversão real Sharp aprovados. RLS real comprovou sigilo do briefing, filtragem por período e pausa, com rollback. Dashboard autenticado salvou os novos campos e bloqueou publicação incompleta; sem overflow em 375/768/1024/1440px. O rascunho QA foi arquivado. O proprietário concluiu o upload real; Storage, prévia e exibição pública foram verificados no navegador. Advisor atual: proteção contra senhas vazadas desativada no Auth; não foi alterada nesta rodada.

Continuação: upload real feito pelo proprietário e arte assinada foram confirmados na Home. A campanha publicada passa a aparecer após 8 segundos, sem exigir rolagem; a janela de 24 horas começa somente quando o visitante fecha o popup ou usa o CTA. O painel ganhou diagnóstico e link de teste que ignora espera/frequência. Social Media agora tem canal, formato, data em Brasília, calendário mensal, duplicação, CSV, biblioteca dos assets reais, download e estúdio de IA com imagem de referência. A IA exige `OPENAI_API_KEY` server-side e nunca publica automaticamente. Migrações e RLS reais validadas; registros de QA arquivados. O sistema visual foi centralizado em `app/design-tokens.css` e documentado em `docs/design-system.md`.

Em 16/09/2026, a chave OpenAI e o acesso a `gpt-image-2.5-flare` foram confirmados por leitura. A primeira edição econômica foi recusada com `credit_balance_exhausted`, sem imagem gerada; o painel diferencia falta de saldo de limite temporário. Motel+ respondeu em leitura com 4 categorias, 50 suítes e 3 modalidades. A aba `/dashboard/motel-plus` mostra somente agregados de categorias, disponibilidade e tabelas, exclusiva do proprietário e sem endpoints de escrita.

## Próximos sprints, em ordem

1. Geração de imagens validada em 16/09/2026 com `gpt-image-2.5-flare`, imagem de referência e qualidade econômica. O estúdio agora lista as criações recentes da biblioteca privada para reutilização; a próxima melhoria é a limpeza segura de artes sem uso. Biblioteca do site, referência, download, calendário, formatos, duplicação e CSV estão prontos. Rascunhos não publicam automaticamente.
2. Geração assistida de legendas/artes, com escolha explícita de provedor e orçamento; revisão humana e preservação das fotografias reais. Depois conectar Meta, validar permissões e só então publicar/agendar em conta de teste. Ainda não há IA ou Meta conectadas ao módulo.
3. Motel+: começar por leitura de categorias/disponibilidade em ambiente de teste, mapear tarifas aprovadas e tratar concorrência antes de criação/alteração de reservas. Solicitar PlugPlay apenas por configuração privada nesta fase.
4. WhatsApp por último: painel de atendimento, histórico, distribuição para recepcionistas e integração oficial; manter ManyChat até migração comprovada. Não há corte de custos imediato antes dessa substituição.
5. Preparação de produção ao final: envs separadas, rotação de secrets históricos, revisão de autorização/abuso, QA integrado e Preview aprovado. Nenhuma data ou economia garantida.

## Ordem aprovada pelo proprietário

Pré-requisitos: corrigir as pendências de segurança/performance identificadas e estabelecer autenticação, autorização por função e armazenamento seguro para o dashboard. Nenhuma integração nova deve ser declarada funcional com base em uma interface demonstrativa.

1. Social Media e campanhas do site.
2. Reservas e integração com Motel+.
3. WhatsApp, mantendo ManyChat até migração validada.

## Social Media e campanhas

- Biblioteca compartilhada de imagens reais e artes aprovadas.
- Briefing, legendas e propostas de artes, com fatos comerciais preservados.
- Calendário editorial, rascunhos, aprovação e exportação.
- Publicação/agendamento Meta em etapa posterior, após autenticação e permissões adequadas.

### Gestão de pop-ups solicitada

Fluxo: criar campanha → enviar arte → configurar conteúdo e exibição → visualizar desktop/mobile → publicar ou agendar. A campanha publicada é consultada pelo site, sem exigir commit ou novo deploy para cada troca de arte.

- Criar, editar, duplicar, pausar e excluir campanhas; exclusão recuperável/arquivamento e registro das ações.
- Arte desktop/mobile, texto alternativo, título opcional, botão e URL de destino validada.
- Rascunho, agendado, publicado, pausado e encerrado; início/fim no fuso America/Sao_Paulo.
- Seleção de páginas, prioridade em caso de campanhas simultâneas e limite de frequência por visitante; não abrir todos os pop-ups juntos.
- Botão de fechar acessível, Escape, gestão/restauração de foco, adaptação a telas pequenas e reduced motion.
- Upload autenticado, limites de tamanho, validação real do arquivo e otimização; sem HTML/JavaScript arbitrário inserido pelo painel.
- Imagens em armazenamento persistente apropriado; filesystem temporário da Vercel não é biblioteca de mídia.
- Atualização/invalidação de cache após publicar, editar, pausar ou excluir. Prazo de propagação verificável na implementação; não prometer instantaneidade antes dos testes.
- Não atrapalhar consentimento de cookies, formulário ou navegação; evitar intersticial invasivo na entrada mobile e carregamento que prejudique LCP/CLS.
- Exemplo: campanha Dia dos Namorados com arte e CTA, publicação agendada e término automático.

## Motel+: documentação examinada, integração ainda não executada

Fontes lidas no navegador em 14/09/2026:
- Tutorial: https://areacliente.motelmais.com.br/blog/api-de-integracao/
- Referência OpenAPI: https://oxpi.com.br/api/PlugPlay/scalar/v1

O link compartilhado personalizado não é reproduzido neste arquivo. Nenhum ID/token real foi solicitado, armazenado ou usado. Exemplos da documentação não são credenciais do projeto.

### Capacidades documentadas

- Recepção local funciona sem internet; nuvem sincroniza dados, inclusive reservas, de forma bidirecional. Não interpretar isso como garantia de sincronização instantânea.
- Autenticação por cabeçalhos PLUG-PLAY-ID e PLUG-PLAY-TOKEN; credenciais por integrador com permissões específicas e revogação. Integração exclusivamente server-side.
- GET /Reserva lista reservas; POST cria; PUT edita; DELETE cancela. IDs próprios podem ser associados por integracaoId.
- GET /ReservaDisponibilidade/PorSuiteId consulta intervalo de entrada/saída para uma suíte.
- GET /CategoriaDisponibilidade retorna totais e disponíveis por categoria no momento. Não equivale à disponibilidade futura para uma reserva.
- GET /SuitesStatus mostra estado das suítes. Retornar ao site público apenas informação mínima de disponibilidade, não ocupações/dados internos.
- suiteCategoriaIntegracaoId permite mapeamento para categorias do integrador, conforme configuração no Motel+.
- OpenAPI também lista ConsultaPreco, TabelaPreco, SuiteCategoria, ReservaV2 e relatórios. Sua presença foi observada; contratos detalhados e permissões ainda precisam ser estudados antes do uso.

### Questões antes de habilitar reservas

- O tutorial diz que a recepção não pode editar reservas criadas pela integração. Confirmar aplicabilidade e definir quem corrige/cancela pelo dashboard.
- Confirmar ambiente de teste, escopos, limites de requisição, timezone, latência da sincronização, indisponibilidade da internet e método recomendado de confirmação.
- Verificar proteção contra concorrência: consultar disponibilidade e depois criar não garante sozinho ausência de reserva duplicada. integracaoId não comprova idempotência do endpoint.
- Validar duração e mapeamento de modalidades; preservar preços aprovados e exceção de 6h da Private. Divergência com tabela do Motel+ exige decisão do proprietário.
- Respostas de disponibilidade podem incluir nome de outro hóspede na mensagem; nunca repassar o corpo bruto ao visitante ou ao Social Media.
- Não usar criação de reserva como comprovante de pagamento. Checkout, confirmação financeira e conciliação precisam de contratos próprios.

### Quando pedir os dados PlugPlay

Somente na fase de conexão inicial em modo leitura. Orientar configuração privada server-side, com permissões mínimas e preferencialmente ambiente de teste. Não solicitar token em documento público, commit ou variável NEXT_PUBLIC. O Social Media e o planejamento de campanhas não dependem dessas credenciais.

## Próxima implementação delimitada

Ampliar o módulo Social Media com biblioteca de mídia e geração assistida; depois iniciar a leitura segura de disponibilidade do Motel+. Não ativar checkout nem substituir ManyChat nesta fase.

## Progresso da fundação — 14/09/2026

### Migração incremental autorizada e concluída

Este registro substitui o bloqueio de aprovação e os números intermediários abaixo.

- Next/eslint-config-next 15.5.25, React/React DOM 19.3.0, Nodemailer 10.0.10 e Swiper 14.2.0 instalados em etapas. PostCSS 8.5.28 compartilhado com Next por override específico; a resolução antiga do lockfile precisou ser regenerada para o override valer. nanoid/fflate atualizados dentro das faixas existentes.
- Raiz de tracing definida explicitamente no next.config.mjs para não incluir a pasta do usuário por causa de um lockfile externo. TypeScript recebeu target ES2017 e referência de rotas gerados pelo Next; verificações continuam habilitadas.
- Corrigida falha preexistente do template contact em /api/send-email: extrair HTML do objeto retornado antes de entregar ao Nodemailer. Destinatários, nomes EMAIL_PASS/EMAIL_PASSWORD e integração ManyChat preservados.
- Novo scripts/test-email-compatibility.cjs usa compositor real do Nodemailer com streamTransport local, cobre ambos endpoints, três templates, campos obrigatórios, destinatários, nomes de configuração e falhas simuladas. Nenhuma conexão SMTP.
- Lint, typecheck, build e os testes de integração/e-mail passaram. next lint ainda emite aviso de descontinuação, não erro; migrar o comando antes de eventual Next 16.
- QA do build final em localhost:3032: Home, Suítes, Contato, Reservas, Experiências, Cortesias e Estrutura em 375/768/1024/1440px, sem overflow ou erros de execução; H1 único/canonical presentes. Galeria abriu, navegou pelo teclado, fechou com Escape e restaurou foco. Menu mobile/Escape e foco no erro do contato passaram. Doze cenários de reserva preservaram preço e exceção de 6h da Private; WhatsApp interceptado, sem envio. PDF retornou 200.
- npm audit --omit=dev: zero vulnerabilidades conhecidas no conjunto instalado. Auditoria incluindo desenvolvimento ainda informa 12 (1 baixa, 2 moderadas, 9 altas); não declarar o projeto inteiro livre de riscos. Firebase separado não foi atualizado. SMTP real, permissões/RLS remotas, autenticação e proteção contra abuso de APIs não foram certificados.
- Nenhum commit/push/deploy, alteração de domínio, ambiente remoto, preço ou design nesta continuação. Próxima etapa: proteção das APIs e autenticação/autorização do dashboard, validando o backend existente antes de Social Media/Campanhas.

### Continuação: atualização compatível e migração preparada

- SweetAlert2 atualizado para 11.26.25 dentro da faixa 11 existente; nenhuma referência de uso encontrada em app/src na busca atual. Sem alteração de interface ou integrações.
- A tentativa de instalar Next, React, Nodemailer e outras bibliotecas simultaneamente foi rejeitada pela revisão automática de aprovação antes da execução. Next permanece 14.2.35 e React permanece 18; não considerar a migração realizada.
- Plano incremental para aprovação: (1) migrar Next/eslint-config-next para 15.5.25 e React/React DOM compatíveis com App Router, verificando também bibliotecas consumidoras; executar lint, typecheck, build e QA de reservas, contato, navegação, galeria, metadata e imagens sem envios reais; (2) atualizar Nodemailer separadamente, preservando nomes de ambiente e contratos SMTP, com transporte simulado e testes de falhas; (3) resolver Swiper e alertas transitivos remanescentes. Não usar audit fix --force.
- A busca não encontrou APIs síncronas cookies/headers/draftMode, parâmetros server-side ou request.geo/ip que exigissem os codemods correspondentes nesta base. useSearchParams de confirmação é client-side e deve manter os parâmetros id/simulado.
- Nenhum deploy ou alteração remota faz parte dessa migração. A aprovação do incremento não substitui a verificação posterior de autenticação, autorização e armazenamento antes de habilitar o dashboard.

- Atualização intermediária de Next 14.1.0 para 14.2.35 e eslint-config-next correspondente, preservando React e integrações. A consulta atual do npm identifica vulnerabilidades posteriores nessa versão: isto NÃO encerra a migração de segurança nem libera um dashboard administrativo.
- Removida a dependência raiz pagseguro-node, sem referências de importação encontradas. Endpoints continuam desativados (410); código histórico e roadmap preservados. Subprojeto Firebase não alterado.
- Corrigido contraste do pequeno título da seção gastronômica da Home.
- Lint sem avisos/erros, typecheck, build e testes simulados de ManyChat/PagSeguro passaram. Build precisou de acesso à rede para baixar as fontes; nenhuma configuração foi removida para mascarar a falha inicial.
- QA local em 375, 768, 1024 e 1440px: sem overflow/sobreposição nas áreas verificadas, botão WhatsApp respeita aviso de cookies, destino preservado, ícones sociais presentes, sem erros de execução de página. Imagens aprovadas presentes em Cortesias e Experiências. Chrome via Playwright; Browser plugin não disponível.
- npm audit --omit=dev: 7 alertas restantes (2 críticos, 3 altos, 1 moderado, 1 baixo), contra 15 antes. Não equivalem a sete explorações confirmadas. Next e Swiper permanecem entre os críticos; dependências e APIs precisam da próxima etapa de segurança.
- Nenhum commit, push, deploy, envio real, configuração remota ou alteração do banco nesta rodada. Dashboard ainda não implementado. Próximo trabalho: migração de framework compatível com correções atuais, seguida de autorização server-side e validação do armazenamento existente; então Social Media/Campanhas.
