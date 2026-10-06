import { animate } from "animejs/animation";
import { createScope } from "animejs/scope";
import { createDrawable } from "animejs/svg";
import { createTimeline } from "animejs/timeline";
import { set, stagger } from "animejs/utils";

/**
 * A superfície do anime.js que a página usa — e nada além dela.
 *
 * Este módulo existe para ser o ALVO ÚNICO do `import()` de `anime.ts`. Os imports aqui
 * são estáticos de propósito: um `import()` por subpath produzia seis grupos de chunk, e
 * como os seis subpaths compartilham o mesmo núcleo (engine, tweens, eases), o núcleo era
 * emitido seis vezes — 59KB gzip para uma biblioteca que inteira não chega perto disso.
 * Concentrando tudo num módulo, o bundler resolve o núcleo uma vez só.
 *
 * Continua fora do bundle inicial: quem carrega este arquivo é o `import()` de `anime.ts`.
 *
 * Importar por subpath ainda importa (§8): `animejs` na raiz arrastaria draggable, waapi,
 * text, motion path e os adapters, que a página não usa.
 *
 * `animejs/events` (o `onScroll`) também ficou de fora, e essa é a única razão de o chunk
 * caber no orçamento de 15KB gzip da §8: o ScrollObserver sozinho custava ~5KB gzip para
 * fazer o que o IntersectionObserver do navegador já faz de graça — e que o `Reveal` desta
 * mesma pasta já faz. Ver `DrawIcons.tsx`.
 */

export const anime = {
  animate,
  createTimeline,
  createScope,
  createDrawable,
  stagger,
  /** `utils.set` — aplicar estado inicial. Renomeado para não colidir com setState. */
  definir: set,
};
