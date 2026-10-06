import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Existe um package-lock.json solto em ~/, o que faz o Turbopack inferir a home
  // como raiz do workspace. Fixar aqui evita o warning e o risco de resolver
  // dependências do lugar errado.
  turbopack: {
    root: __dirname,
  },

  // NÃO adicionar `output: "export"`.
  // Static export desliga a otimização do next/image, e o deploy é na Vercel — que já
  // gera as páginas estáticas E mantém a otimização. Ver landing-page-structure.md §2.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
