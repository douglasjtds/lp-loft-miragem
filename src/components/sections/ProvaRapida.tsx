import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { provaRapida, type ProvaItem } from "@/config/content";

/**
 * Faixa de provas objetivas — landing-page-structure.md §5.2.
 *
 * Quatro fatos confirmados (Airbnb e Google), com o mesmo peso e sem ícone: são
 * dados, e dado não precisa de enfeite. Não é o template de "número gigante + rótulo":
 * o destaque fica no corpo da UI, só mais pesado, e a faixa continua fina.
 *
 * Grade 2×2 no celular e 4 colunas a partir de `md`, alinhada à esquerda: lista
 * centralizada que quebra em linhas soltas lê como fileira de etiquetas. No `md` um
 * filete separa os itens, porque as larguras de texto são muito diferentes e sem ele
 * a régua some.
 *
 * Cada item com fonte é um link inteiro para ela (alvo ≥ 44px). O sublinhado fica no
 * texto de apoio, que é o que diz "onde": "avaliações no Google", "no Airbnb".
 */

function Conteudo({ item, comLink }: { item: ProvaItem; comLink: boolean }) {
  return (
    <>
      <strong className="font-ui text-ancora block text-lg leading-snug font-semibold">
        {item.destaque}
      </strong>
      <span
        className={
          comLink
            ? "caption text-tinta-suave decoration-acento mt-1 block underline underline-offset-4"
            : "caption text-tinta-suave mt-1 block"
        }
      >
        <Pendencia>{item.texto}</Pendencia>
      </span>
    </>
  );
}

export function ProvaRapida() {
  if (!provaRapida.exibir) return null;

  return (
    <Section background="creme" spacing="faixa">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-0">
        {provaRapida.itens.map((item) => (
          <li
            key={item.destaque}
            className="md:border-ancora/15 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
          >
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                className="block min-h-11 [&:hover_span]:decoration-2"
              >
                <Conteudo item={item} comLink />
              </a>
            ) : (
              <Conteudo item={item} comLink={false} />
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
