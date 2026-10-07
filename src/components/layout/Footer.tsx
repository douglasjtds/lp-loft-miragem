import Image from "next/image";

import { Pendencia } from "@/components/ui/Pendencia";
import { footer } from "@/config/content";

/**
 * Rodapé — landing-page-structure.md §5.11.
 *
 * Continua o ancora da faixa de fechamento: as duas seções leem como um bloco só, e é
 * assim que a página termina, escura e resolvida, logo abaixo das ondas do CtaFinal.
 *
 * A logo COMPLETA, versão clara (texto recolorido para `papel` na Fase 3): é o único
 * lugar da página onde ela aparece inteira. O header usa só o monograma.
 *
 * Texto em superficie-2 sobre ancora (8.15:1), a única situação em que a superficie-2
 * vira cor de texto, e ela existe na tabela da §3 exatamente para isto.
 *
 * A cidade/região não é enfeite: é o dado que mais pesa em busca local, e reaparece no
 * JSON-LD. `grid-cols-1` (minmax 0), `min-w-0` e `wrap-anywhere` seguram nomes de
 * anfitrião longos, handles e o crédito `<<A CONFIRMAR>>` sem estourar 390px.
 */

export function Footer() {
  return (
    <footer className="bg-ancora text-superficie-2">
      {/* A folga extra embaixo no mobile é a altura do StickyMobileCta: sem ela, a
          barra fixa cobre o crédito e o copyright, que são as últimas linhas da página. */}
      <div className="container-lp pt-12 pb-32 md:pt-16 md:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          <div className="min-w-0 md:col-span-5">
            <Image
              src="/brand/logo-clara.png"
              alt={footer.logoAlt}
              width={635}
              height={457}
              sizes="160px"
              className="h-auto w-36 sm:w-40"
            />
          </div>

          <div className="min-w-0 space-y-1 wrap-anywhere md:col-span-4">
            <p className="body text-papel">
              <Pendencia>{footer.nome}</Pendencia>
            </p>
            <p className="caption">
              <Pendencia>{footer.cidade}</Pendencia>
            </p>
          </div>

          <ul className="caption flex min-w-0 flex-wrap gap-x-6 wrap-anywhere md:col-span-3 md:flex-col md:items-start">
            {footer.contatos.map((contato) => (
              <li key={contato.label} className="min-w-0">
                {contato.href ? (
                  <a
                    href={contato.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="decoration-acento hover:text-papel inline-flex min-h-11 items-center underline underline-offset-4 transition-colors duration-200"
                  >
                    {contato.valor}
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center">
                    <Pendencia>{contato.valor}</Pendencia>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="caption border-superficie-2/20 mt-12 flex flex-col gap-2 border-t pt-6 wrap-anywhere sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          {/* O crédito só vira link quando há para onde apontar: um `<a>` sem href
              continua na ordem de foco do teclado e não leva a lugar nenhum. */}
          <p className="min-w-0">
            {footer.credito.prefixo}{" "}
            {footer.credito.href ? (
              <a
                href={footer.credito.href}
                target="_blank"
                rel="noopener noreferrer"
                className="decoration-acento hover:text-papel underline underline-offset-4 transition-colors duration-200"
              >
                {footer.credito.autor}
              </a>
            ) : (
              <Pendencia>{footer.credito.autor}</Pendencia>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
