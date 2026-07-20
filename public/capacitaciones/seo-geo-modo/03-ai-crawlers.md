# 03 · AI crawlers

> Lección 03 · GEO

Los AI crawlers son los bots que alimentan los LLMs: ChatGPT Browse, Claude.ai, Perplexity, Gemini, Copilot. Rastrean la web igual que Googlebot — con HTTP GET, UA header, y parsing de HTML. La diferencia es para qué usan el contenido.

---

## Cómo funciona el rastreo de AI

```
Usuario pregunta:
"¿qué promos tiene MODO este mes con Galicia?"
        │
        ▼
   LLM tiene dos opciones:
   1. Responder desde conocimiento de training (base de datos interna).
   2. Grounding en tiempo real: lanzar un bot, rastrear modo.com.ar,
      extraer el contenido y citarlo en la respuesta.
        │
        ▼
   Perplexity → PerplexityBot rastre /promos
   ChatGPT Browse → GPTBot rastre /promos
   Claude.ai → ClaudeBot rastre /promos
        │
        ▼
   Leen el HTML estático (no ejecutan React en el browser).
   Extraen: <title>, <h1>, JSON-LD, texto visible, links.
        │
        ▼
   Si encuentran contenido claro y estructurado → citan el sitio.
   Si encuentran un shell con <div id="__next"></div> → no tienen nada que citar.
```

**Key insight**: los AI crawlers no ejecutan JavaScript. Solo ven el HTML que devuelve el servidor. Este es el CSR trap.

---

## El CSR trap (Critical SEO/GEO failure)

**CSR = Client-Side Rendering**. Si el front es una SPA que renderiza todo en el browser, el HTML que sirve el servidor es:

```html
<!DOCTYPE html>
<html>
  <head><title>MODO</title></head>
  <body><div id="__next"></div></body>
</html>
```

El crawler recibe eso. No hay `<h1>`, no hay texto, no hay JSON-LD, no hay listas de productos. Para el AI, la página está vacía.

**Cómo detectarlo**:

```bash
# Comparar lo que sirve el server vs lo que ves en browser:
curl -s -A "Googlebot/2.1" https://www.modo.com.ar/promos | \
  grep -cE "<h1>|<p>|ld\+json"

# Si devuelve 0 → CSR trap.
# Si devuelve > 3 → SSR/SSG funcionando (bien).
```

**Dónde NO aplica el trap en modo-landing**: Next.js 12 con `getServerSideProps` sirve HTML completo al servidor. El CSR trap afecta SPAs puras (Vite, Lovable, create-react-app sin SSR, Vercel SPA mode).

**Dónde SÍ puede aparecer**: si un blok está wrapeado en `dynamic({ ssr: false })`. Ese blok específico no se renderiza en el servidor — el crawler ve el resto de la page pero no ese componente. Para bloks que son el LCP o que contienen JSON-LD importantes, evaluar si ssr:false es necesario.

---

## Bots que declarar en `robots.txt`

17 AI bots. La referencia completa está en [01 · canonical-robots-sitemap](01-canonical-robots-sitemap.md) y en `~/.claude/skills/modo-seo-geo-audit/reference/robots-ai-bots.md`.

Acá los más críticos con su contexto:

| Bot | Familia | Para qué rastrean |
|-----|---------|-------------------|
| `GPTBot` | OpenAI | Training de GPT-4/5. Sin `Allow`, el contenido no entra al próximo modelo |
| `ChatGPT-User` | OpenAI | Browse en tiempo real. El usuario de ChatGPT pide que busque |
| `OAI-SearchBot` | OpenAI | SearchGPT (el buscador de OpenAI). Alta visibilidad AR |
| `ClaudeBot` | Anthropic | Training + browse de Claude |
| `Claude-Web` | Anthropic | Variante user-initiated de Claude browse |
| `anthropic-ai` | Anthropic | Crawler general Anthropic |
| `PerplexityBot` | Perplexity | Índice de Perplexity. Muy usado en AR para consultas financieras |
| `Google-Extended` | Google | Gemini training. Distinto de Googlebot (que es para Search) |
| `meta-externalagent` | Meta | Llama training + Meta AI |
| `CCBot` | Common Crawl | Dataset público que casi todos los LLMs usan como base |

---

## Contenido server-rendered = indexable

Para que un AI crawler pueda leer el contenido, tiene que estar en el HTML que sirve el servidor. Checklist:

- [ ] `<title>` con el nombre de la page, no el default del sitio.
- [ ] `<h1>` visible en el HTML estático (no en un componente con `ssr:false`).
- [ ] Texto principal de la page accesible sin JavaScript (primeros 3 párrafos como mínimo).
- [ ] JSON-LD en el `<head>` (no generado por JS runtime).
- [ ] Imágenes con `alt` descriptivo (los AI crawlers leen el alt para contexto).

**Verificación**:
```bash
SITE="https://www.modo.com.ar"

# ¿Title per-route? (si todas las rutas tienen el mismo title → problema)
curl -s -A "Googlebot/2.1" "$SITE/promos" | grep "<title>"
curl -s -A "Googlebot/2.1" "$SITE/comercios" | grep "<title>"

# ¿H1 en HTML estático?
curl -s -A "Googlebot/2.1" "$SITE/promos" | grep "<h1"

# ¿JSON-LD?
curl -s -A "Googlebot/2.1" "$SITE/promos" | grep -c "ld+json"
```

---

## `llms.txt` — el archivo específico de GEO

Los AI crawlers no tienen un equivalente de Google Search Console. No hay panel donde veas "ClaudeBot rastreó tu sitio N veces". La forma de darles contexto curado es `/llms.txt`.

Cuando ClaudeBot o PerplexityBot rastrean un sitio con `llms.txt`, pueden usarlo como índice preferente en lugar de rastrear ciegamente. Es el README del sitio para los LLMs.

```bash
# ¿Existe?
curl -sI https://www.modo.com.ar/llms.txt | grep HTTP
# 200 = bien. 404 = agregarlo.
```

Ver formato completo en [01 · canonical-robots-sitemap](01-canonical-robots-sitemap.md).

---

## Animaciones de entrada y visibilidad al crawler

Un edge case no obvio: si el LCP element (el hero principal) está envuelto en una animación con `opacity: 0` al inicio, Chrome no lo cuenta como "pintado" hasta que el fade completa. Eso difiere la métrica LCP.

```css
/* MAL — LCP diferido: */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* BIEN — LCP intacto, efecto sutil: */
@keyframes fadeIn { from { opacity: 0.6; } to { opacity: 1; } }

/* También: prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  #main-content { animation: none; }
}
```

Los AI crawlers que snapshottean el DOM temprano pueden ver el elemento en `opacity:0` e interpretarlo como contenido oculto. Usar `opacity: 0.6` como mínimo, o `transform-only` para las animaciones del hero.

---

## Matriz de visibilidad por tipo de front

| Tipo de front | Googlebot | AI crawlers | Fix si falla |
|---------------|-----------|-------------|--------------|
| Next.js SSR (`getServerSideProps`) | ✅ HTML completo | ✅ HTML completo | — |
| Next.js SSG (`getStaticProps`) | ✅ HTML completo | ✅ HTML completo | — |
| Next.js con `dynamic({ ssr:false })` | ⚠️ blok vacío | ⚠️ blok vacío | Quitar ssr:false del blok |
| Vite/CRA SPA pura | ❌ shell vacío | ❌ shell vacío | Migrar a SSG/SSR o embeber LDs inline |
| Astro SSG | ✅ HTML completo | ✅ HTML completo | — |

---

## Checklist de salida

- [ ] `curl -A "Googlebot/2.1"` devuelve HTML con `<h1>` + JSON-LD + texto (no shell vacío).
- [ ] Los 17 AI bots declarados en `robots.txt`.
- [ ] `llms.txt` existe, devuelve 200, tiene links absolutos con descripción.
- [ ] Bloks críticos (hero, grid principal) no tienen `dynamic({ ssr: false })`.
- [ ] Animaciones de entrada arrancan en `opacity: 0.6+` (no en `opacity: 0`).
- [ ] `alt` descriptivo en todas las imágenes visibles al crawler.

> Siguiente: [04 · URL-as-state](04-url-as-state.md)
