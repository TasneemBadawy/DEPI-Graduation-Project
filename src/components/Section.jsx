import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

export default function Section({ id, eyebrow, title, subtitle, actionLabel, actionTo, children, soft = false }) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-20", soft && "bg-muted/40")}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              {eyebrow}
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>}
          </div>
          {actionLabel && actionTo && (
            <Link
              to={actionTo}
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all sm:inline-flex"
            >
              {actionLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
