"use client";

import { useEffect } from "react";

import { carregarAnime } from "@/components/motion/anime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Deriva dos elementos decorativos — DESIGN-GUIDELINES.md §8, tabela de ferramentas.
 *
 * Loop longo (20–30s), `alternate`, deslocamento total ≤16px (landing-page-structure
 * §5.10): devagar o bastante para ninguém conseguir apontar o movimento, só perceber
 * que a água do fechamento não está parada. Passou disso e vira "elemento animado",
 * que é outra coisa.
 *
 * O percurso é quase todo horizontal, como correnteza; o pouco de vertical é o que tira
 * a cara de esteira. Quem deriva precisa de folga além da borda para o deslocamento
 * não descobrir o fim do traço (ver CtaFinal).
 *
 * Cada elemento recebe duração e amplitude próprias, e nenhuma duração é múltipla da
 * outra — dois elementos em fase batendo o mesmo ciclo denunciam o truque na hora.
 *
 * Só decoração deriva, nunca foto nem texto. Sob `reduced-motion`, nenhum loop começa:
 * não é "mais devagar", é parado (§8, item 4). Se a preferência ligar com a página
 * aberta, o efeito reexecuta e o `revert()` devolve a onda ao lugar.
 */

/**
 * Uma linha por alvo, na ordem do DOM. √(x² + y²) ≤ 16 em todas, e ciclos que não são
 * múltiplos um do outro: dois alvos batendo o mesmo ciclo denunciam o truque.
 */
const PERCURSOS = [
  { x: 14, y: 6, duracao: 23000 },
  { x: -12, y: 8, duracao: 29000 },
  { x: 10, y: -10, duracao: 26000 },
] as const;

type DerivaProps = {
  /** id da seção. Só os `[data-derivavel]` de dentro dela entram no loop. */
  rootId: string;
};

export function Deriva({ rootId }: DerivaProps) {
  const reduzido = usePrefersReducedMotion();

  useEffect(() => {
    if (reduzido) return;

    const raiz = document.getElementById(rootId);
    if (!raiz) return;

    let cancelado = false;
    let escopo: { revert: () => void } | null = null;
    let observer: IntersectionObserver | null = null;

    carregarAnime().then(({ createScope, animate }) => {
      if (cancelado) return;

      const loops: { play: () => void; pause: () => void }[] = [];

      escopo = createScope({ root: raiz }).add(() => {
        const recortes = raiz.querySelectorAll<Element>("[data-derivavel]");

        recortes.forEach((recorte, indice) => {
          const percurso = PERCURSOS[indice % PERCURSOS.length];

          const loop = animate(recorte, {
            // `translateX/Y` por extenso, nunca `x`/`y`: num `<svg>` o anime.js
            // resolve `x` e `y` como os ATRIBUTOS SVG de mesmo nome, que no svg raiz
            // não deslocam nada. A onda ficava parada sem erro nenhum.
            translateX: [0, percurso.x],
            translateY: [0, percurso.y],
            duration: percurso.duracao,
            ease: "inOutSine",
            loop: true,
            alternate: true,
            autoplay: false,
          });
          loops.push(loop);
        });
      });

      // Fora da tela o loop para: sem isso seriam rAF e repintura da svg durante a
      // visita inteira, para um movimento que ninguém está vendo. Retoma de onde
      // parou, então quem volta à faixa não vê a onda saltar.
      observer = new IntersectionObserver(([entrada]) => {
        loops.forEach((loop) =>
          entrada.isIntersecting ? loop.play() : loop.pause(),
        );
      });
      observer.observe(raiz);
    });

    return () => {
      cancelado = true;
      observer?.disconnect();
      escopo?.revert();
    };
  }, [reduzido, rootId]);

  return null;
}
