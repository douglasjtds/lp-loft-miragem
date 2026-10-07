import { Fragment } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { LinkExterno } from "@/components/ui/LinkExterno";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { avaliacoes } from "@/config/content";

/**
 * Avaliações — landing-page-structure.md §5.6.
 *
 * "É real e outros amaram." Avaliações do Google (e do Airbnb, quando chegarem os
 * prints), transcritas literalmente em content.ts. O componente nunca edita, corta nem
 * resume o texto: a voz do hóspede é a prova, inclusive o tamanho dela.
 *
 * Fundo superficie-2, a única faixa quente da página. Texto em Fraunces itálico, a voz
 * editorial que só aparece aqui. Sem aspas gigantes, avatar, estrela por avaliação,
 * logo de plataforma ou carrossel (DESIGN-GUIDELINES §2): a atribuição é texto.
 *
 * Masonry por CSS columns, duas no desktop e empilhado no celular. Duas e não três: o
 * itálico longo precisa de medida de leitura, e o ritmo vem justamente da diferença de
 * altura entre a avaliação de nove linhas e a de uma. `break-inside-avoid` impede que
 * uma avaliação comece numa coluna e termine na outra. A ordem de leitura desce pela
 * primeira coluna e depois pela segunda, que é a mesma do DOM e do leitor de tela.
 */

export function Depoimentos() {
  if (!avaliacoes.exibir || avaliacoes.itens.length === 0) return null;
  const avaliacoesLinks = avaliacoes.links.filter((link) => link.href);

  return (
    <Section
      id={avaliacoes.id}
      background="superficie"
      aria-labelledby="avaliacoes-titulo"
    >
      <Reveal>
        <h2 id="avaliacoes-titulo" className="display-lg medida text-ancora">
          {avaliacoes.titulo}
        </h2>
        <p className="font-ui text-ancora mt-4 font-semibold">
          <Pendencia>{avaliacoes.resumo}</Pendencia>
        </p>
      </Reveal>

      <Reveal atraso={120} className="mt-12 gap-x-16 md:mt-16 md:columns-2">
        {avaliacoes.itens.map((avaliacao) => (
          <figure
            key={`${avaliacao.fonte}-${avaliacao.nome}`}
            className="border-ancora/15 mb-10 break-inside-avoid border-t pt-6 md:mb-12"
          >
            <blockquote className="font-editorial text-ancora text-lg leading-relaxed text-pretty italic wrap-break-word sm:text-xl">
              <Pendencia>{avaliacao.texto}</Pendencia>
            </blockquote>
            <figcaption className="caption font-ui text-ancora-quente mt-4">
              <span className="font-semibold">{avaliacao.nome}</span> ·{" "}
              {avaliacao.quando} · {avaliacoes.rotuloFonte[avaliacao.fonte]}
            </figcaption>
          </figure>
        ))}
      </Reveal>

      {/* Links de fonte: quem quiser conferir vai direto à origem. Link sem destino
          confirmado (`href: null`) não renderiza, e o "ou" só aparece entre dois. */}
      <p className="text-ancora flex flex-wrap items-center gap-x-2 md:mt-12">
        {avaliacoesLinks.map((link, i) => (
          <Fragment key={link.label}>
            {i > 0 && (
              <span className="font-ui">{avaliacoes.linksSeparador}</span>
            )}
            <LinkExterno link={link} />
          </Fragment>
        ))}
      </p>
    </Section>
  );
}
