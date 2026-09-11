# Tarifas de reservas — correção de 11/09/2026

A decisão do proprietário estabelece /suites e as imagens reais como fonte de verdade. Os preços anteriores de /reservas foram substituídos.

| Suíte | Período anterior → correto | Pernoite anterior → correto (dom–qui/feriado; sex–sáb/véspera) |
|---|---|---|
| Private | 355 → 365 | 407 → 417 |
| Diamante Luxo | 299 → 305 | 320 → 330; 360 |
| Prata | 155 → 165 | 208 → 218; 245 |
| Bronze | 125 → 135 | 175 → 185; 213 |

Preços: src/data/content.js, os mesmos registros apresentados por app/suites/SuitesContent.js. src/data/reservation.js deriva números desses registros, sem segunda tabela de valores.
Regras comuns: src/data/reservation.js, compartilhadas por /suites e /reservas.

O formulário identifica dia comum pelo dia da semana e pede indicação explícita de feriado/véspera, pois não há calendário homologado no projeto.
Pernoite de sexta/sábado/véspera usa a noite selecionada como referência, entrada na madrugada/manhã seguinte e saída até 12h. A mensagem informa as datas reais.
PIX, dinheiro, crédito à vista e débito à vista; nenhum pagamento é feito pelo formulário.
Integrações legadas de pagamento e disponibilidade não foram modificadas; o fluxo ativo é WhatsApp.

## Exceção confirmada pelo proprietário
Às sextas, sábados e vésperas de feriado, a Private permanece com 6 horas; Diamante Luxo, Prata e Bronze têm 4 horas. A regra compartilhada aplica essa exceção ao cálculo, à descrição em /suites e à mensagem de WhatsApp. Os preços e demais regras permanecem inalterados.

## Validação
Cálculo: quatro suítes, período/pernoite, dia comum/feriado/véspera, mudança das 06h59 para 07h, horários inválidos e datas inválidas.
Navegador: combinações de suíte/período/calendário, meios de pagamento, mensagens WhatsApp, erro/foco e remoção de link desatualizado.
Sem alterações visuais, envios reais, cobranças ou deploy.
