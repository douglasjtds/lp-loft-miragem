/**
 * Gera os ativos de marca rasterizados: logo clara, monograma PNG, favicon, apple-touch-icon
 * e og-image.
 *
 * Registro, não parte do build: rode à mão com `node scripts/processar-marca.mjs` depois de
 * `processar-fotos.mjs` (a og-image usa a foto do herói já tratada) e sempre que a logo ou o
 * monograma mudarem.
 *
 * `sharp` vem junto com o Next; deliberadamente não está no package.json.
 */

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const caminho = (p) => resolve(raiz, p);

const LOGO_ORIGINAL = caminho("reference-files/POUSADA LOGO.png");
const MONOGRAMA_SVG = caminho("public/brand/monograma.svg");
/** A versão grande já tratada (1440×1920): a og-image herda o mesmo tratamento do herói. */
const FOTO_OG = caminho("public/images/hero-por-do-sol-grande.jpg");

/**
 * Espelho do token `papel` (src/config/brand.ts). Script .mjs não importa .ts; se o token
 * mudar, mude aqui também.
 */
const PAPEL = { r: 0xfb, g: 0xf7, b: 0xf1 };

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
const relatorio = [];
const registrar = (arquivo, bytes, nota) => relatorio.push({ arquivo, bytes, nota });

/* ---------- Logo ---------- */

await mkdir(caminho("public/brand"), { recursive: true });
await copyFile(LOGO_ORIGINAL, caminho("public/brand/logo.png"));
registrar("brand/logo.png", (await readFile(LOGO_ORIGINAL)).length, "Original, fundo transparente");

/**
 * Versão para fundo `ancora`: o grafite da logo (texto, contorno, sol, ondas) vira `papel`;
 * o céu e a água do emblema ficam como estão.
 *
 * "Grafite" aqui é escuro E quase neutro. A borda antialias entre o contorno e o interior
 * colorido é uma mistura dos dois; o peso contínuo (em vez de um corte seco) recolore essa
 * borda na mesma proporção, para não sobrar um fio escuro em volta do emblema.
 */
{
  const { data, info } = await sharp(LOGO_ORIGINAL)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const suave = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const max = Math.max(r, g, b);
    const croma = max - Math.min(r, g, b);
    const escuro = suave((0.62 - max) / 0.3);
    const neutro = suave((0.22 - croma) / 0.14);
    const peso = escuro * neutro;
    if (peso === 0) continue;
    data[i] = Math.round(data[i] + (PAPEL.r - data[i]) * peso);
    data[i + 1] = Math.round(data[i + 1] + (PAPEL.g - data[i + 1]) * peso);
    data[i + 2] = Math.round(data[i + 2] + (PAPEL.b - data[i + 2]) * peso);
  }

  const saida = caminho("public/brand/logo-clara.png");
  const { size } = await sharp(data, { raw: info })
    .png({ compressionLevel: 9, palette: false })
    .toFile(saida);
  registrar("brand/logo-clara.png", size, "Grafite → papel, para o footer (fundo ancora)");
}

/* ---------- Monograma rasterizado ---------- */

const svg = await readFile(MONOGRAMA_SVG);
const monograma = (lado) => sharp(svg, { density: 72 * (lado / 272) * 2 }).resize(lado, lado);

{
  const { size } = await monograma(512).png().toFile(caminho("public/brand/monograma.png"));
  registrar("brand/monograma.png", size, "512px · Header e logo do JSON-LD");
}

/**
 * apple-touch-icon: o iOS preenche transparência com preto, então vai sobre `papel`, com
 * margem para o recorte arredondado do sistema não comer o contorno.
 */
{
  const lado = 180;
  const emblema = await monograma(144).png().toBuffer();
  const { size } = await sharp({
    create: { width: lado, height: lado, channels: 3, background: PAPEL },
  })
    .composite([{ input: emblema, gravity: "center" }])
    .png()
    .toFile(caminho("public/apple-touch-icon.png"));
  registrar("apple-touch-icon.png", size, "180px, monograma sobre papel");
}

/**
 * favicon.ico com PNGs embutidos (16, 32, 48). O sharp não escreve ICO; o contêiner é só um
 * cabeçalho de 6 bytes, uma entrada de 16 bytes por tamanho e os PNGs em sequência.
 */
{
  const tamanhos = [16, 32, 48];
  const pngs = await Promise.all(tamanhos.map((t) => monograma(t).png().toBuffer()));

  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(pngs.length, 4);

  let deslocamento = 6 + 16 * pngs.length;
  const entradas = pngs.map((png, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(tamanhos[i] % 256, 0);
    e.writeUInt8(tamanhos[i] % 256, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(deslocamento, 12);
    deslocamento += png.length;
    return e;
  });

  const ico = Buffer.concat([cabecalho, ...entradas, ...pngs]);
  await writeFile(caminho("public/favicon.ico"), ico);
  registrar("favicon.ico", ico.length, "16 + 32 + 48 px");
}

/**
 * og-image 1200×630. Sem overlay escuro nem texto claro sobre a foto (DESIGN-GUIDELINES §2):
 * a foto do pôr do sol à esquerda, recortada no sol e no reflexo na represa, e um painel
 * `papel` à direita com a logo original. No preview do WhatsApp (que corta as bordas em
 * alguns tamanhos) os dois lados continuam reconhecíveis.
 */
{
  const largura = 1200;
  const altura = 630;
  const fotoLargura = 690;

  /* Na foto (1440×1920) o sol está em ~(530, 570) e o reflexo desce até ~760. O recorte
     (proporção 690:630) pega da viga do teto à primeira fileira de corda: sol a ~1/3 da
     altura, represa e reflexo inteiros. */
  const foto = await sharp(FOTO_OG)
    .extract({ left: 0, top: 250, width: 1100, height: 1004 })
    .resize(fotoLargura, altura)
    .toBuffer();

  const logo = await sharp(LOGO_ORIGINAL).resize({ width: 400 }).toBuffer();

  const saida = caminho("public/og-image.jpg");
  const { size } = await sharp({
    create: { width: largura, height: altura, channels: 3, background: PAPEL },
  })
    .composite([
      { input: foto, left: 0, top: 0 },
      {
        input: logo,
        left: fotoLargura + Math.round((largura - fotoLargura - 400) / 2),
        top: Math.round((altura - (await sharp(logo).metadata()).height) / 2),
      },
    ])
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(saida);
  registrar("og-image.jpg", size, "1200×630, pôr do sol + logo");
}

for (const { arquivo, bytes, nota } of relatorio) {
  console.log(
    `${bytes > 200 * 1024 ? "⚠️ " : "  "}${arquivo.padEnd(28)} ${kb(bytes).padStart(8)}  ${nota}`,
  );
}
