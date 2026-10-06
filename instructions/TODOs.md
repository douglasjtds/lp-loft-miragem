# TODOs.md
### Sequência de execução — Landing page Loft Miragem

> **Como usar este arquivo.** Cada fase tem um prompt pronto para colar. Rode **uma fase por vez**,
> valide o critério de pronto, commite você mesmo, e só então avance. O Claude **nunca commita** —
> ao fim de cada fase ele entrega a mensagem de commit pronta, em Conventional Commits.
>
> **Antes de começar:** os três `.md` na raiz do projeto e os assets em `reference-files/`.
> Este projeto **adapta** a skill `landing-profissional` para hospedagem — leia a §0 do
> `DESIGN-GUIDELINES.md` antes de qualquer fase.

---

## Fase 0 — Auditoria e scaffold

**Objetivo:** projeto rodando, decisões de licença e imagem registradas.

```
Leia DESIGN-GUIDELINES.md e landing-page-structure.md por inteiro antes de escrever código.

PRIMEIRO, confirme a auditoria (já feita no planejamento — só valide):
1. Fontes: Fraunces e Nunito Sans, Google Fonts, OFL. Nenhuma fonte veio da cliente.
2. Ícones da marca: não existem; serão derivados do emblema da logo (Fase 2).
3. Fotos: 4, de momentos diferentes; mari-com-prancha.jpg tem pessoa identificável.

DEPOIS, crie o scaffold copiando assets/scaffold/ da skill para a raiz, e ajuste:
- package.json com o nome "lp-loft-miragem"
- README curto: como rodar, como buildar, onde ficam os tokens
- .gitignore: avalie se reference-files/ (~4MB) entra ou não, e me diga
- Copie também scripts/contraste.mjs e scripts/processar-fotos.mjs da skill

NÃO configure output: 'export'. Não escreva seção nenhuma ainda.
Rode install, lint, typecheck e build e me mostre o resultado.
```

**Pronto quando:** `dev` sobe, `build` passa.

---

## Fase 1 — Tokens e base tipográfica

```
Implemente o sistema de design (DESIGN-GUIDELINES §3, §4, §7).

1. Os dez hexes em globals.css (@theme) e em src/config/brand.ts, exatamente os da §3.
2. Rode `node scripts/contraste.mjs` e confira que bate com a tabela da §3. Se divergir, PARE.
3. Fontes em app/layout.tsx: Fraunces (display e editorial — eixos opsz e SOFT, itálico) e
   Nunito Sans (UI). Subsets latin + latin-ext, display swap. Mantenha os nomes de custom
   property. O scaffold espera três famílias: a editorial aponta para a Fraunces itálico.
4. Em brand.ts, troque o `profile` de profissional por dados do negócio: nome, cidade/UF,
   anfitriões ["Calypso Martins", "André Tertuliano"], WhatsApp 5531972044476, URL do Airbnb
   (sem parâmetros de compartilhamento), Instagram. Remova registro profissional — e ajuste os
   consumidores (schema, footer, styleguide) para não quebrarem.
5. Valide /styleguide.

Nenhum hex fora de globals.css e brand.ts.
```

**Pronto quando:** `/styleguide` renderiza a paleta e a escala com as fontes certas.

---

## Fase 2 — Formas de onda e ícones derivados da logo

```
Siga DESIGN-GUIDELINES §5 e §6.

1. OrganicClipPaths.tsx — as quatro máscaras na linguagem da ONDA da logo (cinco cristas,
   amplitude baixa), objectBoundingBox:
   a: borda inferior em onda (herói) · b: borda superior em onda, cristas longas (Experiência)
   c: lateral esquerda em onda vertical · d: duas bordas opostas, amplitude mínima (galeria)
   Lados retos ficam retos. Nenhuma pode parecer border-radius.

2. brand-icons.ts — desenhe sol-nascente, prancha, lua-agua e onda: stroke arredondado, peso do
   contorno da logo, um path por gesto, viewBox quadrado comum. Salve também em
   public/brand/icone-*.svg.

3. Monograma: redesenhe o emblema circular da logo (sol + 5 ondas) em SVG —
   public/brand/monograma.svg (cor) e monograma-claro.svg (para fundo ancora). Compare
   lado a lado com reference-files/POUSADA LOGO.png.

Renderize tudo no /styleguide e me mostre (screenshot).
```

**Pronto quando:** as máscaras leem como "água", distintas entre si; ícones em stroke e
desenháveis; monograma fiel à logo.

---

## Fase 3 — Assets

```
Pipeline de imagens (scripts/processar-fotos.mjs). Originais em reference-files/.

1. Tabela FOTOS:
   por-do-sol.jpg       → hero-por-do-sol (4:5, sol no terço superior)
   cafe-da-manha.jpg    → manha-cafe
   mari-com-prancha.jpg → tarde-sup (reduzir: original 3072x4096 / 1,5MB)
   piscina-noite.jpg    → noite-piscina (levantar sombras sem estourar o azul)
   + versões "grande" para o lightbox
2. Tratamento leve e unificado (DESIGN-GUIDELINES §9): aquecer 2–3%, turquesa da piscina −8%
   de saturação. NÃO igualar os três horários. Antes/depois na página montada.
3. Logo: public/brand/logo.png (original) e logo-clara.png (texto e contorno recoloridos para
   o token papel, para o footer).
4. favicon.ico + apple-touch-icon.png a partir do monograma; og-image.jpg 1200x630 com o pôr do
   sol e a logo.

Reporte o peso de cada arquivo. Nada acima de ~200KB (exceto versões do lightbox: ~350KB).
```

**Pronto quando:** tudo em `public/`, dentro do orçamento.

---

## Fase 4 — Conteúdo

```
Preencha src/config/content.ts com TODA a copy (landing-page-structure §5 e §6,
DESIGN-GUIDELINES §11).

- Remova o conteúdo de ParaQuem, Metodo e Sobre; crie os blocos de Experiencia (3 momentos),
  Galeria (lista de fotos com alt e legenda), OLoft (comodidades confirmadas + marcadores),
  Localizacao, Avaliações (exibir: false, lista vazia) e Como reservar.
- O h1 é a frase da cliente: "A vista mais exclusiva de Três Marias".
- Dados confirmados: estão na §5.2 e §5.5 do landing-page-structure. Todo o resto é
  <<A CONFIRMAR: ...>>. NÃO invente preço, horário, regra, café, pet, distância.
- Avaliações: NÃO escreva, resuma nem parafraseie nenhuma. A lista fica vazia até os prints.
- "Represa", nunca "praia" ou "mar" (exceto "piscina-praia").
- Seis mensagens de WhatsApp, distinguíveis, na voz de quem visita (§6).
- Teste cada frase: se caberia em qualquer anúncio de temporada, reescreva.

Ao final, liste todos os <<A CONFIRMAR>> num bloco só.
```

**Pronto quando:** `content.ts` completo, lista de pendências gerada, zero dado inventado.

---

## Fase 5 — Seções (estáticas, sem animação)

**Leva A — Header, Hero, ProvaRapida** · **Leva B — Experiencia, Galeria (+ Lightbox), OLoft** ·
**Leva C — Avaliações, Como reservar, Localizacao, Faq, CtaFinal, Footer, StickyMobileCta**

```
Leva [A, B ou C — escolha uma] conforme landing-page-structure §5. Sem animação.

- Seções do scaffold: adapte (Hero, ProvaRapida, ComoFunciona→Como reservar,
  Depoimentos→Avaliações, Faq, CtaFinal, layout/*).
- Seções novas (Experiencia, Galeria, OLoft, Localizacao, ui/Lightbox): sigam o padrão dos
  componentes existentes — leem tudo de content.ts/brand.ts, usam Section, Eyebrow,
  OrganicImage, WhatsappCta, Pendencia.
- Remova ParaQuem, Metodo e Sobre de page.tsx e apague os arquivos.
- Experiencia é linha do tempo (horizontal no desktop, vertical no mobile), não 3 cards.
- Galeria: grid assimétrico; lightbox em <dialog> com teclado e foco devolvido.

Valide em 390px ANTES de qualquer outro breakpoint.
```

**Pronto quando:** página completa e navegável, sem animação, bonita em 390px.

**⚠️ Passe visual REAL** ao fim da leva B (navegador): se a Experiência empilhar como três cards
iguais no mobile, o efeito template voltou. Review com segundo agente ao fim da fase.

---

## Fase 6 — SEO técnico

```
Complete o SEO (landing-page-structure §7).

1. Metadata em app/layout.tsx; noindex enquanto o domínio for <<A CONFIRMAR>>.
2. src/lib/schema.ts: TIPO_NEGOCIO = "LodgingBusiness". Remova o nó Person. amenityFeature com
   as comodidades confirmadas, numberOfRooms 1, sameAs (Instagram, Airbnb), address só com
   cidade/UF/BR. SEM aggregateRating (ver §7 — diretriz do Google).
3. FAQPage só com respostas confirmadas.
4. Âncoras: #experiencia #galeria #o-loft #avaliacoes #como-reservar #localizacao #duvidas
5. Headings: um h1, sem pular nível. not-found.tsx no estilo da marca.

Confirme que nenhum <<A CONFIRMAR>> vaza para o JSON-LD e rode pendenciasDoSchema().
```

**Pronto quando:** JSON-LD válido no Rich Results Test (ou validação local equivalente).

---

## Fase 7 — Movimento

```
DESIGN-GUIDELINES §8. Leia a seção inteira antes.

1. A assinatura: na Experiencia, a onda se desenha ao longo da linha do dia e cada ícone
   (sol-nascente → prancha → lua-agua) se desenha ao chegar na sua parada. Adapte DrawIcons
   para isso. Uma vez só.
2. HeroTimeline: h1 por linha, subtítulo, CTA. A foto do herói NÃO anima de entrada.
3. Reveal nas demais seções. Deriva das ondas no CtaFinal (≤16px, 20–30s).
4. Parallax CSS leve na foto do herói, atrás de @supports.

anime.js por subpath + dynamic import após hidratação; createScope + revert.
Estado inicial via JS. Reduced-motion: tudo estático e visível.
Reporte o chunk de animação em gzip (orçamento 15KB).
```

**Pronto quando:** a linha do dia impressiona, o resto é discreto, reduced-motion estático. Passe
visual + review com segundo agente.

---

## Fase 8 — Auditoria

```
Auditoria contra os dois documentos. Não corrija nada ainda.

1. Checklist §12 do DESIGN-GUIDELINES, item por item, com arquivo:linha.
2. Acessibilidade (§9 da estrutura), incluindo o lightbox só por teclado.
3. Performance (§8): bundles, separando framework de aplicação; Lighthouse mobile.
4. Responsividade 390 / 768 / 1024 / 1440 — renderizado de verdade.
5. Anti-template (§2): o que ainda parece anúncio genérico de temporada ou gerado por IA?
```

Depois: correções em prompts pequenos, um problema por vez.

---

## Fase 9 — Deploy

```
1. Substitua todos os <<A CONFIRMAR>> pelos valores reais. Nenhum pode sobreviver ao deploy.
   Confira de novo nota e nº de avaliações no Airbnb.
2. Remova (ou proteja) /styleguide.
3. Build de produção sem warnings.
4. Vercel apontando para a main; DNS do domínio quando existir (até lá, *.vercel.app com noindex).
5. Checklist: preview do link no WhatsApp e no Instagram, favicon, JSON-LD, todos os CTAs
   abrindo a conversa certa, Airbnb abrindo o anúncio certo.
6. Lighthouse mobile: as quatro pontuações.
```

**Pronto quando:** no ar, Performance ≥ 95, preview correto, zero `<<A CONFIRMAR>>`.

---

## Regras de trabalho

1. **Uma fase por vez.** O Claude reporta a validação e entrega a mensagem de commit;
   **nunca roda `git commit`.**
2. Em sessão nova, mandar ler os três `.md` primeiro.
3. **Nunca aceitar dado inventado** — preço, horário, regra, avaliação. Vira `<<A CONFIRMAR>>`.
4. Validar visualmente ao fim de cada leva de seções.
5. Prompt que gere mais de ~400 linhas: quebrar em dois.
6. Review com segundo agente ao fim das fases 5, 7 e 8.
