"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Lightbox, type LightboxTextos } from "@/components/ui/Lightbox";
import { OrganicImage } from "@/components/ui/OrganicImage";
import type { GaleriaFoto } from "@/config/content";
import { cn } from "@/lib/cn";

/**
 * A grade da galeria e o estado do lightbox — landing-page-structure.md §5.4.
 *
 * Client component só por causa do lightbox (qual foto está aberta, de onde ela foi
 * aberta). Recebe tudo por props do `Galeria`, que é server: importar content.ts aqui
 * levaria a copy da página inteira para o bundle do cliente.
 *
 * ## A grade
 *
 * Assimétrica: a 1ª foto é o destaque, 2×2, com a máscara `d`; as demais são
 * retângulos retos, porque a grade precisa ler como grade (DESIGN-GUIDELINES §6).
 * Celular em 2 colunas (o destaque na largura toda), `md` em 4.
 *
 * A altura das linhas vem da largura da grade, por container query: cada célula é um
 * retrato 3:4 (todo o acervo é vertical, §7), então a linha mede 4/3 da coluna. Com a
 * altura definida pela linha, e não por `aspect-ratio` em cada item, um item que ocupa
 * duas ou três colunas continua com a mesma altura dos vizinhos e só fica mais largo.
 *
 * O componente aceita de 4 a 12 fotos sem mudar código. O que muda com a quantidade é
 * a última linha: se ela não fechar, o último item estica até a borda (`spanDoUltimo`),
 * em vez de deixar um buraco na grade.
 *
 * Sem legenda na grade (decisão do Douglas em 2026-10-07): ela aparece no lightbox e no
 * rótulo acessível de cada miniatura.
 *
 * Vídeo (`tipo: "video"`) é só modelo de dados por enquanto (§5.4): o `Galeria` filtra
 * as fotos antes de chegar aqui. Quando houver vídeo, o poster entra na grade como
 * qualquer miniatura e o `<video>` nasce só dentro do lightbox.
 */

/**
 * Quantas colunas o último item ocupa para fechar a linha. `restantes` é o número de
 * fotos depois do destaque.
 *
 * Celular (2 colunas): o destaque ocupa as duas linhas iniciais inteiras, então sobra
 * uma linha incompleta só quando `restantes` é ímpar.
 *
 * `md` (4 colunas): ao lado do destaque cabem 4 fotos (2 colunas × 2 linhas); daí em
 * diante, linhas de 4.
 */
function spanDoUltimo(restantes: number, colunas: 2 | 4) {
  if (colunas === 2) return restantes % 2 === 1 ? 2 : 1;
  if (restantes <= 4) return restantes % 2 === 1 ? 2 : 1;
  const sobra = (restantes - 4) % 4;
  return sobra === 0 ? 1 : 5 - sobra;
}

/** Mapas literais: o scanner do Tailwind não enxerga classe montada em runtime. */
const spanMobile: Record<number, string> = {
  1: "",
  2: "col-span-2",
};

const spanDesktop: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  /* Sozinha na última linha, uma foto de 4 colunas × 1 linha viraria uma tira de
     3:1 cortada de um retrato (a pessoa do SUP perde o corpo). Com 2 linhas fica
     ~1,5:1, e a grade continua fechada porque ela é a última. */
  4: "md:col-span-4 md:row-span-2",
};

type GaleriaGradeProps = {
  fotos: readonly GaleriaFoto[];
  textos: LightboxTextos;
};

export function GaleriaGrade({ fotos, textos }: GaleriaGradeProps) {
  const [aberta, setAberta] = useState<number | null>(null);
  const miniaturas = useRef<(HTMLButtonElement | null)[]>([]);
  /** A miniatura que abriu o lightbox: é para ela que o foco volta (§10). */
  const origem = useRef<number | null>(null);

  function abrir(indice: number) {
    origem.current = indice;
    setAberta(indice);
  }

  function fechar() {
    setAberta(null);
    const voltar = origem.current;
    origem.current = null;
    if (voltar !== null) miniaturas.current[voltar]?.focus();
  }

  const restantes = fotos.length - 1;

  return (
    <>
      <div className="@container">
        <ul className="grid auto-rows-[calc((100cqw-0.5rem)*2/3)] grid-cols-2 gap-2 md:auto-rows-[calc((100cqw-3rem)/3)] md:grid-cols-4 md:gap-4">
          {fotos.map((foto, indice) => {
            const destaque = indice === 0;
            const ultimo = indice === fotos.length - 1 && !destaque;

            return (
              <li
                key={foto.src}
                className={cn(
                  destaque && "col-span-2 row-span-2",
                  ultimo && spanMobile[spanDoUltimo(restantes, 2)],
                  ultimo && spanDesktop[spanDoUltimo(restantes, 4)],
                )}
              >
                <button
                  ref={(elemento) => {
                    miniaturas.current[indice] = elemento;
                  }}
                  type="button"
                  onClick={() => abrir(indice)}
                  aria-label={textos.ampliar.replace("{legenda}", foto.legenda)}
                  aria-haspopup="dialog"
                  className="relative block h-full w-full cursor-zoom-in"
                >
                  {destaque ? (
                    <OrganicImage
                      src={foto.src}
                      alt={foto.alt}
                      shape="d"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="h-full w-full"
                    />
                  ) : (
                    <span className="relative block h-full w-full overflow-hidden">
                      <Image
                        src={foto.src}
                        alt={foto.alt}
                        fill
                        loading="lazy"
                        sizes={
                          ultimo
                            ? "(min-width: 768px) 75vw, 100vw"
                            : "(min-width: 768px) 25vw, 50vw"
                        }
                        className="object-cover"
                      />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Lightbox
        fotos={fotos}
        indice={aberta}
        textos={textos}
        onIr={setAberta}
        onFechar={fechar}
      />
    </>
  );
}
