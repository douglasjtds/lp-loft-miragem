# public/images/

As fotos otimizadas, com nomes semânticos. Os nomes abaixo são os que `content.ts`
referencia por padrão — renomeie lá se preferir outros, mas mantenha nomes que digam o
PAPEL da foto na página, não o número da câmera.

| Arquivo | Papel | Observações |
|---|---|---|
| `retrato-hero.jpg` | Herói | A melhor do conjunto: fundo limpo, contato visual, contexto de trabalho. É a candidata a LCP: `priority`, recorte vertical 4:5, rosto no terço superior. |
| `retrato-sobre.jpg` | Sobre | A que humaniza. Máscara orgânica obrigatoriamente diferente da do herói. |
| `pilar-um.jpg` | Método, primeiro pilar | Retrato. |
| `pilar-tres.jpg` | Método, terceiro pilar | Paisagem — o assunto é a cena, não a pessoa. |
| `atendimento.jpg` | Como funciona | Foto de procedimento real. Se não existir, deixe `comoFunciona.foto: null` — foto de banco aqui é pior que foto nenhuma. |

Gere as variantes com `node scripts/processar-fotos.mjs`. Nenhuma imagem deve passar de
~200KB na maior variante.
