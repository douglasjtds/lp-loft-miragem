/**
 * As quatro máscaras orgânicas — DESIGN-GUIDELINES.md §6.
 *
 * O manual usa formas irregulares e assimétricas nas amostras de cor. É esse DNA que
 * impede o layout de parecer template, e é por isso que foto NUNCA leva `border-radius`
 * nem círculo perfeito neste projeto.
 *
 * `clipPathUnits="objectBoundingBox"` mantém as coordenadas normalizadas em 0–1: a mesma
 * forma serve um retrato 4:5 e um corte 3:2 sem redesenhar path. Em compensação, a forma
 * "estica" junto com a caixa — por isso `a` e `b` nasceram pensadas em vertical (são as
 * duas que cobrem retrato de corpo inteiro, no herói e no Sobre) e têm a borda de cima
 * limpa: é onde está a cabeça.
 *
 * Este bloco é montado UMA vez, no layout. Os componentes só referenciam por id.
 */

export const ORGANIC_SHAPES = ["a", "b", "c", "d"] as const;
export type OrganicShape = (typeof ORGANIC_SHAPES)[number];

/** Referência CSS da máscara. Usada pelo OrganicImage e por blocos decorativos. */
export function organicClip(shape: OrganicShape): string {
  return `url(#organic-${shape})`;
}

/** Descrição de cada forma — alimenta o styleguide e documenta a intenção de cada uma. */
export const organicShapeNotes: Record<OrganicShape, string> = {
  a: "Cheia no ombro direito, afunilando para a base à esquerda, com um trecho quase reto à direita. A mais contida — é a do herói (4:5), onde o rosto pede sobra de área.",
  b: "Topo largo e contínuo, com duas elevações e um vale invertidos para a BASE. A mais gestual das quatro — é a do Sobre, onde o gesto precisa acontecer longe da cabeça.",
  c: "Mordida côncava no flanco esquerdo — a única com curvatura invertida.",
  d: "Cintura no flanco direito e um lobo avançando na base, como a onda de papel do manual.",
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
        {/* a — cheia no ombro direito, afunilando para a base à esquerda. Do lado
            direito a curva quase endireita: é essa reta parcial que tira a forma do
            registro de "retângulo arredondado". */}
        <clipPath id="organic-a" clipPathUnits="objectBoundingBox">
          <path
            d="M0.46 0.00
               C0.75 -0.01, 0.94 0.06, 0.97 0.22
               C0.995 0.40, 0.93 0.58, 0.86 0.72
               C0.80 0.90, 0.66 1.005, 0.44 1.00
               C0.26 0.995, 0.13 0.94, 0.10 0.80
               C0.07 0.68, 0.00 0.50, 0.05 0.34
               C0.09 0.16, 0.24 0.03, 0.46 0.00 Z"
          />
        </clipPath>

        {/* b — as duas elevações e o vale das ondas de papel do manual, mas na BASE.
            A borda de cima é um platô contínuo (y ≤ 0.02 entre x 0.38 e 0.98) porque
            esta é a máscara do Sobre, um retrato de corpo inteiro em 4:5: ali em cima
            está a cabeça de quem foi fotografado, e o `scale(1.12)` + `translateY(±3.5%)` do parallax
            ainda sobem a foto ~4% dentro do quadro. Gesto na borda de cima aqui não é
            estilo, é corte no cabelo. O gesto desceu para o vestido, onde não custa
            nada. Os pontos extremos (topo, flanco direito, fundo dos lobos, fundo do
            vale) têm alças horizontais/verticais: é o que impede vértice na virada. */}
        <clipPath id="organic-b" clipPathUnits="objectBoundingBox">
          <path
            d="M0.55 0.008
               C0.72 0.008, 0.98 0.20, 0.98 0.42
               C0.98 0.66, 0.85 0.962, 0.66 0.962
               C0.54 0.962, 0.46 0.885, 0.36 0.885
               C0.28 0.885, 0.24 0.928, 0.17 0.928
               C0.10 0.928, 0.05 0.70, 0.05 0.44
               C0.05 0.22, 0.34 0.008, 0.55 0.008 Z"
          />
        </clipPath>

        {/* c — mordida côncava no flanco esquerdo. A única das quatro com curvatura
            invertida; usar onde a forma precisa "abraçar" outro elemento. */}
        <clipPath id="organic-c" clipPathUnits="objectBoundingBox">
          <path
            d="M0.50 0.02
               C0.78 0.00, 0.95 0.10, 0.95 0.30
               C0.96 0.52, 0.90 0.72, 0.80 0.85
               C0.68 0.98, 0.52 1.00, 0.40 0.95
               C0.28 0.90, 0.40 0.78, 0.30 0.62
               C0.16 0.46, 0.03 0.48, 0.06 0.34
               C0.09 0.18, 0.28 0.04, 0.50 0.02 Z"
          />
        </clipPath>

        {/* d — cintura no flanco direito e um lobo que avança na base, como a onda de
            papel do manual. Traçado sem autointerseção: qualquer cruzamento abriria
            um furo na foto pela regra de preenchimento. */}
        <clipPath id="organic-d" clipPathUnits="objectBoundingBox">
          <path
            d="M0.20 0.12
               C0.36 0.00, 0.62 0.00, 0.74 0.10
               C0.88 0.20, 0.92 0.36, 0.88 0.50
               C0.84 0.64, 0.99 0.72, 0.96 0.84
               C0.93 0.95, 0.72 1.00, 0.50 0.98
               C0.28 0.96, 0.06 0.90, 0.04 0.70
               C0.02 0.48, 0.06 0.24, 0.20 0.12 Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
