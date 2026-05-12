import type { ReactNode } from "react";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  actions?: ReactNode;
  as?: "h1" | "h2" | "h3";
};

export function SectionTitle({
  title,
  subtitle,
  align = "left",
  actions,
  as = "h2",
}: SectionTitleProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  const HeadingTag = as;

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:justify-between ${alignClass}`}>
      <div className={`flex max-w-2xl flex-col gap-2 ${alignClass}`}>
        <HeadingTag className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </HeadingTag>
        {subtitle ? <p className="text-sm leading-6 text-muted sm:text-base">{subtitle}</p> : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}
