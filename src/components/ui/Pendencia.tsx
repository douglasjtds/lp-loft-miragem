import { Fragment } from "react";

/**
 * Formatação inline do texto que vem de content.ts. Faz duas coisas, ambas ditadas
 * pela fronteira white-label: componente não escreve texto, e content.ts não escreve
 * JSX. O que sobra é uma notação mínima dentro da string.
 *
 * 1. `<<A CONFIRMAR: ...>>` — a regra nº 1 do projeto é nunca inventar dado da
 *    cliente; a consequência é que várias frases chegam à tela com um marcador no
 *    meio. Ele precisa ser IMPOSSÍVEL de ignorar, em vez de se disfarçar de texto
 *    corrido e viajar até a produção sem ninguém notar. Quando o último marcador for
 *    substituído por dado real (Fase 9), esse realce para de renderizar sozinho.
 *
 * 2. `**negrito**` → `<strong>` e `_itálico_` → `<em>`. São tags semânticas, não só
 *    peso e inclinação: leitor de tela também dá o destaque. A base do globals.css
 *    resolve os dois arquivos de fonte (a Montserrat não é carregada em 700 nem em
 *    itálico junto com a romana, e o padrão do navegador sintetizaria ambos).
 *
 * 3. `\n` → `<br />`. Casos em que a quebra É o conteúdo — endereço, linhas de um
 *    bloco que precisam ficar coladas. É layout dentro do MESMO parágrafo.
 *
 *    A notação tem um segundo nível que NÃO mora aqui: `\n\n` separa parágrafos, e
 *    quem resolve é o componente que renderiza o bloco (ver `sections/Faq.tsx`).
 *    Motivo: este componente renderiza dentro de um `<p>` e não pode emitir `<p>`
 *    irmãos. Seções cuja copy já nasce em array de parágrafos (`Sobre`,
 *    `ComoFunciona`) continuam usando o array — não precisam do separador.
 *
 * Deliberadamente não é markdown: três tokens, sem aninhamento, sem parser.
 */

/** Alternação em UM grupo de captura: `split` devolve os tokens nos índices ímpares. */
const TOKEN = /(<<A CONFIRMAR:[\s\S]*?>>|\*\*[^*]+\*\*|_[^_]+_)/g;

/**
 * Trecho sem marcação: só o `\n` sobrevive. Fica fora do TOKEN porque não é um
 * token que envolve texto — é um separador dentro do texto puro.
 */
function comQuebras(texto: string) {
  const linhas = texto.split("\n");
  if (linhas.length === 1) return texto;

  return linhas.map((linha, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {linha}
    </Fragment>
  ));
}

export function Pendencia({ children }: { children: string }) {
  const partes = children.split(TOKEN);

  return (
    <>
      {partes.map((parte, i) => {
        if (i % 2 === 0)
          return <Fragment key={i}>{comQuebras(parte)}</Fragment>;

        /* Sem cor própria, pela mesma razão do marcador abaixo: o texto formatado
           também aparece sobre a faixa ancora. O destaque é só o peso e o corte. */
        if (parte.startsWith("**")) {
          return <strong key={i}>{parte.slice(2, -2)}</strong>;
        }

        if (parte.startsWith("_")) {
          return <em key={i}>{parte.slice(1, -1)}</em>;
        }

        /* A cor do texto é HERDADA de propósito: o marcador aparece sobre papel,
           creme e ancora, e fixar o acento aqui reprovaria o contraste na faixa
           escura. O que sinaliza a pendência é o fundo lavado mais o sublinhado
           tracejado — visível nos três fundos, sem quebrar a §3. */
        return (
          <mark
            key={i}
            className="bg-acento/20 font-ui decoration-acento text-[0.85em] text-inherit underline decoration-dashed underline-offset-4"
          >
            {parte}
          </mark>
        );
      })}
    </>
  );
}
