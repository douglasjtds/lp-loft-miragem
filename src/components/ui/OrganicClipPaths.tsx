/**
 * As quatro máscaras de onda — DESIGN-GUIDELINES.md §6.
 *
 * A linguagem é a ONDA da logo: as linhas d'água do emblema são senoides regulares, de
 * amplitude baixa (no original, ~6px de amplitude para ~68px de período). Aqui ela vira a
 * borda de UM ou DOIS lados da foto, nunca dos quatro, e os lados restantes ficam retos,
 * com canto vivo. O contraste entre o reto (a cabana) e a onda (a água) é o desenho; é
 * também o que impede qualquer uma delas de ler como `border-radius`.
 *
 * `clipPathUnits="objectBoundingBox"` mantém as coordenadas em 0–1: a mesma forma serve um
 * retrato 4:5 e um corte 3:2. A amplitude é fração da caixa, então cresce com ela; os
 * valores foram escolhidos para a proporção da logo (amplitude/período ≈ 0,09) num retrato.
 *
 * Os paths são senoides convertidas em cúbicas: cada meia onda vai de um extremo ao outro
 * com alças horizontais de 0,3642 da meia onda (a aproximação clássica do cosseno). Alça
 * horizontal no extremo = nenhum vértice na virada. Para mudar cristas ou amplitude,
 * regere com a mesma fórmula; editar ponto a ponto quebra a regularidade, que é o traço
 * da marca.
 *
 * Este bloco é montado UMA vez, no layout. Os componentes só referenciam por id.
 */

export const ORGANIC_SHAPES = ["a", "b", "c", "d"] as const;
export type OrganicShape = (typeof ORGANIC_SHAPES)[number];

/** Referência CSS da máscara. Usada pelo OrganicImage e por blocos decorativos. */
export function organicClip(shape: OrganicShape): string {
  return `url(#organic-${shape})`;
}

/** Descrição de cada forma: alimenta o styleguide e documenta a intenção de cada uma. */
export const organicShapeNotes: Record<OrganicShape, string> = {
  a: "Borda inferior em onda, cinco cristas. A do herói: a foto termina na água.",
  b: "Borda superior em onda, três cristas longas. A da Experiência.",
  c: "Lateral esquerda em onda vertical, cinco cristas. O loft e Localização.",
  d: "Topo e base em ondas paralelas, amplitude mínima. Só a foto em destaque da galeria.",
};

export function OrganicClipPaths() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={0}
      height={0}
      className="absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        {/* a · borda inferior, 5 cristas, meia-amplitude 0.016 da altura. Herói: a foto
            "termina na água". Os dois cantos de baixo caem no ponto mais fundo da onda,
            então encontram a lateral reta sem degrau. */}
        <clipPath id="organic-a" clipPathUnits="objectBoundingBox">
          <path
            d="M0 0
               H1
               V1
               C0.9636 1, 0.9364 0.968, 0.9 0.968
               C0.8636 0.968, 0.8364 1, 0.8 1
               C0.7636 1, 0.7364 0.968, 0.7 0.968
               C0.6636 0.968, 0.6364 1, 0.6 1
               C0.5636 1, 0.5364 0.968, 0.5 0.968
               C0.4636 0.968, 0.4364 1, 0.4 1
               C0.3636 1, 0.3364 0.968, 0.3 0.968
               C0.2636 0.968, 0.2364 1, 0.2 1
               C0.1636 1, 0.1364 0.968, 0.1 0.968
               C0.0636 0.968, 0.0364 1, 0 1
               Z"
          />
        </clipPath>

        {/* b · borda superior, 3 cristas (comprimento de onda 5/3 do das outras: as
            "cristas longas"), meia-amplitude 0.024. Experiência. */}
        <clipPath id="organic-b" clipPathUnits="objectBoundingBox">
          <path
            d="M0 0
               C0.0607 0, 0.106 0.048, 0.1667 0.048
               C0.2274 0.048, 0.2726 0, 0.3333 0
               C0.394 0, 0.4393 0.048, 0.5 0.048
               C0.5607 0.048, 0.606 0, 0.6667 0
               C0.7274 0, 0.7726 0.048, 0.8333 0.048
               C0.894 0.048, 0.9393 0, 1 0
               V1
               H0
               Z"
          />
        </clipPath>

        {/* c · lateral esquerda, 5 cristas na vertical, meia-amplitude 0.022 da LARGURA.
            O loft / Localização. A onda corre ao longo da foto, como a margem da represa. */}
        <clipPath id="organic-c" clipPathUnits="objectBoundingBox">
          <path
            d="M1 0
               V1
               H0
               C0 0.9636, 0.044 0.9364, 0.044 0.9
               C0.044 0.8636, 0 0.8364, 0 0.8
               C0 0.7636, 0.044 0.7364, 0.044 0.7
               C0.044 0.6636, 0 0.6364, 0 0.6
               C0 0.5636, 0.044 0.5364, 0.044 0.5
               C0.044 0.4636, 0 0.4364, 0 0.4
               C0 0.3636, 0.044 0.3364, 0.044 0.3
               C0.044 0.2636, 0 0.2364, 0 0.2
               C0 0.1636, 0.044 0.1364, 0.044 0.1
               C0.044 0.0636, 0 0.0364, 0 0
               Z"
          />
        </clipPath>

        {/* d · topo e base em onda PARALELA (mesma fase), 5 cristas, meia-amplitude 0.008.
            Destaque da galeria. Paralelas como as linhas d’água do emblema: espelhadas,
            a faixa estrangularia e viraria ampulheta. */}
        <clipPath id="organic-d" clipPathUnits="objectBoundingBox">
          <path
            d="M0 0
               C0.0364 0, 0.0636 0.016, 0.1 0.016
               C0.1364 0.016, 0.1636 0, 0.2 0
               C0.2364 0, 0.2636 0.016, 0.3 0.016
               C0.3364 0.016, 0.3636 0, 0.4 0
               C0.4364 0, 0.4636 0.016, 0.5 0.016
               C0.5364 0.016, 0.5636 0, 0.6 0
               C0.6364 0, 0.6636 0.016, 0.7 0.016
               C0.7364 0.016, 0.7636 0, 0.8 0
               C0.8364 0, 0.8636 0.016, 0.9 0.016
               C0.9364 0.016, 0.9636 0, 1 0
               V0.984
               C0.9636 0.984, 0.9364 1, 0.9 1
               C0.8636 1, 0.8364 0.984, 0.8 0.984
               C0.7636 0.984, 0.7364 1, 0.7 1
               C0.6636 1, 0.6364 0.984, 0.6 0.984
               C0.5636 0.984, 0.5364 1, 0.5 1
               C0.4636 1, 0.4364 0.984, 0.4 0.984
               C0.3636 0.984, 0.3364 1, 0.3 1
               C0.2636 1, 0.2364 0.984, 0.2 0.984
               C0.1636 0.984, 0.1364 1, 0.1 1
               C0.0636 1, 0.0364 0.984, 0 0.984
               Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
