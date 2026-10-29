import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('./data.js',import.meta.url),'utf8'),scope);
const {works,makers,events}=scope.window.ATLAS_DATA;
assert.equal(works.length,15,'Deben existir quince obras');
assert.equal(makers.length,11,'Deben existir once creadores');
assert.ok(events.length>=3,'Deben existir al menos tres experiencias');
for(const group of [works,makers,events])assert.equal(new Set(group.map(x=>x.id)).size,group.length,'IDs únicos');
for(const w of works){
 assert.ok(w.name&&w.image&&w.makerId&&w.crafts.length&&w.materials.length&&w.technique&&w.territory&&w.testimony&&w.source,'Ficha completa: '+w.id);
 assert.ok(makers.some(m=>m.id===w.makerId),'Creador existente: '+w.id);
 assert.ok(w.x>=0&&w.x<=1000&&w.y>=0&&w.y<=720,'Posición dentro del mapa: '+w.id);
 for(const eid of w.experienceIds)assert.ok(events.some(e=>e.id===eid),'Experiencia existente: '+eid);
 assert.ok(fs.existsSync(new URL('./'+w.image,import.meta.url)),'Imagen disponible: '+w.image);
 assert.ok(fs.existsSync(new URL('./'+w.processImage,import.meta.url)),'Proceso disponible: '+w.processImage);
}
assert.ok(works.some(w=>w.experienceIds.length===0),'Existe estado vacío');
assert.ok(works.some(w=>w.experienceIds.length>0),'Existe recorrido con experiencia');
assert.ok(works.some(w=>works.some(b=>w!==b&&w.makerId===b.makerId)),'Relaciones de autoría compartidas');
assert.ok(fs.existsSync(new URL('./assets/petorca-terrain.jpg',import.meta.url)),'Mapa disponible offline');
console.log(`Pruebas de integridad OK: ${works.length} obras, ${makers.length} creadores, ${events.length} experiencias, referencias y archivos correctos.`);
