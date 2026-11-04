/* Touch/Apple Pencil/mouse: drag the rod end, sphere, thermometers and metal sheet.
 * Capturing pointer on the immutable #scene container avoids dropped drags when
 * the SVG is re-rendered from physics state.
 */
(function(w,d){'use strict';
const scene=d.getElementById('scene'),controls=d.getElementById('controls'),app=w.IsiSicaklikLab;
if(!scene||!controls||!app)return;
let drag=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function input(key){return controls.querySelector('input[data-control="'+key+'"]');}
function set(key,value){const el=input(key);if(!el||!Number.isFinite(value))return;const min=Number(el.min),max=Number(el.max),step=Number(el.step)||1;
 const v=Number(clamp(min+Math.round((value-min)/step)*step,min,max).toFixed(6));
 if(Math.abs(Number(el.value)-v)<1e-8)return;
 el.value=String(v);el.dispatchEvent(new w.Event('input',{bubbles:true}));
}
function xy(e){const svg=scene.querySelector('svg');if(!svg)return null;const box=svg.getBoundingClientRect();if(!box.width||!box.height)return null;return {x:(e.clientX-box.left)/box.width*800,y:(e.clientY-box.top)/box.height*360};}
scene.addEventListener('pointerdown',e=>{
 const t=e.target.closest?.('[data-drag]');if(!t)return;
 const key=t.dataset.drag,el=input(key),p=xy(e);if(!el||!p)return;
 drag={id:e.pointerId,key,tab:app.snapshot().state.tab,start:p,base:Number(el.value)};
 e.preventDefault();try{scene.setPointerCapture?.(e.pointerId);}catch(_){}
},{passive:false});
scene.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;const p=xy(e);if(!p)return;
 const deltax=p.x-drag.start.x,deltay=p.y-drag.start.y;
 let next=drag.base;
 if(drag.key==='progress')next+=deltax/340;
 else if(drag.tab==='liquid'&&drag.key==='temp')next-=deltay/4;
 else if(drag.key==='temp'||drag.key==='ballTemp'||drag.key==='ringTemp')next+=deltax*.42;
 else if(drag.key==='c')next+=deltax*.4;
 else if(drag.key==='angle')next+=deltax*.5;
 else return;
 set(drag.key,next);e.preventDefault();
});
function release(e){if(!drag||drag.id!==e.pointerId)return;drag=null;try{if(scene.hasPointerCapture?.(e.pointerId))scene.releasePointerCapture(e.pointerId);}catch(_){}}
scene.addEventListener('pointerup',release);
scene.addEventListener('pointercancel',release);
scene.addEventListener('lostpointercapture',e=>{if(drag?.id===e.pointerId)drag=null;});
})(window,document);
