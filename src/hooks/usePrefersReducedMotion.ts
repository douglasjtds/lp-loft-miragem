"use client";

import { useSyncExternalStore } from "react";

/**
 * `prefers-reduced-motion` — DESIGN-GUIDELINES.md §8, item 4.
 *
 * Reativo à media query, e não uma leitura única: o usuário pode ligar "reduzir
 * movimento" no sistema com a página aberta, e a partir daí nenhum loop pode continuar
 * rodando. Todos os componentes de motion leem daqui.
 *
 * `useSyncExternalStore` e não `useState` + `useEffect`: a preferência é estado de fora
 * do React, e ler por efeito significaria uma renderização a mais logo depois da
 * hidratação (que é justamente a janela em que o herói ainda está tentando animar).
 *
 * O snapshot de servidor é `true` de propósito. Antes da hidratação não existe
 * `matchMedia`, e o padrão seguro nessa janela é NÃO animar — o contrário arriscaria
 * aplicar um estado inicial escondido antes de saber que ele é permitido.
 */

const CONSULTA = "(prefers-reduced-motion: reduce)";

function assinar(aoMudar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}

const lerNoCliente = () => window.matchMedia(CONSULTA).matches;

const lerNoServidor = () => true;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(assinar, lerNoCliente, lerNoServidor);
}
