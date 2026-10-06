import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, Montserrat } from "next/font/google";

import { OrganicClipPaths } from "@/components/ui/OrganicClipPaths";
import { profile, social } from "@/config/brand";
import { seo } from "@/config/content";
import { canonicalPendente, siteUrl } from "@/lib/site-url";

import "./globals.css";

/**
 * As três famílias, nos papéis definidos em DESIGN-GUIDELINES.md §4.
 *
 * ⚠️ ESTE TRIO É O PADRÃO DO TEMPLATE, não a marca da cliente. Substitua pelas fontes
 * do manual **depois de auditar a licença** (o procedimento está em `brand.ts`, no
 * comentário de `fonts`). Este é o único arquivo que precisa mudar: as custom
 * properties abaixo têm nome de PAPEL, então globals.css e os componentes não sabem
 * qual família está atrás delas.
 *
 * Se a fonte for do Google Fonts, mantenha `next/font/google`, que faz self-host no
 * build — o navegador do visitante nunca fala com o Google. Se for uma webfont
 * comprada, troque para `next/font/local` apontando para os `.woff2` em
 * `public/fonts/`, preservando a mesma `variable`.
 *
 * `latin-ext` é obrigatório em português: sem ele, ã/ç/õ/é caem no fallback e a linha
 * fica mesclando duas fontes no meio da palavra.
 */

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300"],
  display: "swap",
  variable: "--font-display-family",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ui-family",
});

/**
 * O itálico da Montserrat é um arquivo à parte, em instância própria — e não
 * `style: ["normal", "italic"]` na instância acima, que traria itálico dos três pesos
 * e os colocaria todos no preload, competindo com o LCP por causa de uma frase.
 *
 * Só o peso 400 (o corpo de texto, onde a ênfase de fato aparece) e `preload: false`:
 * o arquivo é buscado quando a fonte é usada, não na cascata crítica. Sem ele, o
 * navegador inclinaria a romana por conta própria — oblíquo sintético, que na
 * Montserrat some com as terminações curvas do `a` e do `e`.
 */
const montserratItalic = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
  preload: false,
  variable: "--font-ui-italic-family",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  display: "swap",
  variable: "--font-editorial-family",
});

/**
 * Metadata — landing-page-structure.md §7.
 *
 * `title` e `description` vêm de content.ts e ainda carregam o marcador da cidade: é
 * proposital (o dado que mais pesa em busca local não pode ser inventado), e é o motivo
 * de o título estourar os 60 caracteres hoje. Ao substituir o marcador na Fase 9, ele
 * volta para a faixa.
 *
 * `robots` só libera indexação quando existe domínio final: enquanto a URL canônica for
 * o localhost ou uma URL de preview da Vercel, a página pede `noindex` — preview
 * indexado compete com o domínio real e é trabalhoso de tirar do índice depois.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  applicationName: profile.nome,
  authors: [{ name: profile.nome, url: social.instagram?.url }],
  creator: profile.nome,
  alternates: { canonical: "/" },
  robots: canonicalPendente
    ? { index: false, follow: false }
    : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: `${profile.nome} — ${profile.titulo}`,
    title: seo.title,
    description: seo.description,
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${montserrat.variable} ${montserratItalic.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* As máscaras orgânicas vivem aqui, uma única vez: o OrganicImage só referencia
            por id (DESIGN-GUIDELINES.md §6). Não renderiza nada visível. */}
        <OrganicClipPaths />
        {children}
      </body>
    </html>
  );
}
