import { Deriva } from "@/components/motion/Deriva";
import { organicClip } from "@/components/ui/OrganicClipPaths";
import { Section } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { ctaFinal } from "@/config/content";

/**
 * Fechamento — landing-page-structure.md §5.9.
 *
 * Faixa full-bleed ancora: o momento mais escuro e mais denso da página, fechando o
 * arco que começou no papel claro. O CTA inverte (fundo papel, texto ancora)
 * e é o único botão claro da página — por isso ele não some no meio do escuro.
 *
 * A decoração de fundo são dois blobs orgânicos, não fotos: aqui só objeto poderia
 * flutuar, e a pessoa retratada nunca é recorte flutuante (§9). Os blobs reusam duas
 * das quatro máscaras da §6, então pertencem à mesma família de formas do resto da
 * página em vez de virarem um ornamento avulso.
 *
 * Opacidade calibrada pelo CONTRASTE, não pelo olho — e é por isso que os valores são
 * 8% e 12% em vez de um número redondo. O caso a calcular é o pior: texto inteiramente
 * por cima de um blob. Componha a cor do blob sobre a `ancora` na opacidade escolhida e
 * verifique o par contra o texto que passa em cima; ele precisa continuar em AA.
 *
 * Ao trocar a paleta, REFAÇA essa conta. Blob mais claro ou mais opaco come a margem
 * silenciosamente — o texto não fica ilegível, fica só um pouco pior, que é o tipo de
 * regressão que ninguém percebe. Os dois também ficam presos aos cantos pela mesma razão.
 *
 * O `Deriva` põe os dois em movimento lento (23–29s, amplitude ≤20px) pelo
 * `data-derivavel`; sob `prefers-reduced-motion` nenhum loop começa e eles ficam
 * exatamente onde estão.
 */

export function CtaFinal() {
  return (
    <Section
      id={ctaFinal.id}
      background="ancora"
      aria-labelledby="cta-final-titulo"
      className="relative z-10"
    >
      {/* Camada decorativa. `overflow-hidden` é o que permite os blobs saírem pela
          borda do container sem criar scroll horizontal — inclusive enquanto derivam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          data-derivavel
          /* Bem para fora do canto: em qualquer posição mais central o blob passa por
             trás do título e come o contraste do papel sobre ancora. */
          className="bg-superficie-2/8 absolute -top-24 -left-28 h-56 w-56 sm:h-80 sm:w-80"
          style={{ clipPath: organicClip("c") }}
        />
        <div
          data-derivavel
          className="bg-decor/12 absolute -right-20 -bottom-16 h-64 w-64 sm:h-96 sm:w-96"
          style={{ clipPath: organicClip("d") }}
        />
      </div>

      <div className="max-w-2xl">
        <h2 id="cta-final-titulo" className="display-lg text-papel">
          {ctaFinal.titulo}
        </h2>

        <p className="body-lg medida text-superficie-2 mt-5">
          {ctaFinal.apoio}
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

      {/* Não renderiza nada: só solta o loop dos recortes acima, se for permitido. */}
      <Deriva rootId={ctaFinal.id} />
    </Section>
  );
}
