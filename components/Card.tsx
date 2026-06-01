import Link from "next/link";
import type { ReactNode } from "react";
import { isExternal, isStaticAsset } from "@/lib/url";

const BASE_CLASSES =
  "group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-colors hover:border-accent";

/**
 * Anchor card used across listing pages. Auto-routes:
 *  - external (http/https) → `<a target="_blank" rel="noopener noreferrer">`
 *  - static asset in /public (.html, .zip, .pdf…) → plain `<a>` (Next would
 *    rewrite the URL otherwise and the static file would not load).
 *  - Next route (no extension) → `<Link>` for client-side navigation.
 *  - no href → semantic `<article>` (decorative card, no navigation).
 */
export default function Card({
  href,
  children,
  className = "",
  download = false,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  download?: boolean;
}) {
  const cls = `${BASE_CLASSES} ${className}`.trim();

  if (!href) return <article className={cls}>{children}</article>;

  if (isExternal(href)) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (download || isStaticAsset(href)) {
    return (
      <a href={href} className={cls} download={download || undefined}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Card title with hover-into-accent linked to parent `.group`. */
export function CardTitle({
  children,
  level = 2,
  size = "lg",
}: {
  children: ReactNode;
  level?: 2 | 3;
  size?: "lg" | "xl";
}) {
  const sizeClass = size === "xl" ? "text-xl" : "text-lg";
  const cls = `mt-2 font-display ${sizeClass} font-bold text-ink group-hover:text-accent`;
  if (level === 3) return <h3 className={cls}>{children}</h3>;
  return <h2 className={cls}>{children}</h2>;
}

/** Truncated description body for a Card. */
export function CardDescription({
  children,
  lines = 3,
}: {
  children: ReactNode;
  lines?: 2 | 3;
}) {
  const lineClass = lines === 2 ? "line-clamp-2" : "line-clamp-3";
  return <p className={`mt-1 ${lineClass} text-sm text-muted`}>{children}</p>;
}

/** Small meta row above card title (date · status · area). */
export function CardMeta({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
      {children}
    </div>
  );
}

/** Footer row of a card (audience · date · slides). Auto-spaced. */
export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="mt-auto pt-4 text-xs text-muted">{children}</div>;
}
