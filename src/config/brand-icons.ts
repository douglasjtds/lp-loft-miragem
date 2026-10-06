/**
 * Os ícones-assinatura da marca.
 *
 * São os ativos proprietários que aparecem em tamanho grande na seção Método e que se
 * desenham sozinhos na animação-assinatura (Fase 7). Não são ícones de interface —
 * chevron, seta e o ícone do WhatsApp são Lucide e nunca dividem bloco visual com estes.
 *
 * ## De onde eles vêm
 *
 * Do manual de identidade da cliente, quase sempre em PNG ou dentro de um PDF. O
 * trabalho da Fase 3 é traçá-los seguindo a **linha de centro** de cada gesto: o
 * original costuma ser forma preenchida com espessura variável, e aqui vira traço de
 * espessura constante, porque é isso que o `createDrawable` do anime.js sabe animar.
 * O que se perde na tradução é o afinamento das pontas; o gesto e a proporção são fiéis.
 *
 * Se a marca não tiver ícones próprios, **não invente um trio genérico** — a seção
 * Método funciona sem eles (ver `references/catalogo-de-secoes.md`), e ícone de banco
 * ao lado de cada pilar é exatamente o clichê que o checklist anti-template proíbe.
 *
 * ## Regras que qualquer substituição precisa manter
 *
 * 1. `stroke`, nunca `fill`. Forma preenchida não tem traçado para desenhar, e a
 *    animação-assinatura simplesmente não acontece.
 * 2. Um path por gesto contínuo. A ordem do array é a ordem em que o traço é desenhado.
 * 3. viewBox quadrado e igual para todos, para que tenham o mesmo peso óptico lado a lado.
 *
 * Os mesmos traçados devem existir em `public/brand/icone-*.svg`, para uso fora do React
 * (og-image, e-mail, materiais da cliente). A fonte de verdade da página é ESTE arquivo,
 * porque o SVG precisa estar inline no DOM para ser animável.
 *
 * ## Como preencher
 *
 * Os nomes são os pilares do método da cliente, em kebab-case. O exemplo abaixo usa
 * três, que é o número mais comum, mas dois ou quatro funcionam igual — quem manda é
 * `metodo.pilares` em `content.ts`, e a ordem da coreografia sai de lá.
 */

/**
 * Os nomes dos ícones. Precisam bater com `pilar.icone` de cada pilar em `content.ts`.
 * Trocar esta lista é o que troca a coreografia inteira.
 */
export const BRAND_ICON_NAMES = [
  "pilar-um",
  "pilar-dois",
  "pilar-tres",
] as const;

export type BrandIconName = (typeof BRAND_ICON_NAMES)[number];

export type BrandIconDefinition = {
  /** Quadrado, e o mesmo para todos os ícones do conjunto. */
  viewBox: string;
  /** Ordem dos paths = ordem em que a Fase 7 desenha os traços. */
  paths: string[];
  /** Rótulo acessível para quando o ícone for informativo (não decorativo). */
  label: string;
};

export const brandIcons: Record<BrandIconName, BrandIconDefinition> = {
  /*
   * SUBSTITUIR pelos traçados reais da marca.
   *
   * Os paths abaixo são marcadores de posição geométricos: servem para o projeto
   * compilar e para o /styleguide renderizar, e nada mais. Uma landing publicada com
   * eles está exibindo três formas sem significado nenhum no lugar do ativo mais
   * proprietário da página inteira.
   */
  "pilar-um": {
    viewBox: "0 0 96 96",
    paths: ["M16 68 C32 68, 32 28, 48 28 C64 28, 64 68, 80 68"],
    label: "<<A CONFIRMAR: nome do primeiro pilar>>",
  },
  "pilar-dois": {
    viewBox: "0 0 96 96",
    paths: [
      "M48 12 C68 12, 84 28, 84 48 C84 68, 68 84, 48 84 C28 84, 12 68, 12 48 C12 28, 28 12, 48 12",
    ],
    label: "<<A CONFIRMAR: nome do segundo pilar>>",
  },
  "pilar-tres": {
    viewBox: "0 0 96 96",
    paths: [
      "M48 84 C48 60, 36 40, 20 32",
      "M48 84 C48 60, 60 40, 76 32",
      "M48 84 L48 36",
    ],
    label: "<<A CONFIRMAR: nome do terceiro pilar>>",
  },
};
