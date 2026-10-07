# Product

<!-- impeccable:product-schema 1 -->

> **Fonte da verdade:** `instructions/` (`DESIGN-GUIDELINES.md`, `landing-page-structure.md`,
> `TODOs.md`). Este arquivo só resume o produto. Em qualquer conflito, `instructions/` prevalece.
> Decisões visuais (paleta, tipografia, formas, motion) vivem no `DESIGN-GUIDELINES.md`; não há
> `DESIGN.md` neste projeto.

## Platform

web

## Users

Casais que querem sair da rotina por um fim de semana, provavelmente de Belo Horizonte ou do
interior de Minas, e que já viram dezenas de anúncios de temporada parecidos. Chegam quase sempre
pelo celular: link na bio do Instagram @loft_miragem e links compartilhados no WhatsApp. Busca
orgânica ("loft Três Marias", "hospedagem casal Três Marias") é canal secundário.

O trabalho deles na página: se imaginar no loft, confirmar que é real e bem avaliado, checar se
cabe no que precisam e saber como reservar, em poucos segundos.

## Product Purpose

Landing page one-page do **Loft Miragem**, loft de hospedagem na represa de Três Marias, MG.
Existe para levar o visitante a abrir uma conversa no WhatsApp com os anfitriões, com mensagem
pré-preenchida que indica de qual ponto da página veio. Ação secundária: abrir o anúncio no Airbnb.

Sucesso = cliques no CTA de WhatsApp por sessão (e, separado, cliques no Airbnb). Não há
formulário, calendário, motor de reserva nem backend.

## Positioning

Loft pensado para casais, na beira da represa de Três Marias, com piscina-praia, SUP e o pôr do
sol de frente para o mezanino, reservado direto com os anfitriões, Calypso Martins e André
Tertuliano. Frase da própria cliente, usada literalmente: "A vista mais exclusiva de Três Marias".

## Operating Context

- Os anfitriões (Calypso Martins e André Tertuliano) são os clientes do projeto e respondem as
  conversas do WhatsApp (+55 31 97204-4476).
- O anúncio no Airbnb (`airbnb.com.br/rooms/1440093946948725210`) é a referência pública de nota,
  avaliações e comodidades.
- Desenvolvimento por fases (`instructions/TODOs.md`); o Douglas commita, o Claude nunca.

## Capabilities and Constraints

- Next.js App Router + TypeScript + Tailwind, deploy na Vercel. Sem `output: 'export'`.
- Conversão só por link `wa.me`; origem rastreada pela mensagem pré-preenchida.
- Acomoda até 4 pessoas, mas o produto é pensado para casais.
- Terminologia: "represa", nunca "praia" ou "mar" (exceto "piscina-praia").
- **Nunca inventar dado.** Preço, horários, regras da casa, café da manhã, pet, distância,
  localização exata, forma de pagamento e vantagem da reserva direta são decisões abertas e
  aparecem como `<<A CONFIRMAR: ...>>` até os anfitriões responderem.
- Domínio ainda não existe: página fica `noindex` até lá.

## Brand Commitments

- Nome: Loft Miragem. Logo em `reference-files/POUSADA LOGO.png` (sol sobre cinco ondas num círculo).
- Voz calorosa, sensorial e direta, sem clichê de anúncio de temporada; "você" e "vocês dois";
  primeira pessoa do plural quando falam os anfitriões.
- Detalhe da voz e todas as regras visuais: `instructions/DESIGN-GUIDELINES.md`.

## Evidence on Hand

- Confirmado no Airbnb (2026-10-05): nota 5,0, 5 avaliações, selo Preferido dos hóspedes;
  4 hóspedes, 1 quarto, 2 camas, 1 banheiro; piscina-praia, pranchas de SUP, beira da represa,
  cozinha, Wi-Fi e espaço de trabalho, estacionamento gratuito, self check-in com cofre.
- Fotos reais em `reference-files/`: `por-do-sol.jpg`, `cafe-da-manha.jpg`, `piscina-noite.jpg`,
  `mari-com-prancha.jpg` (pessoa identificável, autorização de uso confirmada em 2026-10-07),
  `duas-pranchas-logo.jpg` (640px, sem original em alta).
- **Ausentes, não fabricar:** texto das avaliações (aguardando prints; seção fica oculta),
  mais fotos da galeria, vídeos, preço, regras, horários, localização detalhada.

## Product Principles

1. O visitante reserva porque se imagina lá: foto real e o dia no loft vêm antes de qualquer dado.
2. Prova só com o que é verificável; o que não foi confirmado fica marcado, nunca preenchido.
3. Uma conversão principal: tudo aponta para o WhatsApp; o Airbnb é alternativa, não concorrente.
4. Mobile primeiro de verdade, porque o tráfego vem do Instagram e do WhatsApp.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste conforme a tabela do `DESIGN-GUIDELINES.md` §3, foco visível em todos os
interativos, alvos de toque ≥ 44px, `prefers-reduced-motion` desliga toda animação.
