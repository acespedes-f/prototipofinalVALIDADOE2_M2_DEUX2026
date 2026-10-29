# Atlas de los Oficios · Prototipo funcional V5.18

Un atlas interactivo de artesanía chilena. **En esta versión el home V5.10 permanece cerrado** y se rediseñan el mapa de la Provincia de Petorca y el recorrido posterior a confirmar una obra.

## Ejecutar en Visual Studio Code

1. Descomprime el archivo ZIP y abre la carpeta `atlas-oficios-v518` en Visual Studio Code.
2. Necesitas **Node.js 18 o superior**. No hay dependencias para instalar.
3. Abre la terminal y ejecuta `npm run dev`.
4. Entra en **http://localhost:5173/**.
5. Para verificar los datos y el flujo, ejecuta `npm test`.

## Cómo recorrer la V5.18

**Entrada desde una obra:** selecciona una fotografía de Petorca en el home, confirma «Ingresar al mapa de Petorca» y localiza su círculo destacado en rojo. El recorrido sugerido es **Obra → Creador/a → Proceso → Encuentro → Vínculos**. El usuario puede saltar entre pasos sin perder la obra de origen. El botón «¿Te interesa esta obra o su oficio?» conduce a encuentros y otras formas de vinculación. En cualquier estado el mapa permanece visible.

**Entrada por caso:** selecciona «Casos de estudio» → «Provincia de Petorca» en el home; entra al mapa general y elige una obra mediante los círculos o la lista del panel.

**Relaciones:** la barra izquierda orienta el mapa: Obra destaca el círculo original; Creador/a encuadra la obra y sus autoras, así como sus agrupaciones, utilizando **líneas sólidas para coautoría y discontinuas para pertenencia**; Proceso activa sobre el mapa una **capa interpretativa interactiva de materia, técnica y resultado**, sincronizada con el panel, sin crear nuevos puntos geográficos; Encuentro destaca triángulos de experiencias vinculadas o presenta alternativas si no existen; finalmente Vínculos despliega la red de obras, personas y encuentros, con una acción final para descubrir nuevas obras. La leyenda SVG con las tres figuras está en el navbar tanto en desktop como en móvil.

**Filtros y navegación:** en la parte superior puedes activar/desactivar uno o varios oficios con colores diferenciados. En la parte inferior elige la comuna. Los controles laterales permiten acercar, alejar, restaurar y enfocar relaciones; también funcionan arrastrar el mapa, la rueda del ratón y el gesto de pellizco.

**Móvil:** toca «Ver oficios» para abrir/cerrar filtros sin recortar botones. Usa «Ampliar información» para disponer de más espacio de lectura. El panel tiene desplazamiento vertical interno y la acción de acercamiento permanece visible. El mapa sigue accesible, sin desplazamiento residual de toda la página.

## Casos de prueba

- **Caso de coautoría (principal):** «Cesto de fibras de Pullalli» → Creador/a: Elena Morales y Julia Orellana, integrantes del Colectivo Tramas del Valle → seleccionar persona o agrupación en el mapa → Proceso: tocar Materia, Técnica y Resultado → Encuentro → Vínculos → descubrir otras obras.
- **Autoría individual con pertenencia colectiva:** «Canasta de palma» → Creador/a: Elena Morales → su agrupación aparece como vínculo de pertenencia, no como coautora de la obra.
- **Sin experiencias:** «Colgante de cobre grabado» → Encuentro → estado sin actividades → Vínculos → continuar explorando el atlas.
- **Zona sin registros:** selecciona **Papudo**, observa que el listado de obras queda vacío y vuelve a toda la provincia.
- **Errores simulados:** el código mantiene un estado de error recuperable que se verifica con las pruebas automatizadas; no se muestra como control en el recorrido habitual.
- **Exploración libre:** cambia filtros, comuna y elementos del mapa; utiliza «Ver todas las relaciones» o vuelve a la selección anterior.

## Alcance y datos

El proyecto contiene **15 obras, 11 personas creadoras, 1 agrupación y 4 experiencias ficticias**, con información de proceso, materiales, oficios, testimonios, vínculos y autorías de demostración. No hay cuentas, publicaciones, pagos, reservas ni contactos reales.

**Precisión territorial:** el fondo de relieve es una **ilustración topográfica local**, y los marcadores no usan coordenadas verificadas de obras ni artesanos. Se conservó una solución completamente local y sin integraciones externas para cumplir el Blueprint V5. No es una base cartográfica SIG ni navegación sobre cartografía de Mapbox.

**Imágenes:** las fotografías son simuladas, no registros documentales; algunas representan encuadres reutilizados o materiales genéricos. El contenido está marcado como ficticio en las fichas.

## Archivos

- `app.js`: componentes interactivos del home, mapa, filtros y flujo posterior.
- `data.js`: datos estáticos ficticios.
- `styles.css`: estilos editoriales y responsive.
- `assets/`: fotografías y cartografía de demostración.
- `HISTORIAL_V511.md`: decisiones y límites de la iteración.
- `verify.mjs`, `test-home.mjs`, `test-flow-v511.mjs`, `test-flow-v512.mjs`, `test-flow-v515.mjs`, `test-flow-v517.mjs`, `test-flow-v518.mjs`: pruebas automatizadas de integridad, autoría, vínculos y flujo.

## Validación realizada

Se comprobaron sintaxis JavaScript y `npm test`, incluidas las etapas reordenadas, transiciones, estados sin encuentros y navegación por relaciones. También se inspeccionó una versión autocontenida de la interfaz en Chromium a 1440, 390 y 360 píxeles, verificando leyendas SVG, agrupaciones, fichas de proceso interactivas y ausencia de errores JavaScript o desbordamiento horizontal. La apertura del servidor local desde el navegador de pruebas estuvo restringida en este entorno; `npm run dev` sigue disponible para usarlo en tu equipo.


## Historial: versión 5.12 — recorrido original (reemplazado en V5.18)

- El Home V5.10 permanece intacto.
- Al confirmar Petorca se muestra una transición de carga breve y animada, que se desvanece antes de explorar el mapa.
- En la versión histórica V5.12 se presentaba en la parte superior del mapa una ruta de cinco momentos: **Obra → Proceso → Creador/a → Vínculos → Encuentro**. Los símbolos son círculo, anillo, rombo, círculos vinculados y triángulo, respectivamente. Las etapas visitadas se iluminan y el contador indica «1 de 5», «2 de 5», etc.
- Al entrar al perfil de la persona creadora o a una experiencia vinculada, el recorrido sigue identificado con su obra de origen. Puedes volver a cualquiera de los momentos tocando su nodo.
- Las líneas de relación se reducen de espesor y usan trazos no escalables. Los nombres de elementos geográficos y de marcadores ya no llevan recuadros blancos.
- El mapa realiza transiciones suaves de zoom y desplazamiento; el arrastre manual conserva respuesta inmediata. Se respeta la preferencia del sistema por reducir movimiento.
- La simulación sigue siendo local, offline y con contenido ficticio: no se integra a servicios cartográficos ni contactos reales.

## Versión 5.15 — rediseño de claridad

- El **home aprobado se conserva sin cambios**. Dentro del mapa, solo el logo conduce al inicio; se retiran los botones redundantes Inicio y Creaciones. Se muestra «Provincia de Petorca» junto a «Explorar el mapa» y se incorpora un selector de territorios. Valle del Elqui y Chiloé están identificados correctamente como casos preliminares **sin mapa funcional**.
- Los filtros por oficio muestran la totalidad de botones en escritorio, sin recortes. En móvil se despliegan explícitamente y se pueden ocultar. Cada chip comunica su estado y «Restablecer» reactiva los ocho oficios.
- El panel contextual conserva la barra de cinco pasos, pero ahora los títulos aparecen completos. El progreso indica la etapa actual y mantiene iluminadas las ya visitadas. Los cinco puntos actualizan las relaciones que destaca el mapa, sin cambiar arbitrariamente la obra de origen.
- Las obras tienen pulso suave; la seleccionada se reconoce por el **rojo**. Para distinguir relaciones, se conservan las formas geométricas de cada tipo de dato.
- El móvil distribuye el área útil entre mapa y panel de información; la pestaña expande/reduce el panel y comunica que el contenido se puede desplazar. El scroll es interno y conserva el CTA de acercamiento.
- Todo contenido del mapa es demostrativo y no representa ubicaciones físicas comprobadas.

## Versión 5.17 — orden del recorrido y apertura comunitaria

- Orden vigente: **1 Obra → 2 Creador/a → 3 Proceso → 4 Encuentro → 5 Vínculos**.
- La persona autora se consulta antes de explorar el proceso y el recorrido conserva la obra de origen al regresar.
- La etapa Proceso explica visualmente materia → técnica → obra; no se inventan localizaciones para acciones y materiales.
- La etapa Encuentro pregunta «¿Te interesa esta obra o su oficio?» y ofrece experiencias o alternativas en ausencia de actividades.
- Vínculos cierra la ruta guiada y permite abrir otra obra sin volver al home.
- La leyenda de figuras se dibuja con SVG visibles en el navbar de escritorio y móvil.
- El home aprobado continúa cerrado y no se ha modificado su composición.

## Versión 5.18 — autoría y procesos visibles en el mapa

- Una obra admite ahora varias personas autoras (`makerIds`) y vínculos de pertenencia a colectivos (`collectiveIds`) sin confundir esas relaciones. Las personas también pueden tener pertenencia (`groupIds`) sin que sus demás obras sean automáticamente colectivas.
- Caso de evaluación: el **Cesto de fibras de Pullalli** tiene dos coautoras y una agrupación demostrativa. **Canasta de palma** conserva una autoría individual, aunque su creadora pertenece a la misma agrupación.
- El paso **Creador/a** enfoca los puntos relacionados. Las conexiones de coautoría se dibujan **continuas** desde la obra; las de pertenencia, **discontinuas** desde las personas al colectivo.
- El paso **Proceso** muestra tres fotografías/ilustraciones circulares interactivas sobre el mapa (Materia, Técnica, Resultado). Al elegir una, la explicación cambia también en el panel; no son puntos geográficos.
- Las 15 obras tienen secuencias demostrativas; se agregan ilustraciones técnicas SVG distintas de las imágenes de materia y resultado.
- Mantiene filtros, zoom, comunas, mapa persistente, acciones de acercamiento y salida por Vínculos; home sin alteraciones en composición y funcionalidad.


### V5.19 — redes colectivas y lectura sincronizada
- Siete obras con coautoría y ocho con autoría individual dentro de los **datos ficticios**.
- Nueve de once perfiles pertenecen a tres agrupaciones. La pertenencia no implica autoría de todas las obras.
- Al elegir Materia, Técnica o Resultado en **el mapa**, el panel abre la información y se desplaza suavemente hasta su explicación, también en móvil.
- La interacción interna de las tarjetas del proceso continúa actualizando la selección sin desplazar innecesariamente el panel.
- El Home permanece idéntico a la V5.10 aprobada.

## V5.23 · Diseño móvil del visualizador

En móvil el mapa y el panel de lectura mantienen alturas estables: no se puede ampliar el panel y el contenido se desplaza dentro de él. La capa Proceso se adapta al espacio del mapa sin taparse con filtros y controles. Las comunas se seleccionan en un menú desplegable. La distribución de escritorio y el home no se alteran.

### V5.26 — limpieza puntual del home

Se retiró el destello decorativo junto a las instrucciones de selección fotográfica. Se actualizó el identificador a V5.26. Todo el flujo aprobado de V5.24 sigue sin cambios.


### V5.26 — integración fotográfica

Se renovó el sistema visual de imágenes del prototipo con nuevas fotografías simuladas para obras, creadoras/es y agrupaciones. El objetivo fue reducir repeticiones, mejorar la comprensión de cada caso y reforzar el carácter visual del atlas sin modificar la estructura del flujo aprobada en V5.25.


### V5.27 — Aplicación de DESIGN.md

La identidad se aplica desde `design-theme.css`, cargado después de `styles.css`. Se usan Newsreader y Alegreya Sans mediante Google Fonts con familias de respaldo si no hay acceso; no son dependencias JavaScript. El archivo `DESIGN.md` es la fuente de las reglas. Se mantienen intactos datos, interacciones y fotografías de V5.26.


### V5.28 — selector de comunas e inscripción ficticia

Las comunas usan ahora chips independientes sin fondo rectangular. En dos encuentros demostrativos (`e1`, `e3`) es posible completar un recorrido local de inscripción simulada (formulario, validación, confirmación). Ningún dato se envía o conserva y **no hay inscripciones reales**.

### Versión V5.29 — orientación al mapa y avance por etapas

En la primera entrada al mapa de cada sesión, la carga introduce las tres figuras del visualizador y se presenta una guía breve con círculo (obra), rombo o cuadrado girado (creador/a) y triángulo (encuentro). La guía se cierra con «Comenzar a explorar» y no vuelve a mostrarse durante la misma sesión. El botón oscuro persistente ahora acompaña el recorrido Obra → Creador/a → Proceso → Encuentro → Vínculos sin saltar desde la obra directamente al encuentro. En móvil se muestra de forma compacta. Las inscripciones de prueba de los encuentros e1 y e3 permanecen locales y ficticias; no se envían datos.


### V5.31 — bienvenida sin pantalla de carga

Se eliminó la pantalla intermedia de carga del acceso al mapa. La explicación de círculo, rombo y triángulo se presenta exclusivamente mediante el pop-up introductorio que permite avanzar a la exploración.
