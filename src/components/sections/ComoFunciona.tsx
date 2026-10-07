import { Eyebrow } from "@/components/ui/Eyebrow";
import { LinkExterno } from "@/components/ui/LinkExterno";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { comoReservar } from "@/config/content";

/**
 * Como reservar — landing-page-structure.md §5.7.
 *
 * Existe para eliminar a dúvida "e agora, como faço?": sem formulário, sem cadastro,
 * uma conversa com os anfitriões.
 *
 * É o ÚNICO lugar da página onde a numeração 01/02/03 aparece, porque o conteúdo é de
 * fato uma sequência, e por isso vem em `<ol>`. O número usa o estilo de eyebrow em vez
 * da display: a §4 reserva a Fraunces para h1 e h2. É também o 2º eyebrow da página
 * (o 1º é o do herói); Localização e Dúvidas, que vêm depois, não têm.
 *
 * Forma de pagamento e horários são promessa contratual: ficam como marcador visível
 * até a cliente responder. Número inventado aqui é o tipo de erro que só aparece quando
 * alguém cobra.
 *
 * O WhatsApp é o botão; o Airbnb é link de texto embaixo dele, nunca segundo botão
 * (§10), no mesmo arranjo do herói.
 *
 * A foto é opcional e dirigida por dados (hoje `null`): a sequência se explica sozinha,
 * e foto de banco aqui seria pior que nenhuma. Sem foto, o texto fica na coluna larga.
 */

export function ComoFunciona() {
  return (
    <Section
      id={comoReservar.id}
      background="papel"
      aria-labelledby="como-reservar-titulo"
    >
      {/* 7/5 e não 6/6: metade-metade é o visual de template que a §7 rejeita. */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-12">
        <div className="md:col-span-7">
          <Eyebrow className="text-acento-texto">
            {comoReservar.eyebrow}
          </Eyebrow>

          <h2
            id="como-reservar-titulo"
            className="display-lg medida text-ancora mt-4"
          >
            {comoReservar.titulo}
          </h2>

          <p className="body-lg medida text-tinta mt-6 text-pretty">
            <Pendencia>{comoReservar.intro}</Pendencia>
          </p>
        </div>

        {comoReservar.foto && (
          <OrganicImage
            src={comoReservar.foto.src}
            alt={comoReservar.foto.alt}
            shape={comoReservar.foto.shape}
            sizes="(min-width: 768px) 38vw, 100vw"
            className="aspect-[4/5] w-full md:col-span-5 md:col-start-8"
            objectPosition={comoReservar.foto.objectPosition}
          />
        )}
      </div>

      <ol className="mt-12 md:mt-16">
        {comoReservar.etapas.map((etapa) => (
          <li
            key={etapa.numero}
            /* O filete fecha embaixo no último item: a sequência precisa ter fim
               visível, senão a última etapa parece cortada. */
            className="border-ancora/15 grid grid-cols-1 gap-x-10 gap-y-2 border-t py-7 last:border-b md:grid-cols-12 md:py-9"
          >
            <Eyebrow as="span" className="text-acento-texto md:col-span-2">
              {etapa.numero}
            </Eyebrow>
            <h3 className="font-ui text-ancora text-lg font-semibold md:col-span-4">
              {etapa.titulo}
            </h3>

            <div className="min-w-0 space-y-4 wrap-break-word md:col-span-6">
              {etapa.paragrafos.map((paragrafo, i) => (
                <p key={i} className="body medida text-tinta text-pretty">
                  <Pendencia>{paragrafo}</Pendencia>
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-6 md:mt-12">
        <WhatsappCta
          origem={comoReservar.cta.origem}
          ariaLabel={comoReservar.cta.ariaLabel}
        >
          {comoReservar.cta.label}
        </WhatsappCta>
        <LinkExterno
          link={comoReservar.airbnb}
          className="text-ancora text-sm"
        />
      </div>
    </Section>
  );
}
