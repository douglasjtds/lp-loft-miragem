"use client";

import { useEffect, useState } from "react";

import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { hero, stickyMobileCta } from "@/config/content";
import { cn } from "@/lib/cn";

/**
 * Barra fixa de conversão no mobile — landing-page-structure.md §5.11.
 *
 * É o elemento que mais deve converter: o tráfego vem do link na bio do Instagram, e
 * a partir da segunda dobra o CTA do herói já saiu da tela.
 *
 * Só existe abaixo de 768px, e só aparece depois que o herói sai da viewport — enquanto
 * o herói está visível ela seria redundante e roubaria altura útil de uma tela de 390px.
 *
 * `invisible` (e não só `opacity-0`) no estado fechado é deliberado: elemento
 * transparente continua recebendo foco de teclado, o que criaria uma parada invisível
 * na ordem de tabulação. Sob `prefers-reduced-motion` a transição é zerada em
 * globals.css e a barra simplesmente aparece.
 */

export function StickyMobileCta() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById(hero.id);
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entrada]) => setVisivel(!entrada.isIntersecting),
      // O herói "saiu" quando some por baixo do header fixo, não quando o último pixel
      // deixa a viewport.
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "border-ancora/10 bg-papel/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md md:hidden",
        "px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-[opacity,transform] duration-300 ease-out",
        visivel
          ? "translate-y-0 opacity-100"
          : "invisible translate-y-full opacity-0",
      )}
    >
      <WhatsappCta
        origem={stickyMobileCta.origem}
        ariaLabel={stickyMobileCta.ariaLabel}
        className="w-full"
      >
        {stickyMobileCta.label}
      </WhatsappCta>
    </div>
  );
}
