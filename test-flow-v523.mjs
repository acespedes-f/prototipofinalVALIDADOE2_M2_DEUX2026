import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

class Element {
  constructor(){this.innerHTML='';this.dataset={};this.hidden=false;this.clientWidth=390;this.clientHeight=300;this.scrollHeight=950;this.scrollTop=0;this.scrollRequests=[];this.style={transform:'',setProperty(){}};this.offsetWidth=100;this.classList={add(){},remove(){},toggle(){}}}
  addEventListener(){}setAttribute(k,v){this[k]=v;if(k.startsWith('data-'))this.dataset[k.slice(5)]=v}
  getBoundingClientRect(){return {top:150,left:0,width:this.clientWidth,height:this.clientHeight}}
  setPointerCapture(){}scrollIntoView(){}scrollTo(x){this.scrollRequests.push(x);this.scrollTop=x.top}
  querySelector(selector){return selector==='#v519-process-explanation'?processDetail:null}
}
const processDetail=new Element();processDetail.getBoundingClientRect=()=>({top:410,left:0,width:270,height:140});
const map=new Map(), el=id=>map.get(id)||(map.set(id,new Element()),map.get(id));
const events={};let isMobile=true;
const document={querySelector:el,querySelectorAll:()=>[],addEventListener:(e,cb)=>(events[e]??=[]).push(cb)};
const window={ATLAS_DATA:null,scrollTo(){},matchMedia:q=>({matches:q.includes('max-width')&&isMobile}),addEventListener(){}};
const scope={document,window,location:{hash:''},setTimeout:f=>f(),clearTimeout(){},clearInterval(){},Math,console};
vm.createContext(scope);
for(const file of ['data.js','app.js'])vm.runInContext(fs.readFileSync(new URL(file,import.meta.url),'utf8'),scope);
function click(action,args={}){const btn={dataset:{action,...args},closest:()=>btn,classList:{contains(){return false}}};for(const cb of events.click||[])cb({target:btn})}
const home=el('#app').innerHTML;
click('explore');
assert.match(el('#v511-zone-bar').innerHTML,/v523-zone-toggle/);
assert.match(el('#v511-zone-bar').innerHTML,/aria-expanded="false"/);
click('zone-expand');
assert.match(el('#v511-zone-bar').innerHTML,/aria-expanded="true"/);
assert.match(el('#v511-zone-bar').innerHTML,/is-expanded/);
click('zone',{zone:'Cabildo'});
assert.match(el('#v511-zone-bar').innerHTML,/Cabildo/);
assert.match(el('#v511-zone-bar').innerHTML,/aria-expanded="false"/);
click('select',{type:'work',id:'o1'});
assert.equal(el('#side-panel').dataset.sheet,'medium','sin expansión del panel al seleccionar');
click('journey-go',{step:'2'});
assert.match(el('#v518-process-layer').innerHTML,/v518-orbit-node-2/);
click('process-step',{origin:'map',step:'1'});
assert.equal(el('#side-panel').dataset.sheet,'medium','toque en proceso no expande el panel');
assert.match(el('#side-scroll').innerHTML,/Se utiliza entrelazado manual/);
assert.ok(el('#side-scroll').scrollRequests.some(r=>r.top>0),'scroll dentro del contenido del panel');
click('panel-close');assert.equal(el('#side-panel').dataset.sheet,'collapsed');
click('process-step',{origin:'map',step:'2'});
assert.equal(el('#side-panel').dataset.sheet,'medium','el panel puede reabrirse sin ampliar');
assert.match(el('#side-scroll').innerHTML,/pieza terminada/);
assert.match(home,/v51-stage/);
console.log('V5.23 OK: comunas desplegables, panel móvil de tamaño fijo, scroll de Proceso, home intacto.');
