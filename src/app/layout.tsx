import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";

import { OrganicClipPaths } from "@/components/ui/OrganicClipPaths";
import { profile, social } from "@/config/brand";
import { seo } from "@/config/content";
import { canonicalPendente, siteUrl } from "@/lib/site-url";

import "./globals.css";

/**
 * As famílias, nos papéis definidos em DESIGN-GUIDELINES.md §4: Fraunces (display e,
 * em itálico, editorial) e Nunito Sans (UI). Ambas Google Fonts, OFL; o
 * `next/font/google` faz self-host no build, e o navegador do visitante nunca fala com
 * o Google. As custom properties têm nome de PAPEL: globals.css e os componentes não
 * sabem qual família está atrás delas.
 *
 * `latin-ext` é obrigatório em português: sem ele, ã/ç/õ/é caem no fallback e a linha
 * fica mesclando duas fontes no meio da palavra.
 */

/**
 * Fraunces variável, sem `weight`: um arquivo só cobre 500 e 600 e os eixos pedidos.
 * `SOFT` arredonda as serifas (o display usa 80, ver globals.css); `opsz` deixa o
 * navegador escolher o corte óptico pelo tamanho, que é o que segura o h1 grande sem
 * ficar pesado e o h2 pequeno sem ficar frágil.
 */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
  display: "swap",
  variable: "--font-display-family",
});

/**
 * O editorial é o itálico da própria Fraunces, em instância separada, e não
 * `style: ["normal", "italic"]` na de cima: só aparece nas avaliações e em pull quotes,
 * bem abaixo da dobra. `preload: false` tira o arquivo da cascata crítica, para não
 * competir com o LCP do herói.
 */
const frauncesItalic = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
  preload: false,
  variable: "--font-editorial-family",
});

/**
 * Nunito Sans também é variável: sem `weight`, um arquivo por subset cobre 400, 500
 * e 600, em vez de três arquivos estáticos no preload.
 */
const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-ui-family",
});

/**
 * O itálico da Nunito Sans, só para `<em>` no corpo de texto. Instância própria, só
 * 400 e `preload: false`, pelo mesmo motivo do itálico da Fraunces. Sem ele o navegador
 * inclinaria a romana por conta própria (oblíquo sintético).
 */
const nunitoSansItalic = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
  preload: false,
  variable: "--font-ui-italic-family",
});

/**
 * Metadata — landing-page-structure.md §7.
 *
 * `title` e `description` vêm de content.ts (texto final na Fase 4).
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
    siteName: profile.nome,
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
      className={`${fraunces.variable} ${frauncesItalic.variable} ${nunitoSans.variable} ${nunitoSansItalic.variable} h-full antialiased`}
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
