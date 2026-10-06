/**
 * Toda a copy da página, tipada.
 *
 * Fronteira white-label: junto com `brand.ts` e a pasta `public/`, este arquivo
 * concentra 100% do que é específico da cliente. Nenhum componente contém texto
 * hardcoded.
 *
 * ## Como preencher
 *
 * Regra inviolável: **nada aqui é inventado**. Preço, horário, regra da casa, café,
 * pet, distância e avaliação só entram confirmados (landing-page-structure §5.2, §5.5 e
 * o anúncio do Airbnb). O resto traz o marcador `<<A CONFIRMAR: ...>>`, que fica VISÍVEL
 * na página até o dado real chegar e some do JSON-LD (`lib/pendencias`).
 *
 * Voz (DESIGN-GUIDELINES §11): calorosa, sensorial e direta, sem exagero. "Você" e
 * "vocês dois"; primeira pessoa do plural quando a voz é dos anfitriões. O teste de
 * cada frase: **se caberia em qualquer anúncio de temporada, está errada.**
 *
 * Proibido em qualquer string visível: travessão (use vírgula, dois-pontos, `·` ou
 * quebra de linha) e "praia"/"mar" para a represa (só "piscina-praia"). A única
 * exceção são as avaliações, que são citação literal de hóspede (ver `avaliacoes`).
 *
 * ## Notação de texto
 *
 * As strings aceitam marcações interpretadas por `ui/Pendencia`:
 * `<<A CONFIRMAR: ...>>`, `**negrito**`, `_itálico_` e `\n` para quebra dentro do mesmo
 * parágrafo.
 */

import {
  anfitrioesFormatado,
  anfitrioesPrimeiroNome,
  cidadeUf,
  profile,
  social,
} from "@/config/brand";
import type { BrandIconName } from "@/config/brand-icons";
import type { OrganicShape } from "@/components/ui/OrganicClipPaths";
import type { CtaOrigem } from "@/lib/whatsapp";

/**
 * Um texto que pode conter marcadores de pendência (`<<A CONFIRMAR: ...>>`) e ênfase
 * (`**negrito**`, `_itálico_`) no meio da frase.
 */
type Texto = string;

/** Rótulo de um CTA de WhatsApp + a origem que define a mensagem pré-preenchida. */
export type CtaContent = {
  label: string;
  origem: CtaOrigem;
  /** Rótulo acessível: o leitor de tela precisa saber que o link sai do site. */
  ariaLabel: string;
};

/** Link de texto para fora do site (Airbnb, Google, Instagram, Maps). */
export type LinkExterno = {
  label: string;
  /** `null` enquanto o destino não estiver confirmado: o componente não renderiza link. */
  href: string | null;
  ariaLabel: string;
};

/** Foto de conteúdo: `alt` real e descritivo é requisito de acessibilidade. */
export type Foto = {
  src: string;
  alt: string;
  shape: OrganicShape;
  /** Enquadramento: retrato (todo o acervo é vertical) ou paisagem. */
  orientacao?: "retrato" | "paisagem";
  /** Ajuste fino do corte, ex. "50% 30%". */
  objectPosition?: string;
  /** Espelha a máscara na horizontal (a noite da Experiência usa `b` espelhada). */
  espelhada?: boolean;
};

/** Link do anúncio com a origem do clique (§6). O Airbnb ignora o `src`. */
function airbnb(
  src: "hero" | "prova" | "como-reservar" | "avaliacoes" | "footer",
) {
  return social.airbnb ? `${social.airbnb.url}?src=${src}` : null;
}

/** Ficha do Google. Sem `src`: se houver analytics, o clique conta por evento. */
const fichaGoogle = social.google?.url ?? null;

const NOVA_ABA = "(abre em nova aba)";

/* ────────────────────────────────────────────────────────────────────────────
   CTA: as mensagens pré-preenchidas do WhatsApp (landing-page-structure §6)

   O único rastreamento de origem que existe sem backend: a mensagem que chega no
   celular dos anfitriões já diz de qual ponto da página a pessoa saiu. Na voz de
   QUEM VISITA, e distinguíveis entre si.
   ──────────────────────────────────────────────────────────────────────────── */

export const mensagensPorOrigem: Record<CtaOrigem, string> = {
  header: "Oi! Vi o site do Loft Miragem e queria saber das datas disponíveis.",
  hero: "Oi! Vi aquela vista do pôr do sol e queremos ir. Quais datas estão livres?",
  "o-loft": "Oi! Tenho uma dúvida sobre o loft antes de reservar:",
  "como-reservar":
    "Oi! Quero reservar o Loft Miragem. Nossas datas e quantas pessoas:",
  "cta-final":
    "Oi! Decidimos: queremos passar uns dias no Loft Miragem. Tem data?",
  "sticky-mobile": "Oi! Vim pelo site e queria ver a disponibilidade do loft.",
};

/* ────────────────────────────────────────────────────────────────────────────
   Header
   ──────────────────────────────────────────────────────────────────────────── */

export const header = {
  /** Sem menu hambúrguer: a página é curta e o CTA vale mais que a navegação. */
  ancoras: [
    { label: "Experiência", href: "#experiencia" },
    { label: "Galeria", href: "#galeria" },
    { label: "O loft", href: "#o-loft" },
    { label: "Dúvidas", href: "#duvidas" },
  ],
  cta: {
    label: "WhatsApp",
    origem: "header",
    ariaLabel: `Chamar o ${profile.nome} no WhatsApp ${NOVA_ABA}`,
  } satisfies CtaContent,
  monogramaAlt: `Monograma do ${profile.nome}`,
  navLabel: "Navegação principal",
  inicioLabel: "Ir para o início da página",
  /** Primeiro elemento focável da página: pula o header para quem navega por teclado. */
  pularParaConteudo: "Pular para o conteúdo",
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Hero  ⭐  (§5.1)
   ──────────────────────────────────────────────────────────────────────────── */

export const hero = {
  /** Âncora do topo (monograma do header) e alvo do observer do StickyMobileCta. */
  id: "inicio",

  /** Conta como o 1º eyebrow da regra "1 a cada 3". */
  eyebrow: `${profile.cidade} · ${profile.uf} · loft para casais` as Texto,

  /**
   * O ÚNICO h1. Frase da cliente (bio do Instagram), literal: é a exceção consciente à
   * regra do superlativo (DESIGN-GUIDELINES §11). Uma linha por item: a Fase 7 anima
   * linha a linha.
   */
  h1: ["A vista mais exclusiva", "de Três Marias"] as const,

  /** Uma frase: o que existe ali, nomeado. */
  subtitulo:
    "Piscina-praia, SUP na água calma da represa e o sol se pondo bem na frente do mezanino, num loft pensado para vocês dois." as Texto,

  cta: {
    label: "Chamar no WhatsApp",
    origem: "hero",
    ariaLabel: `Chamar o ${profile.nome} no WhatsApp para ver as datas ${NOVA_ABA}`,
  } satisfies CtaContent,

  /** Conversão secundária: link de texto, nunca segundo botão (§10). */
  airbnb: {
    label: "ou veja as datas no Airbnb →",
    href: airbnb("hero"),
    ariaLabel: `Ver as datas do ${profile.nome} no Airbnb ${NOVA_ABA}`,
  } satisfies LinkExterno,

  /** Linha de prova. Dados confirmados em 2026-10-05 (Airbnb) e 2026-10-06 (Google). */
  prova: "★ 5,0 no Google e no Airbnb · Preferido dos hóspedes" as Texto,

  /** LCP: `priority`, sol no terço superior. */
  foto: {
    src: "/images/hero-por-do-sol.jpg",
    alt: "O sol se pondo sobre a represa de Três Marias, visto do mezanino do loft através da rede de corda, com a piscina-praia embaixo.",
    shape: "a",
    orientacao: "retrato",
    objectPosition: "50% 22%",
  } satisfies Foto,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   ProvaRapida  (§5.2)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Faixa fina, sem ícones. Cada item é texto e, quando há fonte, linka para ela.
 * Confirmado no Airbnb em 2026-10-05 e no Google em 2026-10-06. Os números mudam:
 * conferir nas duas fontes no checklist de deploy.
 */
export type ProvaItem = {
  destaque: string;
  texto: Texto;
  href: string | null;
  ariaLabel?: string;
};

export const provaRapida: {
  exibir: boolean;
  itens: readonly ProvaItem[];
} = {
  exibir: true,
  itens: [
    {
      destaque: "5,0",
      texto: "nota média no Google e no Airbnb",
      href: null,
    },
    {
      destaque: "18",
      texto: "avaliações no Google",
      href: fichaGoogle,
      ariaLabel: `Ler as 18 avaliações no Google ${NOVA_ABA}`,
    },
    {
      destaque: "Preferido dos hóspedes",
      texto: "no Airbnb",
      href: airbnb("prova"),
      ariaLabel: `Ver o anúncio no Airbnb ${NOVA_ABA}`,
    },
    {
      destaque: "Beira d’água",
      texto: "na represa de Três Marias",
      href: null,
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
   Experiencia  ⭐⭐ seção-assinatura  (§5.3)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Um dia no loft: manhã → tarde → noite. É uma SEQUÊNCIA, então vira linha do tempo,
 * não três cards. A ordem de `momentos` é a ordem da coreografia da Fase 7.
 *
 * A tarde não tem foto de propósito (foto em alguns momentos, nunca em todos); a foto
 * do SUP mora na galeria.
 */
export type Momento = {
  chave: "manha" | "tarde" | "noite";
  rotulo: string;
  icone: BrandIconName;
  titulo: string;
  texto: Texto;
  foto: Foto | null;
};

export const experiencia: {
  id: string;
  titulo: string;
  intro: Texto;
  momentos: readonly Momento[];
} = {
  id: "experiencia",
  titulo: "Do café na piscina ao pôr do sol na represa",
  intro: "Manhã, tarde e noite, sem sair da beira da represa.",
  momentos: [
    {
      chave: "manha",
      rotulo: "Manhã",
      icone: "sol-nascente",
      titulo: "Café flutuando na piscina-praia",
      /* Descreve a cena da foto. NÃO diz se o café é incluso: isso é pendência (FAQ). */
      texto:
        "A bandeja flutua na água e o café se toma com os pés na areia da piscina, a cabana preta ao fundo.",
      foto: {
        src: "/images/manha-cafe.jpg",
        alt: "Bandeja de café da manhã flutuando na piscina-praia, com a cabana preta do loft e o céu azul ao fundo.",
        shape: "b",
        orientacao: "retrato",
        objectPosition: "50% 60%",
      },
    },
    {
      chave: "tarde",
      rotulo: "Tarde",
      icone: "prancha",
      titulo: "SUP na água calma",
      texto:
        "As pranchas de stand-up paddle ficam no loft. É só levar até a margem e remar pela represa.",
      foto: null,
    },
    {
      chave: "noite",
      rotulo: "Noite",
      icone: "lua-agua",
      titulo: "A piscina acesa",
      texto:
        "Quando escurece, a piscina acende em azul e o loft aparece inteiro pela vidraça.",
      foto: {
        src: "/images/noite-piscina.jpg",
        alt: "Piscina iluminada em azul à noite, com o interior do loft aceso visto pela vidraça.",
        shape: "b",
        espelhada: true,
        orientacao: "retrato",
        objectPosition: "50% 50%",
      },
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
   Galeria  (§5.4)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Item da galeria. Hoje só existem fotos e o componente só precisa renderizar `foto`.
 * Vídeo é o modelo de dados para o futuro: `poster` na grade, `<video>` só no lightbox.
 *
 * O componente aceita de 4 a 12 itens sem mudar código: foto nova = item novo aqui +
 * linha no `scripts/processar-fotos.mjs`. O primeiro item é o destaque (máscara `d`).
 */
export type GaleriaItem =
  | {
      tipo: "foto";
      src: string;
      /** Versão do lightbox, carregada só ao abrir. */
      srcGrande: string;
      alt: string;
      legenda: Texto;
    }
  | {
      tipo: "video";
      src: string;
      poster: string;
      alt: string;
      legenda: Texto;
    };

export const galeria: {
  id: string;
  titulo: string;
  itens: readonly GaleriaItem[];
  lightbox: {
    dialogLabel: string;
    fechar: string;
    anterior: string;
    proxima: string;
    /** `{atual}` e `{total}` são trocados pelo componente: "2 / 5". */
    contador: string;
    /** Rótulo da miniatura. `{legenda}` é trocado pelo componente. */
    ampliar: string;
  };
  instagram: LinkExterno;
} = {
  id: "galeria",
  titulo: "O loft, foto por foto",
  itens: [
    {
      tipo: "foto",
      src: "/images/hero-por-do-sol.jpg",
      srcGrande: "/images/hero-por-do-sol-grande.jpg",
      alt: "O sol se pondo sobre a represa de Três Marias, visto do mezanino do loft através da rede de corda, com a piscina-praia embaixo.",
      legenda: "O pôr do sol visto do mezanino",
    },
    {
      tipo: "foto",
      src: "/images/galeria-pranchas.jpg",
      /* Original de 640px: sem versão grande e sem upscale (§9). */
      srcGrande: "/images/galeria-pranchas.jpg",
      alt: "Duas pranchas de stand-up paddle com a logo do Loft Miragem na represa ao pôr do sol, vistas de quem está sentado nelas.",
      legenda: "As pranchas na represa, no fim da tarde",
    },
    {
      tipo: "foto",
      src: "/images/manha-cafe.jpg",
      srcGrande: "/images/manha-cafe-grande.jpg",
      alt: "Bandeja de café da manhã flutuando na piscina-praia, com a cabana preta do loft e o céu azul ao fundo.",
      legenda: "Café na piscina-praia",
    },
    /* Pessoa identificável: sai da lista se a autorização de uso de imagem não vier
       (<<A CONFIRMAR>> em DESIGN-GUIDELINES §9). As pranchas cobrem o SUP sozinhas. */
    {
      tipo: "foto",
      src: "/images/tarde-sup.jpg",
      srcGrande: "/images/tarde-sup-grande.jpg",
      alt: "Mulher segurando a prancha de stand-up paddle com a logo do Loft Miragem na margem da represa.",
      legenda: "SUP na margem da represa",
    },
    {
      tipo: "foto",
      src: "/images/noite-piscina.jpg",
      srcGrande: "/images/noite-piscina-grande.jpg",
      alt: "Piscina iluminada em azul à noite, com o interior do loft aceso visto pela vidraça.",
      legenda: "A piscina acesa à noite",
    },
  ],
  lightbox: {
    dialogLabel: `Fotos do ${profile.nome}`,
    fechar: "Fechar",
    anterior: "Foto anterior",
    proxima: "Próxima foto",
    contador: "{atual} / {total}",
    ampliar: "Ampliar foto: {legenda}",
  },
  instagram: {
    label: `mais fotos no Instagram ${social.instagram?.handle ?? ""}`.trim(),
    href: social.instagram?.url ?? null,
    ariaLabel: `Ver mais fotos no Instagram do ${profile.nome} ${NOVA_ABA}`,
  },
};

/* ────────────────────────────────────────────────────────────────────────────
   OLoft  (§5.5)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * "Cabe no que a gente precisa?" Duas colunas de texto, nunca grade de ícones.
 * `capacidade` e `comodidades`: confirmados no Airbnb em 2026-10-05. `pendencias`
 * aparecem como marcador até os anfitriões responderem. (Avaliações de hóspedes citam
 * ar-condicionado, mas só a cliente confirma dado para a página.)
 */
export const oLoft = {
  id: "o-loft",
  titulo: "O que tem no loft",
  frase: "Pensado para casais, e acomoda até 4 pessoas." as Texto,
  capacidade: ["4 hóspedes", "1 quarto", "2 camas", "1 banheiro"],
  comodidades: [
    "Piscina-praia (piscina de areia)",
    "Pranchas de stand-up paddle",
    "Na beira da represa",
    "Cozinha",
    "Wi-Fi e espaço de trabalho",
    "Estacionamento gratuito no local",
    "Self check-in com cofre de chaves",
  ] as readonly Texto[],
  pendencias: [
    "<<A CONFIRMAR: café da manhã incluso ou cobrado à parte?>>",
    "<<A CONFIRMAR: ar-condicionado / ventilação>>",
    "<<A CONFIRMAR: roupa de cama e toalhas inclusas>>",
  ] as readonly Texto[],
  cta: {
    label: "Tirar uma dúvida no WhatsApp",
    origem: "o-loft",
    ariaLabel: `Tirar uma dúvida sobre o loft no WhatsApp ${NOVA_ABA}`,
  } satisfies CtaContent,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Avaliações  (§5.6, componente Depoimentos)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Avaliações reais, transcritas LITERALMENTE de `reference-files/avaliacoes-google.md`
 * (capturadas em 2026-10-06). A curadoria é de QUAIS entram, nunca do texto: não
 * resumir, cortar, corrigir nem "melhorar". Quebras de linha do original viram `\n`.
 *
 * Critério da seleção: falam do que só o loft tem (vista da represa, piscina, SUP,
 * vinho de cortesia, casal) e variam de tamanho para o masonry ter ritmo. A regra da
 * Taste de cortar citação em 3 linhas perde para a spec (texto integral).
 *
 * Exceções conscientes às regras de copy, por serem fala de hóspede (decisão do
 * Douglas em 2026-10-06): Cynthia usa travessão e Yuri escreve "mar de minas".
 * Não editar; se a regra tiver que valer, a avaliação sai inteira.
 *
 * Fica fora: avaliação de parente dos anfitriões ou de quem fez o projeto (a do
 * Douglas no Google). As do Airbnb entram quando chegarem os prints.
 *
 * `quando`: o Google mostra data relativa; o mês/ano é aproximado a partir da captura.
 */
export type Avaliacao = {
  /** Primeiro nome, como aparece na fonte. */
  nome: string;
  quando: string;
  fonte: "google" | "airbnb";
  texto: string;
};

export const avaliacoes: {
  exibir: boolean;
  id: string;
  titulo: string;
  resumo: Texto;
  /** Atribuição em texto, sem logo: "via Google". */
  rotuloFonte: Record<Avaliacao["fonte"], string>;
  itens: readonly Avaliacao[];
  links: readonly LinkExterno[];
} = {
  exibir: true,
  id: "avaliacoes",
  titulo: "O que os hóspedes escreveram",
  resumo: "★ 5,0 · 18 avaliações no Google · 5 no Airbnb",
  rotuloFonte: { google: "via Google", airbnb: "via Airbnb" },
  itens: [
    {
      nome: "Jhonathan",
      quando: "2025",
      fonte: "google",
      texto:
        "Experiência incrível em Três Marias!\nO loft tem estilo de um chalé e superou todas as nossas expectativas!\nO acesso é muito fácil, já que fica em um bairro tranquilo dentro da própria cidade. Ao mesmo tempo, está à beira da represa, com uma vista deslumbrante e um clima de paz perfeito.\nA estrutura é impecável:\ncama queen super confortável, ar-condicionado, TV, wi-fi, cozinha totalmente equipada, cortinas automatizadas, piscina com prainha, tudo novinho e funcionando perfeitamente. Além de tudo isso, tem duas pranchas de stand up paddle com coletes, que usamos para aproveitar a represa.\nO check-in e o check-out são totalmente automatizados, o que nos deu flexibilidade e praticidade.\nFoi uma estadia perfeita para relaxar, aproveitar a natureza e curtir momentos a dois.\nRecomendamos demais essa experiência!",
    },
    {
      nome: "Luiz Fernando",
      quando: "abr 2026",
      fonte: "google",
      texto:
        "Experiência incrível, Loft muito aconchegante, bem equipado e de fácil acesso. Lugar ideal para casais que buscam descanso e tranquilidade. Parabéns aos anfitriões!!",
    },
    {
      nome: "Cynthia",
      quando: "mai 2026",
      fonte: "google",
      texto:
        "Ambiente extremamente limpo, anfitriões muito atenciosos — o vinho de cortesia foi um detalhe que faz toda a diferença. Tudo pensado com cuidado, até a Alexa para deixar a experiência ainda melhor. O espaço é novinho e exatamente como nas fotos. Vivi dias maravilhosos de descanso, com uma vista linda para a represa. Com certeza voltarei!",
    },
    {
      nome: "Ariane",
      quando: "jun 2026",
      fonte: "google",
      texto:
        "Experiência incrível! O lugar é lindo, super aconchegante, limpo e com uma vista maravilhosa!",
    },
    {
      nome: "Yuri",
      quando: "2025",
      fonte: "google",
      texto:
        'Olha essas fotos..sério. Volta lá e abre as fotos; que lugar INCRÍVEL! Piscininha, deck, rua pertinho do mar de minas, SUP pra remar na tranquilidade das águas calmas da represa, caminha de frente pra tudo isso e janela com black-out eletrônico. Sei nem se eu estou vivendo ou sonhando! Idéia maravilhosa para essa região e num lugar super privilegiado. Se eu tivesse lido no anúncio: "mínimo de 62 noites", teria clicado no DECLARO QUE LI E ACEITO...',
    },
    {
      nome: "Lorena",
      quando: "2025",
      fonte: "google",
      texto:
        "Ficamos hospedados no Loft Miragem e só temos elogios. O Chalé é super bem equipado, o quarto é super limpo e aconchegante, perfeito para descansar com conforto. Sem falar que acordar todos os dias com aquela vista espetacular para a represa não tem preço, torna a experiência ainda mais especial. O anfitrião é extremamente simpático e prestativo e fez toda a diferença na experiência. Um lugar de paz, tranquilidade e excelente energia. Recomendo de olhos fechados. Voltaremos com certeza. 🙌🏼✨",
    },
  ],
  links: [
    {
      label: "ler todas no Google",
      href: fichaGoogle,
      ariaLabel: `Ler todas as avaliações no Google ${NOVA_ABA}`,
    },
    {
      label: "no Airbnb",
      href: airbnb("avaliacoes"),
      ariaLabel: `Ler as avaliações no Airbnb ${NOVA_ABA}`,
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
   Como reservar  (§5.7, componente ComoFunciona)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * "E agora, como faço?" Sequência real, então a numeração 01/02/03 se justifica (é o
 * único lugar da página onde ela aparece). Forma de pagamento e horários são promessa
 * contratual: marcador até a cliente responder.
 */
export const comoReservar = {
  id: "como-reservar",
  /** 2º eyebrow da página: Localização e Dúvidas, que vêm depois, não têm. */
  eyebrow: "Como reservar",
  titulo: "Reservar é uma conversa no WhatsApp",
  intro:
    "Sem formulário e sem cadastro: vocês falam direto com quem cuida do loft." as Texto,

  etapas: [
    {
      numero: "01",
      titulo: "Chame no WhatsApp",
      paragrafos: [
        `Mandem as datas e quantas pessoas vêm. Quem responde são ${anfitrioesPrimeiroNome}, os anfitriões.`,
      ] as readonly Texto[],
    },
    {
      numero: "02",
      titulo: "Confirme a reserva",
      paragrafos: [
        "<<A CONFIRMAR: forma de pagamento/sinal na reserva direta>>",
      ] as readonly Texto[],
    },
    {
      numero: "03",
      titulo: "Chegue e entre por conta própria",
      paragrafos: [
        "O check-in é feito por vocês, com cofre de chaves: não precisa esperar ninguém na porta.",
        "<<A CONFIRMAR: horários de check-in e check-out>>",
      ] as readonly Texto[],
    },
  ],

  /** Sem foto: a sequência se explica sozinha, e foto de banco aqui seria pior. */
  foto: null as Foto | null,

  cta: {
    label: "Mandar as datas no WhatsApp",
    origem: "como-reservar",
    ariaLabel: `Mandar as datas da reserva no WhatsApp ${NOVA_ABA}`,
  } satisfies CtaContent,

  airbnb: {
    label: "Prefere reservar pelo Airbnb? Também dá →",
    href: airbnb("como-reservar"),
    ariaLabel: `Reservar pelo Airbnb ${NOVA_ABA}`,
  } satisfies LinkExterno,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Localizacao  (§5.8)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * "Onde fica e como chego?" Sem iframe do Google Maps (peso, rastreador, CLS): um
 * link de texto, que só aparece quando a cliente aprovar mostrar a localização. O
 * Airbnb só revela o endereço depois da reserva; perguntar se os anfitriões preferem
 * a mesma política. Candidato ao link: a ficha do Google (`social.google`).
 */
export const localizacao = {
  id: "localizacao",
  titulo: "Onde fica",
  paragrafos: [
    `Em ${cidadeUf}, na beira da represa.`,
    "<<A CONFIRMAR: bairro/condomínio e referência de acesso>>",
    "<<A CONFIRMAR: distância/tempo a partir de BH>>",
  ] as readonly Texto[],
  mapa: {
    label: "Abrir no Google Maps",
    href: null,
    ariaLabel: `Abrir a localização do ${profile.nome} no Google Maps ${NOVA_ABA}`,
  } satisfies LinkExterno,
  /** Exibido enquanto `mapa.href` for null. */
  mapaPendencia:
    "<<A CONFIRMAR: link do Google Maps e se a localização pode ser pública>>" as Texto,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Faq  (§5.9)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Espelha o JSON-LD FAQPage: só entram no schema as perguntas sem marcador (filtro em
 * `lib/schema.ts`). Hoje, só a da capacidade está 100% confirmada.
 */
export const faq = {
  id: "duvidas",
  titulo: "Dúvidas de quem vai reservar",

  perguntas: [
    {
      pergunta: "Quanto custa a diária?",
      resposta: '<<A CONFIRMAR: faixa de preço ou "consulte as datas">>',
    },
    {
      pergunta: "Quantas pessoas o loft acomoda?",
      resposta: "Até 4. Foi pensado para casais, mas tem duas camas.",
    },
    {
      pergunta: "O café da manhã está incluso?",
      resposta: "<<A CONFIRMAR: café da manhã incluso ou cobrado à parte>>",
    },
    {
      pergunta: "Posso levar meu pet?",
      resposta: "<<A CONFIRMAR: aceita pet ou não, e em quais condições>>",
    },
    {
      pergunta: "Como funciona o check-in?",
      resposta:
        "É self check-in, com cofre de chaves: vocês chegam e entram sem precisar encontrar ninguém. <<A CONFIRMAR: horários de check-in e check-out>>",
    },
    {
      pergunta: "Preciso saber remar para usar o SUP?",
      resposta:
        "<<A CONFIRMAR: orientação para iniciantes e colete disponíveis?>>",
    },
    {
      pergunta: "Reservar pelo WhatsApp ou pelo Airbnb: qual a diferença?",
      resposta: "<<A CONFIRMAR: há vantagem na reserva direta?>>",
    },
  ],
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   CtaFinal  (§5.10)
   ──────────────────────────────────────────────────────────────────────────── */

export const ctaFinal = {
  id: "reservar",
  titulo: "O pôr do sol de hoje ainda está livre?",
  apoio:
    `Mandem as datas no WhatsApp. ${anfitrioesPrimeiroNome} respondem e dizem se o loft está livre.` as Texto,
  cta: {
    label: "Chamar no WhatsApp",
    origem: "cta-final",
    ariaLabel: `Chamar o ${profile.nome} no WhatsApp para reservar ${NOVA_ABA}`,
  } satisfies CtaContent,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Footer  (§5.11)
   ──────────────────────────────────────────────────────────────────────────── */

export const footer = {
  monogramaAlt: `Monograma do ${profile.nome}`,
  nome: `${anfitrioesFormatado}, anfitriões` as Texto,
  /** Cidade/região é o dado que mais pesa em busca local. */
  cidade: cidadeUf as Texto,

  contatos: [
    ...(social.instagram
      ? [
          {
            label: "Instagram",
            valor: social.instagram.handle,
            href: social.instagram.url as string | null,
          },
        ]
      : []),
    ...(social.airbnb
      ? [
          {
            label: "Airbnb",
            valor: "Anúncio no Airbnb",
            href: airbnb("footer"),
          },
        ]
      : []),
  ],

  copyright: `© ${new Date().getFullYear()} ${profile.nome}. Todos os direitos reservados.`,
  /** Crédito de quem construiu. Combinar com a cliente antes de exibir. */
  credito: {
    prefixo: "Desenvolvido por:",
    autor: "<<A CONFIRMAR: crédito do desenvolvedor, combinar com a cliente>>",
    href: null as string | null,
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   StickyMobileCta  (§5.12)
   ──────────────────────────────────────────────────────────────────────────── */

export const stickyMobileCta = {
  label: "Ver datas no WhatsApp",
  origem: "sticky-mobile",
  ariaLabel: `Ver as datas disponíveis no WhatsApp ${NOVA_ABA}`,
} satisfies CtaContent;

/* ────────────────────────────────────────────────────────────────────────────
   SEO  (§7)
   ──────────────────────────────────────────────────────────────────────────── */

export const seo = {
  /** ≤ 60 caracteres. */
  title: `${profile.nome} · loft para casais em ${cidadeUf}`,
  /** 150–160 caracteres, com o benefício e a região. */
  description:
    "Piscina-praia, SUP e o pôr do sol na represa de Três Marias, MG. Loft pensado para casais, nota 5,0 no Google e no Airbnb. Reserve direto pelo WhatsApp." as Texto,
  ogImageAlt: `O pôr do sol sobre a represa visto do ${profile.nome}, loft para casais em ${cidadeUf}`,
  /** Página 404, no estilo da marca. */
  naoEncontrada: {
    titulo: "Esta página não existe.",
    texto: "O link pode estar quebrado ou a página pode ter mudado de lugar.",
    cta: "Voltar para o início",
  },
} as const;

export const content = {
  mensagensPorOrigem,
  header,
  hero,
  provaRapida,
  experiencia,
  galeria,
  oLoft,
  avaliacoes,
  comoReservar,
  localizacao,
  faq,
  ctaFinal,
  footer,
  stickyMobileCta,
  seo,
};
