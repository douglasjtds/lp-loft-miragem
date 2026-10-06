# public/brand/

Os ativos proprietários da marca, extraídos do manual da cliente.

| Arquivo | Uso |
|---|---|
| `monograma.png` (ou `.svg`) | Header (32px de altura) e 404. Nunca esticado, nunca rotacionado. |
| `monograma-claro.png` | A versão para fundo escuro — footer e faixa de fechamento. |
| `icone-*.svg` | Os ícones-assinatura, um por pilar. **Precisam usar `stroke`, nunca `fill`** — é requisito da animação de desenho. |

Os traçados que a página de fato anima ficam inline em `src/config/brand-icons.ts`, não
aqui: o SVG precisa estar no DOM para ser animável. Estes arquivos existem para uso
fora do React (og-image, e-mail, materiais da cliente) e devem ser idênticos aos de lá.
