/**
 * Analytics — landing-page-structure.md §6.
 *
 * A métrica de sucesso da página é uma só: cliques no CTA de WhatsApp, por origem.
 *
 * Nenhuma dependência é instalada aqui. O provedor (Vercel Analytics) só entra na
 * Fase 9, e este módulo já convive com as três possibilidades — `window.va`, `gtag`
 * ou `dataLayer` — sem quebrar quando nenhuma existe. Custo: zero KB de bundle.
 */

import type { CtaOrigem } from "@/lib/whatsapp";

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    va?: (event: "event", payload: { name: string } & EventParams) => void;
    gtag?: (command: "event", name: string, params?: EventParams) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  if (typeof window.va === "function") {
    window.va("event", { name, ...params });
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
    return;
  }

  // Sem provedor: em dev o evento fica visível no console para dar para conferir que o
  // clique dispara. Em produção, silêncio — analytics não é motivo para poluir o console.
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, params);
  }
}

/** O evento que importa. `origem` é a mesma chave da tabela de mensagens da §6. */
export function trackCtaWhatsapp(origem: CtaOrigem): void {
  trackEvent("cta_whatsapp", { origem });
}
