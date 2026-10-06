import type { Metadata } from "next";

import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  ORGANIC_SHAPES,
  organicShapeNotes,
} from "@/components/ui/OrganicClipPaths";
import { OrganicImage } from "@/components/ui/OrganicImage";
import { Section, type SectionBackground } from "@/components/ui/Section";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { BRAND_ICON_NAMES } from "@/config/brand-icons";
import { colorRoles, colors, fonts, type ColorToken } from "@/config/brand";
import { mensagensPorOrigem } from "@/config/content";
import type { CtaOrigem } from "@/lib/whatsapp";
import {
  contrastRatio,
  contrastVerdict,
  type ContrastVerdict,
} from "@/lib/contrast";

/**
 * Página temporária de validação visual do sistema de design (Fases 1 a 3).
 *
 * Não faz parte da landing, sai do projeto (ou vira rota protegida) antes do deploy
 * da Fase 9. Por isso: `noindex`, e nenhum link apontando para cá.
 *
 * As cores aqui saem de `brand.ts` e são aplicadas via `var(--color-*)`, não via hex
 * literal, a regra dura do projeto continua valendo dentro do próprio styleguide.
 * Os ratios são CALCULADOS a partir dos tokens; se um token mudar, a tabela acompanha.
 */
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const token = (name: ColorToken) => `var(--color-${name})`;

/** Classes escritas por extenso: o scanner do Tailwind não resolve nome montado em runtime. */
const amostraDeFonte: Record<keyof typeof fonts, string> = {
  display: "display-md",
  ui: "font-ui",
  editorial: "font-editorial italic",
};

const veredito: Record<ContrastVerdict, { label: string; sinal: string }> = {
  AAA: { label: "AAA, texto normal", sinal: "✅" },
  AA: { label: "AA, texto normal", sinal: "✅" },
  "AA-grande": { label: "Só texto grande (≥24px)", sinal: "⚠️" },
  reprovado: {
    label: "Reprovado em texto, decorativo/superfície",
    sinal: "❌",
  },
};

/** Os pares que a página realmente vai usar, na ordem do DESIGN-GUIDELINES.md §3. */
const pares: Array<[ColorToken, ColorToken, string?]> = [
  ["ancora", "papel", "Par principal de texto"],
  ["ancora-quente", "papel"],
  ["tinta", "papel", "Parágrafos"],
  ["tinta-suave", "papel", "Legendas"],
  ["ancora", "creme"],
  ["tinta", "creme"],
  ["tinta-suave", "creme"],
  ["acento-texto", "papel", "Texto em acento sobre claro e anel de foco"],
  ["acento", "papel", "Nunca botão, nunca texto sobre claro"],
  ["decor", "papel", "Decorativo apenas"],
  ["decor", "creme", "Decorativo apenas"],
  ["superficie-2", "papel", "Só superfície"],
  ["papel", "ancora", "★ CTA primário"],
  ["superficie-2", "ancora", "Texto de apoio na faixa escura"],
  ["acento", "ancora", "Âmbar como texto, só na faixa escura"],
  ["decor", "ancora", "Ícones grandes na faixa escura"],
  ["ancora", "superficie-2", "Faixa de avaliações"],
  ["ancora-quente", "superficie-2", 'Atribuição "via Airbnb"'],
  ["tinta-suave", "superficie-2", "Só texto grande"],
];

const escala = [
  {
    classe: "display-xl",
    uso: "h1 do herói",
    amostra: "A vista mais exclusiva de Três Marias",
  },
  {
    classe: "display-lg",
    uso: "h2 de seção",
    amostra: "O dia termina na água",
  },
  {
    classe: "display-md",
    uso: "títulos menores",
    amostra: "Manhã, tarde e noite no loft",
  },
  {
    classe: "body-lg",
    uso: "subtítulo do herói, abertura de seção",
    amostra:
      "O subtítulo do herói: uma frase concreta, sem promessa de resultado e sem superlativo.",
  },
  {
    classe: "body",
    uso: "texto corrido",
    amostra:
      "O texto corrido da página. A medida de leitura fica entre 60 e 72 caracteres por linha; parágrafo mais largo que isso é o erro de layout mais comum aqui.",
  },
  {
    classe: "caption",
    uso: "legendas, atribuições, notas",
    amostra: "Três Marias, MG · via Airbnb",
  },
  {
    classe: "eyebrow",
    uso: "rótulo de seção",
    amostra: "Três Marias · MG · loft para casais",
  },
];

/** Cabeçalho de bloco do styleguide, repetido em todas as demonstrações da Fase 2. */
function Titulo({
  id,
  children,
  nota,
}: {
  id: string;
  children: React.ReactNode;
  nota?: string;
}) {
  return (
    <>
      <h2
        id={id}
        className="display-md mb-2"
        style={{ color: token("ancora") }}
      >
        {children}
      </h2>
      {nota && (
        <p className="body medida mb-6" style={{ color: token("tinta-suave") }}>
          {nota}
        </p>
      )}
    </>
  );
}

const fundosDeSecao: Array<[SectionBackground, string]> = [
  ["papel", "Fundo principal. Par de texto principal com a tinta"],
  ["creme", "Seção alternada. Mesmo par de texto do papel"],
  ["superficie", "Faixa de avaliações. Texto na ancora sobre a superficie-2"],
  ["ancora", "Faixa de fechamento e footer. Texto de apoio na superficie-2"],
];

const variantesDeBotao: Array<[ButtonVariant, string]> = [
  ["primary", "CTA da página. Nunca o acento."],
  ["secondary", "Ação de apoio, sobre fundo claro."],
  ["inverso", "Só dentro da faixa ancora."],
];

function Swatch({ name }: { name: ColorToken }) {
  const sobrePapel = contrastRatio(colors[name], colors.papel);
  const claro = sobrePapel < 2;
  return (
    <li className="flex gap-4">
      <div
        className="h-20 w-20 shrink-0"
        style={{
          backgroundColor: token(name),
          border: claro ? `1px solid ${token("tinta-suave")}` : undefined,
        }}
        aria-hidden="true"
      />
      <div>
        <p className="eyebrow" style={{ color: token("ancora") }}>
          {name}
        </p>
        <p
          className="caption font-mono"
          style={{ color: token("tinta-suave") }}
        >
          {colors[name]}
        </p>
        <p className="caption medida mt-1">{colorRoles[name]}</p>
      </div>
    </li>
  );
}

function LinhaContraste({
  fg,
  bg,
  nota,
}: {
  fg: ColorToken;
  bg: ColorToken;
  nota?: string;
}) {
  const ratio = contrastRatio(colors[fg], colors[bg]);
  const v = veredito[contrastVerdict(ratio)];
  return (
    <tr style={{ borderBottom: `1px solid ${token("superficie-2")}` }}>
      <td className="py-2 pr-4">
        <span
          className="inline-block px-3 py-1"
          style={{ backgroundColor: token(bg), color: token(fg) }}
        >
          {fg} sobre {bg}
        </span>
      </td>
      <td className="py-2 pr-4 text-right font-mono tabular-nums">
        {ratio.toFixed(2)}:1
      </td>
      <td className="py-2 pr-4 whitespace-nowrap">
        {v.sinal} {v.label}
      </td>
      <td className="caption py-2" style={{ color: token("tinta-suave") }}>
        {nota ?? ""}
      </td>
    </tr>
  );
}

export default function Styleguide() {
  return (
    // Sem container no <main>: a demonstração de Section precisa sangrar até a borda.
    // Cada bloco abaixo traz o seu próprio `container-lp`.
    <main className="py-16">
      <header className="container-lp mb-16">
        <p className="eyebrow" style={{ color: token("acento-texto") }}>
          Fases 1–3 · validação interna
        </p>
        <h1 className="display-lg mt-2" style={{ color: token("ancora") }}>
          Sistema de design
        </h1>
        <p
          className="body-lg medida mt-4"
          style={{ color: token("tinta-suave") }}
        >
          Página temporária, fora do índice e sem link a partir da landing. Os
          ratios abaixo são calculados a partir dos tokens de{" "}
          <code>brand.ts</code>, não são uma tabela copiada.
        </p>
      </header>

      <section className="container-lp mb-16" aria-labelledby="paleta">
        <h2
          id="paleta"
          className="display-md mb-6"
          style={{ color: token("ancora") }}
        >
          Paleta
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {(Object.keys(colors) as ColorToken[]).map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </ul>
      </section>

      <section className="container-lp mb-16" aria-labelledby="contraste">
        <h2
          id="contraste"
          className="display-md mb-2"
          style={{ color: token("ancora") }}
        >
          Contraste
        </h2>
        <p className="body medida mb-6" style={{ color: token("tinta-suave") }}>
          Veredito para texto normal.{" "}
          <strong>Decor e superficie-2 não são cor de texto</strong> em lugar
          nenhum da página, aparecem aqui só para provar o porquê.
        </p>
        <div className="overflow-x-auto">
          <table className="caption w-full border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: `2px solid ${token("ancora")}` }}>
                <th className="eyebrow py-2 pr-4">Par</th>
                <th className="eyebrow py-2 pr-4 text-right">Ratio</th>
                <th className="eyebrow py-2 pr-4">Veredito</th>
                <th className="eyebrow py-2">Nota</th>
              </tr>
            </thead>
            <tbody>
              {pares.map(([fg, bg, nota]) => (
                <LinhaContraste
                  key={`${fg}-${bg}`}
                  fg={fg}
                  bg={bg}
                  nota={nota}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-lp mb-16" aria-labelledby="fontes">
        <h2
          id="fontes"
          className="display-md mb-2"
          style={{ color: token("ancora") }}
        >
          Famílias
        </h2>
        <p className="body medida mb-6" style={{ color: token("tinta-suave") }}>
          Fraunces (display, SOFT 80) e Nunito Sans (UI). O editorial é a
          própria Fraunces em itálico, SOFT 100, só em avaliações e pull quotes.
          Ambas OFL.
        </p>
        <ul className="grid gap-8 md:grid-cols-3">
          {(Object.keys(fonts) as Array<keyof typeof fonts>).map((role) => {
            const f = fonts[role];
            return (
              <li key={role}>
                <p className="eyebrow" style={{ color: token("acento-texto") }}>
                  {role}
                </p>
                <p className={`${amostraDeFonte[role]} mt-2 text-3xl`}>
                  Aa Ãã Çç Éé
                </p>
                <p className="caption mt-2" style={{ color: token("tinta") }}>
                  {f.family} · {f.weights.join(" / ")}
                </p>
                <p
                  className="caption mt-1"
                  style={{ color: token("tinta-suave") }}
                >
                  {f.role}
                </p>
                {f.substitui && (
                  <p
                    className="caption mt-1"
                    style={{ color: token("acento-texto") }}
                  >
                    Substitui: {f.substitui}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container-lp mb-16" aria-labelledby="escala">
        <h2
          id="escala"
          className="display-md mb-6"
          style={{ color: token("ancora") }}
        >
          Escala tipográfica
        </h2>
        <ul className="space-y-10">
          {escala.map((item) => (
            <li key={item.classe}>
              <p
                className="eyebrow mb-2"
                style={{ color: token("acento-texto") }}
              >
                {item.classe} · {item.uso}
              </p>
              <p
                className={`${item.classe} medida`}
                style={{
                  color: item.classe.startsWith("display")
                    ? token("ancora")
                    : token("tinta"),
                }}
              >
                {item.amostra}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-lp mb-16" aria-labelledby="estados">
        <h2
          id="estados"
          className="display-md mb-2"
          style={{ color: token("ancora") }}
        >
          Foco e movimento
        </h2>
        <p className="body medida mb-6" style={{ color: token("tinta-suave") }}>
          O anel de foco global é acento-texto com offset de 3px. Navegue com
          Tab para ver. Com <code>prefers-reduced-motion: reduce</code> ativo no
          sistema, nenhuma transição roda e o scroll deixa de ser suave.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#paleta"
            className="body underline decoration-1 underline-offset-4"
            style={{
              color: token("ancora"),
              textDecorationColor: token("acento"),
            }}
          >
            Link em texto (volta para a paleta)
          </a>
          <button
            type="button"
            className="eyebrow px-6 py-4 transition-colors"
            style={{
              backgroundColor: token("ancora"),
              color: token("papel"),
            }}
          >
            Alvo de 44px para testar o foco
          </button>
        </div>
      </section>

      {/* ====================================================================
          Fase 2, componentes base
          ==================================================================== */}

      <div className="container-lp mb-10">
        <Eyebrow className="text-acento-texto">
          Fase 2 · componentes base
        </Eyebrow>
        <h2 className="display-lg text-ancora mt-2">Componentes</h2>
      </div>

      <section aria-labelledby="c-section" className="mb-16">
        <div className="container-lp">
          <Titulo
            id="c-section"
            nota="Fundo full-bleed, conteúdo no container-lp (máx. 1152px). Todo o ritmo vertical vem de padding-block, nenhuma seção usa margin, então duas seções vizinhas nunca colapsam espaço."
          >
            Section
          </Titulo>
        </div>
        {fundosDeSecao.map(([bg, nota]) => (
          <Section key={bg} background={bg} aria-labelledby={`sec-${bg}`}>
            <Eyebrow>background=&quot;{bg}&quot;</Eyebrow>
            <p id={`sec-${bg}`} className="display-md mt-2">
              Um título nesta seção
            </p>
            <p className="body medida mt-3">{nota}</p>
          </Section>
        ))}
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-button">
        <Titulo
          id="c-button"
          nota="Alvo mínimo de 44×44px, sem sombra, sem gradiente, sem canto arredondado. Passe o mouse, segure o clique e navegue com Tab em cada um, o anel de foco é o global, nenhuma variante o remove."
        >
          Button
        </Titulo>
        <ul className="space-y-8">
          {variantesDeBotao.map(([variant, nota]) => (
            <li
              key={variant}
              className={variant === "inverso" ? "bg-ancora p-6" : undefined}
            >
              <Eyebrow
                className={
                  variant === "inverso"
                    ? "text-superficie-2"
                    : "text-acento-texto"
                }
              >
                {variant} · {nota}
              </Eyebrow>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Button variant={variant}>Agendar consulta</Button>
                <Button variant={variant} href="#c-button">
                  Como link (&lt;a&gt;)
                </Button>
                <Button variant={variant} disabled>
                  Desabilitado
                </Button>
                <Button variant={variant} aria-label="Botão de rótulo curto">
                  Ok
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-eyebrow">
        <Titulo
          id="c-eyebrow"
          nota="O único elemento em caixa alta da página. A cor vem de fora, por herança, o componente não escolhe cor."
        >
          Eyebrow
        </Titulo>
        <div className="flex flex-wrap gap-8">
          <div className="bg-papel p-6">
            <Eyebrow className="text-acento-texto">
              Três Marias · MG · loft para casais
            </Eyebrow>
          </div>
          <div className="bg-ancora p-6">
            <Eyebrow className="text-superficie-2">Avaliações</Eyebrow>
          </div>
        </div>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-organic">
        <Titulo
          id="c-organic"
          nota="Agora sobre a foto real (Fase 3). As quatro precisam ser assimétricas, sem vértice agudo e distinguíveis de longe, e nenhuma pode parecer border-radius. A shape a é a do herói."
        >
          OrganicImage, as 4 máscaras
        </Titulo>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ORGANIC_SHAPES.map((shape) => (
            <li key={shape}>
              <OrganicImage
                src="/images/retrato-hero.jpg"
                alt=""
                shape={shape}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/5] w-full"
              />
              <Eyebrow className="text-acento-texto mt-3">
                shape=&quot;{shape}&quot;
              </Eyebrow>
              <p className="caption text-tinta-suave mt-1">
                {organicShapeNotes[shape]}
              </p>
            </li>
          ))}
        </ul>
        <p className="eyebrow text-acento-texto mt-8 mb-3">
          As mesmas quatro em 3:2, sobre a foto do Sobre
        </p>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ORGANIC_SHAPES.map((shape) => (
            <li key={shape}>
              <OrganicImage
                src="/images/retrato-sobre.jpg"
                alt=""
                shape={shape}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[3/2] w-full"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-assets">
        <Titulo
          id="c-assets"
          nota="O ensaio inteiro sai de scripts/processar-fotos.mjs. Fotos de ensaios diferentes precisam de tratamento cromático unificado (dessaturação em direção à cor decorativa da paleta) para lerem como um conjunto só, sem isso cada seção parece de um site diferente."
        >
          Assets
        </Titulo>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["retrato-hero.jpg", "Herói · 1200w · LCP"],
            ["retrato-sobre.jpg", "Sobre · 1100w"],
            ["pilar-um.jpg", "Método/pilar 1 · 1100w"],
            ["pilar-tres.jpg", "Método/pilar 3 · 1100w"],
            ["atendimento.jpg", "Como Funciona · 900w"],
          ].map(([arquivo, nota]) => (
            <li key={arquivo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/${arquivo}`}
                alt=""
                className="w-full"
                loading="lazy"
              />
              <Eyebrow className="text-acento-texto mt-2">{arquivo}</Eyebrow>
              <p className="caption text-tinta-suave">{nota}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <div className="bg-papel p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/monograma.png"
              alt="Monograma BM"
              className="h-16 w-auto"
            />
          </div>
          <div className="bg-ancora p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/monograma-claro.png"
              alt=""
              className="h-16 w-auto"
            />
          </div>
          <p className="caption medida text-tinta-suave">
            O monograma é PNG, não SVG: o manual só entregou raster e redesenhar
            a ligadura à mão a descaracterizaria. Ele não é animado (só os três
            ícones são), então raster aqui não custa nada.
          </p>
        </div>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-brandicon">
        <Titulo
          id="c-brandicon"
          nota="⚠️ Traçados PROVISÓRIOS: a Fase 3 substitui os paths pelos ícones reais do manual. O que se valida aqui é a API e o traçado aberto em stroke, requisito da animação de desenho da Fase 7. Cor por herança."
        >
          BrandIcon · corpo, mente, alma
        </Titulo>
        <div className="text-ancora flex flex-wrap items-end gap-10">
          {BRAND_ICON_NAMES.map((name) => (
            <div key={name}>
              <BrandIcon name={name} size={120} animatable />
              <Eyebrow className="text-acento-texto mt-3">{name}</Eyebrow>
            </div>
          ))}
        </div>
        <div className="bg-ancora text-superficie-2 mt-8 flex flex-wrap items-center gap-10 p-6">
          {BRAND_ICON_NAMES.map((name) => (
            <BrandIcon key={name} name={name} size={48} title={name} />
          ))}
          <p className="caption">
            48px é o mínimo da §5, abaixo disso o traço de 1.5px desaparece.
          </p>
        </div>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-whatsapp">
        <Titulo
          id="c-whatsapp"
          nota="Cada origem manda uma mensagem diferente, é como a cliente sabe de onde veio o lead sem backend. Se o número voltar a ficar pendente, todos renderizam desabilitados: um link para wa.me sem destinatário abriria o WhatsApp em branco."
        >
          WhatsappCta
        </Titulo>
        <ul className="space-y-6">
          {(Object.keys(mensagensPorOrigem) as CtaOrigem[]).map((origem) => (
            <li key={origem} className="flex flex-wrap items-center gap-4">
              <WhatsappCta origem={origem}>Agendar consulta</WhatsappCta>
              <div>
                <Eyebrow className="text-acento-texto">
                  origem=&quot;{origem}&quot;
                </Eyebrow>
                <p className="caption text-tinta mt-1">
                  “{mensagensPorOrigem[origem]}”
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
