import { DrawIcons } from "@/components/motion/DrawIcons";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Section } from "@/components/ui/Section";
import { metodo } from "@/config/content";
import { cn } from "@/lib/cn";

/**
 * Método — landing-page-structure.md §5.4. **SEÇÃO-ASSINATURA.**
 *
 * Traduz o conceito central da marca em algo visível. É o único momento coreografado
 * da página: na Fase 7 os ícones se desenham, na ordem, uma única vez. Nada mais na
 * página compete com isso — por isso todo o resto é reveal discreto.
 *
 * Decisões que a §2 obriga, e que são o que separa esta seção do clichê:
 * - Os pilares são blocos EMPILHADOS que alternam o lado, não um grid de 3 colunas com
 *   ícone: essa grade é o clichê nº 1 da §2.5, e ela também espremeria os ícones para
 *   bem abaixo dos 120–160px que a seção pede.
 * - Foto em ALGUNS pilares, não em todos (`foto: null` nos demais). A lacuna é o que
 *   impede a seção de recair no ritmo de grade, e o que evita que as fotos disputem
 *   atenção com a animação-assinatura.
 * - As fotos alternam a orientação pela mesma razão — e porque o assunto muda: retrato
 *   onde o assunto é a pessoa, paisagem onde o assunto é a cena.
 *
 * Os ícones saem daqui com `animatable`, marcando cada `<path>` com `data-drawable` —
 * o seletor que o `createDrawable` do `DrawIcons` procura. Sem JS eles renderizam
 * desenhados, inteiros e estáticos: o apagar é aplicado por JS um instante antes de o
 * desenho começar, nunca pela marcação.
 */

export function Metodo() {
  return (
    <Section id={metodo.id} background="papel" aria-labelledby="metodo-titulo">
      <Eyebrow className="text-acento-texto">{metodo.eyebrow}</Eyebrow>

      <h2 id="metodo-titulo" className="display-lg medida text-ancora mt-4">
        {metodo.titulo}
      </h2>

      <p className="body-lg medida text-tinta mt-6">{metodo.intro}</p>

      <div className="mt-20 flex flex-col gap-20 md:mt-24 md:gap-28">
        {metodo.pilares.map((pilar, i) => {
          const invertido = i % 2 === 1;

          return (
            <article
              key={pilar.titulo}
              className="grid items-start gap-8 md:grid-cols-12 md:items-center md:gap-12"
            >
              <div
                className={cn(
                  "md:col-span-5",
                  invertido ? "md:order-2 md:col-start-8" : "md:order-1",
                )}
              >
                {/* 128px: dentro da faixa de 120–160 da §5.4 e bem acima do piso de
                    48px, abaixo do qual o traço de pincel desaparece. */}
                <BrandIcon
                  name={pilar.icone}
                  size={128}
                  animatable
                  className="text-ancora"
                />

                {/* Nem todo pilar tem foto (ver cabeçalho). A proporção vem de
                    `orientacao` em content.ts, não de um índice: assim trocar a
                    ordem dos pilares não embaralha o enquadramento das fotos. */}
                {pilar.foto && (
                  <OrganicImage
                    src={pilar.foto.src}
                    alt={pilar.foto.alt}
                    shape={pilar.foto.shape}
                    parallax
                    sizes="(min-width: 768px) 34vw, 90vw"
                    className={cn(
                      "mt-10 w-full",
                      pilar.foto.orientacao === "paisagem"
                        ? "aspect-[5/4] max-w-[22rem]"
                        : "aspect-[4/5] max-w-[20rem]",
                    )}
                    objectPosition={pilar.foto.objectPosition}
                  />
                )}
              </div>

              <div
                className={cn(
                  "md:col-span-6",
                  invertido ? "md:order-1 md:col-start-1" : "md:order-2",
                )}
              >
                <h3 className="font-ui text-ancora text-xl font-semibold">
                  {pilar.titulo}
                </h3>
                <p className="caption text-acento-texto mt-1">
                  {pilar.subtitulo}
                </p>
                <p className="body medida text-tinta mt-5">{pilar.texto}</p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Não renderiza nada: desenha os três ícones acima, na ordem, uma vez só (§8). */}
      <DrawIcons
        rootId={metodo.id}
        ordem={metodo.pilares.map((p) => p.icone)}
      />
    </Section>
  );
}
