/**
 * Os ícones-assinatura da marca — DESIGN-GUIDELINES.md §5.
 *
 * A logo não tem ícones próprios além do emblema (sol + ondas no círculo). Estes quatro
 * são DERIVADOS dele, com o mesmo traço: stroke arredondado e peso proporcional ao
 * contorno da logo (8px num emblema de 272px ≈ 3% → `strokeWidth` 3 no viewBox de 96).
 * As ondas são a mesma senoide de amplitude baixa das máscaras (`OrganicClipPaths.tsx`).
 *
 * Aparecem grandes na Experiência (manhã, tarde, noite) e se desenham sozinhos na
 * animação-assinatura (Fase 7). `onda` é o grafismo de transição entre seções. Não são
 * ícones de interface: chevron, seta e WhatsApp são Lucide e nunca dividem bloco visual
 * com estes, e estes nunca viram bullet de lista.
 *
 * ## Regras que qualquer ajuste precisa manter
 *
 * 1. `stroke`, nunca `fill`. Forma preenchida não tem traçado para desenhar, e a
 *    animação-assinatura simplesmente não acontece.
 * 2. Um path por gesto. A ordem do array é a ordem em que o traço é desenhado.
 * 3. viewBox quadrado e igual para todos, para o mesmo peso óptico lado a lado.
 *
 * Os mesmos traçados existem em `public/brand/icone-*.svg`, para uso fora do React
 * (og-image, materiais da cliente). A fonte de verdade é ESTE arquivo, porque o SVG
 * precisa estar inline no DOM para ser animável. Mudou aqui, mude lá.
 */

/** A ordem da Experiência é manhã, tarde, noite; `onda` fica fora da coreografia. */
export const BRAND_ICON_NAMES = [
  "sol-nascente",
  "prancha",
  "lua-agua",
  "onda",
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
  "sol-nascente": {
    viewBox: "0 0 96 96",
    paths: [
      // linha d’água
      "M12 62 H84",
      // o sol nascendo
      "M26 62 A22 22 0 0 1 70 62",
      // reflexo
      "M34 73 H62",
      // reflexo, mais curto
      "M42 83 H54",
    ],
    label: "Sol nascendo sobre a represa",
  },
  prancha: {
    viewBox: "0 0 96 96",
    paths: [
      // a prancha, do bico à rabeta
      "M48 6 C54 6, 58 18, 58 32 V54 C58 60, 55 64, 48 64 C41 64, 38 60, 38 54 V32 C38 18, 42 6, 48 6 Z",
      // a água na base
      "M14 74 C20.19 74, 24.81 80, 31 80 C37.19 80, 41.81 74, 48 74 C54.19 74, 58.81 80, 65 80 C71.19 80, 75.81 74, 82 74",
    ],
    label: "Prancha de SUP em pé na beira da represa",
  },
  "lua-agua": {
    viewBox: "0 0 96 96",
    paths: [
      // a lua crescente
      "M56 14 A22 22 0 1 0 74 44 A17 17 0 0 1 56 14 Z",
      // primeira onda
      "M16 67 C21.83 67, 26.17 73, 32 73 C37.83 73, 42.17 67, 48 67 C53.83 67, 58.17 73, 64 73 C69.83 73, 74.17 67, 80 67",
      // segunda onda, mais curta
      "M32 79.5 C37.83 79.5, 42.17 84.5, 48 84.5 C53.83 84.5, 58.17 79.5, 64 79.5",
    ],
    label: "Lua crescente sobre a água",
  },
  onda: {
    viewBox: "0 0 96 96",
    paths: [
      // cinco cristas
      "M8 44.8 C10.91 44.8, 13.09 51.2, 16 51.2 C18.91 51.2, 21.09 44.8, 24 44.8 C26.91 44.8, 29.09 51.2, 32 51.2 C34.91 51.2, 37.09 44.8, 40 44.8 C42.91 44.8, 45.09 51.2, 48 51.2 C50.91 51.2, 53.09 44.8, 56 44.8 C58.91 44.8, 61.09 51.2, 64 51.2 C66.91 51.2, 69.09 44.8, 72 44.8 C74.91 44.8, 77.09 51.2, 80 51.2 C82.91 51.2, 85.09 44.8, 88 44.8",
    ],
    label: "Onda",
  },
};
