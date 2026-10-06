"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Reveal de seção — DESIGN-GUIDELINES.md §8, item 2.
 *
 * CSS + IntersectionObserver, sem anime.js: custo zero de bundle para o movimento que
 * mais se repete na página. Fade + translateY de 16px, 500ms ease-out, uma vez só —
 * depois o observer se desconecta e o elemento fica fora do caminho para sempre (item 5).
 *
 * Duas decisões que importam mais que o efeito:
 *
 * 1. **O estado inicial nunca está no HTML.** Ele é escrito aqui, via JS, depois da
 *    hidratação. Sem JS, com JS quebrado ou sob `reduced-motion`, o conteúdo renderiza
 *    visível — o inverso (`opacity-0` na marcação) esconderia a página inteira de quem
 *    não executa scripts, incluindo crawler mal-humorado.
 * 2. **O que já está na tela na carga não anima.** Esconder um bloco visível para
 *    revelá-lo em seguida produz um piscar, não uma entrada. O reveal só vale para o
 *    que ainda está abaixo da dobra.
 *
 * O `<div>` é um wrapper de bloco comum: como não tem padding nem borda, a margem do
 * filho continua colapsando para fora, e o espaçamento vertical das seções não muda.
 */

/** Um pouco acima da borda inferior: o que está quase na dobra conta como já visto. */
const MARGEM_DE_CARGA = 0.9;

type RevealProps = {
  /** Escalona blocos irmãos (ms). Acima de ~200ms a seção parece lenta, não coreografada. */
  atraso?: number;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ atraso = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = usePrefersReducedMotion();

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // A preferência pode mudar com a página aberta: se ligar no meio do caminho, o que
    // estiver escondido volta na hora. Nada pode ficar preso em opacity 0.
    if (reduzido) {
      delete elemento.dataset.reveal;
      return;
    }

    if (elemento.dataset.reveal === "visivel") return;

    if (
      elemento.getBoundingClientRect().top <
      window.innerHeight * MARGEM_DE_CARGA
    ) {
      return;
    }

    elemento.style.setProperty("--reveal-atraso", `${atraso}ms`);
    elemento.dataset.reveal = "oculto";

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        elemento.dataset.reveal = "visivel";
        observer.disconnect();
      },
      // Exige um naco do bloco dentro da tela: revelar no primeiro pixel faz a animação
      // acontecer fora do campo de atenção de quem rola rápido.
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );

    observer.observe(elemento);
    return () => observer.disconnect();
  }, [reduzido, atraso]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
