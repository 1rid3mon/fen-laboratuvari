/* Direct manipulation on iPad Safari, Apple Pencil, touchscreen, mouse and trackpad.
 * Capture at stable container; SVG can re-render on every input without losing drag.
 */
(function(w,d){'use strict';const scene=d.getElementById('scene'),controls=d.getElementById('controls');
if(!scene||!controls||!w.BasitMakineLab)return;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),TWO_PI=2*Math.PI;
let active=null;
function svgPoint(e){
 const svg=scene.querySelector('svg');if(!svg)return null;
 const r=svg.getBoundingClientRect();if(!r.width||!r.height)return null;
 return {x:(e.clientX-r.left)/r.width*800,y:(e.clientY-r.top)/r.height*360};
}
function current(key){const input=controls.querySelector('input[data-control="'+key+'"]');return input?Number(input.value):null;}
function setControl(key,value){
 const input=controls.querySelector('input[data-control="'+key+'"]');if(!input||!Number.isFinite(value))return;
 const min=Number(input.min),max=Number(input.max),step=Number(input.step)||.01;
 const next=Number(clamp(min+Math.round((value-min)/step)*step,min,max).toFixed(6));
 if(Math.abs(Number(input.value)-next)<1e-8)return;
 input.value=String(next);input.dispatchEvent(new w.Event('input',{bubbles:true}));
}
function down(e){
 const handle=e.target.closest?.('[data-drag]');if(!handle)return;
 const pt=svgPoint(e);if(!pt)return;
 const key=handle.dataset.drag,v=current(key);
 if(v===null)return;
 const rotational=['inputTurns','driveTurns','turns'].includes(key),cx=Number(handle.dataset.centerX),cy=Number(handle.dataset.centerY);
 active={id:e.pointerId,key,rotational,centerX:cx,centerY:cy,lastAngle:rotational?Math.atan2(pt.y-cy,pt.x-cx):0,startX:pt.x,startY:pt.y,baseValue:v,value:v};
 e.preventDefault();try{scene.setPointerCapture?.(e.pointerId);}catch(_){}
}
function move(e){
 if(!active||active.id!==e.pointerId)return;
 const pt=svgPoint(e);if(!pt)return;const a=active;
 if(a.rotational){
  const angle=Math.atan2(pt.y-a.centerY,pt.x-a.centerX);let delta=angle-a.lastAngle;
  if(delta>Math.PI)delta-=TWO_PI;else if(delta<-Math.PI)delta+=TWO_PI;
  a.lastAngle=angle;a.value+=delta/TWO_PI;
  setControl(a.key,a.value);
  // Keep the angle accumulator aligned with bounded slider range.
  const v=current(a.key);if(v!==null&&Math.abs(v-a.value)>.15)a.value=v;
 }else if(a.key==='progress'){setControl('progress',a.baseValue+(pt.x-a.startX)/530);}
 else if(a.key==='travel'){
  const tab=w.BasitMakineLab.snapshot().state.tab;
  const scale=tab==='lever'?65:tab==='design'?12:28;
  setControl('travel',a.baseValue+(pt.y-a.startY)/scale);
 }
}
function up(e){if(!active||active.id!==e.pointerId)return;active=null;try{if(scene.hasPointerCapture?.(e.pointerId))scene.releasePointerCapture(e.pointerId);}catch(_){}}
scene.addEventListener('pointerdown',down,{passive:false});
scene.addEventListener('pointermove',move);
scene.addEventListener('pointerup',up);
scene.addEventListener('pointercancel',up);
scene.addEventListener('lostpointercapture',e=>{if(active?.id===e.pointerId)active=null;});
})(window,document);
