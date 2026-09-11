# PRIVATE MOTEL — Constituição visual, UX, front-end e engenharia

Este arquivo rege o projeto inteiro. Conceito central: **PRIVATE — Luxury After Dark**. É uma referência interna de direção de arte; não exige a publicação de um slogan.

## Escopo e aplicação permanente

A constituição orienta futuras alterações autorizadas; sua criação não autoriza iniciar o redesign. Nesta etapa documental, escrever somente o AGENTS.md raiz, sem alterar páginas, componentes, assets, dependências ou infraestrutura. Preservar também alterações locais de outras tarefas. Instruções explícitas posteriores do proprietário podem atualizar estas diretrizes.

Distinguir sempre fatos observados no código, comportamento efetivamente validado e intenção futura. Não presumir que uma integração está operante em produção porque seus arquivos existem. O inventário abaixo é uma fotografia de 10/09/2026; revalidar antes de implementar.

## Inventário técnico observado

| Área | Estado encontrado e fontes |
| --- | --- |
| Framework | Next.js **14.1.0**, App Router em `app/`; React/React DOM declarados `^18.2.0`, resolvidos **18.3.1** no `package-lock.json`. |
| Linguagens | Predominantemente JavaScript/JSX; TypeScript **6.0.3** em webhook, `lib/` e `scripts/`. `tsconfig.json` permite JS, não usa strict e inclui principalmente TS/TSX. Há também `jsconfig.json`. |
| Gerenciador | npm, `package-lock.json` raiz e lock separado em `functions/`. Vercel instala com `npm install --legacy-peer-deps`. Não trocar de gerenciador nem regenerar locks incidentalmente. |
| Comandos | `npm run dev`, `npm run lint`, `npm run build`, `npm start`. Não há script de teste nem de typecheck no package raiz. O prebuild executa `node preserve-styles.js`. |
| Estilos | CSS Modules em `src/styles/`, junto aos componentes e `app/page.module.css`; global ativo `app/globals.css`, importado pelo layout. Existe `src/app/globals.css` sem importação encontrada; não confundir com a raiz de rotas ativa. Tailwind **3.3.0**, PostCSS **8.4.23**, Autoprefixer **10.4.14** declarados, com pipeline afetado pelos stubs descritos abaixo. |
| Fontes atuais | `app/layout.js` carrega Playfair Display e Inter via `next/font/google`, com swap. CSS/Tailwind ainda citam Montserrat; README menciona Geist, divergindo do código. Manrope é a direção futura, ainda não implementada. |
| UI e movimento | Framer Motion **12.5.0** no lock, Swiper, react-intersection-observer, react-icons (incluindo `fa`), react-datepicker e SweetAlert2 têm uso no código. Também declarados HeroUI, GSAP, Three, React Three Fiber/Drei e partículas; declaração não comprova uso. Não adicionar uma segunda solução para o mesmo problema sem benefício demonstrado. |
| Integrações declaradas | Supabase, Nodemailer, PagSeguro, SDK Anthropic e MongoDB constam no package raiz. MongoDB declarado não comprova banco ativo. Firebase Functions é um subprojeto separado. |
| Vercel | `vercel.json`: Next.js, build npm, região `iad1`, base pública `https://privatemotel.com.br`. `next.config.mjs`: standalone, Strict Mode, SWC, `esmExternals: 'loose'`, imagens sem otimização e verificações de lint/tipos ignoradas no build. Não inferir estado do painel remoto a partir desses arquivos. |

### Rotas e componentes

Rotas de páginas existentes: `/`, `/suites`, `/cortesias`, `/experiencias`, `/estrutura`, `/sobre-nos`, `/promocoes`, `/contato`, `/reservas`, `/confirmacao`, `/admin/reservas`, `/politica-privacidade`, `/termos-uso`, `/lgpd` e `/termos-whatsapp`. Há `app/not-found.js`. Não foi encontrada rota individual dinâmica de suíte; as quatro categorias estão em `/suites`. Preservar parâmetros utilizados por confirmação, como `id` e `simulado`, sem promover simulação a confirmação real.

Padrão recorrente: `page.js` com metadados e componente `*Content.js` interativo. Header, MobileMenu, Footer, FormularioContato, PopupCookies, PopupDesconto, SuitesMobileView e EstruturaMobileView estão em `src/components/`. Seções da home: HeroSection, SobreNosSection, RefeicoesSection, GaleriaSuitesSection, ExperienciasSection, PromocoesSection e NewsletterSection. Também existem MotorReservaSection e ReserveForm: verificar referências antes de considerar remoção. Duplicações de apresentação desktop/mobile precisam ser consideradas na manutenção de dados e acessibilidade.

### Reservas, formulários e integrações existentes

- O fluxo observado em `app/reservas/ReservasContent.js` valida campos e abre WhatsApp com suíte, período, data, horário, valor e contato. A confirmação final depende do atendimento. Imports de pagamento e Supabase nessa página não significam que o submit atual cria um pagamento.
- WhatsApp recorrente: `5543999936839`, via `wa.me` e `api.whatsapp.com/send`. `FormularioContato` também monta mensagem e abre WhatsApp. Preservar destinos e parâmetros, sem enviar mensagens reais durante testes.
- `NewsletterSection` apenas altera estado local de sucesso; não há envio nesse handler. Não apresentar essa implementação como inscrição persistida ou inventar integração de newsletter.
- `app/supabase.js` contém cliente e operações de reservas; `src/services/availabilityService.js`, `notificationService.js` e `pagseguroService.js` contêm lógica de disponibilidade, notificações e pagamento. A área administrativa usa Supabase Auth. Preservar contratos antes de qualquer refatoração visual.
- APIs existentes: `/api/send-contact`, `/api/send-email`, `/api/send-whatsapp`, `/api/pagseguro/create-payment`, `/api/pagseguro/check-status`, `/api/pagseguro/payment-status/[chargeId]`, `/api/pagseguro/notifications` e `/api/webhook/evolution`.
- E-mail usa Nodemailer/SMTP; WhatsApp de notificações tem ManyChat. Existem diferenças de nomes de configuração SMTP entre endpoints (`EMAIL_PASS` e `EMAIL_PASSWORD`) e fallbacks de demonstração; validar configuração sem imprimir valores de ambiente.
- `lib/supabase.ts`, `lib/bella-prompt.ts`, webhook Evolution, `scripts/setup-evolution.ts` e `supabase/migrations/001_initial.sql` compõem integração de atendimento Bella/Anthropic/Evolution. Migração define contacts, conversations, messages e ai_sessions. Não executar setup, migração ou webhook real nesta análise.
- `functions/` preserva código Firebase/Firestore, e-mail, ManyChat e PagSeguro; possui package e lock próprios, Node 22 declarado, `firebase.json` e `.firebaserc`. É coexistência/legado a investigar, não autorização para migrar a infraestrutura.
- Existem simulações de pagamento/confirmacão no código. Um cenário simulado nunca prova cobrança, disponibilidade ou reserva confirmada em produção.

### Patrimônio visual e dados comerciais

`public/` contém **72 JPG, 8 PNG, 2 SVG, 1 ICO, 1 webmanifest e 1 arquivo MP4**. Preservar todos, inclusive arquivos que pareçam redundantes.

- Suítes reais: Private, Diamante Luxo, Prata e Bronze. Imagens principais e séries numeradas `suite-private*`, `suite-diamante-luxo*`, `suite-prata*` e `suite-bronze*` em `public/images/`.
- Outros materiais: `motel-entrada.jpg`, séries `IMG_*`, `cafe-manha.jpg`, `almoco-executivo.jpg`, `cha-tarde.jpg`, `exp-*`, `promo-*` e `precos-private-site.png` (aproximadamente 3,5 MB). Não transcrever ou atualizar preços por suposição.
- Marca: `public/images/logo.png`; favicons e manifest em `public/images/logos/`; SVGs reais de Google Maps e Waze, além de PNG de Maps. Não redesenhar logos ou substituir essas marcas.
- `public/videos/video-sobrenos.mp4` é atualmente um **ponteiro Git LFS de 136 bytes**, referindo objeto de **70.014.908 bytes**; não é um MP4 reproduzível neste checkout. Recuperação e validação do original precisam anteceder qualquer hero em vídeo. Não apagar, sobrescrever ou tratar o ponteiro como vídeo validado.
- **Nenhum PDF foi localizado no código/assets do projeto**, excluídos dependências, builds e cópias de Git. O Cardápio permanece requisito pendente: localizar novamente na implementação; se faltar, solicitar o PDF verdadeiro. Nunca usar imagem de preços como se fosse cardápio, URL inventada ou `href="#"`.
- Fontes factuais: `app/suites/SuitesContent.js`, conteúdos de reservas, cortesias, experiências, promoções, contato e respectivos componentes; `lib/bella-prompt.ts` também contém informações comerciais. Não escolher silenciosamente um valor quando fontes divergem; registrar a divergência e obter informação do proprietário antes de alterar o fato.
- Contatos observados no Footer: Rua Adelino Bianchini, 86 — Cambé, PR; telefone `+554331746600`, WhatsApp acima, `contato@privatemotel.com.br`; Instagram `private_motel`, Facebook `privatemotel`, Google Reviews, Maps e Waze. Conferir páginas e coordenadas antes de unificar; os mapas de contato e footer contêm coordenadas diferentes.

### SEO existente e riscos de navegação

`app/layout.js` define pt-BR, title, description, keywords, metadataBase, robots index/follow, Open Graph, Twitter, ícones e manifest; várias páginas definem title/description. Preservar conteúdo local de Cambé, Londrina e norte do Paraná.

Não foram encontrados arquivos de sitemap/robots, canonical explícito ou JSON-LD na busca de código. O OG referencia `/images/og-image.jpg`, ausente no inventário; há divergência entre host com e sem `www`. Registrar e resolver no escopo futuro, sem alterar domínio por conta própria. Footer aponta para `/politica-de-privacidade`, `/termos-de-uso` e `/politica-de-cookies`, que não correspondem às rotas localizadas. Não apagar conteúdo legal para resolver links; mapear URLs e preservar compatibilidade quando necessário.

### Riscos de engenharia identificados

1. **Build com efeitos colaterais:** `preserve-styles.js` sobrescreve módulos PostCSS em `node_modules` por stubs, reescreve `postcss.config.js`, pode modificar `app/globals.css` e restaurar backups de CSS Modules. Inspecionar e tratar o pipeline em uma tarefa apropriada antes de confiar em Tailwind ou no build. Não executar esse prebuild na etapa que proíbe mudanças no site.
2. Scripts raiz `fix-css*`, `fix-minimal.js`, `ignore-*`, `install-deps.js`, `remove-tailwind.js`, `restore-css.js` e `skip-css-build.js` são remendos legados; não executar automaticamente nem reaproveitar como solução de qualidade. `.git_backup/` não é código da aplicação; preservar.
3. `ignoreBuildErrors` e `ignoreDuringBuilds` impedem que sucesso de build comprove qualidade. `images.unoptimized: true` compromete o benefício de next/image. Não perpetuar esses atalhos em novas soluções; qualquer correção deve ser entendida e validada no escopo adequado.
4. CSS global mistura paleta rosa, branco, preto/dourado, seletores abrangentes, overflow oculto e fontes conflitantes; há autorreferências em variáveis de fonte. Não esconder defeitos de layout com mais `overflow: hidden` ou `!important`.
5. Hero atual usa Swiper com autoplay de 5 segundos, múltiplos H1 e múltiplas imagens prioritárias. A direção futura exige abertura editorial única, hierarquia semântica e carregamento seletivo.
6. Não foram encontradas regras `prefers-reduced-motion` ou `focus-visible` na busca em app/src. O menu mobile precisa de validação de foco, Escape e isolamento do conteúdo fechado. Isto é análise estática, não certificação de acessibilidade.
7. `.env.local` e `.env.production` estão rastreados pelo Git, e o `.gitignore` atual não exclui arquivos de ambiente. Não copiar seus valores para documentos, logs ou commits. Avaliar exposição/gestão de credenciais separadamente; não remover histórico ou trocar segredos nesta tarefa.
8. Webhook Evolution dispara trabalho assíncrono sem aguardá-lo antes da resposta; avaliar durabilidade no ambiente serverless, autenticação, duplicidade e tratamento de falhas antes de mudanças nessa integração. A presença de arquivos não comprova configuração ou proteção do serviço remoto.

## Ferramentas e validação

Recursos disponíveis nesta sessão: terminal PowerShell, Git, leitura/edição local, npm/Node e dependências locais; navegador via CUA; conectores GitHub/Vercel e ferramenta web disponíveis para uso quando pertinente. Disponibilidade não comprova autenticação ou acesso a um projeto remoto. Não instalar plugins nem inventar ferramentas, resultados de navegador, Lighthouse, axe ou testes que não foram executados.

A skill `build-web-apps:react-best-practices` foi consultada para orientar reutilização, divisão server/client, redução de JavaScript e carregamento seletivo. Aplicar somente APIs compatíveis com Next 14/React 18; exemplos de versões posteriores não autorizam upgrade. Skills de frontend-testing-debugging e de navegação estão disponíveis para futura implementação/renderização. Ler a skill aplicável quando for usada. A direção específica desta constituição prevalece sobre padrões visuais genéricos de skills.

Baseline desta etapa documental:

- `npm run lint`: concluído com seis avisos (dependências de hooks e uso de img), sem erros. npm também avisou sobre configuração `node-linker`.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: falhou com TS5107 em `moduleResolution: node`, interpretado como node10 pelo TypeScript 6.0.3. Não mascarar falha como aprovação; a checagem não prosseguiu para provar ausência de outros erros.
- Não foram localizados testes de aplicação ou script de testes. `firebase-functions-test` declarado não equivale a suíte existente.
- Build de produção não executado nesta etapa: seu prebuild altera ferramentas/arquivos, contrariando o escopo documental. Não afirmar que o build passou ou que o site foi validado visualmente. Não foram realizados envios, cobranças, deploys ou testes em serviços reais.

Para futuras mudanças de implementação: registrar baseline, rodar lint, typecheck compatível quando existente, testes existentes e build de produção após entender seus efeitos; corrigir erros introduzidos. Não concluir implementação com build quebrado. Diferenciar falhas preexistentes de regressões e informar bloqueios com precisão. Validar fluxo por teclado, touch, menu, galeria, links, formulário e estados de erro/sucesso, com serviços simulados quando houver efeitos externos. Verificar console, recursos ausentes, responsividade e movimento reduzido em navegador disponível. Para edição apenas documental, verificar conteúdo e diff; não executar scripts destrutivos para produzir uma declaração artificial de build aprovado.

## Interpretação das diretrizes a seguir

As seções seguintes preservam integralmente a direção de marca solicitada. Verbos como “criar”, “adicionar” e “reformular” se aplicam à futura implementação autorizada, não a esta etapa. A proibição de adicionar backend refere-se a **novos** serviços: Supabase, Firebase e integrações já encontrados devem ser preservados e compreendidos. Não substituir o backend existente nem instalar outro por inferência.

## PRIVATE MOTEL — DIREÇÃO DA MARCA

O novo site precisa posicionar o Private Motel como uma experiência de hospitalidade adulta premium.

A percepção desejada é:

* luxo;
* exclusividade;
* desejo;
* intimidade;
* sensualidade sofisticada;
* privacidade;
* discrição;
* arquitetura premium;
* experiência 5 estrelas;
* noite;
* mistério;
* elegância;
* desejo aspiracional.

O objetivo NÃO é parecer um motel popular.

O objetivo é aproximar a apresentação digital de marcas de:

* hotelaria de luxo;
* resorts boutique;
* restaurantes fine dining;
* joalherias;
* perfumaria premium;
* moda editorial;
* clubes privados;
* experiências premium.

Sensualidade deve ser transmitida principalmente por:

* fotografia;
* vídeo;
* enquadramento;
* luz;
* sombra;
* textura;
* tipografia;
* movimento;
* espaçamento;
* ritmo visual.

NUNCA depender de vulgaridade ou elementos gráficos sexualmente explícitos.

## PRINCÍPIO CRIATIVO CENTRAL

Use como conceito:

**PRIVATE — Luxury After Dark**

Não precisa obrigatoriamente exibir essa frase como slogan.

Ela deve funcionar como referência conceitual interna para o design.

Imagine a experiência de entrar, à noite, em um hotel boutique extremamente exclusivo.

O usuário deve pensar:

“Esse lugar é muito mais sofisticado do que eu esperava.”

## ANTI-PATTERNS VISUAIS

É terminantemente proibido transformar o site em:

* template genérico;
* landing page de startup;
* site SaaS;
* site de cassino;
* site de balada;
* site com aparência de tema comprado;
* site com visual WordPress genérico;
* site de motel vermelho/preto clichê;
* UI cheia de bordas douradas;
* layout cheio de cards iguais;
* excesso de glassmorphism;
* excesso de gradients;
* excesso de glow;
* dourado amarelo saturado;
* animações espalhafatosas;
* parallax exagerado;
* cursor customizado prejudicando usabilidade;
* dezenas de badges;
* cantos excessivamente arredondados;
* ícones genéricos gigantes;
* emojis;
* elementos decorativos sem propósito;
* efeitos 3D gratuitos;
* textos centralizados em absolutamente todas as seções.

Não use ouro como “decoração em todo lugar”.

O ouro precisa parecer raro.

Quanto menos ele aparecer, mais premium ele parecerá.

## PALETA PRINCIPAL

A fundação visual deverá utilizar preto profundo e tons quentes de dourado.

Crie tokens de design centralizados.

Referências iniciais:

--private-black: #050505
--private-black-soft: #0A0A0A
--private-surface: #10100F
--private-surface-elevated: #151513

--private-gold: #C6A15B
--private-gold-light: #D6B875
--private-gold-muted: #9D824E

--private-ivory: #F3EFE7
--private-text: #E8E4DD
--private-text-muted: #A9A49B
--private-border: rgba(214, 184, 117, 0.18)

Esses valores podem ser refinados durante a implementação, mas a direção deve permanecer:

PRETO + MARFIM + DOURADO SOFISTICADO.

Evite branco puro em grandes áreas.

Evite dourado saturado.

## TIPOGRAFIA

Títulos editoriais e display:

**Playfair Display**

Subtítulos, navegação, labels, UI, body e textos funcionais:

**Manrope**

A implementação deve utilizar carregamento moderno e performático de fontes de acordo com o framework identificado.

A Playfair Display deve transmitir:

* elegância;
* drama;
* editorial;
* desejo.

A Manrope deve transmitir:

* precisão;
* modernidade;
* legibilidade;
* sofisticação.

Nunca use Playfair em textos pequenos de interface.

Nunca utilize mais fontes sem uma justificativa extremamente forte.

## TIPOGRAFIA E ESCALA

Desktop deve poder trabalhar com títulos grandes e cinematográficos.

Heroes podem utilizar `clamp()` para criar uma escala fluida.

Evite títulos gigantes simplesmente porque “está na moda”.

Hierarquia tipográfica deve ser clara:

Display
H1
H2
H3
Eyebrow
Body
Small
Label

Eyebrows podem utilizar Manrope uppercase, letter spacing elevado e pequenos detalhes dourados.

## LAYOUT

Adotar uma composição editorial premium.

Priorizar:

* grandes áreas de fotografia;
* grids assimétricos quando apropriado;
* sobreposição controlada de conteúdo;
* bastante espaço negativo;
* ritmo vertical;
* contraste entre seções imersivas e seções informativas;
* alternância entre conteúdo full-bleed e conteúdo constrained;
* imagens com proporções cinematográficas.

Evitar um site composto simplesmente por:

Hero
3 Cards
3 Cards
4 Cards
CTA
Footer

A experiência deve ter narrativa visual.

## IMAGENS, VÍDEOS E ASSETS

REGRA CRÍTICA:

O repositório atual contém patrimônio visual da marca.

Todas as imagens, vídeos, logos, SVGs e demais arquivos existentes devem ser PRESERVADOS.

Não delete assets existentes.

Não substitua fotografias reais do motel por fotos genéricas de banco de imagem.

Não gere imagens fake das suítes.

Não altere logos sem solicitação.

Antes de criar qualquer nova solução visual, catalogue mentalmente os assets existentes e tente reutilizá-los da melhor forma possível.

As fotos e vídeos reais do Private Motel devem ser protagonistas do redesign.

Pode:

* alterar crop;
* reposicionar;
* aplicar overlays;
* aplicar gradientes de legibilidade;
* criar máscaras;
* utilizar object-position;
* aplicar tratamento visual via CSS;
* reorganizar galerias.

Não modifique destrutivamente os arquivos originais.

## MOTION DESIGN

Motion é parte importante da experiência premium, porém precisa ser elegante.

Priorizar:

* fade;
* reveal;
* deslocamentos verticais sutis;
* stagger;
* zoom cinematográfico extremamente lento em hero;
* transições suaves;
* gallery transitions;
* navbar transitions;
* hover refinado;
* microinterações em CTA.

Duração normalmente mais lenta que aplicações SaaS.

Movimento deve lembrar cinema/editorial, não videogame.

Se o stack permitir e houver benefício real, pode utilizar uma biblioteca especializada como Framer Motion/Motion ou GSAP.

Não instale bibliotecas pesadas sem necessidade.

Sempre respeitar:

`prefers-reduced-motion`

Nunca prejudicar CLS, performance ou acessibilidade.

## HEADER

O header deverá transmitir luxo imediatamente.

Características desejadas:

* inicialmente integrado ao hero quando fizer sentido;
* fundo escuro/transparente sofisticado;
* alteração sutil durante scroll;
* logo com boa presença;
* navegação limpa;
* CTA de reserva destacado;
* excelente versão mobile.

Links principais existentes devem continuar acessíveis.

Adicionar permanentemente:

**Cardápio**

Esse item deverá abrir o PDF do cardápio que estará dentro do projeto.

Durante a implementação, localizar o arquivo PDF real no repositório.

Se houver apenas um PDF claramente relacionado ao cardápio, utilize-o.

Se o arquivo for exposto pela pasta pública, utilize sua URL pública correta.

O link deve preferencialmente abrir em nova aba:

`target="_blank"`

com:

`rel="noopener noreferrer"`

O Cardápio também deverá estar disponível no footer ou em outra área contextual apropriada.

## MOBILE NAVIGATION

Não simplesmente espremer o desktop.

Criar experiência mobile premium.

Pode utilizar menu fullscreen/overlay escuro com:

* logo;
* links grandes;
* tipografia refinada;
* CTA de reserva;
* contato;
* Cardápio.

Touch targets adequados.

Sem menu excessivamente complexo.

## HOME

A Home deverá contar uma história.

Estrutura conceitual recomendada, não obrigatória:

1. Hero cinematográfico.
2. Introdução à experiência Private.
3. Suítes em destaque.
4. Experiência / atmosfera.
5. Cortesias gastronômicas.
6. Experiências especiais.
7. Promoções.
8. Elementos de confiança / diferenciais.
9. Localização e contato.
10. CTA final.

Não transforme essa sequência em seções genéricas idênticas.

Cada uma deve possuir tratamento visual próprio.

## HERO

O hero é a peça mais importante do redesign.

Utilizar o melhor material visual disponível no repositório.

Se existir vídeo adequado, considerar hero cinematográfico utilizando esse vídeo de forma performática e acessível.

Caso contrário utilizar uma fotografia extremamente forte.

Adicionar overlay pensado para preservar legibilidade.

Evitar carrossel automático tradicional com slides trocando a cada poucos segundos.

Preferimos uma única abertura memorável a um slider genérico.

Copy pode aproveitar o posicionamento atual do Private Motel.

CTA primário:

Reserva / Reservar agora.

CTA secundário quando apropriado:

Conheça as suítes.

## SUÍTES

As suítes são um dos principais motores de conversão.

Precisam parecer produtos premium, não cards de e-commerce.

Atualmente existem diferentes categorias/suítes no negócio. Preserve os dados verdadeiros existentes no projeto.

Valorize:

* fotografia;
* nome;
* diferenciais;
* tamanho;
* amenidades;
* preço;
* período;
* pernoite;
* galeria;
* reserva.

Suíte Private e demais suítes premium devem ter apresentação editorial especialmente impactante.

Em páginas de suíte/listagem, facilitar comparação sem banalizar o luxo.

Galerias devem funcionar perfeitamente em mobile.

## COPYWRITING

A copy existente poderá ser preservada.

Você pode melhorar:

* títulos;
* subtítulos;
* microcopy;
* CTAs;
* quebras;
* hierarquia;
* concisão.

NÃO invente:

* preços;
* horários;
* regras;
* descontos;
* serviços;
* cortesias;
* amenidades;
* condições;
* informações comerciais;
* endereços;
* telefones.

Dados comerciais existentes são fonte da verdade até que o proprietário os atualize.

Evite linguagem cafona.

Evite:

“uma explosão de prazer”
“desperte seus sentidos”
“para apimentar sua noite”
e clichês semelhantes.

Prefira linguagem sofisticada, curta e segura.

## EXPERIÊNCIAS, CORTESIAS E PROMOÇÕES

Preservar os conteúdos reais existentes.

Reformular a apresentação para parecer parte de uma experiência de hotelaria premium.

Refeições devem ter apelo gastronômico.

Experiências românticas devem parecer serviços concierge.

Promoções não devem destruir a percepção de luxo.

Evitar grandes selos vermelhos, badges de desconto e estética varejista.

## RESERVA

Reserva é o objetivo de conversão principal.

Toda a experiência deve facilitar a ação sem parecer agressivamente comercial.

CTAs de reserva devem existir estrategicamente:

* header;
* hero;
* suítes;
* seções relevantes;
* mobile;
* final de páginas.

Preservar comportamento existente do fluxo de reserva, WhatsApp ou formulário.

Não alterar backend ou integrações sem entender previamente como funcionam.

Em mobile considerar CTA de reserva sticky, desde que discreto e não invasivo.

## CONTATO / LOCALIZAÇÃO

Manter:

* endereço;
* telefones;
* WhatsApp;
* mapa;
* Google Maps;
* Waze;
* demais informações reais existentes.

A área deve ter apresentação premium e ser extremamente funcional.

## FOOTER

Footer escuro, elegante e editorial.

Conter quando apropriado:

* logo;
* descrição;
* navegação;
* Suítes;
* Cardápio;
* Reserva;
* WhatsApp;
* endereço;
* contato;
* políticas;
* redes sociais existentes;
* copyright.

Não transformar em mural de links.

## COMPONENTIZAÇÃO

Criar componentes reutilizáveis onde existir repetição real.

Evitar tanto:

1. copiar código repetidamente;

quanto:

2. abstrair tudo prematuramente criando dezenas de componentes irrelevantes.

Preferir componentes semânticos e claros.

Possíveis famílias:

* Header;
* MobileMenu;
* Footer;
* Container;
* SectionHeading;
* EditorialImage;
* SuiteCard / SuiteFeature;
* Gallery;
* CTA;
* Button;
* GoldEyebrow;
* ExperienceSection;
* ReservationCTA.

Use os padrões adequados ao framework real do projeto.

## DESIGN TOKENS

Cores, spacing, typography, radius, transitions e breakpoints recorrentes devem ser centralizados no sistema existente.

Não espalhar magic numbers desnecessariamente.

Radius deve ser contido.

Luxo não significa tudo com `border-radius: 30px`.

## ÍCONES

Usar um conjunto coerente de ícones já existente ou uma biblioteca leve e profissional adequada ao stack.

Não misturar diversas famílias.

Ícones devem ser discretos.

## ACESSIBILIDADE

Obrigatório:

* HTML semântico;
* navegação por teclado;
* focus-visible;
* labels;
* alt adequado;
* contraste;
* aria apenas quando necessário;
* respeitar reduced-motion;
* modais/dialogs acessíveis;
* galleries acessíveis;
* menu mobile acessível.

Design premium não é desculpa para baixa acessibilidade.

## RESPONSIVIDADE

Todo desenvolvimento deve ser mobile-first ou, no mínimo, completamente responsivo.

Testar mentalmente e, quando as ferramentas permitirem, realmente validar em larguras como:

375px
390px
768px
1024px
1280px
1440px
1920px

Nenhuma seção deve depender de hover para ser compreendida.

## PERFORMANCE

O site deve continuar apropriado para produção na Vercel.

Priorizar:

* otimização de imagens;
* lazy loading abaixo da dobra;
* preload apenas do essencial;
* vídeo otimizado;
* evitar JavaScript desnecessário;
* evitar dependências gigantes;
* minimizar layout shift;
* evitar animações que causem reflow;
* componentes server-side quando o framework permitir;
* client-side apenas quando necessário.

Não sacrificar performance por efeitos visuais.

## SEO

Preservar e melhorar o SEO existente.

O negócio atende principalmente:

* Cambé;
* Londrina;
* região norte do Paraná.

Preservar URLs relevantes sempre que possível.

Manter ou melhorar:

* title;
* description;
* canonical;
* Open Graph;
* headings;
* conteúdo indexável;
* alt de imagens;
* dados estruturados existentes;
* sitemap;
* robots;
* metadados sociais.

Não remover conteúdo relevante de SEO simplesmente para deixar o layout minimalista.

## GITHUB E VERCEL

O projeto é versionado com Git/GitHub e publicado na Vercel.

Portanto:

* não introduzir dependência incompatível com Vercel;
* não depender de filesystem persistente;
* não adicionar secrets ao repositório;
* não quebrar o build;
* não alterar configuração de domínio;
* não alterar git remote;
* não executar deploy de produção sem autorização;
* não fazer mudanças desnecessárias de infraestrutura.

## BACKEND

Atualmente não devemos assumir Supabase ou qualquer novo backend.

NÃO adicionar:

* Supabase;
* Firebase;
* banco de dados;
* CMS;
* autenticação;
* backend novo;

sem necessidade e sem solicitação expressa.

Preserve qualquer integração que já exista.

## QUALIDADE DE ENGENHARIA

Sempre:

1. entender antes de alterar;
2. reutilizar antes de recriar;
3. simplificar antes de adicionar dependência;
4. preservar comportamento existente;
5. escrever código legível;
6. evitar hacks;
7. remover código morto APENAS quando houver segurança de que não é utilizado;
8. rodar lint;
9. rodar typecheck se existir;
10. rodar testes se existirem;
11. rodar build de produção;
12. corrigir erros introduzidos.

Não considere uma tarefa concluída se o build estiver quebrado.

## REGRA PARA BIBLIOTECAS

Bibliotecas podem ser instaladas quando trouxerem benefício real.

Antes de adicionar uma dependência, pergunte internamente:

“Consigo resolver isso de forma limpa com o stack atual?”

Se sim, prefira o stack atual.

Se não, escolha uma biblioteca:

* madura;
* bem mantida;
* apropriada;
* pequena o suficiente;
* compatível com Vercel e o framework.

Não transformar o projeto em uma coleção de dependências.

## REGRA DE PRESERVAÇÃO

Durante qualquer redesign futuro:

PRESERVAR:

* imagens;
* vídeos;
* logos;
* conteúdo factual;
* preços;
* suítes;
* promoções;
* contatos;
* integrações;
* links importantes;
* políticas;
* SEO relevante;
* URLs importantes;
* comportamento funcional.

PODE SER COMPLETAMENTE RECONSTRUÍDO:

* layout;
* CSS;
* arquitetura visual;
* composição;
* design system;
* navegação visual;
* componentes visuais;
* hierarquia;
* tipografia;
* motion;
* galleries;
* apresentação das páginas.

## CRITÉRIO FINAL DE QUALIDADE

Nunca pergunte:

“Está bonito?”

Pergunte:

“Isso parece realmente um site de uma marca premium que investiu seriamente em direção de arte, UX e engenharia?”

Se algo parecer genérico, continue refinando.

Se algo parecer feito por IA, continue refinando.

Se algo parecer um template, continue refinando.

Se algo parecer barato, remova ou redesenhe.

O resultado final deve ser sofisticado mesmo quando estiver completamente parado, sem depender de animações.

---
