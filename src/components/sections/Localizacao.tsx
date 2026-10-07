import { Reveal } from "@/components/motion/Reveal";
import { LinkExterno } from "@/components/ui/LinkExterno";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { localizacao } from "@/config/content";
import { ondaPath } from "@/lib/onda";

/**
 * Onde fica — landing-page-structure.md §5.8.
 *
 * "Onde fica e como chego?" é a objeção nº 1 de destino fora da capital. A resposta é
 * texto e um link de texto para o Google Maps, nunca iframe de mapa: pesa, traz
 * rastreador, causa CLS e não converte (§2, fora de escopo).
 *
 * O link só aparece quando a cliente aprovar mostrar a localização (`mapa.href`).
 * Enquanto for `null`, a pendência fica visível no lugar dele. O Airbnb só revela o
 * endereço depois da reserva, e os anfitriões podem preferir a mesma política.
 *
 * Ao lado, em vez de foto (as cinco do acervo já aparecem duas vezes cada), a água do
 * emblema: cinco ondas de cinco cristas empilhadas, a mesma onda da linha do dia
 * (`lib/onda`), em grafite translúcido alternado, como as faixas da logo. O desenho
 * inteiro é `aria-hidden`. Lados retos: é um retângulo de
 * água, não um círculo (o círculo é da logo).
 *
 * 7/5 no `lg`, texto à esquerda. No celular o texto vem primeiro e a água vira uma faixa
 * baixa embaixo dele, para não empurrar o conteúdo.
 */

const FAIXAS = 5;
const ESPACO = 60;

const ondas = Array.from({ length: FAIXAS }, (_, i) => ({
  d: ondaPath({
    cristas: 5,
    comprimento: 1000,
    amplitude: 14,
    centro: ESPACO / 2 + i * ESPACO,
  }),
  /* Alternância das faixas do emblema, em grafite translúcido como a linha do dia: o
     turquesa sobre fundo claro só entraria a 8–12% (§3, §6), e a essa opacidade some
     no creme. Classes por extenso para o scanner do Tailwind. */
  className: i % 2 === 0 ? "text-ancora/30" : "text-ancora/15",
}));

export function Localizacao() {
  return (
    <Section
      id={localizacao.id}
      background="creme"
      aria-labelledby="localizacao-titulo"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="min-w-0 wrap-break-word lg:col-span-7">
          <h2 id="localizacao-titulo" className="display-lg medida text-ancora">
            {localizacao.titulo}
          </h2>

          <div className="mt-6 space-y-3">
            {localizacao.paragrafos.map((paragrafo, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "body-lg medida text-tinta text-pretty"
                    : "body medida text-tinta text-pretty"
                }
              >
                <Pendencia>{paragrafo}</Pendencia>
              </p>
            ))}
          </div>

          <div className="mt-6">
            {localizacao.mapa.href ? (
              <LinkExterno link={localizacao.mapa} className="text-ancora" />
            ) : (
              <p className="body medida text-tinta text-pretty">
                <Pendencia>{localizacao.mapaPendencia}</Pendencia>
              </p>
            )}
          </div>
        </Reveal>

        <svg
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 1000 ${FAIXAS * ESPACO}`}
          preserveAspectRatio="none"
          className="h-28 w-full sm:h-36 lg:col-span-5 lg:col-start-8 lg:h-64"
        >
          {ondas.map((onda) => (
            <path
              key={onda.d}
              d={onda.d}
              className={onda.className}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
    </Section>
  );
}
