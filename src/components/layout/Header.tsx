"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { header, hero } from "@/config/content";
import { cn } from "@/lib/cn";

/**
 * Header fixo — landing-page-structure.md §5.0.
 *
 * Sem menu hambúrguer, por decisão de especificação: a página é curta, o tráfego vem
 * do link na bio do Instagram e o CTA vale mais que a navegação. No mobile sobram só
 * o monograma e o botão compacto.
 *
 * Client component por um motivo só: o fundo com blur que entra depois de 40px de
 * scroll. Nada do conteúdo depende de JS — sem hidratação, o header renderiza inteiro,
 * apenas sem a mudança de fundo.
 */

const LIMITE_DE_SCROLL = 40;

export function Header() {
  const [comFundo, setComFundo] = useState(false);

  useEffect(() => {
    const aoRolar = () => setComFundo(window.scrollY > LIMITE_DE_SCROLL);

    // Recarregar a página no meio do scroll já entra abaixo do limite.
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
        comFundo
          ? "border-ancora/10 bg-papel/85 border-b backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-lp flex h-18 items-center justify-between gap-4">
        <a
          href={`#${hero.id}`}
          aria-label={header.inicioLabel}
          className="flex shrink-0 items-center py-2"
        >
          <Image
            /* Alvo da timeline da dobra (§8). O monograma é o único elemento fora do
               herói que participa dela — e o único marcador de motion do header. */
            data-anim-monograma
            src="/brand/monograma.png"
            alt={header.monogramaAlt}
            width={114}
            height={128}
            priority
            className="h-8 w-auto"
          />
        </a>

        <nav
          aria-label={header.navLabel}
          className="hidden items-center gap-8 md:flex"
        >
          {header.ancoras.map((ancora) => (
            <a
              key={ancora.href}
              href={ancora.href}
              className="font-ui text-ancora hover:text-acento-texto hover:decoration-acento text-sm underline-offset-4 transition-colors duration-200 hover:underline"
            >
              {ancora.label}
            </a>
          ))}
        </nav>

        <WhatsappCta
          origem={header.cta.origem}
          size="sm"
          ariaLabel={header.cta.ariaLabel}
        >
          {header.cta.label}
        </WhatsappCta>
      </div>
    </header>
  );
}
