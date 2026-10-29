import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class FakeEl { constructor(){this.innerHTML='';this.listeners={};this.clientWidth=920;this.clientHeight=680;this.scrollHeight=820;this.style={setProperty(){},transform:''};this.dataset={};this.hidden=false;this.classList={add(){},remove(){},toggle(){}};this.scrollTop=0;}
 addEventListener(n,f){this.listeners[n]=f}getBoundingClientRect(){return {width:this.clientWidth,height:this.clientHeight,left:0,top:0}}setAttribute(k,v){this[k]=v}scrollIntoView(){}setPointerCapture(){}querySelector(){return null}
}
const els=new Map(),get=s=>els.get(s)||els.set(s,new FakeEl()).get(s),listeners={};const document={querySelector:get,querySelectorAll:()=>[],addEventListener:(n,f)=>(listeners[n]??=[]).push(f)};
const window={ATLAS_DATA:null,scrollTo(){},matchMedia:()=>({matches:false}),addEventListener(){}};
const env={document,window,location:{hash:''},setTimeout:f=>f(),clearInterval(){},console,Math};vm.createContext(env);
for(const f of ['data.js','app.js'])vm.runInContext(fs.readFileSync(new URL(f,import.meta.url),'utf8'),env);
const click=(a,data={})=>{const b={dataset:{action:a,...data},closest:()=>b,classList:{contains:()=>false}};for(const cb of listeners.click)cb({target:b})};
const originalHome=get('#app').innerHTML;
click('explore');const map=get('#app').innerHTML;
assert.ok(!map.includes('data-action="home">Creaciones'));
assert.ok(!map.includes('Cartografía de obras y oficios'));
assert.match(map,/territory-toggle/);assert.match(map,/Provincia de Petorca/);
assert.ok(!map.includes('v511-map-heading'));assert.match(map,/v515-scroll-hint/);
click('select',{type:'work',id:'o1'});
assert.match(get('#v512-journey').innerHTML,/ETAPA 1 DE 5/);
assert.match(get('#v512-journey').innerHTML,/Creador\/a/);
assert.doesNotMatch(get('.map-connection-layer').innerHTML,/<path/);
click('journey-go',{step:'2'});
assert.match(get('#v512-journey').innerHTML,/ETAPA 3 DE 5/);
assert.match(get('#v518-process-layer').innerHTML,/process-step/);
click('journey-go',{step:'3'});
assert.match(get('#v512-journey').innerHTML,/ETAPA 4 DE 5/);assert.match(get('#v512-journey').innerHTML,/--journey-fill:75%/);
assert.ok((get('.map-connection-layer').innerHTML.match(/<path/g)||[]).length>=1);
click('journey-go',{step:'4'});
assert.match(get('#v512-journey').innerHTML,/ETAPA 5 DE 5/);assert.ok((get('.map-connection-layer').innerHTML.match(/<path/g)||[]).length>1);
const filt=get('#v511-craft-toolbar').innerHTML;assert.match(filt,/craft-toggle/);
click('craft-toggle',{craft:'Cestería'});assert.match(get('#v511-craft-toolbar').innerHTML,/7 de 8 activos/);
click('craft-reset');assert.match(get('#v511-craft-toolbar').innerHTML,/8 de 8 activos/);
click('craft-expand');assert.match(get('#v511-craft-toolbar').innerHTML,/Ocultar filtros/);
click('territory-select',{territory:'elqui'});assert.match(get('#app').innerHTML,/v511-map/);
click('overview');assert.match(get('#side-scroll').innerHTML,/muchas historias/);
assert.match(originalHome,/Atlas <span>de los Oficios/);
const css=fs.readFileSync(new URL('styles.css',import.meta.url),'utf8');assert.match(css,/v515-journey-heading/);assert.match(css,/v515-filter-expand/);
console.log('V5.15 validado: nav contextual, filtro, pasos y relaciones por etapa, regreso al mapa, home intacto.');
