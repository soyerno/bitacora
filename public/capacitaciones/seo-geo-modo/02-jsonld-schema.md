# 02 · JSON-LD Schema.org

> Lección 02 · Rich Results

JSON-LD es el vocabulario que les dice a Google (y a los AI crawlers) qué _tipo_ de contenido es cada page. Sin él, Google indexa texto plano. Con él, puede mostrar rich results: estrellas, FAQs, courses, eventos — más espacio visual, más CTR, más confianza de los LLMs.

---

## ¿Qué es JSON-LD?

Un bloque `<script type="application/ld+json">` en el `<head>` con metadata estructurada en formato schema.org. No afecta el render. El crawler lo lee directamente.

```html
<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MODO",
    "url": "https://www.modo.com.ar/"
  }
  </script>
</head>
```

**Múltiples bloques están OK**: podés tener Organization + WebSite + BreadcrumbList en el mismo `<head>`, cada uno en su `<script>`.

---

## Tipos relevantes para fronts MODO

### Organization (modo.com.ar, promos-hub, comercios)

Para el home y pages corporativas.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MODO",
  "url": "https://www.modo.com.ar/",
  "logo": "https://a.storyblok.com/f/244835/436x96/54d30790a2/modo-logo-pay-default.png",
  "description": "Sistema de pagos del ecosistema bancario argentino.",
  "sameAs": [
    "https://www.modo.com.ar/"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "AR"
  }
}
```

> **Trap · logo**: no hardcodear `/modo-logo.png` que puede devolver 404. El URL canónico del logo MODO es el de Storyblok: `https://a.storyblok.com/f/244835/436x96/54d30790a2/modo-logo-pay-default.png` (436×96, PNG, verificado 200 OK).

### WebSite con publisher

Para qualquier front MODO. Habilita el `SearchAction` sitelinks en Google.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MODO",
  "url": "https://www.modo.com.ar/",
  "inLanguage": "es-AR",
  "publisher": {
    "@type": "Organization",
    "name": "MODO",
    "url": "https://www.modo.com.ar/",
    "logo": "https://a.storyblok.com/f/244835/436x96/54d30790a2/modo-logo-pay-default.png"
  }
}
```

### BreadcrumbList

Requerido para que Google muestre la ruta de navegación en el SERP. El catch-all de modo-landing ya lo inyecta. Para pages nuevas, verificar que esté.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://www.modo.com.ar/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Promociones",
      "item": "https://www.modo.com.ar/promos"
    }
  ]
}
```

### CollectionPage con ItemList (grids de promos/comercios)

Para `/promos` y `/comercios`. El `ItemList` se scopea al subset visible en el filtro activo.

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Promociones MODO",
  "url": "https://www.modo.com.ar/promos",
  "inLanguage": "es-AR",
  "publisher": {
    "@type": "Organization",
    "name": "MODO",
    "url": "https://www.modo.com.ar/"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Promociones disponibles con MODO",
    "numberOfItems": 8,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://www.modo.com.ar/promos?promo=descuento-galicia-super",
        "item": {
          "@type": "Offer",
          "name": "30% de descuento en supermercados con Galicia",
          "description": "Comprá en supermercados adheridos y recibí 30% de reintegro.",
          "seller": {
            "@type": "Organization",
            "name": "MODO"
          }
        }
      }
    ]
  }
}
```

> **Trampa**: `ItemList` con todos los ítems aunque el filtro muestre 8. Si el LD tiene 500 ítems y la página muestra 8, hay inconsistencia visible→LD. El crawler lo nota. Scopear siempre al subset visible. Ver [04 · URL-as-state](04-url-as-state.md) para el patrón de generación dinámica.

### FAQPage (SectionCollapsible)

El catch-all de modo-landing ya inyecta `FAQPage` desde los `SectionCollapsible`. Para pages nuevas con FAQ, seguir el mismo patrón.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo sumo mi banco a MODO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Descargá la app de tu banco y buscá la sección MODO. En la mayoría de los bancos adheridos está disponible desde la app."
      }
    }
  ]
}
```

### Course (aprendeatumodo)

El tipo más exigente. Google requiere campos específicos para mostrar el rich result — incluso cuando el curso es gratis.

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Seguridad y Prevención de Fraude",
  "description": "Identificá estafas telefónicas, virtuales y presenciales.",
  "url": "https://aprendeatumodo.modo.com.ar/curso/seguridad",
  "inLanguage": "es-AR",
  "isAccessibleForFree": true,
  "educationalLevel": "Beginner",
  "timeRequired": "PT8M",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "ARS",
    "category": "Free",
    "availability": "https://schema.org/InStock"
  },
  "provider": {
    "@type": "Organization",
    "name": "MODO",
    "url": "https://www.modo.com.ar/",
    "logo": "https://a.storyblok.com/f/244835/436x96/54d30790a2/modo-logo-pay-default.png"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "courseWorkload": "PT8M",
    "inLanguage": "es-AR"
  }
}
```

---

## Traps de Schema.org — los que ya quemamos

### Trap 1 · Course sin `offers`

Google exige `offers` para mostrar el Course rich result **aunque `isAccessibleForFree: true`**. Sin `offers`, el LD es válido para schema.org pero el rich result no aparece en Google.

```json
// MAL — schema válido pero Google no muestra rich result:
{ "@type": "Course", "name": "...", "isAccessibleForFree": true }

// BIEN — con offers incluso si es gratis:
{ "@type": "Course", "name": "...", "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "ARS", "category": "Free" } }
```

### Trap 2 · Course sin `provider.url` + `provider.logo`

El Google Rich Results strict check exige ambos en `provider`. Solo `provider.name` no alcanza.

```json
// MAL:
"provider": { "@type": "Organization", "name": "MODO" }

// BIEN:
"provider": { "@type": "Organization", "name": "MODO",
              "url": "https://www.modo.com.ar/",
              "logo": "https://a.storyblok.com/f/244835/436x96/54d30790a2/modo-logo-pay-default.png" }
```

### Trap 3 · `validThrough` no es propiedad de `Event`

`validThrough` es prop de `Offer` y `LocationFeatureSpecification`. En un bloque `@type: Event`, es inválida y genera warning en Rich Results.

```json
// MAL — validThrough no existe en Event:
{ "@type": "Event", "name": "...", "validThrough": "2025-12-31" }

// BIEN — usar endDate:
{ "@type": "Event", "name": "...", "endDate": "2025-12-31" }
```

### Trap 4 · `SaleEvent` — props obligatorias

Para un `SaleEvent` (promoción con fecha) que quieras en Google Events rich results:

| Prop | Requerida | Nota |
|------|-----------|------|
| `name` | ✅ | Nombre del evento/promo |
| `startDate` | ✅ | ISO 8601 |
| `endDate` | ✅ | ISO 8601 (no `validThrough`) |
| `location` | ✅ | `@type: Place` o `@type: VirtualLocation` |
| `organizer` | ✅ | `@type: Organization` con `name` + `url` |
| `image` | ✅ | URL de imagen (mínimo 1200×630 para rich result) |
| `description` | ✅ | Texto descriptivo |
| `eventAttendanceMode` | ✅ | `OnlineEventAttendanceMode` o `OfflineEventAttendanceMode` |
| `eventStatus` | Recomendado | `EventScheduled`, `EventCancelled`, etc. |
| `offers` | Recomendado | Para mostrar precio/gratuidad |

> **Trap**: `superEvent` en un `SaleEvent` espera un `Event` como valor, no una `Organization`. Errorear `superEvent: { @type: Organization }` produce warning silencioso.

### Trap 5 · Schema válido ≠ Google muestra rich result

Pasar schema.org validator (validator.schema.org) solo confirma que el JSON es sintácticamente válido. Google tiene su propio strict check con requisitos adicionales. Siempre correr el **Google Rich Results Test**: https://search.google.com/test/rich-results

```bash
# Verificación local con el script del harness:
python3 ~/.claude/skills/modo-seo-geo-audit/scripts/validate-jsonld.py /tmp/audit-page.html
```

---

## Dónde van los LDs en modo-landing

El catch-all `src/pages/[[...slug]].jsx` inyecta:
- `BreadcrumbList` — siempre
- `FAQPage` — si hay `SectionCollapsible` en el body
- JSON-LD extra vía `buildExtraStructuredData` — para tipos nuevos (Service, Collection)

Para pages fuera del catch-all (`/promos`, `/comercios`, etc.): el LD se genera en `getServerSideProps` y se inyecta via `<Head>` o via `next/head`.

---

## Checklist de salida

- [ ] Al menos `Organization` + `WebSite` en el home.
- [ ] `BreadcrumbList` en home y en pages internas.
- [ ] `Course` tiene `offers` + `provider.url` + `provider.logo` + `hasCourseInstance`.
- [ ] Ningún `Event` usa `validThrough` (usar `endDate`).
- [ ] `SaleEvent` tiene `location`, `organizer`, `image`, `description`, `eventAttendanceMode`.
- [ ] Pasó Google Rich Results Test (no solo schema.org validator).
- [ ] `ItemList` scoped al subset visible (no los 500 ítems con filtro activo).

> Siguiente: [03 · AI crawlers](03-ai-crawlers.md)
