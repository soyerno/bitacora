import { config } from "@/bitacora.config";

export default function Footer() {
  const { developer } = config;
  const repoUrl = `https://github.com/${developer.github}/erno-modo`;
  const profileUrl = `https://github.com/${developer.github}`;
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display font-semibold text-ink-soft">
          {developer.name} · {developer.role} @ MODO
        </span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span>
            Generados con{" "}
            <a
              href="https://github.com/SoyErnoModo/erno-modo/tree/main/decks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft underline decoration-border underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
            >
              modo-deck
            </a>
          </span>
          <span aria-hidden className="text-border">
            ·
          </span>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft underline decoration-border underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
          >
            repo SoyErnoModo/erno-modo
          </a>
          <span aria-hidden className="text-border">
            ·
          </span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            @{developer.github}
          </a>
        </span>
      </div>
    </footer>
  );
}
