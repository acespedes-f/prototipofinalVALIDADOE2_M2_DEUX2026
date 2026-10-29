import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const scope={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('./data.js',import.meta.url),'utf8'),scope);
const D=scope.window.ATLAS_DATA;
assert.equal(D.works.length,15);
assert.equal(D.makers.length,11);
assert.equal(D.collectives.length,3);
assert.equal(D.works.filter(w=>w.makerIds.length>1).length,7);
assert.equal(D.works.filter(w=>w.makerIds.length===1).length,8);
assert.equal(D.makers.filter(m=>m.groupIds?.length).length,9);
assert.equal(new Set(D.collectives.map(g=>g.id)).size,3);
for(const w of D.works){
 assert.equal(w.makerId,w.makerIds[0]);
 assert.equal(new Set(w.makerIds).size,w.makerIds.length);
 for(const id of w.makerIds)assert.ok(D.makers.some(m=>m.id===id),'creador válido: '+id);
 for(const id of w.collectiveIds){
  const group=D.collectives.find(g=>g.id===id);
  assert.ok(group,'agrupación válida: '+id);
  assert.ok(w.makerIds.every(id=>group.memberIds.includes(id)),'coautorías vinculadas a miembros reales del colectivo demostrativo');
 }
 for(const m of w.makerIds.map(id=>D.makers.find(m=>m.id===id))){
  for(const gid of m.groupIds||[])assert.ok(D.collectives.some(g=>g.id===gid&&g.memberIds.includes(m.id)));
 }
}
for(const gid of ['g1','g2','g3'])assert.ok(D.works.some(w=>w.collectiveIds.includes(gid)));
for(const id of ['o4','o5','o6','o11'])assert.equal(D.works.find(w=>w.id===id).makerIds.length,1);

class MockEl{
 constructor(){this.innerHTML='';this.dataset={};this.hidden=false;this.clientWidth=900;this.clientHeight=600;this.scrollHeight=1000;this.scrollTop=0;this.scrollRequests=[];this.style={transform:'',setProperty(){}};this.offsetWidth=100;this.classList={add(){},remove(){},toggle(){}}}
 getBoundingClientRect(){return {top:160,left:0,width:900,height:600}}
 addEventListener(){}setAttribute(k,v){this[k]=v;if(k.startsWith("data-"))this.dataset[k.slice(5)]=v;}scrollIntoView(){}setPointerCapture(){}
 querySelector(s){return s==='#v519-process-explanation'?detail:null}
 scrollTo(x){this.scrollRequests.push(x);this.scrollTop=x.top}
}
const detail=new MockEl();detail.getBoundingClientRect=()=>({top:430,left:0,width:300,height:150});
const els=new Map();const get=s=>els.get(s)||(els.set(s,new MockEl()),els.get(s));
const listeners={};let isMobile=false;
const document={querySelector:get,querySelectorAll:()=>[],addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn)};
const window={ATLAS_DATA:null,scrollTo(){},matchMedia:q=>({matches:q.includes('max-width')&&isMobile}),addEventListener(){}};
const env={document,window,location:{hash:''},setTimeout:f=>f(),clearInterval(){},clearTimeout(){},console,Math};vm.createContext(env);
for(const name of ['data.js','app.js'])vm.runInContext(fs.readFileSync(new URL(name,import.meta.url),'utf8'),env);
const click=(action,more={})=>{const b={dataset:{action,...more},closest:()=>b,classList:{contains:()=>false}};for(const fn of listeners.click||[])fn({target:b});};
const home=get('#app').innerHTML;
click('explore');
for(const id of ['o1','o2','o3','o7','o9','o12','o13','o4']){
 click('select',{type:'work',id});click('journey-go',{step:'1'});
 const html=get('#side-scroll').innerHTML;
 if(id==='o4')assert.match(html,/Persona autora/);
 else assert.match(html,/Personas coautoras/);
 assert.match(html,/Agrupación vinculada/);
}
click('journey-go',{step:'2'});
assert.match(get('#v518-process-layer').innerHTML,/data-origin="map"/);
assert.match(get('#side-scroll').innerHTML,/id="v519-process-explanation"/);
click('process-step',{origin:'map',step:'1'});
assert.match(get('#side-scroll').innerHTML,/Se utiliza/);
assert.ok(get('#side-scroll').scrollRequests.some(x=>x.top>0&&x.behavior==='smooth'));
// Simular móvil: desde el panel cerrado, el toque en la cartografía abre y desplaza la ficha.
isMobile=true;click('panel-close');assert.equal(get('#side-panel').dataset.sheet,'collapsed');
const oldCount=get('#side-scroll').scrollRequests.length;
click('process-step',{origin:'map',step:'2'});
assert.equal(get('#side-panel').dataset.sheet,'medium');
assert.ok(get('#side-scroll').scrollRequests.length>oldCount);
assert.match(get('#side-scroll').innerHTML,/pieza terminada/);
assert.match(get('#v518-process-layer').innerHTML,/v518-orbit-node-2 is-current/);
assert.match(home,/v51-stage/);
console.log('V5.19 OK: 7 obras con coautoría, 8 individuales, 9 personas en 3 agrupaciones; paso Proceso sincroniza foco y scroll en desktop y móvil.');
