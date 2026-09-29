# Financeiro integrado — Motel+ e GestãoClick

## Escopo atual

A rota `/dashboard/finance` é exclusiva do papel `owner` e trabalha em modo somente leitura. Ela não cadastra, altera, paga, baixa ou exclui títulos.

- Motel+: fonte primária do faturamento recebido e das ocupações encerradas.
- GestãoClick: fonte de contas a pagar, despesas, baixas e recebíveis para conferência.
- Dashboard: normaliza as duas fontes e calcula evolução mensal, DRE gerencial, fluxo de caixa realizado, despesas por categoria, atrasos e agenda de pagamentos.

A DRE é gerencial. Ela só poderá ser tratada como relatório contábil após validar o plano de contas, competência, impostos, depreciação e lançamentos não operacionais com a contabilidade.

## Configuração local segura

No GestãoClick, acessar **Meus aplicativos → API → Token**. A API é um recurso adicional do ERP e precisa estar ativa na conta.

Adicionar somente em `.env.local`, sem enviar os valores por chat e sem prefixo `NEXT_PUBLIC_`:

```text
GESTAO_CLICK_ACCESS_TOKEN=
GESTAO_CLICK_SECRET_ACCESS_TOKEN=
```

Por compatibilidade, o projeto também reconhece os nomes locais já configurados `GESTAOCLICK_ACCESS_TOKEN` e `GESTAOCLICK_SECRET_TOKEN`.

O conector usa por padrão `https://api.gestaoclick.com`, com os recursos `/pagamentos` e `/recebimentos`. A conexão real foi validada em 24/09/2026 com resposta HTTP 200 nos dois recursos, sem registrar valores ou dados pessoais. Estes valores ainda podem ser ajustados sem alterar código:

```text
GESTAO_CLICK_BASE_URL=https://api.gestaoclick.com
GESTAO_CLICK_PAYABLES_PATH=/pagamentos
GESTAO_CLICK_RECEIVABLES_PATH=/recebimentos
```

Depois de salvar, reiniciar `npm run dev` e abrir `/dashboard/finance`. A faixa no topo informa separadamente se Motel+ e GestãoClick foram reconhecidos. Um erro de rota não mostra tokens nem o corpo bruto retornado pelo ERP.

## Critérios dos relatórios

- Faturamento: `totalRecebido` do caixa agrupado mensal do Motel+. Esta rota foi escolhida porque o token atual possui leitura de caixa, mas não da família `Relatorios/Faturamento*`.
- Despesa na DRE: contas do GestãoClick pela data de competência; na ausência, vencimento.
- Entrada de caixa: faturamento recebido no Motel+.
- Saída de caixa: conta a pagar com data de pagamento/baixa ou estado liquidado.
- Em atraso: conta aberta com vencimento anterior à data atual.
- Sem categoria: título sem categoria ou plano de contas reconhecível no retorno.

O painel informa quantos registros foram recebidos e quantos foram mapeados. Se os nomes de campos do contrato da conta forem diferentes, o relatório permanece parcial até o adaptador ser validado; valores desconhecidos não são estimados.

## Recursos concluídos no dashboard

- Períodos rápidos de 1, 3, 6 e 12 meses e intervalo personalizado de até 24 meses.
- DRE gerencial preliminar, fluxo de caixa e comparação mensal.
- Conciliação mensal entre faturamento recebido no Motel+ e recebimentos mapeados no GestãoClick.
- Busca por descrição, fornecedor ou categoria; filtros por categoria e situação.
- Detalhamento de despesas, agenda financeira, exportação CSV e impressão.
- Sinalização explícita quando recebimentos, ocupações ou páginas da API estão incompletos.

Os relatórios continuam somente leitura. O dashboard não paga, baixa, cria nem altera títulos.

## Próxima validação com dados reais

1. Confirmar que o complemento de API está ativo no GestãoClick.
2. Comparar um mês fechado entre o dashboard e os relatórios nativos dos dois sistemas.
3. Validar as categorias do plano de contas com a contabilidade.
4. Definir se recebíveis do GestãoClick servem apenas para conciliação ou representam alguma receita fora do Motel+.
5. Somente após essa conferência considerar metas, orçamento, sincronização periódica, cache e alertas.
