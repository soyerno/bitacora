# 🧪 Lab integrador · Auditar y fixear una page

> Lab · Cerrás el curso haciendo lo que haría en producción: audit completo, identificar gaps, proponer y aplicar fixes.

Este lab tiene dos modos:
- **Modo rápido**: usar la page de ejemplo incluida abajo.
- **Modo real**: usar una page de modo-landing que estés trabajando.

---

## Setup

```bash
# Si no tenés modo-landing corriendo:
cd /Users/hernan.desouza/Documents/Proyectos/modo/modo-landing-workspace/modo-landing
pnpm dev

# En otra terminal, guardá el HTML del local:
curl -s -A "Googlebot/2.1" http://localhost:3000/promos -o /tmp/lab-promos.html
curl -s -A "Googlebot/2.1" http://localhost:3000/ -o /tmp/lab-home.html

# O contra prod:
curl -s -A "Googlebot/2.1" https://www.modo.com.ar/promos -o /tmp/lab-promos.html
```

---

## Ejercicio 1 · Inventario de señales base

Corré este script y completá la tabla de findings:

```bash
SITE="https://www.modo.com.ar"

echo "=== Señales base ==="
curl -sI "$SITE/robots.txt" -w "robots.txt: %{http_code}\n" -o /dev/null
curl -sI "$SITE/sitemap.xml" -w "sitemap.xml: %{http_code}\n" -o /dev/null
curl -sI "$SITE/llms.txt" -w "llms.txt: %{http_code}\n" -o /dev/null

echo "=== robots.txt — AI bots ==="
curl -s "$SITE/robots.txt" | grep -E "GPTBot|ClaudeBot|PerplexityBot|Google-Extended|CCBot"

echo "=== sitemap — anchors ==="
curl -s "$SITE/sitemap.xml" | grep "#" | head -5

echo "=== CSR check — h1 + LDs ==="
curl -s -A "Googlebot/2.1" "$SITE/" | grep -cE "<h1>|ld\+json"
curl -s -A "Googlebot/2.1" "$SITE/promos" | grep -cE "<h1>|ld\+json"
```

**Completá la tabla**:

| Señal | Estado | Acción |
|-------|--------|--------|
| robots.txt | | |
| sitemap.xml | | |
| llms.txt | | |
| AI bots en robots.txt | | |
| Anchors en sitemap | | |
| H1 + LDs en / | | |
| H1 + LDs en /promos | | |

---

## Ejercicio 2 · Validar JSON-LD

```bash
# Validar el home:
python3 ~/.claude/skills/modo-seo-geo-audit/scripts/validate-jsonld.py /tmp/lab-home.html

# Validar promos:
python3 ~/.claude/skills/modo-seo-geo-audit/scripts/validate-jsonld.py /tmp/lab-promos.html
```

Registrá los findings:

- [ ] ¿Cuántos LD blocks tiene el home? ___
- [ ] ¿Tipos encontrados? ___
- [ ] ¿Props faltantes? ___
- [ ] ¿Pasa el strict check de Course (si aplica)? ___

---

## Ejercicio 3 · URL-as-state en `/promos`

Abrí modo-landing local. Aplicá dos filtros distintos en `/promos` (categoría + banco).

```bash
# Guardá las URLs antes y después de filtrar:
# URL_before: http://localhost:3000/promos
# URL_after: (copiá del browser después de filtrar)

# ¿Son distintas?
diff <(echo "URL_ANTES") <(echo "URL_DESPUES")
```

- [ ] ¿La URL cambia al aplicar el filtro? (si no: URL-as-state no implementado)
- [ ] ¿El default state es URL limpia (sin `?categoria=todas`)? 
- [ ] ¿Copiar la URL filtrada y abrirla en nueva tab carga el filtro aplicado?

---

## Ejercicio 4 · Google Rich Results Test

Tomá el JSON-LD del home de modo.com.ar:

```bash
curl -s https://www.modo.com.ar/ | grep -A 50 'ld+json' | head -60
```

Copiá el primer bloque JSON-LD y pegalo en: https://search.google.com/test/rich-results

- [ ] ¿Qué tipo detectó?
- [ ] ¿Props faltantes según Google?
- [ ] ¿Qué rich result habilitaría si se corrigieran?

---

## Ejercicio 5 · Proponer el fix

Basado en los findings de los ejercicios 1-4, escribí la lista priorizada de fixes:

```markdown
## Findings

### 🔴 Bloqueantes (fix antes de mergear)
1. ...

### 🟡 Warnings (fix antes del deploy a prod)
2. ...

### 🟢 Mejoras (Wave 1+ cuando haya SSR)
3. ...

## Propuesta de fix

### Wave 0 (sin cambios de arquitectura)
- [ ] robots.txt: agregar bots faltantes
- [ ] llms.txt: crear si no existe
- [ ] JSON-LD: agregar props faltantes al tipo X
- [ ] URL-as-state: implementar para filtro Y

### Wave 1+ (requiere SSR/SSG)
- [ ] LDs per-route en HTML estático
- [ ] ...
```

---

## Checklist de gates GEO (criterio de "done")

Antes de declarar el fix completo, estos gates tienen que estar verdes:

- [ ] `curl -A "Googlebot/2.1"` devuelve HTML con `<h1>` + JSON-LD + texto visible.
- [ ] robots.txt: GPTBot, ClaudeBot, PerplexityBot, Google-Extended declarados `Allow`.
- [ ] sitemap.xml: sin anchors, URLs 200, top categorías incluidas.
- [ ] llms.txt: existe, links absolutos con descripción, heading + blockquote.
- [ ] JSON-LD: pasa Google Rich Results Test para los tipos declarados.
- [ ] URL-as-state: filtros públicos cambian la URL. Default = URL limpia.
- [ ] verify-grep: ningún filtro usa `useState` solo sin URL.
- [ ] Cache-Control: success path únicamente, diferenciado por cardinality.
- [ ] Animaciones de entrada: `opacity` arranca en 0.6+, no en 0.
- [ ] `alt` descriptivo en todas las imágenes visibles al crawler.

---

## ¿Encontraste algo que no está en el curso?

Si detectaste un anti-pattern nuevo o un trap que no está documentado:

1. Guardalo en un comentario en el PR.
2. Mencionarlo en el canal del equipo para que se agregue al skill `modo-seo-geo-audit`.
3. Si es un caso load-bearing, crear un ticket en COENXT con la epic GEO correspondiente (epics 176/181/184).

---

> Terminaste el curso. Volvé al [índice](#intro) cuando necesites repasar una lección.
