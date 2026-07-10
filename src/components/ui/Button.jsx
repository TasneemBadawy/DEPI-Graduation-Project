import { cn } from "../../lib/utils";

const VARIANTS = {
  default: "bg-primary text-white hover:brightness-110",
  hero: "bg-primary text-white shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98]",
  secondary: "bg-secondary text-white hover:brightness-110",
  outline: "border border-border bg-card text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  default: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-sm gap-2",
  xl: "h-12 px-7 text-base gap-2",
  icon: "h-10 w-10 p-0",
};

/**
 * Returns the class string for a button-styled element without rendering
 * a <button>. Use this to style <Link>/<a> elements identically to Button.
 */
export function buttonVariants({ variant = "default", size = "default", className = "" } = {}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    VARIANTS[variant] || VARIANTS.default,
    SIZES[size] || SIZES.default,
    className
  );
}

export default function Button({ variant = "default", size = "default", className, type = "button", ...props }) {
  return (
    <button type={type} className={buttonVariants({ variant, size, className })} {...props} />
  );
}
