# Sistema visual — Private Motel

Fonte executável: `app/design-tokens.css`. Este documento explica o uso; valores devem ser alterados primeiro nos tokens, não copiados entre componentes.

## Direção

Hospitalidade adulta premium, editorial e noturna. Preto profundo como base, marfim para leitura e dourado quente usado com contenção. Evitar cards repetitivos, brilhos, gradientes gratuitos, vidro e cantos arredondados em excesso.

## Cores

- Fundos: `--private-black`, `--private-black-soft`, `--private-surface`, `--private-surface-elevated`.
- Texto: `--private-ivory`, `--private-text`, `--private-text-muted`.
- Acentos: `--private-gold`, `--private-gold-light`, `--private-gold-muted`.
- Divisores e foco: `--private-border`, `--private-border-strong`, `--focus-ring`.
- Erros: `--private-error`.

## Tipografia

- Display, títulos e linguagem editorial: `--font-display` (Playfair Display).
- Navegação, texto, formulário e interface: `--font-body` (Manrope).
- Não adicionar outra família sem necessidade comprovada.

## Geometria e movimento

- Espaçamento horizontal fluido: `--space`.
- Ritmo vertical de seção: `--section`.
- Controles quase retos: `--radius-control`; blocos editoriais: `--radius-block`.
- Interações: `--transition-ui` e `--ease`; sempre respeitar `prefers-reduced-motion`.

## Componentes administrativos

Dashboard, calendário, preview e popup público usam os mesmos tokens do site. Campos funcionais permanecem Manrope; títulos de seção usam Playfair. Dourado indica ação, seleção ou informação importante, sem virar decoração em todas as bordas.

## Governança

Novos componentes devem consumir tokens existentes. Um novo token só é justificado quando o mesmo papel visual aparece em mais de um componente. Dados comerciais, preços, contatos e integrações não fazem parte do sistema visual e continuam em suas fontes de verdade próprias.
