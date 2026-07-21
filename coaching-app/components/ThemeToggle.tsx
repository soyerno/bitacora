"use client";

import { useState } from "react";

type Theme = "auto" | "light" | "dark";
const ORDER: Theme[] = ["auto", "light", "dark"];
const KEY = "coaching-theme";
const LABEL: Record<Theme, string> = { auto: "Auto", light: "Claro", dark: "Oscuro" };

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "auto";
  return (localStorage.getItem(KEY) as Theme) || "auto";
}

export default function ThemeToggle() {
  // Init perezoso desde localStorage. En SSR no hay localStorage → "auto";
  // el label se reconcilia en la hidratación (suppressHydrationWarning).
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    if (next === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Tema: ${LABEL[theme]}`}
      suppressHydrationWarning
      className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-accent"
    >
      {LABEL[theme]}
    </button>
  );
}
