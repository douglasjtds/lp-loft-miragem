import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Depoimentos } from "@/components/sections/Depoimentos";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Metodo } from "@/components/sections/Metodo";
import { ParaQuem } from "@/components/sections/ParaQuem";
import { ProvaRapida } from "@/components/sections/ProvaRapida";
import { Sobre } from "@/components/sections/Sobre";
import { header } from "@/config/content";
import { jsonLd } from "@/lib/schema";

/**
 * Composição das seções da landing page — e nada mais. Nenhuma lógica, nenhum texto.
 *
 * A ordem é o argumento da §5, e não uma lista: quem ela é → por que confiar → você é
 * atendida aqui → como ela trabalha → o que acontece na prática → quem é ela de verdade
 * → outros confiaram → dúvidas → agir.
 *
 * `ProvaRapida` e `Depoimentos` decidem sozinhas não renderizar enquanto não houver dado
 * confirmado da cliente (ver os dois componentes). Ficam montadas aqui de propósito:
 * quando os dados chegarem, o único arquivo que muda é content.ts.
 */
export default function Home() {
  return (
    <>
      {/* Dados estruturados (§7). Fica aqui, e não no layout, porque o grafo descreve
          ESTA página — incluindo o FAQPage, que espelha o accordion abaixo. No layout,
          a 404 herdaria um FAQPage que ela não tem. Server component: o JSON sai pronto
          no HTML, sem depender de JS no cliente. */}
      <script
        type="application/ld+json"
        // O conteúdo vem de brand.ts/content.ts, nunca de entrada externa. O escape de
        // "<" é o cinto de segurança: JSON.stringify sozinho deixaria um "</script>"
        // dentro de uma string fechar a tag e quebrar o HTML.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c"),
        }}
      />

      {/* Primeiro elemento focável da página: sem ele, quem navega por teclado passa
          pelo header inteiro a cada visita (§9). Só aparece quando recebe foco. */}
      <a
        href="#conteudo"
        className="font-ui focus-visible:bg-ancora focus-visible:text-papel sr-only text-sm focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-60 focus-visible:px-4 focus-visible:py-2"
      >
        {header.pularParaConteudo}
      </a>

      <Header />

      <main id="conteudo" className="flex-1">
        <Hero />
        <ProvaRapida />
        <ParaQuem />
        <Metodo />
        <ComoFunciona />
        <Sobre />
        <Depoimentos />
        <Faq />
        <CtaFinal />
      </main>

      <Footer />
      <StickyMobileCta />
    </>
  );
}
