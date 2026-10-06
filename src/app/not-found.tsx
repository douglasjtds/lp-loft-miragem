import type { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { profile } from "@/config/brand";
import { header, seo } from "@/config/content";

/**
 * 404 — landing-page-structure.md §7.
 *
 * No estilo da marca, e não a página branca do Next: quem cai aqui veio de um link
 * quebrado no Instagram, e a única coisa que importa é devolvê-lo para a página em um
 * clique. Sem header, sem footer, sem sticky — nada além da saída.
 *
 * Sem JSON-LD (o grafo descreve a landing, não esta rota) e `noindex`, como manda o
 * comportamento padrão para páginas de erro.
 */
export const metadata: Metadata = {
  title: `${seo.naoEncontrada.titulo} · ${profile.nome}`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="bg-papel flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
      <Image
        src="/brand/monograma.svg"
        alt={header.monogramaAlt}
        width={56}
        height={56}
        unoptimized
        className="h-14 w-14"
      />

      <Eyebrow className="text-tinta-suave mt-10">404</Eyebrow>

      <h1 className="display-lg text-ancora mt-4">
        {seo.naoEncontrada.titulo}
      </h1>

      <p className="body medida text-tinta-suave mt-4">
        {seo.naoEncontrada.texto}
      </p>

      {/* Âncora nativa, não next/link: é uma navegação só, para fora de uma rota de
          erro — não há nada para pré-carregar. */}
      <Button href="/" className="mt-10">
        {seo.naoEncontrada.cta}
      </Button>
    </main>
  );
}
