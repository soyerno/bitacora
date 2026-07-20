# 04 · Tailwind 3 → 4

> Objetivo: migrar Tailwind 3.x a v4 sin reescribir los 480 líneas de config. Gotchas verificados en modo-landing PR #1509 Wave 0.

## Harness

- `tailwind-3-to-4-migration` — invocar post-consolidación de CSS-in-JS.

---

## Cuándo hacer esta migración

Tailwind 3 → 4 es **Wave 0**: se hace una vez, antes de migrar los componentes CSS-in-JS. Así las waves siguientes ya corren sobre base v4.

> En modo-landing: Wave 0 del PR #1509 migró TW 3.4.17 → 4.3.0 en 1 commit. Sin reescribir el config. Build verde. Waves 1-N de SC/Emotion encima de esa base.

---

## Los cambios grandes en Tailwind v4

| Aspecto | v3 | v4 |
|---------|----|----|
| Config | `tailwind.config.js` | CSS `@theme` block (opcional con `@config`) |
| Content paths | `content: [...]` en JS | `@source` en CSS |
| PostCSS plugin | `tailwindcss` | `@tailwindcss/postcss` |
| JIT mode | `mode: 'jit'` explicit | default, no declarar |
| CSS base import | `@tailwind base/components/utilities` | `@import 'tailwindcss'` |

---

## Estrategia recomendada: `@config` backward-compat

Para un `tailwind.config.js` grande (400+ líneas, miles de tokens custom), reescribir todo a `@theme` block en un commit es riesgoso. v4 acepta config legacy v3-style vía `@config` directive:

```css
/* src/styles/globals.css */
@import 'tailwindcss';
@config '../../tailwind.config.js';

/* resto de :root vars, custom utilities, etc. */
```

> Trap: la path del `@config` es **relativa al archivo CSS**, no a la raíz del proyecto. Si el CSS está en `src/styles/`, el path al config en la raíz es `'../../tailwind.config.js'`.

Esto permite:
- Shippear v4 con el config legacy intacto.
- Waves posteriores que migran token-by-token al `@theme` block.
- Las CSS variables del SDK (`var(--greys-white)`) siguen funcionando sin cambios.

---

## Instalación

```bash
pnpm add -D tailwindcss@4 @tailwindcss/postcss
```

Actualizar `postcss.config.js`:

```js
// v3
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}

// v4
module.exports = {
  plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} }
}
```

---

## Gotcha 1: `@apply` con clase custom falla en v4

v3 permitía aplicar clases custom definidas en el config dentro de `@apply`:

```css
/* ❌ rompe en v4 */
.buttonPrimary {
  @apply px-4 py-2 bodyRegular font-bold;
  /* 'bodyRegular' es clase custom del config — v4 no la resuelve en @apply */
}
```

Fix: inline las utilities que componen `bodyRegular`:

```css
/* ✅ v4 */
.buttonPrimary {
  @apply px-4 py-2 font-normal text-p3-mobile md:text-p3-web font-bold;
}
```

---

## Gotcha 2: `plugins` legacy object literal revienta v4

Si el config tiene plugins como object (legacy v2, ignorado silenciosamente por v3):

```js
// ❌ rompe en v4 con: "CssSyntaxError: w is not a function"
plugins: [{ '@tailwindcss/jit': {}, autoprefixer: {} }]

// ✅ v4
plugins: []
```

---

## Gotcha 3: import de `tailwindcss/tailwind.css` en `_app.js`

Si existe este import en `_app.js` o `_app.tsx`:

```js
// ❌ no existe en v4 — "Module not found"
import 'tailwindcss/tailwind.css';
```

Removelo. El CSS base se importa desde `globals.css` con `@import 'tailwindcss'`.

---

## Gotcha 4: Safe-chain bloquea `enhanced-resolve` reciente

> Este es el gotcha más silencioso. Safe-chain bloquea paquetes publicados en las últimas 168h.

`@tailwindcss/node@4.3.0` depende de `enhanced-resolve` que se actualiza frecuentemente. Si el repo tiene Safe-chain check activo, la instalación falla o instala una versión inestable.

**Fix**: pin a una versión conocida (>7 días de vida) en `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "enhanced-resolve": "5.21.6"
    }
  }
}
```

> Verificá que `5.21.6` siga siendo la recomendada. Si cambia la versión de `@tailwindcss/node`, revisá cuál `enhanced-resolve` pide y pinneá a la siguiente stable >7d.

---

## Verificación post-migración (sin correr build en el curso)

En un PR real:

```bash
pnpm build              # debe terminar sin errores
pnpm lint               # sin regresiones de ESLint
grep -r "tailwindcss/tailwind.css" src/   # debe dar 0 resultados
grep -rn "@apply.*bodyRegular\|@apply.*h1-bold" src/styles/   # custom classes en @apply
```

---

## Flujo completo verificado (caso modo-landing)

```
1. pnpm add -D tailwindcss@4 @tailwindcss/postcss
2. Agregar override enhanced-resolve en package.json
3. Actualizar postcss.config.js (plugin name)
4. Actualizar globals.css:
   - @import 'tailwindcss'  (reemplaza @tailwind base/components/utilities)
   - @config '../../tailwind.config.js'
5. Limpiar _app.js de import 'tailwindcss/tailwind.css' si existe
6. Arreglar @apply con custom classes
7. Arreglar plugins: [{...}] → plugins: []
8. pnpm build verde ✓
```

---

## Checklist de salida

- [ ] Instalaste `tailwindcss@4` y `@tailwindcss/postcss`
- [ ] Actualizaste `postcss.config.js` con el nombre nuevo del plugin
- [ ] Usás `@config` directive para mantener el config legacy sin reescribir
- [ ] Pintaste el override de `enhanced-resolve` si el repo tiene Safe-chain
- [ ] Verificaste que `@apply` no use custom classes (o las inlineaste)
- [ ] Limpiaste `plugins: [{...}]` → `plugins: []`

> Siguiente: [05 · Verify](05-verify.md)
