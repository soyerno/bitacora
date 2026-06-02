# 🧪 Lab · Migrar un componente de Styled Components a Tailwind

> Objetivo integrador: tomás un componente real del repo, lo migrás end-to-end usando los patrones de las lecciones 00-05 y dejás el PR listo para review.

---

## El componente a migrar

Elegí **uno** de estos candidatos (todos son leaf components con SC o Emotion):

| Componente | Archivo | Sistema | Dificultad |
|------------|---------|---------|------------|
| `CardImagePromo` | `src/components/PromoCardsBySlot/CardImagePromo/index.jsx` | Emotion | ⭐ |
| `BannerPromo` | `src/components/BannerPromo/index.jsx` (si existe SC) | SC | ⭐⭐ |
| `Pill` / `Tag` | `src/components/Pill/index.jsx` | SC | ⭐ |
| Cualquier `Badge` | `src/components/*/Badge/*.jsx` | SC/Emotion | ⭐ |

Si encontrás uno más simple con un grep rápido (`grep -rl "from 'styled-components'" src/components/`), usá ese.

---

## Paso a paso

### Paso 1: Diagnóstico (lección 00)

```bash
# Desde la raíz de modo-landing:
grep -n "from 'styled-components'\|from '@emotion" src/components/TuComponente/index.jsx
```

Anotá:
- ¿Qué sistema usa?
- ¿Cuántos styled-components o emotion blocks tiene?
- ¿Tiene props dinámicos (el styled recibe props que cambian el CSS)?

### Paso 2: Activar el skill

Abrí el archivo en Claude Code. El skill `styled-components-to-tailwind` se auto-invoca. Si no se invoca, ejecutá manualmente:

```
/styled-components-to-tailwind
```

### Paso 3: Mapear tokens (lección 03)

Para cada color, spacing o typography que encontrés en el styled-component:

1. Buscá el equivalente en `tailwind.config.js`:
   ```bash
   grep -n "brand-green\|greys-white\|spacing" tailwind.config.js | head -20
   ```
2. Si es un color → usá `var(--nombre-del-token)`.
3. Si es tipografía → buscá la clase como `text-h2-bold` o `text-body-regular`.

**No uses hex. No uses valores px si hay token equivalente.**

### Paso 4: Migrar (lección 02)

Reemplazá el bloque styled/emotion por JSX + `className="..."`. Guía rápida:

```
styled.div`...`              → <div className="...">
css={css`...`}               → className="..."
@media (min-width: 768px)    → md: prefix
${({ prop }) => value}       → classnames({ 'clase': prop === 'valor' })
```

### Paso 5: Limpiar imports

```bash
# verificá que no queden imports de SC/Emotion en el archivo
grep -n "from 'styled-components'\|from '@emotion" src/components/TuComponente/index.jsx
# debe dar 0
```

### Paso 6: Tests

El componente probablemente ya tiene tests. Corrélos:

```bash
npx jest src/components/TuComponente --watch
```

Si alguno usaba `toMatchSnapshot` y falla, refactorizalo a RTL semántico:

```tsx
// ❌ snapshot (prohibido)
expect(container).toMatchSnapshot();

// ✅ RTL semántico
expect(screen.getByRole('img', { name: /promoción/i })).toBeInTheDocument();
expect(screen.getByText('Black Friday')).toBeVisible();
```

### Paso 7: Verificación local

```bash
pnpm lint
pnpm test
pnpm dev  # visual check en el browser
```

---

## Checklist del lab

- [ ] Componente elegido: `____________________`
- [ ] Sistema identificado (SC / Emotion / mixto): `____`
- [ ] Skill auto-invocado o invocado manualmente
- [ ] Todos los colores usan `var(--token)`, cero hex
- [ ] Todos los spacings usan tokens o escala Tailwind estándar
- [ ] Imports de SC/Emotion eliminados del archivo
- [ ] `pnpm lint` verde
- [ ] `pnpm test` verde (sin snapshots nuevos)
- [ ] Visual check local: idéntico al pre-migración
- [ ] Grep de SC da 0 en el archivo migrado

---

## Commit y PR

Cuando todo está verde:

```bash
git add src/components/TuComponente/
git commit -m "refactor(COENXT-XXX): migrar TuComponente de SC a Tailwind"
```

Título del PR: `refactor(COENXT-XXX): migrar <Componente> de styled-components a Tailwind`

Descripción mínima:
```
🎯 ¿Qué dolor soluciona?
Consolidación del styling a Tailwind-only. Elimina runtime SC del bundle.

🛠️ ¿Qué tuvimos que hacer?
- Reemplazar X styled-components por className con tokens del design system.
- Eliminar imports de styled-components del archivo.

🎁 ¿Para qué?
Bundle JS más chico. Sin runtime CSS-in-JS. Un paso más hacia el bloqueo de _document.js.
```

---

## Recursos

- [Lección 00 · Los 3 sistemas](../00-tres-sistemas.md)
- [Lección 01 · Estrategia](../01-estrategia.md)
- [Lección 02 · CSS-in-JS → utilities](../02-css-in-js-a-utilities.md)
- [Lección 03 · Tokens + design system](../03-tokens-design-system.md)
- [Lección 04 · Tailwind 3 → 4](../04-tailwind-3-a-4.md)
- [Lección 05 · Verify](../05-verify.md)
