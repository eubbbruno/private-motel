# Integrações e segurança do Preview — 11/09/2026

## Evidência e limites

O proprietário confirma ManyChat no atendimento das recepcionistas e informa que PagSeguro não faz parte da operação atual. Presença de código não comprova serviço configurado nem tráfego real. Nenhum teste desta rodada envia mensagens, cria cobranças, altera bancos ou publica Firebase.

| Integração | Chamadas e classificação | Configuração / impacto da ausência |
| --- | --- | --- |
| WhatsApp público | `src/data/site.js`, Header/Footer, `FormularioContato`, `app/reservas/ReservasContent.js`: preparam URL `wa.me` para atendimento. Fluxo atual preservado. | Não depende de API, token, banco ou pagamento. |
| ManyChat | `/api/send-whatsapp` chama `fb/sending/sendFlow` no servidor. `notificationService.js` já encaminhava para essa API; constantes de token/fluxo no client eram inutilizadas e foram removidas. Firebase tem chamadas distintas em `functions/index.js`, sem chamadas encontradas a elas no site atual. | Vercel: `MANYCHAT_API_KEY`, `MANYCHAT_FLOW_ID`, somente servidor. Firebase: `MANYCHAT_API_KEY` no ambiente próprio antes de qualquer futura publicação. Ausência afeta envio automatizado da API, não o link público nem a plataforma das recepcionistas. Contrato existente preservado; entrega real não certificada. |
| PagSeguro | Legado confirmado pelo proprietário. Quatro rotas `/api/pagseguro/*` agora retornam HTTP 410 sem rede, banco, e-mail ou simulação. Serviço antigo preserva helpers sem credenciais; trigger Firebase de criação com pagamento e teste de pagamento desativados. | Nenhuma variável PagSeguro necessária para Preview. Pagamento não é usado em `/reservas`. Nenhuma cobrança fica habilitada por fornecer um token. |
| Supabase | Chamadas em `/admin/reservas`, `/confirmacao`, `app/supabase.js`; `availabilityService.js` sem consumidor atual encontrado. Cliente privilegiado em `lib/supabase.ts` é usado pelo webhook Evolution. Uso operacional não confirmado, portanto dependência preservada. | Painel/confirmação: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave pública, nunca service role). Webhook: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, privadas. Sem configuração, funções opcionais ficam indisponíveis; páginas públicas e build não dependem delas. Fallbacks fictícios removidos. |
| Anthropic | `/api/webhook/evolution` gera respostas Bella; não é chamado pelo formulário público. Rota acessível externamente, portanto não classificada como código morto. | `ANTHROPIC_API_KEY` privada. Dependência preservada. Inicialização adiada; webhook não configurado retorna 503. |
| Evolution API | Mesmo webhook envia respostas via API; `scripts/setup-evolution.ts` é setup manual, não executado. `lib/bella-prompt.ts` e migração Supabase preservados. | `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`. Uso operacional não confirmado. Nenhum setup ou migração executado. |

## Preservação e pendências

- ManyChat permanece na API server-side existente. Não foi criada uma segunda API nem alterados destino, payload, fluxo ou formatação de telefone existentes.
- O uso de telefone como `subscriber_id` na API ManyChat é preexistente; requer validação operacional separada. Testes com mock provam contrato, não aceitação pelo provedor.
- Webhook Evolution tem pendências preexistentes de autenticação, idempotência e duração do processamento assíncrono. Não ativar uma nova operação de IA sem revisar esses pontos. Nesta rodada preservamos o código e não alteramos configuração externa.
- `functions/` é um projeto Firebase separado. A remoção de credenciais no código local não publica alterações nele. Sua eventual publicação exige verificar `MANYCHAT_API_KEY` e `EMAIL_PASSWORD` no ambiente Firebase. E-mail SMTP continua com o mesmo host/usuário; senha fixa removida.
- Não foram removidos SDKs Supabase/Anthropic: existem consumidores alcançáveis. Não foi adicionado serviço novo.
- `.env.local`, `.env.production` e `.git_backup/` foram retirados apenas do índice; arquivos locais e histórico preservados. `.gitignore` protege artefatos e configuração local. PDF real preservado.
- Tratar credenciais históricas como potencialmente expostas: `PAGSEGURO_PRODUCTION_TOKEN`, `PAGSEGURO_SANDBOX_TOKEN`, `NEXT_PUBLIC_PAGSEGURO_PRODUCTION_TOKEN`, `NEXT_PUBLIC_PAGSEGURO_SANDBOX_TOKEN`, `MANYCHAT_API_KEY`, `NEXT_PUBLIC_MANYCHAT_API_KEY`, `EMAIL_PASSWORD`. Credenciais locais como `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY` e `EVOLUTION_API_KEY` também exigem revisar histórico/exposição antes de reutilização. Nenhum valor é documentado.
- Remover variáveis `NEXT_PUBLIC_*` de credenciais no painel deve ser uma ação posterior autorizada; o código não as usa mais. Nenhuma variável remota foi alterada nesta rodada.

## Futuro motor de reservas e pagamentos

- Reserva online.
- Disponibilidade.
- Checkout.
- Integração de pagamento, possivelmente PagSeguro ou outro gateway a definir.
- Confirmação.
- Painel administrativo.
- Integração com o sistema de gestão atual do motel, caso a API permita.

Esse roadmap não ativa pagamentos. Rever autenticação, preços compartilhados, webhooks e idempotência antes de reaproveitar código legado.
