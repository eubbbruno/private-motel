# Arquivos alterados na retomada — 11/09/2026

## Home e performance
- app/page.js
- app/globals.css
- app/layout.js

O provedor Motion foi limitado às rotas que usam Framer Motion, preservando reduced motion. Não foi demonstrada redução relevante no total de JS transferido; não se atribui ganho numérico a essa alteração. sizes das imagens da faixa de suítes foi ajustado à largura real. Nenhum asset original ou preço foi modificado.

## SEO
- src/data/metadata.js (novo)
- app/suites/page.js
- app/cortesias/page.js
- app/experiencias/page.js
- app/estrutura/page.js
- app/sobre-nos/page.js
- app/promocoes/page.js
- app/contato/page.js
- app/reservas/page.js
- app/politica-privacidade/page.js
- app/termos-uso/page.js
- app/lgpd/page.js
- app/termos-whatsapp/page.js
- app/admin/reservas/page.js

## Provedor Motion localizado e noindex de confirmação
- app/confirmacao/layout.js (novo)
- app/lgpd/layout.js (novo)
- app/politica-privacidade/layout.js (novo)
- app/termos-uso/layout.js (novo)
- app/termos-whatsapp/layout.js (novo)

## Pendências técnicas
- app/admin/reservas/AdminReservasContent.js
- app/confirmacao/ConfirmacaoContent.js
- src/components/sections/PromocoesSection.js
- app/api/pagseguro/check-status/route.js

Consulta de pagamento explicitamente dinâmica, sem pré-renderização. Removido log do payload de sucesso; erros reais continuam registrados. Nenhuma chamada real ao PagSeguro foi feita. Resposta 400 para ausência de paymentId conferida.

## Documentação
- docs/divergencias-tarifas.md (novo)
- docs/sprint-final.md (este arquivo)

public/cardapio.pdf foi adicionado pelo proprietário e preservado. HTTP 200, application/pdf, assinatura %PDF- e abertura em nova aba conferidos.

## Validação
- Home e seis páginas principais: 375, 768, 1024 e 1440 px.
- Metadados das 13 rotas públicas, sitemap, robots; noindex em administração e confirmação.
- Imagens, ausência de overflow, fontes, menu mobile, teclado, lightbox e gestos, formulários de contato/reservas e URLs WhatsApp.
- Home: CLS 0 observado no teste local desta rodada; não representa medição de campo/Core Web Vitals.
- Lint: zero erros/avisos ESLint. Typecheck e build: aprovados.
- Avisos de ferramentas: node-linker do npm e base caniuse-lite desatualizada; dependências não foram alteradas.
- Google Maps depende de rede externa bloqueada neste ambiente. Não certificado visualmente.
- Nenhum envio de mensagem, pagamento ou deploy.

## Preview
Apto para preview de revisão. Antes de publicação comercial: resolver tarifas/duração e validar serviços externos no ambiente Vercel. O histórico de arquivos de ambiente rastreados já registrado no AGENTS.md requer revisão de credenciais antes de compartilhar/publicar o repositório; não houve alteração de infraestrutura neste sprint.
