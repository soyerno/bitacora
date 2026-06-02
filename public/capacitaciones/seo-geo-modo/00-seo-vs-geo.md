# 00 · SEO vs GEO

> Lección 00 · El qué y el porqué

Hay dos canales de visibilidad que importan para un front MODO, y tienen lógicas distintas.

---

## SEO clásico (Search Engine Optimization)

**¿Qué es?** Optimizar para que Google (y Bing) indexen el contenido y lo muestren en los resultados de búsqueda tradicionales.

**Cómo funciona el ciclo**:
1. Googlebot rastrea el HTML de cada URL del sitemap.
2. Extrae signals: `<title>`, `<meta name="description">`, `<h1>`, `canonical`, JSON-LD, og:image, links internos.
3. Indexa el contenido y evalúa relevancia para queries de usuarios.
4. Muestra rich results si los JSON-LD pasan el strict check de Google.

**Lo que mide**:
- Posición en SERP (Search Engine Results Page).
- Impresiones y clics en Google Search Console.
- Rich results habilitados (FAQ, Course, Event, BreadcrumbList, etc.).

---

## GEO (Generative Engine Optimization)

**¿Qué es?** Optimizar para que los AI crawlers de LLMs (ChatGPT, Claude, Perplexity, Gemini, Copilot) puedan rastrear, entender y citar el contenido cuando un usuario pregunta algo relevante.

**Cómo funciona**:
1. Un AI bot (GPTBot, ClaudeBot, PerplexityBot, etc.) rastrea el HTML.
2. El LLM lo usa para training o para grounding de respuestas en tiempo real.
3. Cuando un usuario pregunta "¿qué promos tiene MODO con Galicia?", el AI puede citar modo.com.ar si el contenido era indexable y estructurado.

**Lo que mide**:
- Presencia de `llms.txt` (el archivo que le da contexto curado al LLM).
- AI bots declarados en `robots.txt` (sin `Disallow` para ellos).
- Contenido server-rendered (no CSR-only).
- Estructura clara: headings, listas, JSON-LD, descripciones concisas.

---

## La diferencia que importa en la práctica

| Dimensión | SEO | GEO |
|-----------|-----|-----|
| Audiencia final | Usuario que busca en Google | Usuario que pregunta a un AI |
| Señal más crítica | `canonical` + JSON-LD + backlinks | Contenido SSR + `llms.txt` + estructura clara |
| Detección de fallo | Google Search Console → drops | AI no cita el sitio / cita competidores |
| Archivo extra | `sitemap.xml` | `llms.txt` |
| Bots a declarar en `robots.txt` | Googlebot, Bingbot | GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. |
| Rich results | Sí (JSON-LD strict check) | Importante pero no el único lever |

> **Trampa**: muchos equipos optimizan SEO y asumen que GEO viene gratis. No viene. Googlebot y GPTBot son crawlers distintos con estrategias distintas. Un sitio con SEO 10/10 puede ser invisible para Perplexity si no tiene `llms.txt` y el contenido es CSR.

---

## Por qué importa para MODO

MODO opera en un espacio donde los usuarios cada vez más preguntan a AI en lugar de buscar en Google:

- "¿Qué promos tiene MODO este mes?"
- "¿En qué locales puedo pagar con MODO cerca de Palermo?"
- "¿Qué banco tiene más promos en supermercados con MODO?"

Si los fronts MODO (modo.com.ar, promos-hub-site, comercios) no son indexables por AI crawlers, la respuesta viene del competidor que sí lo es.

**Epics activos**: COENXT tiene epics GEO/SEO abiertos que cubren modo-landing (GEO epic 176, SEO epic 181, URL-as-state epic 184). El trabajo es real, no teórico.

**Caso medido**: aprendeatumodo pasó de 1 LD (sin offers) → 5 LDs ricos, robots.txt de 5 bots → 22 bots, Google Rich Results Course 7/7 ✅ — en un PR.

---

## El punto de partida de cualquier audit

Antes de tocar código: chequeá lo que ven los crawlers, no lo que ves vos.

```bash
# Lo que ve Googlebot (no el browser):
curl -s -A "Googlebot/2.1" https://www.modo.com.ar/ | grep -E "<title>|canonical|ld\+json" | head -20

# Lo que ve ClaudeBot:
curl -s -A "ClaudeBot/1.0" https://www.modo.com.ar/ | grep -E "<title>|canonical|ld\+json" | head -20

# Si el output es idéntico al HTML que sirve el server → sin CSR trap (bien).
# Si el output es un shell vacío con solo <div id="__next"></div> → CSR trap (problema).
```

---

> Siguiente: [01 · Canonical, robots, sitemap](01-canonical-robots-sitemap.md)
