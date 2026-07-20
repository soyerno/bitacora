import type { ReactNode } from "react";

/**
 * Shared `<main>` wrapper for all listing pages. Centralizes layout (max-w,
 * padding, title, optional intro/meta) so individual pages only carry content.
 */
export default function PageShell({
  title,
  intro,
  meta,
  children,
  maxWidth = "max-w-5xl",
}: {
  title: ReactNode;
  intro?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <main className={`mx-auto ${maxWidth} px-6 py-12`}>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
        {intro && <p className="mt-2 max-w-3xl text-muted">{intro}</p>}
        {meta && <p className="mt-2 text-xs text-muted">{meta}</p>}
      </header>
      {children}
    </main>
  );
}
