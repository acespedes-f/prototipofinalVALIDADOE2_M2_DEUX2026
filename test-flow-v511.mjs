import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class FakeEl{constructor(name){this.name=name;this.innerHTML='';this.listeners={};this.clientWidth=1040;this.clientHeight=730;this.style={setProperty(){},transform:''};this.dataset={};this.hidden=false;this.scrollTop=0;this.classList={add(){},remove(){},toggle(){}}}
 addEventListener(n,cb){this.listeners[n]=cb}getBoundingClientRect(){return {width:this.clientWidth,height:this.clientHeight,left:0,top:0}}setAttribute(k,v){this[k]=v}scrollIntoView(){}setPointerCapture(){}
}
const els=new Map();const get=s=>els.get(s)||els.set(s,new FakeEl(s)).get(s);
const listeners={};const document={querySelector:get,querySelectorAll:s=>[],addEventListener:(n,cb)=>{listeners[n]??=[];listeners[n].push(cb)}};
const window={ATLAS_DATA:null,scrollTo(){},matchMedia:()=>({matches:false}),addEventListener(){}};
const env={document,window,location:{hash:''},setTimeout:(f)=>f(),clearInterval(){},console,Math};vm.createContext(env);
vm.runInContext(fs.readFileSync(new URL('./data.js',import.meta.url),'utf8'),env);vm.runInContext(fs.readFileSync(new URL('./app.js',import.meta.url),'utf8'),env);
const click=(action,dataset={})=>{const btn={dataset:{action,...dataset},closest:()=>btn,classList:{contains:()=>false}};for(const fn of listeners.click)fn({target:btn})};
assert.match(get('#app').innerHTML,/Atlas <span>de los Oficios/); // home unchanged
click('explore');assert.match(get('#app').innerHTML,/v511-map/);assert.match(get('#side-scroll').innerHTML,/muchas historias/);assert.match(get('#pins-layer').innerHTML,/v511-pin/);
click('select',{type:'work',id:'o1'});assert.match(get('#side-scroll').innerHTML,/Cesto de fibras de Pullalli/);assert.match(get('#v511-dock').innerHTML,/Conocer a quienes crearon esta obra/);
click('open-detail');assert.match(get('#side-scroll').innerHTML,/La historia detrás/);
click('tab',{tab:'relations'});assert.match(get('#side-scroll').innerHTML,/Ninguna obra existe sola/);assert.match(get('.map-connection-layer').innerHTML,/<path/);
click('show-approach');assert.match(get('#side-scroll').innerHTML,/Te interesa esta obra o su oficio/);assert.match(get('#side-scroll').innerHTML,/Taller abierto/);
click('select',{type:'event',id:'e1'});assert.match(get('#side-scroll').innerHTML,/condiciones para participar|Simular inscripción/);
click('zone',{zone:'Papudo'});assert.match(get('#v511-zone-bar').innerHTML,/Papudo/);
click('craft-toggle',{craft:'Cestería'});assert.match(get('#v511-craft-toolbar').innerHTML,/Cestería/);
click('back-overview');assert.match(get('#side-scroll').innerHTML,/Ninguna obra existe sola|La historia detrás|Cesto de fibras/);
click('select',{type:'work',id:'o8'});click('show-approach');assert.match(get('#side-scroll').innerHTML,/no hay encuentros vinculados/);
console.log('Flujo V5.11 validado: home→mapa→obra→contexto→relaciones→acercamiento→experiencia, filtros, comuna y estado vacío.');
