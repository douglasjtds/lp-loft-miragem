import { HeroTimeline } from "@/components/motion/HeroTimeline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { organicClip } from "@/components/ui/OrganicClipPaths";
import { hero } from "@/config/content";

/**
 * Dobra — landing-page-structure.md §5.1.
 *
 * O trabalho da seção é resolver, em três segundos, "profissional séria e acolhedora"
 * e oferecer a única ação da página.
 *
 * Duas regras estruturais valem mais que o layout:
 *
 * 1. **NADA aqui começa invisível.** Nenhum `opacity-0` no HTML e nenhuma classe de
 *    animação: o LCP não pode depender de JS. Quem aplica o estado inicial da timeline
 *    é o `HeroTimeline`, via JS, depois de confirmar que a animação vai rodar — se o
 *    script falhar ou `reduced-motion` estiver ativo, a dobra aparece completa. Os
 *    `data-anim` abaixo são só endereços para ele; não carregam estilo nenhum.
 * 2. **Um h1 só na página inteira**, e é este.
 *
 * Server component: não há um único átomo de interatividade fora do CTA, que já é
 * client por conta própria.
 */

export function Hero() {
  return (
    <Section
      id={hero.id}
      background="papel"
      aria-labelledby="hero-titulo"
      /* Folga extra no topo só onde o `secao-y` (4rem em 390px) não limpa os 72px do
         header fixo. No desktop o padding da seção já dá conta. */
      className="pt-14 sm:pt-10 lg:pt-0"
    >
      {/* 55/45 no desktop (§7: grid 50/50 é o visual de template), empilhado no mobile.
          O texto vem primeiro no DOM e na tela pequena: é o que mantém o CTA acima da
          dobra em 390px, que é de onde vem a maior parte do tráfego. */}
      <div className="grid items-center gap-14 lg:grid-cols-[55fr_45fr] lg:gap-16">
        <div>
          <Eyebrow className="text-acento-texto" data-anim="eyebrow">
            <Pendencia>{hero.eyebrow}</Pendencia>
          </Eyebrow>

          <h1 id="hero-titulo" className="display-xl text-ancora mt-5">
            {/* Quebra manual, uma linha por span: é a unidade que a Fase 7 anima em
                stagger. `block` no lugar de <br> para a linha ser um alvo de animação. */}
            {hero.h1.map((linha) => (
              <span key={linha} data-hero-linha className="block">
                {linha}
              </span>
            ))}
          </h1>

          <p data-anim="subtitulo" className="body-lg medida text-tinta mt-6">
            {hero.subtitulo}
          </p>

          {/* Um CTA só na dobra. Nenhum secundário competindo (§5.1). */}
          <div data-anim="cta" className="mt-9">
            <WhatsappCta
              origem={hero.cta.origem}
              ariaLabel={hero.cta.ariaLabel}
            >
              {hero.cta.label}
            </WhatsappCta>
          </div>

          {/* `data-anim="disponibilidade"` é o endereço que o HeroTimeline já conhece. */}
          <p
            data-anim="disponibilidade"
            className="caption text-tinta-suave mt-5"
          >
            <Pendencia>{hero.prova}</Pendencia>
          </p>
        </div>

        {/* Coluna da foto. `max-w` no mobile para o retrato não ocupar uma tela inteira
            e empurrar tudo que vem depois para fora do campo de visão. */}
        <div className="relative mx-auto w-full max-w-[19rem] sm:mx-0 sm:max-w-[22rem] lg:max-w-none">
          {/* blob decorativo a 8% atrás da foto — decoração, nunca conteúdo (§6). Usa uma das
              máscaras orgânicas, e não border-radius, para pertencer à mesma família
              de formas da foto que ele acompanha. */}
          <div
            aria-hidden="true"
            data-parallax-blob
            className="bg-decor/8 absolute -top-6 -right-8 -bottom-10 -left-10"
            style={{ clipPath: organicClip("b") }}
          />

          <OrganicImage
            data-anim="foto"
            src={hero.foto.src}
            alt={hero.foto.alt}
            shape={hero.foto.shape}
            priority
            parallax
            sizes="(min-width: 1024px) 42vw, (min-width: 640px) 22rem, 19rem"
            className="aspect-[4/5] w-full"
            /* Mantém o sol no terço superior quando a caixa corta mais que 4:5. */
            objectPosition={hero.foto.objectPosition}
          />
        </div>
      </div>

      {/* Não renderiza nada. Lê os `data-anim` acima e só então aplica o estado
          inicial da entrada — depois da hidratação, e só se ela for permitida (§8). */}
      <HeroTimeline rootId={hero.id} />
    </Section>
  );
}
