import { Reveal } from "@/components/motion/Reveal";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { avaliacoes } from "@/config/content";

/**
 * Avaliações — landing-page-structure.md §5.6.
 *
 * Avaliações reais do Google (e do Airbnb, quando chegarem os prints), transcritas
 * literalmente em content.ts. O componente nunca edita, corta nem resume o texto.
 *
 * Fundo superficie-2 com texto ancora. Tipografia editorial (Fraunces itálico). Sem
 * aspas gigantes, sem avatar, sem estrelas por card, sem carrossel.
 *
 * Render mínimo para compilar com o conteúdo da Fase 4; masonry e links finais são da
 * Fase 5.
 */

export function Depoimentos() {
  if (!avaliacoes.exibir || avaliacoes.itens.length === 0) return null;

  return (
    <Section
      id={avaliacoes.id}
      background="superficie"
      aria-labelledby="avaliacoes-titulo"
      className="text-ancora"
    >
      <Reveal>
        <h2 id="avaliacoes-titulo" className="display-lg medida">
          {avaliacoes.titulo}
        </h2>
        <p className="caption font-ui mt-4">{avaliacoes.resumo}</p>
      </Reveal>

      <Reveal atraso={120}>
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          {avaliacoes.itens.map((avaliacao) => (
            <figure key={`${avaliacao.fonte}-${avaliacao.nome}`}>
              <blockquote className="font-editorial medida text-xl leading-relaxed sm:text-2xl">
                <Pendencia>{avaliacao.texto}</Pendencia>
              </blockquote>
              <figcaption className="caption font-ui text-ancora-quente mt-5">
                {avaliacao.nome} · {avaliacao.quando} ·{" "}
                {avaliacoes.rotuloFonte[avaliacao.fonte]}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
