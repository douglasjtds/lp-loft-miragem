# lp-loft-miragem

Landing page one-page do **Loft Miragem**, loft para casais na represa de Três Marias, MG.
Conversão por WhatsApp, sem backend. Next.js (App Router) + TypeScript + Tailwind, deploy na Vercel.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000  ·  /styleguide para validação visual
```

## Checar e buildar

```bash
npm run lint
npm run typecheck
npm run build      # build de produção (sem output: 'export')
```

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Tokens de cor e fonte | `src/app/globals.css` (bloco `@theme`) e `src/config/brand.ts` |
| Contato, links, anfitriões | `src/config/brand.ts` |
| Toda a copy | `src/config/content.ts` |
| Tabela de contraste WCAG | `node scripts/contraste.mjs` (`--md` para markdown) |
| Pipeline de fotos | `node scripts/processar-fotos.mjs` (originais em `reference-files/`) |
| Especificação (fonte da verdade) | `instructions/` |
