import Image from "next/image";

import { Pendencia } from "@/components/ui/Pendencia";
import { footer } from "@/config/content";

/**
 * Rodapé — landing-page-structure.md §5.10.
 *
 * Continua o ancora da faixa de fechamento: as duas seções leem como um bloco só, e
 * é assim que a página termina — escura, densa, resolvida.
 *
 * Texto em superficie-2 sobre ancora. É a única situação em que a superficie-2
 * aparece como cor de texto, e ela existe na tabela da §3 exatamente para isto.
 *
 * A cidade/região não é enfeite: é o dado que mais pesa em busca local, e reaparece no
 * JSON-LD da Fase 6.
 */

export function Footer() {
  return (
    <footer className="bg-ancora text-superficie-2">
      {/* A folga extra embaixo no mobile é a altura do StickyMobileCta: sem ela, a
          barra fixa cobre o crédito e o copyright, que são as últimas linhas da página. */}
      <div className="container-lp pt-16 pb-32 md:pb-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/brand/monograma-claro.png"
              alt={footer.monogramaAlt}
              width={114}
              height={128}
              className="h-12 w-auto"
            />

            <p className="body text-papel mt-6">
              <Pendencia>{footer.nome}</Pendencia>
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="caption">
              <Pendencia>{footer.cidade}</Pendencia>
            </p>
          </div>

          <ul className="caption space-y-2 md:col-span-4">
            {footer.contatos.map((contato) => (
              <li key={contato.label}>
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

        <div className="caption border-superficie-2/20 mt-14 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          {/* O crédito só vira link quando há para onde apontar: um `<a>` sem href
              continua na ordem de foco do teclado e não leva a lugar nenhum. */}
          <p>
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
