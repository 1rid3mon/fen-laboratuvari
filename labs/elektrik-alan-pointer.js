/* Drag electric sources and the measurement probe instead of adjusting X/Y sliders.
 * Uses the unchanged source charge and the shared electrostatic model.
 */
(function(w,d){'use strict';const scene=d.getElementById('scene'),controls=d.getElementById('controls');
if(!scene||!controls||!w.ElektrikAlanLab)return;
let active=null;const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function getInput(k){return controls.querySelector('input[data-control="'+k+'"]');}
function update(k,v){const input=getInput(k);if(!input||!Number.isFinite(v))return;const min=Number(input.min),max=Number(input.max),step=Number(input.step)||.5;const next=Number(clamp(min+Math.round((v-min)/step)*step,min,max).toFixed(5));if(Math.abs(Number(input.value)-next)<1e-8)return;input.value=String(next);input.dispatchEvent(new w.Event('input',{bubbles:true}));}
function location(e){const svg=scene.querySelector('svg');if(!svg)return null;const r=svg.getBoundingClientRect();if(!r.width||!r.height)return null;return {x:(e.clientX-r.left)*800/r.width,y:(e.clientY-r.top)*360/r.height};}
scene.addEventListener('pointerdown',e=>{
 const t=e.target.closest?.('[data-drag]');if(!t)return;const handle=t.dataset.drag;
 if(handle==='static')return;
 const keys=handle==='probe'?['px','py']:handle==='source1'?['x1','y1']:['x2','y2'];
 if(!getInput(keys[0])||!getInput(keys[1]))return;
 active={id:e.pointerId,keys};e.preventDefault();try{scene.setPointerCapture(e.pointerId)}catch(_){}});
scene.addEventListener('pointermove',e=>{
 if(active?.id!==e.pointerId)return;const pt=location(e);if(!pt)return;
 const {keys}=active;update(keys[0],(pt.x-400)/42);update(keys[1],(178-pt.y)/23);e.preventDefault();});
const up=e=>{if(active?.id!==e.pointerId)return;active=null;try{if(scene.hasPointerCapture?.(e.pointerId))scene.releasePointerCapture(e.pointerId)}catch(_){}};
scene.addEventListener('pointerup',up);scene.addEventListener('pointercancel',up);
scene.addEventListener('lostpointercapture',e=>{if(active?.id===e.pointerId)active=null;});
})(window,document);