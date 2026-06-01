"use client";

import { useEffect, useState } from "react";

type Theme = "auto" | "light" | "dark";
const ORDER: Theme[] = ["auto", "light", "dark"];
const KEY = "modo-decks-theme"; // misma key que el sitio estático (assets/common.js)
const LABEL: Record<Theme, string> = { auto: "Auto", light: "Claro", dark: "Oscuro" };

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("auto");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme) || "auto";
    setTheme(stored);
  }, []);

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
      className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-accent"
    >
      {LABEL[theme]}
    </button>
  );
}
