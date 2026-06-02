# 01 · Canonical · robots · sitemap

> Lección 01 · Señales base

Estas tres señales son la infraestructura de indexación. Si están mal, todo lo que viene después (JSON-LD, GEO, URL-as-state) no sirve. Son lo primero que chequea el audit.

---

## `<link rel="canonical">`

**Qué hace**: le dice al crawler "esta URL es la versión autoritativa de este contenido". Sin canonical, Google elige uno por su cuenta — y puede elegir el que no querés.

**Regla en modo-landing**: el catch-all `[[...slug]].jsx` inyecta el canonical desde `content.seo[0]` via el componente `CMSSEO`. Cada story de Storyblok tiene su slug como canonical.

```html
<!-- En el <head> de cada page -->
<link rel="canonical" href="https://www.modo.com.ar/promos" />
```

**Para páginas con filtros** — cada estado filtrado que tenga SEO value (categoría top, banco) se canonicaliza a sí mismo. Los estados sin SEO value (sort, combinaciones long-tail) se canonicalizan al padre o llevan `noindex`. Ver [04 · URL-as-state](04-url-as-state.md) para el patrón completo.

> **Trampa**: canonical apuntando a `https://www.modo.com.ar/promos?categoria=todas` cuando el default limpio es `https://www.modo.com.ar/promos`. Eso crea dos entries distintas en el índice de Google que se canibaliz entre sí. El canonical del default state debe ser la URL limpia, sin query.

---

## `robots.txt`

Le dice a los crawlers qué rastrear y qué no. Está en `https://<sitio>/robots.txt`.

**Lo mínimo para MODO** (default permisivo, AI bots declarados explícito):

```txt
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI crawlers — declarar explícito permite revertir caso por caso
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: *
Allow: /

Sitemap: https://www.modo.com.ar/sitemap.xml
```

**Referencia de familias**:

| Family | Agents | Quién |
|--------|--------|-------|
| Google | `Googlebot`, `Google-Extended` | Google Search + Gemini training |
| OpenAI | `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` | ChatGPT training + browse + SearchGPT |
| Anthropic | `ClaudeBot`, `Claude-Web`, `anthropic-ai` | Claude training + browse |
| Perplexity | `PerplexityBot`, `Perplexity-User` | Perplexity index + user fetch |
| Apple | `Applebot`, `Applebot-Extended` | Spotlight/Siri + Apple Intelligence |
| Meta | `meta-externalagent` | Llama training + Meta AI |
| Common Crawl | `CCBot` | Dataset base de casi todos los LLMs |
| ByteDance | `Bytespider` | TikTok/Doubao training |
| Amazon | `Amazonbot` | Alexa + AWS AI |
| Bing/MSFT | `Bingbot` | Bing Search + Copilot grounding |
| DuckDuckGo | `DuckDuckBot` | DuckDuckGo + AI Answers |

**Caso real**: aprendeatumodo tenía 5 bots → lo pasamos a 22 bots (17 AI + 5 search). El wildcard `User-agent: *` los cubría implícitamente, pero la declaración explícita comunica intención y permite revertir por familia si llega el caso.

> **Cuándo usar `Disallow`**: solo para rutas estrictamente operacionales (login, admin, BFFs), o si hay licencia que prohíbe AI training. Para contenido marketing/educativo MODO: `Allow: /` para todos.

---

## `sitemap.xml`

Lista las URLs que querés que los crawlers indexen. El feed de prioridades de rastreo.

**Reglas críticas**:

- [ ] Sin `/#anchor`. Google colapsa `https://modo.com.ar/#cursos` al home. Listar rutas reales.
- [ ] URLs que devuelven 200 real, no redirects ni 404s.
- [ ] Sincronizado con los slugs reales del catálogo (Storyblok stories, routes estáticas).
- [ ] Top categorías de filtros con SEO value (no la combinatoria entera).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.modo.com.ar/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://www.modo.com.ar/promos</loc>
    <priority>0.9</priority>
    <changefreq>daily</changefreq>
  </url>
  <!-- Top categorías indexables -->
  <url>
    <loc>https://www.modo.com.ar/promos?categoria=supermercados</loc>
    <priority>0.7</priority>
    <changefreq>daily</changefreq>
  </url>
</urlset>
```

**Verificación rápida**:
```bash
# El sitemap existe y devuelve XML:
curl -sI https://www.modo.com.ar/sitemap.xml | grep "Content-Type"

# Sin anchors:
curl -s https://www.modo.com.ar/sitemap.xml | grep "#"
# Debe devolver vacío.
```

---

## `llms.txt`

Archivo markdown nuevo (propuesto en https://llmstxt.org/) que le da contexto curado al LLM. Es lo que `robots.txt` es para crawlers, pero para modelos de lenguaje.

Vivir en `https://<sitio>/llms.txt`. Si devuelve 404, el AI crawler no tiene guía — lo que indexa queda a su criterio.

**Formato canónico MODO**:

```markdown
# modo.com.ar

> Sistema de pagos del ecosistema bancario argentino. Permite pagar, transferir y acceder a promociones con los principales bancos del país.

MODO es la plataforma de pagos desarrollada por los bancos argentinos. Disponible para personas y comercios. Sin login requerido para consultar promociones y comercios.

- Audiencia: usuarios bancarios argentinos, comercios adheridos.
- Idioma: español rioplatense (es-AR).
- Sin paywall. Promociones y comercios accesibles sin cuenta.

## Promociones

- [Todas las promos MODO](https://www.modo.com.ar/promos): catálogo actualizado de descuentos y reintegros por banco, comercio y día.
- [Promos supermercados](https://www.modo.com.ar/promos?categoria=supermercados): descuentos en supermercados con MODO.

## Comercios

- [Mapa de comercios MODO](https://www.modo.com.ar/comercios): locales adheridos con filtro por rubro y ubicación.

## Sobre MODO

- [Sitio principal](https://www.modo.com.ar/): descripción completa de la plataforma.

## Optional

- [Sitemap](https://www.modo.com.ar/sitemap.xml)
- [Robots](https://www.modo.com.ar/robots.txt)
```

**Reglas**:
- Heading `#` único en primera línea.
- Blockquote `>` con la descripción canónica justo debajo (el LLM la usa como meta description semántico).
- Links absolutos. Con descripción inline. Terminada en punto.
- No es marketing copy. Es referencia.

---

## Checklist de salida

- [ ] `<link rel="canonical">` correcto en cada page (self-referential en pages indexables).
- [ ] `robots.txt` con los 17+ AI bots declarados explícito.
- [ ] `sitemap.xml` sin anchors, URLs 200, top categorías incluidas.
- [ ] `llms.txt` existe y devuelve 200 con `text/plain` o `text/markdown`.

> Siguiente: [02 · JSON-LD Schema.org](02-jsonld-schema.md)
