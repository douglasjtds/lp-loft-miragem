import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { comoReservar as comoFunciona } from "@/config/content";

/**
 * Como funciona — landing-page-structure.md §5.5.
 *
 * Existe para eliminar a incerteza de "o que acontece se eu chamar no WhatsApp?".
 *
 * É o ÚNICO lugar da página onde a numeração 01/02/03 é permitida, porque o conteúdo é
 * de fato uma sequência — e por isso vem em `<ol>`, não em `<ul>`. O número usa o estilo
 * de eyebrow (Montserrat, caixa alta, tracking largo) em vez da display: a §4 reserva a
 * família display para h1, h2 e o lockup do logo.
 *
 * Prazos e durações vêm da cliente e ficam como marcador até chegarem. Número
 * inventado aqui é promessa contratual falsa: destrói a credibilidade que a página
 * inteira constrói, e é o tipo de erro que só aparece depois que alguém cobra.
 *
 * A foto (opcional) abre a seção, ao lado do título — nunca dentro de uma etapa. Ela é
 * a única da página que mostra PROCEDIMENTO, o atendimento acontecendo, e é por isso
 * que ela pertence a esta seção e a nenhuma outra: fora daqui a mesma imagem viraria
 * símbolo da marca, que é coisa diferente e costuma ser justamente o que os códigos de
 * ética restringem.
 *
 * Dentro de uma etapa ela não funciona: a caixa estreita, somada à máscara orgânica e
 * ao `scale` do parallax, come as bordas do quadro — e em foto de procedimento o
 * assunto quase sempre está nas bordas (mãos, instrumento, a outra pessoa).
 */

export function ComoFunciona() {
  return (
    <Section
      id={comoFunciona.id}
      background="creme"
      aria-labelledby="como-reservar-titulo"
    >
      <Reveal>
        {/* 7/5 e não 6/6: metade-metade é o visual de template que a §7 rejeita, e o
            texto precisa da coluna maior porque o h2 é display. `items-center` alinha
            a foto pelo miolo do bloco de texto, não pelo topo — encostada no topo ela
            competiria com o h2 em vez de acompanhá-lo. */}
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
          <div className="md:col-span-7">
            <Eyebrow className="text-acento-texto">
              {comoFunciona.eyebrow}
            </Eyebrow>

            <h2
              id="como-reservar-titulo"
              className="display-lg medida text-ancora mt-4"
            >
              {comoFunciona.titulo}
            </h2>

            <p className="body-lg medida text-tinta mt-6">
              {comoFunciona.intro}
            </p>
          </div>

          {/* Caixa quadrada e mais larga que a proporção da fonte: o `cover` corta só
              na vertical, e a largura inteira do quadro sobrevive. É o que preserva o
              que está encostado nas bordas, que em foto de procedimento costuma ser o
              assunto.

              SEM `parallax`, e é decisão desta foto, não esquecimento: o keyframe
              carrega `scale(1.12)` para o deslocamento não descobrir a borda do
              recorte, e esses 6% por lado apagam exatamente a faixa das bordas. Foto de
              retrato tem o assunto no centro e absorve o zoom; esta não absorve.

              Se `comoFunciona.foto` for null, a seção fica só com o texto na coluna
              larga — que é o desenho correto quando não existe foto REAL de
              atendimento. Foto de banco aqui destrói a única coisa que a seção tem a
              oferecer, que é ser verdadeira. */}
          {comoFunciona.foto && (
            <OrganicImage
              src={comoFunciona.foto.src}
              alt={comoFunciona.foto.alt}
              shape={comoFunciona.foto.shape}
              sizes="(min-width: 768px) 38vw, 100vw"
              className="aspect-square w-full md:col-span-5 md:col-start-8"
              objectPosition={comoFunciona.foto.objectPosition ?? "50% 34%"}
            />
          )}
        </div>
      </Reveal>

      <Reveal atraso={120}>
        <ol className="mt-14 md:mt-16">
          {comoFunciona.etapas.map((etapa) => (
            <li
              key={etapa.numero}
              /* O filete fecha embaixo no último item: a sequência precisa ter fim
               visível, senão a última etapa parece cortada. */
              className="border-ancora/15 grid gap-x-10 gap-y-2 border-t py-7 last:border-b md:grid-cols-12 md:py-9"
            >
              <Eyebrow as="span" className="text-acento-texto md:col-span-2">
                {etapa.numero}
              </Eyebrow>
              <h3 className="font-ui text-ancora text-lg font-semibold md:col-span-4">
                {etapa.titulo}
              </h3>

              <div className="space-y-4 md:col-span-6">
                {etapa.paragrafos.map((paragrafo, i) => (
                  <p key={i} className="body medida text-tinta">
                    <Pendencia>{paragrafo}</Pendencia>
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-12">
        <WhatsappCta
          origem={comoFunciona.cta.origem}
          variant="secondary"
          ariaLabel={comoFunciona.cta.ariaLabel}
        >
          {comoFunciona.cta.label}
        </WhatsappCta>
      </div>
    </Section>
  );
}
