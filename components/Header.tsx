import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import NavDropdown, { type NavItem } from "./NavDropdown";
import { config } from "@/bitacora.config";

const VISIBLE_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Bitácora", href: "/bitacora" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Herramientas", href: "/herramientas" },
];

const PUBLICACIONES_NAV: NavItem[] = [
  { label: "Decks", href: "/decks" },
  { label: "RFCs", href: "/rfcs" },
  { label: "Postmans", href: "/postmans" },
  { label: "R&D", href: "/rd" },
];

const LINK_BASE_CLASSES =
  "rounded-md px-2.5 py-1 text-sm text-ink-soft transition-colors hover:bg-accent-light hover:text-accent-ink";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-ink">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-white"
          >
            M
          </span>
          {config.siteTitle}
        </Link>
        <nav
          className="ml-auto hidden items-center gap-1 sm:flex"
          aria-label="Navegación principal"
        >
          {VISIBLE_NAV.map((n) => (
            <Link key={n.href} href={n.href} className={LINK_BASE_CLASSES}>
              {n.label}
            </Link>
          ))}
          <NavDropdown label="Publicaciones" items={PUBLICACIONES_NAV} />
          <Link href="/buscar" className={LINK_BASE_CLASSES}>
            Buscar
          </Link>
        </nav>
        <div className="ml-auto sm:ml-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
