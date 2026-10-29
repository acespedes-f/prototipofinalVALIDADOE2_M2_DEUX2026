/* Atlas de los Oficios V5.31. Mapa centrado en la obra elegida, panel visual más compacto y control explícito del panel. */
(() => {
'use strict';
const D=window.ATLAS_DATA;
const $=s=>document.querySelector(s);
const maker=id=>D.makers.find(m=>m.id===id)||D.collectives?.find(m=>m.id===id);
const work=id=>D.works.find(w=>w.id===id);
const event=id=>D.events.find(a=>a.id===id);
const creators=w=>(w.makerIds||[w.makerId]).map(maker).filter(Boolean);
const collectivesFor=w=>[...new Set([...(w.collectiveIds||[]),...creators(w).flatMap(m=>m.groupIds||[])])].map(maker).filter(Boolean);
const creatorLinks=w=>{const people=creators(w);const groupIds=[...new Set([...(w.collectiveIds||[]),...people.flatMap(m=>m.groupIds||[])])];return [...people.map(it=>({type:'maker',it,relationship:(w.makerIds||[]).length>1?'Coautoría':'Autoría individual'})),...groupIds.map(id=>({type:'maker',it:maker(id),relationship:'Pertenencia colectiva de la persona, no autoría de la obra'})).filter(n=>n.it)];};
const worksForMaker=m=>D.works.filter(w=>(w.makerIds||[w.makerId]).includes(m.id)||(m.type==='collective'&&(w.collectiveIds||[]).includes(m.id)));
const makerImage=m=>m?.image||worksForMaker(m||{})[0]?.image||'assets/foto-01.webp';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I={arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',back:'<path d="M19 12H5m6 6-6-6 6-6"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3A5 5 0 0 0 13.4 3.4l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/>',layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',refresh:'<path d="M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6M4 13a8 8 0 0 0 14 5l3-3m0 6v-6h-6"/>',person:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',chev:'<path d="m9 18 6-6-6-6"/>',check:'<path d="m4 12 5 5L20 6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9v.1"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',eye:'<path d="M2 12S6 5 12 5s10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'};
const ico=(n,sz=18)=>`<svg class="icon" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||I.info}</svg>`;
const state={page:'home',featured:0,modal:null,type:null,id:null,phase:'summary',tab:'context',filter:'all',craft:'all',activeCrafts:null,zone:'Todas',scale:1.12,tx:0,ty:0,history:[],error:false,loading:false,request:0,sheet:'medium',focusRelations:false};
let sliderTimer=null;let dragState=null;let pointerDown=null;
const picture=w=>`<img src="${w.image}" alt="Fotografía de demostración de ${esc(w.name)}" loading="lazy">`;
const craftsTags=(arr)=>`<div class="tag-line">${arr.map(c=>`<span class="pill">${esc(c)}</span>`).join('')}</div>`;
const noteSource=txt=>`<div class="source-strip"><strong>Autoría y procedencia</strong><br>${esc(txt)}</div>`;
function relatedWorks(w){return D.works.filter(x=>x.id!==w.id).map(x=>({w:x,score:((x.makerIds||[x.makerId]).some(m=>(w.makerIds||[w.makerId]).includes(m))?5:0)+(x.crafts.some(c=>w.crafts.includes(c))?3:0)+(x.materials.some(c=>w.materials.includes(c))?2:0)+(x.commune===w.commune?1:0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.w.id.localeCompare(b.w.id)).slice(0,7).map(x=>x.w);}
function selected(){return state.type==='work'?work(state.id):state.type==='maker'?maker(state.id):state.type==='event'?event(state.id):null;}
function mapLegendInline(){const symbols=[
 ['Obra','<circle cx="12" cy="12" r="7.6"/>'],
 ['Creador/a','<path d="M12 2.5L21.5 12L12 21.5L2.5 12Z"/>'],
 ['Encuentro','<path d="M12 2L22 21H2Z"/>']
 ];return `<div class="v516-header-legend" aria-label="Leyenda de figuras del mapa">${symbols.map(([name,shape])=>`<span><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${shape}</svg>${name}</span>`).join('')}</div>`;}
function keepSelectionCentered(match){const token=state.focusToken=(state.focusToken||0)+1;const checks=[0,140,520];checks.forEach((ms,i)=>setTimeout(()=>{if(state.page!=='explore'||state.focusToken!==token)return;const it=selected();if(!it)return;if(match&&`${state.type}:${state.id}`!==match)return;focusPoint(it,i===0)},ms));}
function header(){
 const inHome=state.page==='home';
 return `<header class="site-header"><div class="logo" role="button" tabindex="0" data-action="home" aria-label="Volver al inicio">Atlas<span>de los Oficios</span></div>${inHome?`<nav class="site-links v52-home-nav" aria-label="Información del atlas"><span>Un atlas para descubrir la artesanía chilena</span></nav><div class="header-side v54-header-side"><div class="v54-case-nav" id="v54-case-nav"><button type="button" class="v54-case-toggle" id="v54-case-toggle" data-action="v54-menu" aria-expanded="false" aria-controls="v54-case-menu" aria-label="Elegir un caso de estudio">Casos de estudio <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="v54-case-menu" id="v54-case-menu" aria-label="Seleccionar caso de estudio" hidden><span class="v54-menu-heading">EXPLORAR POR TERRITORIO</span>${Object.entries(homeCases).map(([key,c])=>`<button type="button" data-action="v54-case" data-case="${key}" class="v54-case-option"><span class="v54-case-dot ${key}"></span><span class="v54-option-info"><strong>${esc(c.name)}</strong><small>${c.ready?'Caso disponible':'Caso simulado'}</small></span>${ico('arrow',14)}</button>`).join('')}</div></div><span class="trial-tag">Prototipo v5.31</span><span class="v52-header-help">Selecciona una obra para comenzar ${ico('arrow',15)}</span></div>`:`<nav class="v515-territory-nav" aria-label="Cambiar territorio"><button type="button" id="v515-territory-toggle" data-action="territory-toggle" aria-controls="v515-territory-menu" aria-expanded="false">Territorios ${ico('chev',16)}</button><div id="v515-territory-menu" class="v515-territory-menu" hidden><span class="v515-territory-heading">EXPLORAR TERRITORIOS</span><button type="button" data-action="territory-select" data-territory="petorca" aria-current="true"><strong>Provincia de Petorca</strong><small>Mapa disponible · Caso piloto</small></button><button type="button" data-action="territory-select" data-territory="elqui"><strong>Valle del Elqui</strong><small>Vista preliminar · Sin mapa navegable</small></button><button type="button" data-action="territory-select" data-territory="chiloe"><strong>Archipiélago de Chiloé</strong><small>Vista preliminar · Sin mapa navegable</small></button></div></nav><div class="header-side v515-explore-nav"><div class="v516-explore-meta"><span class="v515-territory-current">Provincia de Petorca</span>${mapLegendInline()}</div><button class="btn btn-dark header-cta" data-action="overview">Explorar el mapa ${ico('arrow',15)}</button></div><div class="v517-legend-mobile">${mapLegendInline()}</div>`}</header>`;
}
/* HOME V5.4: entrada principal desde fotografías y alternativa discreta por caso territorial. */
const homeCases={
 petorca:{name:'Provincia de Petorca',region:'Región de Valparaíso',count:'15 obras · 11 creadores · 4 experiencias',ready:true},
 elqui:{name:'Valle del Elqui',region:'Región de Coquimbo',count:'Vista preliminar · caso simulado',ready:false},
 chiloe:{name:'Archipiélago de Chiloé',region:'Región de Los Lagos',count:'Vista preliminar · caso simulado',ready:false}
};
/* Home de 25 fotografías: 15 Petorca, 5 Valle del Elqui y 5 Chiloé. */
const elquiNames=['Tejido de lana','Cesto de fibras','Objeto de greda','Pieza de madera','Paño de telar'];
const chiloeNames=['Paño bordado','Cesto de fibra','Pieza de madera','Colgante artesanal','Trama de junquillo'];
const homeCaseEntries=(region,names)=>names.map((name,i)=>({id:`demo-${region}-${i+1}`,caseId:region,image:`assets/caso-${region}-${String(i+1).padStart(2,'0')}.webp`,name: name+' · muestra',craft:'Imagen demostrativa',maker:'Autoría simulada'}));
const regionGroups=[D.works.map(w=>({id:w.id,caseId:'petorca',image:w.image,name:w.name,craft:w.crafts.join(' · '),maker:maker(w.makerId).name})),homeCaseEntries('elqui',elquiNames),homeCaseEntries('chiloe',chiloeNames)];
const homeEntries=[];
for(let i=0;i<15;i++)for(const arr of regionGroups)if(arr[i])homeEntries.push(arr[i]);
/* En móvil mostramos 15 obras visibles sin requerir scroll: 7 piezas Petorca, 4 Elqui y 4 Chiloé. */
const mobileSlots=[[3,6,25,14],[35,4,22,14],[69,6,24,14],[2,21,20,11],[26,19,16,9],[76,21,18,11],[3,37,20,11],[77,37,18,11],[3,68,20,11],[26,65,16,9],[73,67,20,11],[7,82,18,10],[39,80,16,9],[69,82,18,10],[45,91,12,7.5]];
function shuffled(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function mobileSelection(){const items=shuffled([...shuffled(regionGroups[0]).slice(0,7),...shuffled(regionGroups[1]).slice(0,4),...shuffled(regionGroups[2]).slice(0,4)]);return new Map(items.map((item,i)=>[item.id,mobileSlots[i]]))}
/* Distribución editorial reproducible, con un espacio libre al centro para el título. */
const floatSlots=(()=>{
 const positions=[];
 const columns=10,rows=5;
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const x=1.6+col*9.85+(row%2)*1.8;
  const y=4+row*19.6;
  const middle=(x>29 && x<70 && y>23 && y<71);
  if(middle)continue;
  positions.push([x,y,7.2+((col+2*row)%4)*1.05,15.8+((col*3+row)%4)*1.45]);
 }
 // Interior items at upper/lower edges provide density while preserving the heading.
 positions.push([31,3,8.4,15.5],[42,2,8.5,15.5],[53,3,8.7,17],[64,2,7.8,17],[29,80,8.6,16],[41,81,8.4,16],[53,80,8.8,17],[65,81,8.3,16]);
 // Spread distinct cases across the screen, not a left/right division.
 const order=[]; let a=0; for(let i=0;i<positions.length;i++){a=(a+17)%positions.length;while(order.includes(a))a=(a+1)%positions.length;order.push(a)}
 const slots=order.slice(0,homeEntries.length).map(i=>positions[i]);
 // Ajuste puntual: esta fotografía quedaba más de 60 % oculta por una vecina.
 // Se modifica SOLAMENTE su posición, sin cambiar tamaños ni la densidad del catálogo.
 if(slots.length>23)slots[23]=[69.4,3,8.7,17];
 return slots;
})();
function home(){
 state.page='home';state.homeCase=null;state.homeWork=null;state.homeEntry=null;state.homeHover=null;state.homeMode='works';state.homeCasesOpen=false;
 const mobileItems=mobileSelection();
 if(sliderTimer)clearInterval(sliderTimer);
 $('#app').innerHTML=header()+`<main class="v51-home"><section class="v51-stage" id="v51-stage" aria-label="Catálogo fotográfico interactivo de obras artesanales">
   <div class="v51-grain" aria-hidden="true"></div>
   <div class="v51-floating-layer" id="v51-floating-layer">
   ${homeEntries.map((entry,i)=>{const [x,y,w,h]=floatSlots[i];const mob=mobileItems.get(entry.id);return `<button type="button" class="v51-photo ${mob?'':'v53-mobile-hidden'}" data-action="v51-work" data-id="${entry.id}" data-case="${entry.caseId}" style="--x:${x}%;--y:${y}%;--w:${w}%;--h:${h}%;--mx:${mob?mob[0]:0}%;--my:${mob?mob[1]:0}%;--mw:${mob?mob[2]:0}%;--mh:${mob?mob[3]:0}%;--delay:-${(i*1.73)%14}s;--duration:${6+(i%6)*1.2}s;--gx:0%;--gy:0%;--gxm:0%;--gym:0%" aria-label="${esc(entry.name)}. ${esc(homeCases[entry.caseId].name)}. Seleccionar."><span class="v51-photo-motion"><img src="${entry.image}" alt="Imagen fotográfica simulada de ${esc(entry.name)}" draggable="false" loading="${i<16?'eager':'lazy'}"><span class="v51-photo-caption"><b>${esc(entry.name)}</b><small>${esc(homeCases[entry.caseId].name)}</small></span></span></button>`}).join('')}
   </div>
   <div class="v51-landing" id="v51-landing"><span class="v51-kicker"><span class="v51-kicker-line"></span> UNA CARTOGRAFÍA DE CREACIONES Y PERSONAS</span>
   <h1>Atlas <span>de los Oficios</span></h1>
   <p>Explora la artesanía chilena desde sus obras. Cada creación abre las historias, personas y territorios que la rodean.</p>
   <span class="v51-intro-hint"><span class="v52-desktop-hint">Pasa sobre una fotografía para descubrir su caso. Haz clic para seleccionarla.</span><span class="v52-mobile-hint">Toca una obra para descubrir su caso y seleccionarla.</span></span></div>
   <div class="v51-hover-note" id="v51-hover-note" aria-live="polite"></div>
   <div class="v51-case-panel" id="v51-case-panel" aria-live="polite"></div>
   <div class="v51-bottom"><div class="v52-footer-label"><span class="v51-mini-circle">↗</span><span class="v52-desktop-hint">ACERCA EL CURSOR A UNA OBRA · DESCUBRE SUS RELACIONES</span><span class="v52-mobile-hint">TOCA UNA IMAGEN PARA COMENZAR</span></div><div class="v51-bottom-right"><span>Petorca · Valle del Elqui · Chiloé</span></div></div>
   <div class="v51-prototype-note">* Petorca es el único caso desarrollado. Los otros casos y todas las fotografías son simulaciones para la evaluación UX.</div>
  </section></main>`;
 const stage=$('#v51-stage');
 stage.addEventListener('pointerover',e=>{const btn=e.target.closest('.v51-photo');if(!btn||state.homeCase)return;highlightHome(btn.dataset.case,btn.dataset.id)});
 stage.addEventListener('pointerout',e=>{const btn=e.target.closest('.v51-photo');if(!btn||state.homeCase)return;if(btn.contains(e.relatedTarget))return;highlightHome(null,null)});
 stage.addEventListener('focusin',e=>{const btn=e.target.closest('.v51-photo');if(btn&&!state.homeCase)highlightHome(btn.dataset.case,btn.dataset.id)});
 stage.addEventListener('focusout',e=>{if(!state.homeCase&&!e.relatedTarget?.closest('.v51-photo'))highlightHome(null,null)});
 window.scrollTo(0,0);
}
function toggleHomeCaseMenu(force){
 const btn=$('#v54-case-toggle'),menu=$('#v54-case-menu');
 if(!btn||!menu)return;
 const open=typeof force==='boolean'?force:menu.hidden;
 menu.hidden=!open;btn.setAttribute('aria-expanded',String(open));
}
function chooseHomeCase(caseId){
 if(!homeCases[caseId])return;
 toggleHomeCaseMenu(false);
 // Choosing the case is distinct from choosing one artwork: no work has been chosen yet.
 arrangeHome(caseId,null);
}
function highlightHome(caseId,id){
 state.homeHover=caseId;
 const stage=$('#v51-stage');if(!stage)return;
 stage.classList.toggle('is-hovering',!!caseId);
 $$('.v51-photo').forEach(b=>{b.classList.toggle('is-kin',!!caseId&&b.dataset.case===caseId);b.classList.toggle('is-muted',!!caseId&&b.dataset.case!==caseId);b.classList.toggle('is-hovered',!!id&&b.dataset.id===id)});
 const n=$('#v51-hover-note');
 if(n)n.innerHTML=caseId?`<span class="v51-small-dot"></span><strong>${esc(homeCases[caseId].name)}</strong><span>${homeEntries.filter(x=>x.caseId===caseId).length} ${caseId==='petorca'?'obras del territorio':'imágenes de muestra'}</span>`:'';
}
function arrangeHome(caseId,id=null){
 if(!homeCases[caseId])return;
 const fromCase=!id;
 const matched=homeEntries.filter(x=>x.caseId===caseId);
 const entry=id?matched.find(x=>x.id===id):matched[0];
 if(!entry)return;
 state.homeCase=caseId;state.homeEntry=fromCase?null:entry;state.homeWork=(!fromCase&&caseId==='petorca')?id:null;state.homeCaseOnly=fromCase;
 toggleHomeCaseMenu(false);
 const stage=$('#v51-stage');stage.classList.add('is-arranged');stage.classList.remove('is-hovering');
 $$('.v51-photo').forEach(b=>{
  const idx=matched.findIndex(x=>x.id===b.dataset.id);const yes=idx>=0;
  b.classList.toggle('is-match',yes);b.classList.toggle('is-offcase',!yes);b.classList.toggle('is-selected',yes&&id===b.dataset.id);
  b.classList.remove('is-kin','is-hovered','is-muted');
  if(yes){const cols=4,cx=idx%cols,cy=Math.floor(idx/cols);
   b.style.setProperty('--gx',`${51.5+cx*11.6}%`);b.style.setProperty('--gy',`${13+cy*20.5}%`);
   const mcol=idx%3,mrow=Math.floor(idx/3);
   b.style.setProperty('--gxm',`${5+mcol*31}%`);b.style.setProperty('--gym',`${56+mrow*8.45}%`);
  }
 });
 const c=homeCases[caseId]; const w=state.homeWork?work(state.homeWork):null;
 const panel=$('#v51-case-panel');
 panel.innerHTML=`<div class="v51-case-kicker"><span>CASO TERRITORIAL · ${caseId==='petorca'?'DISPONIBLE':'EN DEMOSTRACIÓN'}</span><button type="button" data-action="v51-reset" aria-label="Volver al catálogo flotante">${ico('close',18)}</button></div>
  <span class="v51-case-region">${esc(c.region)}</span><h2>${esc(c.name)}</h2>
  <p class="v51-case-lead">${caseId==='petorca'?'Las obras seleccionadas aquí conectan a sus creadores, oficios y experiencias en el territorio.':'Este caso ilustra cómo se agruparían otras creaciones. Su mapa todavía no está desarrollado.'}</p>
  <div class="v52-selection-label"><span class="v52-selection-dot"></span> ${fromCase?'ELEGISTE EXPLORAR ESTE TERRITORIO':'ESTA ES LA OBRA QUE ELEGISTE'}</div>
  <div class="v51-selected-work ${fromCase?'v54-case-preview':''}"><div class="v52-selected-photo"><img src="${entry.image}" alt="${fromCase?'Imagen fotográfica demostrativa del caso':'Imagen simulada de la obra elegida'}: ${esc(entry.name)}">${fromCase?'':`<span class="v52-selected-check">${ico('check',17)}</span>`}</div><div class="v52-selected-copy"><span>${fromCase?'UNA CREACIÓN PARA DESCUBRIR':'OBRA SELECCIONADA'}</span><strong>${esc(entry.name)}</strong><small>${fromCase?'Puedes elegir esta u otra obra al explorar el mapa.':`${esc(entry.maker)}<br>${esc(entry.craft)}`}</small><small class="v52-selected-place">${ico('pin',12)} ${esc(c.name)}</small></div></div>
  <div class="v51-case-data">${matched.length} ${caseId==='petorca'?'obras de este caso':'imágenes demostrativas de este caso'}</div>
  ${c.ready?`<button type="button" class="v51-primary v51-enter" data-action="v51-enter"><span><small>CONTINUAR LA EXPLORACIÓN</small><strong>Ingresar al mapa de Petorca</strong></span><span class="v52-enter-arrow">${ico('arrow',24)}</span></button><span class="v51-map-note">${fromCase?'Explorarás el territorio para seleccionar la obra que quieras conocer.':`Conservarás <strong>${esc(entry.name)}</strong> como punto de partida en el mapa.`}</span>`:`<div class="v51-unavailable">Este caso es una demostración del catálogo; aún no tiene cartografía navegable. Puedes volver a las fotografías y elegir una creación de Petorca.</div>`}
  <button type="button" class="v51-text-button" data-action="v51-reset">${ico('back',15)} Volver a todas las obras</button>`;
 stage.scrollIntoView({block:'start',behavior:'smooth'});
}
function resetHome(){
 state.homeCase=state.homeWork=state.homeEntry=state.homeHover=null;state.homeCaseOnly=false;
 const stage=$('#v51-stage');if(!stage)return;
 stage.classList.remove('is-arranged','is-hovering','is-guided');
 $$('.v51-photo').forEach(b=>b.classList.remove('is-match','is-offcase','is-selected','is-kin','is-hovered','is-muted'));
 $('#v51-case-panel').innerHTML='';$('#v51-hover-note').innerHTML='';toggleHomeCaseMenu(false);
}
function displayModal(id=null){state.modal=id||'territory';const w=id?work(id):null;const source=w?maker(w.makerId):null;$('#dialog-root').innerHTML=`<div class="dialog-backdrop" data-action="close-modal"><section class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button class="btn-icon dialog-close" data-action="close-modal" aria-label="Cerrar">${ico('close')}</button><img class="dialog-image" src="${w?w.image:'assets/foto-01.webp'}" alt="${w?`Imagen simulada de ${esc(w.name)}`:'Fotografía demostrativa de artesanía'}"><div class="dialog-copy"><span class="eyebrow muted">${w?'Obra seleccionada / Paso previo al mapa':'Caso de estudio / 01'}</span><h2 id="dialog-title">${esc(w?w.name:'Provincia de Petorca')}</h2>${w?`<p><strong>${esc(creators(w).map(m=>m.name).join(' y '))}</strong> · ${esc(w.crafts.join(', '))} · ${esc(w.locality)}</p><p>${esc(w.description)}</p>`:`<p>Explora un caso piloto de cartografía artesanal: descubre dónde se vinculan las obras, sus creadores y experiencias.</p>`}<div class="dialog-territory"><span>CASO TERRITORIAL ASOCIADO</span><strong>${ico('pin',15)} Provincia de Petorca · Región de Valparaíso</strong></div><p class="soft-note">El mapa reúne referencias geográficas reales y ubicaciones demostrativas. No representa la ubicación física comprobada de una obra.</p><div class="dialog-buttons"><button class="btn btn-dark" data-action="confirm-territory">${w?'Entrar al mapa y ubicar esta obra':'Explorar el mapa'} ${ico('arrow')}</button><button class="btn btn-outline" data-action="close-modal">Seguir explorando el catálogo</button></div></div></section></div>`;setTimeout(()=>$('.dialog-close')?.focus(),0);}
function closeModal(){state.modal=null;$('#dialog-root').innerHTML='';}
/* V5.28: recorrido de inscripción SOLO demostrativo; sin envío de información, persistencia ni cupos reales. */
const demoEnrollmentIds=new Set(['e1','e3']);
function showDemoEnrollment(id){
 const a=event(id);if(!a||!demoEnrollmentIds.has(id))return;
 state.modal=`inscripcion:${id}`;
 $('#dialog-root').innerHTML=`<div class="dialog-backdrop" data-action="close-modal"><section class="dialog-card v528-enroll-dialog" role="dialog" aria-modal="true" aria-labelledby="v528-enroll-title" aria-describedby="v528-enroll-intro"><button type="button" class="btn-icon dialog-close" data-action="close-modal" aria-label="Cerrar formulario">${ico('close')}</button><div class="v528-enroll-head"><span class="v528-enroll-kicker">ENCUENTRO · INSCRIPCIÓN SIMULADA</span><h2 id="v528-enroll-title">Inscribirme al encuentro</h2><p id="v528-enroll-intro">Una demostración de cómo podría realizarse la inscripción. <strong>Usa datos inventados:</strong> no se envían ni se guardan datos y no se reserva un cupo.</p></div><div class="v528-enroll-body"><div class="v528-enroll-event"><strong>${esc(a.name)}</strong><span>${ico('calendar',14)} ${esc(a.date)} · ${esc(a.time)}</span><span>${ico('pin',14)} ${esc(a.place)} · ${esc(a.commune)}</span></div><form id="v528-enroll-form" novalidate><div class="v528-field"><label for="v528-name">Nombre de ejemplo <span aria-hidden="true">*</span></label><input name="demoName" id="v528-name" type="text" maxlength="60" autocomplete="off" placeholder="Ej.: Ana Ejemplo" required aria-describedby="v528-name-error"><small class="v528-field-error" id="v528-name-error"></small></div><div class="v528-field"><label for="v528-email">Correo de ejemplo <span aria-hidden="true">*</span></label><input name="demoEmail" id="v528-email" type="email" maxlength="100" autocomplete="off" placeholder="Ej.: ana@ejemplo.cl" required aria-describedby="v528-email-error"><small class="v528-field-error" id="v528-email-error"></small></div><button type="submit" class="btn btn-dark v528-enroll-submit">Confirmar inscripción simulada ${ico('arrow',16)}</button></form><p class="v528-demo-note">Esta acción solo demuestra el recorrido de inscripción. No envía correos, no genera reservas ni registra participantes.</p></div></section></div>`;
 $('#v528-name')?.focus();
}
function submitDemoEnrollment(form){
 const a=event(String(state.modal||'').split(':')[1]);if(!a||!demoEnrollmentIds.has(a.id))return;
 const name=form.elements.namedItem('demoName').value.trim();
 const email=form.elements.namedItem('demoEmail').value.trim();
 const errors={demoName: name.length<2?'Escribe al menos dos caracteres.':name.length>60?'Usa un nombre más corto.':'',demoEmail:!/^\S+@\S+\.\S+$/.test(email)?'Ingresa un correo de ejemplo con formato válido.':''};
 for(const [key,msg] of Object.entries(errors)){
  const field=form.elements.namedItem(key);const error=$(`#v528-${key==='demoName'?'name':'email'}-error`);field.setAttribute('aria-invalid',String(!!msg));if(error)error.textContent=msg;
 }
 if(Object.values(errors).some(Boolean)){form.querySelector('[aria-invalid="true"]')?.focus();return}
 // La información introducida solo se usa momentáneamente para mostrar esta confirmación; nada se envía ni se almacena.
 $('#dialog-root').innerHTML=`<div class="dialog-backdrop" data-action="close-modal"><section class="dialog-card v528-enroll-dialog v528-confirmation" role="dialog" aria-modal="true" aria-labelledby="v528-confirm-title"><button type="button" class="btn-icon dialog-close" data-action="close-modal" aria-label="Cerrar confirmación">${ico('close')}</button><div class="v528-enroll-body"><span class="v528-confirm-icon" aria-hidden="true">${ico('check',25)}</span><span class="v528-enroll-kicker">RECORRIDO DE PRUEBA COMPLETADO</span><h2 id="v528-confirm-title">Inscripción simulada completada</h2><p><strong>${esc(name)}</strong>, este es el aspecto que tendría una confirmación. <strong>No se registró una inscripción real</strong> ni se envió un correo.</p><div class="v528-enroll-event"><strong>${esc(a.name)}</strong><span>${ico('calendar',14)} ${esc(a.date)} · ${esc(a.time)}</span><span>${ico('pin',14)} ${esc(a.place)} · ${esc(a.commune)}</span></div><p class="v528-demo-note">Para participar en una actividad real sería necesario confirmar información, cupos y canales oficiales con su organización.</p><button type="button" class="btn btn-dark v528-enroll-submit" data-action="close-modal">Continuar explorando ${ico('arrow',16)}</button></div></section></div>`;
 $('#v528-confirm-title')?.setAttribute('tabindex','-1');$('#v528-confirm-title')?.focus();
}

/* V5.11 — mapa territorial como espacio persistente; el home se conserva. */
const craftColors={'Alfarería':'#BD715B','Bordado':'#AF738B','Cantería':'#778C91','Cestería':'#BF8A4C','Orfebrería':'#BEA35C','Tallado en madera':'#56876B','Textilería':'#8976A4','Trabajo en cuero':'#91664F'};
const zoneViews={Todas:{x:500,y:365,z:1.12},'La Ligua':{x:340,y:440,z:1.75},Cabildo:{x:650,y:465,z:1.8},Petorca:{x:810,y:260,z:1.8},Papudo:{x:170,y:575,z:1.8},Zapallar:{x:260,y:652,z:1.8}};
const typeNames={work:'Obra',maker:'Creador',event:'Encuentro'};
const shapeSvg=(type)=>type==='work'?'<circle cx="18" cy="18" r="13"/>':type==='maker'?'<path d="M18 3 L33 18 L18 33 L3 18 Z"/>':'<path d="M18 3 L34 32 L2 32 Z"/>';
const itemCrafts=it=>it.crafts||[it.craft];
const colorFor=it=>craftColors[itemCrafts(it)?.[0]]||'#8D907F';
function craftToolbar(){const total=state.activeCrafts.length;return `<div class="v511-filter-kicker"><span>OFICIOS <em>${total} de ${D.crafts.length} activos</em></span><div class="v515-filter-actions"><button type="button" data-action="craft-expand" class="v515-filter-expand" aria-expanded="${!!state.craftsOpen}" aria-controls="v515-craft-options">${state.craftsOpen?'Ocultar filtros':'Ver oficios'} ${ico('chev',14)}</button><button data-action="craft-reset" class="v511-text-link">Restablecer</button></div></div><div id="v515-craft-options" class="v511-craft-row ${state.craftsOpen?'is-expanded':''}" role="group" aria-label="Filtrar por oficio">${D.crafts.map(c=>{const active=state.activeCrafts.includes(c);return `<button type="button" class="v511-craft-chip ${active?'active':'inactive'}" data-action="craft-toggle" data-craft="${esc(c)}" aria-pressed="${active}"><i style="--craft:${craftColors[c]}"></i>${esc(c)}</button>`}).join('')}</div>`}
function zonesBar(){return `<span class="v511-zone-title">${ico('compass',15)} Explorar por comuna</span><button type="button" class="v523-zone-toggle" data-action="zone-expand" aria-expanded="${!!state.zoneOpen}" aria-controls="v523-zone-options" aria-label="Elegir comuna. Seleccionada: ${state.zone==='Todas'?'Toda la provincia':esc(state.zone)}">${ico('compass',13)} <span>${state.zone==='Todas'?'Toda la provincia':esc(state.zone)}</span> ${ico('chev',13)}</button><div id="v523-zone-options" class="v511-zone-list ${state.zoneOpen?'is-expanded':''}" role="group" aria-label="Acercar mapa a una comuna">${Object.keys(zoneViews).map(k=>`<button data-action="zone" data-zone="${k}" class="v511-zone ${state.zone===k?'active':''}" aria-pressed="${state.zone===k}">${k==='Todas'?'Toda la provincia':k}</button>`).join('')}</div>`}
/* V5.14 — barra de pasos más limpia, entrada centrada a la obra y hover visual de las obras. */
const journeySteps=[
 {title:'Obra',shape:'circle'}, {title:'Creador/a',shape:'diamond'},
 {title:'Proceso',shape:'ring'}, {title:'Encuentro',shape:'triangle'},
 {title:'Vínculos',shape:'linked'}
];
function journeyStage(){
 if(!state.journeyRoot)return -1;
 if(state.type==='maker')return 1;
 if(state.type==='event')return 3;
 if(state.type==='work'&&state.id!==state.journeyRoot)return -1;
 if(state.phase==='summary'||state.tab==='context')return 0;
 return {creators:1,process:2,approach:3,relations:4}[state.tab]??0;
}
function journeyMark(shape){
 if(shape==='circle')return '<circle cx="12" cy="12" r="6.7"/>';
 if(shape==='ring')return '<circle cx="12" cy="12" r="7" fill="none" stroke-width="3"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/>';
 if(shape==='diamond')return '<path d="M12 3L21 12 12 21 3 12Z"/>';
 if(shape==='linked')return '<circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/>';
 return '<path d="M12 3L22 21H2Z"/>';
}
function renderJourney(){const bar=$('#v512-journey');if(!bar)return;
 const root=state.journeyRoot&&work(state.journeyRoot),current=journeyStage();
 if(!root){bar.innerHTML=`<div class="v512-journey-intro"><span class="v512-journey-kicker">RECORRIDO DE EXPLORACIÓN</span><strong>Selecciona una obra para iniciar el recorrido</strong></div><span class="v512-progress-count">Mapa de Petorca</span>`;bar.classList.add('is-empty');return;}
 bar.classList.remove('is-empty');
 const reached=state.journeyVisited||new Set([0]);
 bar.innerHTML=`<div class="v515-journey-heading"><span><span class="sr-only">${esc(root.name)} · </span>ETAPA ${Math.max(1,current+1)} DE ${journeySteps.length}</span><strong>${current>=0?journeySteps[current].title:'Exploración'}</strong></div><nav class="v512-journey-track" style="--journey-fill:${(Math.max(...reached)/4)*100}%" aria-label="Etapas del recorrido por la obra">${journeySteps.map((st,i)=>`<button type="button" class="v512-journey-step ${current===i?'is-current':''} ${reached.has(i)?'is-visited':''}" data-action="journey-go" data-step="${i}" aria-current="${current===i?'step':'false'}" aria-label="Etapa ${i+1} de 5: ${st.title}${reached.has(i)?', visitada':''}"><span class="v512-journey-symbol"><svg viewBox="0 0 24 24" aria-hidden="true">${journeyMark(st.shape)}</svg></span><span class="v512-journey-step-name">${st.title}</span></button>`).join('')}</nav>`;
}
function markJourney(){const st=journeyStage();if(st>=0){if(!state.journeyVisited)state.journeyVisited=new Set([0]);state.journeyVisited.add(st);}renderJourney();}
function focusCreatorNetwork(w){
 state.focusToken=(state.focusToken||0)+1;const list=[w,...creatorLinks(w).map(n=>n.it)];
 const map=$('#map-wrap');if(!map)return;
 const minX=Math.min(...list.map(it=>it.x)),maxX=Math.max(...list.map(it=>it.x));
 const minY=Math.min(...list.map(it=>it.y)),maxY=Math.max(...list.map(it=>it.y));
 const paddingX=Math.max(130,(maxX-minX)*.16),paddingY=Math.max(110,(maxY-minY)*.2);
 state.zone='Todas';
 state.scale=Math.max(1.2,Math.min(2.7,Math.min(1000/(maxX-minX+paddingX*2),720/(maxY-minY+paddingY*2))));
 state.tx=-(((minX+maxX)/2)/1000-.5)*map.clientWidth*state.scale;
 state.ty=-(((minY+maxY)/2)/720-.5)*map.clientHeight*state.scale;
 renderMarkers();glideMap();
}
function journeyGo(index){const root=state.journeyRoot&&work(state.journeyRoot);if(!root)return;
 const step=Math.max(0,Math.min(4,Number(index)));
 if(step===0){state.focusToken=(state.focusToken||0)+1;state.processStep=0;if(state.type==='work'&&state.id===root.id&&state.phase==='summary'){focusPoint(root);renderMarkers();return;}choose('work',root.id,{phase:'summary'});return;}
 if(step===1){
   if((root.makerIds||[root.makerId]).length===1 && !collectivesFor(root).length){
     const m=creators(root)[0];if(!(state.type==='maker'&&state.id===m.id))choose('maker',m.id);
   }else{
     if(state.type!=='work'||state.id!==root.id)choose('work',root.id,{phase:'detail'});
     state.phase='detail';state.tab='creators';state.loading=false;state.request++;renderSidebar();renderMarkers();markJourney();
   }
   focusCreatorNetwork(root);return;
 }
 if(step===2){state.focusToken=(state.focusToken||0)+1;state.processStep=0;if(state.type!=='work'||state.id!==root.id)choose('work',root.id,{phase:'detail'});setTab('process');focusPoint(root);return;}
 if(step===3){if(state.type!=='work'||state.id!==root.id)choose('work',root.id,{phase:'detail'});setTab('approach');focusEventConnections(root);return;}
 if(state.type!=='work'||state.id!==root.id)choose('work',root.id,{phase:'detail'});
 setTab('relations');focusAllRelations();
}
function focusEventConnections(w){
 state.focusToken=(state.focusToken||0)+1;const n=w.experienceIds.map(event).filter(Boolean);
 if(!n.length){focusPoint(w);return;}
 const map=$('#map-wrap');if(!map)return;
 const arr=[w,...n],minX=Math.min(...arr.map(x=>x.x)),maxX=Math.max(...arr.map(x=>x.x)),minY=Math.min(...arr.map(x=>x.y)),maxY=Math.max(...arr.map(x=>x.y));
 const spanX=Math.max(190,maxX-minX),spanY=Math.max(170,maxY-minY);
 state.zone='Todas';state.scale=Math.max(1.35,Math.min(2.8,Math.min(800/spanX,560/spanY)));
 state.tx=-(((minX+maxX)/2)/1000-.5)*map.clientWidth*state.scale;
 state.ty=-(((minY+maxY)/2)/720-.5)*map.clientHeight*state.scale;
 renderMarkers();glideMap();
}
/* V5.31: la carga recupera su diseño original sin simbología; el pop-up sigue explicando las figuras. */
const mapIntroKey='atlas-oficios-map-intro-seen';
let introWasClosed=false;
function introWasSeen(){try{return introWasClosed||sessionStorage.getItem(mapIntroKey)==='1'}catch{return introWasClosed}}
function mapSymbolsMarkup(cssClass){
 const symbols=[
  {label:'Obra',desc:'Círculo',svg:'<circle cx="24" cy="24" r="13"/>'},
  {label:'Creador/a',desc:'Cuadrado girado · rombo',svg:'<path d="M24 9 L39 24 L24 39 L9 24 Z"/>'},
  {label:'Encuentro',desc:'Triángulo',svg:'<path d="M24 9 L40 39 H8 Z"/>'}
 ];
 return `<div class="${cssClass}">${symbols.map(x=>`<div class="v529-symbol"><svg viewBox="0 0 48 48" aria-hidden="true">${x.svg}</svg><strong>${x.label}</strong><small>${x.desc}</small></div>`).join('')}</div>`;
}
function showMapIntro(){
 if(introWasSeen()||state.page!=='explore'||state.modal)return;
 state.modal='map-guide';
 $('#dialog-root').innerHTML=`<div class="dialog-backdrop v529-guide-backdrop"><section class="dialog-card v529-map-guide" role="dialog" aria-modal="true" aria-labelledby="v529-guide-title" aria-describedby="v529-guide-intro"><button type="button" class="btn-icon v529-guide-close" data-action="guide-dismiss" aria-label="Cerrar introducción">${ico('close',19)}</button><span class="v529-guide-kicker">ANTES DE EXPLORAR EL MAPA</span><h2 id="v529-guide-title">Cada figura cuenta algo.</h2><p id="v529-guide-intro">Estas tres figuras te ayudarán a reconocer las obras, las personas que las crean y sus encuentros en el territorio.</p>${mapSymbolsMarkup('v529-guide-symbols')}<p class="v529-guide-help">Selecciona un círculo para descubrir una obra. Desde ahí podrás avanzar por sus creadoras, proceso, encuentros y vínculos; los colores ayudan a distinguir los oficios.</p><button type="button" class="btn btn-dark v529-guide-start" data-action="guide-dismiss">Comenzar a explorar ${ico('arrow',18)}</button></section></div>`;
 $('#v529-guide-title')?.setAttribute('tabindex','-1');$('#v529-guide-title')?.focus?.();
}
function dismissMapIntro(){
 if(state.modal!=='map-guide')return;
 introWasClosed=true;try{sessionStorage.setItem(mapIntroKey,'1')}catch{}
 closeModal();$('#map-wrap')?.focus({preventScroll:true});
}
function showTerritoryLoader(){
 const app=$('#app');if(!app||typeof document.createElement!=='function'||!app.appendChild)return;
 const existing=$('#v512-territory-loading');if(existing?.remove)existing.remove();
 const overlay=document.createElement('div');overlay.className='v512-territory-loading';overlay.id='v512-territory-loading';overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
 // Vuelve el estado de carga original: animación abstracta y progreso, SIN geometrías explicativas.
 overlay.innerHTML='<div class="v512-loader-emblem"><span></span><span></span><span></span></div><p>ATLAS DE LOS OFICIOS</p><strong>Entrando al territorio</strong><small>Preparando las obras y sus relaciones</small><div class="v512-loading-progress"><i></i></div>';
 app.appendChild(overlay);state.loaderToken=(state.loaderToken||0)+1;const token=state.loaderToken;
 setTimeout(()=>{if(state.loaderToken!==token||!overlay.isConnected)return;overlay.classList.add('is-leaving');setTimeout(()=>{if(state.loaderToken!==token)return;overlay.remove();if(state.page==='explore')showMapIntro()},450)},900);
}
function glideMap(){const world=$('#map-world');if(!world)return;world.classList.add('is-gliding');if(state.glideTimeout&&typeof clearTimeout==='function')clearTimeout(state.glideTimeout);state.glideTimeout=setTimeout(()=>world.classList.remove('is-gliding'),730);}
function explore({type=null,id=null,phase='summary'}={}){
 closeModal();state.page='explore';state.type=type;state.id=id;state.phase=phase;state.tab='context';state.filter='all';state.craft='all';state.activeCrafts=[...D.crafts];state.craftsOpen=false;state.zoneOpen=false;state.zone='Todas';state.error=false;state.loading=false;state.history=[];state.focusRelations=false;state.sheet='medium';state.scale=type==='work'&&id?1.42:1.12;state.tx=state.ty=0;state.journeyRoot=type==='work'?id:null;state.journeyVisited=new Set(state.journeyRoot?[0]:[]);state.processStep=0;if(sliderTimer)clearInterval(sliderTimer);
 $('#app').innerHTML=header()+`<main class="explore v511-explore"><div class="v512-workspace"><aside class="explore-sidebar v511-sidebar" aria-label="Contenido y acciones de exploración" id="side-panel"><button type="button" class="v511-sheet-handle" data-action="sheet-toggle" aria-controls="side-scroll" aria-expanded="false"><span></span><small>Ver información</small>${ico('chev',14)}</button><div id="side-top" class="side-top"></div><div class="v512-journey v512-journey--panel" id="v512-journey" aria-label="Progreso del recorrido"></div><div class="side-scroll" id="side-scroll" tabindex="-1"></div><div id="v515-scroll-hint" class="v515-scroll-hint" hidden aria-hidden="true">Desliza para seguir leyendo ${ico('arrow',13)}</div><div id="v511-dock" class="v511-dock"></div></aside><section class="map-wrap v511-map" id="map-wrap" aria-label="Mapa interactivo del caso Petorca"><div class="map-world" id="map-world"><img class="terrain" src="assets/petorca-terrain.jpg" alt="Terreno ilustrativo de la provincia de Petorca" draggable="false"><div class="map-colorwash"></div>${mapLabels()}<svg class="map-connection-layer" viewBox="0 0 1000 720" preserveAspectRatio="none" aria-hidden="true"></svg><div class="pins-layer" id="pins-layer"></div></div><div class="v518-process-layer" id="v518-process-layer" aria-label="Proceso artesanal vinculado a la obra"></div><div class="v511-map-top"><div id="v511-craft-toolbar" class="v511-craft-toolbar">${craftToolbar()}</div></div><div class="map-tools v511-map-tools"><button class="btn-icon" data-action="zoom-in" aria-label="Acercar mapa">${ico('plus')}</button><button class="btn-icon" data-action="zoom-out" aria-label="Alejar mapa">${ico('minus')}</button><button class="btn-icon" data-action="map-reset" aria-label="Ver toda la provincia">${ico('compass')}</button><button class="btn-icon" data-action="focus-links" aria-label="Ver todas las relaciones">${ico('layers')}</button></div><div id="v511-zone-bar" class="v511-zone-bar">${zonesBar()}</div><div id="v511-map-status" class="v511-map-status" role="status"></div><div id="map-preview" hidden></div></section></div></main>`;
 bindMapInteractions();bindSheetGestures();renderSidebar();renderMarkers();markJourney();if(id){keepSelectionCentered(`${type}:${id}`)} applyMapTransform();showTerritoryLoader();
}
function bindSheetGestures(){if(window.matchMedia('(max-width:740px)').matches)return;const handle=$('.v511-sheet-handle');if(!handle)return;let y0=null;
 handle.addEventListener('pointerdown',e=>{y0=e.clientY;handle.setPointerCapture(e.pointerId)});
 handle.addEventListener('pointerup',e=>{if(y0===null)return;const delta=e.clientY-y0;if(Math.abs(delta)>28){state.sheet=delta<0?'expanded':'medium';$('#side-panel')?.setAttribute('data-sheet',state.sheet);handle.dataset.wasDragged='yes';setTimeout(()=>handle.removeAttribute('data-was-dragged'),140);}y0=null});
}
function updateSheetControls(){const btn=$('.v511-sheet-handle');const collapsed=state.sheet==='collapsed';const expanded=state.sheet==='expanded';const mobile=window.matchMedia('(max-width:740px)').matches;if(btn){btn.setAttribute('aria-expanded',String(expanded&&!collapsed));const text=btn.querySelector?.('small');if(text)text.textContent=collapsed?'Abrir información':expanded?(mobile?'Reducir panel':'Reducir panel · volver al mapa'):(mobile?'Ampliar información':'Ampliar información · desliza para leer');}const scroll=$('#side-scroll');const hint=$('#v515-scroll-hint');if(scroll&&hint)hint.hidden=collapsed||scroll.scrollHeight<=scroll.clientHeight+3||mobile;}
function toggleTerritoryMenu(open){const b=$('#v515-territory-toggle'),m=$('#v515-territory-menu');if(!b||!m)return;const next=typeof open==='boolean'?open:m.hidden;m.hidden=!next;b.setAttribute('aria-expanded',String(next));}
function mapLabels(){const towns=[['La Ligua',370,512],['Cabildo',641,438],['Petorca',755,196],['Papudo',175,576],['Zapallar',190,677],['Chincolco',852,98],['Valle Hermoso',374,336],['Pullalli',254,369],['Pichicuy',184,269]];
 return `<div class="map-label ocean" style="left:5%;top:35%;writing-mode:vertical-rl">OCÉANO PACÍFICO</div><div class="map-label region" style="left:77%;top:92%">CORDILLERA DE LA COSTA Y VALLES</div>${towns.map(([n,x,y])=>`<div class="map-label" style="left:${x/10}%;top:${y/7.2}%">${n}</div>`).join('')}`;}
function currentTitle(){const o=selected();return o?o.name:'Provincia de Petorca';}
function v511Dock(){const r=$('#v511-dock');if(!r)return;
 const root=state.journeyRoot&&work(state.journeyRoot);
 const stage=journeyStage();
 if(root&&stage>=0&&!state.error){
  if(stage===4){r.innerHTML=`<button class="v511-dock-cta" data-action="overview" aria-label="Descubrir otras obras del territorio">${ico('map',18)} <span><strong>Descubre otras obras del territorio</strong><small>Inicia un nuevo recorrido en el atlas</small></span>${ico('arrow',18)}</button>`;return;}
  const labels=[
   {title:(root.makerIds||[root.makerId]).length>1?'Conocer a quienes crearon esta obra':'Conocer a quien creó esta obra',support:'Siguiente etapa · Creador/a'},
   {title:'Explorar el proceso de la obra',support:'Siguiente etapa · Proceso'},
   {title:'Descubrir encuentros vinculados',support:'Siguiente etapa · Encuentro'},
   {title:'Explorar vínculos y otras obras',support:'Siguiente etapa · Vínculos'}
  ];
  const next=labels[stage];
  r.innerHTML=`<button class="v511-dock-cta" data-action="journey-go" data-step="${stage+1}" aria-label="${next.title}">${ico('arrow',17)} <span><strong>${next.title}</strong><small>${next.support}</small></span>${ico('chev',19)}</button>`;
  return;
 }
 if(state.type==='maker'&&state.id){r.innerHTML=`<button class="v511-dock-cta" data-action="maker-approach">${ico('calendar',17)} <span><strong>Experiencias del creador</strong><small>Ver encuentros relacionados</small></span>${ico('arrow',18)}</button>`;return;}
 r.innerHTML='';}

function v511StageLabel(){if(!state.id)return 'EXPLORACIÓN TERRITORIAL';if(state.type==='event')return '04 · ENCUENTRO';if(state.type==='maker')return '02 · CREADOR/A';if(state.phase==='summary')return '01 · OBRA';return ({context:'01 · OBRA Y CONTEXTO',process:'03 · PROCESO',relations:'05 · VÍNCULOS',approach:'04 · ENCUENTRO'})[state.tab]||'OBRA';}
function renderSidebar(scroll=true){const top=$('#side-top'),el=$('#side-scroll');if(!top||!el)return;
 if(state.sheet==='collapsed'){top.innerHTML=`<button class="v516-panel-open" data-action="panel-open" aria-label="Abrir panel de información">${ico('layers',16)}<span>Abrir</span></button>`;}
 else top.innerHTML=`<button data-action="${state.id?'back-overview':'overview'}">${ico('back',16)} ${state.id?'Volver':'Mapa general'}</button><span class="crumb-current">${v511StageLabel()}</span><div class="v516-side-actions">${state.id?`<button class="v511-sheet-expand" data-action="sheet-toggle" aria-label="Expandir o reducir el panel">${ico('layers',16)}</button>`:''}<button class="v516-panel-close" data-action="panel-close" aria-label="Cerrar panel de información">${ico('close',15)}</button></div>`;
 let html;if(state.loading)html=`<div class="loading-state"><span class="spinner"></span>Preparando información de la selección…</div>`;
 else if(state.error)html=errorContent();
 else if(!state.id)html=v511Overview();
 else if(state.type==='work')html=state.phase==='summary'?v511Summary(work(state.id)):v511Detail(work(state.id));
 else if(state.type==='maker')html=v511Maker(maker(state.id));
 else html=v511Event(event(state.id));
 el.innerHTML=html;if(scroll)el.scrollTop=0;v511Dock();markJourney();
 const sheet=$('#side-panel');if(sheet)sheet.dataset.sheet=state.sheet;updateSheetControls();
}
function v511Overview(){const items=mapNodes().filter(n=>nodeVisible(n.type,n.it));const works=items.filter(n=>n.type==='work');return `<div class="v511-intro-label">UNA CARTOGRAFÍA DE OBRAS Y OFICIOS</div><h1 class="v511-panel-title">Un territorio,<br><em>muchas historias.</em></h1><p class="side-lead">Explora las obras, conoce a quienes las realizan y descubre experiencias relacionadas en la Provincia de Petorca.</p><div class="v511-counts"><span><strong>15</strong> obras</span><span><strong>${D.makers.length}</strong> personas · ${D.collectives.length} agrupaciones</span><span><strong>04</strong> experiencias</span></div><div class="v511-section-top"><strong>${works.length} obras para descubrir</strong><small>Selecciona una fotografía o un círculo sobre el mapa</small></div><div class="v511-works">${works.map(n=>`<button class="v511-work-row" data-action="select" data-type="work" data-id="${n.it.id}"><img src="${n.it.image}" alt=""><span><b>${esc(n.it.name)}</b><small>${esc(n.it.crafts.join(' · '))} · ${esc(n.it.commune)}</small></span>${ico('arrow',15)}</button>`).join('')||'<p class="soft-note">No hay obras para esta selección. Activa otro oficio o vuelve a toda la provincia.</p>'}</div>${noteSource('Contenido, testimonios y coordenadas de las obras son ficticios. El mapa es una referencia territorial ilustrativa.')}`;}
function v511Summary(w){return `<figure class="v516-summary-hero"><img src="${w.image}" alt="Fotografía simulada de ${esc(w.name)}"><figcaption><span class="v511-intro-label">OBRA ELEGIDA</span><h1 class="v511-panel-title v516-summary-title">${esc(w.name)}</h1><div class="v511-tagline">${w.crafts.map(c=>`<span style="--craft:${craftColors[c]}"><i></i>${esc(c)}</span>`).join('')}</div></figcaption></figure><div class="v516-summary-meta"><span>${ico('person',14)} ${esc(creators(w).map(m=>m.name).join(' y '))}${w.makerIds.length>1?' · Coautoría':''}</span><span>${ico('pin',14)} ${esc(w.locality)} · ${esc(w.commune)}</span></div><p class="content-copy v516-compact-copy">${esc(w.description)}</p>`;}
function v511Detail(w){const breadcrumb=`<div class="v511-current-work"><img src="${w.image}" alt=""><div><span>OBRA DE PARTIDA</span><strong>${esc(w.name)}</strong><small>${esc(w.crafts.join(' · '))}</small></div></div>`;
 if(state.tab==='creators'){
  const authorList=creators(w),groups=collectivesFor(w),joint=authorList.length>1;
  return `${breadcrumb}<div class="v518-authors"><div class="v511-section-top"><strong>${joint?'Personas coautoras':'Persona autora'}</strong><small>Selecciona un perfil para continuar el recorrido</small></div><div class="v521-author-grid">${authorList.map(m=>profileHeroCard(m,(joint?'Coautoría · ':'Autoría individual · ')+m.place)).join('')}</div>${groups.length?`<div class="v511-section-top"><strong>${groups.length===1?'Agrupación vinculada':'Agrupaciones vinculadas'}</strong><small>Redes de oficio relacionadas con quienes realizaron la obra</small></div><div class="v521-author-grid v521-author-grid-groups">${groups.map(m=>profileHeroCard(m,'Agrupación vinculada · '+m.place)).join('')}</div>`:''}</div>`;
 }

 if(state.tab==='context')return `${breadcrumb}<div class="v511-intro-label">EL OFICIO Y SU CONTEXTO</div><h2 class="v511-content-title">La historia detrás de la pieza.</h2><p class="content-copy">${esc(w.description)} ${esc(w.territory)}</p><div class="v511-facts"><div><small>CREADOR/A</small><strong>${esc(creators(w).map(m=>m.name).join(' y '))}</strong></div><div><small>TÉCNICA</small><strong>${esc(w.technique)}</strong></div><div><small>MATERIALES</small><strong>${esc(w.materials.join(', '))}</strong></div><div><small>TERRITORIO</small><strong>${esc(w.locality)}</strong></div></div><blockquote class="v511-quote">${esc(w.testimony)}<small>— Testimonio ficticio · ${esc(creators(w).map(m=>m.name).join(' y '))}</small></blockquote><div class="v511-source">Autoría demostrativa: ${esc(creators(w).map(m=>m.name).join(' y '))}<br>Procedencia: contenido ficticio para evaluación UX.</div>`;
 if(state.tab==='process'){
 const steps=w.processSteps||[];const i=Math.max(0,Math.min(2,state.processStep||0));const p=steps[i];
 return `${breadcrumb}<div class="v511-intro-label">MATERIA · TÉCNICA · RESULTADO</div><h2 class="v511-content-title">Cómo toma forma.</h2><p class="content-copy">Selecciona una etapa en el mapa para descubrir cómo cambia la pieza. Estos elementos explican el proceso: no son nuevas ubicaciones geográficas.</p><div class="v518-process-sequence" role="group" aria-label="Etapas del proceso de esta obra">${steps.map((v,j)=>`<button type="button" class="v518-process-card ${i===j?'is-current':''}" data-action="process-step" data-step="${j}" aria-pressed="${i===j}"><img src="${v.image}" alt=""><span><b>0${j+1} · ${esc(v.label)}</b></span></button>`).join('')}</div><div id="v519-process-explanation" class="v518-process-detail" role="region" aria-label="Información del momento seleccionado" aria-live="polite"><span>PASO 0${i+1} DE 3</span><strong>${esc(p.label)}</strong><p>${esc(p.description)}</p></div>`;
 }
 if(state.tab==='relations'){const related=relatedWorks(w).slice(0,4);return `${breadcrumb}<div class="v511-intro-label">RELACIONES TERRITORIALES</div><h2 class="v511-content-title">Ninguna obra existe sola.</h2><p class="content-copy">Esta obra conecta con personas, otros trabajos y territorios. Selecciona un vínculo para continuar descubriendo el atlas.</p><button class="v511-focus-button" data-action="focus-links">${ico('layers',17)} Enfocar todas las relaciones en el mapa ${ico('arrow',16)}</button><div class="v511-section-top"><strong>Persona creadora</strong></div>${creatorLinks(w).map(n=>mapCard('maker',n.it,n.relationship+' · '+n.it.place)).join('')}<div class="v511-section-top"><strong>Otras obras relacionadas</strong><small>Por creador, oficio, material o territorio</small></div>${related.map(r=>mapCard('work',r,relationshipLabel(w,r))).join('')}<div class="v511-section-top"><strong>Encuentros vinculados</strong></div>${w.experienceIds.length?w.experienceIds.map(id=>event(id)).filter(Boolean).map(a=>eventCard(a)).join(''):'<p class="soft-note">No hay encuentros vinculados directamente con esta obra.</p>'}`;}
 return `${breadcrumb}<div class="v511-intro-label">PERSONAS, EXPERIENCIAS Y COMUNIDAD</div><h2 class="v511-content-title">¿Te interesa esta obra o su oficio?</h2><p class="content-copy">La artesanía se comparte. Descubre encuentros y personas con quienes acercarte a esta práctica.</p>${w.experienceIds.length?w.experienceIds.map(id=>event(id)).filter(Boolean).map(a=>eventCard(a)).join(''):`<div class="v511-empty"><strong>Por ahora no hay encuentros vinculados a esta obra.</strong><p>Puedes seguir con las obras relacionadas, conocer a su creador/a o explorar otros oficios en Petorca.</p></div>`}<div class="v511-source">Experiencias y fechas ficticias: no existen reservas ni contacto real en este prototipo.</div>`;
}
function v511Maker(m){
 const works=worksForMaker(m),acts=D.events.filter(a=>a.makerId===m.id);
 return `<figure class="v516-summary-hero v521-maker-hero"><img src="${makerImage(m)}" alt="Imagen demostrativa asociada a ${esc(m.name)}"><figcaption><span class="v511-intro-label">${m.type==='collective'?'AGRUPACIÓN · PERFIL FICTICIO':'CREADOR/A · PERFIL FICTICIO'}</span><h1 class="v511-panel-title v516-summary-title">${esc(m.name)}</h1><div class="v511-tagline"><span><i></i>${esc(m.craft)}</span><span><i></i>${esc(m.place)}</span><span><i></i>${m.type==='collective'?'Agrupación artesanal':'Creador/a individual'}</span></div></figcaption></figure><p class="content-copy v516-compact-copy">${esc(m.bio)}</p>${m.type==='collective'?'':(m.groupIds||[]).length?`<div class="v511-section-top"><strong>Agrupación de la que forma parte</strong></div>${m.groupIds.map(id=>mapCard('maker',maker(id),'Pertenencia colectiva · no implica coautoría')).join('')}`:''}<div class="v511-section-top"><strong>${m.type==='collective'?'Obras atribuidas en coautoría a integrantes':'Obras vinculadas a esta persona'}</strong></div>${m.type==='collective'?`<div class="v518-group-note">Integrantes de la agrupación. Sus obras individuales no se atribuyen automáticamente al colectivo.</div>${m.memberIds.map(id=>mapCard('maker',maker(id),'Integrante de la agrupación')).join('')}`:''}${works.map(w=>mapCard('work',w,w.crafts.join(', '))).join('')}<div class="v511-section-top" id="v511-maker-events"><strong>Experiencias relacionadas</strong></div>${acts.length?acts.map(a=>eventCard(a)).join(''):'<p class="soft-note">Este perfil no tiene encuentros propios registrados en la demostración. Puedes explorar sus obras y vínculos.</p>'}${noteSource(m.source)}`}

function v511Event(a){const m=a.makerId?maker(a.makerId):null;return `<div class="v511-intro-label">ENCUENTRO · CONTINUIDAD DEL RECORRIDO</div><h1 class="v511-panel-title">${esc(a.name)}</h1><div class="v511-event-type">${esc(a.type)} · Actividad ficticia</div><p class="side-lead">${esc(a.description)}</p><div class="v511-facts"><div><small>FECHA</small><strong>${esc(a.date)}</strong></div><div><small>HORARIO</small><strong>${esc(a.time)}</strong></div><div><small>DURACIÓN</small><strong>${esc(a.duration)}</strong></div><div><small>LUGAR</small><strong>${esc(a.place)}, ${esc(a.commune)}</strong></div><div><small>RESPONSABLE</small><strong>${esc(m?m.name:'Organización comunitaria ficticia')}</strong></div></div>${demoEnrollmentIds.has(a.id)?`<div class="v528-event-enroll"><span>INSCRIPCIÓN · DEMOSTRACIÓN</span><p>Prueba cómo sería el proceso de inscripción a este encuentro con datos inventados. No se reserva un cupo ni se envía información.</p><button type="button" class="btn btn-dark v528-event-enroll-button" data-action="demo-enroll" data-id="${a.id}">Simular inscripción ${ico('arrow',18)}</button></div>`:`<div class="v511-next-step"><span>¿QUÉ HARÍAS DESPUÉS?</span><strong>Conocer las condiciones para participar</strong><p>En una actividad real aquí encontrarías el canal oficial de contacto de la organización, las condiciones, la dirección y la disponibilidad. Este prototipo no realiza reservas ni contactos.</p></div>`}${state.journeyRoot?'':`<button class="v511-step-button" data-action="overview">Seguir explorando Petorca ${ico('arrow',16)}</button>`}${noteSource(a.source)}`}
function overviewContent(){const data=state.filter==='work'?D.works:state.filter==='maker'?D.makers:state.filter==='event'?D.events:[...D.works,...D.makers,...D.events];
 const filtered=data.filter(x=>state.craft==='all'||(x.crafts||[x.craft]).includes(state.craft));
 const tabs=[['all','Todos'],['work','Obras'],['maker','Creadores'],['event','Encuentros']];
 return `<div class="eyebrow muted">Caso territorial / 01</div><h1>Provincia de<br>Petorca.</h1><p class="side-lead">Entre el litoral, los valles y las quebradas. Explora cómo distintas obras y personas pueden relacionarse en un mismo territorio.</p><div class="side-counter"><span><strong>15</strong>obras</span><span><strong>11</strong>creadores</span><span><strong>04</strong>encuentros</span></div><div class="side-section-label">¿Qué quieres descubrir?</div><div class="filter-tabs" aria-label="Filtrar puntos del mapa">${tabs.map(([k,v])=>`<button class="filter-tab ${state.filter===k?'active':''}" data-action="filter" data-filter="${k}" aria-pressed="${state.filter===k}">${v}</button>`).join('')}</div><label class="side-section-label" for="craft-filter" style="display:block">Filtrar por oficio</label><select class="filter-select" id="craft-filter" aria-label="Seleccionar oficio"><option value="all">Todos los oficios</option>${D.crafts.map(c=>`<option value="${esc(c)}" ${state.craft===c?'selected':''}>${esc(c)}</option>`).join('')}</select><div class="side-section-label">${filtered.length} elementos en el mapa</div><div class="list-stack">${filtered.length?filtered.map(item=>miniItem(item)).join(''):'<div class="empty-list">No hay elementos que coincidan con este oficio y filtro. Prueba otra combinación.</div>'}</div>${noteSource('Contenido de demostración: obras, personas, testimonios y experiencias ficticios. Las posiciones no son coordenadas verificadas.')}`;
}
function miniItem(it){const isWork=!!it.makerId&&!!it.image, isEvent=!!it.date, type=isWork?'work':isEvent?'event':'maker';return `<button class="mini-item" data-action="select" data-type="${type}" data-id="${it.id}">${isWork?picture(it):`<div class="mini-avatar">${isEvent?ico('calendar',20):ico('person',21)}</div>`}<span style="min-width:0;flex:1"><strong>${esc(it.name)}</strong><small>${esc(isWork?it.crafts.join(' · '):isEvent?it.type:it.craft)} · ${esc(isWork?it.locality:isEvent?it.commune:it.place)}</small></span><span class="chevron">${ico('chev',15)}</span></button>`;}
function workSummary(w){return `<div class="eyebrow muted">Obra situada · Síntesis inicial</div><img class="detail-hero" src="${w.image}" alt="Ilustración demostrativa de ${esc(w.name)}"><h1 class="detail-title">${esc(w.name)}</h1><div class="detail-sub">${ico('person',15)} <strong>${esc(maker(w.makerId).name)}</strong></div><div class="detail-sub">${ico('pin',15)} ${esc(w.locality)} · Provincia de Petorca</div>${craftsTags(w.crafts)}<p class="content-copy">${esc(w.description)}</p><div class="source-strip" style="margin:8px 0 20px"><strong>Ubicación en el mapa</strong><br>Vínculo territorial ilustrativo. No indica la localización física actual de la pieza.</div><button class="btn btn-dark full" data-action="open-detail">Conocer contexto y relaciones ${ico('arrow')}</button><button class="btn btn-outline full" style="margin-top:8px" data-action="back-overview">Seguir explorando el mapa</button>`;}
function workDetail(w){let head=`<div class="eyebrow muted">Obra / ${esc(w.crafts.join(' · '))}</div><h1 class="detail-title">${esc(w.name)}</h1><div class="detail-sub">${ico('person',15)} <strong>${esc(maker(w.makerId).name)}</strong> · ${esc(w.locality)}</div><div class="detail-nav" role="tablist" aria-label="Contenido de la obra">${[['context','Contexto'],['process','Proceso'],['relations','Relaciones'],['approach','Acercamiento']].map(([k,t])=>`<button role="tab" aria-selected="${state.tab===k}" class="${state.tab===k?'active':''}" data-action="tab" data-tab="${k}">${t}</button>`).join('')}</div>`;
 if(state.tab==='context')head+=contextContent(w);
 if(state.tab==='process')head+=processContent(w);
 if(state.tab==='relations')head+=relationsContent(w);
 if(state.tab==='approach')head+=approachContent(w);
 return head;
}
function contextContent(w){return `<div class="eyebrow muted">Su forma, sus materiales y su lugar</div><img class="detail-hero" src="${w.image}" alt="Ilustración generada de ${esc(w.name)}"><h2 class="section-subtitle">Una pieza, múltiples historias</h2><p class="content-copy">${esc(w.description)} ${esc(w.territory)}</p><div class="fact-grid"><div class="fact"><span>Creador/a</span><strong>${esc(maker(w.makerId).name)}</strong></div><div class="fact"><span>Oficio${w.crafts.length>1?'s':''}</span><strong>${esc(w.crafts.join(', '))}</strong></div><div class="fact"><span>Material${w.materials.length>1?'es':''}</span><strong>${esc(w.materials.join(', '))}</strong></div><div class="fact"><span>Técnica</span><strong>${esc(w.technique)}</strong></div><div class="fact"><span>Territorio vinculado</span><strong>${esc(w.locality)}, ${esc(w.commune)}</strong></div><div class="fact"><span>Ubicación</span><strong>Referencia territorial simulada</strong></div></div><div class="callout">${esc(w.testimony)}<div class="small" style="font:11px var(--sans);margin-top:9px">— Testimonio ficticio de ${esc(maker(w.makerId).name)}</div></div><div class="source-strip"><strong>Autoría</strong><br>${esc(w.authorship)} · ${esc(maker(w.makerId).name)}<br><br><strong>Procedencia de la información</strong><br>${esc(w.source)}</div><div style="height:14px"></div><button class="btn btn-dark full" data-action="tab" data-tab="process">Ver cómo se realiza ${ico('arrow')}</button>`;}
function processContent(w){return `<div class="eyebrow muted">Proceso material e historia</div><h2 class="section-subtitle">De la materia a la forma</h2><p class="content-copy">Esta obra se plantea como un ejemplo de <strong>${esc(w.technique.toLowerCase())}</strong>. Su ficha permite observar la secuencia de trabajo y la importancia del material.</p><div class="process-grid"><figure><img src="${w.processImage}" alt="Ilustración generada del material y su preparación"><figcaption>01 · Materia y preparación</figcaption></figure><figure><img src="${w.image}" alt="Ilustración generada del resultado artesanal"><figcaption>02 · Forma y resultado</figcaption></figure></div><div class="fact-grid"><div class="fact"><span>Materiales</span><strong>${esc(w.materials.join(' · '))}</strong></div><div class="fact"><span>Proceso</span><strong>${esc(w.technique)}</strong></div></div><h2 class="section-subtitle">Un relato de la pieza</h2><p class="content-copy">${esc(w.history)}</p><div class="callout">${esc(w.testimony)}<div class="small" style="font:11px var(--sans);margin-top:9px">— Relato ficticio para evaluación UX</div></div>${noteSource('Ilustraciones y narrativa generadas para el prototipo. No son fotografías de un proceso real ni declaraciones documentadas.')}<div style="height:13px"></div><button class="btn btn-dark full" data-action="tab" data-tab="relations">Explorar sus relaciones ${ico('arrow')}</button>`;}
function profileHeroCard(m,label){return `<button class="v521-profile-card" data-action="select" data-type="maker" data-id="${m.id}"><img src="${makerImage(m)}" alt="Imagen demostrativa asociada a ${esc(m.name)}"><span class="v521-profile-overlay"><small>${esc(label)}</small><strong>${esc(m.name)}</strong><em>${esc(m.craft)} · ${esc(m.place)}</em></span>${ico('arrow',16)}</button>`;}
function mapCard(type,it,label){const isWork=type==='work';return `<button class="related-card" data-action="select" data-type="${type}" data-id="${it.id}">${isWork?picture(it):`<span class="rel-symbol">${ico(type==='maker'?(it.type==='collective'?'layers':'person'):type==='event'?'calendar':'layers')}</span>`}<span style="flex:1"><strong>${esc(it.name)}</strong><span>${esc(label)}</span></span>${ico('chev',15)}</button>`;}
function relationFigure(w){const nodes=[{type:'maker',id:w.makerId,name:maker(w.makerId).name,x:16,y:24},{type:'craft',id:w.crafts[0],name:w.crafts[0],x:78,y:21},{type:'material',id:w.materials[0],name:w.materials[0],x:15,y:76}];
 const rel=relatedWorks(w);if(rel.length)nodes.push({type:'work',id:rel[0].id,name:rel[0].name,x:78,y:74});const a=event(w.experienceIds[0]);if(a)nodes.push({type:'event',id:a.id,name:a.name,x:52,y:92});
 return `<div class="relation-map" aria-label="Diagrama interactivo de relaciones de la obra"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${nodes.map(n=>`<line x1="50" y1="48" x2="${n.x}" y2="${n.y}" stroke="#7e9684" stroke-width=".55" stroke-dasharray="1.8 1.5"/>`).join('')}</svg><div class="relation-obj center" style="left:50%;top:48%"><img src="${w.image}" alt=""></div>${nodes.map(n=>`<button class="relation-obj ${n.type==='work'?'other':n.type}" style="left:${n.x}%;top:${n.y}%" data-action="relation" data-type="${n.type}" data-id="${esc(n.id)}" aria-label="Explorar relación: ${esc(n.name)}">${n.type==='work'?`<img src="${work(n.id).image}" alt="">`:n.type==='maker'?'Creador':n.type==='event'?'Taller':esc(n.name.length>16?n.name.slice(0,15)+'…':n.name)}</button>`).join('')}<div class="relation-caption">Selecciona un nodo para continuar</div></div>`;}
function relationsContent(w){const rel=relatedWorks(w),m=maker(w.makerId);return `<div class="eyebrow muted">Navegación no lineal</div><h2 class="section-subtitle">Una red de conexiones</h2><p class="content-copy">La obra conecta con personas, materiales, oficios y otras piezas. En el mapa se trazan vínculos entre los elementos que tienen referencia territorial.</p>${relationFigure(w)}<div class="side-section-label">Creador y oficios</div>${mapCard('maker',m,m.craft+' · '+m.place)}<div class="tag-line">${w.crafts.map(c=>`<button class="pill" style="border:0" data-action="focus-craft" data-craft="${esc(c)}">${esc(c)} ${ico('arrow',12)}</button>`).join('')}${w.materials.map(mat=>`<button class="pill" style="border:0" data-action="focus-material" data-material="${esc(mat)}">${esc(mat)} ${ico('arrow',12)}</button>`).join('')}</div><div class="side-section-label">Obras relacionadas · ${rel.length}</div>${rel.slice(0,5).map(r=>mapCard('work',r,relationshipLabel(w,r))).join('')}${!rel.length?'<p class="soft-note">No se encontraron otras obras relacionadas en esta demostración.</p>':''}<button class="btn btn-dark full" style="margin-top:15px" data-action="tab" data-tab="approach">¿Cómo acercarse a este oficio? ${ico('arrow')}</button>`;}
function relationshipLabel(a,b){let r=[];if(a.makerId===b.makerId)r.push('Mismo creador');if(a.crafts.some(c=>b.crafts.includes(c)))r.push('Oficio compartido');if(a.materials.some(c=>b.materials.includes(c)))r.push('Material en común');if(a.commune===b.commune)r.push('Mismo territorio');return r.slice(0,2).join(' · ');}
function approachContent(w){const e=w.experienceIds.map(event).filter(Boolean);return `<div class="eyebrow muted">Vincularse con el oficio</div><h2 class="section-subtitle">Del descubrimiento al encuentro</h2><p class="content-copy">Conocer una obra también puede llevar a una actividad, una demostración o un taller. Aquí puedes comprender qué opciones existen y qué pasos seguir.</p>${e.length?e.map(a=>eventCard(a)).join(''):`<div class="empty-state">${ico('info',24)}<h3>Por ahora no hay experiencias vinculadas a esta obra</h3><p>Esto no significa que el oficio no esté activo. Puedes seguir con otras obras, conocer al creador o explorar el territorio.</p><button class="btn btn-outline full" data-action="tab" data-tab="relations">Explorar relaciones ${ico('arrow')}</button><div style="height:8px"></div><button class="btn btn-outline full" data-action="select" data-type="maker" data-id="${w.makerId}">Conocer al creador ${ico('arrow')}</button></div>`}<div class="source-strip"><strong>Importante</strong><br>Encuentros, lugares, cupos y fechas son simulados. No se efectúan reservas ni contactos desde el prototipo.</div><div style="height:13px"></div><button class="btn btn-outline full" data-action="back-overview">Volver al territorio ${ico('map')}</button>`;}
function eventCard(a){return `<article class="event-card"><div class="event-type">${esc(a.type)} · Actividad simulada</div><h3>${esc(a.name)}</h3><div class="event-meta"><span>${ico('calendar')} ${esc(a.date)} · ${esc(a.time)}</span><span>${ico('pin')} ${esc(a.commune)} · ${esc(a.place)}</span><span>${ico('clock')} ${esc(a.duration)}</span></div><p>${esc(a.description)}</p><button class="btn btn-outline full btn-sm" data-action="select" data-type="event" data-id="${a.id}">Conocer los pasos siguientes ${ico('arrow')}</button></article>`;}
function makerContent(m){const items=D.works.filter(w=>w.makerId===m.id);const events=D.events.filter(a=>a.makerId===m.id);return `<div class="eyebrow muted">Creador/a · Perfil demostrativo</div><h1>${esc(m.name)}</h1><div class="detail-sub">${ico('pin',15)} ${esc(m.place)} · Provincia de Petorca</div>${craftsTags([m.craft])}<div class="callout">${esc(m.bio)}</div><h2 class="section-subtitle">Sus obras en el atlas</h2>${items.map(w=>mapCard('work',w,w.crafts.join(', '))).join('')}<h2 class="section-subtitle">Encuentros vinculados</h2>${events.length?events.map(a=>eventCard(a)).join(''):'<div class="empty-state"><h3>Sin encuentros asociados</h3><p>No hay actividades demostrativas vinculadas a este perfil. Puedes visitar otras obras relacionadas.</p><button class="btn btn-outline" data-action="back-overview">Explorar el territorio</button></div>'}${noteSource(m.source)}`;}
function eventContent(a){const m=a.makerId?maker(a.makerId):null;const linkWorks=D.works.filter(w=>w.experienceIds.includes(a.id));return `<div class="eyebrow muted">${esc(a.type)} · Experiencia situada</div><h1>${esc(a.name)}</h1><p class="side-lead">${esc(a.description)}</p>${craftsTags(a.crafts)}<div class="event-meta" style="padding:12px 0"><span>${ico('calendar')} ${esc(a.date)} · ${esc(a.time)}</span><span>${ico('clock')} ${esc(a.duration)}</span><span>${ico('pin')} ${esc(a.place)}, ${esc(a.commune)}</span><span>${ico('person')} ${esc(m?m.name:'Organización comunitaria ficticia')}</span></div><div class="side-section-label">¿Cómo continuar?</div><div class="empty-state"><h3>Antes de participar</h3><p>Este encuentro es un ejemplo simulado. En una plataforma real aquí encontrarías una organización verificable, condiciones de participación y un canal de contacto.</p><p><strong>No se realizan reservas ni inscripciones en este prototipo.</strong></p></div><h2 class="section-subtitle">Obras relacionadas con este encuentro</h2>${linkWorks.slice(0,5).map(w=>mapCard('work',w,w.crafts.join(', '))).join('')}${noteSource(a.source)}<div style="height:13px"></div><button class="btn btn-outline full" data-action="back-overview">Seguir explorando el mapa ${ico('map')}</button>`;}
function errorContent(){return `<div class="eyebrow muted">Estado alternativo · Demostración</div><div class="error-state">${ico('info',26)}<h3>No pudimos mostrar esta información</h3><p>Hubo un problema temporal al preparar la ficha del elemento seleccionado. Tu posición y el caso territorial siguen disponibles.</p><button class="btn btn-dark full" data-action="retry">Intentar nuevamente ${ico('refresh')}</button><button class="btn btn-outline full" style="margin-top:9px" data-action="back-overview">Volver al territorio ${ico('map')}</button></div><p class="soft-note">Esta falla es simulada para comprobar cómo responde el prototipo ante errores.</p>`;}
function updatePreview(){const root=$('#map-preview');if(!root)return;const it=selected();if(!it||state.loading||state.error||state.type!=='work'){root.innerHTML='';return}root.innerHTML=`<div class="map-preview"><img src="${it.image}" alt=""><div><p>${esc(it.locality)} · ${esc(it.crafts[0])}</p><strong>${esc(it.name)}</strong></div><button data-action="open-detail" aria-label="Abrir detalle de ${esc(it.name)}">${ico('arrow',15)}</button></div>`;}
function nodeVisible(t,it){return (state.activeCrafts||D.crafts).some(c=>itemCrafts(it).includes(c))&&(state.zone==='Todas'||(t==='maker'?it.place:it.commune)===state.zone);}
function mapNodes(){return [...D.works.map(w=>({type:'work',it:w})),...D.makers.map(m=>({type:'maker',it:m})),...(D.collectives||[]).map(it=>({type:'maker',it})),...D.events.map(a=>({type:'event',it:a}))];}
function connectedNodes(){if(!state.id)return [];
 if(state.type==='work'){const w=work(state.id);return [...creatorLinks(w),...relatedWorks(w).slice(0,5).map(it=>({type:'work',it})),...w.experienceIds.map(id=>({type:'event',it:event(id)})).filter(n=>n.it)];}
 if(state.type==='maker'){const m=maker(state.id);return [...D.works.filter(w=>((w.makerIds||[w.makerId]).includes(state.id)||(w.collectiveIds||[]).includes(state.id))).map(it=>({type:'work',it})),...(m?.type==='collective'?m.memberIds.map(id=>({type:'maker',it:maker(id)})):[])];}
 if(state.type==='event')return D.works.filter(w=>w.experienceIds.includes(state.id)).map(it=>({type:'work',it}));return [];
}
function updateMapFilters(){const f=$('#v511-craft-toolbar'),z=$('#v511-zone-bar');if(f)f.innerHTML=craftToolbar();if(z)z.innerHTML=zonesBar();}
function renderMarkers(){const pins=$('#pins-layer'),con=$('.map-connection-layer');if(!pins||!con)return;
 const origin=state.journeyRoot&&work(state.journeyRoot);const stage=journeyStage();const allRelations=origin&&state.type!=='work'?([...creatorLinks(origin),...relatedWorks(origin).slice(0,5).map(it=>({type:'work',it})),...origin.experienceIds.map(id=>({type:'event',it:event(id)})).filter(n=>n.it)]):connectedNodes();
 const conn=origin&&stage>=0?(stage===0?[]:stage===1?creatorLinks(origin):stage===2?[]:stage===3?origin.experienceIds.map(id=>({type:'event',it:event(id)})).filter(n=>n.it):allRelations):allRelations;
 const related=new Set(conn.map(n=>n.type+':'+n.it.id)),selKey=state.type+':'+state.id;
 const all=mapNodes(),visible=all.filter(n=>nodeVisible(n.type,n.it)||n.type+':'+n.it.id===selKey||(origin&&n.type==='work'&&n.it.id===origin.id)||(related.has(n.type+':'+n.it.id)&&!!origin));
 // A low-zoom cluster groups nearby unselected markers while keeping work/type semantics readable.
 let groups=[];const r=$('#map-wrap')?.getBoundingClientRect(),vw=r?.width||900,vh=r?.height||650;
 const px=n=>({x:(n.it.x/1000)*vw*state.scale,y:(n.it.y/720)*vh*state.scale});
 for(const n of visible){const key=n.type+':'+n.it.id;if(state.scale<1.48&&key!==selKey&&!(origin&&key==='work:'+origin.id)&&!related.has(key)){
 const q=px(n);const g=groups.find(g=>g.length&&!g.some(x=>x.type+':'+x.it.id===selKey)&&Math.hypot(px(g[0]).x-q.x,px(g[0]).y-q.y)<42);
 if(g){g.push(n);continue;}}
 groups.push([n]);}
 const marker=n=>{const t=n.type,it=n.it;const active=selKey===t+':'+it.id,linked=related.has(t+':'+it.id),originMarker=origin&&t==='work'&&it.id===origin.id;const c=colorFor(it);
 const ring=itemCrafts(it).length>1?`style="--marker:${c};--marker-alt:${craftColors[itemCrafts(it)[1]]||c}"`:`style="--marker:${c};--marker-alt:${c}"`;
 return `<button class="v511-pin v511-${t} ${active?'is-active':''} ${originMarker?'is-origin':''} ${linked?'is-linked':''} ${state.id&&!active&&!linked?'is-distant':''} ${origin&&stage>=0&&!active&&!linked&&!originMarker?'v515-background':''} ${t==='maker'&&it.type==='collective'?'v518-collective':''}" data-action="select" data-type="${t}" data-id="${it.id}" style="left:${it.x/10}%;top:${it.y/7.2}%" aria-label="${typeNames[t]}: ${esc(it.name)}" ${t==='work'?'':`title="${esc(it.name)}"`}><span class="v511-pin-art" ${ring}><svg viewBox="0 0 36 36" aria-hidden="true">${shapeSvg(t)}</svg>${t==='work'?'<i class="v511-dot-center"></i>':it.type==='collective'?'<i class="v518-group-glyph" aria-hidden="true">●●</i>':''}</span>${t==='work'?`<span class="v514-pin-preview" aria-hidden="true"><img src="${it.image}" alt=""></span>`:`<span class="v511-pin-label">${esc(it.name)}</span>`}</button>`;
 };
 pins.innerHTML=groups.map(g=>g.length===1?marker(g[0]):`<button class="v511-pin v511-cluster" data-action="cluster" data-x="${g[0].it.x}" data-y="${g[0].it.y}" style="left:${g.reduce((s,n)=>s+n.it.x,0)/g.length/10}%;top:${g.reduce((s,n)=>s+n.it.y,0)/g.length/7.2}%" aria-label="Acercar grupo de ${g.length} elementos"><span>${g.length}</span></button>`).join('');
 const center=origin||selected();con.innerHTML=!center?'':conn.filter(n=>n.it).map(({type,it},i)=>{
 if(it.type==='collective'&&origin){return it.memberIds.filter(id=>(origin.makerIds||[origin.makerId]).includes(id)).map(id=>{const m=maker(id);return `<path d="M${m.x},${m.y} Q${(m.x+it.x)/2},${(m.y+it.y)/2-18} ${it.x},${it.y}" fill="none" stroke="#4f7d69" stroke-width="1.3" stroke-dasharray="5 5" opacity=".9" vector-effect="non-scaling-stroke"/>`}).join('');}
 const mX=(center.x+it.x)/2,curve=12+((i%3)-1)*23;return `<path d="M${center.x},${center.y} Q${mX},${(center.y+it.y)/2+curve} ${it.x},${it.y}" fill="none" stroke="${type==='maker'?'#397E70':type==='event'?'#A3674F':'#AA8563'}" stroke-width="${type==='event'?1.45:1.1}" stroke-dasharray="${type==='work'?'3 6':'none'}" stroke-linecap="round" opacity="${type==='work'?.57:.72}" vector-effect="non-scaling-stroke"/>`}).join('');
 const status=$('#v511-map-status');if(status){const count=visible.length;status.textContent=origin&&stage>=0?(['Obra elegida · punto destacado','Creador/a · vínculo con la obra','Proceso · selecciona materia, técnica o resultado sobre el mapa','Encuentro · experiencias vinculadas','Vínculos · relaciones para seguir explorando'][stage])+(stage===3&&!conn.length?' · sin encuentros asociados':''):state.id?`${typeNames[state.type]} seleccionada · ${conn.length} relaciones visibles`:`${count} elementos en esta vista · ubicaciones ficticias`;}
 updateMapFilters();applyMapTransform();renderProcessLens();
}
function renderProcessLens(){
 const root=$('#v518-process-layer'),wrap=$('#map-wrap');if(!root)return;
 const origin=state.journeyRoot&&work(state.journeyRoot);
 if(!origin||journeyStage()!==2){root.innerHTML='';root.hidden=true;wrap?.classList.remove('process-fixed');return;}
 const step=Math.max(0,Math.min(2,state.processStep||0));root.hidden=false;wrap?.classList.add('process-fixed');
 root.innerHTML=`<div class="v518-orbit-note">PROCESO · CAPA EXPLICATIVA</div><div class="v518-process-orbit" aria-label="Seleccionar un momento del proceso">${origin.processSteps.map((p,i)=>`<button type="button" class="v518-orbit-node v518-orbit-node-${i} ${step===i?'is-current':''}" data-action="process-step" data-origin="map" data-step="${i}" aria-pressed="${step===i}" aria-label="Proceso, ${p.label}"><span class="v518-orbit-thumb"><img src="${p.image}" alt=""></span><span class="v518-orbit-label">${p.label}</span></button>`).join('')}<span class="v518-orbit-center" aria-hidden="true"></span></div><div class="v518-orbit-footnote">Referencias del hacer, no lugares geográficos</div>`;
}
function focusAllRelations(){state.focusToken=(state.focusToken||0)+1;const root=$('#map-wrap'),source=selected();if(!root||!source)return;state.focusRelations=true;state.zone='Todas';let n=[source,...connectedNodes().map(x=>x.it)].filter(Boolean);const minX=Math.min(...n.map(x=>x.x)),maxX=Math.max(...n.map(x=>x.x)),minY=Math.min(...n.map(x=>x.y)),maxY=Math.max(...n.map(x=>x.y));const spanX=Math.max(170,maxX-minX),spanY=Math.max(170,maxY-minY);state.scale=Math.max(1,Math.min(2.7,Math.min(780/spanX,530/spanY)));const mid={x:(minX+maxX)/2,y:(minY+maxY)/2};state.tx=-(mid.x/1000-.5)*root.clientWidth*state.scale;state.ty=-(mid.y/720-.5)*root.clientHeight*state.scale;renderMarkers();applyMapTransform();glideMap();}
function focusZone(zone){const q=zoneViews[zone];if(!q)return;state.zone=zone;state.focusRelations=false;state.scale=q.z;const root=$('#map-wrap');if(root){state.tx=-(q.x/1000-.5)*root.clientWidth*q.z;state.ty=-(q.y/720-.5)*root.clientHeight*q.z;}renderMarkers();renderSidebar(false);applyMapTransform();glideMap();}
function focusPoint(it,quick=false){if(!it||!$('#map-wrap'))return;
 const wrap=$('#map-wrap'),{width:w,height:h}=wrap.getBoundingClientRect();
 // A point near an edge needs a closer zoom to sit near the viewport center without empty margins.
 const px=it.x/1000,py=it.y/720;
 const centerScale=Math.max(1/(2*Math.min(px,1-px)),1/(2*Math.min(py,1-py)));
 const nextScale=Math.min(3.5,Math.max(state.scale,centerScale*1.012));
 if(nextScale>state.scale+.002){state.scale=nextScale;renderMarkers();}
 state.tx=-(px-.5)*w*state.scale;state.ty=-(py-.5)*h*state.scale;
 applyMapTransform();if(!quick)glideMap();
}
function applyMapTransform(){const elem=$('#map-world'),wrap=$('#map-wrap');if(!elem||!wrap)return;const maxX=Math.max(0,(state.scale-1)*wrap.clientWidth/2),maxY=Math.max(0,(state.scale-1)*wrap.clientHeight/2);state.tx=Math.min(maxX,Math.max(-maxX,state.tx));state.ty=Math.min(maxY,Math.max(-maxY,state.ty));elem.style.transform=`translate(${state.tx}px,${state.ty}px) scale(${state.scale})`;elem.style.setProperty('--pin-inverse',String(1/state.scale));}
function zoomMap(factor,clientX=null,clientY=null){const elem=$('#map-wrap');if(!elem)return;const r=elem.getBoundingClientRect();const px=clientX===null?r.width/2:clientX-r.left,py=clientY===null?r.height/2:clientY-r.top;const prev=state.scale;const next=Math.max(1,Math.min(3.5,prev*factor));const ratio=next/prev;state.tx=px-r.width/2+(state.tx-(px-r.width/2))*ratio;state.ty=py-r.height/2+(state.ty-(py-r.height/2))*ratio;state.scale=next;applyMapTransform();renderMarkers();glideMap();}
function bindMapInteractions(){const map=$('#map-wrap'),world=$('#map-world');if(!map||!world)return;
 map.addEventListener('wheel',e=>{if(map.classList.contains('process-fixed')){e.preventDefault();return;}e.preventDefault();zoomMap(e.deltaY<0?1.14:.88,e.clientX,e.clientY)},{passive:false});
 world.addEventListener('pointerdown',e=>{if(map.classList.contains('process-fixed')||e.target.closest('button'))return;world.classList.remove('is-gliding');pointerDown={x:e.clientX,y:e.clientY,tx:state.tx,ty:state.ty,id:e.pointerId};world.setPointerCapture(e.pointerId);world.classList.add('dragging')});
 world.addEventListener('pointermove',e=>{if(!pointerDown||e.pointerId!==pointerDown.id)return;state.tx=pointerDown.tx+e.clientX-pointerDown.x;state.ty=pointerDown.ty+e.clientY-pointerDown.y;applyMapTransform()});
 const clear=e=>{pointerDown=null;world.classList.remove('dragging')};world.addEventListener('pointerup',clear);world.addEventListener('pointercancel',clear);
 let firstTouchDistance=0,firstZoom=1;
 map.addEventListener('touchstart',e=>{if(e.touches.length===2){firstTouchDistance=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);firstZoom=state.scale;pointerDown=null}}, {passive:true});
 map.addEventListener('touchmove',e=>{if(e.touches.length!==2||!firstTouchDistance)return;e.preventDefault();const dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);const target=Math.max(1,Math.min(3.5,firstZoom*dist/firstTouchDistance));zoomMap(target/state.scale,(e.touches[0].clientX+e.touches[1].clientX)/2,(e.touches[0].clientY+e.touches[1].clientY)/2)}, {passive:false});
}
function choose(type,id,{remember=true,phase='summary'}={}){const isSame=state.type===type&&state.id===id&&state.phase===phase;if(isSame&&state.error===false)return;
 if(remember&&state.id)state.history.push({type:state.type,id:state.id,phase:state.phase,tab:state.tab,journeyRoot:state.journeyRoot,journeyVisited:[...(state.journeyVisited||[])]});
 if(type==='work'&&id!==state.journeyRoot){state.journeyRoot=id;state.journeyVisited=new Set([0]);}
 else if(type==='maker'&&state.journeyRoot&&!creatorLinks(work(state.journeyRoot)).some(n=>n.it.id===id)){state.journeyRoot=null;state.journeyVisited=new Set();}
 else if(type==='event'&&state.journeyRoot&&!work(state.journeyRoot)?.experienceIds.includes(id)){state.journeyRoot=null;state.journeyVisited=new Set();}
 state.type=type;state.id=id;state.phase=phase;state.tab='context';state.error=false;state.loading=true;state.focusRelations=false;state.sheet='medium';state.request++;const thisRequest=state.request;renderSidebar();renderMarkers();focusPoint(selected());
 setTimeout(()=>{if(thisRequest!==state.request||state.page!=='explore')return;state.loading=false;renderSidebar();renderMarkers();if(selected())keepSelectionCentered(`${state.type}:${state.id}`)},260);
}
function navigateBack(){if(state.history.length){const last=state.history.pop();state.type=last.type;state.id=last.id;state.phase=last.phase;state.tab=last.tab;state.journeyRoot=last.journeyRoot||null;state.journeyVisited=new Set(last.journeyVisited||[]);state.error=state.loading=false;state.request++;renderSidebar();renderMarkers();if(selected())keepSelectionCentered(`${state.type}:${state.id}`);}else{state.id=null;state.type=null;state.journeyRoot=null;state.journeyVisited=new Set();state.phase='summary';state.tab='context';state.error=state.loading=false;state.request++;renderSidebar();renderMarkers();}}
function openDetail(){if(state.type!=='work')return;state.phase='detail';state.tab='context';state.error=false;renderSidebar();renderMarkers();}
function setTab(tab){state.tab=tab;state.phase='detail';if(tab==='relations')state.focusRelations=true;if(state.sheet==='collapsed')state.sheet='medium';renderSidebar();renderMarkers();}
function useRelation(type,id){if(type==='craft'){state.filter='work';state.craft=id;state.type=null;state.id=null;state.history=[];renderSidebar();renderMarkers();toast('Mostrando obras del oficio «'+id+'»');return;}if(type==='material'){const matches=D.works.filter(w=>w.materials.includes(id));state.type=null;state.id=null;state.history=[];state.filter='work';state.craft='all';renderSidebar();renderMarkers();const el=$('#side-scroll');if(el)el.insertAdjacentHTML('afterbegin',`<div class="source-strip"><strong>Material compartido: ${esc(id)}</strong><br>${matches.length} obras contienen este material. Selecciona una pieza en el mapa o el listado.</div>`);toast('Se destacan las obras que comparten «'+id+'»');const related=new Set(matches.map(w=>w.id));$$('.map-pin.art').forEach(b=>b.classList.toggle('dim',!related.has(b.dataset.id)));return;}choose(type,id)}
function toast(msg){const root=$('#toast-root');root.innerHTML=`<div class="toast">${esc(msg)}</div>`;setTimeout(()=>{if(root.textContent===msg)root.innerHTML=''},3200)}
// Al activar una etapa desde el mapa, conectar inmediatamente ese punto con su explicación.
function revealProcessExplanation(){
 const mobile=window.matchMedia('(max-width:740px)').matches;
 if(state.sheet==='collapsed'){
  state.sheet='medium';
  renderSidebar(false); // Reponer la cabecera y el cierre del panel cuando estaba oculto.
 }
 const origin=state.journeyRoot,step=state.processStep;
 setTimeout(()=>{
  if(state.page!=='explore'||state.journeyRoot!==origin||state.processStep!==step||journeyStage()!==2)return;
  const panel=$('#side-scroll'),detail=panel?.querySelector?.('#v519-process-explanation');
  if(!panel||!detail)return;
  const panelRect=panel.getBoundingClientRect(),targetRect=detail.getBoundingClientRect();
  const top=Math.max(0,panel.scrollTop+targetRect.top-panelRect.top-14);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(typeof panel.scrollTo==='function')panel.scrollTo({top,behavior:reduced?'instant':'smooth'});
  else panel.scrollTop=top;
  detail.classList.remove('v519-process-focus');
  void detail.offsetWidth;
  detail.classList.add('v519-process-focus');
 },mobile?80:50);
}
const $$=s=>[...document.querySelectorAll(s)];
document.addEventListener('click',e=>{const btn=e.target.closest('[data-action]');if(!btn)return;const a=btn.dataset.action;
 if(a==='close-modal'&&e.target.closest('.dialog-card')&&btn.classList.contains('dialog-backdrop'))return;
 switch(a){
 case 'home':closeModal();state.page='home';home();window.scrollTo(0,0);break;
 case 'explore':explore();break;
 case 'overview':explore();break;
 case 'territory-toggle':toggleTerritoryMenu();break;
 case 'territory-select':toggleTerritoryMenu(false);if(btn.dataset.territory==='petorca')explore();else toast('Este territorio es un caso de demostración sin cartografía disponible. Puedes continuar explorando Petorca.');break;
 case 'open-territory':displayModal();break;
 case 'home-work':arrangeHome('petorca',btn.dataset.id);break;
 case 'v51-work':arrangeHome(btn.dataset.case,btn.dataset.id);break;
 case 'v54-menu':toggleHomeCaseMenu();break;
 case 'v54-case':chooseHomeCase(btn.dataset.case);break;
 case 'v51-case':break;
 case 'v51-reset':resetHome();break;
 case 'v51-territories':break;
 case 'v51-enter':explore(state.homeWork?{type:'work',id:state.homeWork,phase:'summary'}:{});break;
 case 'v51-guide':break;
 case 'confirm-territory':{const id=state.modal!=='territory'?state.modal:null;explore(id?{type:'work',id,phase:'summary'}:{});break}
 case 'close-modal':if(state.modal==='map-guide')dismissMapIntro();else closeModal();break;
 case 'guide-dismiss':dismissMapIntro();break;
 case 'demo-enroll':showDemoEnrollment(btn.dataset.id);break;
 case 'slide-next':break;
 case 'slide-prev':break;
 case 'select':choose(btn.dataset.type,btn.dataset.id);break;
 case 'journey-go':journeyGo(btn.dataset.step);break;
 case 'process-step':if(state.journeyRoot&&journeyStage()===2){state.processStep=Math.max(0,Math.min(2,Number(btn.dataset.step)));renderSidebar(false);renderProcessLens();const rootWork=work(state.journeyRoot);if(rootWork)focusPoint(rootWork,true);if(btn.dataset.origin==='map')revealProcessExplanation();}break;
 case 'back-overview':navigateBack();break;
 case 'open-detail':openDetail();break;
 case 'tab':setTab(btn.dataset.tab);break;
 case 'filter':state.filter=btn.dataset.filter;state.type=state.id=null;state.history=[];renderSidebar(false);renderMarkers();break;
 case 'relation':useRelation(btn.dataset.type,btn.dataset.id);break;
 case 'focus-craft':useRelation('craft',btn.dataset.craft);break;
 case 'focus-material':useRelation('material',btn.dataset.material);break;
 case 'zoom-in':zoomMap(1.3);break;
 case 'zoom-out':zoomMap(1/1.3);break;
 case 'map-reset':state.zone='Todas';state.scale=1.12;state.tx=state.ty=0;state.focusRelations=false;renderMarkers();renderSidebar(false);applyMapTransform();glideMap();break;
 case 'cluster':{state.scale=Math.min(3.5,Math.max(1.7,state.scale*1.5));const w=$('#map-wrap');state.tx=-(Number(btn.dataset.x)/1000-.5)*w.clientWidth*state.scale;state.ty=-(Number(btn.dataset.y)/720-.5)*w.clientHeight*state.scale;renderMarkers();glideMap();break;}
 case 'craft-toggle':{const c=btn.dataset.craft;state.activeCrafts=state.activeCrafts.includes(c)?state.activeCrafts.filter(x=>x!==c):[...state.activeCrafts,c];renderMarkers();if(!state.id)renderSidebar(false);break;}
 case 'craft-expand':state.craftsOpen=!state.craftsOpen;updateMapFilters();break;
 case 'craft-reset':state.activeCrafts=[...D.crafts];renderMarkers();if(!state.id)renderSidebar(false);break;
 case 'zone-expand':state.zoneOpen=!state.zoneOpen;updateMapFilters();break;
 case 'zone':state.zoneOpen=false;focusZone(btn.dataset.zone);break;
 case 'focus-links':if(state.journeyRoot)journeyGo(4);else focusAllRelations();break;
 case 'view-links':setTab('relations');focusAllRelations();break;
 case 'show-approach':if(state.journeyRoot)journeyGo(3);else setTab('approach');break;
 case 'maker-approach':{$('#v511-maker-events')?.scrollIntoView({block:'nearest',behavior:'smooth'});break;}
 case 'sheet-toggle':if(window.matchMedia('(max-width:740px)').matches||btn.dataset.wasDragged==='yes')break;state.sheet=state.sheet==='expanded'?'medium':'expanded';$('#side-panel')?.setAttribute('data-sheet',state.sheet);updateSheetControls();break;
 case 'panel-close':state.sheet='collapsed';renderSidebar(false);break;
 case 'panel-open':state.sheet='medium';renderSidebar(false);break;

 case 'simulate-error':state.error=true;state.loading=false;renderSidebar();break;
 case 'retry':state.error=false;state.loading=true;renderSidebar();setTimeout(()=>{state.loading=false;renderSidebar()},380);break;
 }
});
document.addEventListener('click',e=>{if(state.page==='home'&&!e.target.closest('.v54-case-nav'))toggleHomeCaseMenu(false);if(state.page==='explore'&&!e.target.closest('.v515-territory-nav'))toggleTerritoryMenu(false);if(state.page==='explore'&&state.zoneOpen&&!e.target.closest('#v511-zone-bar')&&!e.target.closest('[data-action="zone-expand"]')){state.zoneOpen=false;updateMapFilters();}});
document.addEventListener('submit',e=>{if(e.target.id==='v528-enroll-form'){e.preventDefault();submitDemoEnrollment(e.target)}});
document.addEventListener('change',e=>{if(e.target.id==='craft-filter'){state.craft=e.target.value;state.type=state.id=null;state.history=[];renderSidebar(false);renderMarkers()}});
document.addEventListener('keydown',e=>{if(state.modal==='map-guide'&&e.key==='Tab'){const modal=$('.v529-map-guide');const items=[...modal.querySelectorAll('button')];const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}return}if(e.key==='Escape'&&state.page==='home'&&!$('#v54-case-menu')?.hidden){toggleHomeCaseMenu(false);$('#v54-case-toggle')?.focus();return}if(e.key==='Escape'&&state.page==='explore'&&state.zoneOpen){state.zoneOpen=false;updateMapFilters();$('#v511-zone-bar .v523-zone-toggle')?.focus();return}if(e.key==='Escape'&&state.page==='explore'&&!$('#v515-territory-menu')?.hidden){toggleTerritoryMenu(false);$('#v515-territory-toggle')?.focus();return}if(e.key==='Escape'&&state.modal){if(state.modal==='map-guide')dismissMapIntro();else closeModal();return}if(e.key==='Enter'&&e.target.classList.contains('logo')){state.page='home';home();window.scrollTo(0,0)}});
window.addEventListener('hashchange',()=>{if(location.hash==='#petorca'&&state.page==='home')explore()});
home();
})();
