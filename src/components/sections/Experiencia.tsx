import { LinhaDoDia } from "@/components/motion/LinhaDoDia";
import { Reveal } from "@/components/motion/Reveal";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { experiencia, type Momento } from "@/config/content";
import { cn } from "@/lib/cn";
import { ondaPath } from "@/lib/onda";

/**
 * A seção-assinatura — landing-page-structure.md §5.3.
 *
 * Um dia no loft, manhã → tarde → noite. É uma SEQUÊNCIA, então é uma linha do tempo,
 * nunca três cards lado a lado: a onda da logo atravessa a seção e cada momento é uma
 * parada nela. No celular a linha desce pela esquerda; no `lg` corre na horizontal e o
 * conteúdo alterna dos dois lados dela.
 *
 * O ritmo das paradas é desigual de propósito: manhã e noite têm foto (máscara `b`, a
 * da noite espelhada), a tarde não tem e compensa com o ícone maior (160px contra
 * 120px). Foto / ícone / foto é o que impede o empilhamento de ler como template.
 *
 * No `lg` a linha do tempo é uma grade 3×3: linha 1 o que fica acima da onda, linha 2 a
 * onda com os ícones, linha 3 o que fica abaixo. A `ol` e cada `li` herdam as linhas
 * por `subgrid`, e é isso que alinha os três ícones na mesma altura da onda sem número
 * mágico de posição. O texto fica sempre encostado na linha; a foto, longe dela.
 *
 * A única animação coreografada da página (§8) é a `LinhaDoDia`: a onda se desenha e
 * cada ícone se desenha quando a caneta chega na sua parada. Ela se
 * acha pelos ganchos daqui: `data-linha-do-dia` nas duas ondas, `data-momento` em cada
 * parada e `animatable` nos ícones. Texto e foto de cada parada entram pelo `Reveal`,
 * no tempo deles. Sem JS e sob reduced-motion, tudo nasce desenhado e visível.
 */

/*
 * As duas SVGs usam `preserveAspectRatio="none"`: a onda estica junto com a seção e o
 * `non-scaling-stroke` mantém o traço com a mesma espessura em qualquer tamanho.
 */
const ONDA_HORIZONTAL = ondaPath({
  cristas: 5,
  comprimento: 1000,
  amplitude: 6,
  centro: 12,
  vertical: false,
});

const ONDA_VERTICAL = ondaPath({
  cristas: 5,
  comprimento: 1000,
  amplitude: 5,
  centro: 12,
  vertical: true,
});

/** O traço da linha: grafite suave, mais fino que o dos ícones, para os ícones mandarem. */
const tracoDaLinha = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

/** A tarde não tem foto: o ícone faz o papel da imagem da parada. */
function tamanhoDoIcone(momento: Momento) {
  return momento.foto ? 120 : 160;
}

function Parada({ momento, indice }: { momento: Momento; indice: number }) {
  const tituloId = `experiencia-${momento.chave}`;
  /* No `lg`, quem tem foto fica acima da onda; quem não tem, abaixo. Com manhã e noite
     fotografadas e a tarde não, isso é exatamente a alternância da §5.3. */
  const acimaDaLinha = momento.foto !== null;

  return (
    <li
      data-momento={momento.chave}
      aria-labelledby={tituloId}
      className="relative flex flex-col gap-6 pl-12 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:pl-0"
    >
      {/* O ícone, no mesmo eixo esquerdo do texto. No `lg` o fundo papel e o respiro à
          direita interrompem a onda: cada momento vira uma parada na linha, e o traço
          não atravessa o desenho. */}
      <div className="text-ancora lg:row-start-2 lg:flex lg:items-center">
        <div className="lg:bg-papel lg:pr-6">
          <BrandIcon
            name={momento.icone}
            size={tamanhoDoIcone(momento)}
            animatable
          />
        </div>
      </div>

      <Reveal
        className={cn(
          "flex flex-col gap-6",
          acimaDaLinha
            ? "lg:row-start-1 lg:justify-end lg:pb-10"
            : "lg:row-start-3 lg:pt-10",
        )}
      >
        <div className={cn(acimaDaLinha && "lg:order-last")}>
          <p className="caption text-acento-texto font-ui font-semibold">
            {momento.rotulo}
          </p>
          <h3 id={tituloId} className="display-md text-ancora mt-2">
            {momento.titulo}
          </h3>
          <p className="body text-tinta mt-3 max-w-[38ch] text-pretty">
            <Pendencia>{momento.texto}</Pendencia>
          </p>
        </div>

        {momento.foto && (
          <OrganicImage
            src={momento.foto.src}
            alt={momento.foto.alt}
            shape={momento.foto.shape}
            espelhada={momento.foto.espelhada}
            objectPosition={momento.foto.objectPosition}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 70vw, 85vw"
            className={cn(
              "aspect-[4/5] w-[86%] max-w-sm lg:w-full lg:max-w-none",
              /* No celular, a noite encosta na direita: as duas fotos não ficam na
                 mesma coluna e a descida da linha ganha um balanço. */
              indice > 0 && "self-end lg:self-auto",
            )}
          />
        )}
      </Reveal>
    </li>
  );
}

export function Experiencia() {
  return (
    <Section
      id={experiencia.id}
      background="papel"
      aria-labelledby="experiencia-titulo"
    >
      <h2 id="experiencia-titulo" className="display-lg medida text-ancora">
        {experiencia.titulo}
      </h2>
      <p className="body-lg medida text-tinta mt-5 text-pretty">
        <Pendencia>{experiencia.intro}</Pendencia>
      </p>

      <div className="relative mt-14 lg:mt-20 lg:grid lg:grid-cols-3 lg:grid-rows-[auto_auto_auto] lg:gap-x-12">
        {/* Linha vertical (celular): desce pela esquerda, atrás das paradas. */}
        <svg
          data-linha-do-dia="vertical"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
          className="text-ancora/30 absolute inset-y-0 left-0 h-full w-6 lg:hidden"
        >
          <path d={ONDA_VERTICAL} {...tracoDaLinha} />
        </svg>

        {/* Linha horizontal (`lg`): ocupa a linha do meio da grade, a mesma dos ícones.
            Vem antes da `ol` no DOM para ficar por baixo dela. */}
        <svg
          data-linha-do-dia="horizontal"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 1000 24"
          preserveAspectRatio="none"
          className="text-ancora/30 hidden h-6 w-full self-center lg:col-span-full lg:row-start-2 lg:block"
        >
          <path d={ONDA_HORIZONTAL} {...tracoDaLinha} />
        </svg>

        <ol className="flex flex-col gap-16 lg:col-span-full lg:[grid-row:1/4] lg:grid lg:grid-cols-subgrid lg:grid-rows-subgrid lg:gap-y-0">
          {experiencia.momentos.map((momento, indice) => (
            <Parada key={momento.chave} momento={momento} indice={indice} />
          ))}
        </ol>
      </div>

      <LinhaDoDia rootId={experiencia.id} />
    </Section>
  );
}
