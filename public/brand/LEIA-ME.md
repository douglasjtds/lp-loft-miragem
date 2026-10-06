# public/brand/

Os ativos da marca. A cliente não tem manual de identidade: tudo aqui foi redesenhado a partir
da logo (`reference-files/POUSADA LOGO.png`). Origem de cada um em DESIGN-GUIDELINES.md §5.

| Arquivo | Uso |
|---|---|
| `monograma.svg` | O emblema da logo (sol + ondas) em vetor. Header (36px) e 404. Nunca esticado, nunca rotacionado, nunca sobre foto. |
| `monograma-claro.svg` | Contorno em `papel`, preenchimentos a 85%: footer e faixa de fechamento (fundo `ancora`). |
| `monograma.png` | 512px rasterizado do SVG: logo do JSON-LD e onde SVG não serve. |
| `logo.png` | A logo original da cliente, fundo transparente. og-image. |
| `logo-clara.png` | A logo com o grafite (texto, contorno, sol, ondas) recolorido para `papel`: footer e fundo `ancora`. |
| `icone-*.svg` | Os quatro ícones-assinatura (`sol-nascente`, `prancha`, `lua-agua`, `onda`). **Precisam usar `stroke`, nunca `fill`**: é requisito da animação de desenho. |

Os traçados que a página de fato anima ficam inline em `src/config/brand-icons.ts`, não
aqui: o SVG precisa estar no DOM para ser animável. Estes arquivos existem para uso
fora do React (og-image, materiais da cliente) e devem ser idênticos aos de lá.

Os PNGs, o `favicon.ico`, o `apple-touch-icon.png` e a `og-image.jpg` (na raiz de `public/`) saem
de `node scripts/processar-marca.mjs`. Rode depois de `processar-fotos.mjs`: a og-image usa a
foto do herói já tratada.
