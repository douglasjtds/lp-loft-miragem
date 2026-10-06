/**
 * Fronteira white-label (landing-page-structure.md §3).
 *
 * Este arquivo e `content.ts` concentram 100% do que é específico da cliente.
 * Junto com `globals.css`, é o ÚNICO lugar do projeto onde um valor hex pode aparecer.
 * Nenhum componente contém cor, telefone, nome ou texto hardcoded.
 *
 * Trocar `brand.ts` + `content.ts` + `public/` deve produzir a landing de outra pessoa
 * sem tocar em componente algum. Se um componente precisou mudar, ou a informação está
 * no lugar errado, ou o componente está fazendo curadoria que não é dele.
 */

/**
 * Marcador de dado que a cliente ainda não forneceu.
 *
 * Regra inviolável do projeto: nunca inventar preço, horário, regra da casa, distância
 * ou avaliação. Enquanto o dado não chegar, ele aparece assim — visível
 * na página, para que a pendência não passe despercebida até o deploy.
 *
 * O componente `ui/Pendencia` realça o marcador na tela; `lib/pendencias` faz o
 * contrário nos dados estruturados, omitindo o campo em vez de publicar o marcador.
 */
export type AConfirmar = `<<A CONFIRMAR: ${string}>>`;

/**
 * As dez cores do sistema. Espelham exatamente o bloco @theme de globals.css.
 *
 * Amostradas da logo (`reference-files/POUSADA LOGO.png`): contorno grafite, céu âmbar,
 * onda turquesa. Os neutros são derivados da areia da piscina-praia. A tabela de
 * contraste (DESIGN-GUIDELINES.md §3, gerada por `node scripts/contraste.mjs`) decide
 * qual cor pode ser texto; essa decisão vem de cálculo, nunca de olho.
 *
 * O azul #1494D3 da logo NÃO é token: aparece só dentro do monograma SVG.
 */
export const colors = {
  ancora: "#373435",
  "ancora-quente": "#4B4648",
  decor: "#30C8D4",
  acento: "#D69257",
  "acento-texto": "#8F5420",
  "superficie-2": "#E4CFB5",
  papel: "#FBF7F1",
  creme: "#F3E9DC",
  tinta: "#2A2728",
  "tinta-suave": "#6B6466",
} as const;

export type ColorToken = keyof typeof colors;

/**
 * O papel de cada cor (DESIGN-GUIDELINES.md §3). O que impede a página de virar
 * anúncio de temporada é a disciplina daqui: a âncora é o grafite, o âmbar é acento e
 * nunca botão, o turquesa é decorativo e nunca texto, e não existe degradê entre eles.
 */
export const colorRoles: Record<ColorToken, string> = {
  ancora: "Cor âncora. Títulos, CTA primário, faixa de fechamento, footer",
  "ancora-quente": "Hover do CTA primário; atribuição na faixa de avaliações",
  decor:
    "Decorativo apenas, nunca texto. Ondas, ícones grandes sobre ancora, bordas",
  acento:
    "Sublinhados, marcadores, hover de link; texto só sobre ancora. Nunca botão",
  "acento-texto":
    "Única variação do acento aprovada para texto sobre fundo claro e para o anel de foco",
  "superficie-2": "Faixa de avaliações; texto de apoio sobre ancora",
  papel: "Fundo principal da página",
  creme: "Fundo de seção alternada",
  tinta: "Texto corrido longo",
  "tinta-suave": "Legendas e textos de apoio",
};

/**
 * As três famílias, nos papéis do DESIGN-GUIDELINES.md §4. Duas famílias de verdade:
 * o editorial é o itálico da própria Fraunces, sem o custo de uma terceira.
 *
 * Licença: Fraunces e Nunito Sans são Google Fonts sob SIL Open Font License 1.1,
 * servidas por self-host pelo next/font. Nenhum arquivo de fonte veio da cliente, e a
 * fonte da wordmark da logo não é usada como texto.
 *
 * `variable` é o nome da CSS custom property que o next/font injeta em layout.tsx;
 * `token` é o utilitário Tailwind gerado pelo @theme; `soft` é o eixo SOFT da Fraunces
 * (0 a 100: quanto maior, mais arredondadas as serifas).
 */
export const fonts = {
  display: {
    family: "Fraunces",
    weights: [500, 600],
    soft: 80 as number | null,
    italico: false,
    variable: "--font-display-family",
    token: "font-display",
    role: "Somente h1 e h2. Nunca em texto corrido, nunca em caixa alta.",
    substitui: null as string | null,
  },
  ui: {
    family: "Nunito Sans",
    weights: [400, 500, 600],
    soft: null as number | null,
    italico: false,
    variable: "--font-ui-family",
    token: "font-ui",
    role: "Botões, nav, labels, eyebrows, texto corrido, FAQ, footer.",
    substitui: null as string | null,
  },
  editorial: {
    family: "Fraunces Italic",
    weights: [400],
    soft: 100 as number | null,
    italico: true,
    variable: "--font-editorial-family",
    token: "font-editorial",
    role: "Somente avaliações e pull quotes.",
    substitui: null as string | null,
  },
} as const;

export type FontRole = keyof typeof fonts;

/**
 * O negócio. Não há profissional nem registro em conselho (DESIGN-GUIDELINES.md §0):
 * quem aparece são os anfitriões, no footer e no "Como reservar".
 */
export const profile: {
  /** Nome de marca, como aparece na logo e no Instagram. */
  nome: string;
  cidade: string;
  uf: string;
  anfitrioes: readonly string[];
} = {
  nome: "Loft Miragem",
  cidade: "Três Marias",
  uf: "MG",
  anfitrioes: ["Calypso Martins", "André Tertuliano"],
};

/** "Três Marias, MG". Derivado, não copy: mora aqui e não em `content.ts`. */
export const cidadeUf = `${profile.cidade}, ${profile.uf}`;

/** "Calypso Martins e André Tertuliano". */
export const anfitrioesFormatado = profile.anfitrioes.join(" e ");

/** "Calypso e André". Para a copy em tom próximo (Como reservar, CTA final). */
export const anfitrioesPrimeiroNome = profile.anfitrioes
  .map((nome) => nome.split(" ")[0])
  .join(" e ");

/**
 * WhatsApp: a ação de conversão principal da página.
 *
 * `phone` precisa ser só dígitos, em formato internacional: 55 + DDD + número.
 * `phonePendente` continua existindo para o caso de o número mudar e ficar a confirmar:
 * `lib/whatsapp.ts` então renderiza o CTA desabilitado em vez de um `wa.me` sem
 * destinatário.
 */
export const whatsapp: {
  phone: string;
  phonePendente: AConfirmar | null;
  /** Como o número aparece escrito, no footer. */
  display: string;
} = {
  phone: "5531972044476",
  phonePendente: null,
  display: "(31) 97204-4476",
};

/**
 * Perfis externos. Alimentam o footer e o `sameAs` do JSON-LD.
 *
 * O Airbnb é também a conversão secundária. A URL fica sem os parâmetros de
 * compartilhamento do link original; a origem do clique (`?src=`) é acrescentada por
 * quem monta o link.
 */
export const social: {
  instagram: { handle: string; url: string } | null;
  airbnb: { url: string } | null;
  /** Ficha do Google (avaliações). Fora do `sameAs` do JSON-LD (§7). */
  google: { url: string } | null;
} = {
  instagram: {
    handle: "@loft_miragem",
    url: "https://www.instagram.com/loft_miragem/",
  },
  airbnb: {
    url: "https://www.airbnb.com.br/rooms/1440093946948725210",
  },
  google: {
    url: "https://maps.google.com/?cid=14045626813725772117",
  },
};

/** Domínio final. Vira `metadataBase` e `alternates.canonical`. */
export const site: { url: AConfirmar | string } = {
  url: "<<A CONFIRMAR: domínio final, ex. https://exemplo.com.br>>",
};

export const brand = {
  colors,
  colorRoles,
  fonts,
  profile,
  cidadeUf,
  anfitrioesFormatado,
  anfitrioesPrimeiroNome,
  whatsapp,
  social,
  site,
};
