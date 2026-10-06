# landing-page-structure.md
### Especificação técnica — Landing page Loft Miragem

> Leia `DESIGN-GUIDELINES.md` **antes** deste arquivo — em especial a §0, que explica por que a
> arquitetura de seções difere do template da skill. Aquele define o *como parece*; este define o
> *como é construído*. Assets originais em `reference-files/`.

---

## 1. Objetivo e contexto

Página única, pública, sem backend e sem banco de dados, para o **Loft Miragem**: loft de
hospedagem para casais (acomoda até 4) na represa de Três Marias-MG, com piscina-praia e SUP.
Anfitriões: **Calypso Martins e André Tertuliano**.

**Canais de entrada:**

| Canal | Peso | O que ele exige |
|---|---|---|
| Link na bio do Instagram @loft_miragem (7,8 mil seguidores) e links enviados no WhatsApp | **Principal** | Mobile primeiro, carregamento rápido, CTA acima da dobra, decisão em segundos, og-image bonita no preview do WhatsApp |
| Busca orgânica ("loft Três Marias", "hospedagem casal Três Marias") | Secundário | HTML no servidor, metadados, dados estruturados, texto real |

**Ação de conversão principal:** abrir uma conversa no WhatsApp (+55 31 97204-4476) com mensagem
pré-preenchida. **Secundária:** abrir o anúncio no Airbnb. Não existe formulário, login,
calendário, nem reserva no site.

**Métrica de sucesso:** cliques no CTA de WhatsApp por sessão (e, separado, cliques no Airbnb).

---

## 2. Stack e decisões técnicas

| Camada | Escolha | Justificativa |
|---|---|---|
| Framework | **Next.js (App Router)** + TypeScript | SSG nativo resolve o SEO |
| Estilo | **Tailwind CSS** com tokens no `@theme` | Tokens da marca viram utilitários |
| Animação | **anime.js v4** (subpath imports, dynamic import) | Coreografia da assinatura; fora do bundle inicial |
| Hospedagem | **Vercel** (`*.vercel.app` até haver domínio) | Build padrão + otimização de imagem |
| Imagens | `next/image` | AVIF/WebP automático, `srcset` |
| Analytics | nenhum por enquanto; evento `cta_whatsapp`/`cta_airbnb` preparado no `lib/analytics` | Decisão do usuário: só o rastreio por mensagem |
| Ícones de UI | `lucide-react` | Import por ícone |
| Lightbox | `<dialog>` nativo + estado React mínimo | Zero dependência; foco e `Esc` de graça |

### ⚠️ **NÃO usar `output: 'export'`**

Desativaria o `next/image`. O build padrão da Vercel já gera a página estática.

### Fora de escopo

Calendário de disponibilidade, motor de reserva, preço dinâmico, sincronização com Airbnb, blog,
formulário, i18n, tema escuro, embed de mapa interativo (pesa e não converte — ver §5.8).

---

## 3. Estrutura de arquivos

```
lp-loft-miragem/
├── reference-files/                 # material da cliente (não vai pro build)
├── public/
│   ├── images/                      # hero-por-do-sol, manha-cafe, tarde-sup, noite-piscina (+ futuras)
│   ├── brand/                       # monograma.svg, monograma-claro.svg, logo-clara.png, icone-*.svg
│   ├── og-image.jpg                 # 1200x630
│   └── favicon.ico + apple-touch-icon.png
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Fraunces + Nunito Sans, metadata base
│   │   ├── page.tsx                 # composição das seções, nada mais
│   │   ├── globals.css              # @theme com os tokens + base
│   │   ├── robots.ts · sitemap.ts · not-found.tsx
│   │   └── styleguide/page.tsx      # validação visual, sai antes do deploy
│   ├── components/
│   │   ├── sections/                # Hero, ProvaRapida, Experiencia, Galeria, OLoft,
│   │   │                            # Depoimentos (Avaliações), ComoFunciona (Como reservar),
│   │   │                            # Localizacao, Faq, CtaFinal
│   │   ├── ui/                      # Button, Section, Eyebrow, OrganicImage, BrandIcon,
│   │   │                            # WhatsappCta, Pendencia, Lightbox (novo)
│   │   ├── layout/                  # Header, Footer, StickyMobileCta
│   │   └── motion/                  # Reveal, HeroTimeline, DrawIcons (→ linha do dia), Deriva
│   ├── config/
│   │   ├── brand.ts                 # tokens, fontes, contato, anfitriões, links
│   │   ├── content.ts               # TODA a copy
│   │   └── brand-icons.ts           # sol-nascente, prancha, lua-agua, onda
│   ├── lib/                         # whatsapp, schema, pendencias, site-url, analytics, cn
│   └── hooks/usePrefersReducedMotion.ts
├── scripts/
│   ├── contraste.mjs
│   └── processar-fotos.mjs
├── DESIGN-GUIDELINES.md
├── landing-page-structure.md
└── TODOs.md
```

Removidos do scaffold: `sections/ParaQuem.tsx`, `sections/Metodo.tsx`, `sections/Sobre.tsx` e o
conteúdo correspondente em `content.ts` (ver DESIGN-GUIDELINES §0).

### Fronteira white-label

`brand.ts` e `content.ts` concentram **100% do que é específico da cliente**. Nenhum componente
contém texto, hex, telefone, link ou nome hardcoded. As seções novas (`Experiencia`, `Galeria`,
`OLoft`, `Localizacao`, `Lightbox`) seguem a mesma regra: recebem tudo de `content.ts`.

Em `brand.ts`, `profile` deixa de descrever uma profissional e passa a descrever o negócio:
nome, cidade/UF, anfitriões (lista), WhatsApp, URL do Airbnb, Instagram. O campo de registro
profissional sai.

---

## 4. Sistema de tokens

```css
@theme {
  --color-ancora: #373435;
  --color-ancora-quente: #4B4648;
  --color-decor: #30C8D4;
  --color-acento: #D69257;
  --color-acento-texto: #8F5420;
  --color-superficie-2: #E4CFB5;
  --color-papel: #FBF7F1;
  --color-creme: #F3E9DC;
  --color-tinta: #2A2728;
  --color-tinta-suave: #6B6466;

  --font-display: var(--font-display-family), Georgia, serif;
  --font-ui: var(--font-ui-family), system-ui, sans-serif;
  --font-editorial: var(--font-display-family), Georgia, serif; /* Fraunces itálico */
}
```

Regra dura: **nenhum hex fora deste bloco e de `brand.ts`.** Única exceção documentada: o azul
`#1494D3` dentro de `public/brand/monograma*.svg`, que é arquivo de marca, não código.

---

## 5. Estrutura da página, seção por seção

A ordem é o argumento: **me imagino lá → é real → cabe no que preciso → reservar é simples →
agir.**

Âncoras: `#experiencia · #galeria · #o-loft · #avaliacoes · #como-reservar · #localizacao ·
#duvidas`.

---

### 5.0 — `Header`

Fixo, fundo `papel` com blur após 40px de scroll.
- Esquerda: monograma 36px + "Loft Miragem" (Nunito Sans 600).
- Direita (desktop): `Experiência · Galeria · O loft · Dúvidas` + CTA WhatsApp compacto.
- Mobile: monograma + nome + CTA compacto. **Sem hambúrguer.**

---

### 5.1 — `Hero` ⭐

**Job:** em 3 segundos, "esse lugar é especial e é para nós dois" + a ação.

Layout desktop **55/45** (texto 55, foto 45); mobile: foto primeiro (é ela que vende), texto
embaixo, CTA visível sem rolar em 390×844.

- `eyebrow`: "Três Marias · MG — loft para casais"
- `h1`: **"A vista mais exclusiva de Três Marias"** (frase da cliente), em duas linhas. Único h1.
- Subtítulo: piscina-praia, SUP e o pôr do sol na represa, em uma frase.
- Foto `por-do-sol.jpg` com máscara `a` (borda inferior em onda), `priority`,
  `fetchPriority="high"`, `objectPosition` no sol.
- CTA primário WhatsApp. Abaixo, link de texto "ou veja as datas no Airbnb →".
- Linha de prova: "★ 5,0 · Preferido dos hóspedes no Airbnb".

**Movimento:** h1 entra por linha (stagger 80ms) → subtítulo → CTA. A foto **não** anima de
entrada (é o LCP); só o parallax CSS leve ao rolar. Nada começa com `opacity: 0` no HTML.

---

### 5.2 — `ProvaRapida`

Faixa fina, fundo `creme`, sem ícones. Dados **confirmados no anúncio do Airbnb em 2026-10-05**:

- **5,0** · nota média no Airbnb
- **Preferido dos hóspedes**
- **5** avaliações
- **Beira d'água** na represa de Três Marias

Cada item é texto; o conjunto linka para o anúncio (`?src=prova`). Atualizar os números quando o
anúncio mudar (`<<A CONFIRMAR: conferir nota e nº de avaliações antes do deploy>>` no checklist
de deploy, não na página).

---

### 5.3 — `Experiencia` ⭐⭐ **SEÇÃO-ASSINATURA**

**Job:** fazer o casal viver um dia no loft antes de reservar. Substitui `Metodo`.

É uma **sequência** (manhã → tarde → noite), então é uma **linha do tempo**, não pilares
paralelos:

| Momento | Ícone | Foto | Texto (essência) |
|---|---|---|---|
| Manhã | `sol-nascente` | `cafe-da-manha.jpg` (máscara `b`) | café flutuando na piscina-praia, a cabana ao fundo |
| Tarde | `prancha` | — (só ícone + texto) | o SUP na represa, a água calma, a margem de areia |
| Noite | `lua-agua` | `piscina-noite.jpg` (máscara `b` espelhada) | a piscina acesa em azul, o loft iluminado pela vidraça |

A **tarde sem foto** é proposital (regra do template: foto em alguns momentos, nunca em todos) — e
a foto do SUP aparece na galeria. Se a autorização de imagem de `mari-com-prancha.jpg` vier, ela
**continua** na galeria; a tarde fica só com o ícone grande.

Layout: desktop — linha horizontal com as três paradas, texto alternando acima/abaixo da linha;
mobile — linha vertical à esquerda, paradas empilhadas. Fundo `papel`.

**A animação** (o único momento coreografado): a onda se desenha ao longo da linha; ao chegar em
cada parada, o ícone (120–160px, stroke `ancora`) se desenha (`createDrawable`,
`draw: ['0 0', '0 1']`, ~1000ms, `inOut(3)`) e o texto faz reveal. Uma vez. Reduced-motion: tudo
desenhado e visível.

---

### 5.4 — `Galeria`

**Job:** mostrar o lugar inteiro, como num anúncio — mas melhor.

- Grid **assimétrico**: a 1ª foto ocupa 2 colunas × 2 linhas (máscara `d`), as demais
  retangulares retas. Mobile: 2 colunas, a 1ª em largura total.
- Hoje: 5 fotos, nesta ordem: `por-do-sol` (destaque), `duas-pranchas-logo`, `cafe-da-manha`,
  `mari-com-prancha`, `piscina-noite`. O componente aceita de 4 a 12 itens sem mudar código — os
  itens são uma lista em `content.ts`; foto nova = item novo na lista + linha no pipeline.
- Se a autorização de `mari-com-prancha` não vier, ela sai da lista e `duas-pranchas-logo` cobre
  o SUP sozinha.
- Clique/Enter abre o **lightbox** (`ui/Lightbox.tsx`, `<dialog>` nativo): foto inteira, legenda,
  contador "2 / 4", setas ←/→, `Esc`, foco preso e devolvido.
- Miniaturas: `loading="lazy"`, `sizes` por coluna; lightbox carrega a versão grande só ao abrir.
- Cada foto tem `alt` real e uma legenda curta em `content.ts`.
- Link ao fim: "mais fotos no Instagram @loft_miragem".

**Vídeo (futuro — só o modelo de dados agora).** O item da galeria é uma união:
`{ tipo: 'foto', src, alt, legenda }` | `{ tipo: 'video', src, poster, alt, legenda }`.
Hoje só existem fotos e o componente só precisa renderizar `foto`. Quando chegar vídeo: na grade,
o `poster` estático com ícone de play; o `<video>` (`preload="none"`, `muted`, `playsinline`,
MP4 H.264 + WebM, ≤ 6s, ≤ 1MB) só é criado dentro do lightbox. Sem autoplay na grade; com
reduced-motion, o lightbox mostra o poster e o vídeo só toca por ação do usuário.

---

### 5.5 — `OLoft`

**Job:** responder "cabe no que a gente precisa?" de forma objetiva.

Layout 5/7: à esquerda, título + frase "Pensado para casais — e acomoda até 4 pessoas"; à direita,
lista de comodidades em **duas colunas de texto** (não grade de ícones). Fundo `creme`.

Confirmado no Airbnb (2026-10-05):
- 4 hóspedes · 1 quarto · 2 camas · 1 banheiro
- Piscina-praia (piscina de areia)
- Pranchas de stand-up paddle
- Na beira da represa
- Cozinha
- Wi-Fi e espaço de trabalho
- Estacionamento gratuito no local
- Self check-in com cofre de chaves

A confirmar com os anfitriões (aparecem como marcador até lá):
- `<<A CONFIRMAR: café da manhã incluso ou cobrado à parte?>>`
- `<<A CONFIRMAR: ar-condicionado / ventilação>>`
- `<<A CONFIRMAR: roupa de cama e toalhas inclusas>>`

CTA de dúvida (WhatsApp, origem `o-loft`).

---

### 5.6 — `Depoimentos` → **Avaliações**

Fundo `superficie-2`, texto `ancora`/`tinta`. Título + "★ 5,0 · 5 avaliações no Airbnb".

- **5 cards** com o texto **transcrito literalmente** dos prints enviados pelo usuário: primeiro
  nome do hóspede (como aparece no Airbnb), mês/ano, texto, "via Airbnb". Fraunces itálico.
- Sem aspas gigantes, sem avatar, sem estrelas desenhadas por card, **sem carrossel**: no desktop,
  colunas de alturas desiguais (masonry simples via CSS columns); no mobile, empilhado (as 5 são
  curtas).
- Link "ler todas no Airbnb" (`?src=avaliacoes`).
- **Até os prints chegarem, a seção fica `exibir: false`.** A nota continua na ProvaRapida. Nenhum
  texto de avaliação é escrito, resumido ou "melhorado".

---

### 5.7 — `ComoFunciona` → **Como reservar**

**Job:** eliminar a dúvida "e agora, como faço?". Sequência real → numeração 01/02/03 justificada.

1. **Chame no WhatsApp** com as datas e quantas pessoas — Calypso e André respondem.
2. **Confirme a reserva** — `<<A CONFIRMAR: forma de pagamento/sinal na reserva direta>>`.
3. **Chegue e entre sozinho** — self check-in com cofre de chaves (confirmado no Airbnb);
   `<<A CONFIRMAR: horários de check-in e check-out>>`.

Abaixo: "Prefere reservar pelo Airbnb? Também dá →" (link, origem `como-reservar`).

---

### 5.8 — `Localizacao`

**Job:** "onde fica e como chego?".

- Texto: Três Marias-MG, à beira da represa. `<<A CONFIRMAR: bairro/condomínio e referência de
  acesso>>` e `<<A CONFIRMAR: distância/tempo a partir de BH>>`.
- **Sem iframe do Google Maps** (pesado, rastreador, CLS). Em vez disso, um botão-link "Abrir no
  Google Maps" com a busca/pino que a cliente fornecer — `<<A CONFIRMAR: link do Google Maps>>` —
  e, ao lado, uma foto (máscara `c`) ou o grafismo de onda.
- O Airbnb só mostra a localização exata após a reserva; respeitar a mesma política se os
  anfitriões preferirem (perguntar).

---

### 5.9 — `Faq`

`<details>`/`<summary>`. Perguntas (respostas com marcador onde depender dos anfitriões):

1. Quanto custa a diária? — `<<A CONFIRMAR: faixa de preço ou "consulte as datas">>`
2. Quantas pessoas o loft acomoda? — "Até 4. Foi pensado para casais, mas tem duas camas." (confirmado)
3. O café da manhã está incluso? — `<<A CONFIRMAR>>`
4. Posso levar meu pet? — `<<A CONFIRMAR>>`
5. Como funciona o check-in? — self check-in com cofre (confirmado) + horários `<<A CONFIRMAR>>`
6. Preciso saber remar para usar o SUP? — `<<A CONFIRMAR: orientação/colete disponíveis?>>`
7. Reservar pelo WhatsApp ou pelo Airbnb: qual a diferença? — `<<A CONFIRMAR: há vantagem na reserva direta?>>`

JSON-LD `FAQPage` só com as perguntas cujas respostas estiverem 100% confirmadas.

---

### 5.10 — `CtaFinal`

Faixa full-bleed `ancora`. Título em display `papel` ("O pôr do sol de hoje ainda está livre?" —
ou similar, Fase 4). Apoio em `superficie-2`. CTA invertido: fundo `papel`, texto `ancora` — o único
botão claro da página. Ondas de cinco cristas em `decor` a 8–12%, derivando, `aria-hidden`.

---

### 5.11 — `Footer`

Fundo `ancora`, texto `superficie-2`. Logo completa versão clara · "Calypso Martins e André
Tertuliano, anfitriões" · Instagram · Airbnb · "Três Marias — MG" · copyright · crédito discreto do
desenvolvedor (`<<A CONFIRMAR: combinar com a cliente>>`).

---

### 5.12 — `StickyMobileCta`

Só `< 768px`, aparece quando o herói sai da viewport, `safe-area-inset-bottom`. WhatsApp.

---

## 6. CTAs — especificação

```ts
export function buildWhatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

- `phone` = `5531972044476` em `brand.ts`.
- Airbnb: `https://www.airbnb.com.br/rooms/1440093946948725210` em `brand.ts` (sem os parâmetros de
  compartilhamento do link original).
- Todos: `target="_blank" rel="noopener noreferrer"`, `aria-label` explícito.

**Rastreio de origem sem backend** — mensagens em `content.ts`, na voz de quem visita:

| Local | Mensagem pré-preenchida |
|---|---|
| Header | "Oi! Vi o site do Loft Miragem e queria saber das datas disponíveis." |
| Hero | "Oi! Vi aquela vista do pôr do sol e queremos ir. Quais datas estão livres?" |
| O loft | "Oi! Tenho uma dúvida sobre o loft antes de reservar:" |
| Como reservar | "Oi! Quero reservar o Loft Miragem. Nossas datas e quantas pessoas:" |
| CTA final | "Oi! Decidimos: queremos passar uns dias no Loft Miragem. Tem data?" |
| Sticky mobile | "Oi! Vim pelo site e queria ver a disponibilidade do loft." |

Links do Airbnb levam `?src=hero|prova|como-reservar|avaliacoes|footer` — o Airbnb ignora o
parâmetro, mas ele aparece no analytics quando houver.

---

## 7. SEO

### Metadata

- `title`: "Loft Miragem — loft para casais em Três Marias, MG" (≤ 60)
- `description`: "Piscina-praia, SUP e o pôr do sol na represa de Três Marias. Um loft pensado
  para casais, nota 5,0 no Airbnb. Reserve direto pelo WhatsApp." (ajustar a 150–160)
- `openGraph` com `og-image.jpg` (pôr do sol + logo), `locale: pt_BR`; `twitter:
  summary_large_image`.
- Sem domínio final: `metadataBase` = `<<A CONFIRMAR: domínio>>` → a página pede **`noindex`**
  até o domínio existir (comportamento do scaffold).

### Dados estruturados (`@graph`)

1. **`LodgingBusiness`** — `name`, `description`, `image`, `address` (só `addressLocality: "Três
   Marias"`, `addressRegion: "MG"`, `addressCountry: "BR"`), `telephone`, `amenityFeature`
   (`LocationFeatureSpecification` para cada comodidade confirmada), `numberOfRooms: 1`,
   `petsAllowed` só se confirmado, `sameAs` (Instagram, Airbnb), `checkinTime`/`checkoutTime` só se
   confirmados, `priceRange` só se confirmado.
2. **`FAQPage`** — só perguntas com resposta confirmada.

**Sem `aggregateRating` no JSON-LD.** A nota 5,0 aparece na página, mas as diretrizes de
review snippet do Google proíbem marcar avaliações agregadas de outro site (Airbnb) como se fossem
do próprio negócio — e avaliações "self-serving" de `LocalBusiness` não geram estrelas de qualquer
forma. Marcar daria risco de ação manual sem benefício.

**Sem nó `Person`.** Os anfitriões aparecem no texto; não há credencial profissional a declarar.

Regra assimétrica: `<<A CONFIRMAR>>` aparece na página e some do JSON-LD (`lib/pendencias`).

### Técnico

- Um único `h1`; `h2` por seção.
- `lang="pt-BR"`, `sitemap.ts`, `robots.ts`.
- "Três Marias" em: `title`, `description`, hero, Localização, footer, JSON-LD.

### Realismo

A página ranqueia para a **marca** ("Loft Miragem") e ajuda em busca local. Ranquear para
"hospedagem Três Marias" depende de Google Business Profile — fase 2, fora deste escopo; vale
sugerir à cliente.

---

## 8. Performance

| Métrica | Alvo |
|---|---|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| JS da aplicação (gzip) | < 100KB (medir separado do runtime do framework) |
| JS de animação (gzip) | < 15KB |
| Peso total na primeira carga | < 1.2MB |
| Lighthouse Performance | ≥ 95 |

- Só `hero-por-do-sol` com `priority`; galeria `lazy`; versão grande do lightbox só ao abrir.
- `mari-com-prancha.jpg` (3072×4096, 1,5MB) reduzida no pipeline: nenhum derivado acima de ~200KB.
- anime.js por `dynamic import` após hidratação.
- Fontes via `next/font`, `latin` + `latin-ext`, `display: swap`; Fraunces só com os eixos usados
  (`opsz`, `SOFT`, itálico).

---

## 9. Acessibilidade

- Contraste conforme DESIGN-GUIDELINES §3.
- `focus-visible` em 100% dos interativos; "pular para o conteúdo" como primeiro foco.
- Lightbox: `<dialog>` com `aria-label`, foco preso, `Esc`, setas, foco devolvido.
- Landmarks: `<header>`, `<main>`, `<section aria-labelledby>`, `<footer>`.
- Decorativo com `aria-hidden="true"`; `alt` real em toda foto.
- `prefers-reduced-motion: reduce` desliga toda animação, parallax e loop.
- Alvo de toque ≥ 44×44px.

---

## 10. Informações que faltam

Confirmado até aqui: nome, cidade, WhatsApp, Instagram, link do Airbnb, anfitriões, capacidade,
comodidades do anúncio, nota 5,0 / 5 avaliações / Preferido dos hóspedes.

Falta:
- [ ] Prints das 5 avaliações do Airbnb (para transcrição literal)
- [ ] Preço ou faixa de preço — exibe ou não?
- [ ] Horários de check-in e check-out
- [ ] Café da manhã: incluso ou à parte?
- [ ] Pet: aceita ou não?
- [ ] Regras da casa relevantes (festa, visitas, fumar)
- [ ] Forma de pagamento/sinal na reserva direta; há vantagem em reservar direto?
- [ ] SUP: orientação/colete para iniciantes?
- [ ] Localização: bairro/referência, link do Google Maps, distância de BH — e se pode ser pública
- [ ] Autorização de uso de imagem da pessoa em `mari-com-prancha.jpg`
- [ ] Mais fotos para a galeria (interior, mezanino, banheiro, cozinha, vista de dia)
- [ ] Original em resolução cheia de `duas-pranchas-logo.jpg` (a recebida tem 640px)
- [ ] Vídeos curtos (opcional): loops de 4–6s, sem pessoa identificável ou com autorização
- [ ] Domínio
- [ ] Crédito do desenvolvedor no footer
