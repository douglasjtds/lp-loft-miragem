import type { LinkExterno as LinkExternoContent } from "@/config/content";
import { cn } from "@/lib/cn";

/**
 * Link de texto para fora do site — DESIGN-GUIDELINES.md §10.
 *
 * É a forma da conversão secundária (Airbnb) e dos links de fonte (Google, Instagram,
 * Maps): link sublinhado em `acento`, NUNCA um segundo botão. Dois botões lado a lado
 * dividem o clique, e o WhatsApp é a conversão que a cliente quer.
 *
 * `href: null` significa destino ainda não confirmado: o componente não renderiza nada.
 * Um `<a>` sem destino real entraria na ordem de foco e não levaria a lugar nenhum.
 *
 * Cor por herança: `text-ancora` sobre fundo claro, `superficie-2` sobre a faixa escura.
 * O sublinhado `acento` é decoração, não texto, então não entra na conta de contraste.
 * O hover engrossa o sublinhado em vez de trocar a cor: `acento-texto` reprovaria
 * sobre `ancora` (2.03:1), e o mesmo componente serve os dois fundos.
 */

type LinkExternoProps = {
  link: LinkExternoContent;
  className?: string;
};

export function LinkExterno({ link, className }: LinkExternoProps) {
  if (!link.href) return null;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.ariaLabel}
      className={cn(
        "font-ui decoration-acento hover:decoration-2 inline-flex min-h-11 items-center underline underline-offset-4 transition-[text-decoration-thickness] duration-200",
        className,
      )}
    >
      {link.label}
    </a>
  );
}
