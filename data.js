/* Datos ficticios de uso exclusivo en el prototipo. Ninguna persona, obra, testimonio o actividad describe un registro histórico verificado. */
window.ATLAS_DATA = (() => {
 const makers = [
  ['m1','Elena Morales','Cestería','La Ligua',310,438,'Trabaja fibras vegetales y experimenta con variaciones de trama.'],
  ['m2','Rosa Hidalgo','Textilería','Valle Hermoso',374,398,'Explora el telar, las fibras y los ritmos de los tejidos del valle.'],
  ['m3','Daniela Soto','Alfarería','Petorca',761,233,'Investiga la forma de los recipientes y sus superficies cerámicas.'],
  ['m4','Tomás Villalón','Tallado en madera','Cabildo',649,488,'Elabora pequeños utensilios a partir de fragmentos de madera.'],
  ['m5','Inés Zamora','Orfebrería','Chincolco',819,148,'Crea piezas a pequeña escala con metales y texturas grabadas.'],
  ['m6','Sergio Prado','Trabajo en cuero','Cabildo',613,549,'Trabaja el corte y la costura manual en objetos de uso cotidiano.'],
  ['m7','Gabriel Fuentes','Cantería','Petorca',881,389,'Explora el desgaste, la talla y las superficies de la piedra.'],
  ['m8','Julia Orellana','Textilería','Cabildo',664,487,'Relaciona fibras textiles con paisajes y memorias imaginadas.'],
  ['m9','Nora Gálvez','Alfarería','Cabildo',729,487,'Modela piezas utilitarias con formas y texturas simples.'],
  ['m10','Pablo Muñoz','Tallado en madera','Zapallar',381,639,'Construye superficies de madera de uso doméstico.'],
  ['m11','Marcela Ávila','Bordado','Zapallar',175,645,'Interpreta flores y líneas del paisaje mediante puntadas.']
 ].map(([id,name,craft,place,x,y,bio])=>({id,name,craft,place,x,y,bio,source:'Perfil narrativo ficticio · elaboración para evaluación UX'}));
 makers.find(m=>m.id==='m8').crafts=['Textilería','Cestería'];
[['m1','assets/maker-01.webp'],['m2','assets/maker-02.webp'],['m3','assets/maker-03.webp'],['m4','assets/maker-04.webp'],['m5','assets/maker-05.webp'],['m6','assets/maker-06.webp'],['m7','assets/maker-07.webp'],['m8','assets/maker-08.webp'],['m9','assets/maker-09.webp'],['m10','assets/maker-10.webp'],['m11','assets/maker-11.webp']].forEach(([id,image])=>{const person=makers.find(m=>m.id===id);if(person)person.image=image;});
 // Pertenencia colectiva y autoría son independientes; un integrante también puede crear obras en solitario.
 const groupMembership={g1:['m1','m8','m2'],g2:['m3','m9','m7'],g3:['m4','m10','m6']};
 for(const [gid,ids] of Object.entries(groupMembership))for(const id of ids){
  const person=makers.find(m=>m.id===id);if(person)person.groupIds=[...(person.groupIds||[]),gid];
 }
 const collectives=[
  {id:'g1',name:'Colectivo Tramas del Valle',type:'collective',craft:'Cestería',crafts:['Cestería','Textilería'],place:'La Ligua',x:503,y:287,memberIds:groupMembership.g1,bio:'Agrupación ficticia que reúne prácticas de cestería y tejido. La pertenencia no implica autoría compartida en todas sus obras.',source:'Agrupación y sede ficticias para evaluación UX'},
  {id:'g2',name:'Agrupación Barro y Piedra',type:'collective',craft:'Alfarería',crafts:['Alfarería','Cantería'],place:'Petorca',x:643,y:211,memberIds:groupMembership.g2,bio:'Colectivo ficticio de creadoras y creadores que trabajan arcilla y piedra. Mantienen producciones personales y algunas colaboraciones.',source:'Agrupación y sede ficticias para evaluación UX'},
  {id:'g3',name:'Red de Oficios del Valle',type:'collective',craft:'Tallado en madera',crafts:['Tallado en madera','Trabajo en cuero'],place:'Cabildo',x:516,y:357,memberIds:groupMembership.g3,bio:'Red demostrativa de personas vinculadas a madera y cuero que comparten espacios de aprendizaje y proyectos puntuales.',source:'Agrupación y sede ficticias para evaluación UX'}
 ];
 [['g1','assets/collective-01.webp'],['g2','assets/collective-02.webp'],['g3','assets/collective-03.webp']].forEach(([id,image])=>{const group=collectives.find(g=>g.id===id);if(group)group.image=image;});
 const works = [
  ['o1','Cesto de fibras de Pullalli','m1',['Cestería'],['Fibra vegetal','Junquillo'],'Entrelazado manual','Pullalli','La Ligua',270,412,'Un recipiente de tejido abierto cuya forma nace del cruce repetido de fibras.','Las fibras y las manos que las trabajan permiten hablar de la relación entre vegetación, trabajo y valle.','«Cada vuelta de la fibra cambia un poco la forma. La pieza se construye al ritmo de las manos».',['e1','e2']],
  ['o2','Manta de trama abierta','m2',['Textilería'],['Lana'],'Telar de bastidor','Valle Hermoso','La Ligua',388,453,'Manta de bandas alternadas y pequeños cambios de densidad.','La repetición de franjas se utiliza aquí para imaginar un paisaje de quebradas y campos.','«No todas las hebras se comportan igual; el tejido siempre responde».',['e4','e2']],
  ['o3','Jarro de tierra roja','m3',['Alfarería'],['Arcilla'],'Modelado y engobe','Petorca','Petorca',755,259,'Jarro de cuello estrecho y superficies marcadas a mano.','La pieza vincula los gestos del modelado con el suelo y la idea de recipiente.','«La huella de los dedos también cuenta cómo fue hecha una vasija».',['e3']],
  ['o4','Canasta de palma','m1',['Cestería'],['Fibra vegetal','Palma'],'Trenzado y amarre','La Ligua','La Ligua',516,426,'Canasta de volumen ancho con fibras de tonos arena.','Sus vueltas sugieren modos de reunir, cuidar y transportar objetos.','«Las tramas se repiten, pero ninguna canasta termina siendo idéntica».',['e1']],
  ['o5','Faja del valle','m2',['Textilería'],['Lana'],'Tejido de bandas','Valle Hermoso','La Ligua',342,369,'Pieza textil estrecha que intercala bandas y figuras.','El diseño toma como referencia visual el desplazamiento a través del valle.','«Un color se entiende distinto cuando aparece al lado de otro».',['e4']],
  ['o6','Plato de engobe claro','m3',['Alfarería'],['Arcilla'],'Torneado manual y engobe','Cabildo','Cabildo',678,397,'Plato de borde ancho con marcas lineales sobre su superficie.','La pieza investiga cómo un material terrestre adquiere otra función al cambiar de forma.','«El acabado muestra lo que pasó antes de que la arcilla se secara».',['e3']],
  ['o7','Cuenco de madera tallada','m4',['Tallado en madera'],['Madera'],'Vaciado y pulido','Cabildo','Cabildo',619,466,'Cuenco de madera con vetas visibles y borde irregular.','El trabajo sigue algunas direcciones propias de la madera y su textura.','«La veta puede decidir por dónde continúa el corte».',['e2']],
  ['o8','Colgante de cobre grabado','m5',['Orfebrería'],['Cobre'],'Calado y martillado','Chincolco','Petorca',835,182,'Pieza de metal con perforaciones y relieves mínimos.','La pieza abre una conversación sobre la procedencia y los usos posibles de los metales.','«Un relieve pequeño puede cambiar cómo se refleja la luz».',[]],
  ['o9','Bolso de costura visible','m6',['Trabajo en cuero'],['Cuero'],'Corte y puntada manual','Cabildo','Cabildo',562,562,'Objeto de uso cotidiano que deja a la vista sus costuras.','La pieza conecta destreza manual, reparación y duración de los materiales.','«Una costura bien hecha permite seguir usando el objeto».',[]],
  ['o10','Figura de piedra pulida','m7',['Cantería'],['Piedra'],'Talla y abrasión','Petorca','Petorca',888,437,'Pequeña figura de piedra con una superficie de tacto suave.','La obra vincula la resistencia del material con la paciencia del proceso.','«Cada superficie cuenta una parte de lo que se retiró».',[]],
  ['o11','Paño del estero','m8',['Textilería'],['Lana','Algodón'],'Trama combinada','La Ligua','La Ligua',254,492,'Paño donde se alternan hilos opacos y brillantes.','Las direcciones del tejido evocan, de manera abstracta, cursos de agua del territorio.','«Me gusta dejar una zona abierta a lo que el material proponga».',['e4']],
  ['o12','Vasija de borde alto','m9',['Alfarería'],['Arcilla'],'Modelado por rollos','Cabildo','Cabildo',744,521,'Recipiente con capas visibles y borde trabajado.','El volumen se construye por acumulación, como una secuencia de gestos.','«Se reconoce el orden de cada rollo, aunque la forma parezca continua».',['e3']],
  ['o13','Fuente de madera alargada','m10',['Tallado en madera'],['Madera'],'Talla y lijado','Zapallar','Zapallar',367,621,'Bandeja de madera de superficie amplia y bordes suaves.','El objeto propone pensar en compartir alimentos y en el trabajo alrededor de la mesa.','«El pulido vuelve más visible el dibujo de la madera».',[]],
  ['o14','Cesto de hojas secas','m1',['Cestería'],['Fibra vegetal'],'Entrelazado en espiral','La Ligua','La Ligua',193,432,'Contenedor compacto construido con una trama continua.','La transformación de pequeñas fibras en un volumen muestra el potencial de lo cotidiano.','«Para cerrar una trama hay que volver al principio».',['e1']],
  ['o15','Bordado de flores del litoral','m11',['Bordado','Textilería'],['Algodón','Hilo'],'Puntada de relleno','Zapallar','Zapallar',165,663,'Bordado de formas vegetales simplificadas y colores cálidos.','Propone mirar la vegetación costera mediante puntadas, no como registro botánico real.','«Al bordar una forma, también elijo qué parte del paisaje recordar».',[]]
 ].map(([id,name,makerId,crafts,materials,technique,locality,commune,x,y,description,territory,testimony,experienceIds],i)=>({id,name,makerId,crafts,materials,technique,locality,commune,x,y,description,territory,testimony,experienceIds,image:`assets/foto-${String(i+1).padStart(2,'0')}.webp`,processImage:`assets/proceso-${String(i+1).padStart(2,'0')}.svg`,makerIds:id==='o1'?['m1','m8']:[makerId],collectiveIds:id==='o1'?['g1']:[],processSteps:[{label:'Materia',short:materials.join(' · '),description:`Los materiales de este ejemplo son ${materials.join(', ').toLowerCase()}. Su preparación antecede a la elaboración de la pieza.`,image:`assets/proceso-${String(i+1).padStart(2,'0')}.svg`},{label:'Técnica',short:technique,description:`Se utiliza ${technique.toLowerCase()} para transformar la materia mediante gestos y decisiones de oficio.`,image:`assets/tecnica-${String(i+1).padStart(2,'0')}.svg`},{label:'Resultado',short:name,description:`La pieza terminada, ${name.toLowerCase()}, permite observar las decisiones de material y técnica.`,image:`assets/foto-${String(i+1).padStart(2,'0')}.webp`}],source:'Ficha, fotografía simulada y testimonio ficticios · material de evaluación UX',authorship:id==='o1'?'Coautoría demostrativa de Elena Morales y Julia Orellana; ambas forman parte de Tramas del Valle':'Obra demostrativa atribuida a un perfil ficticio',history:'Relato de demostración: esta pieza ejemplifica cómo una obra puede comunicar su proceso, sus usos y su relación con un lugar. No corresponde a documentación histórica.'}));
 // Muestra equilibrada: 7 de 15 obras en coautoría, 8 individuales; 9 de 11 personas integran alguna agrupación.
 // Las relaciones son ficticias y no atribuyen automáticamente todas las obras a una agrupación.
 const jointAuthorship={o1:['m1','m8'],o2:['m2','m8'],o3:['m3','m9'],o7:['m4','m10'],o9:['m6','m4'],o12:['m9','m3'],o13:['m10','m4']};
 const jointCollectives={o1:'g1',o2:'g1',o3:'g2',o7:'g3',o9:'g3',o12:'g2',o13:'g3'};
 for(const w of works){
  if(jointAuthorship[w.id]){
   w.makerIds=[...jointAuthorship[w.id]];
   w.makerId=w.makerIds[0];
   w.collectiveIds=[jointCollectives[w.id]];
   w.authorship=`Coautoría demostrativa de ${w.makerIds.map(id=>makers.find(m=>m.id===id).name).join(' y ')}; integrantes de ${collectives.find(g=>g.id===jointCollectives[w.id]).name}. La pertenencia no significa autoría del grupo en todas las obras.`;
  }else{
   w.makerIds=[w.makerId];w.collectiveIds=[];
   w.authorship=`Autoría individual demostrativa de ${makers.find(m=>m.id===w.makerId).name}. La pertenencia a una agrupación, cuando exista, no implica coautoría de esta obra.`;
  }
 }
 const events = [
  ['e1','Taller abierto de fibras y tramas','Taller','m1','Espacio de oficios de La Ligua','La Ligua',361,488,'21 de noviembre de 2026','10:30–13:00','2 h 30 min','Observación de fibras, demostración de técnicas y ejercicio breve de entrelazado.',['Cestería']],
  ['e2','Encuentro de oficios del valle','Encuentro',null,'Sala comunitaria de Cabildo','Cabildo',568,501,'5 de diciembre de 2026','11:00–14:00','3 horas','Encuentro de demostración para conocer distintas prácticas artesanales del territorio.',['Cestería','Textilería','Tallado en madera']],
  ['e3','Demostración de formas en arcilla','Demostración','m3','Taller demostrativo de Petorca','Petorca',794,296,'16 de enero de 2027','11:00–12:30','1 h 30 min','Introducción al modelado y a las marcas visibles que dejan los procesos cerámicos.',['Alfarería']],
  ['e4','Recorrido de talleres textiles','Visita','m2','Punto de encuentro de Valle Hermoso','La Ligua',421,414,'12 de diciembre de 2026','09:30–11:30','2 horas','Recorrido demostrativo para reconocer telares, materiales y otras formas de trabajo textil.',['Textilería']]
 ].map(([id,name,type,makerId,place,commune,x,y,date,time,duration,description,crafts])=>({id,name,type,makerId,place,commune,x,y,date,time,duration,description,crafts,source:'Actividad ficticia · fecha, lugar y disponibilidad simulados',next:'Para una actividad real, confirma fecha, dirección, accesibilidad y disponibilidad directamente con la organización. Aquí no se aceptan inscripciones.'}));
 return {works,makers,collectives,events,crafts:[...new Set(works.flatMap(w=>w.crafts))].sort((a,b)=>a.localeCompare(b,'es')),territory:{name:'Provincia de Petorca',region:'Región de Valparaíso',communes:['La Ligua','Petorca','Cabildo','Papudo','Zapallar']}};
})();
