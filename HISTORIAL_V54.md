# Iteración V5.4 — alternativa discreta por caso de estudio

La V5.3 se conserva y se añade únicamente al home un botón desplegable **«Casos de estudio»** en el extremo derecho de la cabecera. Tiene un tratamiento editorial pequeño y subordinado a la exploración principal de fotografías flotantes.

## Comportamiento

- Al abrir el selector se muestran **Provincia de Petorca** (caso disponible), **Valle del Elqui** y **Archipiélago de Chiloé** (ambos casos simulados).
- Elegir un territorio agrupa las fotografías que le pertenecen mediante la **misma animación** que ya existía para el clic sobre las obras.
- Al elegir un *caso*, aún **no hay obra elegida**: el panel muestra una fotografía de vista previa sin indicador de selección y explica que puede escogerse una pieza en el mapa. Si el caso es Petorca, su botón «Ingresar al mapa de Petorca» abre el **mapa general**, sin preseleccionar una obra.
- Al escoger directamente una *fotografía*, se conserva el comportamiento previo: marca la obra elegida en la agrupación y al ingresar al mapa la mantiene como punto de partida.
- Elqui y Chiloé nunca conducen a mapas inexistentes; muestran que son casos demostrativos.
- El selector funciona con ratón, toque y teclado. Se cierra al elegir una opción, al hacer clic fuera o al pulsar Escape.

## Sin cambios

Se conservan las 15 obras y sus fotografías demostrativas de Petorca, las 5 fotografías de cada territorio simulado, la selección aleatoria de 12 imágenes en el home móvil, el mapa, las fichas, las relaciones y los estados alternativos del Blueprint V5.

## Pruebas

- `npm test`: validez de los datos y del nuevo selector.
- Pruebas automatizadas de navegador para 1440×900, 1200×700, 390×844 y 360×740: abrir selector, elegir Petorca, entrar al mapa, volver a seleccionar una obra desde fotografías, conservar la selección, simular Elqui sin mapa y comprobar ausencia de errores JavaScript.
