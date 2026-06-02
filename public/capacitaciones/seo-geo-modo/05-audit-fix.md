# 05 · Audit + fix

> Lección 05 · Harness: modo-seo-geo-audit

Esta lección es el procedimiento paso a paso que corrés antes de mergear cualquier PR que toque SEO/GEO, y el diagnóstico completo cuando el equipo dice "no aparecemos en Google" o "Perplexity no nos conoce".

---

## Invocar el harness

```
/modo-seo-geo-audit
```

El skill toma la URL del front activo, corre el audit completo y devuelve una matriz de findings. También podés pasarle una ruta específica o un archivo HTML local.

---

## Step 1 · Inventario de prod — qué ven los crawlers

```bash
SITE="https://www.modo.com.ar"

# HTML que ve Googlebot (no el browser):
curl -s -A "Googlebot/2.1" "$SITE/" -o /tmp/audit-home.html

# Señales base:
curl -sI "$SITE/robots.txt" -w 'robots: %{http_code}\n' -o /dev/null
curl -sI "$SITE/sitemap.xml" -w 'sitemap: %{http_code}\n' -o /dev/null
curl -sI "$SITE/llms.txt" -w 'llms.txt: %{http_code}\n' -o /dev/null

# Contenido del sitemap (sin anchors):
curl -s "$SITE/sitemap.xml" | grep -oE '<loc>[^<]+</loc>'
curl -s "$SITE/sitemap.xml" | grep "#"   # debe devolver vacío

# Contenido de robots.txt:
curl -s "$SITE/robots.txt" | head -40

# LDs presentes:
grep -oE '<script type="application/ld\+json">.*?</script>' /tmp/audit-home.html | wc -l
```

**CSR trap check**:
```bash
# Si h1/p/ld+json = 0 → shell vacío → CSR trap
curl -s -A "Googlebot/2.1" "$SITE/" | grep -cE "<h1>|ld\+json|<p>"
```

---

## Step 2 · Validar JSON-LD con el script del harness

```bash
# Guardar HTML de cada ruta clave:
for ROUTE in "" "/promos" "/comercios"; do
  SLUG="${ROUTE//\//}"
  curl -s -A "Googlebot/2.1" "${SITE}${ROUTE}" -o "/tmp/audit-${SLUG:-home}.html"
done

# Validar cada uno:
python3 ~/.claude/skills/modo-seo-geo-audit/scripts/validate-jsonld.py /tmp/audit-home.html
python3 ~/.claude/skills/modo-seo-geo-audit/scripts/validate-jsonld.py /tmp/audit-promos.html
```

El script reporta:
- Cuántos LD blocks hay.
- Qué `@type` tiene cada uno.
- Props requeridas faltantes (por Google Rich Results, no solo schema.org).
- Strict check específico para `Course` (offers + url + provider.url + provider.logo + hasCourseInstance).

---

## Step 3 · Matriz de findings

El harness devuelve esta tabla. Verde = OK, Amarillo = warning, Rojo = bloqueante:

| Capa | Qué verificar |
|------|---------------|
| `robots.txt` | 17+ AI bots declarados explícito, sin Disallow para ellos |
| `sitemap.xml` | Existe, sin anchors, URLs que devuelven 200, top categorías incluidas |
| `llms.txt` | Existe, links absolutos con descripción, heading + blockquote |
| OG/Twitter | `og:image` con URL propia (no CDN preview), `og:url`, `og:locale`, `og:image:alt` |
| canonical | Self-referential en cada page indexable, URL limpia en default state |
| `<title>` per-route | Distinto al home en cada ruta |
| `<h1>` static | Presente en HTML estático (no en componente con `ssr:false`) |
| JSON-LD present | Al menos Organization + WebSite en home, BreadcrumbList en internas |
| JSON-LD strict | Google Rich Results check pasa (offers, provider.url, etc.) |
| CSR trap | `curl Googlebot` devuelve HTML con contenido, no shell |
| URL-as-state | Filtros públicos reflejan en query/segment; default = URL limpia |
| JSON-LD per filter | ItemList scoped al subset visible, no los 500 ítems |
| canonical per filter | Filtros indexables: self-canonical. Sort/noise: canonical al padre o noindex |
| Filter sitemap | Top categorías/bancos en sitemap; long-tail excluido |
| Cache-Control | Top combos: s-maxage=300 SWR 1h. 2+ filtros: s-maxage=60. Search: no-store |
| Cache hit | `x-cache: HIT` en repetición de top combos (verificar contra CDN) |

---

## Step 4 · Qué es invisible aunque se vea bien en DevTools

Esta es la lista de los falsos "OK" más comunes:

| Síntoma en DevTools | Realidad para el crawler |
|---------------------|--------------------------|
| JSON-LD visible en Sources | Si está en `<Helmet>` o generado por JS runtime → invisible sin SSR |
| `<title>` correcto por ruta en Chrome | Si el título viene de React router client-side → todos los routes tienen el title del `index.html` |
| Filtros funcionando visualmente | Si no cambian la URL → el crawler solo ve el default |
| Canonical correcto en React Helmet | Mismo problema que title: invisible sin SSR |
| Imágenes cargando | `alt=""` es inválido (WCAG + SEO) aunque la imagen cargue |
| rich results en schema.org validator | schema.org validator ≠ Google Rich Results test |
| `Cache-Control` en respuesta del browser | Browser puede cachear localmente aunque el CDN no cachee |

**Regla de oro**: siempre hacer `curl -A "Googlebot/2.1"` y parsear el output. DevTools muestra lo que ve el browser después de ejecutar JS, no lo que ve el crawler.

---

## Step 5 · Wave 0 · fixes sin migración SSR

Si el sitio es CSR-only y la migración a SSR no llega este sprint, hay curitas que funcionan en `index.html` estático:

1. Embeber LDs ricos inline en el `<head>`: Organization, WebSite, BreadcrumbList, CollectionPage con ItemList, FAQPage.
2. Armar `sitemap.xml` con rutas reales (sin anchors).
3. Agregar los 17 AI bots a `robots.txt`.
4. Crear `llms.txt` con links absolutos y descripción.
5. Agregar `<meta name="robots" content="index,follow,max-image-preview:large">`.
6. Agregar `hreflang es-AR` y `x-default`.

Recipes drop-in disponibles en `~/.claude/skills/modo-seo-geo-audit/reference/json-ld-recipes.md`.

---

## Step 6 · Wave 1+ · habilitado por SSR/SSG

Una vez que el front tiene SSR (Next.js con `getServerSideProps`) o SSG (`getStaticProps`):

- LDs per-route en HTML estático (eliminar duplicados inline del Wave 0).
- `<title>` per-route via `next/head`.
- `canonical` per-route.
- Sitemap dinámico desde `app/sitemap.ts` (Next 15) o `pages/sitemap.xml.ts` (Next 12).
- Robots dinámico.
- Cache-correctness en `getServerSideProps` (setHeader solo en success path).

---

## Verify-grep antes de declarar done

Antes de escribir "fixed" en el PR:

```bash
# Cache-Control en el success path (no al tope del gSSP):
for f in $(grep -rl setCmsCacheHeaders src/pages); do
  grep -nE "setCmsCacheHeaders|notFound:|redirect:|catch" "$f"
done

# Sin filtros con useState solo (buscar useState con nombres de filtros):
grep -rn "useState.*categoria\|useState.*banco\|useState.*ciudad" src/pages src/components

# canonical correcto en cada page:
grep -rn "rel=\"canonical\"" src/pages | grep -v CMSSEO
# Si hay canonicals hardcodeados fuera de CMSSEO → revisarlos

# LDs en el head (no en el body):
grep -rn "ld+json" src/pages | head -10
```

---

## Workflow completo en Gate 4

```
1. /modo-seo-geo-audit           # audit completo
2. Revisar matriz de findings    # identificar rojos
3. Fix por wave                  # Wave 0 si CSR, Wave 1+ si SSR
4. verify-grep                   # no claim fix sin grep
5. curl -A "Googlebot/2.1"       # confirm HTML estático correcto
6. Google Rich Results Test      # https://search.google.com/test/rich-results
7. PR con branch feat/COENXT-XXX-seo-geo-pX
```

---

## Caso canónico — aprendeatumodo 2026-05-23

Branch: `feat/COENXT-309-seo-geo-p0`

**Antes** (audit inicial):
- 1 LD block sin offers → Course rich result no aparecía
- sitemap con 4 anchors (todos colapsaban al home) + 1 home = 5 entradas inútiles
- robots.txt: 5 bots (solo search, sin AI)
- llms.txt: 404
- Google Rich Results: 0/7

**Fixes del PR**:
- 5 LDs ricos en `index.html` (EducationalOrganization, WebSite, BreadcrumbList, CollectionPage con ItemList, FAQPage)
- sitemap con 8 URLs reales (1 home + 7 cursos con slugs reales de `src/lib/courses.ts`)
- robots.txt con 22 bots (17 AI + 5 search)
- llms.txt nuevo
- og:image propia (no la de Lovable preview)

**Después**:
- Google Rich Results Course strict check: **7/7 ✅**
- Wave 1+ documentada en `openspec/changes/migrate-to-next16/` para cuando aterrice Next 16 SSG

---

## Checklist de salida (Gate 4 · a11y + SEO/GEO)

- [ ] `curl -A "Googlebot/2.1"` devuelve HTML con contenido (h1, texto, LDs).
- [ ] Matriz de findings: 0 rojos.
- [ ] Google Rich Results Test pasado para los tipos JSON-LD relevantes.
- [ ] robots.txt con 17+ AI bots.
- [ ] sitemap.xml sin anchors, sin 404s.
- [ ] llms.txt existe con links y descripción.
- [ ] Filtros públicos con URL-as-state implementado.
- [ ] Cache-Control correcto (success path, cardinality-aware).
- [ ] verify-grep pasó (no hay filtros en useState sin URL).

> ¡Listo para el lab! [🧪 Lab integrador](exercises/README.md)
