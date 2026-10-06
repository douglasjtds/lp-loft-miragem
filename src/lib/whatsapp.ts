/**
 * Montagem do link de WhatsApp — a única ação de conversão da página.
 * Especificação: landing-page-structure.md §6.
 *
 * O texto das mensagens mora em `content.ts`, junto com o resto da copy. Aqui fica só
 * a mecânica: quais origens existem, como o link é montado e o que acontece enquanto o
 * número da cliente não chegou.
 */

import { whatsapp } from "@/config/brand";
import { mensagensPorOrigem } from "@/config/content";

/**
 * Os pontos da página que podem iniciar a conversa.
 *
 * Cada um manda uma mensagem diferente, e é assim que a cliente descobre de onde veio
 * o lead sem nenhuma infraestrutura — a mensagem que chega no celular dela já diz de
 * qual ponto da página a pessoa saiu. É o rastreamento mais barato que existe, e o
 * único que sobrevive numa página sem backend.
 *
 * Acrescentar uma origem aqui obriga a escrever a mensagem em `content.ts`: o `Record`
 * de lá não compila incompleto, e isso é de propósito.
 */
export type CtaOrigem =
  "hero" | "header" | "como-funciona" | "cta-final" | "sticky-mobile";

/**
 * @param phone Formato internacional, só dígitos: 55 + DDD + número. Vem de brand.ts.
 * @param message Texto pré-preenchido da conversa.
 */
export function buildWhatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** 55 + DDD + 8 ou 9 dígitos. A faixa 10–15 cobre também número internacional. */
function telefoneUtilizavel(phone: string): boolean {
  return /^\d{10,15}$/.test(phone);
}

export type CtaLink = { href: string; mensagem: string };

/**
 * Link pronto para uma origem — ou `null` enquanto o número da cliente não chegar
 * (`brand.whatsapp.phone` é `""` até lá).
 *
 * `null` não é caso de erro: é a pendência de `<<A CONFIRMAR>>` chegando até a
 * interface. Quem consome (WhatsappCta) precisa renderizar o estado desabilitado —
 * nunca um `https://wa.me/?text=...` sem destinatário, que abriria o WhatsApp em
 * branco e passaria despercebido até a produção.
 */
export function linkDoCta(origem: CtaOrigem): CtaLink | null {
  const mensagem = mensagensPorOrigem[origem];

  if (!telefoneUtilizavel(whatsapp.phone)) return null;

  return { href: buildWhatsappUrl(whatsapp.phone, mensagem), mensagem };
}
