/* Stable touch/Pencil/mouse drag for TYT electrostatics; no SVG-frame pointer loss. */
(function(w,d){'use strict';
const scene=d.getElementById('scene'),controls=d.getElementById('controls'),app=w.TytElektroLab;
if(!scene||!controls||!app)return;
let drag=null;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const control=key=>controls.querySelector('input[data-control="'+key+'"]');
function set(key,value){
 const input=control(key);if(!input||!Number.isFinite(value))return;
 const lo=Number(input.min),hi=Number(input.max),step=Number(input.step)||.01;
 const next=Number(clamp(lo+Math.round((value-lo)/step)*step,lo,hi).toFixed(6));
 if(Math.abs(Number(input.value)-next)<1e-8)return;
 input.value=String(next);input.dispatchEvent(new w.Event('input',{bubbles:true}));
}
function svgPoint(e){const svg=scene.querySelector('svg');if(!svg)return null;const r=svg.getBoundingClientRect();if(!r.width||!r.height)return null;return {x:(e.clientX-r.left)*800/r.width,y:(e.clientY-r.top)*360/r.height};}
scene.addEventListener('pointerdown',e=>{
 const hit=e.target.closest?.('[data-drag],[data-step],[data-toggle]');if(!hit)return;
 const tab=app.snapshot().state.tab;
 if(hit.dataset.step){const el=control(hit.dataset.step);if(!el)return;set(hit.dataset.step,Number(el.value)>=Number(el.max)?Number(el.min):Number(el.value)+1);e.preventDefault();return;}
 if(hit.dataset.toggle){const el=control(hit.dataset.toggle);if(!el)return;set(hit.dataset.toggle,Number(el.value)?0:1);e.preventDefault();return;}
 const key=hit.dataset.drag,el=control(key),point=svgPoint(e);if(!key||!el||!point)return;
 drag={id:e.pointerId,tab,key,side:hit.dataset.side||'',startX:point.x,base:Number(el.value)};
 e.preventDefault();try{scene.setPointerCapture?.(e.pointerId)}catch(_){}
},{passive:false});
scene.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;
 if(app.snapshot().state.tab!==drag.tab){drag=null;return;}
 const point=svgPoint(e);if(!point)return;
 const dx=point.x-drag.startX;
 let delta=null;
 if(drag.tab==='friction'&&drag.key==='rub')delta=dx/308;
 else if(drag.tab==='contact'&&drag.key==='progress')delta=-dx/258;
 else if(drag.tab==='scope'&&drag.key==='approach')delta=-dx/190;
 else if(drag.tab==='cage'&&drag.key==='approach')delta=dx/120;
 else if(drag.tab==='polar'&&drag.key==='near')delta=dx/(drag.side==='paper'?-103:175);
 else if(drag.tab==='coulomb'&&drag.key==='distance')delta=dx/146;
 else if(drag.tab==='field'&&drag.key==='distance')delta=dx/66;
 if(delta===null)return;
 set(drag.key,drag.base+delta);e.preventDefault();
});
function release(e){if(!drag||drag.id!==e.pointerId)return;drag=null;try{if(scene.hasPointerCapture?.(e.pointerId))scene.releasePointerCapture(e.pointerId)}catch(_){}}
scene.addEventListener('pointerup',release);
scene.addEventListener('pointercancel',release);
scene.addEventListener('lostpointercapture',e=>{if(drag?.id===e.pointerId)drag=null;});
})(window,document);
