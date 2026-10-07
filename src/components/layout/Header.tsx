"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { header, hero } from "@/config/content";
import { cn } from "@/lib/cn";

/**
 * Header fixo — landing-page-structure.md §5.0.
 *
 * Sem menu hambúrguer, por decisão de especificação: a página é curta, o tráfego vem
 * do link na bio do Instagram e o CTA vale mais que a navegação. No mobile sobram o
 * lockup (monograma + nome) e o botão compacto.
 *
 * Fundo `papel` SÓLIDO desde o primeiro pixel. Sem blur e sem transparência: vidro
 * fosco é o tell de página gerada por IA que a §5.0 proíbe. O que muda com o scroll é
 * só o filete `creme` embaixo, depois de 40px, para separar o header do conteúdo que
 * passa por trás. É o único motivo de este ser um client component: sem hidratação, o
 * header renderiza inteiro, apenas sem o filete.
 *
 * Quem detecta os 40px é um IntersectionObserver num sentinela invisível no topo do
 * documento, e não um listener de scroll: o observer só dispara quando o estado muda
 * (duas vezes por ida e volta), em vez de a cada quadro de rolagem.
 */

export function Header() {
  const [comFilete, setComFilete] = useState(false);
  const sentinela = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alvo = sentinela.current;
    if (!alvo) return;

    // Recarregar a página no meio do scroll já entra com o filete: o observer entrega
    // o estado inicial na primeira chamada.
    const observer = new IntersectionObserver(([entrada]) =>
      setComFilete(!entrada.isIntersecting),
    );
    observer.observe(alvo);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 40px do topo do documento (h-10): sai da viewport exatamente no limite da
          §5.0. `absolute` em relação ao bloco inicial, fora do header fixo. */}
      <div
        ref={sentinela}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-10"
      />
      <header
        className={cn(
          "bg-papel fixed inset-x-0 top-0 z-50 border-b transition-[border-color] duration-200 ease-out",
          comFilete ? "border-creme" : "border-transparent",
        )}
      >
        <div className="container-lp flex h-18 items-center justify-between gap-4">
          {/* O lockup horizontal que a logo empilhada não oferece (§5). O monograma tem
            `alt` vazio: o nome ao lado já diz o que é, e o link tem rótulo próprio. */}
          <a
            href={`#${hero.id}`}
            aria-label={header.inicioLabel}
            className="text-ancora flex min-h-11 shrink-0 items-center gap-2"
          >
            <Image
              src="/brand/monograma.svg"
              alt=""
              width={36}
              height={36}
              priority
              className="size-9"
            />
            <span className="font-ui text-base font-semibold">
              {header.nome}
            </span>
          </a>

          <nav
            aria-label={header.navLabel}
            className="hidden items-center gap-8 md:flex"
          >
            {header.ancoras.map((ancora) => (
              <a
                key={ancora.href}
                href={ancora.href}
                className="font-ui text-ancora hover:text-acento-texto hover:decoration-acento inline-flex min-h-11 items-center text-sm underline-offset-4 transition-colors duration-200 hover:underline"
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
    </>
  );
}
