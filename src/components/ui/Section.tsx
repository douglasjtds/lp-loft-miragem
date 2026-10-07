import { cn } from "@/lib/cn";

/**
 * Wrapper de seção — DESIGN-GUIDELINES.md §7.
 *
 * O fundo é full-bleed (sangra até a borda da viewport); o conteúdo fica contido pelo
 * `container-lp`. Todo o espaço vertical vem do `padding-block` de `secao-y`, nunca de
 * margin: é o que impede duas seções vizinhas de colapsarem ou cancelarem espaçamento.
 *
 * Quem precisar de layout interno (grid 7/5, 55/45) faz isso nos filhos — esta camada
 * só resolve fundo, largura e ritmo vertical.
 */

export type SectionBackground = "papel" | "creme" | "superficie" | "ancora";

/**
 * Mapa explícito: `cn()` não resolve conflito de classe Tailwind (ver src/lib/cn.ts),
 * e o scanner do Tailwind não enxerga nome de classe montado em runtime — por isso cada
 * combinação aparece escrita por extenso.
 *
 * Os pares de cor saem da tabela de contraste da §3: superficie-2/ancora e o inverso
 * passam AA (confira em scripts/contraste.mjs). Decor e superficie-2 nunca são cor de texto aqui.
 */
const fundos: Record<SectionBackground, string> = {
  papel: "bg-papel text-tinta",
  creme: "bg-creme text-tinta",
  superficie: "bg-superficie-2 text-ancora",
  ancora: "bg-ancora text-superficie-2",
};

/**
 * `faixa` é a exceção prevista pela §5.2: a ProvaRapida é uma tira horizontal fina
 * entre duas seções cheias, e o ritmo de `secao-y` a transformaria num bloco.
 * Continua sendo padding-block, nunca margin — a regra de não colapsar espaço vale igual.
 */
export type SectionSpacing = "secao" | "faixa" | "hero";

/**
 * `hero` existe porque a dobra fica embaixo de um header fixo de 72px. No mobile a
 * foto abre a página (§5.1), e `secao-y` somado à folga do header empurraria o CTA
 * para fora de 390×844: o topo é o header + 24px (escala da §7). No `lg` o texto divide a linha com
 * a foto e o ritmo normal volta, com a folga do header somada.
 */
const espacamentos: Record<SectionSpacing, string> = {
  secao: "secao-y",
  faixa: "py-8",
  hero: "pt-24 pb-16 lg:pt-32 lg:pb-24",
};

type SectionProps = {
  id?: string;
  background?: SectionBackground;
  spacing?: SectionSpacing;
  /** id do heading que nomeia a seção — obrigatório para a seção virar landmark útil. */
  "aria-labelledby"?: string;
  /** Classes do wrapper interno (grid, gap). O fundo e o ritmo vertical não se sobrescrevem daqui. */
  className?: string;
  children: React.ReactNode;
};

export function Section({
  id,
  background = "papel",
  spacing = "secao",
  "aria-labelledby": ariaLabelledby,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("relative", espacamentos[spacing], fundos[background])}
    >
      <div className={cn("container-lp", className)}>{children}</div>
    </section>
  );
}
