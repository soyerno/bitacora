"use client";

import { useEffect, useState } from "react";
import { SEARCH_TYPE_LABEL, type SearchHit } from "@/lib/search";
import { isExternal } from "@/lib/url";

export default function BuscarPage() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setHits(data.hits ?? []);
      } catch {
        /* abort */
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Buscar</h1>
      <p className="mt-2 text-muted">
        Búsqueda server-side en decks, RFCs, R&amp;D y skills.
      </p>

      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Escribí para buscar…"
        className="mt-6 w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink outline-none focus:border-accent"
      />

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-muted">Buscando…</p>}
        {!loading && q.trim() && hits.length === 0 && (
          <p className="text-sm text-muted">Sin resultados para “{q}”.</p>
        )}
        {hits.map((h, i) => {
          const ext = isExternal(h.href);
          return (
            <a
              key={`${h.type}-${i}`}
              href={h.href}
              target={ext ? "_blank" : undefined}
              rel={ext ? "noopener noreferrer" : undefined}
              className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                {SEARCH_TYPE_LABEL[h.type]}
              </span>
              <h2 className="mt-1 font-display font-bold text-ink">{h.title}</h2>
              <p className="line-clamp-2 text-sm text-muted">{h.desc}</p>
            </a>
          );
        })}
      </div>
    </main>
  );
}
