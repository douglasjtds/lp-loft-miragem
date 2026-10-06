import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { sobre } from "@/config/content";

/**
 * Sobre — landing-page-structure.md §5.6.
 *
 * O trabalho aqui é humanizar: é a seção em que "acolhimento" precisa ser sentido, não
 * afirmado. Layout 5/7 com a foto à ESQUERDA, invertendo o herói — a alternância é o
 * que mantém a página fora do ritmo de template (§7).
 *
 * A máscara é obrigatoriamente diferente da do herói (§5.6): `shape` vem de content.ts
 * já com essa restrição resolvida.
 *
 * Os parágrafos estão majoritariamente em marcador porque dependem inteiramente da
 * história dela. Inventar trajetória é a mesma classe de erro que inventar depoimento.
 */

export function Sobre() {
  return (
    <Section id={sobre.id} background="papel" aria-labelledby="sobre-titulo">
      <Reveal>
        <div className="grid items-start gap-12 md:grid-cols-12 md:gap-14">
          <div className="mx-auto w-full max-w-[20rem] md:col-span-5 md:mx-0 md:max-w-none">
            <OrganicImage
              src={sobre.foto.src}
              alt={sobre.foto.alt}
              shape={sobre.foto.shape}
              parallax
              sizes="(min-width: 768px) 40vw, 20rem"
              className="aspect-[4/5] w-full"
              /* Não é ajuste de gosto: é orçamento de folga. A 30% o topo da cabeça
                 caía em y≈0.09 do quadro, e o `scale(1.12)` + `translateY(-3.5%)` do
                 parallax ainda a levava para y≈0.004 — encostada na borda. A 15% ela
                 estaciona em y≈0.077 (pior caso 0.042), acima do platô da máscara. O
                 corte extra sai todo da barra do vestido. */
              objectPosition="50% 15%"
            />
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Eyebrow className="text-acento-texto">{sobre.eyebrow}</Eyebrow>

            <h2 id="sobre-titulo" className="display-lg text-ancora mt-4">
              {sobre.titulo}
            </h2>

            <div className="mt-6 space-y-5">
              {sobre.paragrafos.map((paragrafo, i) => (
                <p key={i} className="body-lg medida text-tinta">
                  <Pendencia>{paragrafo}</Pendencia>
                </p>
              ))}
            </div>

            {/* Formação e registro fecham o bloco, em caption (§5.6). */}
            <ul className="caption text-tinta-suave mt-10 space-y-1">
              {sobre.credenciais.map((credencial, i) => (
                <li key={i}>
                  <Pendencia>{credencial}</Pendencia>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
