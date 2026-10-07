import { ChevronDown } from "lucide-react";

import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { faq } from "@/config/content";

/**
 * Dúvidas — landing-page-structure.md §5.9.
 *
 * `<details>`/`<summary>` nativo: acessível de graça (teclado, leitor de tela, estado
 * expandido), zero JS, e a RESPOSTA INTEIRA fica no HTML mesmo fechada, então o crawler
 * lê tudo.
 *
 * Respostas que dependem dos anfitriões (preço, café, pet, horários) mostram o marcador
 * `<<A CONFIRMAR>>` visível até o dado chegar. O JSON-LD `FAQPage` sai do mesmo objeto
 * de content.ts e só leva as perguntas 100% confirmadas (`lib/schema`).
 *
 * O `::marker` padrão sai (`list-none` + o reset do WebKit) e entra o chevron do Lucide,
 * girado por CSS via `group-open`: feedback de estado, não animação de página (§8, CSS
 * puro). Ícone de interface, traço 1.5, nunca no mesmo bloco que os ícones da marca, que
 * só existem na Experiência (§5).
 *
 * Sem eyebrow: o Como reservar, duas seções antes, já usou o dele (§4).
 */

export function Faq() {
  return (
    <Section id={faq.id} background="papel" aria-labelledby="faq-titulo">
      <h2 id="faq-titulo" className="display-lg medida text-ancora">
        {faq.titulo}
      </h2>

      <div className="mt-10 md:mt-14">
        {faq.perguntas.map((item) => (
          <details
            key={item.pergunta}
            className="group border-ancora/15 border-t last:border-b"
          >
            <summary className="font-ui text-ancora hover:text-acento-texto flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-semibold transition-colors duration-200 md:py-6 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 text-pretty wrap-break-word">
                {item.pergunta}
              </span>
              <ChevronDown
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180"
              />
            </summary>
            {/* `\n\n` separa parágrafos; o `\n` simples é quebra dentro de um deles e
                quem resolve é o Pendencia, que renderiza DENTRO do <p> e por isso não
                tem como emitir <p> irmãos. */}
            <div className="space-y-4 pb-6 wrap-break-word md:pb-7">
              {item.resposta.split(/\n{2,}/).map((paragrafo, i) => (
                <p key={i} className="body medida text-tinta text-pretty">
                  <Pendencia>{paragrafo}</Pendencia>
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
