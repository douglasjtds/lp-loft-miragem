import { cn } from "@/lib/cn";

/**
 * Rótulo de seção — DESIGN-GUIDELINES.md §4.
 *
 * O único elemento em caixa alta da página inteira. O estilo (Montserrat 500, 0.75rem,
 * tracking 0.18em, uppercase) já é o utilitário `eyebrow` de globals.css; este componente
 * existe para que o padrão tenha um nome só e não seja reescrito em cada seção.
 *
 * Cor vem de fora, por herança — o eyebrow é acento-texto sobre papel e superficie-2 sobre
 * a faixa ancora, e quem sabe disso é a seção, não o componente.
 */

type EyebrowProps = {
  as?: "p" | "span" | "div";
  className?: string;
  /**
   * Endereço para os componentes de motion (DESIGN-GUIDELINES.md §8). É só um marcador
   * de DOM: não carrega estilo, não muda a renderização e, sem JS, não faz nada.
   */
  "data-anim"?: string;
  children: React.ReactNode;
};

export function Eyebrow({
  as: Tag = "p",
  className,
  "data-anim": dataAnim,
  children,
}: EyebrowProps) {
  return (
    <Tag className={cn("eyebrow", className)} data-anim={dataAnim}>
      {children}
    </Tag>
  );
}
