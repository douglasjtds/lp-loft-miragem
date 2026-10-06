/**
 * Dados estruturados (JSON-LD) — landing-page-structure.md §7.
 *
 * Dois nós, num único `@graph`: o NEGÓCIO e `FAQPage` (espelho do accordion). Não há
 * nó `Person`: o Loft Miragem é uma hospedagem, sem profissional nem registro
 * (DESIGN-GUIDELINES.md §0). A troca para `LodgingBusiness`, com `amenityFeature` e
 * `numberOfRooms`, é a Fase 6.
 *
 * Regra que atravessa o arquivo inteiro: **nenhum campo pendente entra**. Um
 * `telephone: "<<A CONFIRMAR: ...>>"` não é um marcador visível, é um dado falso
 * publicado em formato legível por máquina — e reprova no Rich Results Test. Todo campo
 * passa por `confirmado()`; o que não voltar vira `undefined` e some no `JSON.stringify`.
 *
 * `pendenciasDoSchema()` devolve, em texto, o que ainda falta para o grafo ficar
 * completo. É o checklist da fase de deploy.
 */

import { profile, social, whatsapp } from "@/config/brand";
import { faq, seo } from "@/config/content";
import { confirmado } from "@/lib/pendencias";
import { siteUrl, urlAbsoluta } from "@/lib/site-url";

/* Tipagem mínima. `schema-dts` resolveria isto com tipos completos, mas custaria uma
   dependência de build para três nós — e a validação real é o Rich Results Test. */
type JsonLdValue = string | number | boolean | JsonLdNode | JsonLdValue[];
type JsonLdNode = { [key: string]: JsonLdValue | undefined };

/**
 * O tipo schema.org do negócio.
 *
 * Escolher o tipo mais ESPECÍFICO que descreve a profissão é o que faz o nó valer
 * alguma coisa em busca local — `ProfessionalService` genérico diz pouco ao Google.
 * Os subtipos de `MedicalBusiness` ainda aceitam `medicalSpecialty`, que os demais não.
 *
 * | Profissão            | @type                | Herda de          |
 * |----------------------|----------------------|-------------------|
 * | Nutricionista        | `Dietician`          | MedicalBusiness   |
 * | Psicóloga            | `Psychologist`       | MedicalBusiness   |
 * | Fisioterapeuta       | `Physiotherapy`      | MedicalBusiness   |
 * | Dentista             | `Dentist`            | MedicalBusiness   |
 * | Médica               | `Physician`          | MedicalBusiness   |
 * | Personal trainer     | `HealthClub`         | LocalBusiness     |
 * | Advogado             | `LegalService`       | LocalBusiness     |
 * | Contadora            | `AccountingService`  | LocalBusiness     |
 * | Arquiteta            | `ProfessionalService`| LocalBusiness     |
 * | Qualquer outra       | `ProfessionalService`| LocalBusiness     |
 *
 * Lista completa: https://schema.org/LocalBusiness
 */
const TIPO_NEGOCIO = "ProfessionalService";

/**
 * Só para os subtipos de `MedicalBusiness`. Em qualquer outro tipo o campo é ignorado
 * pelos validadores — deixe `null`. Valores em https://schema.org/MedicalSpecialty.
 */
const ESPECIALIDADE_MEDICA: string | null = null;

const ID_NEGOCIO = `${siteUrl}/#negocio`;
const ID_PAGINA = `${siteUrl}/#pagina`;

/** `sameAs` só cresce quando a cliente confirmar outros perfis. */
const perfisSociais = [social.instagram?.url, social.airbnb?.url].filter(
  (url): url is string => typeof url === "string",
);

/**
 * 1. O negócio, para busca local.
 *
 * `address` só entra quando houver cidade confirmada: `PostalAddress` sem
 * `addressLocality` é um objeto vazio que não ajuda ninguém.
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
    medicalSpecialty: ESPECIALIDADE_MEDICA ?? undefined,
    address: cidade
      ? {
          "@type": "PostalAddress",
          addressLocality: cidade,
          addressRegion: confirmado(profile.uf),
          addressCountry: "BR",
        }
      : undefined,
    areaServed: cidade ? { "@type": "Place", name: cidade } : undefined,
    // priceRange e openingHours dependem da cliente. Ausentes é melhor que inventados:
    // ambos aparecem direto no resultado de busca.
    priceRange: undefined,
    openingHours: undefined,
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
 * sendo OMITIDO do JSON-LD — é o checklist a levar à cliente antes do deploy.
 */
export function pendenciasDoSchema(): string[] {
  const faltando: string[] = [];

  if (!confirmado(whatsapp.phone))
    faltando.push(
      `${TIPO_NEGOCIO}.telephone — WhatsApp em formato internacional`,
    );
  if (!confirmado(profile.cidade))
    faltando.push(`${TIPO_NEGOCIO}.address / areaServed — cidade e estado`);
  if (perfisSociais.length === 0)
    faltando.push(`${TIPO_NEGOCIO}.sameAs — nenhum perfil social preenchido`);

  faltando.push(
    `${TIPO_NEGOCIO}.priceRange — faixa de preço (ou a decisão de não exibir)`,
  );
  faltando.push(`${TIPO_NEGOCIO}.openingHours — horário de atendimento`);

  const elegiveis = perguntasElegiveis().length;
  if (elegiveis < faq.perguntas.length)
    faltando.push(
      `FAQPage.mainEntity — ${faq.perguntas.length - elegiveis} de ${faq.perguntas.length} perguntas ainda têm marcador e ficam fora do JSON-LD`,
    );

  return faltando;
}
