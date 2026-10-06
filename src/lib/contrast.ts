/**
 * Contraste WCAG 2.1 — calculado, nunca estimado.
 *
 * Existe para que o /styleguide (e a auditoria da Fase 8) leiam os ratios direto dos
 * tokens de `brand.ts`, em vez de repetir a tabela do DESIGN-GUIDELINES.md §3. Tabela
 * copiada à mão envelhece e erra: a do documento traz `papel` sobre `acento`
 * como 3.51 quando o contraste é simétrico e o valor correto é 3.83 (o veredito não
 * muda — segue reprovado para texto pequeno).
 */

/** Luminância relativa — WCAG 2.1, definição de `relative luminance`. */
function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste entre duas cores `#rrggbb`. Simétrica: ordem não importa. */
export function contrastRatio(a: string, b: string): number {
  const [x, y] = [relativeLuminance(a), relativeLuminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export type ContrastVerdict = "AAA" | "AA" | "AA-grande" | "reprovado";

/**
 * Veredito para **texto normal** (< 24px, ou < 18.66px bold).
 * `AA-grande` significa: só passa em texto grande — em corpo de texto está errado.
 */
export function contrastVerdict(ratio: number): ContrastVerdict {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-grande";
  return "reprovado";
}
