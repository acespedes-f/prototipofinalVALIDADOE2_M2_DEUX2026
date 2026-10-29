# Sistema de diseño: Atlas de los oficios

## 1. Resumen

Sistema mínimo de construcción para una experiencia **editorial, fotográfica y cartográfica**. La interfaz utiliza una base cálida y ligera, fotografías protagonistas, tipografía legible y controles discretos. Aplicable al prototipo existente y a nuevas vistas del mismo alcance. En el home se conservan la composición, la distribución y las interacciones; solo se normalizan estilos.

## 2. Principios de diseño

- **Mostrar antes que explicar:** priorizar imágenes, ubicaciones y relaciones visibles; usar textos breves que aporten información nueva.
- **Orientar sin imponer:** mantener identificables la obra de origen, la etapa actual, la selección y las opciones para continuar o regresar.
- **Acercar personas y prácticas:** dar protagonismo equivalente a obras, creadoras/es y agrupaciones; evitar interfaces impersonales o transaccionales.
- **Expresar relaciones con precisión:** distinguir autoría, coautoría, pertenencia colectiva y encuentro; no convertir materiales o procesos en ubicaciones geográficas ficticias.
- **Acompañar con calma:** aplicar movimiento suave, jerarquías simples y superficies que no oculten innecesariamente el mapa.

## 3. Reglas visuales

### Paleta mínima

| Token | Valor | Uso |
|---|---|---|
| `--color-fondo` | `#F5F1E8` | Fondo, paneles y superficies de lectura. |
| `--color-tinta` | `#283C32` | Texto principal, acciones prioritarias y controles activos. |
| `--color-terracota` | `#B47C52` | Acentos editoriales y detalles no textuales. |
| `--color-terracota-texto` | `#8C543B` | Texto de acento sobre marfil, cuando sea necesario. |
| `--color-salvia` | `#DCE2D5` | Superficies secundarias, separadores y estados discretos. |
| `--color-obra-activa` | `#B94D43` | Obra seleccionada en el mapa, junto con una señal no cromática. |

- Usar el **verde tinta** para acciones principales; no asignar ese papel a varios colores simultáneos.
- Mantener una categoría cromática identificable por oficio; los colores de oficio requieren verificación de contraste y siempre se acompañan de nombre o figura.
- No usar terracota `#B47C52` ni rojo `#B94D43` como texto pequeño sobre marfil: no alcanzan 4,5:1. El rojo puede identificar una selección mediante un marcador acompañado de anillo, foco o etiqueta.

### Tipografía y jerarquías

- **Newsreader** para títulos principales, nombres de obras y personas creadoras, y encabezados editoriales; respaldo `Georgia, serif`.
- **Alegreya Sans** para cuerpo, navegación, botones, filtros, metadatos y ayudas; respaldo `Arial, sans-serif`.
- Escala inicial: título principal **36–44 px**; título de obra/creador **28–36 px**; subtítulo **20–24 px**; cuerpo **16 px**, interlineado **1,45–1,65**; controles **14–16 px**; epígrafes **12–13 px**.
- Epígrafes: Alegreya Sans semibold, mayúsculas e interletrado moderado. No usarlos para párrafos.
- Reducir títulos de forma fluida en móvil, sin condensar la tipografía ni truncar nombres necesarios para orientarse (especialmente las cinco etapas).

### Espaciado y composición

- Utilizar una escala base de **4, 8, 12, 16, 24 y 32 px** para separaciones y rellenos.
- Priorizar visualmente **mapa > fotografía/contenido seleccionado > controles secundarios**.
- **Escritorio:** mapa como fondo dominante y panel contextual flotante a la derecha; panel cerrable sin borrar la selección.
- **Móvil:** mapa superior y panel inferior con proporción estable (referencia inicial **43 % / 57 %**); el contenido se desplaza dentro del panel, sin ampliarlo automáticamente ni ocultar el mapa al cambiar de etapa.
- Evitar paneles opacos grandes sobre la cartografía, duplicación de títulos y elementos que consuman altura sin aportar orientación.
- Mantener las imágenes en su proporción correspondiente; usar `object-fit: cover` y ajustar el punto de interés de cada fotografía sin deformarla.

### Formas, bordes y profundidad

- Utilizar bordes redondeados moderados y consistentes; separadores finos; sombra suave únicamente en capas flotantes que necesiten distinguirse del mapa.
- En cartografía: **círculo = obra**, **rombo = persona creadora o agrupación**, **triángulo = encuentro**. Diferenciar agrupación mediante una marca interior del rombo.
- Reservar imágenes circulares temporales para **Materia / Técnica / Resultado**; no tratarlas como nuevos puntos geográficos.
- Aplicar animaciones funcionales suaves: estados y transiciones de interfaz **180–350 ms**; desplazamientos del mapa con easing progresivo; halo radial lento y sutil para obras, sin mover su posición. La selección ha de entenderse aun sin animación.

### Iconografía e imágenes

- Iconos sencillos y de trazo uniforme; añadirlos para reforzar significado, no para decorar.
- Fotografía **documental, realista y cálida**, con luz natural, materialidades, herramientas y gestos reconocibles. No imponer filtros cromáticos uniformes.
- Usar una fotografía diferenciada para cada obra; mantener coherencia entre fotografías de creadoras/es, agrupaciones, procesos y encuentros vinculados.
- En fichas principales, permitir imagen de fondo con título superpuesto solo si un degradado discreto asegura su lectura. Preservar encuadres significativos en escritorio y móvil.
- Señalar con claridad y sin protagonismo excesivo que las fotografías, perfiles, coordenadas o encuentros son **demostrativos** cuando corresponda.

## 4. Reglas de contenido

### Terminología

- Nombrar las etapas de forma consistente: **Obra → Creador/a → Proceso → Encuentro → Vínculos**.
- Usar **obra** para la creación seleccionable; **persona creadora** para autoría individual; **coautoría** cuando varias personas realizan una obra; **agrupación** para pertenencia colectiva; **encuentro** para talleres, visitas y otras experiencias vinculadas.
- No confundir «creó la obra» con «pertenece a la agrupación», ni una localización demostrativa con una dirección física comprobada.

### Voz del producto

- Español claro, cercano, preciso y respetuoso. Priorizar frases breves y verbos comprensibles; evitar tecnicismos sin explicación, órdenes insistentes y lenguaje comercial.
- Invitar a descubrir y acercarse sin prometer contacto, reserva, inscripción o disponibilidad reales.

### Tono según la situación

- **Exploración:** curioso e invitador («Explorar otras obras», «Conocer a sus creadoras»).
- **Comprensión:** descriptivo y concreto; explicar materiales, técnicas y relaciones sin sobreexplicar la interfaz.
- **Sin resultados/encuentros:** neutral y propositivo; explicar la ausencia y ofrecer continuar por obras, oficios o territorio.
- **Carga/error:** sereno y directo; indicar qué ocurre y cómo reintentar o regresar.
- **Simulación:** explícito, sin atribuir autenticidad documental a datos creados para prueba.

### Acciones, ayudas y confirmaciones

- Escribir botones como **verbo + destino**: «Conocer la obra», «Explorar el proceso», «Ver encuentros», «Explorar vínculos».
- Una acción principal por contexto; las acciones secundarias no deben competir visualmente con ella.
- Indicar el resultado de filtros, selecciones y navegación mediante estado visible; no describir efectos obvios como «las demás obras se atenúan».
- Confirmar solo acciones que realmente se completan. No mostrar mensajes de inscripción o contacto exitoso en funciones simuladas.

## 5. Componentes y patrones

- **Home fotográfico:** imágenes seleccionables, foco/hover comprensible, agrupación por caso y confirmación de ingreso. Conservar composición y comportamiento existentes; ajustar únicamente estilos.
- **Encabezado:** logotipo como acceso al home; selector de territorio y leyenda geométrica reconocibles en escritorio y móvil.
- **Mapa:** base territorial discreta, controles de zoom y enfoque, filtros por oficio, selector de comuna y marcadores con estados normal, foco, seleccionado y atenuado. La obra activa es inequívoca y queda centrada al ingresar desde el home.
- **Marcadores y relaciones:** círculos de obras con pulso suave, rombos de personas/agrupaciones, triángulos de encuentros; líneas diferenciables para vínculos directos y pertenencias. No trazar relaciones inexistentes.
- **Progreso de cinco etapas:** nombres completos y etapa actual visible; cada etapa seleccionable conserva la obra de origen y actualiza tanto el panel como lo que se destaca sobre el mapa.
- **Proceso interactivo:** materia, técnica y resultado como elementos visuales temporales; al seleccionarlos, sincronizar explicación y panel. Durante esta vista, mantener fijo el encuadre de la obra.
- **Panel contextual:** ficha visual con fotografía protagonista, nombre, datos esenciales y acción siguiente. En escritorio aparece a la derecha y puede cerrarse; en móvil mantiene altura estable y scroll interno.
- **Fichas de autoría:** mostrar directamente fotografías de personas responsables y, separadamente, sus agrupaciones. Evitar bloques explicativos redundantes sobre coautoría.
- **Fichas de encuentro:** responsable, modalidad, fecha o disponibilidad, duración, lugar y siguiente paso; informar con claridad cualquier dato simulado.
- **Estados de interfaz:** inicial, carga, contenido disponible, vacío y error. En todos los estados relevantes ofrecer orientación o recuperación; conservar selección y contexto cuando sea posible.
- **Variantes de controles:** principal, secundario, filtro activado/desactivado, seleccionado, deshabilitado, foco y carga. Usar el mismo tratamiento para acciones equivalentes.

## 6. Accesibilidad

- Contraste mínimo **4,5:1** para texto normal y **3:1** para texto grande y elementos gráficos esenciales; validar superposiciones sobre fotografía y cartografía.
- Mantener texto legible, tamaño base cercano a **16 px**, interlineado suficiente y reajuste sin desbordamiento horizontal.
- No depender únicamente de color, animación o posición: añadir geometría, etiquetas, progreso, foco y/o estados accesibles.
- Controles táctiles preferentemente de **44 × 44 px** o más; separar marcadores cercanos cuando el zoom lo permita.
- Permitir navegación con teclado; foco visible y nombre accesible para marcadores, filtros, comunas, etapas y botones de cierre.
- Añadir textos alternativos útiles a fotografías informativas; omitir redundancia en imágenes meramente decorativas.
- Respetar `prefers-reduced-motion`: eliminar pulsos continuos y reducir transiciones sin ocultar estados ni información.

## 7. Reglas de uso

**Hacer**
- Usar los tokens de color y la pareja Newsreader / Alegreya Sans de forma consistente.
- Dar prioridad a mapa, obras y personas, con fotografías pertinentes y recortes controlados.
- Mantener seleccionada y reconocible la obra de origen durante todo el recorrido.
- Diferenciar autoría, pertenencia colectiva, proceso y experiencia mediante patrones estables.
- Probar cada ajuste en escritorio y móvil, incluidos foco, filtros, etapas y estados vacíos.

**Evitar**
- Introducir adornos, texturas o animaciones que distraigan del contenido.
- Repetir información, ocultar etapas con puntos suspensivos o hacer que el panel tape el mapa.
- Representar procesos como coordenadas, atribuir obras automáticamente a agrupaciones o simular contacto real.
- Deformar fotografías, aplicar filtros obligatorios o reutilizar una imagen para casos no relacionados.
- Añadir componentes, funcionalidades o flujos fuera del alcance del prototipo.
