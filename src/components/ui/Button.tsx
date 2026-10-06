import { cn } from "@/lib/cn";

/**
 * Botão e CTA — DESIGN-GUIDELINES.md §10.
 *
 * Regras que este componente existe para não deixar ninguém quebrar:
 * - CTA primário é ancora com texto papel, NUNCA o acento (§3).
 * - Sem sombra colorida, sem gradiente, sem borda arredondada — o botão é um retângulo.
 * - Alvo mínimo de 44x44px, inclusive quando o rótulo é curto.
 * - O anel de foco é o global de globals.css (acento-texto, offset 3px). Aqui não se
 *   redeclara nem se remove foco.
 */

export type ButtonVariant = "primary" | "secondary" | "inverso";
export type ButtonSize = "md" | "sm";

/**
 * Base compartilhada. `transition` lista as propriedades explicitamente porque o hover
 * mexe em cor E em transform; `transition-colors` sozinho engoliria o translate.
 * Sob `prefers-reduced-motion: reduce`, globals.css zera a duração de tudo isto.
 *
 * `min-h-11 min-w-11` fica na base, e não no mapa de tamanho: os 44x44px são piso de
 * acessibilidade (§9), não decisão de variante — nem o botão compacto pode furá-lo.
 */
const base = [
  "inline-flex items-center justify-center gap-2 text-center",
  "font-ui font-semibold tracking-[0.02em]",
  "min-h-11 min-w-11",
  "transition-[color,background-color,border-color,transform] duration-200 ease-out",
  "disabled:pointer-events-none disabled:opacity-60",
].join(" ");

/**
 * `sm` existe para o CTA compacto do header (landing-page-structure.md §5.0), onde o
 * botão divide 72px de altura com o monograma e a navegação.
 *
 * Padding e corpo de texto vivem juntos aqui porque `cn()` não resolve conflito de
 * classe Tailwind (src/lib/cn.ts): passar `px-5` por `className` sobre um `px-8` da
 * base daria um resultado dependente da ordem do stylesheet, não da ordem do atributo.
 */
const tamanhos: Record<ButtonSize, string> = {
  md: "px-8 py-3 text-sm",
  sm: "px-5 py-2.5 text-xs",
};

/**
 * Mapa explícito por variante — `cn()` não resolve conflito entre classes Tailwind
 * (src/lib/cn.ts), então nada aqui depende de "a última vence".
 *
 * `inverso` não está no prompt da Fase 2: é o CTA da faixa ancora do CtaFinal
 * (landing-page-structure.md §5.9), que precisa de fundo papel sobre fundo escuro.
 * Nasce aqui para a Fase 5 não improvisar uma variante fora do sistema.
 */
const variantes: Record<ButtonVariant, string> = {
  primary:
    "bg-ancora text-papel hover:bg-ancora-quente hover:-translate-y-px active:translate-y-0 active:bg-ancora-quente",
  secondary:
    "border border-ancora bg-transparent text-ancora hover:bg-ancora hover:text-papel active:bg-ancora-quente active:text-papel",
  inverso:
    "bg-papel text-ancora hover:bg-creme hover:-translate-y-px active:translate-y-0 active:bg-creme",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = CommonProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children"
  > & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  > & {
    href?: undefined;
  };

export type ButtonProps = AnchorProps | NativeButtonProps;

/** Separa o que é do componente do que vai para o DOM, sem descartar tipagem. */
function propsDoDom<T extends CommonProps>(
  props: T,
): Omit<T, keyof CommonProps> {
  const rest = { ...props };
  delete (rest as Partial<CommonProps>).variant;
  delete (rest as Partial<CommonProps>).size;
  delete (rest as Partial<CommonProps>).className;
  delete (rest as Partial<CommonProps>).children;
  return rest;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, tamanhos[size], variantes[variant], className);

  if (props.href !== undefined) {
    return (
      <a {...propsDoDom(props)} className={classes}>
        {children}
      </a>
    );
  }

  const { type = "button", disabled } = props;

  return (
    <button
      {...propsDoDom(props)}
      type={type}
      disabled={disabled}
      // Redundante com o atributo nativo, mas mantém o estado explícito para leitores
      // de tela e serve de gancho de teste.
      aria-disabled={disabled || undefined}
      className={cn(classes, disabled && "cursor-not-allowed")}
    >
      {children}
    </button>
  );
}
