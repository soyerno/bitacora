"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface NavItem {
  label: string;
  href: string;
}

export default function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname() ?? "/";
  const isCurrent = items.some(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = ref.current;
      if (!el || !el.open) return;
      if (!el.contains(e.target as Node)) {
        el.open = false;
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      const el = ref.current;
      if (e.key === "Escape" && el?.open) {
        el.open = false;
        setOpen(false);
        const summary = el.querySelector("summary");
        if (summary instanceof HTMLElement) summary.focus();
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeAndNavigate = () => {
    const el = ref.current;
    if (el) el.open = false;
    setOpen(false);
  };

  const summaryClasses = [
    "flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2.5 py-1 text-sm transition-colors",
    "hover:bg-accent-light hover:text-accent-ink",
    isCurrent ? "bg-accent-light font-semibold text-accent-ink" : "text-ink-soft",
  ].join(" ");

  return (
    <details
      ref={ref}
      className="relative"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className={summaryClasses}>
        {label}
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M3 5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div
        className="absolute left-1/2 top-full z-20 mt-1.5 min-w-[180px] -translate-x-1/2 rounded-lg border border-border bg-surface p-1 shadow-lg"
        role="menu"
      >
        {items.map((i) => {
          const active = pathname === i.href;
          const itemClasses = [
            "block rounded-md px-3 py-1.5 text-sm transition-colors",
            "hover:bg-accent-light hover:text-accent-ink",
            active ? "bg-accent-light font-semibold text-accent-ink" : "text-ink-soft",
          ].join(" ");
          return (
            <Link
              key={i.href}
              href={i.href}
              className={itemClasses}
              role="menuitem"
              aria-current={active ? "page" : undefined}
              onClick={closeAndNavigate}
            >
              {i.label}
            </Link>
          );
        })}
      </div>
    </details>
  );
}
