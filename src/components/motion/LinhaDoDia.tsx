"use client";

import { useEffect } from "react";

import { carregarAnime } from "@/components/motion/anime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * A ANIMAÇÃO-ASSINATURA: a linha do dia — DESIGN-GUIDELINES.md §8, item 1, e
 * landing-page-structure.md §5.3.
 *
 * A onda da Experiência se desenha como uma caneta atravessando o dia, e cada ícone
 * (sol-nascente → prancha → lua-agua) se desenha no instante em que a caneta chega na
 * sua parada. É o único momento coreografado da página: todo o resto é reveal discreto
 * para que este tenha com o que contrastar.
 *
 * O texto e a foto de cada parada NÃO esperam a caneta: entram pelo `Reveal`, quando
 * eles mesmos chegam na tela. No `lg` metade do conteúdo fica ACIMA da linha; preso à
 * caneta, ele ficaria em branco enquanto a onda ainda está abaixo da dobra.
 *
 * ## Uma fila de trechos, não uma timeline
 *
 * Cada ícone tem seu próprio IntersectionObserver. Quando ele entra na tela, o trecho
 * da onda que leva até ela entra numa fila; um trecho só começa quando o anterior
 * terminou, e o ícone começa quando a caneta chega nele. A mesma regra resolve os dois
 * layouts:
 *
 * - no `lg` as três paradas entram juntas, a fila corre inteira e vira um gesto só, da
 *   manhã à noite;
 * - no celular a linha desce pela esquerda e as paradas ficam a 600px+ uma da outra:
 *   a onda desce no ritmo da rolagem e nenhum ícone se desenha fora da tela. Uma
 *   timeline única disparada na primeira parada desenharia as outras no escuro.
 *
 * Os trechos são criados na hora de tocar, por método do escopo (`escopo.methods`), e
 * não todos de antemão: assim cada um parte de onde a caneta parou, nenhum compete pela
 * mesma propriedade, e todos continuam registrados para o `revert()`.
 *
 * ## Regras herdadas
 *
 * - IntersectionObserver e não `onScroll()`: o ScrollObserver do anime.js custa ~5KB
 *   gzip e estoura o orçamento de 15KB da §8 (ver `anime-lib.ts`).
 * - O estado inicial (onda e ícones apagados) só existe a partir daqui. Sem JS, com o chunk atrasado ou sob reduced-motion, tudo nasce desenhado.
 * - O que já está na tela quando o script chega não é apagado (mesma regra do
 *   `Reveal`): esconder algo visível para redesenhar é um piscar, não uma entrada.
 * - Uma vez só (§8, item 5). Cada observer se desconecta no primeiro disparo, e ao fim
 *   de tudo o escopo é revertido: o DOM volta a ser o do servidor, já desenhado.
 * - Se o breakpoint `lg` virar no meio (a onda visível troca de eixo) ou a preferência
 *   de movimento mudar, o escopo é revertido e tudo aparece desenhado, no lugar.
 */

/** A onda inteira, de ponta a ponta. Cada trecho leva a parte proporcional disto. */
const DURACAO_DA_ONDA_MS = 1800;

/** Abaixo disso o trecho vira um tranco, não um traço. */
const TRECHO_MINIMO_MS = 240;

/** §5.3: o ícone se desenha em ~1000ms, `inOut(3)`. */
const DURACAO_DO_ICONE_MS = 1000;

/** Sobreposição entre os traços do mesmo ícone: o gesto de mão desenhando. */
const STAGGER_DOS_TRACOS_MS = 120;

/** Um naco do ícone dentro da tela antes de começar: o desenho precisa ser visto. */
const MARGEM_DE_DISPARO = "0px 0px -15% 0px";

/** O que está acima disto na carga conta como já visto (mesmo valor do Reveal). */
const MARGEM_DE_CARGA = 0.9;

const LG = "(min-width: 64rem)";

type LinhaDoDiaProps = {
  /** id da `<section>` da Experiência. Fora dela nada é tocado. */
  rootId: string;
};

type Parada = {
  /** O ícone da parada: é ele que dispara, porque é ele que está na linha. */
  icone: Element;
  /** Onde o ícone fica na onda, de 0 a 1. */
  fracao: number;
};

const limitar = (n: number) => Math.min(1, Math.max(0, n));

export function LinhaDoDia({ rootId }: LinhaDoDiaProps) {
  const reduzido = usePrefersReducedMotion();

  useEffect(() => {
    if (reduzido) return;

    const raiz = document.getElementById(rootId);
    if (!raiz) return;

    let encerrado = false;
    let escopo: { revert: () => void } | null = null;
    const observers: IntersectionObserver[] = [];
    const breakpoint = window.matchMedia(LG);

    const encerrar = () => {
      if (encerrado) return;
      encerrado = true;
      observers.forEach((observer) => observer.disconnect());
      breakpoint.removeEventListener("change", encerrar);
      escopo?.revert();
    };

    breakpoint.addEventListener("change", encerrar);

    carregarAnime().then(
      ({ createScope, createDrawable, animate, stagger, definir }) => {
        if (encerrado) return;

        // Só uma das duas ondas está renderizada: a vertical no celular, a horizontal
        // no `lg`. A outra tem `display: none` e não tem caixa.
        const onda = Array.from(
          raiz.querySelectorAll<SVGSVGElement>("[data-linha-do-dia]"),
        ).find((svg) => svg.getClientRects().length > 0);
        const tracoDaOnda = onda?.querySelector("path");
        if (!onda || !tracoDaOnda) return;

        const horizontal = onda.dataset.linhaDoDia === "horizontal";

        // A onda é `preserveAspectRatio="none"` e quase reta: a fração do comprimento
        // do traço é, para o olho, a fração da posição ao longo do eixo. Medida de
        // novo na hora de tocar cada trecho: entre a carga e a rolagem, uma fonte que
        // troca ou um celular que gira refazem as quebras de linha e mudam a posição.
        const medir = (icone: Element) => {
          const caixa = onda.getBoundingClientRect();
          const r = icone.getBoundingClientRect();
          return limitar(
            horizontal
              ? (r.left + r.width / 2 - caixa.left) / caixa.width
              : (r.top + r.height / 2 - caixa.top) / caixa.height,
          );
        };

        const paradas: Parada[] = Array.from(
          raiz.querySelectorAll<HTMLElement>("[data-momento]"),
        ).map((elemento) => {
          const icone = elemento.querySelector("[data-brand-icon]") ?? elemento;
          return { icone, fracao: medir(icone) };
        });
        if (!paradas.length) return;

        const limiteDeCarga = window.innerHeight * MARGEM_DE_CARGA;
        let jaVistas = 0;
        while (
          jaVistas < paradas.length &&
          paradas[jaVistas].icone.getBoundingClientRect().top < limiteDeCarga
        ) {
          jaVistas++;
        }
        // Tudo já na tela: não há o que desenhar sem antes apagar o que se vê.
        if (jaVistas === paradas.length) return;

        const pendentes = paradas.slice(jaVistas);
        const tracosDe = (parada: Parada) =>
          parada.icone.querySelectorAll<SVGPathElement>("path[data-drawable]");

        const instancia = createScope({ root: raiz });
        escopo = instancia;

        let ondaDesenhavel: ReturnType<typeof createDrawable>;
        let canetaEm = jaVistas > 0 ? paradas[jaVistas - 1].fracao : 0;

        instancia.add(() => {
          ondaDesenhavel = createDrawable(tracoDaOnda);
          definir(ondaDesenhavel, { draw: `0 ${canetaEm}` });

          pendentes.forEach((parada) => {
            definir(createDrawable(tracosDe(parada)), { draw: "0 0" });
          });

          // `createDrawable` escreve `pathLength` e o dasharray como atributos, que o
          // revert das animações não conhece. Sem esta limpeza, um revert no meio do
          // caminho deixaria a onda ou um ícone pela metade.
          return () => {
            raiz
              .querySelectorAll<SVGPathElement>(
                "[data-linha-do-dia] path, [data-brand-icon] path[data-drawable]",
              )
              .forEach((path) => {
                path.removeAttribute("pathLength");
                path.removeAttribute("stroke-dasharray");
                path.removeAttribute("stroke-dashoffset");
                path.style.removeProperty("stroke-linecap");
              });
          };
        });

        // Os trechos nascem dentro do escopo na hora de tocar (ver o cabeçalho).
        instancia.add("trecho", (ate: number, aoChegar: () => void) => {
          const distancia = ate - canetaEm;
          const ultimo = ate === 1;
          canetaEm = ate;
          if (distancia <= 0) {
            aoChegar();
            return;
          }
          animate(ondaDesenhavel, {
            draw: `0 ${ate}`,
            duration: Math.max(
              TRECHO_MINIMO_MS,
              distancia * DURACAO_DA_ONDA_MS,
            ),
            // Caneta em velocidade constante entre as paradas; só o fim da linha
            // desacelera, para o traço pousar em vez de bater na borda.
            ease: ultimo ? "out(3)" : "linear",
            onComplete: aoChegar,
          });
        });

        instancia.add("chegada", (parada: Parada, aoTerminar: () => void) => {
          animate(createDrawable(tracosDe(parada)), {
            draw: ["0 0", "0 1"],
            duration: DURACAO_DO_ICONE_MS,
            ease: "inOut(3)",
            delay: stagger(STAGGER_DOS_TRACOS_MS),
            onComplete: aoTerminar,
          });
        });

        // ---- A fila ----
        const liberadas = new Set<number>();
        let proxima = 0;
        let tocando = false;

        // Os ícones pendentes mais o trecho final. Quando tudo terminou, o escopo é
        // revertido: o resultado na tela é o mesmo (tudo desenhado e visível), mas sem
        // o dasharray calculado para a largura de agora, que um resize depois da
        // animação deixaria curto, cortando a onda.
        let restantes = pendentes.length + 1;
        const concluir = () => {
          restantes--;
          if (restantes === 0) encerrar();
        };

        const avancar = () => {
          if (encerrado || tocando) return;

          if (proxima === pendentes.length) {
            // Depois da noite, a linha termina o trecho que sobra até a borda.
            proxima++;
            tocando = true;
            instancia.methods.trecho(1, concluir);
            return;
          }

          if (!liberadas.has(proxima)) return;

          const parada = pendentes[proxima];
          tocando = true;
          instancia.methods.trecho(medir(parada.icone), () => {
            if (encerrado) return;
            // A caneta não espera o ícone terminar: segue para a próxima parada
            // enquanto ele se desenha. É isso que faz do `lg` um gesto contínuo.
            instancia.methods.chegada(parada, concluir);
            proxima++;
            tocando = false;
            avancar();
          });
        };

        pendentes.forEach((parada, indice) => {
          const observer = new IntersectionObserver(
            ([entrada]) => {
              if (!entrada.isIntersecting) return;
              observer.disconnect();
              liberadas.add(indice);
              // Quem chega por baixo (um link do menu, e depois rolando para cima)
              // libera esta parada antes das anteriores. As que já ficaram para trás,
              // acima da tela, são liberadas junto: senão a fila esperaria por elas e
              // esta parada ficaria sem ícone diante dos olhos.
              for (let anterior = 0; anterior < indice; anterior++) {
                if (
                  pendentes[anterior].icone.getBoundingClientRect().bottom < 0
                ) {
                  liberadas.add(anterior);
                }
              }
              avancar();
            },
            { rootMargin: MARGEM_DE_DISPARO, threshold: 0 },
          );
          observer.observe(parada.icone);
          observers.push(observer);
        });
      },
    );

    return encerrar;
  }, [reduzido, rootId]);

  return null;
}
