# Iteración V5.11 · Mapa y exploración territorial acompañada

## Decisiones implementadas

- **Home V5.10 cerrado:** conserva su composición, catálogo animado, selección y confirmación territorial. Solamente cambia la etiqueta de versión en la cabecera.
- **Mapa persistente** con panel de información de aproximadamente 35 % de ancho en escritorio.
- **Geometrías:** círculos para obras, rombos para creadores, triángulos para encuentros; halo sutil en las obras y selección destacada.
- **Oficios:** filtros superiores multiselección con ocho colores y nombre del oficio. Obras multioficio permanecen visibles cuando está activo alguno de sus oficios.
- **Cinco comunas:** control inferior de enfoque territorial (La Ligua, Cabildo, Petorca, Papudo y Zapallar), además de la vista provincial. Papudo puede mostrarse sin registros ficticios.
- **Zoom:** rueda, botones, arrastre y pellizco móvil; marcadores con contraescala para mantener tamaño legible. Se agrupan puntos próximos a escalas generales cuando no forman parte de una relación seleccionada.
- **Relaciones:** líneas desde una obra hacia su creador, obras relacionadas y encuentros explícitamente asociados. Botón para enfocar toda la red. No se trazan coordenadas artificiales para materiales y oficios.
- **Panel acompañado:** síntesis → contexto → proceso → relaciones → acercamiento, con avance contextual, posibilidad de navegar de forma no lineal y botón visible «Cómo acercarme a este oficio» desde la selección.
- **Móvil:** mapa superior y panel inferior expandible con un gesto/toque, filtros desplazables y acción de acercamiento accesible.
- **Estados:** carga, error/reintento, sin registros en filtros, sin experiencias y continuidad hacia detalle de experiencia.

## Limitaciones declaradas

No se introdujeron Mapbox, librerías remotas ni backend. La base de relieve preexistente es una **ilustración cartográfica referencial**, no un mapa geográfico verificable. Obras, personas, vínculos, fechas y coordenadas de demostración siguen siendo ficticios. Las experiencias no ofrecen inscripción ni contacto real.

## Validación

`npm test` comprueba integridad de los datos y simula la secuencia completa de interacciones desde el home hasta una experiencia, los filtros, comunas, vuelta atrás y estado sin encuentros. **No se ha completado una inspección visual real en navegador** en el entorno de generación; recomendamos revisar escritorio/móvil en Visual Studio Code.
