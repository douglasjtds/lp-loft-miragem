import { Pendencia } from "@/components/ui/Pendencia";
import { Section } from "@/components/ui/Section";
import { provaRapida } from "@/config/content";

/**
 * Faixa de provas objetivas — landing-page-structure.md §5.2.
 *
 * Hoje ela NÃO renderiza: `provaRapida.exibir` é `false` porque nenhum dos três dados
 * foi confirmado pela cliente, e a especificação é literal — "só entram dados que a
 * cliente confirmar; se não houver dado, corta a seção". Uma faixa de credibilidade
 * feita de marcadores produz exatamente o efeito contrário do pretendido.
 *
 * O componente fica pronto: quando os itens chegarem, basta virar `exibir` em
 * content.ts. Sem ícone decorativo — são dados, e dado não precisa de enfeite.
 */

export function ProvaRapida() {
  if (!provaRapida.exibir) return null;

  return (
    <Section background="creme" spacing="faixa">
      <ul className="caption text-tinta-suave flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center">
        {provaRapida.itens.map((item) => (
          <li key={item}>
            <Pendencia>{item}</Pendencia>
          </li>
        ))}
      </ul>
    </Section>
  );
}
