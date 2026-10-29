import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class FakeEl{constructor(){this.innerHTML='';this.listeners={};this.clientWidth=1040;this.clientHeight=730;this.style={setProperty(){},transform:''};this.dataset={};this.classList={add(){},remove(){},toggle(){}};this.scrollTop=0;}
 addEventListener(n,f){this.listeners[n]=f}getBoundingClientRect(){return {width:this.clientWidth,height:this.clientHeight,left:0,top:0}}setAttribute(k,v){this[k]=v}scrollIntoView(){}setPointerCapture(){}
}
const els=new Map(),get=s=>els.get(s)||els.set(s,new FakeEl()).get(s);
const listeners={};const document={querySelector:get,querySelectorAll:()=>[],addEventListener:(n,f)=>(listeners[n]??=[]).push(f)};
const window={ATLAS_DATA:null,scrollTo(){},matchMedia:()=>({matches:false}),addEventListener(){}};
const env={document,window,location:{hash:''},setTimeout:f=>f(),clearInterval(){},console,Math};vm.createContext(env);
for(const f of ['data.js','app.js'])vm.runInContext(fs.readFileSync(new URL(f,import.meta.url),'utf8'),env);
const click=(a,data={})=>{const b={dataset:{action:a,...data},closest:()=>b,classList:{contains:()=>false}};for(const cb of listeners.click)cb({target:b})};
const step=(n)=>click('journey-go',{step:String(n)});
assert.match(get('#app').innerHTML,/Atlas <span>de los Oficios/);
click('explore');assert.match(get('#v512-journey').innerHTML,/Selecciona una obra/);
click('select',{type:'work',id:'o1'});assert.match(get('#v512-journey').innerHTML,/Cesto de fibras/);assert.match(get('#v512-journey').innerHTML,/de 5/);
step(1);assert.match(get('#side-scroll').innerHTML,/Elena Morales/);
step(2);assert.match(get('#side-scroll').innerHTML,/Cómo toma forma./);assert.match(get('#v512-journey').innerHTML,/Cesto de fibras/);
step(3);assert.match(get('#side-scroll').innerHTML,/Te interesa esta obra o su oficio/);
step(4);assert.match(get('#side-scroll').innerHTML,/Ninguna obra existe sola/);
assert.equal((get('#v512-journey').innerHTML.match(/is-visited/g)||[]).length,5);
step(2);assert.match(get('#v512-journey').innerHTML,/is-current/);assert.match(get('#v512-journey').innerHTML,/Cesto de fibras/);
click('select',{type:'work',id:'o8'});assert.match(get('#v512-journey').innerHTML,/de 5/);assert.match(get('#v512-journey').innerHTML,/ETAPA 1 DE 5/);
const css=fs.readFileSync(new URL('styles.css',import.meta.url),'utf8');assert.match(css,/v512-territory-loading/);assert.match(css,/vector-effect:non-scaling-stroke/);assert.match(css,/transition:transform \.62s/);
console.log('V5.12 validado: ruta de 5 etapas, obra de origen, creador, retroceso, cambio de obra, animaciones y líneas del mapa.');
