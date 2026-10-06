import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { provaRapida } from "@/config/content";

/**
 * Faixa de provas objetivas — landing-page-structure.md §5.2.
 *
 * Só dados confirmados (Airbnb e Google). Cada item linka para a sua fonte quando há
 * uma. Sem ícone decorativo: são dados, e dado não precisa de enfeite.
 * Render mínimo; o desenho final é da Fase 5.
 */

export function ProvaRapida() {
  if (!provaRapida.exibir) return null;

  return (
    <Section background="creme" spacing="faixa">
      <ul className="caption text-tinta-suave flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center">
        {provaRapida.itens.map((item) => (
          <li key={item.destaque}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                className="underline decoration-acento underline-offset-4"
              >
                <strong className="text-ancora">{item.destaque}</strong>{" "}
                <Pendencia>{item.texto}</Pendencia>
              </a>
            ) : (
              <>
                <strong className="text-ancora">{item.destaque}</strong>{" "}
                <Pendencia>{item.texto}</Pendencia>
              </>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
