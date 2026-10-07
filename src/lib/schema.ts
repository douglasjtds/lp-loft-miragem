/**
 * Dados estruturados (JSON-LD) — landing-page-structure.md §7.
 *
 * Dois nós, num único `@graph`: `LodgingBusiness` e `FAQPage` (espelho do accordion).
 * Não há nó `Person`: o Loft Miragem é uma hospedagem, sem profissional nem registro
 * (DESIGN-GUIDELINES.md §0). Os anfitriões aparecem no texto da página, não aqui.
 *
 * Regra que atravessa o arquivo inteiro: **nenhum campo pendente entra**. Um
 * `telephone: "<<A CONFIRMAR: ...>>"` não é um marcador visível, é um dado falso
 * publicado em formato legível por máquina — e reprova no Rich Results Test. Todo campo
 * passa por `confirmado()`; o que não voltar vira `undefined` e some no `JSON.stringify`.
 *
 * **Sem `aggregateRating` nem `review`**, mesmo com a nota 5,0 na página: as diretrizes
 * de review snippet do Google proíbem marcar avaliações de outro site (Airbnb, Google)
 * como se fossem do próprio negócio, e avaliações "self-serving" de `LocalBusiness` não
 * geram estrelas de qualquer forma (§7).
 *
 * `pendenciasDoSchema()` devolve, em texto, o que ainda falta para o grafo ficar
 * completo. É o checklist da fase de deploy.
 */

import { profile, social, whatsapp } from "@/config/brand";
import { faq, oLoft, seo } from "@/config/content";
import { confirmado } from "@/lib/pendencias";
import { canonicalPendente, siteUrl, urlAbsoluta } from "@/lib/site-url";

/* Tipagem mínima. `schema-dts` resolveria isto com tipos completos, mas custaria uma
   dependência de build para três nós — e a validação real é o Rich Results Test. */
type JsonLdValue = string | number | boolean | JsonLdNode | JsonLdValue[];
type JsonLdNode = { [key: string]: JsonLdValue | undefined };

/** Subtipo de `LocalBusiness` para hospedagem. Aceita `amenityFeature`, `numberOfRooms`,
 *  `checkinTime`/`checkoutTime` e `petsAllowed`. https://schema.org/LodgingBusiness */
const TIPO_NEGOCIO = "LodgingBusiness";

/** Um quarto: confirmado no Airbnb em 2026-10-05 (`oLoft.capacidade`). */
const NUMERO_DE_QUARTOS = 1;

const ID_NEGOCIO = `${siteUrl}/#negocio`;
const ID_PAGINA = `${siteUrl}/#pagina`;

/** `sameAs` só cresce quando a cliente confirmar outros perfis. */
const perfisSociais = [social.instagram?.url, social.airbnb?.url].filter(
  (url): url is string => typeof url === "string",
);

/**
 * As comodidades da seção O Loft, já confirmadas. `oLoft.pendencias` (café, ar,
 * roupa de cama) fica de fora até a cliente responder: entram em `comodidades` e, daí,
 * aqui, sem mudar este arquivo.
 */
function comodidades(): JsonLdNode[] | undefined {
  const itens = oLoft.comodidades
    .map((c) => confirmado(c))
    .filter((c): c is string => c !== undefined)
    .map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    }));

  return itens.length > 0 ? itens : undefined;
}

/**
 * 1. A hospedagem, para busca local.
 *
 * `address` só entra quando houver cidade confirmada: `PostalAddress` sem
 * `addressLocality` é um objeto vazio que não ajuda ninguém. Rua e número ficam de fora
 * de propósito: o endereço exato é passado na reserva.
 */
function negocio(): JsonLdNode {
  const cidade = confirmado(profile.cidade);
  const telefone = confirmado(whatsapp.phone)
    ? `+${whatsapp.phone}`
    : undefined;

  return {
    "@type": TIPO_NEGOCIO,
    "@id": ID_NEGOCIO,
    name: profile.nome,
    // Enquanto a description de SEO trouxer marcador, o campo fica de fora.
    description: confirmado(seo.description),
    url: `${siteUrl}/`,
    image: urlAbsoluta("/og-image.jpg"),
    logo: urlAbsoluta("/brand/monograma.png"),
    telephone: telefone,
    sameAs: perfisSociais.length > 0 ? perfisSociais : undefined,
    address: cidade
      ? {
          "@type": "PostalAddress",
          addressLocality: cidade,
          addressRegion: confirmado(profile.uf),
          addressCountry: "BR",
        }
      : undefined,
    numberOfRooms: NUMERO_DE_QUARTOS,
    amenityFeature: comodidades(),
    // priceRange, checkinTime, checkoutTime e petsAllowed dependem da cliente.
    // Ausentes é melhor que inventados: aparecem direto no resultado de busca.
    priceRange: undefined,
    checkinTime: undefined,
    checkoutTime: undefined,
    petsAllowed: undefined,
  };
}

/**
 * 2. FAQPage — espelho EXATO do accordion.
 *
 * Só entram as perguntas cuja resposta já está confirmada: publicar uma resposta com
 * `<<A CONFIRMAR>>` dentro é oferecer ao Google um trecho que ele pode exibir no
 * resultado de busca. Se nenhuma qualificar, o nó inteiro não é emitido — `FAQPage`
 * com `mainEntity` vazio é inválido.
 */
export function perguntasElegiveis() {
  return faq.perguntas.filter(
    (p) =>
      confirmado(p.pergunta) !== undefined &&
      confirmado(p.resposta) !== undefined,
  );
}

function faqPage(): JsonLdNode | null {
  const perguntas = perguntasElegiveis();
  if (perguntas.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": ID_PAGINA,
    mainEntity: perguntas.map((p) => ({
      "@type": "Question",
      name: p.pergunta,
      acceptedAnswer: { "@type": "Answer", text: p.resposta },
    })),
  };
}

/** O grafo pronto para virar `<script type="application/ld+json">`. */
export function jsonLd(): JsonLdNode {
  const nos = [negocio(), faqPage()].filter(
    (no): no is JsonLdNode => no !== null,
  );

  return { "@context": "https://schema.org", "@graph": nos };
}

/**
 * O que ainda falta para o grafo ficar completo. Cada item é um campo que hoje está
 * sendo OMITIDO (ou provisório) no JSON-LD — é o checklist a levar à cliente antes do
 * deploy.
 */
export function pendenciasDoSchema(): string[] {
  const faltando: string[] = [];

  if (canonicalPendente)
    faltando.push(
      `${TIPO_NEGOCIO}.url / @id / image — usam ${siteUrl}, provisória até o domínio final existir (NEXT_PUBLIC_SITE_URL ou brand.site.url)`,
    );
  if (!confirmado(whatsapp.phone))
    faltando.push(
      `${TIPO_NEGOCIO}.telephone — WhatsApp em formato internacional`,
    );
  if (!confirmado(profile.cidade))
    faltando.push(`${TIPO_NEGOCIO}.address — cidade e estado`);
  if (perfisSociais.length === 0)
    faltando.push(`${TIPO_NEGOCIO}.sameAs — nenhum perfil social preenchido`);

  faltando.push(
    `${TIPO_NEGOCIO}.priceRange — faixa de preço (ou a decisão de não exibir)`,
  );
  faltando.push(
    `${TIPO_NEGOCIO}.checkinTime / checkoutTime — horários de entrada e saída`,
  );
  faltando.push(`${TIPO_NEGOCIO}.petsAllowed — aceita pet ou não`);

  const comodidadesPendentes = oLoft.pendencias.length;
  if (comodidadesPendentes > 0)
    faltando.push(
      `${TIPO_NEGOCIO}.amenityFeature — ${comodidadesPendentes} comodidades ainda com marcador ficam fora`,
    );

  const elegiveis = perguntasElegiveis().length;
  if (elegiveis < faq.perguntas.length)
    faltando.push(
      `FAQPage.mainEntity — ${faq.perguntas.length - elegiveis} de ${faq.perguntas.length} perguntas ainda têm marcador e ficam fora do JSON-LD`,
    );

  return faltando;
}
