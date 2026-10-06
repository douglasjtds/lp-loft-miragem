import type { Metadata } from "next";

import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrganicImage } from "@/components/ui/OrganicImage";
import {
  ORGANIC_SHAPES,
  organicClip,
  organicShapeNotes,
} from "@/components/ui/OrganicClipPaths";
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

/** Uma cor por máscara no styleguide, para as quatro lerem como peças diferentes. */
const amostrasDeMascara = [
  "bg-ancora",
  "bg-decor",
  "bg-acento",
  "bg-superficie-2",
];

/**
 * As fotos tratadas na Fase 3 (scripts/processar-fotos.mjs). O `antes` só existe depois de
 * `node scripts/processar-fotos.mjs --antes`: fica fora do git e sai junto com esta página.
 */
const fotos = [
  {
    nome: "hero-por-do-sol",
    rotulo: "Herói · pôr do sol",
    alt: "Pôr do sol sobre a represa visto do mezanino, através da rede de corda",
  },
  {
    nome: "manha-cafe",
    rotulo: "Manhã",
    alt: "Bandeja de café da manhã flutuando na piscina-praia, cabana preta ao fundo",
  },
  {
    nome: "tarde-sup",
    rotulo: "Tarde",
    alt: "Mulher com a prancha de SUP do loft na margem da represa",
  },
  {
    nome: "noite-piscina",
    rotulo: "Noite",
    alt: "Piscina iluminada em azul à noite, com o interior do loft aceso pela vidraça",
  },
  {
    nome: "galeria-pranchas",
    rotulo: "Galeria · 640px",
    alt: "Duas pranchas de SUP com a logo na represa ao pôr do sol",
  },
] as const;

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
                <Button variant={variant}>Chamar no WhatsApp</Button>
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
          nota="A onda da logo vira borda de um ou dois lados; os outros ficam retos, com canto vivo. Aqui sobre cor chapada, porque a forma se julga melhor sem a foto distraindo; com as fotos, logo abaixo, na seção Fotos. Nenhuma pode parecer border-radius."
        >
          As 4 máscaras de onda
        </Titulo>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ORGANIC_SHAPES.map((shape, i) => (
            <li key={shape}>
              <div
                className={`${amostrasDeMascara[i]} aspect-[4/5] w-full`}
                style={{ clipPath: organicClip(shape) }}
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
          As mesmas quatro em 3:2
        </p>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ORGANIC_SHAPES.map((shape, i) => (
            <li key={shape}>
              <div
                className={`${amostrasDeMascara[i]} aspect-[3/2] w-full`}
                style={{ clipPath: organicClip(shape) }}
              />
            </li>
          ))}
        </ul>
        <p className="eyebrow text-acento-texto mt-8 mb-3">
          Grafismo de fundo: onda em decor a 10%
        </p>
        <div className="bg-papel text-decor relative flex h-40 items-center overflow-hidden">
          <BrandIcon
            name="onda"
            size={480}
            className="absolute -left-10 opacity-10"
          />
          <p className="body medida text-tinta relative ml-auto max-w-xs pr-6">
            Atrás do texto, aria-hidden, nunca competindo com ele.
          </p>
        </div>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-monograma">
        <Titulo
          id="c-monograma"
          nota="O emblema da logo redesenhado em SVG a partir das medidas do PNG: sol r51, seis linhas d'água a cada 21px, período 68. O original é 4% mais largo que alto (a logo foi esticada); aqui o círculo é círculo. O azul da logo vive só aqui dentro, nunca como token."
        >
          Monograma
        </Titulo>
        <div className="flex flex-wrap items-end gap-6">
          <div className="bg-papel flex items-end gap-6 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/monograma.svg"
              alt="Monograma do Loft Miragem"
              width={160}
              height={160}
            />
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/monograma.svg" alt="" width={36} height={36} />
              <span className="text-ancora font-sans text-lg font-semibold whitespace-nowrap">
                Loft Miragem
              </span>
            </div>
          </div>
          <div className="bg-ancora flex items-end gap-6 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/monograma-claro.svg"
              alt="Monograma do Loft Miragem, versão clara"
              width={160}
              height={160}
            />
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/monograma-claro.svg"
                alt=""
                width={36}
                height={36}
              />
              <span className="text-papel font-sans text-lg font-semibold whitespace-nowrap">
                Loft Miragem
              </span>
            </div>
          </div>
        </div>
        <p className="caption medida text-tinta-suave mt-4">
          36px é o lockup do header (§5): monograma e nome em Nunito Sans 600, o
          horizontal que a logo empilhada não oferece.
        </p>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-brandicon">
        <Titulo
          id="c-brandicon"
          nota="Derivados do emblema: stroke arredondado no peso do contorno da logo, um path por gesto, viewBox 96. Manhã, tarde e noite são a coreografia da Experiência (Fase 7); a onda é grafismo de transição. Cor por herança."
        >
          BrandIcon · manhã, tarde, noite, onda
        </Titulo>
        <div className="text-ancora flex flex-wrap items-end gap-10">
          {BRAND_ICON_NAMES.map((name) => (
            <div key={name}>
              <BrandIcon name={name} size={160} animatable />
              <Eyebrow className="text-acento-texto mt-3">{name}</Eyebrow>
            </div>
          ))}
        </div>
        <div className="text-ancora mt-8 flex flex-wrap items-end gap-10">
          {BRAND_ICON_NAMES.map((name) => (
            <BrandIcon key={name} name={name} size={120} />
          ))}
        </div>
        <div className="bg-ancora text-superficie-2 mt-8 flex flex-wrap items-center gap-10 p-6">
          {BRAND_ICON_NAMES.map((name) => (
            <BrandIcon key={name} name={name} size={48} title={name} />
          ))}
          <span className="text-decor flex gap-10">
            {BRAND_ICON_NAMES.map((name) => (
              <BrandIcon key={name} name={name} size={48} />
            ))}
          </span>
          <p className="caption">
            48px é o mínimo da §5: o traço fica em 1,5px.
          </p>
        </div>
      </section>

      <section className="container-lp mb-16" aria-labelledby="c-fotos">
        <Titulo
          id="c-fotos"
          nota="Tratamento leve e unificado (§9): aquecer 2,5% e tirar 8% de saturação do turquesa. Os três horários continuam diferentes de propósito, é esse contraste que conta o dia. A noite tem sombras levantadas sem mexer no azul da piscina."
        >
          Fotos
        </Titulo>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <OrganicImage
            src="/images/hero-por-do-sol.jpg"
            alt={fotos[0].alt}
            shape="a"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] w-full"
          />
          <ul className="grid grid-cols-3 gap-3 self-end sm:gap-5">
            {fotos.slice(1, 4).map((foto) => (
              <li key={foto.nome}>
                <OrganicImage
                  src={`/images/${foto.nome}.jpg`}
                  alt={foto.alt}
                  shape="b"
                  sizes="(min-width: 1024px) 18vw, 30vw"
                  className="aspect-[3/4] w-full"
                />
                <Eyebrow className="text-acento-texto mt-3">
                  {foto.rotulo}
                </Eyebrow>
              </li>
            ))}
          </ul>
        </div>

        <p className="eyebrow text-acento-texto mt-12 mb-3">Antes e depois</p>
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((foto) => (
            <li key={foto.nome}>
              <div className="grid grid-cols-2 gap-2">
                {(["antes", "depois"] as const).map((lado) => (
                  <figure key={lado}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/${lado === "antes" ? "antes/" : ""}${foto.nome}.jpg`}
                      alt={lado === "antes" ? "" : foto.alt}
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <figcaption className="caption text-tinta-suave mt-1">
                      {lado}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="caption text-tinta mt-2">{foto.rotulo}</p>
            </li>
          ))}
        </ul>

        <p className="eyebrow text-acento-texto mt-12 mb-3">
          Logo, ícones do navegador e og-image
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <div className="bg-papel p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.png"
              alt="Logo do Loft Miragem"
              width={240}
              height={173}
            />
          </div>
          <div className="bg-ancora p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-clara.png"
              alt="Logo do Loft Miragem, versão clara para o footer"
              width={240}
              height={173}
            />
          </div>
          <div className="flex items-end gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.ico" alt="" width={16} height={16} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.ico" alt="" width={32} height={32} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/apple-touch-icon.png"
              alt="Ícone de tela inicial do iPhone"
              width={90}
              height={90}
            />
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/og-image.jpg"
          alt="Imagem de compartilhamento: pôr do sol sobre a represa e a logo"
          width={600}
          height={315}
          className="mt-6 h-auto max-w-full"
        />
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
              <WhatsappCta origem={origem}>Chamar no WhatsApp</WhatsappCta>
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
