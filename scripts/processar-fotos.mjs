/**
 * Processa as fotos da cliente para `public/images/`.
 *
 * Registro do tratamento aplicado, não parte do build: rode à mão com
 * `node scripts/processar-fotos.mjs` sempre que as fotos-fonte mudarem. Ter isto versionado é
 * o que permite refazer o acervo inteiro meses depois sem tentar lembrar quais ajustes foram
 * aplicados.
 *
 * `node scripts/processar-fotos.mjs --antes` gera as mesmas fotos SEM tratamento em
 * `public/images/antes/` (fora do git), só para o comparativo antes/depois do /styleguide.
 *
 * Três decisões guiam o script:
 *
 * 1. **Saída em JPEG, não AVIF/WebP.** O `next/image` já converte para AVIF/WebP na
 *    borda (next.config.ts → images.formats). O que fica no repositório é o original
 *    de trabalho, e JPEG é o que a otimização do Next aceita melhor.
 *
 * 2. **Tratamento leve e unificado, sem igualar os horários** (DESIGN-GUIDELINES §9). Manhã,
 *    pôr do sol e noite TÊM de parecer horários diferentes: o contraste entre eles é a
 *    Experiência. O que unifica é só: aquecer ~2,5% e tirar 8% de saturação do turquesa da
 *    piscina, para não brigar com o token `decor`. Ajuste olhando o /styleguide, não a foto
 *    isolada: o que decide o valor é a foto ao lado da outra.
 *
 * 3. **Nomes semânticos.** O nome é o papel da foto na página (`manha-cafe`, não `IMG_4512`).
 *
 * `sharp` vem junto com o Next; deliberadamente não está no package.json.
 */

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PASTA_ORIGEM = "reference-files";
const ANTES = process.argv.includes("--antes");

const origem = (nome) => resolve(raiz, PASTA_ORIGEM, nome);
const destino = (nome) => resolve(raiz, "public", nome);

/** Orçamento por arquivo (landing-page-structure §8). */
const LIMITE_NORMAL = 200 * 1024;
const LIMITE_GRANDE = 350 * 1024;

/**
 * Uma linha por foto, do original ao destino.
 *
 * - `largura`/`altura`: sem `altura`, o redimensionamento é proporcional (`inside`).
 *   Com as duas, vira corte (`cover`); `posicao` escolhe o que sobrevive.
 * - `grande`: largura da versão do lightbox (`<nome>-grande.jpg`), sem corte. Ausente quando o
 *   original não tem resolução para isso: a normal já é o teto.
 * - `sombras`: força do levantamento de sombras (0 = nenhum). Só onde a foto chegou escura.
 * - `qualidade` / `qualidadeGrande`: JPEG (padrão 80); abaixe só a da variante que estourar
 *   o orçamento. Céu de pôr do sol e água com textura fina são os que mais pesam.
 */
const FOTOS = [
  {
    de: "por-do-sol.jpg",
    para: "images/hero-por-do-sol.jpg",
    largura: 1200,
    altura: 1500,
    /* 4:5 a partir de 3:4: o corte sai de baixo (borda da cama), e o sol fica a ~32% da altura,
       no terço superior. */
    posicao: "north",
    grande: 1440,
    qualidade: 76,
    nota: "Herói (LCP, priority) · 4:5",
  },
  {
    de: "cafe-da-manha.jpg",
    para: "images/manha-cafe.jpg",
    largura: 1100,
    grande: 1440,
    qualidade: 75,
    qualidadeGrande: 76,
    nota: "Experiência · manhã",
  },
  {
    de: "mari-com-prancha.jpg",
    para: "images/tarde-sup.jpg",
    largura: 1100,
    grande: 1600,
    qualidadeGrande: 76,
    nota: "Experiência · tarde (original 3072×4096)",
  },
  {
    de: "piscina-noite.jpg",
    para: "images/noite-piscina.jpg",
    largura: 1100,
    grande: 1440,
    sombras: 0.9,
    nota: "Experiência · noite, sombras levantadas",
  },
  {
    de: "duas-pranchas-logo.jpg",
    para: "images/galeria-pranchas.jpg",
    /* O original tem 640px: sem upscale, e o lightbox usa esta mesma. */
    largura: 640,
    nota: "Galeria · 640px também no lightbox",
  },
];

/* ---------- Tratamento por pixel ---------- */

const AQUECER = 0.025;
const TURQUESA_DESSATURA = 0.08;
/** Faixa de matiz do turquesa da piscina, em graus, com 15° de transição suave em cada lado. */
const TURQUESA_DE = 165;
const TURQUESA_ATE = 200;
const TURQUESA_BORDA = 15;

const suave = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Peso 0..1 de quanto um matiz pertence à faixa do turquesa. */
function pesoTurquesa(matiz) {
  if (matiz >= TURQUESA_DE && matiz <= TURQUESA_ATE) return 1;
  if (matiz < TURQUESA_DE) return suave(1 - (TURQUESA_DE - matiz) / TURQUESA_BORDA);
  return suave(1 - (matiz - TURQUESA_ATE) / TURQUESA_BORDA);
}

function matizDe(r, g, b, max, croma) {
  let h;
  if (max === r) h = ((g - b) / croma) % 6;
  else if (max === g) h = (b - r) / croma + 2;
  else h = (r - g) / croma + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

/**
 * Aplica, num passe só: aquecimento, turquesa −8% e (opcional) levantamento de sombras.
 *
 * O levantamento usa o canal MAIS ALTO do pixel como medida de claridade, não a luminância:
 * o azul da piscina iluminada tem luminância baixa (o azul pesa 7% nela) mas canal azul quase
 * no teto, e uma curva em luminância o empurraria para 255. Medindo pelo máximo, o azul vivo
 * mal se move e o que sobe é o escuro de verdade (fachada, céu, borda da piscina).
 */
function tratar(dados, canais, sombras) {
  for (let i = 0; i < dados.length; i += canais) {
    let r = dados[i] / 255;
    let g = dados[i + 1] / 255;
    let b = dados[i + 2] / 255;

    r *= 1 + AQUECER;
    b *= 1 - AQUECER;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const croma = max - min;
    if (croma > 0.04) {
      const peso =
        pesoTurquesa(matizDe(r, g, b, max, croma)) * suave((croma / max - 0.1) / 0.15);
      if (peso > 0) {
        const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const f = 1 - TURQUESA_DESSATURA * peso;
        r = y + (r - y) * f;
        g = y + (g - y) * f;
        b = y + (b - y) * f;
      }
    }

    if (sombras > 0) {
      const v = Math.max(r, g, b);
      let ganho = 1 + sombras * (1 - v) ** 3;
      if (v * ganho > 1) ganho = 1 / v;
      r *= ganho;
      g *= ganho;
      b *= ganho;
    }

    dados[i] = Math.round(Math.min(1, r) * 255);
    dados[i + 1] = Math.round(Math.min(1, g) * 255);
    dados[i + 2] = Math.round(Math.max(0, Math.min(1, b)) * 255);
  }
}

/* ---------- Saída ---------- */

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function gerar(foto, { para, largura, altura, posicao, qualidade, limite }) {
  const saida = destino(para);
  await mkdir(dirname(saida), { recursive: true });

  const base = sharp(origem(foto.de))
    /* Respeita a orientação EXIF antes de qualquer corte: sem isso, foto de celular sai
       deitada. */
    .rotate()
    .resize({
      width: largura,
      height: altura,
      fit: altura ? "cover" : "inside",
      position: posicao,
      withoutEnlargement: true,
    })
    .removeAlpha()
    .toColourspace("srgb");

  let pipeline = base;
  if (!ANTES) {
    const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
    tratar(data, info.channels, foto.sombras ?? 0);
    pipeline = sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    });
  }

  const { size, width, height } = await pipeline
    .jpeg({ quality: qualidade ?? 80, mozjpeg: true, progressive: true })
    .toFile(saida);

  const estourou = size > limite;
  console.log(
    `${estourou ? "⚠️ " : "  "}${para.padEnd(38)} ${`${width}×${height}`.padStart(10)} ${kb(size).padStart(8)}  ${foto.nota}`,
  );
  return estourou;
}

let acima = 0;

for (const foto of FOTOS) {
  const pasta = ANTES ? (p) => p.replace("images/", "images/antes/") : (p) => p;

  acima += await gerar(foto, {
    para: pasta(foto.para),
    largura: foto.largura,
    altura: foto.altura,
    posicao: foto.posicao,
    qualidade: foto.qualidade,
    limite: LIMITE_NORMAL,
  });

  if (foto.grande && !ANTES) {
    acima += await gerar(foto, {
      para: foto.para.replace(/\.jpg$/, "-grande.jpg"),
      largura: foto.grande,
      qualidade: foto.qualidadeGrande,
      limite: LIMITE_GRANDE,
    });
  }
}

if (acima > 0) {
  console.log(
    `\n  ${acima} imagem(ns) acima do orçamento (200KB, ou 350KB no lightbox). Reduza a largura ou a qualidade.\n`,
  );
}
