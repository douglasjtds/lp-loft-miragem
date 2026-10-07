import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { oLoft } from "@/config/content";

/**
 * "Cabe no que a gente precisa?" — landing-page-structure.md §5.5.
 *
 * Depois do desejo (Experiência, Galeria) vem a pergunta objetiva, e a resposta é texto:
 * uma lista em duas colunas, NUNCA a grade de ícones de comodidade com rótulo embaixo
 * (o clichê nº 1 de anúncio de temporada, DESIGN-GUIDELINES §2). O marcador é um traço
 * curto em `acento`, que é decoração e não texto, então não entra na conta de contraste.
 *
 * 5/7: à esquerda o título, a frase e a capacidade numa linha só (são quatro números
 * que se leem juntos); à direita a lista. O CTA fica com o título, porque a dúvida que
 * ele resolve nasce de ler a lista.
 *
 * As pendências entram na MESMA lista, depois das comodidades confirmadas: são itens
 * que vão virar comodidade (ou sumir) quando os anfitriões responderem. O marcador
 * `<<A CONFIRMAR>>` pode ser longo, e `break-inside-avoid` impede que um item quebre
 * entre as duas colunas.
 */

export function OLoft() {
  const itens = [...oLoft.comodidades, ...oLoft.pendencias];

  return (
    <Section id={oLoft.id} background="creme" aria-labelledby="o-loft-titulo">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="o-loft-titulo" className="display-lg text-ancora">
            {oLoft.titulo}
          </h2>
          <p className="body-lg text-tinta mt-5 max-w-[34ch] text-pretty">
            <Pendencia>{oLoft.frase}</Pendencia>
          </p>
          <p className="font-ui text-ancora mt-6 font-semibold">
            {oLoft.capacidade.join(" · ")}
          </p>

          <WhatsappCta
            origem={oLoft.cta.origem}
            ariaLabel={oLoft.cta.ariaLabel}
            className="mt-8"
          >
            {oLoft.cta.label}
          </WhatsappCta>
        </div>

        <ul className="body text-tinta gap-x-10 sm:columns-2 lg:col-span-7 lg:pt-3">
          {itens.map((item) => (
            <li
              key={item}
              className="border-ancora/10 flex break-inside-avoid gap-3 border-t py-3"
            >
              <span
                aria-hidden="true"
                className="bg-acento mt-[0.8em] h-0.5 w-3 shrink-0"
              />
              <span className="min-w-0 text-pretty">
                <Pendencia>{item}</Pendencia>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
