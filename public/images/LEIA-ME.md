# public/images/

As fotos tratadas, com nomes semânticos: o nome é o papel da foto na página. Geradas a partir de
`reference-files/` por `node scripts/processar-fotos.mjs`; nunca edite estes arquivos à mão.

| Arquivo | Papel | Origem | Observações |
|---|---|---|---|
| `hero-por-do-sol.jpg` | Herói (LCP, `priority`) | `por-do-sol.jpg` | 1200×1500 (4:5), corte por baixo: o sol fica no terço superior |
| `manha-cafe.jpg` | Experiência · manhã | `cafe-da-manha.jpg` | 1100px |
| `tarde-sup.jpg` | Experiência · tarde | `mari-com-prancha.jpg` | 1100px. Pessoa identificável: `<<A CONFIRMAR: autorização de uso de imagem>>` |
| `noite-piscina.jpg` | Experiência · noite | `piscina-noite.jpg` | 1100px, sombras levantadas sem mexer no azul |
| `galeria-pranchas.jpg` | Galeria | `duas-pranchas-logo.jpg` | 640px, a resolução do original: é também a do lightbox |
| `*-grande.jpg` | Lightbox | as mesmas | 1440 a 1600px, carregadas só ao abrir |

Tratamento comum (DESIGN-GUIDELINES §9): aquecer ~2,5% e tirar 8% de saturação do turquesa. Os
horários NÃO são igualados.

Orçamento: até ~200KB por foto e ~350KB nas versões do lightbox. O script avisa quando estoura.

`antes/` (fora do git) é o comparativo sem tratamento do /styleguide:
`node scripts/processar-fotos.mjs --antes`.
