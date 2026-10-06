/**
 * Detecção dos marcadores `<<A CONFIRMAR: ...>>` que vêm de brand.ts e content.ts.
 *
 * O componente `Pendencia` resolve o lado visível: o marcador aparece na tela e não
 * passa despercebido. Este módulo resolve o lado invisível — metadata, JSON-LD e
 * sitemap, onde um marcador não seria "visível", seria só **dado errado publicado**:
 * um `telephone: "<<A CONFIRMAR: WhatsApp...>>"` reprova no Rich Results Test e, pior,
 * pode ser indexado como se fosse o telefone dela.
 *
 * A regra, então, é assimétrica de propósito:
 * - na PÁGINA, o marcador aparece (para o usuário substituir);
 * - nos DADOS ESTRUTURADOS, o campo pendente é omitido (schema.org aceita ausência,
 *   não aceita mentira).
 */

const MARCADOR = /<<A CONFIRMAR:[\s\S]*?>>/;

/** True se o texto contém (ainda que no meio da frase) um marcador de pendência. */
export function temPendencia(texto: string | null | undefined): boolean {
  return typeof texto === "string" && MARCADOR.test(texto);
}

/**
 * O valor, se ele já estiver confirmado; `undefined` caso contrário.
 *
 * `undefined` — e não `null` ou `""` — porque é o único valor que `JSON.stringify`
 * remove da saída: o campo simplesmente não existe no JSON-LD em vez de aparecer vazio.
 */
export function confirmado(
  texto: string | null | undefined,
): string | undefined {
  if (typeof texto !== "string") return undefined;
  const limpo = texto.trim();
  if (limpo === "" || temPendencia(limpo)) return undefined;
  return limpo;
}
