"use client";

import { useEffect } from "react";

import { carregarAnime } from "@/components/motion/anime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Entrada da dobra — DESIGN-GUIDELINES.md §8 (`createTimeline`).
 *
 * Não renderiza nada: acha os alvos pelos `data-anim` que o Hero já marca e some.
 * Tudo o que ele faz é reversível, e nada do que ele faz existe no HTML.
 *
 * **A regra que manda aqui é a nº 3 da §8: a animação nunca bloqueia o LCP.** Título e
 * foto pintam primeiro, com opacidade cheia; o estado inicial (opacity 0, translateY) é
 * escrito por este componente, via JS, depois da hidratação e do `import()` do anime.js.
 * Se o script falhar, se o chunk não chegar ou se `reduced-motion` estiver ativo, a
 * dobra fica exatamente como o servidor a mandou — completa e visível.
 *
 * Consequência disso: existe uma janela em que a dobra JÁ ESTÁ PINTADA quando o anime.js
 * chega. Se essa janela for longa, esconder o texto para trazê-lo de volta não é entrada,
 * é um piscar — e um piscar no h1 é pior que nenhuma animação. Por isso os dois guardas
 * de `LIMITE_*` abaixo: passou do orçamento de tempo ou o visitante já rolou, a timeline
 * simplesmente não roda. Nada quebra, a página fica estática.
 */

/**
 * Orçamento entre o início da navegação e o momento de esconder a dobra. Hidratação +
 * chunk de animação costumam caber em 300–600ms; acima de ~1.6s o olho já leu o título
 * e a entrada vira flicker.
 */
const LIMITE_DE_ATRASO_MS = 1600;

/** Já rolou mais que isso, a dobra não é mais o assunto — não faz sentido animá-la. */
const LIMITE_DE_SCROLL_PX = 120;

type HeroTimelineProps = {
  /** id da `<section>` do herói. Os alvos são procurados só dentro dela. */
  rootId: string;
};

export function HeroTimeline({ rootId }: HeroTimelineProps) {
  const reduzido = usePrefersReducedMotion();

  useEffect(() => {
    if (reduzido) return;
    if (window.scrollY > LIMITE_DE_SCROLL_PX) return;
    if (performance.now() > LIMITE_DE_ATRASO_MS) return;

    const raiz = document.getElementById(rootId);
    if (!raiz) return;

    let cancelado = false;
    let escopo: { revert: () => void } | null = null;

    carregarAnime().then(
      ({ createScope, createTimeline, stagger, definir }) => {
        // Segunda checagem, agora com o custo real do import na conta: entre o começo
        // do efeito e a chegada do chunk pode ter passado muito tempo, ou o visitante
        // pode já ter rolado a página.
        if (cancelado) return;
        if (window.scrollY > LIMITE_DE_SCROLL_PX) return;
        if (performance.now() > LIMITE_DE_ATRASO_MS) return;

        const alvo = (nome: string) =>
          raiz.querySelector<HTMLElement>(`[data-anim="${nome}"]`);

        const linhas = Array.from(
          raiz.querySelectorAll<HTMLElement>("[data-hero-linha]"),
        );
        const eyebrow = alvo("eyebrow");
        const subtitulo = alvo("subtitulo");
        const cta = alvo("cta");
        const disponibilidade = alvo("disponibilidade");
        const foto = alvo("foto");

        // O monograma vive no header, fora da raiz — é o único alvo de fora, e é
        // buscado por atributo justamente para não acoplar a timeline ao Header.
        const monograma = document.querySelector<HTMLElement>(
          "[data-anim-monograma]",
        );

        if (!linhas.length) return;

        const texto = [
          eyebrow,
          ...linhas,
          subtitulo,
          cta,
          disponibilidade,
        ].filter((el): el is HTMLElement => el !== null);

        escopo = createScope({ root: raiz }).add(() => {
          // ---- Estado inicial, aplicado AGORA e só agora (regra nº 3 da §8) ----
          definir(texto, { opacity: 0, y: 16 });
          if (monograma) definir(monograma, { opacity: 0, scale: 0.92 });
          // A foto nunca fica invisível: ela é a candidata mais provável a LCP e só
          // encolhe de 1.03 para 1. Um leve zoom-out, não uma aparição.
          if (foto) definir(foto, { scale: 1.03 });

          const tl = createTimeline({
            defaults: { duration: 600, ease: "out(3)" },
          });

          if (monograma) {
            tl.add(monograma, { opacity: 1, scale: 1 }, 0);
          }

          if (eyebrow) {
            tl.add(eyebrow, { opacity: 1, y: 0, duration: 500 }, 220);
          }

          tl.add(
            linhas,
            { opacity: 1, y: 0, duration: 700, delay: stagger(80) },
            340,
          );

          if (subtitulo) {
            tl.add(subtitulo, { opacity: 1, y: 0 }, "-=280");
          }

          if (cta) {
            tl.add(cta, { opacity: 1, y: 0 }, "-=200");
          }

          if (disponibilidade) {
            tl.add(
              disponibilidade,
              { opacity: 1, y: 0, duration: 500 },
              "-=420",
            );
          }

          // A foto entra em paralelo com o título, não depois: ela já está visível, e
          // esperar a vez faria a coluna direita parecer congelada por meio segundo.
          if (foto) {
            tl.add(foto, { scale: 1, duration: 900, ease: "outExpo" }, 240);
          }
        });
      },
    );

    return () => {
      cancelado = true;
      // Devolve o estado inicial e as transformações. Sem isto, um re-render deixaria
      // os alvos presos no estado escrito por `definir`.
      escopo?.revert();
    };
  }, [reduzido, rootId]);

  return null;
}
