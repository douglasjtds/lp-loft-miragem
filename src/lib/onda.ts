/**
 * A onda de cinco cristas da logo como path de SVG (DESIGN-GUIDELINES §6), na mesma
 * construção das máscaras: cada meia onda vai de um extremo ao outro com alças de
 * 0,3642 da meia onda, o que dá uma senoide sem vértice. Gerada, e não escrita à mão,
 * para a regularidade sobreviver.
 *
 * Uma fonte só para a linha do dia (Experiência), a água da Localização e as ondas do
 * fechamento: as três precisam ser a MESMA onda, a da logo.
 *
 * Quem usa costuma pôr `preserveAspectRatio="none"` e `vectorEffect="non-scaling-stroke"`:
 * a onda estica com o contêiner e o traço mantém a espessura.
 */
export function ondaPath({
  cristas,
  comprimento,
  amplitude,
  centro,
  vertical = false,
}: {
  cristas: number;
  comprimento: number;
  amplitude: number;
  centro: number;
  vertical?: boolean;
}) {
  const meiaOnda = comprimento / (cristas * 2);
  const alca = meiaOnda * 0.3642;
  const ponto = (ao: number, de: number) =>
    vertical ? `${centro + de} ${ao}` : `${ao} ${centro + de}`;

  let d = `M${ponto(0, -amplitude)}`;
  for (let i = 0; i < cristas * 2; i++) {
    const inicio = i * meiaOnda;
    const de = i % 2 === 0 ? -amplitude : amplitude;
    const para = -de;
    d += ` C${ponto(inicio + alca, de)}, ${ponto(inicio + meiaOnda - alca, para)}, ${ponto(inicio + meiaOnda, para)}`;
  }
  return d;
}
