#!/usr/bin/env python3
"""Build sitemap.xml from erno-modo manifests.

Reads decks/decks.json, rfcs/rfcs.json, postmans/postmans.json, rd/rd.json,
bitacora/bitacora.json, proyectos/proyectos.json, skills/skills.json and the
static section index pages. Emits sitemap.xml at repo root.

Usage: python3 scripts/build-sitemap.py
"""

from __future__ import annotations

import json
import os
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://soyernomodo.github.io/erno-modo"
TODAY = date.today().isoformat()


def load_json(rel: str) -> dict:
    p = ROOT / rel
    if not p.exists():
        return {}
    return json.loads(p.read_text(encoding="utf-8"))


def url_entry(loc: str, lastmod: str | None = None, priority: float = 0.5, changefreq: str = "monthly") -> str:
    parts = [f"<loc>{loc}</loc>"]
    if lastmod:
        parts.append(f"<lastmod>{lastmod}</lastmod>")
    parts.append(f"<changefreq>{changefreq}</changefreq>")
    parts.append(f"<priority>{priority:.1f}</priority>")
    return "  <url>" + "".join(parts) + "</url>"


def main() -> int:
    urls: list[str] = []

    urls.append(url_entry(f"{BASE}/", TODAY, 1.0, "weekly"))
    urls.append(url_entry(f"{BASE}/boveda/", TODAY, 0.9, "daily"))

    for sec, prio in [("decks", 0.8), ("rfcs", 0.8), ("rd", 0.8), ("postmans", 0.6),
                       ("proyectos", 0.7), ("bitacora", 0.8), ("herramientas", 0.6)]:
        if (ROOT / sec / "index.html").exists():
            urls.append(url_entry(f"{BASE}/{sec}/", TODAY, prio, "weekly"))

    decks = load_json("decks/decks.json").get("decks", [])
    for d in decks:
        href = d.get("href", "")
        if href.startswith("decks/"):
            href = href[len("decks/"):]
        urls.append(url_entry(
            f"{BASE}/decks/{href}",
            d.get("date") or TODAY,
            0.7, "monthly"
        ))

    for r in load_json("rd/rd.json").get("items", []):
        href = r.get("href", "")
        urls.append(url_entry(
            f"{BASE}/rd/{href}",
            r.get("date") or TODAY,
            0.7, "monthly"
        ))

    for b in load_json("bitacora/bitacora.json").get("items", []):
        slug = b.get("slug", "")
        urls.append(url_entry(
            f"{BASE}/bitacora/{slug}.html",
            b.get("date") or TODAY,
            0.6, "monthly"
        ))

    body = "\n".join(urls)
    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{body}\n"
        "</urlset>\n"
    )

    out = ROOT / "sitemap.xml"
    out.write_text(sitemap, encoding="utf-8")
    print(f"wrote {out} · {len(urls)} URLs")
    return 0


if __name__ == "__main__":
    sys.exit(main())
