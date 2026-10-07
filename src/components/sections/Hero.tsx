import { Eyebrow } from "@/components/ui/Eyebrow";
import { LinkExterno } from "@/components/ui/LinkExterno";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { hero } from "@/config/content";

/**
 * Dobra — landing-page-structure.md §5.1.
 *
 * O trabalho da seção é resolver, em três segundos, "esse lugar é especial e é para
 * nós dois", e oferecer a ação.
 *
 * No mobile a FOTO abre a página: é ela que vende, e o pôr do sol na represa é o
 * conceito da marca fotografado (DESIGN-GUIDELINES §1). A máscara `a` faz a foto
 * terminar numa onda, e o texto começa logo abaixo da água. A altura dela é limitada
 * para o CTA continuar visível sem rolar em 390×844, que é o celular de quem chega
 * pela bio do Instagram. Se um dia o CTA cair da dobra, quem cede é a foto, nunca a
 * escala tipográfica.
 *
 * No desktop, 55/45 com o texto à esquerda (§7: 50/50 é visual de template).
 *
 * Regras estruturais:
 * 1. **NADA aqui começa invisível.** Nenhum `opacity-0` no HTML: o LCP não pode
 *    depender de JS. Os `data-anim` são endereços para a timeline da Fase 7; até lá,
 *    e sob `reduced-motion` para sempre, são inertes.
 * 2. **Um h1 só na página inteira**, e é este.
 * 3. **Um botão só.** O Airbnb é link de texto embaixo dele, nunca segundo botão (§10).
 *
 * Sem grafismo atrás da foto: o retângulo `decor` a 8% que o scaffold trazia lia como
 * um card pastel emoldurando a imagem, e a onda da máscara já faz o papel de "água".
 */

export function Hero() {
  return (
    <Section
      id={hero.id}
      background="papel"
      spacing="hero"
      aria-labelledby="hero-titulo"
    >
      <div className="grid gap-8 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-16">
        {/* Foto primeiro no DOM porque é a primeira coisa na tela do celular. No `lg`
            ela vai para a coluna da direita; como não é focável, a ordem de foco não
            muda. */}
        <div className="relative lg:col-start-2 lg:row-start-1">
          <OrganicImage
            data-anim="foto"
            src={hero.foto.src}
            alt={hero.foto.alt}
            shape={hero.foto.shape}
            priority
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 90vw, 100vw"
            className="h-[clamp(13rem,32svh,20rem)] w-full sm:h-[clamp(16rem,40svh,26rem)] lg:aspect-[4/5] lg:h-auto"
            objectPosition={hero.foto.objectPosition}
          />
        </div>

        <div className="lg:col-start-1 lg:row-start-1">
          <Eyebrow className="text-acento-texto" data-anim="eyebrow">
            <Pendencia>{hero.eyebrow}</Pendencia>
          </Eyebrow>

          <h1 id="hero-titulo" className="display-xl text-ancora mt-4">
            {/* Uma linha por span: é a unidade que a Fase 7 anima em stagger. */}
            {hero.h1.map((linha) => (
              <span key={linha} data-hero-linha className="block">
                {linha}
              </span>
            ))}
          </h1>

          <p
            data-anim="subtitulo"
            className="body-lg medida text-tinta mt-5 text-pretty"
          >
            <Pendencia>{hero.subtitulo}</Pendencia>
          </p>

          <div
            data-anim="cta"
            className="mt-8 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-6"
          >
            <WhatsappCta
              origem={hero.cta.origem}
              ariaLabel={hero.cta.ariaLabel}
            >
              {hero.cta.label}
            </WhatsappCta>
            <LinkExterno link={hero.airbnb} className="text-ancora text-sm" />
          </div>

          <p
            data-anim="disponibilidade"
            className="caption text-tinta-suave mt-4 text-pretty"
          >
            <Pendencia>{hero.prova}</Pendencia>
          </p>
        </div>
      </div>
    </Section>
  );
}
