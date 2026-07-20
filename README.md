# erno-modo

Sitio personal de Erno construido con [Astro](https://astro.build). Reúne dos secciones:

- **Bitácora** — notas de proyectos, hallazgos y problemas resueltos, ordenadas por fecha.
- **Bóveda** — apuntes y referencias de consulta.

El contenido vive como Markdown en [content collections](https://docs.astro.build/en/guides/content-collections/), sin base de datos ni backend: se compila a HTML estático.

## Estructura

```text
src/
├── content/
│   ├── bitacora/        # entradas de la bitácora (.md)
│   └── boveda/          # entradas de la bóveda (.md)
├── content.config.ts    # colecciones y esquema (title, date, tags)
├── layouts/
│   └── Base.astro       # layout y estilos globales
└── pages/
    ├── index.astro      # listado de la bitácora
    ├── bitacora/[id].astro
    └── boveda/          # index y [id]
public/                  # assets estáticos (favicon, etc.)
```

## Añadir una entrada

Crea un `.md` en la colección correspondiente con su frontmatter:

```md
---
title: Descifrar audio de Mini Cozy Room
date: 2026-07-18
tags: [unity, xor, audio]
---

Contenido en Markdown…
```

- **bitácora**: requiere `title` y `date`; `tags` es opcional.
- **bóveda**: requiere `title`; `tags` es opcional (no lleva `date`).

El archivo se publica automáticamente en la ruta según su nombre.

## Comandos

Todos se ejecutan desde la raíz del proyecto:

| Comando            | Acción                                          |
| :----------------- | :---------------------------------------------- |
| `npm install`      | Instala las dependencias                        |
| `npm run dev`      | Servidor local en `localhost:4321`              |
| `npm run build`    | Compila el sitio a `./dist/`                    |
| `npm run preview`  | Previsualiza el build antes de desplegar        |

Requiere Node `>=22.12.0`.

## Despliegue

El sitio es estático (`dist/`), así que puede alojarse en cualquier hosting de estáticos (Vercel, Netlify, GitHub Pages, etc.). En Vercel, Astro se autodetecta y no necesita configuración extra.
