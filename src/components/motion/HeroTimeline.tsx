"use client";

import { useEffect } from "react";

import { carregarAnime } from "@/components/motion/anime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Entrada da dobra — DESIGN-GUIDELINES.md §8.
 *
 * Não renderiza nada: acha os alvos pelos `data-anim` que o Hero já marca e some.
 * Tudo o que ele faz é reversível, e nada do que ele faz existe no HTML.
 *
 * Só o texto entra: eyebrow, h1 linha por linha, subtítulo, CTA e a linha de prova. A
 * foto do herói NÃO anima de entrada (TODOs, Fase 7): é a candidata a LCP, e o único
 * movimento dela é o parallax de scroll em CSS (`globals.css`).
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

    carregarAnime().then(({ createScope, animate, stagger, definir }) => {
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

      if (!linhas.length) return;

      const texto = [
        eyebrow,
        ...linhas,
        subtitulo,
        cta,
        disponibilidade,
      ].filter((el): el is HTMLElement => el !== null);

      // A sequência é fixa e curta, então é escrita como horários absolutos e não
      // como `createTimeline`: o módulo de timeline custava o que faltava para o
      // chunk de animação caber nos 15KB gzip da §8. A leitura é a mesma: cada bloco
      // começa antes de o anterior terminar, e o texto sobe como uma frase só.
      const fimDasLinhas = 100 + 80 * (linhas.length - 1) + 600;
      const sequencia: [HTMLElement | HTMLElement[] | null, number, number][] =
        [
          [eyebrow, 0, 500],
          [linhas, 100, 600],
          [subtitulo, fimDasLinhas - 280, 600],
          [cta, fimDasLinhas + 120, 600],
          [disponibilidade, fimDasLinhas + 300, 500],
        ];

      // Terminada a entrada, o escopo é revertido: o resultado na tela é o mesmo, mas
      // sem o `opacity` e o `transform` inline que sobrariam em cinco nós (o transform
      // abriria um contexto de empilhamento no CTA à toa).
      let restantes = sequencia.filter(([alvos]) => alvos).length;
      const concluir = () => {
        restantes--;
        if (restantes === 0) escopo?.revert();
      };

      escopo = createScope({ root: raiz }).add(() => {
        // ---- Estado inicial, aplicado AGORA e só agora (regra nº 3 da §8) ----
        definir(texto, { opacity: 0, y: 16 });

        sequencia.forEach(([alvos, inicio, duracao]) => {
          if (!alvos) return;
          animate(alvos, {
            onComplete: concluir,
            opacity: 1,
            y: 0,
            duration: duracao,
            ease: "out(3)",
            // As linhas do h1 sobem em stagger de 80ms; o resto entra inteiro.
            delay: Array.isArray(alvos)
              ? stagger(80, { start: inicio })
              : inicio,
          });
        });
      });
    });

    return () => {
      cancelado = true;
      // Devolve o estado inicial e as transformações. Sem isto, um re-render deixaria
      // os alvos presos no estado escrito por `definir`.
      escopo?.revert();
    };
  }, [reduzido, rootId]);

  return null;
}
