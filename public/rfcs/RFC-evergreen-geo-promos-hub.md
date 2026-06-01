# RFC · Resolver evergreen y presencia en buscadores con IA usando promos-hub

- **ID**: R21
- **Estado**: draft
- **Fecha**: 2026-05-28
- **Autor**: Hernán De Souza · Sr AI Engineer
- **Audiencia primaria**: Product Owners, Product Managers, Marketing, SEO. Equipo técnico secundario.
- **Equipos que opinan antes de avanzar**: PM Producto, PM Marketing, SEO lead, TL frontend promos-hub, TL frontend modo-landing.
- **Decisión que destraba**: ¿dónde y cómo resolvemos hoy el dolor de evergreen + presencia en buscadores con IA — esperando un track de plataforma o aprovechando lo que ya tenemos en promos-hub?

---

## TLDR

**Tenemos un problema medido en Google Search Console que cuesta miles de clicks mensuales.** Cada mes Marketing arma URLs nuevas con slug versionado (`coto-mar26`, `combustible-bna-oct25`, `changomas-ene26`). Las URLs capturan tráfico fuerte mientras viven, y cuando el slug rota mueren. **5 URLs estacionales que en enero 2026 sumaban 18.664 clicks/mes hoy generan exactamente 0.** Toda la reputación que esas páginas acumularon en Google se evaporó al rotar el calendario.

A la vez, los datos de GSC muestran **~2.700 clicks/mes** de gente que busca "modo coto", "modo farmacity", "modo havanna" — intent por comercio puntual todo el año, no solo en eventos. Esos clicks aterrizan hoy en una página índice con CTR 0,67% y se pierden. La demanda existe. Lo que falta es el destino que la reciba.

**La propuesta** es construir, una sola vez, **páginas por comercio que sobrevivan a la rotación de slug y que reciban tanto el intent evergreen como el tráfico de las landings estacionales cuando estas mueran**. Se construye en promos-hub (que ya está en producción), captura ~60-70% del impacto que tendría un track de plataforma completo, en **~7 días de desarrollo con IA** y sin coordinación cross-team.

**Proyección conservadora a 90 días**: capturar ~7.500 clicks/mes que hoy se pierden o se aterrizan en páginas pobres, consolidados en URLs evergreen que acumulan reputación año a año en lugar de evaporarse.

**El trade-off**: las páginas viven bajo `modo.com.ar/promos/comercio/<nombre>` en vez de `modo.com.ar/comercio/<nombre>` (un nivel de URL más profundo). Estimamos ~10-15% de ranking versus top-level. Si en seis meses consolidamos en `/comercio/` puro, una redirección permanente preserva la reputación acumulada.

---

## Contexto

### Dónde estamos hoy

MODO tiene dos surfaces principales que el usuario externo encuentra desde Google:

1. **Landings estacionales** — Hot Sale, Cyber Monday, Día de la Madre, Día del Padre, Navidad, Black Friday. Las arma el equipo de Marketing en Storyblok para cada edición. Capturan tráfico fuerte durante 7 días del evento.
2. **Páginas de promo individual** — cada promo tiene su URL en `modo.com.ar/promos/<slug>`. Las maneja promos-hub-site (el repo Next 15 ya en producción).

Hay una tercera capa que falta: **páginas por comercio** que vivan todo el año. Hoy no existen como URL canónica.

### Qué estamos resolviendo · en una frase

**Cada mes Marketing arma URLs nuevas con slug versionado (`coto-mar26`, `changomas-mar26`, `combustible-bna-oct25`), las URLs capturan tráfico fuerte por unas semanas, y cuando el slug rota al mes siguiente la URL muere y todo el tráfico se evapora.** Más una segunda capa: la gente busca "modo coto", "modo farmacity", "modo havanna" todo el año, no solo durante eventos, y hoy no hay página que reciba ese intent. La propuesta es construir, por una sola vez, la URL que sobrevive a la rotación.

### Tres dolores concretos · todos verificados en Google Search Console (mayo 2026)

**Dolor 1 · Las URLs estacionales mueren cada pocos meses y se llevan miles de clicks a la tumba.**

Esto no es teoría. Comparo dos períodos reales de la misma propiedad `modo.com.ar`:

| URL estacional | Clicks enero 2026 | Clicks mayo 2026 | Diferencia |
|---|---:|---:|---:|
| `/promos-banco/30off-combustible-bna-oct25` | **9.357** | **0** | **−9.357 (−100%)** |
| `/promos-banco/supermayoristavital-oct25` | 5.212 | 0 | −5.212 (−100%) |
| `/promos-banco/100off-transporte-bna-oct25` | 1.768 | 0 | −1.768 (−100%) |
| `/promos-banco/30off-mcdonalds-bahiablanca-bna-oct25` | 1.267 | 0 | −1.267 (−100%) |
| `/promos-banco?ids=macro` | 1.060 | 0 | −1.060 (−100%) |
| **Total clicks perdidos por slug rotation** | **18.664** | **0** | **−18.664/mes** |

Cinco URLs que en enero juntaban casi **19.000 clicks al mes** hoy generan cero. Murieron porque el slug rotó (octubre 2025 → noviembre 2025 → diciembre 2025 → fin de la promoción). Marketing armó URLs reemplazo en los meses siguientes (`combustible-bna-mar26`, `combustible-ciudad-ene25`, `transportevqr-mar26`, etc.) pero cada una arranca de cero en Google: la reputación de octubre **no se transfiere**, se pierde.

**Dolor 2 · El intent por comercio existe y mide miles, no cientos.**

Los datos reales de Google Search Console — últimos 28 días, cierre 2026-05-28 — muestran que la demanda por "MODO + nombre de comercio" es masiva:

| Búsqueda | Clicks 28d | CTR | Posición |
|---|---:|---:|---:|
| "coto modo" | 283 | 37,7% | 1,9 |
| "havanna promociones bancarias" | 250 | 13,5% | 4,5 |
| "modo coto" | 195 | 26,0% | 1,6 |
| "modo farmacity" | 148 | 25,1% | 1,8 |
| "disco promociones bancarias" | 132 | 7,2% | 4,5 |
| "rapanui promociones bancarias" | 114 | 15,8% | 1,7 |
| "modo fravega" | 99 | 32,9% | 1,3 |
| "modo carrefour" | 98 | 18,9% | 1,3 |
| "modo disco" | 97 | 40,4% | 1,8 |
| "disco modo" | 94 | 53,1% | 1,5 |
| "modo la anonima" | 93 | 43,9% | 1,6 |
| "havanna promociones bancarias 2026" | 90 | 21,2% | 2,2 |
| "jumbo modo" | 85 | 34,6% | 1,4 |
| "modo jumbo" | 82 | 30,3% | 1,3 |
| "modo galicia" | 80 | 25,2% | 2,4 |
| "modo changomas" | 75 | 39,1% | 1,6 |
| "carrefour modo" | 75 | 18,4% | 1,4 |
| "modo sporting" | 74 | 26,7% | 1,6 |
| Otros 40+ queries del mismo tipo | ~700 | promedio 20-30% | 1,5-3,0 |
| **Total queries "MODO + comercio"** | **~2.700** | — | — |

**~2.700 clicks/mes** entrando por intent merchant evergreen. Hoy aterrizan en la página índice `/comercios` (CTR 0,67%, posición 2,6 — Google la muestra pero el usuario no clickea porque el contenido es genérico) o se pierden contra resultados que no son nuestros. La demanda ya existe en plata.

**Dolor 3 · Hay URLs estacionales que Google sigue mostrando aunque la promo se haya vencido.**

`/promos/changomas-ene26` (Changomás enero 2026) tiene hoy, en mayo 2026, **96.743 impressions/mes** en Google — la página aparece en el resultado de búsqueda. Pero el contenido es de enero y la promo está vencida hace meses. El usuario que clickea encuentra contenido vencido y se va. Resultado: **CTR 0,44%** (muy malo) y **96.743 oportunidades de impresión desperdiciadas** que rompen confianza en MODO como fuente.

### Ejemplo concreto · el caso Changomás

Para que el dolor se vea sin tablas, este es el patrón con un comercio puntual.

**Lo que pasa hoy con Changomás en Google**, según GSC últimos 28 días:

| URL | Clicks 28d | Impressions | CTR | Posición | Estado |
|---|---:|---:|---:|---:|---|
| `/promos/changomas-mar26` | 995 | 70.665 | 1,41% | 6,5 | promo activa (muere fin de marzo) |
| `/promos/changomas-ene26` | 426 | 96.743 | 0,44% | 7,0 | **vencida** desde febrero, sigue indexada |
| Query "modo changomas" (intent evergreen) | 75 | 192 | 39,1% | 1,6 | aterriza en cualquiera de las dos de arriba |
| Query "changomas" (no-brand MODO) | 314 | 110.734 | 0,28% | 7,1 | aterriza en URL vencida — usuario no clickea |

Cuento la historia:

1. Marketing arma `/promos/changomas-mar26` para la promoción de marzo. Captura 995 clicks en su mes.
2. Marketing arma `/promos/changomas-ene26` para enero. Capturó algo similar en su momento. Hoy (mayo) sigue indexada pero muerta: 96.743 impressions sin contenido relevante.
3. La query "modo changomas" tiene 75 clicks/mes con CTR 39% (intent fuerte, demanda real) pero aterriza en dos URLs que mueren cada pocos meses, **nunca se acumula nada**.
4. En enero 2027, Marketing armará `/promos/changomas-ene27`. Empezará de cero. La autoridad de las versiones 2026 se perdió.

**Con la propuesta**: existe `/promos/comercio/changomas` que vive todo el año. Captura los 75 clicks/mes de intent evergreen. Lista la promoción activa cuando hay (con su vigencia visible). Cuando la promo de marzo termina, se reemplaza por la próxima sin que la URL muera. Año a año, las 12 ediciones suman reputación sobre la **misma URL**. Backlinks de notas de prensa, newsletters y blogs apuntan al mismo lugar.

**Proyección conservadora**: si solo capturamos el 70% de los 2.700 clicks/mes de intent merchant evergreen + el 30% de los ~19.000 clicks/mes que hoy se evaporan por slug rotation (mediante 301 desde las URLs versionadas al evergreen correspondiente), el delta mensual de tráfico capturado es del orden de **~7.500 clicks/mes** consolidados en URLs evergreen que acumulan reputación. La cifra exacta sale del análisis por comercio una vez definido el top 100.

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

| Indicador | Hoy (GSC mayo 2026, 28d) | Objetivo a 90 días |
|---|---|---|
| Clicks mensuales en queries "MODO + nombre de comercio" capturados por URL específica | ~2.700 fragmentados en página índice + URLs estacionales | 1.800-2.200 capturados en páginas de comercio (≥70% recuperación) |
| Clicks recuperados de URLs versionadas que hoy mueren (vía 301 a URL evergreen) | 0 (se evaporan al rotar slug) | 5.000-6.000 consolidados |
| URLs de comercio indexadas en Google | 0 | 100+ |
| Resultado enriquecido con logo/promos en SERP | 0% | 100% de las URLs publicadas |
| Citación por buscadores IA (Perplexity sample 50 prompts/sem) | Baseline a establecer en sprint 1 | +15 puntos porcentuales absolutos sobre baseline |
| Clicks totales mensuales consolidados en URLs evergreen | 0 | ~7.500 |

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
