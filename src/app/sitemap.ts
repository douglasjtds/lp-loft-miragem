import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

/**
 * Sitemap — landing-page-structure.md §7.
 *
 * Uma página, uma entrada. As âncoras (#experiencia, #galeria, #o-loft, #duvidas...) NÃO
 * entram: fragmento não é URL indexável, e listá-lo só polui o arquivo.
 *
 * A origem vem de `site-url.ts`, a mesma de `metadataBase` — é o que impede o sitemap
 * de anunciar um domínio diferente do canônico.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
