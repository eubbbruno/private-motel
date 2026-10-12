# Dashboard Private — roadmap atualizado em 29/09/2026

## Estado executivo atual

- Site, reservas e tarifas: redesign e fonte compartilhada concluídos; publicação final continua pendente.
- Dashboard: autenticação Supabase, campanhas/popups, Social Media, biblioteca privada e assistência OpenAI operacionais localmente.
- Motel+: conexão real somente leitura concluída para categorias, suítes, modalidades, disponibilidade agregada e caixa mensal.
- GestãoClick: conexão real somente leitura concluída para contas a pagar e recebimentos.
- Financeiro: filtros rápidos e por datas, comparativo mensal, DRE gerencial preliminar, fluxo de caixa, conciliação Motel+ × GestãoClick, categorias, agenda, busca, filtros, detalhe, CSV e impressão implementados.
- Manutenção: módulo local implementado para histórico por suíte e equipamento, revisões vencidas/próximas, custos, fornecedores e última manutenção. A migração está pronta, mas o projeto Supabase precisa ser reativado para persistir os registros.
- WhatsApp: ManyChat permanece ativo; substituição ainda não iniciada.
- Produção: nenhuma publicação das alterações recentes. O trabalho está protegido por checkpoint local na branch de preview.

## Fundação financeira local — 24/09/2026

Criada a área `/dashboard/finance`, exclusiva do proprietário e somente leitura. O Motel+ é a fonte de faturamento recebido e ocupações; o GestãoClick é a fonte planejada para contas a pagar, despesas, baixas e conferência de recebíveis. A página reúne KPIs, evolução mensal, DRE gerencial, fluxo de caixa realizado, despesas por categoria, títulos em atraso e agenda de pagamentos. O cálculo expõe cobertura e lacunas de classificação e não estima dados ausentes.

O conector GestãoClick aceita apenas host oficial HTTPS e credenciais server-side. Os nomes e o procedimento de configuração estão em `docs/gestao-click-financeiro.md`. A documentação pública confirma Access Token e Secret Access, mas deixa o contrato detalhado dentro do ERP; a primeira leitura real precisa validar caminhos, paginação e nomes de campos antes de considerar a integração concluída.

As credenciais locais e a leitura real foram validadas. Conciliação, exportação e filtros estão implementados. A próxima etapa financeira depende de conferência humana: comparar um mês fechado com os relatórios nativos e validar o plano de contas com a contabilidade. Só depois disso devem entrar metas, orçamento e classificação gerencial persistente. Nenhuma escrita, baixa ou pagamento automático foi habilitado.

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

1. Reativar o projeto Supabase existente e aplicar a migração de manutenção; validar no navegador criação, edição, cancelamento e filtros com o usuário proprietário.
2. Motel+: transformar o mapeamento somente leitura em base do motor de reservas, começando por disponibilidade futura e regras de concorrência. Escrita de reservas somente após ambiente e contrato serem confirmados.
3. Social Media: concluir QA editorial e depois conectar Meta, validar permissões e publicar/agendar primeiro em conta de teste. Rascunhos continuam sem publicação automática.
4. Financeiro: conferir um mês fechado com os relatórios nativos e validar o plano de contas com a contabilidade antes de tratar a DRE como contábil.
5. WhatsApp por último: painel de atendimento, histórico, distribuição para recepcionistas e integração oficial; manter ManyChat até migração comprovada.
6. Preparação de produção ao final: envs separadas, rotação de secrets históricos, revisão de autorização/abuso e QA integrado. Nenhuma publicação antecipada.

## Manutenção das suítes — 29/09/2026

A rota `/dashboard/maintenance` registra, por suíte, o item ou equipamento, categoria, tipo de serviço, estado, data executada, próxima revisão, descrição, fornecedor, custo e observações. A tela destaca revisões vencidas e próximas, custo anual e a última manutenção de cada item. Pintura, gesso, hidro, sauna, ar-condicionado e TV entram como sugestões, sem limitar o cadastro de outros equipamentos.

O acesso é exclusivo do proprietário e a API usa autenticação server-side e RLS. Registros são versionados; cancelamento preserva o histórico. Não há escrita no Motel+, envio de mensagem ou automação de pagamento. A migração `20260929120000_dashboard_maintenance.sql` foi aplicada após a reativação do projeto Supabase em 12/10/2026.

## Folha e RH — 12/10/2026

A rota `/dashboard/payroll` reúne cadastro de funcionários, contratos de experiência, competências mensais, conferência da folha e rescisões. Cartão-ponto, relação de holerites e pagamentos podem ser enviados em CSV, XLSX ou PDF para um bucket privado, limitado ao proprietário por Auth e RLS. Nenhum documento de funcionário é enviado a IA.

A conferência automática usa arquivos estruturados e associa cada linha por matrícula ou nome. Compara horas noturnas, horas extras de 50% e 100%, faltas e atestados entre ponto e holerite, além do líquido do holerite contra o pagamento. PDFs ficam guardados como evidência e exigem planilha estruturada quando não houver extração confiável. O relatório detalha pendências e divergências por funcionário; o painel auxilia a conferência e não substitui validação contábil ou trabalhista.

Rescisões registram datas, aviso, bruto, descontos, líquido esperado, valor e data do pagamento, com estados de preparação até pagamento. O painel não calcula verbas legais por suposição. Contratos de experiência usam a data cadastrada no funcionário e destacam prazos próximos ou vencidos.

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
