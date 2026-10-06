"use client";

import { useEffect } from "react";

import { carregarAnime } from "@/components/motion/anime";
import type { BrandIconName } from "@/config/brand-icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * A ANIMAÇÃO-ASSINATURA — DESIGN-GUIDELINES.md §8, item 1.
 *
 * Os ícones da marca se desenham, na ordem dos pilares, uma única vez. É o único
 * momento coreografado da página inteira: todo o resto é reveal discreto justamente
 * para que este tenha com o que contrastar. É aqui que a ousadia é gasta.
 *
 * Funciona porque o BrandIcon é SVG inline com `stroke` (nunca `fill`) e marca cada
 * `<path>` com `data-drawable` — `createDrawable` mexe em `stroke-dasharray`, e forma
 * preenchida não tem traçado para desenhar.
 *
 * ## Dois desvios conscientes do TODOs.md, Fase 7, item 4
 *
 * **1. Um disparo por ícone, não uma timeline única.** O prompt pede todos numa
 * timeline só, com leve sobreposição. Não sobreviveu ao layout real: no Método os
 * pilares são blocos empilhados e os ícones ficam a 500–700px um do outro. Uma timeline
 * de ~3s disparada no primeiro desenharia os demais fora da tela, e quem rolasse até
 * eles encontraria ícones já prontos — exatamente o que a seção-assinatura existe para
 * não ser. Cada ícone dispara quando ele próprio entra em cena. A ordem segue garantida
 * (é a ordem do DOM, e a página só se lê de cima para baixo), e a sobreposição vira o
 * stagger entre os traços de um mesmo ícone.
 *
 * **2. IntersectionObserver no lugar de `autoplay: onScroll()`.** Levar o `onScroll` do
 * anime.js junto custava ~5KB gzip só de `ScrollObserver` e estourava o orçamento de
 * 15KB da §8 — para fazer o que o navegador já faz de graça e o `Reveal` desta pasta já
 * fazia. A animação é criada parada (`autoplay: false`) e ganha `play()` quando o ícone
 * entra na tela. O `once` do prompt continua valendo: o observer se desconecta no
 * primeiro disparo e nada se redesenha na volta (§8, item 5).
 */

/** §8: o desenho é o único movimento longo permitido. */
const DURACAO_MS = 1200;

/** Sobreposição entre os traços do MESMO ícone — é o que dá o gesto de mão desenhando. */
const STAGGER_MS = 140;

/** Um naco do ícone dentro da tela antes de começar: o desenho precisa ser visto nascer. */
const MARGEM_DE_DISPARO = "0px 0px -15% 0px";

/** Escalona ícones que entrem na MESMA tela, para preservar a leitura de sequência. */
const ATRASO_POR_POSICAO_MS = 180;

type DrawIconsProps = {
  /** id da `<section>` do Método. Fora dela nenhum ícone é tocado. */
  rootId: string;
  /**
   * A ordem da coreografia. Vem de `metodo.pilares` em content.ts — não tem valor
   * padrão de propósito, porque um padrão embutido aqui seria um lugar a mais para a
   * ordem dos pilares divergir da ordem em que eles são desenhados.
   */
  ordem: readonly BrandIconName[];
};

export function DrawIcons({ rootId, ordem }: DrawIconsProps) {
  const reduzido = usePrefersReducedMotion();

  // A ordem chega como array novo a cada render (`pilares.map`). Comparar identidade de
  // array reexecutaria o efeito à toa — e reexecutar aqui significa apagar e redesenhar
  // ícones que já foram desenhados. O conteúdo, como string, é estável.
  const chaveDaOrdem = ordem.join("|");

  useEffect(() => {
    if (reduzido) return;

    const raiz = document.getElementById(rootId);
    if (!raiz) return;

    const sequencia = chaveDaOrdem.split("|") as BrandIconName[];

    let cancelado = false;
    let escopo: { revert: () => void } | null = null;
    const observers: IntersectionObserver[] = [];
    const temporizadores: number[] = [];

    carregarAnime().then(
      ({ createScope, createDrawable, animate, stagger, definir }) => {
        if (cancelado) return;

        escopo = createScope({ root: raiz }).add(() => {
          sequencia.forEach((nome, indice) => {
            const icone = raiz.querySelector<SVGSVGElement>(
              `[data-brand-icon="${nome}"]`,
            );
            if (!icone) return;

            const tracos = icone.querySelectorAll("path[data-drawable]");
            if (!tracos.length) return;

            const desenhaveis = createDrawable(tracos);

            // Estado inicial explícito e aplicado só aqui: o ícone nasce desenhado no
            // HTML e só é apagado no instante em que este código assume o redesenho.
            definir(desenhaveis, { draw: "0 0" });

            const desenho = animate(desenhaveis, {
              draw: "0 1",
              duration: DURACAO_MS,
              ease: "inOut(3)",
              delay: stagger(STAGGER_MS),
              autoplay: false,
            });

            const observer = new IntersectionObserver(
              ([entrada]) => {
                if (!entrada.isIntersecting) return;
                observer.disconnect();
                temporizadores.push(
                  window.setTimeout(
                    () => desenho.play(),
                    indice * ATRASO_POR_POSICAO_MS,
                  ),
                );
              },
              { rootMargin: MARGEM_DE_DISPARO, threshold: 0 },
            );

            observer.observe(icone);
            observers.push(observer);
          });
        });
      },
    );

    return () => {
      cancelado = true;
      observers.forEach((observer) => observer.disconnect());
      temporizadores.forEach((id) => window.clearTimeout(id));
      // Devolve o stroke-dasharray original: sem isto, um desmonte no meio do desenho
      // deixaria o ícone pela metade.
      escopo?.revert();
    };
  }, [reduzido, rootId, chaveDaOrdem]);

  return null;
}
