"use client";

import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/Button";
import { whatsapp } from "@/config/brand";
import { trackCtaWhatsapp } from "@/lib/analytics";
import { linkDoCta, type CtaOrigem } from "@/lib/whatsapp";

/**
 * O CTA da página — landing-page-structure.md §6.
 *
 * É a única conversão que existe: não há formulário, backend nem agenda. Cada origem
 * manda uma mensagem diferente, que é como a cliente descobre de onde veio o lead sem
 * nenhuma infraestrutura.
 *
 * Client component por causa do evento de analytics no clique — é o único motivo.
 */

type WhatsappCtaProps = {
  origem: CtaOrigem;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /**
   * Rótulo acessível. O texto visível costuma ser curto ("Chamar no WhatsApp"), e o
   * leitor de tela precisa saber que o link abre o WhatsApp e sai do site.
   */
  ariaLabel?: string;
  children: React.ReactNode;
};

export function WhatsappCta({
  origem,
  variant = "primary",
  size = "md",
  className,
  ariaLabel = "Chamar no WhatsApp (abre em nova aba)",
  children,
}: WhatsappCtaProps) {
  const link = linkDoCta(origem);

  // Número ainda não fornecido pela cliente. Renderizar um link para wa.me sem
  // destinatário seria pior do que não renderizar: abriria o WhatsApp em branco e
  // chegaria em produção sem ninguém notar.
  if (!link) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
        title={whatsapp.phonePendente ?? undefined}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      data-origem={origem}
      onClick={() => trackCtaWhatsapp(origem)}
    >
      {children}
    </Button>
  );
}
