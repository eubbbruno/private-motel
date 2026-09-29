# Integração Motel+ PlugPlay

Documentação consultada em 16/09/2026:

- Tutorial compartilhado: `https://areacliente.motelmais.com.br/shared/api-de-integracao`
- OpenAPI 3.1 atual: `https://oxpi.com.br/api/PlugPlay/scalar/v1`
- Base declarada pela especificação: `https://oxpi.com.br/api/PlugPlay`

## Credenciais

Toda requisição exige os cabeçalhos `PLUG-PLAY-ID` e `PLUG-PLAY-TOKEN`. São segredos server-side. Nunca usar prefixo `NEXT_PUBLIC_`, inserir no Git, mostrar no navegador ou salvar no Supabase como conteúdo editorial.

Solicitar um token próprio para o Private Motel, revogável e com permissões mínimas. Primeira fase somente leitura.

## Fase inicial segura

Mapear categorias, suítes, modalidades e tabelas de preço e comparar com a fonte comercial já aprovada no site. Consultar disponibilidade por categoria e intervalo. Não criar, editar ou cancelar reservas nesta fase.

Recursos relevantes observados no tutorial e na OpenAPI: `SuiteCategoria`, `Suite`, `Modalidade`, `TabelaPreco`, `ConsultaPreco`, `CategoriaDisponibilidade`, `ReservaDisponibilidade`, `SuitesStatus`, `Reserva` e `ReservaV2`.

O retorno de disponibilidade por suíte pode incluir o nome de outro hóspede na mensagem. A aplicação deve consumir apenas o booleano/quantidade necessários e nunca devolver a mensagem bruta ao visitante, ao dashboard ou a logs.

## Dados necessários do proprietário

1. `PLUG-PLAY-ID` do aplicativo integrador, armazenado localmente como `MOTELMAIS_PLUG_PLAY_ID`.
2. `PLUG-PLAY-TOKEN` específico e revogável, armazenado como `MOTELMAIS_PLUG_PLAY_TOKEN`.
3. Lista das permissões liberadas no token.
4. Confirmação de que podemos testar primeiro somente métodos GET.

Os valores foram cadastrados em `.env.local` e validados com uma leitura real em 16/09/2026. Posteriormente deverão existir como variáveis server-side no ambiente Preview da Vercel. Não enviá-los em chat ou documentação.

## Estado validado

A conexão somente leitura retornou 4 categorias, 50 suítes, 3 modalidades e disponibilidade por categoria. A aba `/dashboard/motel-plus` apresenta apenas dados operacionais agregados. Ela não consulta reservas, ocupações ou nomes de hóspedes e não executa POST, PUT ou DELETE.

## Depois da leitura

Validar o mapeamento entre as categorias do Motel+ e Private, Diamante Luxo, Prata e Bronze. Somente após aprovação manual iniciar criação de reservas com `integracaoId` idempotente, proteção contra duplicidade, auditoria, tratamento de cancelamento e confirmação explícita de sucesso.
