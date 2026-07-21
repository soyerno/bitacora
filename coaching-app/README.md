# Coaching Ontológico 🧭

Programa interactivo estilo Duolingo para aprender coaching ontológico
(tradición Echeverría / Flores / Maturana): 8 capítulos, 26 lecciones,
148 ejercicios, 27 tarjetas de teoría con 9 diagramas, glosario de 39
distinciones y bibliografía por capítulo.

App Next.js 16 independiente, extraída de la sección `/coaching` de la
bitácora. Sin backend: progreso, XP, racha, reflexiones y notas viven en
`localStorage` del navegador.

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # integridad del contenido (vitest)
pnpm typecheck
pnpm build
```

## Deploy en Vercel

Este directorio es una app autocontenida dentro del repo `soyerno/bitacora`.

1. En [vercel.com/new](https://vercel.com/new), importar el repo `soyerno/bitacora`.
2. En **Root Directory**, elegir `coaching-app/`.
3. Framework preset: **Next.js** (autodetectado). Sin variables de entorno requeridas.
4. Deploy.

O por CLI, desde este directorio:

```bash
npx vercel --prod
```

## Estructura

- `lib/coaching/` — todo el contenido del programa (capítulos, glosario, tipos) y el store de progreso.
- `components/coaching/` — player de lecciones, ejercicios, diagramas SVG, cuaderno.
- `app/` — rutas: `/` (mapa del programa), `/[capitulo]`, `/[capitulo]/[leccion]`, `/glosario`, `/notas`.
