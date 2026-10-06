import { brandIcons, type BrandIconName } from "@/config/brand-icons";
import { cn } from "@/lib/cn";

/**
 * Ícones da marca — DESIGN-GUIDELINES.md §5.
 *
 * O SVG é INLINE, não `<img src="/brand/*.svg">`: a animação-assinatura da Fase 7
 * (`createDrawable`) precisa alcançar cada `<path>` no DOM. Um `<img>` inviabiliza isso.
 *
 * Tamanho mínimo 48px — abaixo disso o traço de 1.5px some. Cor por herança
 * (`currentColor`): ancora sobre fundo claro, superficie-2 sobre a faixa escura.
 *
 * Não confundir com ícone de interface (chevron do FAQ, seta, WhatsApp): aqueles são
 * Lucide e nunca aparecem no mesmo bloco visual que estes.
 */

type BrandIconProps = {
  name: BrandIconName;
  /** Em px. Default 48 = mínimo da §5. Na seção Método são 120–160. */
  size?: number;
  className?: string;
  /**
   * Marca cada path com `data-drawable`, que é o seletor usado pela timeline da Fase 7.
   * Sem isto o ícone renderiza igual, só não é alvo de animação.
   */
  animatable?: boolean;
  /**
   * Quando o ícone carrega significado sozinho. Sem título ele é decorativo
   * (`aria-hidden`) — o normal, já que o nome do pilar está no heading ao lado.
   */
  title?: string;
};

export function BrandIcon({
  name,
  size = 48,
  className,
  animatable = false,
  title,
}: BrandIconProps) {
  const icon = brandIcons[name];
  const titleId = title ? `brand-icon-${name}-title` : undefined;

  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="none"
      stroke="currentColor"
      // 2 no viewBox de 96 = ~1px a 48px e ~2.5px a 120px. Acompanha o peso do
      // traçado do manual e é o mesmo valor dos SVGs de public/brand/.
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      aria-labelledby={titleId}
      focusable="false"
      data-brand-icon={name}
    >
      {title && <title id={titleId}>{title}</title>}
      {icon.paths.map((d, i) => (
        <path key={i} d={d} data-drawable={animatable ? "" : undefined} />
      ))}
    </svg>
  );
}
