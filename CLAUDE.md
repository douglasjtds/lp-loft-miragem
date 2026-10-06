# CLAUDE.md · lp-loft-miragem

Landing page one-page do **Loft Miragem**, hospedagem para casais na represa de Três Marias-MG.
Conversão por WhatsApp, sem backend. Adapta a skill `landing-profissional` (feita para
profissional autônomo) para hospedagem.

## Fonte da verdade

Antes de qualquer tarefa, ler os documentos em `instructions/`:

| Arquivo | Para quê |
|---|---|
| `instructions/DESIGN-GUIDELINES.md` | Como parece: tokens, tipografia, formas, motion, voz. Ler a §0 primeiro |
| `instructions/landing-page-structure.md` | Como é construído: stack, arquivos, seções, CTAs, SEO, performance |
| `instructions/TODOs.md` | Sequência de fases com prompts prontos e critério de pronto |

Não editar arquivos de `instructions/` sem pedido explícito do Douglas. Se uma tarefa conflitar
com eles, parar e perguntar. Assets originais da cliente em `reference-files/`.

## Regras de trabalho

- **O Claude nunca roda `git commit`.** Ao fim de cada fase, entrega a mensagem de commit pronta
  (Conventional Commits) e o Douglas commita.
- Uma fase por vez (`instructions/TODOs.md`).
- **Nunca inventar dado** (preço, horário, regra, avaliação, distância). Vira `<<A CONFIRMAR: ...>>`.
- Stack e decisões técnicas: `landing-page-structure.md` §2. Animação com anime.js v4, não GSAP.

## Skills

Versionadas em `.claude/skills/` (copiadas do projeto mypage, versões em `skills-lock.json`).
Não editar `.claude/skills/`; atualizar só reinstalando.

### Quando usar cada uma

| Momento | Skill / comando |
|---|---|
| Antes de construir uma seção | `/impeccable shape` com a seção do `landing-page-structure.md` §5 |
| Depois de implementar uma seção | `/impeccable critique` + `design-taste-frontend` |
| Decisões de animação, layout e acabamento | `emil-design-eng`, `animate` (referência principal) |
| Revisão de animações | `/review-animations` (só manual), depois `improve-animations` se necessário |
| Conferir que nada além do previsto anima | `find-animation-opportunities` |
| Robustez da UI (`<<A CONFIRMAR>>` longos, galeria 4 a 12 fotos, FAQ longo) | `break-ui` |
| Qualidade técnica (a11y, performance, responsivo) | `/impeccable audit` |
| Acabamento final antes do deploy | `/impeccable polish` |
| Review com segundo agente (fases 5, 7, 8) | agent `impeccable-finish-reviewer` |
| Nome de um efeito de motion | `animation-vocabulary` |

### Quando as skills discordarem

Ordem de prioridade: `instructions/DESIGN-GUIDELINES.md` → `landing-profissional` (arquitetura
e scaffold) → emilkowalski/skills (motion, layout, acabamento) → Impeccable → Taste.

- Taste traz templates de GSAP e Motion: ignorar. Motion segue DESIGN-GUIDELINES §8 (anime.js +
  CSS), com curvas, durações e interrupção pelas regras do Emil.
- Ao usar Taste: variação alta, intensidade de motion baixa, densidade visual baixa.

## Regras "sem cara de IA" (resumo)

Detalhe em DESIGN-GUIDELINES §2 e §11. As que mais escapam:

- **Zero travessão (`—`) em qualquer texto visível**: copy, `title`, `description`, `alt`,
  legendas, botões. Usar vírgula, dois-pontos, `·` ou quebra de linha.
- Eyebrow (único texto em caixa alta) em no máximo 1 a cada 3 seções.
- Sem blur, glass, degradê laranja→turquesa, overlay escuro com título branco centralizado,
  grade de ícones de comodidade, carrossel de depoimentos, estrelas desenhadas.
- CTA primário `ancora`; âmbar nunca é botão; turquesa nunca é texto.
- "Represa", nunca "praia" ou "mar" (exceto "piscina-praia").
