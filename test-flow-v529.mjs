import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';
const js=fs.readFileSync(new URL('./app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./design-theme.css',import.meta.url),'utf8');
const testIntro = [/mapSymbolsMarkup\('v529-guide-symbols'\)/,/showMapIntro/,/sessionStorage\.setItem\(mapIntroKey,'1'\)/,/data-action="guide-dismiss"/,/aria-modal="true"/,/Cuadrado girado · rombo/,/Comenzar a explorar/];
for(const r of testIntro)assert.match(js,r);
assert.match(js,/function showTerritoryLoader\(\)/);
assert.match(js,/v512-loader-emblem/);
assert.doesNotMatch(js,/mapSymbolsMarkup\('v529-loader-symbols'\)/);
assert.match(js,/applyMapTransform\(\);showTerritoryLoader\(\)/);
assert.match(css,/\.v529-map-guide/);assert.match(css,/\.v529-guide-symbols/);assert.match(css,/\.v511-explore \.v511-dock\{display:block!important/);
// Real routing is checked with the old tests plus this controlled environment.
class E{constructor(){this.innerHTML='';this.listeners={};this.dataset={};this.style={setProperty(){},transform:''};this.classList={add(){},remove(){},toggle(){}};this.clientWidth=980;this.clientHeight=720;this.scrollHeight=850;this.scrollTop=0;this.hidden=false;}getBoundingClientRect(){return {width:980,height:720,left:0,top:0}}addEventListener(k,v){this.listeners[k]=v}setAttribute(){}scrollIntoView(){}setPointerCapture(){}querySelector(){return null}}
const elements=new Map();const get=s=>elements.get(s)||elements.set(s,new E()).get(s);
const listeners={};const document={querySelector:get,querySelectorAll:()=>[],addEventListener:(k,f)=>(listeners[k]??=[]).push(f)};
const window={ATLAS_DATA:null,scrollTo(){},matchMedia:()=>({matches:false}),addEventListener(){}};
const env={window,document,location:{hash:''},setTimeout:f=>f(),clearInterval(){},console,Math};vm.createContext(env);
vm.runInContext(fs.readFileSync(new URL('./data.js',import.meta.url),'utf8'),env);vm.runInContext(js,env);
const click=(action,d={})=>{const b={dataset:{action,...d},closest:()=>b,classList:{contains:()=>false}};for(const f of listeners.click)f({target:b})};
click('explore');click('select',{type:'work',id:'o1'});
const dock=()=>get('#v511-dock').innerHTML;
assert.match(dock(),/data-step="1"/);assert.match(dock(),/Conocer a quienes crearon esta obra/);
assert.doesNotMatch(get('#side-scroll').innerHTML,/v516-summary-actions|data-step="3"/);
for(const [step,next,part] of [[1,2,/Explorar el proceso de la obra/],[2,3,/Descubrir encuentros vinculados/],[3,4,/Explorar vínculos y otras obras/]]){
 click('journey-go',{step:String(step)});assert.match(dock(),new RegExp(`data-step="${next}"`));assert.match(dock(),part);
}
click('journey-go',{step:'4'});assert.match(dock(),/Descubre otras obras del territorio/);
click('journey-go',{step:'3'});click('select',{type:'event',id:'e1'});assert.match(get('#side-scroll').innerHTML,/Simular inscripción/);
click('journey-go',{step:'2'});assert.doesNotMatch(dock(),/data-step="3".*¿Te interesa/);
console.log('V5.31 OK: carga original sin leyenda, pop-up informativo y CTA secuencial conservados.');
