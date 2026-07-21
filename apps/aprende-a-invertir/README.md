# Aprende a Invertir

App educativa interactiva para aprender a invertir y diversificar, en 4 pasos:

1. **Conceptos** — 5 módulos: la base antes de invertir, diversificación, cómo
   elegir y contratar un broker, mantenimiento de la cartera y errores comunes.
2. **Quiz de perfil de riesgo** — 5 preguntas → conservador / moderado /
   agresivo, con asignación sugerida aplicable al simulador.
3. **Simulador de cartera** — repartí 100% entre 6 clases de activos y mirá el
   retorno esperado, el riesgo y la proyección compuesta hasta 40 años
   (escenarios pesimista/esperado/optimista, tooltip, tabla accesible).
4. **Checklist de broker** — 17 filtros en 5 grupos (regulación, costos,
   productos, operativa, impuestos), con progreso persistido en `localStorage`.

> ⚠️ Todo el contenido es educativo, con supuestos ilustrativos. No es
> asesoramiento financiero.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript. Sin backend:
todo corre en el cliente y la página se prerenderiza estática. Tema
claro/oscuro/auto persistido. Paleta de gráficos de 6 colores validada para
daltonismo (CVD ΔE adyacente ≥ 8) en ambos temas.

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # build de producción
pnpm typecheck  # tsc --noEmit
```

## Deploy en Vercel

Esta app vive en `apps/aprende-a-invertir/` del repo
[`soyerno/bitacora`](https://github.com/soyerno/bitacora). Para deployarla como
proyecto independiente:

1. En [vercel.com/new](https://vercel.com/new), importá el repo `soyerno/bitacora`.
2. En **Root Directory**, seleccioná `apps/aprende-a-invertir`.
3. Framework preset: Next.js (autodetectado). Deploy.

Cada push a `main` que toque esta carpeta redeploya solo este proyecto.

## Origen

Extraída de la sección `/inversiones` de la bitácora
([spec](../../openspec/specs/inversiones.md) ·
[tests](../../tests/specs/inversiones.test.js) — la lógica de
`lib/inversiones.ts` está testeada en el repo padre).
