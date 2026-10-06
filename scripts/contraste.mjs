#!/usr/bin/env node
/**
 * Tabela de contraste WCAG 2.1 — calculada, nunca estimada.
 *
 * Rode assim que os hexes da marca entrarem em `src/config/brand.ts`, ANTES de escrever
 * qualquer componente. A saída é o que decide quais pares de cor podem carregar texto,
 * e essa decisão precisa vir de cálculo.
 *
 * Foi exatamente este cálculo que, no projeto de origem deste template, derrubou a
 * escolha "óbvia" de CTA na cor de acento (3.51:1, reprovado) e levou ao CTA na cor
 * âncora (10.29:1) — que além de acessível quebra o clichê visual do botão terracota.
 *
 * Uso:
 *   node scripts/contraste.mjs                 # lê src/config/brand.ts do diretório atual
 *   node scripts/contraste.mjs caminho/brand.ts
 *   node scripts/contraste.mjs --md            # saída em tabela markdown, para colar no doc
 */

import { readFile } from "node:fs/promises";
import { argv } from "node:process";

const args = argv.slice(2);
const markdown = args.includes("--md");
const caminho =
  args.find((a) => !a.startsWith("--")) ?? "src/config/brand.ts";

/* ── Cálculo ──────────────────────────────────────────────────────────────── */

function luminanciaRelativa(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const canal = parseInt(hex.slice(i, i + 2), 16) / 255;
    return canal <= 0.03928
      ? canal / 12.92
      : Math.pow((canal + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Simétrica: a ordem das cores não muda o resultado. */
function razao(a, b) {
  const [x, y] = [luminanciaRelativa(a), luminanciaRelativa(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Veredito para TEXTO NORMAL (< 24px, ou < 18.66px bold). */
function veredito(r) {
  if (r >= 7) return { rotulo: "AAA", icone: "✅" };
  if (r >= 4.5) return { rotulo: "AA", icone: "✅" };
  if (r >= 3) return { rotulo: "só texto grande", icone: "⚠️" };
  return { rotulo: "reprovado", icone: "❌" };
}

/* ── Leitura dos tokens ───────────────────────────────────────────────────── */

const fonte = await readFile(caminho, "utf8").catch(() => {
  console.error(`Não consegui ler ${caminho}.`);
  console.error("Rode a partir da raiz do projeto, ou passe o caminho do brand.ts.");
  process.exit(1);
});

const bloco = fonte.match(/export const colors = \{([\s\S]*?)\n\} as const;/);
if (!bloco) {
  console.error("Não encontrei `export const colors = { ... } as const;` no arquivo.");
  process.exit(1);
}

const cores = {};
for (const [, nome, hex] of bloco[1].matchAll(
  /["']?([\w-]+)["']?\s*:\s*["'](#[0-9a-fA-F]{6})["']/g,
)) {
  cores[nome] = hex.toLowerCase();
}

const nomes = Object.keys(cores);
if (nomes.length === 0) {
  console.error("Bloco `colors` encontrado, mas sem nenhum par nome/hex legível.");
  process.exit(1);
}

/* ── Os pares que importam ────────────────────────────────────────────────── */

/**
 * Superfícies reais da página. Não interessa o produto cartesiano inteiro: interessa
 * saber o que pode virar texto sobre cada fundo que a página de fato usa.
 */
const superficies = ["papel", "creme", "superficie-2", "ancora"].filter(
  (s) => s in cores,
);

const pares = [];
for (const fundo of superficies) {
  for (const frente of nomes) {
    if (frente === fundo) continue;
    pares.push([frente, fundo, razao(cores[frente], cores[fundo])]);
  }
}

/* ── Saída ────────────────────────────────────────────────────────────────── */

const largura = Math.max(...nomes.map((n) => n.length));

if (markdown) {
  console.log("| Combinação | Ratio | Veredito |");
  console.log("|---|---|---|");
  for (const [frente, fundo, r] of pares) {
    const v = veredito(r);
    console.log(
      `| \`${frente}\` sobre \`${fundo}\` | **${r.toFixed(2)}:1** | ${v.icone} ${v.rotulo} |`,
    );
  }
} else {
  let fundoAtual = null;
  for (const [frente, fundo, r] of pares) {
    if (fundo !== fundoAtual) {
      fundoAtual = fundo;
      console.log(`\n  sobre ${fundo} (${cores[fundo]})`);
      console.log("  " + "─".repeat(56));
    }
    const v = veredito(r);
    console.log(
      `  ${v.icone}  ${frente.padEnd(largura)}  ${r.toFixed(2).padStart(6)}:1   ${v.rotulo}`,
    );
  }
  console.log("");
}

/* ── As verificações que não são opinião ──────────────────────────────────── */

const exigencias = [
  {
    par: ["ancora", "papel"],
    minimo: 7,
    porque: "par principal de texto da página",
  },
  {
    par: ["papel", "ancora"],
    minimo: 4.5,
    porque: "é o CTA primário — o elemento mais clicado da página",
  },
  {
    par: ["superficie-2", "ancora"],
    minimo: 4.5,
    porque: "texto de apoio na faixa escura e no footer",
  },
  {
    par: ["acento-texto", "papel"],
    minimo: 4.5,
    porque: "é o anel de foco e o único acento que carrega texto",
  },
  {
    par: ["tinta", "papel"],
    minimo: 7,
    porque: "corpo de texto longo",
  },
];

let falhou = false;
console.log("  Exigências do sistema");
console.log("  " + "─".repeat(56));
for (const { par, minimo, porque } of exigencias) {
  const [a, b] = par;
  if (!(a in cores) || !(b in cores)) continue;
  const r = razao(cores[a], cores[b]);
  const ok = r >= minimo;
  if (!ok) falhou = true;
  console.log(
    `  ${ok ? "✅" : "❌"}  ${a} sobre ${b} = ${r.toFixed(2)}:1 (mínimo ${minimo}) — ${porque}`,
  );
}

/** Decorativo é decorativo: se passar em texto, alguém vai usar como texto. */
if ("decor" in cores && "papel" in cores) {
  const r = razao(cores.decor, cores.papel);
  console.log(
    `  ${r < 4.5 ? "✅" : "⚠️ "}  decor sobre papel = ${r.toFixed(2)}:1 — ${
      r < 4.5
        ? "reprovado em texto, como deve ser (é cor decorativa)"
        : "passa em texto, e não deveria: cor decorativa que passa vira cor de texto por acidente"
    }`,
  );
}

console.log("");
process.exit(falhou ? 1 : 0);
