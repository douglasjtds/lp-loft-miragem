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
 * Regra inviolável do projeto: nunca inventar registro profissional, telefone, cidade,
 * prazo, preço ou depoimento. Enquanto o dado não chegar, ele aparece assim — visível
 * na página, para que a pendência não passe despercebida até o deploy.
 *
 * O componente `ui/Pendencia` realça o marcador na tela; `lib/pendencias` faz o
 * contrário nos dados estruturados, omitindo o campo em vez de publicar o marcador.
 */
export type AConfirmar = `<<A CONFIRMAR: ${string}>>`;

/**
 * As dez cores do sistema. Espelham exatamente o bloco @theme de globals.css.
 *
 * ⚠️ ESTES VALORES SÃO MARCADORES DE POSIÇÃO — uma escala neutra, deliberadamente sem
 * personalidade, para que ninguém publique por engano achando que é a marca. Substitua
 * pelos hexes do manual da cliente e rode `node scripts/contraste.mjs` antes de seguir:
 * a tabela de contraste é o que decide qual cor pode ser texto e qual não pode, e essa
 * decisão precisa vir de cálculo, nunca de olho.
 *
 * O NOME de cada token é um papel, não uma cor. É isso que permite a mesma base servir
 * uma marca verde-e-terracota e um escritório azul-marinho sem renomear nada.
 */
export const colors = {
  ancora: "#262B30",
  "ancora-quente": "#3A4148",
  decor: "#9AA0A6",
  acento: "#6B7F99",
  "acento-texto": "#4F627A",
  "superficie-2": "#C9CDD2",
  papel: "#FBFBFA",
  creme: "#F1F1EF",
  tinta: "#1B1D1F",
  "tinta-suave": "#55595E",
} as const;

export type ColorToken = keyof typeof colors;

/**
 * O papel de cada cor. O que impede a página de virar template é a disciplina daqui.
 *
 * A regra estrutural, e a mais fácil de quebrar: **inverta a dominância cromática do
 * manual.** Manuais de identidade costumam mostrar a marca sobre um fundo claro e
 * agradável, e seguir isso ao pé da letra produz exatamente a página que geradores de
 * IA produzem. A cor âncora é o ativo escuro e denso do manual — ela é que carrega
 * título, CTA, faixa de fechamento e footer. O fundo claro é suporte.
 */
export const colorRoles: Record<ColorToken, string> = {
  ancora: "Cor âncora. Títulos, CTA primário, faixa de fechamento, footer",
  "ancora-quente":
    "Variação escura da âncora. Hover do CTA primário, texto sobre a superfície secundária",
  decor: "Decorativo apenas. Formas orgânicas, ícones grandes, bordas",
  acento: "Acento: sublinhados, marcadores, hover de link",
  "acento-texto":
    "Única variação do acento aprovada para texto e para o anel de foco",
  "superficie-2":
    "Superfície secundária (faixa de depoimentos) e texto de apoio sobre a âncora",
  papel: "Fundo principal da página",
  creme: "Fundo de seção alternada",
  tinta: "Texto corrido longo (parágrafos)",
  "tinta-suave": "Legendas e textos de apoio",
};

/**
 * As três famílias, nos seus papéis. Três é o teto — a quarta família sempre parece
 * indecisão, nunca riqueza.
 *
 * ⚠️ O padrão abaixo é um trio OFL neutro (Google Fonts), escolhido para o projeto
 * compilar e ter um ponto de partida decente. Substitua pelas fontes do manual **depois
 * de auditar a licença** — ver `references/sistema-de-tokens.md`. O resumo:
 *
 * - Licença desktop NÃO cobre web. É preciso licença **webfont** explícita.
 * - Arquivo marcado "DEMO", "PERSONAL USE" ou "trial" não vai para produção, ponto.
 * - Fonte de procedência incerta (a que "todo mundo tem") também não.
 * - Quando a fonte do manual não puder ser usada, escolha a substituta mais próxima em
 *   contraste de traço e altura-x, e **comunique a troca à cliente** — ela vai comparar
 *   o site com o manual.
 *
 * `variable` é o nome da CSS custom property que o next/font injeta em layout.tsx;
 * `token` é o utilitário Tailwind gerado pelo @theme.
 */
export const fonts = {
  display: {
    family: "Cormorant Garamond",
    weights: [300],
    variable: "--font-display-family",
    token: "font-display",
    role: "Somente h1, h2 e o lockup do logo. Nunca em texto corrido, nunca em caixa alta.",
    substitui: null as string | null,
  },
  ui: {
    family: "Montserrat",
    weights: [400, 500, 600],
    variable: "--font-ui-family",
    token: "font-ui",
    role: "Botões, nav, labels, eyebrows, FAQ, footer.",
    substitui: null as string | null,
  },
  editorial: {
    family: "EB Garamond",
    weights: [400],
    variable: "--font-editorial-family",
    token: "font-editorial",
    role: "Somente depoimentos e pull quotes.",
    substitui: null as string | null,
  },
} as const;

export type FontRole = keyof typeof fonts;

/**
 * Registro em conselho profissional.
 *
 * Para várias profissões isto não é enfeite de credibilidade: é **exigência do código
 * de ética para publicidade**, e a omissão é infração. CRN (nutrição), CRP (psicologia),
 * CRM (medicina), CRO (odontologia), OAB (advocacia), CREF (educação física), CAU
 * (arquitetura), CRC (contabilidade), CREA (engenharia).
 *
 * `null` quando a profissão não tem conselho (a maioria das áreas criativas e de
 * consultoria). `null` é uma resposta legítima; inventar um número não é.
 */
export type RegistroProfissional = {
  /** A sigla do conselho, com a região quando houver: "CRN-3", "CRP 06", "OAB/SP". */
  sigla: string;
  numero: string;
  /** Nome do conselho por extenso — vai para o JSON-LD. */
  conselho: string;
};

/** Identidade da profissional. */
export const profile: {
  /** Nome de marca: como ela é conhecida e como as pessoas buscam por ela. */
  nome: string;
  /** Nome completo como consta no registro. Vai para o JSON-LD, não para a página. */
  nomeCompleto: string;
  /** "Nutricionista", "Psicóloga", "Advogado". Aparece no eyebrow do herói. */
  titulo: string;
  /** Uma linha. É a frase que a cliente já usa na bio do Instagram, se houver. */
  bio: string;
  registro: RegistroProfissional | null;
  cidade: string;
  /** "online e presencial", "só online", "presencial em <bairro>". */
  atendimento: string;
  email: string | null;
} = {
  nome: "<<A CONFIRMAR: nome de marca>>",
  nomeCompleto: "<<A CONFIRMAR: nome completo como consta no registro>>",
  titulo: "<<A CONFIRMAR: título profissional>>",
  bio: "<<A CONFIRMAR: uma linha de posicionamento>>",
  registro: {
    sigla: "<<A CONFIRMAR: sigla do conselho e região>>",
    numero: "<<A CONFIRMAR: número do registro>>",
    conselho: "<<A CONFIRMAR: nome do conselho por extenso>>",
  },
  cidade: "<<A CONFIRMAR: cidade e estado de atendimento>>",
  atendimento: "<<A CONFIRMAR: online, presencial ou ambos>>",
  email: null,
};

/**
 * O registro formatado como aparece na página ("CRN-3 12345"), ou `null`.
 * Existe aqui, e não em `content.ts`, porque a formatação é derivada — não é copy.
 */
export const registroFormatado: string | null = profile.registro
  ? `${profile.registro.sigla} ${profile.registro.numero}`
  : null;

/**
 * WhatsApp — a única ação de conversão da página.
 *
 * `phone` precisa ser só dígitos, em formato internacional: 55 + DDD + número.
 * Enquanto o número real não chegar, `phone` fica vazio e `phonePendente` sinaliza isso
 * a quem for montar o link (`lib/whatsapp.ts`), que então renderiza o CTA desabilitado.
 * Um `wa.me/?text=...` sem destinatário abriria o WhatsApp em branco e chegaria em
 * produção sem ninguém notar — por isso o estado pendente é explícito.
 */
export const whatsapp: {
  phone: string;
  phonePendente: AConfirmar | null;
  /** Como o número aparece escrito, no footer. */
  display: string;
} = {
  phone: "",
  phonePendente: "<<A CONFIRMAR: WhatsApp com DDD>>",
  display: "<<A CONFIRMAR: WhatsApp formatado>>",
};

/** Redes sociais. Alimentam o footer e o `sameAs` do JSON-LD. */
export const social: {
  instagram: { handle: string; url: string } | null;
  linkedin: { handle: string; url: string } | null;
} = {
  instagram: null,
  linkedin: null,
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
  registroFormatado,
  whatsapp,
  social,
  site,
};
