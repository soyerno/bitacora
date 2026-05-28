# RFC · Resolver evergreen y presencia en buscadores con IA usando promos-hub

- **ID**: R21
- **Estado**: draft
- **Fecha**: 2026-05-28
- **Autor**: Hernán De Souza · Sr AI Engineer
- **Audiencia primaria**: Product Owners, Product Managers, Marketing, SEO. Equipo técnico secundario.
- **Equipos que opinan antes de avanzar**: PM Producto, PM Marketing, SEO lead, TL frontend promos-hub, TL frontend modo-landing.
- **Decisión que destraba**: ¿dónde y cómo resolvemos hoy el dolor de evergreen + presencia en buscadores con IA — esperando un track de plataforma o aprovechando lo que ya tenemos en promos-hub?

---

## Resumen para los apurados

Hoy las páginas de MODO que más tráfico capturan son las landings estacionales (Hot Sale, Cyber Monday, Navidad). El cliente entra, mira la promo del mes, y la página muere a fin de mes cuando rota el calendario. Cada vez que esto pasa, tiramos a la basura la reputación que esa página acumuló en Google y en ChatGPT/Perplexity/Claude. **Plata gastada en autoridad, que en lugar de capitalizarse, se evapora.**

A la vez, hay una segunda capa de búsquedas que no estamos atendiendo: cuando el cliente busca "MODO en Coto", "MODO en Farmacity", "MODO en Changomás" — sin importar si hay un Hot Sale o no. Eso son **~500 clicks mensuales en queries por nombre de comercio** que hoy aterrizan en una página índice sin contenido específico y se pierden.

**La propuesta** es resolver las dos cosas usando **promos-hub** (que ya está en producción y nos ahorra meses de coordinación cross-team), con una capa nueva de páginas por comercio que sobrevivan a las promociones puntuales. Esfuerzo estimado: **~7 días de desarrollo con IA**. Captura ~60-70% del impacto que tendría hacerlo como track de plataforma desde cero, sin esperar trimestres.

**El trade-off**: las páginas viven bajo `modo.com.ar/promos/comercio/<nombre>` en vez de `modo.com.ar/comercio/<nombre>` (un nivel de URL más profundo). Estimamos que eso cuesta ~10-15% de ranking versus la versión top-level. Si en seis meses queremos consolidar todo en `/comercio/` puro, hay una redirección permanente que preserva la reputación acumulada.

---

## Contexto

### Dónde estamos hoy

MODO tiene dos surfaces principales que el usuario externo encuentra desde Google:

1. **Landings estacionales** — Hot Sale, Cyber Monday, Día de la Madre, Día del Padre, Navidad, Black Friday. Las arma el equipo de Marketing en Storyblok para cada edición. Capturan tráfico fuerte durante 7 días del evento.
2. **Páginas de promo individual** — cada promo tiene su URL en `modo.com.ar/promos/<slug>`. Las maneja promos-hub-site (el repo Next 15 ya en producción).

Hay una tercera capa que falta: **páginas por comercio** que vivan todo el año. Hoy no existen como URL canónica.

### Dos dolores concretos que están medidos en Google Search Console

**Dolor 1 · La autoridad estacional se evapora cada mes.**

Cuando termina una edición de Hot Sale 2026, la URL `modo.com.ar/hotsale-2026` que durante una semana fue la más visible de MODO en Google deja de tener contenido relevante. Marketing arma una landing nueva el año siguiente con slug `hotsale-2027`, y Google la trata como una página nueva sin historia. **La reputación acumulada en 2026 no se transfiere a 2027.** Lo mismo aplica a Cyber Monday, Navidad y todas las temáticas.

**Dolor 2 · El intent por comercio puntual no se captura.**

Los 28 días de mayo 2026 muestran este patrón:

| Búsqueda | Clicks/mes | CTR | Posición |
|---|---:|---:|---:|
| "modo coto" | 215 | 26% | 2.1 |
| "modo farmacity" | 148 | 25% | 2.4 |
| "modo carrefour" | 105 | 19% | 3.0 |
| "modo changomas" | 70 | 22% | 2.6 |
| ... (otros 30+ queries similares) | ~200 | ~20% | 2-4 |

Total estimado: **~500 clicks/mes** de gente que busca "MODO + nombre de comercio" — fuera de evento estacional. Hoy aterrizan en `/comercios` (página índice con CTR 0.72%, posición 6.2) o se pierden porque no hay página específica del comercio. **Estos clicks ya están sucediendo. La demanda existe. Lo que falta es el destino.**

### Por qué importa más que nunca

A los problemas de Google se suma un escenario nuevo: las búsquedas con IA. ChatGPT, Claude, Perplexity y Gemini están capturando una parte creciente de las búsquedas que antes iban a Google. Cuando un cliente pregunta "¿qué descuentos hay con MODO en Coto?", el modelo necesita una página estable, citable, con información estructurada para mencionar a MODO como fuente confiable. Si nuestra única URL relevante muere cada mes con la promoción, el modelo termina citando o (peor) inventando datos.

Esta tendencia se llama **GEO** (Generative Engine Optimization) y está ganando tracción en marketing digital. Es la disciplina hermana del SEO clásico de Google, aplicada a buscadores con IA. Las marcas que llegan primero capitalizan ventaja durable porque los modelos memorizan a quién citaron primero.

---

## La propuesta · qué construimos

Construir una capa nueva en promos-hub-site con **páginas evergreen por comercio**. Cada comercio adherido a MODO con presencia relevante (top 100 inicial, escalable) tiene su propia URL estable, con tres ingredientes que hoy no existen:

### 1. URL canónica por comercio que vive todo el año

Cada comercio tiene una URL que **no rota con las promociones**. Si Changomás participa en Hot Sale 2026, Cyber Monday 2026 y Navidad 2026, los tres se reflejan dentro de la misma página `modo.com.ar/promos/comercio/changomas`. Cuando termine cada evento, la promo desaparece del contenido visible pero la página sigue viva con el resto del historial.

Beneficio para el negocio: la reputación que la página acumula en Google y en buscadores IA es **acumulativa**. Diez ediciones de Hot Sale en la misma URL pesan más que diez URLs distintas. Los backlinks externos (notas de prensa, blogs de finanzas personales, newsletters) apuntan siempre al mismo lugar.

### 2. Ficha estructurada para Google y para IA

Cada página de comercio publica una ficha técnica oculta al usuario (la lee Google y la leen los modelos de IA) que describe el comercio como entidad: nombre, logo, sitio oficial, rubro, bancos que ofrecen promo, descuentos vigentes con sus vigencias.

Esto desbloquea dos cosas:

- **Resultado enriquecido en Google** — la página aparece con logo, descripción y promos visibles directo en el resultado de búsqueda, no como un link de texto plano.
- **Citación por buscadores IA** — ChatGPT y Perplexity prefieren citar páginas con ficha estructurada porque les baja el riesgo de "alucinar" datos.

### 3. Cruce con las landings estacionales

Las landings de evento (Hot Sale, Cyber Monday, etc.) listan los comercios participantes en cards con link directo a la página de cada comercio. Esto cumple dos roles:

- El cliente que entró por "Hot Sale" puede navegar al comercio que le interesa con un clic y consultar el detalle.
- La reputación que la landing temática acumuló durante la semana del evento **se reparte** a las páginas de comercio que linkeó, en lugar de evaporarse cuando termina el evento.

---

## Por qué promos-hub y no esperar un track de plataforma

Una alternativa razonable es esperar que el track de plataforma "Base de Comercios" termine el catálogo canonical de los 300.000+ comercios de MODO, y armar todo esto en modo-landing como track separado. Es la opción técnica más limpia, pero tiene tres contras serias hoy:

1. **Tiempo a producción** · el track de plataforma tiene compromisos de Q2-Q3 ya cargados y no es realista pedirle que priorice este caso de uso en el calendario actual.
2. **Coordinación** · armarlo en modo-landing requiere alineación con los equipos de comercios, stores-api, base de comercios. Cada coord cuesta semanas.
3. **Promos-hub ya está en producción** · es Next 15 (versión moderna de Next.js), tiene la mejor infra técnica para SEO de los tres frontends, ya tiene infraestructura de ficha estructurada para promociones que solo hay que extender, ya alimenta su sitemap desde el backend que conoce qué comercios participan.

**El costo de oportunidad de esperar es alto**: cada Hot Sale, cada Cyber Monday, cada Navidad que pasamos sin esto deja autoridad sin capitalizar y queries sin atender. La opción promos-hub captura ~60-70% del impacto que tendría la opción modo-landing en una fracción del tiempo y sin coord externa.

---

## Qué hace falta modificar

Siete cambios concretos, todos dentro de promos-hub-site:

| # | Cambio | Qué resuelve |
|---|---|---|
| 1 | Crear página nueva por comercio (URL evergreen) | Dolor 2 · captura intent por comercio |
| 2 | Extender la ficha estructurada para que describa comercios, no solo promos | Resultado enriquecido Google + citación IA |
| 3 | Conectar las promos activas con la página de comercio (cross-link estructural) | Dolor 1 · la reputación de la landing temática se reparte |
| 4 | Sumar las URLs de comercio al sitemap (lista que Google y los crawlers de IA leen) | Crawlers descubren las páginas nuevas |
| 5 | Marcar cada página de comercio como "URL canónica" para que Google entienda que es la página fuente | Evitar que el ranking se diluya entre URLs duplicadas |
| 6 | Hacer que el contenido se renderice del lado del servidor (hoy una parte se renderiza en el navegador y Google no la ve) | Sin esto, el resto de las mejoras no llegan a Google |
| 7 | Sumar el metadato de cada comercio (título, descripción, imagen para compartir) | Posicionamiento en buscadores y cómo se previsualiza la página en redes |

**Estimación de esfuerzo**: ~7 días de desarrollo con asistencia de IA (Claude Code + skills MODO). Un único desarrollador puede llevarlo end-to-end. No requiere coordinación con otros equipos.

---

## Lo que NO resolvemos en esta fase

Honesty up-front, para no over-prometer:

| Capacidad | Estado |
|---|---|
| Mapa "MODO cerca de mí" + Local Pack de Google | **No** · requiere datos de sucursales con coordenadas, que vive en un track aparte (Base de Comercios) |
| Catálogo completo de 300.000+ comercios | **No** · arranca con top 100 escalable a top 500 |
| Contenido editorial premium por comercio (descripciones largas custom, FAQs específicas) | **Parcial** · usa el contenido del backend de promos; sin CMS overlay nuevo |
| Página de cada sucursal individual | **No** · página por marca, no por sucursal |

Estas capacidades están bloqueadas por el track de plataforma "Base de Comercios" — son parte de su roadmap natural. Lo que armamos en promos-hub **no compite** con ese track; lo **prepara** para que cuando llegue, todo lo que esté en producción se actualiza con datos más ricos sin re-arquitectura.

---

## Trade-off principal · forma de la URL

Esto es la decisión más importante del RFC y la que requiere alineación de Producto + Marketing antes de avanzar.

Con la opción promos-hub, las páginas de comercio viven bajo `modo.com.ar/promos/comercio/<nombre>`. Con la opción modo-landing (track de plataforma), vivirían bajo `modo.com.ar/comercio/<nombre>`. La diferencia es un nivel de URL.

| Forma | Pros | Contras |
|---|---|---|
| `modo.com.ar/promos/comercio/changomas` | Disponible en ~7 días. Sin coord. Reusa infra. | URL ~10-15% menos rankeable que top-level. Asociación semántica con "promo" (algo temporal). |
| `modo.com.ar/comercio/changomas` | URL más corta, más rankeable, semánticamente evergreen pura. | Bloqueada por track de plataforma. Tiempo a prod: trimestres, no semanas. |

**El camino híbrido propuesto**: arrancar con la primera (rápida, en producción) y, cuando el track de plataforma esté listo, migrar con redirección permanente al `/comercio/` top-level. La redirección permanente **transfiere ~95% de la reputación acumulada**, así que no perdemos el esfuerzo de los primeros meses.

Si Producto + Marketing prefieren no comprometerse con la URL larga por riesgo de brand inconsistency, hay una opción intermedia: armar el desarrollo en promos-hub pero no publicar las URLs hasta que se acuerde el path final. Eso pierde el tiempo a producción pero preserva la decisión de URL para más adelante.

---

## Cómo medimos si funcionó

Cuatro indicadores claros, medibles a 90 días de la primera publicación:

| Indicador | Hoy | Objetivo a 90 días |
|---|---|---|
| Clicks mensuales en queries "MODO + nombre de comercio" | ~500 fragmentados en página índice | 1.500-2.000 capturados en páginas de comercio |
| URLs de comercio indexadas en Google | 0 | 100+ |
| Resultado enriquecido con logo/promos en SERP | 0% | 100% de las URLs publicadas |
| Citación por buscadores IA (Perplexity sample 50 prompts/sem) | Baseline a establecer en sprint 1 | +15 puntos porcentuales absolutos sobre baseline |

El cuarto indicador es **exploratorio** — no tenemos baseline previo para citation rate en buscadores con IA y la metodología de medición todavía está en desarrollo. Sería el primer experimento medido de MODO en este frente y nos da datos para todos los próximos.

---

## Riesgos y cómo los mitigamos

Tres riesgos críticos que vale enumerar para que Producto entre con los ojos abiertos:

**1 · Contenido sin actualizar tras un evento.**

Si la página de Hot Sale 2026 queda con "Del 11 al 17 de mayo" visible en julio, rompe la confianza del usuario en cinco segundos. **Mitigación**: el contenido se rota automáticamente cuando vence la fecha — pasa de "promo vigente" a "edición pasada, próxima edición en mayo 2027". No depende de que Marketing entre a editar manualmente.

**2 · Duplicación con páginas viejas.**

Si en algún momento modo-landing también publica páginas de comercio, tendríamos dos URLs para Changomás (una en promos-hub, una en modo-landing). Google penaliza duplicate content. **Mitigación**: redirección permanente de una hacia la otra. La decisión de cuál es la canónica final debe alinearse antes de que ambas estén en producción.

**3 · Penalización por contenido pobre en periodos sin eventos.**

Si una página de Changomás solo muestra "ahora no hay promo activa, esperá el próximo evento" durante 10 meses al año, Google la trata como página de baja calidad. **Mitigación**: la página siempre incluye contenido útil aunque no haya promo activa — descripción del comercio, bancos asociados históricamente, FAQs (Argentina opera con esto), historial de eventos pasados. Es trabajo de copy que se hace una vez por comercio.

---

## Cómo se conecta esto con la estrategia más amplia de MODO

Esta propuesta es la **primera fase pragmática** de la visión más amplia descrita en la investigación técnica [RD04 · Landings temáticas evergreen + canonical hub para SEO/GEO](https://soyernomodo.github.io/erno-modo/rd/promos-hub-seo-geo-bridge.html). Esa investigación describe el destino final con las 7 movidas técnicas completas. Este RFC propone una fase intermedia rápida que captura la mayor parte del valor sin esperar la versión completa.

También complementa los tracks de plataforma "Base de Comercios" (IE-136) y "Modelo de Comercios" (IE-15) que están en el roadmap de Q2-Q3. Cuando esos tracks shipeen su V1, las páginas que armamos en promos-hub absorben los datos más ricos automáticamente (mismo template, datos enriquecidos detrás).

---

## Próximos pasos si avanzamos

Si el RFC se aprueba, los siguientes pasos en orden son:

1. **Alineación de la forma de URL** con Producto + Marketing (~2 días).
2. **Definición del top 100 de comercios** a publicar primero, basado en demanda de Google Search Console (~1 día, dato ya disponible).
3. **Desarrollo** end-to-end (~7 días con IA + 1 desarrollador).
4. **Establecimiento de baseline** de citation rate en buscadores con IA, antes del primer push a producción (~2 días).
5. **Publicación inicial** a producción con los primeros 50 comercios.
6. **Medición a 30, 60 y 90 días** contra los indicadores definidos.
7. **Decisión de continuar** a top 500 o iterar el approach según resultados.

Total a primera publicación: **~3 semanas** desde la aprobación.

---

## Lo que necesito de Producto para avanzar

Tres decisiones, todas tomables en una reunión de 45 minutos:

1. **¿Avanzamos con la URL `modo.com.ar/promos/comercio/<nombre>` o esperamos a tener el path top-level?** La recomendación es avanzar, con redirección permanente prevista para el futuro.
2. **¿Cuál es el top 100 de comercios a priorizar?** Recomendación: arrancar con la lista que ya tiene mayor demanda en GSC (Coto, Farmacity, Carrefour, Changomás, Disco, Vea, La Anónima, Frávega, Havanna, Sporting, los siguientes 90 por demanda).
3. **¿Está OK que el equipo de Marketing siga armando las landings temáticas como lo hace hoy, o cambiamos el flow editorial?** Recomendación: no cambiar nada en el corto plazo, solo agregar dos campos (vigencia + comercios participantes) al flow Storyblok actual.

Aguardo feedback antes de avanzar al openspec change.

---

## Estado y próxima revisión

- Próxima revisión propuesta: **2026-06-04** (una semana desde hoy).
- Si en esta revisión el RFC pasa a `completo`, abrimos el openspec change `promos-hub-comercios-evergreen-v1` y arrancamos desarrollo en branch dedicado.
- Si quedan abiertos puntos, iteramos esta misma página y volvemos a sentarnos.
