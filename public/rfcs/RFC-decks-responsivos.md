# RFC · Decks responsivos con canvas adaptativo

- **ID**: R20
- **Estado**: draft
- **Fecha**: 2026-05-20
- **Autor**: Hernán De Souza · Sr AI Engineer
- **Equipos que opinan antes de avanzar**: TL frontend modo-landing, PM, Manager
- **Skill afectado**: [`modo-deck`](https://github.com/SoyErnoModo/erno-modo/tree/main/skills/modo-deck)
- **Caso piloto**: [`decks/draft/accesibilidad-lectura-asistida-tdah.html`](../decks/draft/accesibilidad-lectura-asistida-tdah.html)

---

## Contexto

La bitácora de erno-modo ya publica 15 decks (10 en `completo/`, 5 en `draft/`). Todos siguen el canon definido en el skill `modo-deck` y heredan la misma arquitectura: una slide 16:9 fija, navegada por teclado, viewport bloqueado a `width=1280`.

El canon nació para presentaciones internas en escritorio (PM, TL, Manager mirando una proyección o un monitor grande). El traffic real de la bitácora muestra que los lectores entran desde Slack, WhatsApp y X, mayormente desde mobile. Cuando abren un link a un deck en el celular, ven una caja de 16:9 enana centrada en una sea de gris claro, con tipografía a 11px y zero affordance táctil.

No es un fix de tipografía. Es repensar el deck como un canvas adaptativo: los elementos se posicionan, no se "encolumnan", y el canvas se redibuja según el viewport sin perder identidad MODO.

## Problema

1. **Viewport fijo**: `<meta viewport content="width=1280">` fuerza zoom-out en mobile → texto ilegible, chrome inservible.
2. **Aspect-ratio rígido**: `aspect-ratio: 16/9` + `max-height: 100vh` deja slides de ~16vh en portrait con padding 64/80 desperdiciando 60% del viewport.
3. **Layouts hardcodeados a desktop**: `.grid-3` y `.row` colapsan mal — los `flex: 1` con `min-width: 0` aplastan cards a 90px de ancho en mobile.
4. **Navegación solo teclado**: `keydown` con `ArrowLeft/Right/Space` no funciona en touch. No hay swipe, no hay tap-zones, no hay indicador de "deslizá".
5. **Tipografía fluida incompleta**: hay `clamp()` en `h1.title` y `h2.heading`, pero `p.body` queda a 19px fijos y `.eyebrow` a 14px fijos. En 360px de ancho, 19px con `max-width: 68ch` es absurdo.
6. **Chrome desproporcionado**: el `slide__chrome-top` se diseñó pensando en una proyección — `letter-spacing: 0.12em` + `font-size: 13px` se vuelve ruido en 375px.
7. **No hay pattern D&R**: los decks cierran con un slide "Próximos pasos" o "Aguardo feedback". Falta un slide canónico para listar **Decisiones tomadas y Riesgos asumidos** (D&R), que es el cierre que la audiencia (TL/PM/Manager) realmente lee.

## Objetivo

Decks de la bitácora se ven y se leen bien en:

- **Mobile portrait** 360–430px (iPhone SE → 15 Pro Max)
- **Tablet portrait/landscape** 768–1024px
- **Desktop** 1280–2560px
- **Proyección 4K** hasta 3840px

Sin perder:

- Identidad visual MODO (verde #008859, Red Hat Display + Quicksand, paper-warm)
- Navegación por keyboard en desktop (Arrow / Space / Esc)
- Counter + progress bar
- Exportable a PDF en 16:9

## Propuesta

### 1. Canvas adaptativo (no aspect-ratio rígido)

Reemplazar `aspect-ratio: 16/9` por un **modo de canvas** según viewport:

```css
/* Desktop ≥1024px → canvas 16:9 con max-width */
@media (min-width: 1024px) {
  .slide {
    width: min(1600px, 96vw, calc(92vh * 16 / 9));
    aspect-ratio: 16 / 9;
    max-height: 100vh;
    padding: 64px 80px;
  }
}

/* Tablet 640–1023px → canvas 4:3 más alto */
@media (min-width: 640px) and (max-width: 1023px) {
  .slide {
    width: min(94vw, calc(88vh * 4 / 3));
    aspect-ratio: 4 / 3;
    max-height: 92vh;
    padding: 40px 48px;
  }
}

/* Mobile <640px → portrait scroll, sin aspect-ratio */
@media (max-width: 639px) {
  .slide {
    width: 100vw;
    min-height: 100vh;
    aspect-ratio: auto;
    padding: 56px 20px 80px;
    overflow-y: auto;
  }
  .deck { height: auto; min-height: 100vh; align-items: flex-start; }
}
```

### 2. Posicionamiento por canvas (CSS Grid areas)

Las slides no deben usar `flex: 1` ciego. Cada slide declara su grilla y los elementos se posicionan por **área nombrada**. Así, mobile redefine la grilla sin tocar el HTML.

```css
.slide__body--canvas {
  display: grid;
  gap: 24px;
  grid-template-columns: var(--cols, repeat(12, 1fr));
  grid-template-rows: auto;
}
.slide__body--canvas > [data-area] {
  grid-area: var(--area);
}

/* Ejemplo: hero con número grande izquierda, texto derecha */
.layout-hero-num {
  --cols: repeat(12, 1fr);
}
.layout-hero-num [data-area="num"]  { --area: 1 / 1 / 2 / 6;  }
.layout-hero-num [data-area="text"] { --area: 1 / 6 / 2 / 13; }

@media (max-width: 639px) {
  .layout-hero-num [data-area="num"]  { --area: 1 / 1 / 2 / 13; }
  .layout-hero-num [data-area="text"] { --area: 2 / 1 / 3 / 13; }
}
```

### 3. Tipografía fluida con piso mobile

Todos los tamaños usan `clamp(min, fluid, max)`. Pisos pensados para 360px:

| Token        | Mobile floor | Desktop max | Fórmula                       |
|--------------|--------------|-------------|-------------------------------|
| `title`      | 32px         | 80px        | `clamp(32px, 6vw, 80px)`      |
| `heading`    | 26px         | 54px        | `clamp(26px, 4vw, 54px)`      |
| `subheading` | 20px         | 28px        | `clamp(20px, 2.2vw, 28px)`    |
| `lede`       | 18px         | 26px        | `clamp(18px, 2vw, 26px)`      |
| `body`       | 16px         | 19px        | `clamp(16px, 1.5vw, 19px)`    |
| `muted`      | 13px         | 16px        | `clamp(13px, 1.1vw, 16px)`    |
| `eyebrow`    | 12px         | 14px        | `clamp(12px, 1vw, 14px)`      |
| `num--xl`    | 64px         | 168px       | `clamp(64px, 12vw, 168px)`    |

### 4. Chrome adaptativo

- **Desktop**: top chrome (logo + título corto + status) + bottom chrome (counter + progress + meta).
- **Tablet**: idem desktop, padding reducido.
- **Mobile**: solo bottom bar fija — counter + progress + tap-zones invisibles laterales (33% izq / 33% centro = menú / 33% der). Top chrome colapsa a un logo discreto in-flow.

### 5. Navegación táctil

Detectar `(pointer: coarse)` y montar swipe handler con `pointerdown/move/up`. Threshold: 60px horizontales. Mantener keyboard nav en desktop.

```js
if (window.matchMedia('(pointer: coarse)').matches) {
  let startX = 0;
  deck.addEventListener('pointerdown', e => { startX = e.clientX; });
  deck.addEventListener('pointerup', e => {
    const dx = e.clientX - startX;
    if (dx < -60) next();
    else if (dx > 60) prev();
  });
}
```

Bonus: tap en tercio derecho avanza, tap en tercio izquierdo retrocede (igual que iBooks).

### 6. Modo "scroll" opcional en mobile

Mobile portrait puede usar dos modos:

- **Modo slide** (default): swipe horizontal, una slide a la vez.
- **Modo scroll** (toggle): todas las slides apiladas verticalmente como un long-read. Útil para lectura asíncrona en Slack/WhatsApp.

El toggle vive en el bottom chrome. Persistido en `localStorage`.

### 7. Slide canónica D&R (Decisiones y Riesgos)

Pattern obligatorio antes del cierre. Estructura:

```
┌─────────────────────────────────────────────────────┐
│ EYEBROW · DECISIONES Y RIESGOS                       │
│                                                       │
│ ┌── Decisiones tomadas ──────┬── Riesgos asumidos ─┐ │
│ │ ✓ Decisión 1               │ ⚠ Riesgo 1          │ │
│ │ ✓ Decisión 2               │ ⚠ Riesgo 2          │ │
│ │ ✓ Decisión 3               │ ⚠ Riesgo 3          │ │
│ └────────────────────────────┴─────────────────────┘ │
│                                                       │
│ Aguardo su feedback antes de mergear.                 │
└─────────────────────────────────────────────────────┘
```

- Voz rioplatense, sin "apetito" ni buzzwords.
- En mobile, las dos columnas se apilan: Decisiones arriba, Riesgos abajo.
- Estilo: tarjeta sobre `paper-warm`, separador vertical en desktop con borde `border-soft`.

Componente CSS reusable: `.slide-dyr` + `.slide-dyr__col`.

### 8. Caso piloto: deck de accesibilidad

`decks/draft/accesibilidad-lectura-asistida-tdah.html` es el primer deck que se adapta al patrón nuevo. Razón:

- Es **el deck más leído desde mobile** (link compartido en Slack interno y X).
- Su contenido (lectura biónica + accesibilidad TDAH) tiene que ser **legible en el dispositivo más constreñido** — sería una contradicción que un deck sobre accesibilidad no sea accesible en su propio medio.
- Sirve como referencia para portar el resto.

Checklist del piloto:

- [ ] Viewport meta sin `width=1280`, usa `width=device-width, initial-scale=1`.
- [ ] Slides usan layouts grid-area (no flex ciego).
- [ ] Tipografía 100% `clamp()` con floor mobile.
- [ ] Chrome adaptativo (mobile bottom-only).
- [ ] Swipe + tap-zones.
- [ ] Slide D&R agregada antes del cierre.
- [ ] Toggle scroll/slide en mobile.
- [ ] Lectura biónica aplicada a `p.body` mantiene legibilidad en 360px.
- [ ] Performance: LCP < 1.5s en 3G fast emulado (sin imágenes que pesen).
- [ ] Lighthouse mobile accesibilidad ≥ 95.

## No-objetivos

- **No** redesignar la identidad visual. Mismos colores, mismas fonts, mismo tono.
- **No** reescribir todos los decks de una. Se hace primero el piloto, después se actualiza el skill `modo-deck`, después se portan los demás cuando se editen.
- **No** introducir un framework JS. Sigue siendo HTML estático + un `<script>` inline.
- **No** soportar PDF export pixel-perfect en mobile. PDF queda en 16:9 desktop como hasta ahora.

## Decisiones tomadas en este RFC

1. **Tres breakpoints, no cinco**: mobile <640, tablet 640–1023, desktop ≥1024. 4K se cubre con `max-width` en desktop.
2. **CSS Grid areas, no Container Queries**: grid-template-areas es soporte universal hoy. Container queries quedan para v2 si el patrón lo pide.
3. **Modo scroll opcional, no default en mobile**: el default sigue siendo slide-by-slide para preservar la sensación de presentación. El long-read es un toggle.
4. **D&R reemplaza "Próximos pasos" como cierre canónico**: más útil para la audiencia interna (TL/PM/Manager) que un bullet de TODOs futuros.
5. **No introducir librería de swipe**: pointer events nativos alcanzan. Cero dependencias.

## Riesgos asumidos

1. **Drift del skill `modo-deck`**: cambiar el canon obliga a actualizar el SKILL.md y los ejemplos. Si no se hace en el mismo PR, los próximos decks generados nacen con el patrón viejo.
2. **Decks viejos quedan híbridos**: hasta portar los 14 restantes, la bitácora tiene dos patrones conviviendo. Mitigación: badge "responsivo" en `decks.json` para el lector.
3. **Tap-zones invisibles confunden**: usuario que tappea para "leer" un texto puede avanzar la slide sin querer. Mitigación: zonas activas solo en bordes (10% izquierda / 10% derecha), centro libre.
4. **Lectura biónica + clamp() floors chicos**: si el bold de bionic se renderiza a 13px, pierde el ancla visual. Hay que validar que el `eyebrow` no llegue a ese piso en bionic mode.
5. **PDF export se rompe si el deck está en modo scroll**: el script de export asume 16:9. Forzar modo slide antes de exportar.

## Plan de implementación (con IA)

| Fase | Trabajo | Estimado (con IA) |
|------|---------|-------------------|
| F1 · Tokens | CSS variables + clamp() tokens nuevos en el `<style>` del deck piloto | 30 min |
| F2 · Layouts | Convertir 5–6 layouts del piloto a `grid-template-areas` con responsive | 1 h |
| F3 · Chrome adaptativo | Top chrome colapsable + bottom-only mobile | 30 min |
| F4 · Touch nav | Swipe + tap zones + persistencia toggle scroll/slide | 45 min |
| F5 · Slide D&R | Pattern + adaptación al cierre del deck piloto | 30 min |
| F6 · QA visual | Test en 360 / 768 / 1280 / 2560 con webapp-testing + Lighthouse mobile | 30 min |
| F7 · Skill update | Actualizar `~/.claude/skills/modo-deck/SKILL.md` con el patrón nuevo + ejemplo | 30 min |
| F8 · Bitácora | `erno-modo-sync-all` + badge "responsivo" en `decks.json` | 15 min |

**Total**: ~4h con Claude Code + skill `modo-deck`.

## Validación / criterios de aceptación

- Lighthouse mobile en el deck piloto ≥ 95 accesibilidad, ≥ 90 performance.
- En iPhone SE (375x667) cada slide cabe sin scroll horizontal y tipografía ≥ 16px en body.
- En desktop 1440x900 nada cambia respecto al estado actual (regresión zero).
- Swipe funciona en iOS Safari + Android Chrome.
- Slide D&R presente al final del piloto.
- PDF export sigue dando 16:9 limpio.

## Referencias

- Deck piloto: [`decks/draft/accesibilidad-lectura-asistida-tdah.html`](../decks/draft/accesibilidad-lectura-asistida-tdah.html)
- Skill afectado: `~/.claude/skills/modo-deck/SKILL.md`
- Canon actual: [`decks/completo/nextjs-12-to-16-consolidation.html`](../decks/completo/nextjs-12-to-16-consolidation.html)
- WCAG 2.2 AA · Reflow (1.4.10) · Text Spacing (1.4.12) · Pointer Gestures (2.5.1)

---

**Aguardo feedback de TL, PM y Manager antes de mergear el piloto a `decks/completo/`.**
