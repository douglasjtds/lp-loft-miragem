"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Pendencia } from "@/components/ui/Pendencia";
import type { GaleriaFoto, galeria } from "@/config/content";

/**
 * Foto ampliada da galeria — landing-page-structure.md §5.4, DESIGN-GUIDELINES §10.
 *
 * `<dialog>` nativo aberto com `showModal()`: o navegador já entrega o foco preso
 * dentro, o resto da página inerte e o `Esc` fechando. O que este componente
 * acrescenta é o mínimo: setas ←/→ navegam, clique fora da foto fecha, o scroll da
 * página trava enquanto está aberto. Devolver o foco à miniatura de origem é trabalho
 * de quem abriu (`GaleriaGrade`), que é quem tem a referência dela.
 *
 * A foto aparece inteira (`object-contain`), sem máscara (§6), no tamanho intrínseco da
 * versão grande: `width`/`height` reais evitam CLS, e o `w-auto h-auto` com teto de
 * viewport impede que uma foto pequena (as pranchas, 640px) seja esticada. A versão
 * grande só é pedida quando o dialog abre: fechado, nenhum `<Image>` é renderizado.
 *
 * Fundo `ancora` sólido, sem blur (vidro fosco é tell de página gerada, §2). Sobre ele
 * o texto é `papel`/`superficie-2` e o anel de foco é `acento` (§10: `acento-texto`
 * reprovaria sobre `ancora`). Sem animação de abertura: se houver, é decisão da Fase 7.
 */

export type LightboxTextos = (typeof galeria)["lightbox"];

type LightboxProps = {
  fotos: readonly GaleriaFoto[];
  /** `null` = fechado. */
  indice: number | null;
  textos: LightboxTextos;
  onIr: (indice: number) => void;
  onFechar: () => void;
};

/** Botão de controle: alvo de 44×44 (§9), ícone Lucide 1.5px, foco âmbar sobre ancora. */
const controle =
  "inline-flex size-11 shrink-0 items-center justify-center text-papel transition-colors duration-200 hover:text-superficie-2 focus-visible:outline-acento";

export function Lightbox({
  fotos,
  indice,
  textos,
  onIr,
  onFechar,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const aberto = indice !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (aberto && !dialog.open) dialog.showModal();
    if (!aberto && dialog.open) dialog.close();

    if (!aberto) return;
    // `showModal` torna a página inerte, mas não impede o scroll por trás.
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      html.style.removeProperty("overflow");
    };
  }, [aberto]);

  const total = fotos.length;
  const foto = indice !== null ? fotos[indice] : null;

  function ir(passo: 1 | -1) {
    if (indice === null) return;
    onIr((indice + passo + total) % total);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={textos.dialogLabel}
      // Toda saída termina no evento `close`: Esc (o navegador fecha sozinho), o botão
      // e o clique fora chamam `dialog.close()`. Um caminho só para o estado acompanhar.
      onClose={onFechar}
      onKeyDown={(evento) => {
        if (evento.key === "ArrowRight") ir(1);
        if (evento.key === "ArrowLeft") ir(-1);
      }}
      // O dialog ocupa a tela inteira; um clique que cai nele, e não em um filho, é
      // um clique fora da foto.
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) evento.currentTarget.close();
      }}
      className="bg-ancora text-papel backdrop:bg-ancora fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none p-0"
    >
      {foto && indice !== null && (
        <div className="pointer-events-none flex h-full flex-col px-4 py-3 sm:px-8 sm:py-6">
          <div className="pointer-events-auto flex items-center justify-between gap-4">
            <p
              aria-live="polite"
              className="caption text-superficie-2 font-ui tabular-nums"
            >
              {textos.contador
                .replace("{atual}", String(indice + 1))
                .replace("{total}", String(total))}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={textos.fechar}
              className={controle}
            >
              <X size={24} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            <Image
              key={foto.srcGrande}
              src={foto.srcGrande}
              alt={foto.alt}
              width={foto.largura}
              height={foto.altura}
              sizes="100vw"
              // Nunca `lazy` (o padrão do next/image): com `w-auto h-auto` a caixa mede
              // 0×0 até a foto chegar, nunca cruza a viewport e a foto nunca carrega. E
              // aqui ela só existe porque a pessoa pediu para ver.
              loading="eager"
              className="pointer-events-auto h-auto max-h-[calc(100dvh-9.5rem)] w-auto max-w-full object-contain"
            />
          </div>

          <div className="pointer-events-auto flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label={textos.anterior}
              className={controle}
            >
              <ChevronLeft size={28} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <p
              aria-live="polite"
              className="caption font-ui text-papel min-w-0 text-center text-pretty"
            >
              <Pendencia>{foto.legenda}</Pendencia>
            </p>
            <button
              type="button"
              onClick={() => ir(1)}
              aria-label={textos.proxima}
              className={controle}
            >
              <ChevronRight size={28} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
