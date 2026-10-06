import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { paraQuem } from "@/config/content";
import { cn } from "@/lib/cn";

/**
 * "Para quem é" — landing-page-structure.md §5.3.
 *
 * A seção que mais reduz rejeição: o visitante precisa se reconhecer numa das
 * situações. Por isso os textos estão na voz de quem visita, não na da profissional.
 *
 * Layout escalonado, e não grid simétrico (§5.3), e sem ícone genérico ao lado de cada
 * item (§2.5) — o item é uma frase, e frase não precisa de enfeite. O que separa um
 * perfil do outro é o filete de acento, o único acento decorativo permitido aqui.
 */

/**
 * O escalonamento é escrito por extenso, um por perfil: com 12 colunas, larguras e
 * início alternados quebram o alinhamento de grade que denuncia template. Se um quinto
 * perfil aparecer, o ciclo recomeça no primeiro (`% length`).
 */
const escalonamento = [
  "md:col-span-7 md:col-start-1",
  "md:col-span-6 md:col-start-7",
  "md:col-span-6 md:col-start-2",
  "md:col-span-7 md:col-start-6",
];

export function ParaQuem() {
  return (
    <Section
      id={paraQuem.id}
      background="creme"
      aria-labelledby="para-quem-titulo"
    >
      <Reveal>
        <Eyebrow className="text-acento-texto">{paraQuem.eyebrow}</Eyebrow>

        <h2
          id="para-quem-titulo"
          className="display-lg medida text-ancora mt-4"
        >
          {paraQuem.titulo}
        </h2>
      </Reveal>

      <Reveal atraso={120}>
        <ul className="mt-14 grid gap-x-10 gap-y-12 md:mt-20 md:grid-cols-12 md:gap-y-16">
          {paraQuem.perfis.map((perfil, i) => (
            <li
              key={perfil.titulo}
              className={cn(escalonamento[i % escalonamento.length])}
            >
              <span
                aria-hidden="true"
                className="bg-acento mb-5 block h-px w-10"
              />
              <h3 className="font-ui text-ancora text-lg font-semibold sm:text-xl">
                {perfil.titulo}
              </h3>
              <p className="body medida text-tinta mt-3">{perfil.texto}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <p className="body-lg medida text-ancora mt-14 md:mt-20">
          {paraQuem.fechamento}
        </p>
      </Reveal>
    </Section>
  );
}
