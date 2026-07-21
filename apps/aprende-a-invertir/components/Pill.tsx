import type { ReactNode } from "react";

export type PillVariant = "solid" | "outline" | "featured";

const VARIANT_CLASSES: Record<PillVariant, string> = {
  solid: "bg-accent-light text-accent-ink font-medium",
  outline: "border border-border text-muted",
  featured: "bg-accent text-white font-semibold",
};

/**
 * Unified small badge/tag. Use:
 *  - `solid` for canonical IDs (RFC-N, R&D-N, environments).
 *  - `outline` for free-form tags.
 *  - `featured` for highlight states (destacado, etc).
 */
export default function Pill({
  variant = "solid",
  children,
  className = "",
}: {
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${VARIANT_CLASSES[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
