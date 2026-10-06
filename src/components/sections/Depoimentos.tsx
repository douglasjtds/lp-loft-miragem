import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { depoimentos } from "@/config/content";

/**
 * Depoimentos — landing-page-structure.md §5.7.
 *
 * ⚠️ HOJE ESTA SEÇÃO NÃO RENDERIZA, e isso é decisão de especificação, não pendência
 * de implementação: `depoimentos.exibir` é `false` porque não existe nenhum depoimento
 * real e autorizado. "Se não houver depoimento real e autorizado, a seção não existe."
 *
 * Depoimento inventado é fraude e destrói exatamente a percepção de seriedade que é o
 * objetivo nº 1 da página — além do risco ético: o Código de Ética do CFN restringe
 * publicidade com resultado de paciente. Nada de antes e depois.
 *
 * TODO(cliente): quando chegarem 2 ou 3 depoimentos reais, com autorização POR ESCRITO,
 * preencher `depoimentos.itens` em content.ts (texto + nome e inicial do sobrenome) e
 * virar `exibir` para true. O componente já está pronto e não precisa de alteração.
 *
 * Fundo superficie-2 com texto ancora. Tipografia editorial — o único
 * lugar da página, junto com pull quotes, onde a EB Garamond aparece (§4). Sem aspas
 * gigantes decorativas e sem avatar genérico.
 */

export function Depoimentos() {
  if (!depoimentos.exibir || depoimentos.itens.length === 0) return null;

  return (
    <Section
      background="superficie"
      aria-labelledby="depoimentos-titulo"
      className="text-ancora"
    >
      <Reveal>
        <Eyebrow>{depoimentos.eyebrow}</Eyebrow>

        <h2 id="depoimentos-titulo" className="display-lg medida mt-4">
          {depoimentos.titulo}
        </h2>
      </Reveal>

      <Reveal atraso={120}>
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          {depoimentos.itens.map((depoimento) => (
            <figure key={depoimento.autora}>
              <blockquote className="font-editorial medida text-xl leading-relaxed sm:text-2xl">
                {depoimento.texto}
              </blockquote>
              <figcaption className="caption font-ui mt-5">
                {depoimento.autora}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
