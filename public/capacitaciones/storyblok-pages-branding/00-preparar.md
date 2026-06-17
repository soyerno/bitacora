# 00 · Prepará a Claude (una vez)

> Antes de armar tu primera página dejás a Claude **conectado a Storyblok** y con las **herramientas MODO** puestas. Es un setup de una sola vez — después todo es pedirle en lenguaje normal. Si algún paso te traba, pedile a tu equipo técnico que te lo deje enchufado: con los datos a mano son 5 minutos.

## Lo que vas a dejar listo

1. **Claude** abierto en tu compu.
2. Tu **llave de Storyblok** (un token).
3. La **conexión Claude ↔ Storyblok** (el “MCP”).
4. Las **herramientas MODO** (skills) que Claude usa.

## 1 · Claude

Tené **Claude Code** instalado y abierto. Si no lo tenés, pedí que te lo instalen — es la app desde la que vas a dirigir todo.

## 2 · Tu llave de Storyblok (token)

Claude necesita permiso para crear y actualizar páginas en Storyblok. Ese permiso es un **token** que generás una vez:

1. Entrá a **Storyblok** con tu cuenta.
2. Arriba a la derecha: tu avatar → **My Account** → **Personal access tokens**.
3. **Generá un token nuevo**, ponele un nombre (ej. “Claude”) y **copialo** y guardalo (no se vuelve a mostrar).
4. Pedile al equipo el **Space ID**: el número del espacio donde viven las páginas de modo.com.ar.

> El token es una llave: no lo compartas ni lo pegues en chats públicos. Si se filtra, generás otro y listo.

## 3 · Conectá Storyblok a Claude (el MCP)

El **MCP** es el “cable” que enchufa a Claude con Storyblok para que pueda crear y actualizar páginas por vos. Se instala una vez, con el **token** y el **Space ID** del paso 2:

- En Claude Code se agrega como un servidor MCP de Storyblok (queda guardado en la config de Claude).
- **Si es tu primera vez, pedile a tu equipo técnico que lo conecte con vos**: le pasás el token y el Space ID y lo dejan andando en minutos.

Sabés que quedó bien cuando le pedís a Claude “mostrame las páginas del espacio” y te las lista.

## 4 · Las herramientas MODO

Para que todo salga on-brand y pase los controles, Claude usa unas **skills** MODO. Dejá activas en tu Claude:

- **`modo-storyblok`** — el que habla con Storyblok (crea y actualiza páginas).
- **`modo-design-system`** — la marca MODO (colores, tipografías, tono).
- Las skills de **calidad** (los 4 controles de la lección 04).

Si no sabés si están, preguntale a Claude “¿qué skills MODO tenés activas?” o pedí que te las dejen puestas.

## Checklist de salida

- [ ] Claude Code abierto
- [ ] Token de Storyblok generado y guardado
- [ ] Space ID a mano
- [ ] MCP de Storyblok conectado (Claude lista las páginas)
- [ ] Skills MODO activas (`modo-storyblok`, `modo-design-system`, calidad)

> Esto se hace **una vez**, no se repite. Listo esto, ya podés armar. Siguiente: [01 · Tu material de trabajo](#01)
