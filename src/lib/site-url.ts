/**
 * Origem canônica do site — fonte única para `metadataBase`, `alternates.canonical`,
 * `sitemap.ts`, `robots.ts` e as URLs absolutas do JSON-LD.
 *
 * O domínio final ainda é `<<A CONFIRMAR>>` em brand.ts, mas `metadataBase` exige uma
 * URL válida em tempo de build — não existe "metadataBase pendente". A ordem de
 * resolução abaixo permite que o build passe hoje e que a produção fique correta na
 * Fase 9 sem tocar em nenhum componente:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — o que a Vercel vai receber quando o domínio existir;
 * 2. `brand.site.url` — assim que a cliente confirmar o domínio, basta preencher lá;
 * 3. `VERCEL_PROJECT_PRODUCTION_URL` — a URL do projeto, para os previews;
 * 4. `http://localhost:3000` — desenvolvimento.
 *
 * `canonicalPendente` existe para que o resto do código saiba que a URL em uso é
 * provisória: o sitemap e o JSON-LD não devem afirmar URL absoluta de mentira.
 */

import { site } from "@/config/brand";
import { confirmado } from "@/lib/pendencias";

const FALLBACK_LOCAL = "http://localhost:3000";

function normalizar(valor: string | undefined): string | undefined {
  const bruto = confirmado(valor);
  if (!bruto) return undefined;

  const comEsquema = /^https?:\/\//.test(bruto) ? bruto : `https://${bruto}`;

  try {
    // Sem barra final: tudo que concatena daqui usa caminho absoluto começando com "/".
    return new URL(comEsquema).origin;
  } catch {
    return undefined;
  }
}

const resolvida =
  normalizar(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizar(site.url) ??
  normalizar(process.env.VERCEL_PROJECT_PRODUCTION_URL);

/** Origem em uso neste build, sempre uma URL válida. */
export const siteUrl = resolvida ?? FALLBACK_LOCAL;

/** True enquanto o domínio final não tiver sido informado por env ou por brand.ts. */
export const canonicalPendente = resolvida === undefined;

/** URL absoluta a partir de um caminho do `public/` ou de uma âncora da página. */
export function urlAbsoluta(caminho: string): string {
  return new URL(caminho, siteUrl).toString();
}
