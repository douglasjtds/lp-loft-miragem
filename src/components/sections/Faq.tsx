import { ChevronDown } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { faq } from "@/config/content";

/**
 * Dúvidas — landing-page-structure.md §5.8.
 *
 * `<details>`/`<summary>` nativo: acessível de graça (teclado, leitor de tela, estado
 * expandido), zero JS, e — o que mais importa aqui — a RESPOSTA INTEIRA fica no HTML
 * mesmo fechada, então o crawler lê tudo. É a seção que mais rende cauda longa em busca.
 *
 * O `::marker` padrão sai (`list-none` + o reset do WebKit) e entra o chevron do Lucide,
 * girado por CSS via `group-open`. Ícone de interface, peso fino — nunca confundido com
 * os três ícones da marca, que só existem no Método (§5).
 *
 * O conteúdo espelha exatamente o JSON-LD `FAQPage` da Fase 6; as duas fontes saem do
 * mesmo objeto de content.ts justamente para não divergirem.
 */

export function Faq() {
  return (
    <Section id={faq.id} background="creme" aria-labelledby="faq-titulo">
      <Reveal>
        <Eyebrow className="text-acento-texto">{faq.eyebrow}</Eyebrow>

        <h2 id="faq-titulo" className="display-lg medida text-ancora mt-4">
          {faq.titulo}
        </h2>
      </Reveal>

      <Reveal atraso={120} className="mt-12 md:mt-16">
        {faq.perguntas.map((item) => (
          <details
            key={item.pergunta}
            className="group border-ancora/15 border-t last:border-b"
          >
            <summary className="font-ui text-ancora hover:text-acento-texto flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base font-semibold transition-colors duration-200 [&::-webkit-details-marker]:hidden">
              {item.pergunta}
              <ChevronDown
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180"
              />
            </summary>
            {/* `\n\n` separa parágrafos; o `\n` simples é quebra dentro de um deles e
                quem resolve é o Pendencia. A divisão fica aqui, e não no parser, porque
                Pendencia renderiza DENTRO do <p> — não tem como emitir <p> irmãos. */}
            <div className="space-y-5 pb-7">
              {item.resposta.split(/\n{2,}/).map((paragrafo, i) => (
                <p key={i} className="body medida text-tinta">
                  <Pendencia>{paragrafo}</Pendencia>
                </p>
              ))}
            </div>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
