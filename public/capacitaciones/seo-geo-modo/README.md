# Capacitación · SEO / GEO / JSON-LD para fronts MODO

> **Este curso no es para leer: es para ejecutar.** Cada lección tiene comandos reales, checklists verificables y traps que ya quemamos en producción. Vas a terminar entendiendo qué ve Googlebot vs qué ves vos en DevTools — y son cosas distintas.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## Para quién

Dev frontend que trabaja en modo-landing, promos-hub-site, aprendeatumodo, o cualquier front MODO. No importa si nunca tocaste SEO: arrancamos desde cero y llegamos hasta auditar y fixear con el harness real del equipo.

## Qué vas a saber hacer al terminar

1. Distinguir SEO clásico de GEO (visibilidad ante AI crawlers/LLMs) y saber cuándo aplica cada uno.
2. Configurar canonical, robots.txt, sitemap.xml y llms.txt de forma que Googlebot, ClaudeBot y PerplexityBot te vean bien.
3. Escribir JSON-LD Schema.org correcto: pasar el Google Rich Results strict check, conocer las props obligatorias y no caer en los traps de `SaleEvent`/`validThrough`/`Course`.
4. Detectar y corregir el CSR trap: por qué lo que ves en DevTools puede ser invisible al crawler.
5. Implementar URL-as-state: filtros, categorías y búsquedas como URLs reales, indexables, compartibles, con su propio JSON-LD.
6. Correr `/modo-seo-geo-audit` y interpretar la matriz de findings.

## Learning path

| # | Lección | Contenido clave | Skill harness |
|---|---------|-----------------|---------------|
| [00](00-seo-vs-geo.md) | SEO vs GEO | Qué es cada uno, por qué importa para MODO | — |
| [01](01-canonical-robots-sitemap.md) | Canonical · robots · sitemap | Señales base, llms.txt, AI bots | `modo-seo-geo-audit` |
| [02](02-jsonld-schema.md) | JSON-LD Schema.org | Tipos, Rich Results, traps reales | `modo-seo-geo-audit` |
| [03](03-ai-crawlers.md) | AI crawlers | GEO, qué bots declarar, CSR trap | `modo-seo-geo-audit` |
| [04](04-url-as-state.md) | URL-as-state | Filtros indexables, patterns Next 12/15 | `modo-seo-geo-audit` |
| [05](05-audit-fix.md) | Audit + fix | Workflow completo con harness | `modo-seo-geo-audit` |
| [🧪](exercises/README.md) | Lab integrador | Auditar + fixear una page real | todos |

## Cómo está organizado el pipeline real

```
Crawler (Googlebot / ClaudeBot / PerplexityBot)
        │  HTTP GET — User-Agent: GPTBot/1.0
        ▼
   robots.txt  ──  ¿está permitido?
        │ sí
        ▼
   sitemap.xml / llms.txt  ──  ¿qué URLs hay?
        │
        ▼
   HTML estático (lo que devuelve el servidor, NO React en el browser)
        │ parse
        ▼
   <title> · canonical · og:* · JSON-LD blocks
        │
        ▼
   Google Search Console / Bing Webmaster / AI knowledge base
```

**El trap más común**: el front se ve perfecto en Chrome pero el crawler ve el shell vacío porque todo lo renderiza React en client-side. El audit detecta esto con un `curl -A "Googlebot/2.1"`.

## Casos reales que vas a ver en el curso

- **aprendeatumodo · 2026-05-23** — partimos de 1 LD sin offers, sitemap con 4 anchors, 5 bots declarados. Llegamos a 5 LDs ricos, sitemap con 8 URLs reales, 22 bots (17 AI), Google Rich Results Course 7/7 ✅.
- **modo-landing · epics GEO COENXT** — URL-as-state en `/promos` y `/comercios`, cache-correctness en `getServerSideProps`, JSON-LD per filter state.
- **modo-landing PR #1489** — animación de entrada `opacity:0` diferiendo LCP; `Cache-Control` cacheando 404s transitorios.

## Reglas del equipo que el curso respeta

- Sin `alt=""` en imágenes — siempre descriptivo.
- JSON-LD: si no verificaste una prop contra Google Rich Results, no la afirmés.
- URL-as-state para todos los filtros públicos — sin excepción.
- Commits: `type(COENXT-XXX): Subject`.
- Gate SEO/GEO corre junto con a11y en Gate 4 de `guardia`.

> Empezá por [00 · SEO vs GEO](00-seo-vs-geo.md).
