# DESIGN-GUIDELINES.md
### Landing page — Loft Miragem (hospedagem para casais · Três Marias-MG)

> Este documento é a **fonte de verdade visual** do projeto. Nenhuma cor, fonte, espaçamento ou
> animação deve ser inventada fora daqui. Se algo não estiver definido, pergunte antes de decidir.
> Arquivos originais da marca em `reference-files/`.
>
> **Não existe manual de identidade.** Tudo o que está aqui foi derivado da logo
> (`reference-files/POUSADA LOGO.png`, amostrada em pixel) e das fotos do próprio loft. Quando a
> cliente vir a página, é este documento que explica de onde saiu cada decisão.

---

## 0. Por que este projeto não segue a arquitetura padrão da skill

A skill `landing-profissional` foi desenhada para **profissional autônomo** (nutricionista,
psicóloga, advogado...). O argumento da página padrão é "quem ela é → por que confiar → você é
atendida aqui → como ela trabalha → quem é ela de verdade".

O Loft Miragem é uma **hospedagem**. Ninguém reserva um fim de semana por causa do método de quem
hospeda; reserva porque **se imagina lá**. O argumento passa a ser:

> me imagino lá (Hero, Experiência, Galeria) → é real e outros amaram (Prova rápida, Avaliações)
> → cabe no que eu preciso (O loft, Localização) → reservar é simples (Como reservar, FAQ) → agir

Consequências:

| Do template | Neste projeto | Por quê |
|---|---|---|
| `ParaQuem` | **removida** | O público é um só (casais) e já está dito no herói |
| `Metodo` (seção-assinatura) | **`Experiencia`** | O "conceito central" aqui é o dia no loft: manhã, tarde, noite — uma **sequência**, então vira linha do tempo, não pilares paralelos |
| `Sobre` | **removida** | Os anfitriões aparecem no footer e no "Como reservar"; uma seção biográfica não ajuda a reservar |
| — | **`Galeria`** (nova) | Hospedagem vende por foto. É a seção mais consultada em qualquer anúncio |
| — | **`OLoft`** (nova) | Capacidade e comodidades: a pergunta objetiva que vem depois do desejo |
| — | **`Localizacao`** (nova) | "Onde fica e como chego" é a objeção nº 1 de destino fora da capital |
| `ComoFunciona` | **"Como reservar"** | Mesmo componente; agora são os passos da reserva |
| `Depoimentos` | **"Avaliações"** | Avaliações reais do Airbnb, transcritas literalmente |
| JSON-LD `ProfessionalService` + `Person` | **`LodgingBusiness` + `FAQPage`** | Não há profissional nem registro em conselho |

Não existe conselho profissional, registro, nem restrição ética de publicidade. **Existe**, em
compensação, a regra de não prometer o que a cliente não confirmou: preço, regras da casa,
horários, café incluso, pet.

---

## 1. Posicionamento e o que o design precisa comunicar

**Bio da cliente (Instagram @loft_miragem):** "Piscina-praia, SUP e a vista mais exclusiva de Três
Marias. Um loft pensado pra casais viverem dias únicos. Reservas abertas!"

**Conceito central:** **o pôr do sol sobre a água.** É literalmente a logo — um sol que desce sobre
cinco ondas, dentro de um círculo — e é a foto mais forte do acervo (`por-do-sol.jpg`: o sol
caindo na represa visto do mezanino, com a piscina-praia embaixo). Tudo na página gira em torno
de "o dia que termina na água".

A logo traduz isso em três camadas, que viram o sistema de cor:
- o **contorno grafite** (`#373435`) que segura tudo — a cabana preta da foto é a mesma cor;
- o **céu âmbar**, um degradê de `#D69257` a `#E4CFB5` — o pôr do sol;
- as **ondas turquesa e azul** (`#30C8D4`, `#1494D3`) — a piscina e a represa.

### Os dois polos que o layout precisa equilibrar

| Polo | Como aparece no design |
|---|---|
| **Exclusividade** (o loft é sério, bem cuidado, vale o preço) | Grafite como cor dominante de títulos e CTA; respiro generoso; fotos grandes e bem enquadradas; arquitetura da cabana preta ecoando no grid reto; nota 5,0 visível cedo |
| **Leveza de férias** (é um refúgio a dois, não um hotel) | Bordas em onda nas fotos; areia clara no fundo; âmbar do pôr do sol nos detalhes; Fraunces com eixo "soft"; voz próxima, "você" e "vocês dois" |

Exclusividade sem leveza vira hotel corporativo. Leveza sem exclusividade vira anúncio de
temporada genérico de Facebook, que é exatamente o que derruba o preço percebido.

---

## 2. ⚠️ O risco nº 1 deste projeto: parecer feito por IA

Landing de hospedagem tem um visual-padrão ainda mais forte que o de serviço: **foto full-bleed com
overlay escuro + título branco centralizado + botão laranja "Reserve agora" + grid de 6 ícones de
comodidade (wi-fi, piscina, estacionamento...) + carrossel de depoimentos com estrelas.** Uma
paleta de pôr do sol (laranja + turquesa) agrava o risco: é o degradê "tropical" que geradores
produzem por padrão.

### Regras de diferenciação — obrigatórias

1. **Inverter a dominância cromática.** A cor âncora é o **grafite `#373435`** do contorno da logo
   — CTAs, títulos, faixa de fechamento, footer. O âmbar é acento (sublinhado, marcador), **nunca
   botão**. O turquesa é decorativo, **nunca texto**. Nada de degradê laranja→turquesa em lugar
   nenhum, nem em fundo, nem em botão.
2. **Formas derivadas da logo: a onda.** As fotos são mascaradas com borda **ondulada** — a mesma
   onda de cinco cristas da logo — em vez de blob genérico. Nunca `border-radius`, nunca círculo
   perfeito (o círculo é da logo, não das fotos).
3. **Fotografia real, nunca banco de imagem.** `por-do-sol.jpg` é o maior diferencial do acervo: é
   o conceito da marca fotografado. Ela abre a página.
4. **Uma única animação coreografada:** a linha do dia na seção Experiência (ver §8). O resto é
   discreto.
5. **Sem os clichês do nicho:** nada de overlay escuro sobre foto com título branco centralizado;
   nada de grade de ícones de comodidade com rótulo embaixo; nada de carrossel de depoimentos;
   nada de cinco estrelas amarelas desenhadas; nada de emoji em heading; nada de "Reserve agora!"
   em caixa alta.

---

## 3. Cores

Os tokens têm nome de **papel**, não de cor.

### Tokens da marca (amostrados da logo)

| Token | Hex | Origem | Papel |
|---|---|---|---|
| `ancora` | `#373435` | contorno da logo / cabana | **Cor âncora.** Títulos, CTA primário, faixa de fechamento, footer |
| `ancora-quente` | `#4B4648` | grafite aberto | Hover do CTA primário |
| `decor` | `#30C8D4` | onda turquesa | **Decorativo apenas.** Ondas, ícones grandes sobre fundo escuro, bordas |
| `acento` | `#D69257` | céu âmbar | Sublinhados, marcadores, hover de link, texto sobre `ancora` |
| `acento-texto` | `#8F5420` | âmbar escurecido (derivado) | Única variação do acento aprovada para texto sobre fundo claro e para o anel de foco |
| `superficie-2` | `#E4CFB5` | interior do sol | Faixa de avaliações; texto de apoio sobre `ancora` |

### Neutros (derivados — areia da piscina-praia)

| Token | Hex | Papel |
|---|---|---|
| `papel` | `#FBF7F1` | Fundo principal da página |
| `creme` | `#F3E9DC` | Fundo de seção alternada |
| `tinta` | `#2A2728` | Texto corrido longo |
| `tinta-suave` | `#6B6466` | Legendas, textos de apoio |

O azul `#1494D3` da logo **não vira token**: aparece só dentro do monograma SVG (ver §5). Um 11º
token para uma cor que não carrega papel na página seria ruído.

### Tabela de contraste (WCAG 2.1 — calculada com `scripts/contraste.mjs --md`)

| Combinação | Ratio | Veredito |
|---|---|---|
| `ancora` sobre `papel` | **11.54:1** | ✅ AAA |
| `ancora-quente` sobre `papel` | **8.67:1** | ✅ AAA |
| `decor` sobre `papel` | **1.90:1** | ❌ reprovado |
| `acento` sobre `papel` | **2.43:1** | ❌ reprovado |
| `acento-texto` sobre `papel` | **5.69:1** | ✅ AA |
| `superficie-2` sobre `papel` | **1.42:1** | ❌ reprovado |
| `creme` sobre `papel` | **1.12:1** | ❌ reprovado |
| `tinta` sobre `papel` | **13.86:1** | ✅ AAA |
| `tinta-suave` sobre `papel` | **5.41:1** | ✅ AA |
| `ancora` sobre `creme` | **10.26:1** | ✅ AAA |
| `ancora-quente` sobre `creme` | **7.71:1** | ✅ AAA |
| `decor` sobre `creme` | **1.69:1** | ❌ reprovado |
| `acento` sobre `creme` | **2.16:1** | ❌ reprovado |
| `acento-texto` sobre `creme` | **5.06:1** | ✅ AA |
| `superficie-2` sobre `creme` | **1.26:1** | ❌ reprovado |
| `papel` sobre `creme` | **1.12:1** | ❌ reprovado |
| `tinta` sobre `creme` | **12.33:1** | ✅ AAA |
| `tinta-suave` sobre `creme` | **4.81:1** | ✅ AA |
| `ancora` sobre `superficie-2` | **8.15:1** | ✅ AAA |
| `ancora-quente` sobre `superficie-2` | **6.12:1** | ✅ AA |
| `decor` sobre `superficie-2` | **1.34:1** | ❌ reprovado |
| `acento` sobre `superficie-2` | **1.71:1** | ❌ reprovado |
| `acento-texto` sobre `superficie-2` | **4.02:1** | ⚠️ só texto grande |
| `papel` sobre `superficie-2` | **1.42:1** | ❌ reprovado |
| `creme` sobre `superficie-2` | **1.26:1** | ❌ reprovado |
| `tinta` sobre `superficie-2` | **9.79:1** | ✅ AAA |
| `tinta-suave` sobre `superficie-2` | **3.82:1** | ⚠️ só texto grande |
| `ancora-quente` sobre `ancora` | **1.33:1** | ❌ reprovado |
| `decor` sobre `ancora` | **6.06:1** | ✅ AA |
| `acento` sobre `ancora` | **4.76:1** | ✅ AA |
| `acento-texto` sobre `ancora` | **2.03:1** | ❌ reprovado |
| `superficie-2` sobre `ancora` | **8.15:1** | ✅ AAA |
| `papel` sobre `ancora` | **11.54:1** | ✅ AAA |
| `creme` sobre `ancora` | **10.26:1** | ✅ AAA |
| `tinta` sobre `ancora` | **1.20:1** | ❌ reprovado |
| `tinta-suave` sobre `ancora` | **2.13:1** | ❌ reprovado |

Exigências do sistema: todas ✅ (`ancora`/`papel` 11.54, CTA `papel`/`ancora` 11.54,
`superficie-2`/`ancora` 8.15, `acento-texto`/`papel` 5.69, `tinta`/`papel` 13.86, `decor`/`papel`
reprovado como deve ser).

**Decisões que saem daí:**
- **CTA primário = fundo `ancora` + texto `papel`.** O botão âmbar "óbvio" daria 2.43:1 —
  reprovado.
- Na faixa escura (`ancora`), o âmbar **pode** ser texto (4.76:1) e o turquesa pode ser ícone
  (6.06:1). Em fundo claro, nenhum dos dois.
- Na faixa de avaliações (`superficie-2`), texto é `ancora` ou `tinta`; `tinta-suave` só em texto
  grande. A atribuição ("via Airbnb · mês") usa `ancora-quente` (6.12:1).
- Ícones grandes da marca sobre fundo claro usam `ancora` (componente gráfico ≥ 3:1); o turquesa
  entra só como preenchimento das ondas a baixa opacidade, nunca como única informação.

---

## 4. Tipografia

### As famílias

Não há manual, então não há família obrigatória. A wordmark da logo é um sans geométrico
arredondado, e repeti-la nos títulos competiria com a própria logo. A escolha:

1. **Fraunces** — display. Serifada "old-style" variável com eixo `SOFT` (arredonda as serifas) e
   `opsz`. Com `SOFT 50–100` ela fica calorosa e de férias sem perder a autoridade de serifada —
   exatamente os dois polos da §1.
2. **Nunito Sans** — UI e texto corrido. Terminais arredondados que conversam com a wordmark da
   logo, ótima legibilidade em tamanho pequeno.
3. **Editorial** = **Fraunces itálico** (mesma família, sem custo de uma terceira). Só nas
   avaliações e em frases de destaque.

### ⚠️ Licenciamento

| Família | Situação | Decisão |
|---|---|---|
| Fraunces | Google Fonts, SIL Open Font License 1.1 | **Usar** via `next/font/google` |
| Nunito Sans | Google Fonts, SIL Open Font License 1.1 | **Usar** via `next/font/google` |

Nenhum arquivo de fonte veio da cliente; não há o que auditar além disso. A fonte da wordmark da
logo **não** é usada como texto: a logo entra como imagem/SVG.

### Papéis

| Papel | Família | Uso |
|---|---|---|
| **Display** | Fraunces (`SOFT 80`, peso 500–600) | Somente `h1` e `h2` |
| **UI** | Nunito Sans | Botões, nav, labels, eyebrows, texto corrido, FAQ, footer |
| **Editorial** | Fraunces itálico (`SOFT 100`, peso 400) | Somente avaliações e pull quotes |

### Escala (fluida, `clamp()`)

```
display-xl   clamp(2.75rem, 7vw, 5rem)      line-height 1.05  tracking -0.02em
display-lg   clamp(2rem, 5vw, 3.25rem)      line-height 1.12  tracking -0.01em
display-md   clamp(1.5rem, 3.5vw, 2.25rem)  line-height 1.2
body-lg      clamp(1.05rem, 1.6vw, 1.25rem) line-height 1.7
body         1rem                            line-height 1.7
caption      0.875rem                        line-height 1.5
eyebrow      0.75rem  tracking 0.18em  uppercase
```

**Regras:**
- Medida de leitura: **60–72 caracteres** (`medida`).
- Título display nunca em `uppercase`.
- `eyebrow` é o único elemento em caixa alta da página.

---

## 5. Ícones da marca

A logo não tem ícones proprietários além do próprio emblema (sol + ondas no círculo). Os ícones da
página são **derivados do emblema**, desenhados por nós com o mesmo traço (stroke arredondado,
peso equivalente ao contorno da logo):

| Ícone | Gesto | Onde |
|---|---|---|
| `sol-nascente` | meio-círculo sobre uma linha d'água | Experiência — manhã |
| `prancha` | prancha de SUP na vertical + uma onda | Experiência — tarde |
| `lua-agua` | lua crescente sobre duas ondas | Experiência — noite |
| `onda` | a onda de cinco cristas da logo | grafismo de transição entre seções |

- **SVG com `stroke`, não `fill`** — obrigatório para a animação de desenho.
- Cor: `ancora` sobre fundos claros; `decor` ou `superficie-2` sobre `ancora`.
- Tamanho mínimo 48px; na Experiência, 120–160px.
- São o elemento-assinatura. Não viram bullet de lista em outro lugar.
- Ícones de interface (setas, chevron do FAQ, WhatsApp, lightbox) usam Lucide, 1.5px, nunca no
  mesmo bloco visual que os da marca.

**Monograma:** o emblema circular da logo (sol + ondas), redesenhado em SVG:
- versão cor: céu `acento`→`superficie-2`, ondas `decor` e `#1494D3`, contorno `ancora`;
- versão clara (para o footer): contorno `papel`, preenchimentos a 85%.

Header: monograma 36px + "Loft Miragem" em Nunito Sans 600 (o lockup horizontal que a logo empilhada
não oferece). Footer: logo completa em versão clara (texto recolorido para `papel` no pipeline da
Fase 3). Nunca esticado, nunca rotacionado, nunca sobre foto.

---

## 6. Formas orgânicas — a assinatura estrutural

A linguagem de forma é **a onda da logo**: cinco cristas regulares, amplitude baixa. Nas fotos ela
vira uma borda ondulada em **um ou dois lados** da imagem — nunca nos quatro (isso viraria moldura
de selo).

- 4 máscaras `clipPath` (`objectBoundingBox`), definidas uma vez em `OrganicClipPaths.tsx`:
  - `a` — borda inferior em onda (herói: a foto "termina na água");
  - `b` — borda superior em onda, cristas mais longas (Experiência);
  - `c` — lateral esquerda em onda vertical (O loft / Localização);
  - `d` — duas bordas opostas em onda, amplitude mínima (destaque da galeria).
- Os lados retos ficam **retos** — o contraste entre o reto (a cabana, a arquitetura) e a onda (a
  água) é o desenho. Sem cantos arredondados.
- Grafismo de fundo: a onda de cinco cristas em `decor` a 8–12% de opacidade, `aria-hidden`.
- **Nunca** máscara + `border-radius` na mesma imagem.
- Na **galeria**, as miniaturas são retangulares retas (a grade precisa ler como grade); só a foto
  em destaque recebe a máscara `d`. O lightbox mostra a foto inteira, sem máscara.

---

## 7. Espaçamento e layout

- Escala base **4px**. Espaçamentos permitidos: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Padding vertical de seção: `clamp(4rem, 10vw, 8rem)` (`secao-y`).
- Container: `max-w-6xl` com padding lateral `clamp(1.25rem, 5vw, 3rem)` (`container-lp`).
- **Layout assimétrico é a regra.** Hero 55/45; seções alternando 7/5 e 5/7.
- Mobile-first de verdade: **o tráfego vem do link na bio do Instagram** (7,8 mil seguidores) e de
  links compartilhados no WhatsApp. Toda decisão de layout se valida primeiro em 390px.
- Fotos verticais (todo o acervo é 3:4 ou 4:5, feito no celular): o layout precisa ser bom com
  foto vertical, não forçar paisagem.

---

## 8. Movimento

### Princípios

1. **Um único momento coreografado: a linha do dia na Experiência.** Ao entrar na viewport, uma
   onda horizontal se desenha atravessando a seção (no mobile, vertical, descendo), e em cada
   parada o ícone do momento se desenha em sequência: `sol-nascente` → `prancha` → `lua-agua`.
   Uma vez só.
2. **Todo o resto é discreto**: fade + translate de 12–16px, 400–600ms, `ease-out`.
3. **A animação nunca bloqueia o LCP.** O título e a foto do herói pintam primeiro.
4. **`prefers-reduced-motion: reduce`**: tudo estático, ícones já desenhados, zero parallax, zero
   loop.
5. Nada anima duas vezes.

### Divisão de ferramentas

| O quê | Com o quê |
|---|---|
| Linha do dia + ícones (assinatura) | **anime.js v4** — `createDrawable` + `createTimeline` |
| Entrada do herói | **anime.js v4** — `createTimeline` (curta: h1 por linha, CTA) |
| Deriva das ondas no CTA final | **anime.js v4** — loop 20–30s, `alternate`, amplitude ≤ 16px |
| Reveal de seção | **CSS + IntersectionObserver** |
| Hover, foco, lightbox | **CSS puro** + `<dialog>` nativo |
| Parallax leve da foto do herói | **CSS** `animation-timeline: view()` atrás de `@supports` |

anime.js por subpath e `dynamic import` após a hidratação, em `createScope()` com
`scope.revert()`. **Orçamento: 15KB gzip.**

---

## 9. Fotografia — direção e uso definido

### Inventário atual e destino de cada foto

| Arquivo | Descrição | Destino | Observação |
|---|---|---|---|
| `por-do-sol.jpg` (1440×1920) | Pôr do sol sobre a represa visto do mezanino, através da rede de corda; piscina-praia embaixo | **Hero** (`priority`) + galeria | A foto mais valiosa: é o conceito da marca fotografado |
| `cafe-da-manha.jpg` (1440×1920) | Bandeja de café flutuando na piscina, cabana preta e céu azul ao fundo | Experiência — manhã + galeria | Mostra a arquitetura e a piscina-praia de dia |
| `mari-com-prancha.jpg` (3072×4096) | Mulher com a prancha de SUP com a logo, na margem da represa | Experiência — tarde + galeria | **Pessoa identificável** → `<<A CONFIRMAR: autorização de uso de imagem>>` |
| `duas-pranchas-logo.jpg` (640×853) | Duas pranchas de SUP com a logo na represa ao pôr do sol, vista de quem está sentado nelas (só pernas e braços) | Galeria | Sem pessoa identificável → **substituto de `mari-com-prancha` na galeria** se a autorização não vier. Resolução baixa: lightbox limitado a 640px, sem upscale. `<<A CONFIRMAR: original em resolução cheia>>` |
| `piscina-noite.jpg` (1440×1800) | Piscina iluminada em azul à noite, interior do loft pela vidraça | Experiência — noite + galeria | Muito escura; recorte e exposição tratados no pipeline |
| `POUSADA LOGO.png` | Logo empilhada com fundo transparente | Footer (versão clara), og-image | Fonte do monograma SVG |

**O acervo é pequeno.** Com 5 fotos, a galeria ainda repete as fotos da Experiência. A página funciona
assim, mas fica mais forte com 8–12 fotos (interior do loft, mezanino, banheiro, cozinha, vista de
dia, SUP na água). `<<A CONFIRMAR: mais fotos para a galeria>>` — os destaques "Tour" e
"Atrativos" do Instagram provavelmente já têm o material.

**Vídeo (futuro, não implementar agora).** Nada de vídeo no fundo do herói: disputa o LCP com
`por-do-sol`, estoura o peso da primeira carga e é o clichê da §3. Quando houver vídeos, eles
entram como item da galeria (poster estático na grade, vídeo só no lightbox) — ver
landing-page-structure §5.4. Opção registrada, não decidida: um loop curto e mudo no momento
**tarde** da Experiência.

### Regras

- Pessoas aparecem **dentro** da máscara, nunca recortadas boiando na tela.
- **Consistência cromática:** as fotos são de horários muito diferentes (dia, pôr do sol, noite).
  Não tentar igualá-las — o contraste entre os três momentos **é** a Experiência. O tratamento
  unificado é só leve: aquecer 2–3% e reduzir a saturação do turquesa da piscina em ~8%, para não
  brigar com o `decor`.
- `alt` descritivo real em toda foto.
- AVIF + WebP via `next/image`, `sizes` correto, `priority` só no herói.

### O que não fazer

- Banco de imagem de "casal na praia" — sempre foto real do loft.
- Fotos de hóspedes do Instagram sem autorização expressa de cada pessoa.
- Imagem que sugira o que o loft não oferece (mar, praia de verdade): é represa, e a página diz
  "represa" e "piscina-praia", nunca "praia".

---

## 10. Componentes — estados obrigatórios

Todo elemento interativo: `default`, `hover`, `focus-visible`, `active`, `disabled`.

- **Foco visível obrigatório**: `outline: 2px solid var(--color-acento-texto); outline-offset: 3px`
  (sobre `ancora`, usar `acento`).
- Alvo de toque mínimo: **44×44px** (inclui as miniaturas da galeria e os controles do lightbox).
- **CTA primário (WhatsApp):** fundo `ancora`, texto `papel`, Nunito Sans 700, `tracking 0.02em`.
  Hover: `ancora-quente` + `translateY(-1px)`.
- **CTA secundário (Airbnb):** **link de texto**, não botão — "ou reserve pelo Airbnb →", sublinhado
  `acento`. Dois botões lado a lado dividem o clique; o WhatsApp é a conversão que a cliente quer.
- **Link em texto:** sublinhado `text-underline-offset: 4px`, `text-decoration-color: acento`.
- **Lightbox:** `<dialog>` nativo, foco preso dentro enquanto aberto, `Esc` fecha, setas ←/→
  navegam, foco volta para a miniatura de origem ao fechar.

---

## 11. Voz e escrita

Tom: **caloroso, sensorial e direto, sem exagero.** Fala com um casal que quer sair da rotina por
um fim de semana — provavelmente de BH ou do interior de Minas — e que já viu dezenas de anúncios
iguais no Airbnb. Os anfitriões são **Calypso Martins e André Tertuliano**; a página fala em
primeira pessoa do plural ("a gente preparou", "a gente responde") quando a voz é deles.

**Fazer:**
- Frases curtas. Verbo ativo. "Você" e "vocês dois".
- Ser específico: "o sol se põe na represa, bem na frente do mezanino" > "vista incrível".
- Nomear o que é: piscina-praia, SUP, represa de Três Marias, mezanino, cabana.
- Botão diz exatamente o que acontece: "Chamar no WhatsApp", "Ver datas no Airbnb".

**Não fazer:**
- Clichês do nicho: "seu refúgio perfeito", "experiência inesquecível", "momentos mágicos",
  "paraíso", "venha se encantar", "conforto e sofisticação".
- Prometer o que não foi confirmado: café incluso, preço, regras, pet, horários.
- Chamar a represa de praia ou de mar.
- Superlativo vazio. A exceção é a frase da própria cliente — "a vista mais exclusiva de Três
  Marias" —, que é posicionamento dela e entra literalmente.

---

## 12. Checklist de qualidade (rodar antes de considerar pronto)

- [ ] Nenhuma cor fora dos tokens; nenhum hex hardcoded no JSX (exceto o azul do monograma SVG)
- [ ] Todos os pares texto/fundo passam AA (tabela da §3)
- [ ] `decor` e `superficie-2` não aparecem como cor de texto sobre fundo claro
- [ ] CTA primário é `ancora`, não âmbar; Airbnb é link de texto, não segundo botão
- [ ] Nenhum degradê laranja→turquesa em lugar nenhum
- [ ] Fotos com máscara de onda, nenhuma com `border-radius`
- [ ] `por-do-sol.jpg` abre a página, com destaque
- [ ] Uma única animação coreografada (a linha do dia); o resto é reveal simples
- [ ] `prefers-reduced-motion` testado e funcionando
- [ ] Lightbox navegável só por teclado, foco devolvido ao fechar
- [ ] Foco de teclado visível em 100% dos interativos
- [ ] Testado em 390px antes de qualquer outro breakpoint
- [ ] Nenhum texto acima de 72 caracteres por linha
- [ ] Nenhuma frase de copy que caberia em qualquer outro anúncio de temporada
- [ ] Nenhuma menção a "praia" ou "mar" fora de "piscina-praia"
- [ ] Licença das fontes documentada (OFL)
- [ ] Nenhum `<<A CONFIRMAR>>` restante no deploy
