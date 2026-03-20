export type ButtonVariant =
  | "brand"
  | "accent"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "crimson"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";
export type CardTone = "default" | "muted" | "brand" | "inverse";

type MaybeClassName = string | false | null | undefined;

interface ButtonRecipeOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

interface CardRecipeOptions {
  tone?: CardTone;
  interactive?: boolean;
  className?: string;
}

export function cx(...values: MaybeClassName[]) {
  return values.filter(Boolean).join(" ");
}

const buttonBaseClassName =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border font-semibold tracking-[0.01em] normal-case transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-55";

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  brand:
    "border-brand-800 bg-brand-700 text-white shadow-[var(--shadow-default)] hover:-translate-y-px hover:bg-brand-800 hover:shadow-[var(--shadow-large)] focus-visible:ring-brand-200",
  accent:
    "border-accent-600 bg-accent-500 text-stout-950 shadow-[var(--shadow-accent)] hover:-translate-y-px hover:bg-accent-400 hover:shadow-[var(--shadow-large)] focus-visible:ring-accent-200",
  secondary:
    "border-neutral-300 bg-neutral-50 text-brand-900 shadow-[var(--shadow-subtle)] hover:-translate-y-px hover:border-brand-200 hover:bg-white hover:shadow-[var(--shadow-default)] focus-visible:ring-brand-100",
  outline:
    "border-brand-300 bg-white/80 text-brand-800 shadow-[var(--shadow-subtle)] hover:-translate-y-px hover:border-brand-500 hover:bg-brand-50 hover:shadow-[var(--shadow-default)] focus-visible:ring-brand-100",
  ghost:
    "border-transparent bg-transparent text-brand-800 shadow-none hover:bg-brand-50 focus-visible:ring-brand-100",
  link: "min-h-0 rounded-none border-transparent bg-transparent px-0 py-0 text-brand-700 shadow-none underline-offset-4 hover:text-brand-900 hover:underline focus-visible:ring-brand-100",
  crimson:
    "border-crimson-700 bg-crimson-600 text-white shadow-[var(--shadow-heritage)] hover:-translate-y-px hover:bg-crimson-700 hover:shadow-[var(--shadow-large)] focus-visible:ring-crimson-200",
  destructive:
    "border-crimson-800 bg-crimson-700 text-white shadow-[var(--shadow-heritage)] hover:-translate-y-px hover:bg-crimson-800 hover:shadow-[var(--shadow-large)] focus-visible:ring-crimson-200",
};

const buttonSizeClassNames: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-3 text-sm sm:text-base",
  lg: "px-6 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg",
};

const cardBaseClassName =
  "rounded-[1.75rem] border shadow-[var(--shadow-default)] backdrop-blur-sm";

const cardToneClassNames: Record<CardTone, string> = {
  default: "border-neutral-200 bg-white text-stout-900",
  muted: "border-brand-100 bg-brand-50/80 text-stout-900",
  brand: "border-brand-700 bg-gradient-to-br from-brand-700 via-brand-800 to-stout-800 text-white shadow-[var(--shadow-large)]",
  inverse: "border-stout-700 bg-stout-900 text-neutral-50 shadow-[var(--shadow-large)]",
};

export function buttonRecipe({
  variant = "brand",
  size = "md",
  fullWidth = false,
  className,
}: ButtonRecipeOptions = {}) {
  return cx(
    buttonBaseClassName,
    buttonVariantClassNames[variant],
    buttonSizeClassNames[size],
    fullWidth && "w-full",
    className,
  );
}

export function cardRecipe({
  tone = "default",
  interactive = false,
  className,
}: CardRecipeOptions = {}) {
  return cx(
    cardBaseClassName,
    cardToneClassNames[tone],
    interactive &&
      "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-large)]",
    className,
  );
}

export const sectionShellClassName = "py-16 sm:py-20";
export const sectionInnerClassName = "oc-container";
export const sectionProseClassName = "max-w-2xl text-base leading-8 text-brand-700";
export const featureListClassName = "list-disc space-y-2 pl-5 text-sm text-brand-800";
export const accentTextClassName = "text-accent-600";
export const pageHeroOverlayClassName = "absolute inset-0 bg-black/10";
export const pageHeroInnerClassName =
  "relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8";
export const heroChipRowClassName = "mt-6 flex flex-wrap justify-center gap-3";

export function sectionTitleRecipe(className?: string) {
  return cx(
    "font-display text-4xl font-bold leading-tight text-stout-700 md:text-5xl",
    className,
  );
}

export function sectionDescriptionRecipe(className?: string) {
  return cx("mx-auto max-w-2xl text-lg leading-8 text-brand-600", className);
}

export function subsectionTitleRecipe(className?: string) {
  return cx("font-display text-2xl font-bold text-brand-700 md:text-3xl", className);
}

export function panelTitleRecipe(className?: string) {
  return cx("font-display text-xl font-bold text-brand-700", className);
}

export function panelTextRecipe(className?: string) {
  return cx("text-sm leading-7 text-brand-600", className);
}

export function fieldLabelRecipe(className?: string) {
  return cx("mb-1.5 block text-sm font-semibold text-brand-800", className);
}

export function fieldControlRecipe(className?: string) {
  return cx(
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-base text-stout-900 shadow-[var(--shadow-subtle)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100",
    className,
  );
}

export function fieldNoteRecipe(className?: string) {
  return cx("text-sm leading-6 text-brand-600", className);
}

export function bannerButtonRecipe(
  variant: "light" | "dark" | "heritage",
  className?: string,
) {
  const toneClassName =
    variant === "dark"
      ? "border-white/15 bg-brand-950 text-white hover:bg-stout-950 focus-visible:ring-white/20"
      : variant === "heritage"
        ? "border-crimson-200 bg-white text-crimson-700 hover:bg-crimson-50 focus-visible:ring-crimson-100"
        : "border-brand-200 bg-white text-brand-800 hover:bg-brand-50 focus-visible:ring-brand-100";

  return buttonRecipe({
    variant: "secondary",
    size: "lg",
    className: cx(toneClassName, className),
  });
}

export function ctaPanelRecipe(className?: string) {
  return cardRecipe({
    tone: "brand",
    className: cx("p-8 md:p-12", className),
  });
}

export function pageHeroSectionRecipe(className?: string) {
  return cx(
    "relative bg-gradient-to-br from-brand-600 to-brand-800 py-10 text-white md:py-16",
    className,
  );
}

export function pageHeroEyebrowRecipe(className?: string) {
  return cx("text-xs uppercase tracking-[0.35em] text-brand-100/80", className);
}

export function pageHeroTitleRecipe(className?: string) {
  return cx(
    "font-display text-2xl font-bold leading-tight text-white md:text-3xl",
    className,
  );
}

export function pageHeroDescriptionRecipe(className?: string) {
  return cx(
    "mx-auto max-w-2xl text-base leading-relaxed text-brand-100 md:text-lg",
    className,
  );
}

export function heroChipRecipe(className?: string) {
  return cx(
    "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur",
    className,
  );
}

export function contentPanelRecipe(className?: string) {
  return cardRecipe({
    tone: "default",
    className: cx("p-6 md:p-8", className),
  });
}

export function softPanelRecipe(className?: string) {
  return cardRecipe({
    tone: "muted",
    className: cx("p-4 md:p-6", className),
  });
}

export function glassPanelRecipe(className?: string) {
  return cx(
    "rounded-2xl border border-white/15 bg-white/10 p-4 text-white/90 backdrop-blur-sm md:p-6",
    className,
  );
}

export function mapFrameRecipe(className?: string) {
  return cx(
    "overflow-hidden rounded-[1.5rem] border border-brand-100 bg-neutral-50 shadow-[var(--shadow-default)]",
    className,
  );
}

export function socialIconButtonRecipe(
  tone: "brand" | "accent" = "brand",
  className?: string,
) {
  return cx(
    "rounded-full p-2 transition-colors focus:outline-none focus-visible:ring-4",
    tone === "accent"
      ? "text-accent-500 hover:bg-accent-100 focus-visible:ring-accent/30"
      : "text-brand-600 hover:bg-brand-100 focus-visible:ring-brand-500/20",
    className,
  );
}
