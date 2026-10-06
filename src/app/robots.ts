import type { MetadataRoute } from "next";

import { canonicalPendente, siteUrl } from "@/lib/site-url";

/**
 * robots.txt — landing-page-structure.md §7.
 *
 * Servido em `/robots.txt`, como um arquivo estático de `public/` — mas gerado, e não
 * escrito à mão, por dois motivos que um .txt estático não resolve:
 *
 * 1. a linha `Sitemap:` exige URL ABSOLUTA, e o domínio final ainda é pendência; aqui
 *    ela sai da mesma origem de `metadataBase`, e não de um domínio copiado que ficaria
 *    desatualizado no dia em que ele mudar;
 * 2. enquanto não há domínio confirmado (preview da Vercel, localhost), o arquivo
 *    bloqueia tudo — casando com o `noindex` da metadata em layout.tsx. Preview
 *    indexado compete com o domínio real e demora para sair do índice.
 *
 * `/styleguide` fica fora do índice sempre: é ferramenta de desenvolvimento.
 */
export default function robots(): MetadataRoute.Robots {
  if (canonicalPendente) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/styleguide" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
