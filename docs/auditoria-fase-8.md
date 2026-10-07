# Auditoria · Fase 8

Data: 2026-10-07 · commit auditado: `3930771` (Fase 7) · nada foi corrigido nesta fase.

Método: leitura do código contra `DESIGN-GUIDELINES.md` e `landing-page-structure.md`; build de
produção (`next build` + `next start`); Lighthouse 12 mobile (3 execuções + 3 experimentos com
bloqueio de URL); Playwright 1.60 em 390 / 768 / 1024 / 1440, teclado, lightbox, reduced motion e
medição de caracteres por linha quebra a quebra; pre-flight da `design-taste-frontend`;
`improve-animations` (read-only); review do segundo agente (`impeccable-finish-reviewer`), com os achados conferidos e mesclados (um descartado: o lightbox "deslocado" era artefato da captura; medido, o dialog ocupa a tela inteira e os controles ficam dentro dela).

## Resumo

| Severidade | Qtde | O que significa |
|---|---|---|
| **P0** | 4 | Impede o critério da Fase 9 (Performance ≥ 95) ou descumpre a spec explícita |
| **P1** | 4 | Descumpre checklist §12 / WCAG / regra de dado, sem bloquear deploy |
| **P2** | 14 | Acabamento |
| Fase 9 | 4 | Já previstos no deploy, só registrados |

**O que está bom (verificado, não presumido):** typecheck, lint e build sem nenhum warning; zero
overflow horizontal nas quatro larguras; CTA do herói dentro da dobra em 390×844 (base em 751px);
CLS 0; TBT 10–20ms; JS da aplicação ~13KB gzip; anime.js 14,4KB gzip e só carregado por `import()`
pós-hidratação; reduced motion deixa a página 100% estática e nem baixa o anime.js; a linha do dia
desenha uma vez, trecho a trecho, e reverte; lightbox navegável só por teclado com foco devolvido;
foco visível em 100% dos interativos; Lighthouse Acessibilidade 100 e Boas práticas 100; nenhum hex
fora de `brand.ts`/`globals.css`; nenhum degradê, blur, glass ou `border-radius` em foto.

---

## P0 · Performance mobile fora do alvo

Lighthouse mobile, build de produção, 3 execuções:

| Execução | Performance | LCP | FCP | TBT | CLS | Peso |
|---|---|---|---|---|---|---|
| 1 | 75 | 5,5s | 2,7s | 10ms | 0 | 785KB |
| 2 | 80 | 5,3s | 1,7s | 10ms | 0 | 785KB |
| 3 | 81 | 5,1s | 1,7s | 20ms | 0 | 785KB |

Alvo (§8): Performance ≥ 95, LCP < 2,0s. O LCP **observado** (sem simulação) é 111ms: o problema
é banda no 4G simulado, não código lento. 82% do LCP é "render delay": a foto chega em ~0,9s, mas
disputa banda com **~436KB de fontes** (55% do peso da página).

Experimentos (Lighthouse com `--blocked-url-patterns`, sem mexer no código):

| Cenário | Performance | LCP | Peso |
|---|---|---|---|
| Atual | 80 | 5,3s | 785KB |
| Sem `latin-ext` (Fraunces + Nunito) e sem Fraunces itálico | 90 | 3,6s | 508KB |
| + sem Fraunces romano `latin` | 95 | 2,8s | 390KB |

### P0-1 · Herói sem `fetchPriority="high"`
`src/components/sections/Hero.tsx:51-60` · `src/components/ui/OrganicImage.tsx:90-99`

A §5.1 pede `priority` **e** `fetchPriority="high"`. No Next 16, `priority` só gera o
`<link rel=preload>`; o `<img>` sai sem `fetchpriority` (o Lighthouse reprova `lcp-discovery`:
"fetchpriority=high should be applied: false"). Correção: prop `fetchPriority` no `OrganicImage`,
passada só pelo herói.

### P0-2 · `latin-ext` no preload (134KB inúteis em português)
`src/app/layout.tsx:28-58`

Os quatro preloads são Fraunces `latin` (121KB) + `latin-ext` (106KB) e Nunito `latin` (31KB) +
`latin-ext` (28KB). Todos os acentos do português (ã ç õ é ê á í ó ú â ô à) estão no Latin-1, ou
seja, no subset `latin`. O comentário em `layout.tsx:18` ("sem ele, ã/ç/õ/é caem no fallback")
está incorreto. **Conflita com a §8 da estrutura** ("`latin` + `latin-ext`"): decisão do Douglas.
Correção proposta: `subsets: ["latin"]` nas quatro instâncias.

### P0-3 · Fraunces itálico (149KB) baixado na primeira carga
`src/app/layout.tsx:41-48`

`preload: false` tira do preload, mas o navegador baixa a fonte assim que as avaliações entram no
DOM (a página inteira é renderizada no servidor). O arquivo baixado já é o subset `latin`, então o
P0-2 não reduz esse custo. **Testar primeiro (não muda o design):** `content-visibility: auto` +
`contain-intrinsic-size: auto 1700px` na seção de avaliações (`Depoimentos.tsx`). O navegador pula
o layout fora da tela, e é o layout que dispara o download da fonte. É hipótese: medir, e conferir
Reveal e salto por âncora. Se não bastar, decisão de design: (a) avaliações em Nunito itálico (já
carregado, 15KB); (b) Fraunces itálico sem o eixo `opsz`; (c) manter e aceitar o custo. Os
experimentos mostram que este arquivo, junto com os `latin-ext`, vale ~10 pontos de Performance.

### P0-4 · Fraunces romano: 121KB só no `latin`
`src/app/layout.tsx:28-33`

Os três eixos variáveis (`wght`, `SOFT`, `opsz`) inflam o arquivo. Mesmo com P0-1 a P0-3, a
projeção fica em ~90. Opções, **todas decisão do Douglas** (a §4 e a §8 pedem `opsz` + `SOFT`):
(a) tirar `opsz` e fixar o corte; (b) `preload: false` na Fraunces romana (o h1 troca de fonte
depois do primeiro paint; o fallback métrico do next/font segura o CLS); (c) aceitar Performance
~90 e registrar a exceção na §8. Recomendação: aplicar P0-1 a P0-3, medir de novo, e só então
decidir entre (a) e (b).

---

## P1

### P1-1 · Rótulo acessível não contém o texto visível (WCAG 2.5.3, nível A)
`src/config/content.ts:122, 158, 165, 413-418, 554, 613, 619` (+ `header.inicioLabel`, `:128`)

Sete links têm `aria-label` que não começa pelo texto visível. Quem usa comando de voz diz
"Chamar no WhatsApp" e o link se chama "Chamar o Loft Miragem no WhatsApp para ver as datas…". O
Lighthouse sinaliza (`label-content-name-mismatch`; peso zero, por isso a nota segue 100).
Correção: o rótulo começa com o texto visível e acrescenta o resto, ex.
`"Chamar no WhatsApp, Loft Miragem (abre em nova aba)"`, `"ou veja as datas no Airbnb (abre em
nova aba)"`, `"Loft Miragem, ir para o início"`.

### P1-2 · h1 em três linhas (spec: "em duas linhas")
`src/components/sections/Hero.tsx:68-75` · `src/config/content.ts:149`

390px: "A vista / mais exclusiva / de Três Marias". 1440px: "A vista mais / exclusiva / de Três
Marias". Cada `span` de linha é balanceado sozinho e o primeiro ("A vista mais exclusiva") não cabe
em uma linha no `display-xl`. Screenshots: `dobra-390.png`, `dobra-1440.png` (em 768 já são duas,
porque a coluna é a largura toda). O pior caso é **1024**: a coluna `55fr` (`Hero.tsx:46`) cai à
metade enquanto o display-xl cresce. Cuidado: `whitespace-nowrap` sem reduzir o tamanho empurra o
texto para dentro da foto, e a medição de overflow da página não pega isso. Correção: reduzir o
teto do `clamp` só no h1 do herói a partir de `lg` (ou grade 60/40), medindo em 1024; decidir se
390 aceita três linhas.

### P1-3 · Medida passa de 72 caracteres por linha
`src/app/globals.css:123-125` (`medida: 62ch`)

`ch` é a largura do "0" da Nunito, mais estreito que a média do texto corrido; 62ch vira até 78
caracteres. Medido quebra a quebra:

| Largura | Texto | Máx. por linha |
|---|---|---|
| 768 | subtítulo do herói (body-lg) | 78 |
| 768 / 1024 / 1440 | resposta do FAQ "É self check-in…" | 73 |
| 768 / 1024 | apoio do CtaFinal | 73 |

Correção: `max-width: 54ch` (ou `34em`) e remedir. Checklist §12, item "Nenhum texto acima de 72
caracteres por linha".

### P1-4 · Afirmação deduzida, não confirmada, na tarde da Experiência
`src/config/content.ts:280`

"É só levar até a margem e remar pela represa" garante acesso fácil à margem a pé. A orientação do
SUP é pendência (FAQ, `content.ts:686`) e uma avaliação fala em "rua pertinho", sinal de que há
rua no caminho. Fere a regra "nunca inventar dado". Correção: confirmar com os anfitriões ou
neutralizar até lá ("As pranchas de stand-up paddle ficam no loft, prontas para a represa.").

---

## P2

| # | Achado | Onde | Correção |
|---|---|---|---|
| P2-1 | Link "O loft" do menu com 35×44px; a regra do projeto é 44×44 (WCAG 2.5.8 aceita 24) | `Header.tsx:89` | `min-w-11 justify-center` nos links do nav |
| P2-2 | Faixa ProvaRapida é `<section>` sem nome (§9: `section aria-labelledby`) | `ProvaRapida.tsx:45` | `aria-label="Avaliações em números"` via Section, ou trocar para `div` |
| P2-3 | `→` (U+2192) e `★` (U+2605) não estão no subset `latin`: renderizam na fonte do sistema, com desenho e peso diferentes | `content.ts:163, 169, 504, 617` | Seta: Lucide `ArrowRight` `aria-hidden`. Estrela: **manter como caractere** (SVG viraria a estrela desenhada que a §2 proíbe, e a §5.1/§5.6 escrevem "★"); no máximo declarar uma pilha de fonte para ela |
| P2-4 | 13KB de polyfills legados no chunk do framework (`Array.prototype.at`, `Object.hasOwn`…) | build | `browserslist` com navegadores modernos no `package.json` |
| P2-5 | `sizes` maior que a foto exibida. Lightbox: `sizes="100vw"`, foto exibida com 561px em 1440×900 e o navegador pede `w=1920` (medido). Herói: `42vw` no `lg`, mas em 1440 a foto mede ~446px (~31vw). Os JPEG `-grande` de 300–330KB são só a origem: o que trafega sai do otimizador em AVIF/WebP, então o teto de ~200KB da §8 não é o problema | `Lightbox.tsx:124`, `Hero.tsx:57` | Lightbox: `sizes="(min-aspect-ratio: 3/4) 75vh, 100vw"`. Herói: `(min-width: 1440px) 446px, (min-width: 1024px) 42vw, …` |
| P2-6 | Hover com `translate` não restrito a `(hover: hover)`: no toque, o botão "sobe" no tap e fica | `Button.tsx:56, 60` | `[@media(hover:hover)]:hover:-translate-y-px` |
| P2-7 | Reduced motion zera também transições de cor (feedback que não é movimento) | `globals.css:324-331` | Limitar a regra `*` a `transform`/`animation`; manter `color`/`background-color` |
| P2-8 | Curva `cubic-bezier(0.23, 1, 0.32, 1)` escrita inline; Button e StickyMobileCta usam o `ease-out` fraco do Tailwind | `globals.css:239`, `Button.tsx:29`, `StickyMobileCta.tsx:49` | Token `--ease-out` no `@theme` e usar nos três |
| P2-9 | Seis rótulos diferentes para a mesma ação (WhatsApp): "WhatsApp", "Chamar no WhatsApp", "Tirar uma dúvida no WhatsApp", "Mandar as datas no WhatsApp", "Ver datas no WhatsApp" | `content.ts:120, 156, 451, 611, 707, 759` | A §6 só fixa as mensagens, não os rótulos. Avaliar se "Ver datas" (sticky) e "Chamar" (herói/final) convergem |
| P2-10 | "Todos os direitos reservados." é texto de template | `content.ts:745` | `© 2026 Loft Miragem` basta |
| P2-11 | Experiência no `lg`: topos das fotos de manhã e noite desalinhados sem intenção (1024: y 347 × 432; 1440: 320 × 390), porque `justify-end` alinha pela base e o h3 da manhã tem mais linhas | `Experiencia.tsx:98` · `s-1024-experiencia.png` | `lg:justify-between`: fotos no topo da linha 1, texto continua encostado na onda |
| P2-12 | O marcador da lista "O que tem no loft" (traço 12×2px) tem o desenho de um "—" antes de cada item. Não fere a letra da regra (§3 permite o acento como marcador), mas reproduz a lista puxada por travessão | `OLoft.tsx:58-61` | Crista de onda de 12px em `acento`, ou ponto. Decisão do Douglas |
| P2-13 | Emoji literal ("🙌🏼✨") no fim da avaliação da Lorena, colorido e em fonte do sistema no meio da Fraunces itálica; não está entre as exceções registradas (travessão da Cynthia, "mar de minas" do Yuri) | `content.ts:547` | Registrar como exceção ou cortar os dois emojis (não muda o sentido). Decisão do Douglas |
| P2-14 | "★ 5,0 · 18 avaliações no Google · 5 no Airbnb": logo depois de "5,0", "5 no Airbnb" pode ser lido como nota | `content.ts:504` | "5 avaliações no Airbnb" (a §5.6 traz o texto atual; mudar só com aval) |

---

## 1. Checklist §12 do DESIGN-GUIDELINES

| Item | Status | Evidência |
|---|---|---|
| Nenhuma cor fora dos tokens; nenhum hex no JSX | ✅ | grep: hex só em `brand.ts:36-45` e `globals.css:20-29` |
| Pares texto/fundo AA | ✅ | Tabela §3; `tinta-suave` só sobre papel/creme; atribuição das avaliações em `ancora-quente` (`Depoimentos.tsx:55`); foco `acento` sobre ancora (`globals.css:203`) |
| `decor`/`superficie-2` não são texto sobre claro | ✅ | `superficie-2` como texto só sobre ancora (`Section.tsx:28`, `Footer.tsx:25`, `CtaFinal.tsx:84`, `Lightbox.tsx:101`) |
| CTA primário `ancora`; Airbnb link de texto | ✅ | `Button.tsx:55-56`; `LinkExterno.tsx` |
| Nenhum degradê laranja→turquesa | ✅ | grep `gradient`: só em texto de comentário/styleguide |
| Fotos com máscara de onda, nenhuma com `border-radius` | ✅ | `OrganicImage.tsx:88`; único `border-radius` é o anel de foco (`globals.css:198`) |
| `por-do-sol` abre a página, com destaque | ✅ | `Hero.tsx:51`; LCP é essa imagem |
| Uma única coreografia, resto reveal | ✅ | `LinhaDoDia.tsx`; Reveal 500ms, 16px, ease-out forte (`globals.css:229-242`); deriva e parallax são exceções da §8 |
| `prefers-reduced-motion` testado | ✅ | Playwright: 0 reveal oculto, 0 animação ativa, parallax `none`, deriva parada, anime.js não baixado |
| Lightbox só por teclado, foco devolvido | ✅ | Enter abre (foco em "Fechar"), ←/→ com volta (1→2, 2→1→5), Esc fecha, foco volta à miniatura de origem, scroll travado. Tab depois do último controle vai para a UI do navegador (comportamento nativo do `<dialog>`; a página fica inerte) |
| Foco visível em 100% dos interativos | ✅ | 12 primeiros focos com outline 2px; skip link é o 1º Tab em 390 e em 1440 |
| Testado em 390 primeiro | ✅ | screenshots por seção em 390/768/1024/1440 |
| Nenhum texto acima de 72 caracteres | ❌ | P1-3 |
| Nenhuma frase genérica de anúncio de temporada | ⚠️ | Ver item 5: copy específica; só o rodapé (P2-10) |
| Nenhum "praia"/"mar" fora de "piscina-praia" | ✅ | Única ocorrência: "mar de minas" na avaliação do Yuri, exceção decidida em 2026-10-06 (`content.ts:473`) |
| Zero travessão em `src/` e `public/` | ⚠️ | Único visível: avaliação da Cynthia (`content.ts:512`), exceção decidida em 2026-10-06. Os demais estão em comentários e nas strings de `pendenciasDoSchema()` (`schema.ts:158-186`), que não vão para a página |
| Eyebrows ≤ 1 a cada 3 seções, nenhum numerado | ⚠️ | 2 eyebrows em 10 seções (herói e Como reservar). Os números 01/02/03 usam o estilo eyebrow (`ComoFunciona.tsx:79`); a §5.7 justifica a numeração, mas o checklist diz "nenhum numerado". Confirmar com o Douglas |
| Licença das fontes documentada (OFL) | ✅ | DESIGN-GUIDELINES §4; `layout.tsx:11-20` |
| Nenhum `<<A CONFIRMAR>>` no deploy | Fase 9 | 12 pendências distintas na página (ver abaixo) |

## 2. Acessibilidade (estrutura §9)

- Landmarks: 1 `header`, 1 `main`, 1 `footer`, 1 `nav` com rótulo. ✅
- Seções: 9 de 10 com `aria-labelledby` apontando para id existente; ProvaRapida sem (P2-2).
- Headings: um h1; h2 por seção; h3 nos momentos e etapas. Ordem sem saltos. ✅
- `alt`: 0 imagens sem `alt`; único `alt=""` é o monograma do header, decorativo ao lado do nome. ✅
- SVGs decorativos: todos dentro de `aria-hidden`. ✅
- Alvos: todos ≥ 44 de altura; "O loft" com 35 de largura (P2-1).
- Label in name: P1-1.
- `lang="pt-BR"`. ✅
- Lighthouse Acessibilidade: 100 nas três execuções.

## 3. Performance (estrutura §8)

| Métrica | Alvo | Medido | |
|---|---|---|---|
| LCP | < 2,0s | 5,1–5,5s simulado · 111ms observado | ❌ P0 |
| CLS | < 0,05 | 0 | ✅ |
| INP (proxy TBT) | < 200ms | TBT 10–20ms | ✅ |
| JS da aplicação (gzip) | < 100KB | ~13,4KB (`1fu3y4…`) | ✅ |
| JS do framework (gzip) | (medir separado) | ~145KB (React DOM, Next runtime, Turbopack) | info |
| Polyfills `noModule` | | 39KB, não baixado por navegador moderno | info |
| JS de animação (gzip) | < 15KB | 14,4KB, por `import()` | ✅ (96% do teto) |
| Peso na primeira carga | < 1,2MB | 785KB (fontes 436KB) | ✅ |
| Lighthouse Performance | ≥ 95 | 75 / 80 / 81 | ❌ P0 |
| Lighthouse SEO | | 69, só por `noindex` (proposital até o domínio) | Fase 9 |

Outros pontos da §8: `priority` só no herói ✅; galeria `lazy` ✅; versão grande do lightbox só ao
abrir ✅ (nenhum `<Image>` no dialog fechado); `next/font` com `display: swap` ✅; AVIF/WebP
ativos (`next.config.ts`) ✅; `mari-com-prancha` reduzida para 197KB (versão de grade) ✅.

## 4. Responsividade (390 / 768 / 1024 / 1440)

- Overflow horizontal: 0 nas quatro larguras. ✅
- Herói: CTA visível sem rolar em 390×844 ✅; h1 em 3 linhas (P1-2).
- Experiência: no celular a linha desce pela esquerda; no `lg` a fileira de ícones fica na linha do
  meio, com manhã/noite em cima e tarde embaixo. A 1024 o h3 "Café flutuando na piscina-praia"
  quebra em 3 linhas na coluna estreita (aceitável, anotar para o polish).
- Galeria: destaque 2×2 + 4 miniaturas fechando a grade em 768+; no celular, destaque em largura
  cheia + 2×2. ✅
- Sticky mobile aparece depois do herói; o rodapé tem folga (`pb-32`) para ele. ✅
- Sem quebra de layout com `<<A CONFIRMAR>>` longos (OLoft, Como reservar, Localização, FAQ, rodapé).

## 5. Anti-template (§2 e §11, pre-flight da Taste)

O que a página **não** tem, por desenho: overlay escuro com título branco, grade de ícones de
comodidade, carrossel, estrelas desenhadas, botão laranja, degradê tropical, glass, emoji em
heading. A copy nomeia o que existe (piscina-praia, SUP, mezanino, cabana preta, cofre de chaves) e
quase nenhuma frase caberia em outro anúncio.

Onde ainda lê como genérico:
- Rodapé "Todos os direitos reservados." (P2-10).
- A galeria repete as 5 fotos da Experiência e do herói. Já é pendência conhecida (mais fotos,
  DESIGN-GUIDELINES §9); é o ponto que mais aproxima a página de "anúncio com pouco material".
- Rótulos de CTA variados demais para a mesma ação (P2-9).
- Listas com filete em toda linha (O loft: 10 linhas; FAQ; Como reservar). A Taste chama de
  "spec sheet". A spec pede justamente texto em duas colunas no lugar da grade de ícones, então
  fica registrado sem ação.

Regras da Taste que **não** se aplicam aqui (DESIGN-GUIDELINES vence): Fraunces banida, paleta
creme banida, Lucide desencorajado, dark mode obrigatório, citação com no máximo 3 linhas (a spec
manda texto integral), linha de prova abaixo do CTA no herói (pedida na §5.1).

## Motion (`improve-animations`, read-only)

Nenhum achado HIGH ou MEDIUM. A coreografia respeita a §8 e as regras do Emil: ease-out forte nas
entradas, nada anima duas vezes, estado inicial só via JS, interrupção por `revert()` em resize,
troca de breakpoint e mudança de preferência, loops pausados fora da tela. Os três achados LOW
estão em P2-6, P2-7 e P2-8.

## Pendências para a Fase 9 (só registro)

- 12 `<<A CONFIRMAR>>` distintos na página: café da manhã (2x), ar-condicionado, roupa de cama,
  forma de pagamento, horários de check-in/out (2x), bairro/acesso, distância de BH, link do Maps,
  preço, pet, orientação do SUP, vantagem da reserva direta, crédito do desenvolvedor.
- `noindex` enquanto não houver domínio (SEO 69 no Lighthouse por isso).
- `/styleguide` ainda publicado.
- `public/images/antes/` está fora do git: confirmar que não sobe no deploy.

---

## Backlog de correções (um prompt por problema)

Ordem recomendada: P0-1 → P0-2 → teste do `content-visibility` (P0-3) → medir → P0-3/P0-4 (decisão) → P1 → P2.

| # | Prompt |
|---|---|
| P0-1 | "Adicione `fetchPriority` como prop opcional do `OrganicImage` e passe `fetchPriority="high"` só no herói (§5.1). Confira no HTML da build que o `<img>` sai com `fetchpriority=high`." |
| P0-2 | "Decidi: subsets só `latin` nas quatro instâncias de fonte do `layout.tsx`. Corrija o comentário sobre `latin-ext` e atualize a §8 da estrutura. Rode o Lighthouse mobile 3x." |
| P0-3 | "Fraunces itálico das avaliações: aplique a opção (a/b/c) que eu escolher e rode o Lighthouse mobile 3x." |
| P0-4 | "Fraunces romano: aplique a opção (a/b/c) que eu escolher e rode o Lighthouse mobile 3x." |
| P1-1 | "Reescreva os `ariaLabel` de `content.ts` para começarem pelo texto visível do link (WCAG 2.5.3), mantendo '(abre em nova aba)'." |
| P1-2 | "Faça o h1 do herói caber em duas linhas a partir de `lg` e me mostre 390 e 1440." |
| P1-4 | "Confirme com os anfitriões o acesso à margem para o SUP; até lá, neutralize a frase da tarde em `content.ts:280`." |
| P1-3 | "Reduza `medida` até nenhum parágrafo passar de 72 caracteres por linha em 768/1024/1440 e mostre a medição." |
| P2-1 | "Alvos do nav do header com no mínimo 44×44." |
| P2-2 | "Dê nome acessível à faixa ProvaRapida ou troque o `<section>` por `<div>`." |
| P2-3 | "Troque `→` e `★` da copy por ícones Lucide `aria-hidden` (ou remova a estrela)." |
| P2-4 | "Adicione `browserslist` moderno e confira o chunk do framework sem polyfills legados." |
| P2-5 | "Ajuste o `sizes` do lightbox e do herói ao tamanho exibido e confira a variante pedida no Network." |
| P2-6 | "Restrinja o `hover:-translate-y-px` do Button a `(hover: hover)`." |
| P2-7 | "Em reduced motion, mantenha as transições de cor e zere só transform/animação." |
| P2-8 | "Crie o token `--ease-out` no `@theme` e use no reveal, no Button e no StickyMobileCta." |
| P2-9 | "Proponha rótulos de CTA unificados por intenção (não mude as mensagens da §6)." |
| P2-10 | "Troque o copyright por `© {ano} Loft Miragem`." |
| P2-11 | "Alinhe pelo topo as fotos de manhã e noite da Experiência no `lg` (`justify-between`) e mostre 1024 e 1440." |
| P2-12 | "Troque o marcador-traço da lista do O loft pelo que eu escolher (crista de onda ou ponto)." |
| P2-13 | "Avaliação da Lorena: aplique a decisão sobre os emojis." |
| P2-14 | "Troque '5 no Airbnb' por '5 avaliações no Airbnb' e atualize a §5.6." |
