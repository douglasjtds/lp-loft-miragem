import Image from "next/image";

import {
  organicClip,
  type OrganicShape,
} from "@/components/ui/OrganicClipPaths";
import { cn } from "@/lib/cn";

/**
 * Foto mascarada por forma orgânica — DESIGN-GUIDELINES.md §6.
 *
 * A pessoa retratada nunca aparece como recorte flutuante e nenhuma foto leva `border-radius`:
 * a única forma permitida é o clipPath. Cada foto da página usa uma `shape` diferente
 * (o herói e o Sobre nunca repetem a mesma).
 *
 * A proporção NÃO é fixada aqui — vem por `className` (ex.: `aspect-[4/5]`), porque
 * é decisão de seção. O componente só garante que a imagem cobre a caixa e é recortada.
 *
 * O parallax (§8) move a `<Image>` INTERNA, nunca este wrapper: o wrapper carrega o
 * `clipPath`, e deslocá-lo arrastaria a máscara junto — a forma orgânica é estrutura,
 * não enfeite, e precisa ficar parada. Movendo só a imagem, a máscara vira uma janela
 * e o assunto desliza por trás dela. Quem paga por isso é o `scale` do keyframe, que
 * dá a folga necessária para o deslocamento não descobrir a borda do recorte.
 *
 * Por isso os DOIS elementos entram no parallax, com papéis diferentes: o wrapper
 * PUBLICA a timeline (`view-timeline-name`) e a imagem a CONSOME. Um
 * `animation-timeline: view()` direto na imagem não funciona aqui — o
 * `overflow-hidden` faz deste wrapper um scroll container, a imagem o preenche
 * exatamente e nunca se move em relação a ele, então o progresso congela em 50% e a
 * foto fica parada (com a escala aplicada, o que faz parecer que "só não animou").
 * A timeline tem que nascer de um elemento que de fato atravessa a viewport.
 */

type OrganicImageProps = {
  src: string;
  /** Texto alternativo real. Foto de conteúdo nunca leva alt vazio. */
  alt: string;
  shape: OrganicShape;
  /** Só a foto do herói: ela é o LCP. */
  priority?: boolean;
  sizes: string;
  /** Proporção e largura da caixa. */
  className?: string;
  /** Ajusta o enquadramento dentro do corte (ex.: "center 30%" para manter o rosto). */
  objectPosition?: string;
  /**
   * Liga a deriva ligada ao scroll (§8). É CSS puro atrás de um `@supports`: onde
   * `animation-timeline` não existe, a prop não produz efeito nenhum e a foto fica
   * parada. Nenhum JS, nenhum estado inicial escondido.
   */
  parallax?: boolean;
  /**
   * Endereço para os componentes de motion (DESIGN-GUIDELINES.md §8). Marcador de DOM
   * puro: nenhum estilo, nenhuma mudança de render, inerte sem JS.
   */
  "data-anim"?: string;
};

export function OrganicImage({
  src,
  alt,
  shape,
  priority = false,
  sizes,
  className,
  objectPosition,
  parallax = false,
  "data-anim": dataAnim,
}: OrganicImageProps) {
  return (
    <div
      data-anim={dataAnim}
      data-parallax-alvo={parallax ? "" : undefined}
      className={cn("relative overflow-hidden", className)}
      style={{ clipPath: organicClip(shape) }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        data-parallax-foto={parallax ? "" : undefined}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
