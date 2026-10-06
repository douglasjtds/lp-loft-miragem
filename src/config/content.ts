/**
 * Toda a copy da página, tipada.
 *
 * Fronteira white-label: junto com `brand.ts` e a pasta `public/`, este arquivo
 * concentra 100% do que é específico da cliente. Nenhum componente contém texto
 * hardcoded — trocar estes dois arquivos deve produzir a landing de outra pessoa sem
 * tocar em componente algum.
 *
 * ## Como preencher
 *
 * Regra inviolável: **nada aqui é inventado**. Onde a informação depende da cliente
 * (registro profissional, cidade, prazos, preço, formação, depoimentos, número de
 * atendimentos), o texto traz o marcador `<<A CONFIRMAR: ...>>`, que fica VISÍVEL na
 * página até o dado real chegar. Um prazo inventado destrói a credibilidade que a
 * página inteira existe para construir, e um depoimento inventado é fraude.
 *
 * Voz: clara, direta, calorosa, adulta, segunda pessoa. O teste de cada frase é uma
 * pergunta só — **se ela caberia no site de qualquer concorrente, está errada.** Frase
 * que passa nesse teste é sempre específica: cita a situação real, o prazo real, a
 * objeção real. Frase que não passa é sempre superlativo ou promessa.
 *
 * Os campos abaixo trazem, em comentário, o *job* de cada um. Escreva o que der para
 * escrever a partir do material da cliente; marque o resto.
 *
 * ## Notação de texto
 *
 * As strings aceitam três marcações, interpretadas por `ui/Pendencia`:
 * `<<A CONFIRMAR: ...>>`, `**negrito**`, `_itálico_` e `\n` para quebra dentro do mesmo
 * parágrafo. `\n\n` separa parágrafos apenas onde o componente que renderiza o bloco
 * sabe disso (ver `sections/Faq.tsx`).
 */

import { anfitrioesFormatado, cidadeUf, profile, social } from "@/config/brand";
import type { BrandIconName } from "@/config/brand-icons";
import type { OrganicShape } from "@/components/ui/OrganicClipPaths";
import type { CtaOrigem } from "@/lib/whatsapp";

/**
 * Um texto que pode conter marcadores de pendência (`<<A CONFIRMAR: ...>>`) e ênfase
 * (`**negrito**`, `_itálico_`) no meio da frase.
 */
type Texto = string;

/** Rótulo de um CTA + a origem que define a mensagem pré-preenchida. */
export type CtaContent = {
  label: string;
  origem: CtaOrigem;
  /** Rótulo acessível: o leitor de tela precisa saber que o link sai do site. */
  ariaLabel: string;
};

/** Foto de conteúdo: `alt` real e descritivo é requisito de acessibilidade. */
export type Foto = {
  src: string;
  alt: string;
  shape: OrganicShape;
  /**
   * Enquadramento. Muda a proporção da caixa e o ponto focal do corte — retrato quando
   * o assunto é a pessoa, paisagem quando o assunto é a cena.
   */
  orientacao?: "retrato" | "paisagem";
  /** Ajuste fino do corte, ex. "50% 30%" para manter o rosto no terço superior. */
  objectPosition?: string;
};

/* ────────────────────────────────────────────────────────────────────────────
   CTA — as mensagens pré-preenchidas do WhatsApp

   O único rastreamento de origem que existe sem backend: cada CTA manda uma
   mensagem levemente diferente, e a mensagem que chega no celular da cliente já
   diz de qual ponto da página a pessoa saiu.

   Escreva na voz de QUEM VISITA, não na da cliente — é a pessoa quem envia. E
   mantenha as cinco distinguíveis: mensagens quase iguais não rastreiam nada.
   ──────────────────────────────────────────────────────────────────────────── */

export const mensagensPorOrigem: Record<CtaOrigem, string> = {
  hero: "<<A CONFIRMAR: mensagem do CTA do herói — a pessoa acabou de chegar>>",
  header: "<<A CONFIRMAR: mensagem do CTA do header>>",
  "como-funciona":
    "<<A CONFIRMAR: mensagem de quem leu a sequência de atendimento e decidiu>>",
  "cta-final": "<<A CONFIRMAR: mensagem de quem leu a página inteira>>",
  "sticky-mobile":
    "<<A CONFIRMAR: mensagem da barra fixa do mobile — costuma ser a mais aberta>>",
};

/* ────────────────────────────────────────────────────────────────────────────
   Header
   ──────────────────────────────────────────────────────────────────────────── */

export const header = {
  /** Sem menu hambúrguer: a página é curta e o CTA vale mais que a navegação. */
  ancoras: [
    { label: "Método", href: "#metodo" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Sobre", href: "#sobre" },
    { label: "Dúvidas", href: "#duvidas" },
  ],
  cta: {
    label: "<<A CONFIRMAR: rótulo curto do CTA do header, 1-2 palavras>>",
    origem: "header",
    ariaLabel: "<<A CONFIRMAR: rótulo acessível do CTA>>",
  } satisfies CtaContent,
  monogramaAlt: `Monograma de ${profile.nome}`,
  navLabel: "Navegação principal",
  inicioLabel: "Ir para o início da página",
  /** Primeiro elemento focável da página: pula o header para quem navega por teclado. */
  pularParaConteudo: "Pular para o conteúdo",
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Hero  ⭐
   ──────────────────────────────────────────────────────────────────────────── */

export const hero = {
  /** Âncora do topo (monograma do header) e alvo do observer do StickyMobileCta. */
  id: "inicio",

  /** landing-page-structure.md §5.1. Conta como o 1º eyebrow da regra "1 a cada 3". */
  eyebrow: `${profile.cidade} · ${profile.uf} · loft para casais` as Texto,

  /**
   * O ÚNICO h1 da página. Quebrado em linhas com controle manual — a Fase 7 anima
   * linha a linha, em stagger.
   *
   * O melhor h1 quase nunca é inventado: é a frase que a cliente já usa para se
   * descrever (bio do Instagram, manual da marca, a primeira coisa que ela fala
   * quando alguém pergunta o que ela faz). Comece procurando essa frase.
   */
  h1: [
    "<<A CONFIRMAR: primeira linha do h1>>",
    "<<A CONFIRMAR: segunda linha do h1>>",
  ] as const,

  /**
   * Uma frase. O job é responder "e daí?" ao h1, com uma promessa concreta e sem
   * prometer resultado. Específico bate genérico sempre.
   */
  subtitulo: "<<A CONFIRMAR: subtítulo do herói, uma frase concreta>>",

  cta: {
    label:
      "<<A CONFIRMAR: rótulo do CTA — diga exatamente o que acontece ao clicar>>",
    origem: "hero",
    ariaLabel: "<<A CONFIRMAR: rótulo acessível do CTA>>",
  } satisfies CtaContent,

  /** Reduz atrito e alimenta busca local. Os dois dados vêm de brand.ts. */
  disponibilidade: cidadeUf as Texto,

  /**
   * A melhor foto do conjunto: fundo limpo, contexto de trabalho, olhando para a
   * câmera. É a candidata a LCP — `priority` e recorte vertical, rosto no terço
   * superior.
   */
  foto: {
    src: "/images/retrato-hero.jpg",
    alt: "<<A CONFIRMAR: descrição real da foto do herói>>",
    shape: "a",
    orientacao: "retrato",
    objectPosition: "50% 30%",
  } satisfies Foto,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   ProvaRapida
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Faixa fina de provas objetivas, sem ícone decorativo.
 *
 * `exibir: false` até que os itens sejam dados CONFIRMADOS. Uma faixa de
 * credibilidade feita de marcadores produz o efeito oposto do pretendido — e um
 * número de atendimentos inventado é o tipo de mentira que a página não sobrevive.
 * Se não houver dado, a seção não existe.
 */
export const provaRapida: {
  exibir: boolean;
  itens: readonly Texto[];
} = {
  exibir: false,
  itens: [
    "<<A CONFIRMAR: formação — o texto exato que ela quer exibir>>",
    "<<A CONFIRMAR: tempo de atuação ou volume de atendimento, se ela quiser exibir>>",
    "<<A CONFIRMAR: modalidade de atendimento>>",
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
   ParaQuem
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * A seção que mais reduz rejeição: o job é a pessoa se RECONHECER.
 *
 * Escreva na voz de quem visita, descrevendo a situação dela — não na voz da
 * profissional descrevendo o serviço. Três ou quatro perfis, em layout escalonado,
 * sem ícone genérico ao lado de cada item.
 *
 * O `titulo` de cada perfil é a situação ("Você já tentou X e não sustentou"); o
 * `texto` é o diagnóstico do porquê, que é onde a expertise aparece.
 */
export const paraQuem = {
  id: "para-quem",
  eyebrow: "Para quem é",
  titulo: "<<A CONFIRMAR: título da seção, na voz de quem visita>>",
  perfis: [
    {
      titulo: "<<A CONFIRMAR: situação 1, como a pessoa a descreveria>>",
      texto: "<<A CONFIRMAR: por que isso acontece — o diagnóstico>>",
    },
    {
      titulo: "<<A CONFIRMAR: situação 2>>",
      texto: "<<A CONFIRMAR: o diagnóstico>>",
    },
    {
      titulo: "<<A CONFIRMAR: situação 3>>",
      texto: "<<A CONFIRMAR: o diagnóstico>>",
    },
  ],
  fechamento: "<<A CONFIRMAR: uma frase que costure os perfis à consulta>>",
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Metodo  ⭐⭐ seção-assinatura
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Traduz o conceito central da marca em algo visível. É onde os ícones proprietários
 * aparecem grandes e se desenham (Fase 7), e é o único momento coreografado da página.
 *
 * Os pilares saem do manual de identidade, não da sua imaginação: quase todo manual
 * tem um conceito de três partes, e é ele que vira esta seção. Se a marca não tiver
 * um, esta seção vira "a abordagem" em prosa e os ícones somem — o que é melhor do que
 * inventar um método que a cliente não pratica.
 *
 * Nem todo pilar leva foto, de propósito: a lacuna é o que impede a seção de recair no
 * ritmo de grade de 3 colunas com ícone, que é o clichê nº 1 do checklist anti-template.
 */
export const metodo = {
  id: "metodo",
  eyebrow: "O método",
  titulo: "<<A CONFIRMAR: título que nomeie o conceito da marca>>",
  intro: "<<A CONFIRMAR: um parágrafo ligando os pilares entre si>>",

  pilares: [
    {
      icone: "sol-nascente" satisfies BrandIconName,
      titulo: "<<A CONFIRMAR: nome do primeiro pilar>>",
      subtitulo: "<<A CONFIRMAR: uma linha dizendo o que este pilar cuida>>",
      texto: "<<A CONFIRMAR: o que acontece na prática dentro deste pilar>>",
      /** Retrato: o assunto é a pessoa. */
      foto: {
        src: "/images/pilar-um.jpg",
        alt: "<<A CONFIRMAR: descrição real da foto>>",
        shape: "c",
        orientacao: "retrato",
        objectPosition: "50% 40%",
      } satisfies Foto,
    },
    {
      icone: "prancha" satisfies BrandIconName,
      titulo: "<<A CONFIRMAR: nome do segundo pilar>>",
      subtitulo: "<<A CONFIRMAR: uma linha>>",
      texto: "<<A CONFIRMAR: o que acontece na prática>>",
      /** Sem foto de propósito — ver o cabeçalho desta seção. */
      foto: null,
    },
    {
      icone: "lua-agua" satisfies BrandIconName,
      titulo: "<<A CONFIRMAR: nome do terceiro pilar>>",
      subtitulo: "<<A CONFIRMAR: uma linha>>",
      texto: "<<A CONFIRMAR: o que acontece na prática>>",
      /** Paisagem: aqui o assunto é a cena, não a pessoa. */
      foto: {
        src: "/images/pilar-tres.jpg",
        alt: "<<A CONFIRMAR: descrição real da foto>>",
        shape: "d",
        orientacao: "paisagem",
        objectPosition: "50% 55%",
      } satisfies Foto,
    },
  ],
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   ComoFunciona
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * O job é eliminar a incerteza de "o que acontece se eu mandar essa mensagem?".
 *
 * Prazos, durações e o que está incluso são exatamente os dados que não podem ser
 * inventados — são promessa contratual. Marque e pergunte.
 */
export const comoFunciona = {
  id: "como-funciona",
  eyebrow: "Como funciona",
  titulo: "<<A CONFIRMAR: título — o que acontece depois do primeiro contato>>",
  intro: "<<A CONFIRMAR: uma frase apresentando a sequência>>",

  /**
   * ÚNICO lugar da página onde a numeração 01/02/03 é permitida, porque o conteúdo é
   * de fato uma sequência. Em qualquer outra seção ela é decoração e vira clichê.
   */
  etapas: [
    {
      numero: "01",
      titulo: "Primeiro contato",
      paragrafos: [
        "<<A CONFIRMAR: o que acontece quando a pessoa manda a mensagem>>",
      ] as readonly Texto[],
    },
    {
      numero: "02",
      titulo: "<<A CONFIRMAR: nome da segunda etapa>>",
      paragrafos: [
        "<<A CONFIRMAR: o que acontece nesta etapa>>",
        "<<A CONFIRMAR: duração — dado da cliente, nunca estimado>>",
      ] as readonly Texto[],
    },
    {
      numero: "03",
      titulo: "<<A CONFIRMAR: nome da terceira etapa — a entrega>>",
      paragrafos: [
        "<<A CONFIRMAR: o que a pessoa recebe>>",
        "<<A CONFIRMAR: prazo de entrega — dado da cliente>>",
      ] as readonly Texto[],
    },
    {
      numero: "04",
      titulo: "<<A CONFIRMAR: nome da quarta etapa — o acompanhamento>>",
      paragrafos: [
        "<<A CONFIRMAR: como e quando acontece o retorno>>",
      ] as readonly Texto[],
    },
  ],

  /**
   * Foto opcional de procedimento — o atendimento acontecendo. Abre a seção em vez de
   * morar dentro de uma etapa, porque descreve a sequência inteira. Use `null` se não
   * houver foto de procedimento no material da cliente; foto de banco aqui destrói a
   * única coisa que a seção tem a oferecer, que é ser real.
   */
  foto: {
    src: "/images/atendimento.jpg",
    alt: "<<A CONFIRMAR: descrição real da foto de atendimento>>",
    shape: "a",
    orientacao: "paisagem",
  } as Foto | null,

  cta: {
    label: "<<A CONFIRMAR: rótulo do CTA desta seção>>",
    origem: "como-funciona",
    ariaLabel: "<<A CONFIRMAR: rótulo acessível do CTA>>",
  } satisfies CtaContent,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Sobre
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * O job é humanizar: é aqui que a proximidade tem que ser SENTIDA, não afirmada.
 *
 * Os parágrafos em primeira pessoa dependem inteiramente da história dela. Inventar
 * trajetória, motivação ou tempo de atuação é fabricar credencial — a mesma classe de
 * erro que inventar depoimento. O esqueleto está pronto; o conteúdo vem da cliente,
 * de preferência gravado em áudio e transcrito, que é como a voz dela sobrevive.
 */
export const sobre = {
  id: "sobre",
  eyebrow: "Sobre",
  titulo: "<<A CONFIRMAR: título da seção>>",

  paragrafos: [
    "<<A CONFIRMAR: quem ela é e há quanto tempo atua, em primeira pessoa>>",
    "<<A CONFIRMAR: o que ela percebeu na prática que mudou o jeito dela atender>>",
    "<<A CONFIRMAR: no que ela acredita — o parágrafo que justifica o método>>",
  ] as readonly Texto[],

  /** Seção removida na Fase 5 (DESIGN-GUIDELINES §0). */
  credenciais: [
    "<<A CONFIRMAR: graduação — instituição e ano>>",
    "<<A CONFIRMAR: especializações que ela quer exibir>>",
  ] as readonly Texto[],

  foto: {
    src: "/images/retrato-sobre.jpg",
    alt: "<<A CONFIRMAR: descrição real da foto>>",
    /** clipPath obrigatoriamente diferente do herói. */
    shape: "b",
    orientacao: "retrato",
  } satisfies Foto,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Depoimentos
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * `exibir: false` e lista vazia é o estado inicial CORRETO, não um pendente qualquer:
 * se não houver depoimento real e autorizado, a seção não existe.
 *
 * Depoimento inventado é fraude e destrói exatamente a percepção de seriedade que a
 * página inteira tenta construir. Para ligar: preencher `itens` com depoimentos reais,
 * com autorização por escrito, nome + inicial do sobrenome, e virar `exibir` para true.
 *
 * Em profissões de saúde, atenção redobrada: vários códigos de ética restringem
 * publicidade com resultado de paciente, e "antes e depois" costuma ser proibido.
 */
export const depoimentos: {
  exibir: boolean;
  eyebrow: string;
  titulo: string;
  itens: readonly { texto: string; autora: string }[];
  pendencia: string;
} = {
  exibir: false,
  eyebrow: "<<A CONFIRMAR: eyebrow da seção>>",
  titulo: "<<A CONFIRMAR: título da seção>>",
  itens: [],
  pendencia:
    "<<A CONFIRMAR: 2 ou 3 depoimentos reais, com autorização por escrito, nome e inicial do sobrenome>>",
};

/* ────────────────────────────────────────────────────────────────────────────
   Faq
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Espelha exatamente o JSON-LD FAQPage — as duas fontes não podem divergir.
 *
 * Cinco a sete perguntas, respostas em prosa real de 2 a 4 frases. Além de reduzir
 * atrito, é a seção que mais rende cauda longa em busca, porque as perguntas são
 * literalmente o que as pessoas digitam.
 *
 * As perguntas abaixo são o esqueleto que serve quase toda profissão de serviço; troque
 * pelas objeções reais que a cliente já ouve todo dia — ela sabe quais são de cor.
 */
export const faq = {
  id: "duvidas",
  eyebrow: "Dúvidas",
  titulo: "<<A CONFIRMAR: título da seção, na voz dela>>",

  perguntas: [
    {
      pergunta: "Você atende online?",
      resposta:
        "<<A CONFIRMAR: modalidades e, se houver, endereço do consultório>>",
    },
    {
      pergunta:
        "<<A CONFIRMAR: pergunta sobre convênio, plano ou forma de pagamento>>",
      resposta: "<<A CONFIRMAR: resposta>>",
    },
    {
      pergunta: "Quanto custa?",
      resposta:
        "<<A CONFIRMAR: exibir preço ou não é decisão da cliente — e a resposta muda conforme a decisão>>",
    },
    {
      pergunta: "<<A CONFIRMAR: a pergunta sobre prazo de resultado>>",
      resposta:
        "<<A CONFIRMAR: resposta SEM prometer prazo de resultado — risco ético e regulatório>>",
    },
    {
      pergunta: "<<A CONFIRMAR: o que a pessoa precisa levar ou preparar>>",
      resposta: "<<A CONFIRMAR: resposta>>",
    },
    {
      pergunta: "Como funciona o retorno?",
      resposta: "<<A CONFIRMAR: frequência e o que acontece no retorno>>",
    },
  ],
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   CtaFinal
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * A faixa mais escura e mais densa da página, fechando o arco que começou no fundo
 * claro. O título nomeia a objeção que sobrou depois de tudo — quase sempre "dar o
 * primeiro passo", não "o serviço".
 */
export const ctaFinal = {
  id: "agendar",
  titulo: "<<A CONFIRMAR: título que nomeie a última objeção>>",
  apoio:
    "<<A CONFIRMAR: uma linha dizendo o que acontece quando a pessoa escreve>>",
  cta: {
    label: "<<A CONFIRMAR: rótulo do CTA final>>",
    origem: "cta-final",
    ariaLabel: "<<A CONFIRMAR: rótulo acessível do CTA>>",
  } satisfies CtaContent,
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   Footer
   ──────────────────────────────────────────────────────────────────────────── */

export const footer = {
  monogramaAlt: `Monograma de ${profile.nome}`,
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
            href: `${social.airbnb.url}?src=footer` as string | null,
          },
        ]
      : []),
  ],

  copyright: `© ${new Date().getFullYear()} ${profile.nome}. Todos os direitos reservados.`,
  /**
   * Crédito de quem construiu. Combine com a cliente antes de exibir — e preencha
   * com os SEUS dados, não com os de quem escreveu este template.
   */
  credito: {
    prefixo: "Desenvolvido por:",
    autor: "<<A CONFIRMAR: seu nome ou o do estúdio>>",
    href: null as string | null,
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────────
   StickyMobileCta
   ──────────────────────────────────────────────────────────────────────────── */

export const stickyMobileCta = {
  label: "<<A CONFIRMAR: rótulo curto da barra fixa do mobile>>",
  origem: "sticky-mobile",
  ariaLabel: "<<A CONFIRMAR: rótulo acessível do CTA>>",
} satisfies CtaContent;

/* ────────────────────────────────────────────────────────────────────────────
   SEO
   ──────────────────────────────────────────────────────────────────────────── */

export const seo = {
  /** ≤ 60 caracteres (landing-page-structure.md §7). */
  title: `${profile.nome} · loft para casais em ${cidadeUf}`,
  /** 150–160 caracteres, com o benefício e a região. */
  description:
    "<<A CONFIRMAR: descrição de 150-160 caracteres, com benefício e região>>" as Texto,
  ogImageAlt: `${profile.nome}, loft para casais em ${cidadeUf}`,
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
  paraQuem,
  metodo,
  comoFunciona,
  sobre,
  depoimentos,
  faq,
  ctaFinal,
  footer,
  stickyMobileCta,
  seo,
};
