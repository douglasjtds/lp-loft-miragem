"use client";

import { useEffect } from "react";

import { carregarAnime } from "@/components/motion/anime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Deriva dos elementos decorativos — DESIGN-GUIDELINES.md §8, tabela de ferramentas.
 *
 * Loop longo (18–30s), `alternate`, amplitude ≤20px: devagar o bastante para ninguém
 * conseguir apontar o movimento, só perceber que a faixa não está morta. Passou de 20px
 * ou de meio minuto e vira "elemento animado", que é outra coisa.
 *
 * Cada elemento recebe duração e amplitude próprias, e nenhuma duração é múltipla da
 * outra — dois elementos em fase batendo o mesmo ciclo denunciam o truque na hora.
 *
 * Só forma decorativa e recorte de OBJETO derivam. A pessoa retratada nunca flutua (§9):
 * pessoa recortada boiando na tela lê como banner barato, que é o oposto do objetivo.
 * Sob `reduced-motion`, nenhum loop começa — não é "mais devagar", é parado.
 */

/** Uma linha por alvo, na ordem do DOM. Ciclos deliberadamente primos entre si. */
const PERCURSOS = [
  { x: 16, y: -12, duracao: 23000 },
  { x: -14, y: 10, duracao: 29000 },
  { x: 12, y: 14, duracao: 26000 },
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

    carregarAnime().then(({ createScope, animate }) => {
      if (cancelado) return;

      escopo = createScope({ root: raiz }).add(() => {
        const recortes = raiz.querySelectorAll<HTMLElement>("[data-derivavel]");

        recortes.forEach((recorte, indice) => {
          const percurso = PERCURSOS[indice % PERCURSOS.length];

          animate(recorte, {
            x: [0, percurso.x],
            y: [0, percurso.y],
            duration: percurso.duracao,
            ease: "inOutSine",
            loop: true,
            alternate: true,
          });
        });
      });
    });

    return () => {
      cancelado = true;
      escopo?.revert();
    };
  }, [reduzido, rootId]);

  return null;
}
