---
title: "Descifrar el audio ofuscado de Mini Cozy Room"
date: 2026-07-18
tags: ["ingeniería inversa", "Unity", "XOR", "audio", "assets"]
---

## El objetivo

Extraer todos los objetos (sprites/texturas) y la música del juego *Mini Cozy Room*
(Steam). El motor resultó ser **Unity** (Addressables + URP 2D), así que en principio
era pan comido... hasta que la música no sonaba.

## El síntoma engañoso

La música estaba en `MiniCozyRoom_Data\Resources\Audio\` como **199 ficheros `.dat`**.
Al mirar sus cabeceras, todo parecía normal:

```
49 44 33 03 ...   -> "ID3"  (MP3 con tag ID3v2)
4F 67 67 53 ...   -> "OggS" (Ogg Vorbis)
```

Los copié con la extensión correcta (161 `.mp3`, 38 `.ogg`)... y **no se reproducían**.
La cabecera era válida pero el reproductor no encontraba audio dentro.

## El diagnóstico

Miré los bytes **justo después** de la cabecera. En un MP3 sano, tras el tag ID3
debería empezar un *frame* de audio (`FF Fx ...`). En su lugar había esto, y encima
**repitiéndose cada 16 bytes**:

```
2A 7F 15 88 42 C3 91 6E A5 3D F8 29 B7 14 CC 85   2A 7F 15 88 42 C3 91 6E ...
```

Ese patrón que se repite cada 16 bytes es la firma inconfundible de un **cifrado XOR
con clave repetida corta**. Y lo bonito: aparece en las **zonas de silencio** del audio.

### Por qué el silencio delata la clave

XOR cumple que `X ^ 0 = X`. En una zona de audio en silencio (bytes a `00`), el cifrado
`byte ^ clave` = `00 ^ clave` = **la clave tal cual**. Así que en cuanto hay una racha
de ceros en el original, el fichero cifrado **escribe la clave en claro, una y otra vez**.
No hace falta romper nada: el propio archivo te la enseña.

De ahí salió la clave de 16 bytes:

```
Clave XOR = 2A7F158842C3916EA53DF829B714CC85
```

### El detalle de la cabecera "en claro"

Un matiz importante: **los primeros 16 bytes del archivo NO están cifrados**. Por eso
la cabecera `ID3`/`OggS` se leía perfectamente y me hizo creer que el fichero estaba
sano. El cifrado empieza en el **offset 16**. Es un truco de ofuscación barato: dejar la
cabecera visible para que las herramientas identifiquen el formato, pero corromper el
contenido.

## La solución

Descifrar es simétrico: aplicar el mismo XOR deshace el cifrado.

```python
KEY = bytes.fromhex("2A7F158842C3916EA53DF829B714CC85")
for i in range(16, len(data)):     # los primeros 16 bytes se dejan intactos
    data[i] ^= KEY[i % 16]
```

Lo apliqué a los 199 ficheros y **verifiqué dos veces**:

1. **Estructural:** busqué que aparecieran *frames* MP3 válidos (`FF Fx`) y páginas
   `OggS` + `vorbis` dentro del descifrado. Los 199 pasaron.
2. **Con `ffprobe`:** ahora reconoce formato y duración correctos
   (p. ej. *Cloud Nine* 2:15, *Beach.ogg* 2:54).

## Cómo recuperar la clave sin conocerla (y la trampa en la que caí)

Mi primera idea para automatizarlo fue: *"agrupa los bytes por posición módulo 16 y
coge el más frecuente de cada columna"*. **Estaba mal.** El audio MP3 tiene sus propios
bytes dominantes (0x55, 0xFF), que ganan la votación y devuelven `clave XOR 0x55` en vez
de la clave. Los primeros 12 bytes salían bien pero **los últimos 4 salían corruptos** —
y lo peor: el fichero *parecía* válido (la cabecera y algún frame MP3 colaban), pero cada
16º byte estaba mal. Silenciosamente roto.

Lo que sí funciona: en las zonas de silencio la clave se repite como un **bloque idéntico
muchas veces seguidas**, así que busco el **bloque de 16 bytes cuyo tramo idéntico-
consecutivo es más largo**. Aun así, como no todo silencio es de ceros (puede ser 0x55),
saco varios candidatos y hago **consenso entre todos los ficheros** (comparten una sola
clave) y, sobre todo, **verifico en serio** (ver siguiente sección). El script de la skill
`unity-xor-audio-decrypt` recupera así la clave exacta por consenso: 44 de los 199 ficheros
la reproducen solos, y gana por mayoría.

## Verificar de verdad (no fiarse de la cabecera)

Aquí estuvo la lección grande. Tuve **dos verificaciones falsas** antes de estar seguro:

1. *"Tiene cabecera ID3 válida"* → falso positivo: la cabecera va en claro, siempre parece
   sana.
2. *"Encuentro un frame MP3 (`FF Fx`)"* → falso positivo: aparece por casualidad aunque la
   cola de la clave esté mal.

Las dos pruebas que **sí** son fiables:

- **Zona de relleno del tag ID3 → ceros.** Con la clave correcta, el padding del tag
  descifra a `00` absolutos. Comparé las dos claves candidatas en un fichero: la buena dejó
  **0 de 700 bytes** distintos de cero en esa zona; la mala, **132**. Sentencia inmediata.
- **Encadenar los frames MP3 de punta a punta.** Frame → longitud → siguiente frame, hasta
  el final. Una clave con la cola mal corrompe ~3 de cada 16 bytes y **rompe la cadena**
  enseguida. Solo la clave correcta llega al final.
- **Prueba final con ffmpeg**, que decodifica el audio completo (no solo lee metadatos como
  ffprobe):

  ```
  ffmpeg -v error -i pista.mp3 -f null -      # 0 líneas de salida = perfecto
  ```

  Pasé los **199 ficheros** por aquí: **199/199 decodifican sin un solo error**. Ahí quedó
  confirmada la clave byte a byte.

## Resultado final

- **Música:** 199 pistas descifradas en `Downloads\MiniCozyRoom_Extract\Musica`.
- **Sprites:** 26.575 PNG en `...\Sprites`.
- **Texturas:** 1.642 PNG en `...\Texturas`.
- **Clave guardada** en memoria y skill para no volver a derivarla.

## Lecciones

- "Cabecera válida pero no reproduce" ≈ **contenido cifrado con cabecera intacta**.
  No te fíes solo del *magic number*.
- Un **patrón que se repite con periodo fijo** en datos que deberían ser aleatorios
  (audio comprimido) grita "XOR de clave corta".
- El **silencio es tu amigo**: en XOR, los ceros del original te regalan la clave.
