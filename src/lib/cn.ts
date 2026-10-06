/**
 * Concatena classes condicionais, descartando os valores falsy.
 *
 * Deliberadamente sem `tailwind-merge`: ele custa ~7KB gzip, e o orçamento de JS
 * inicial da página é 100KB (landing-page-structure.md §8). Como consequência, esta
 * função NÃO resolve conflito entre classes Tailwind — quem decide é a ordem no
 * stylesheet, não a ordem no atributo.
 *
 * Por isso, na Fase 2 os componentes com variante (Button) devem usar mapas
 * explícitos de variante em vez de sobrepor classes e torcer para a última vencer.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
