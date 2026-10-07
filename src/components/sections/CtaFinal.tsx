import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { ctaFinal } from "@/config/content";
import { ondaPath } from "@/lib/onda";

/**
 * Fechamento — landing-page-structure.md §5.10.
 *
 * Faixa full-bleed ancora: o momento mais escuro da página, fechando o arco que começou
 * no papel claro do herói. O CTA inverte (fundo papel, texto ancora) e é o único botão
 * claro da página, por isso não some no escuro.
 *
 * Embaixo, sangrando de borda a borda, as ondas de cinco cristas da logo em `decor`:
 * a página termina na água, como o emblema (o sol desce sobre as ondas). Decoração pura,
 * `aria-hidden`, presa à base da faixa e fora da área do texto.
 *
 * Contraste: as ondas são traço fino em `decor` a 10%. Composto sobre a ancora, dá algo
 * perto de #353D3E; `papel` e `superficie-2` continuam acima de 7:1 sobre isso, mesmo
 * no pior caso de uma onda passar atrás do texto. Ao trocar a paleta ou a opacidade,
 * refazer a conta (`scripts/contraste.mjs`).
 *
 * `data-derivavel` é o gancho da deriva da Fase 7 (≤16px, 20–30s). Até lá, e sob
 * reduced-motion para sempre, as ondas ficam paradas.
 */

const ONDAS = [0, 1, 2, 3, 4].map((i) =>
  ondaPath({
    cristas: 5,
    comprimento: 1000,
    amplitude: 10,
    centro: 20 + i * 36,
  }),
);

export function CtaFinal() {
  return (
    <Section
      id={ctaFinal.id}
      background="ancora"
      aria-labelledby="cta-final-titulo"
      /* Folga extra embaixo para as ondas não passarem atrás do CTA no celular, onde
         o `secao-y` é o menor. */
      className="pb-16 sm:pb-12"
    >
      {/* Posicionada pela <section> (que é `relative`), não pelo container: é isso
          que deixa as ondas irem de borda a borda da viewport. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden sm:h-36"
      >
        <svg
          data-derivavel
          focusable="false"
          viewBox="0 0 1000 184"
          preserveAspectRatio="none"
          className="text-decor/10 h-full w-full"
        >
          {ONDAS.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      <div className="relative max-w-2xl">
        <h2
          id="cta-final-titulo"
          className="display-lg text-papel text-balance"
        >
          {ctaFinal.titulo}
        </h2>

        <p className="body-lg medida text-superficie-2 mt-5 text-pretty">
          <Pendencia>{ctaFinal.apoio}</Pendencia>
        </p>

        <div className="mt-10">
          <WhatsappCta
            origem={ctaFinal.cta.origem}
            variant="inverso"
            ariaLabel={ctaFinal.cta.ariaLabel}
          >
            {ctaFinal.cta.label}
          </WhatsappCta>
        </div>
      </div>
    </Section>
  );
}
