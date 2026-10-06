/**
 * Carregamento do anime.js — DESIGN-GUIDELINES.md §8.
 *
 * Uma regra da §8 está codificada aqui, e nenhum componente de motion deve importar
 * `animejs` por conta própria: **`import()` dinâmico, nunca estático**. Assim o bundler
 * emite um chunk separado, buscado só depois da hidratação — o JS de animação fica fora
 * do bundle inicial e nunca compete com o LCP.
 *
 * O alvo é um módulo só (`anime-lib`), e não um `import()` por subpath: ver lá o motivo,
 * que vale alguns dezenas de KB.
 *
 * Um carregador único para as três animações da página significa um chunk só, buscado
 * uma vez e medível de uma vez contra o orçamento de 15KB gzip.
 */

export async function carregarAnime() {
  const { anime } = await import("@/components/motion/anime-lib");
  return anime;
}

export type Anime = Awaited<ReturnType<typeof carregarAnime>>;
