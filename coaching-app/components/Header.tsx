import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { label: "Programa", href: "/" },
  { label: "Glosario", href: "/glosario" },
  { label: "Mi cuaderno", href: "/notas" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-ink">
          <span aria-hidden className="text-xl">
            🧭
          </span>
          Coaching Ontológico
        </Link>
        <nav className="ml-auto flex items-center gap-1" aria-label="Navegación principal">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-2.5 py-1 text-sm text-ink-soft transition-colors hover:bg-accent-light hover:text-accent-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
