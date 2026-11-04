/* Shared gesture adapter for qualitative physics labs. 2018 MEB scope is unchanged.
 * Controls are still accessible without pointing devices.
 */
(function(w,d){'use strict';
const scene=d.getElementById('scene'),controls=d.getElementById('controls');
const app=w.SigaLab||w.ManyetizmaLab||w.AlternatifAkimLab;
if(!scene||!controls||!app)return;
let drag=null;const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function input(key){return controls.querySelector('input[data-control="'+key+'"]');}
function update(key,val){const el=input(key);if(!el||!Number.isFinite(val))return;const lo=Number(el.min),hi=Number(el.max),step=Number(el.step)||.01,v=Number(clamp(lo+Math.round((val-lo)/step)*step,lo,hi).toFixed(6));if(Math.abs(Number(el.value)-v)<1e-9)return;el.value=String(v);el.dispatchEvent(new w.Event('input',{bubbles:true}));}
function pos(e){const svg=scene.querySelector('svg');if(!svg)return null;const box=svg.getBoundingClientRect();if(!box.width||!box.height)return null;return {x:(e.clientX-box.left)*800/box.width,y:(e.clientY-box.top)*360/box.height};}
scene.addEventListener('pointerdown',e=>{
 const el=e.target.closest?.('[data-drag]');if(!el)return;
 const key=el.dataset.drag;if(!input(key))return;drag={id:e.pointerId,key,mode:el.dataset.mode||''};
 e.preventDefault();try{scene.setPointerCapture(e.pointerId)}catch(_){}
});
scene.addEventListener('pointermove',e=>{
 if(drag?.id!==e.pointerId)return;const xy=pos(e);if(!xy)return;let value;
 if(drag.mode==='plate')value=2*(xy.x-405)/30;
 else if(drag.mode==='rod')value=(xy.x-175)/360;
 else if(drag.mode==='track')value=(xy.x-175)/430;
 else if(drag.mode==='linear')value=(xy.x-160)/440;
 else if(drag.mode==='orbit'){const sign=app.snapshot().values.particle?.q>=0?1:-1;value=((Math.atan2(176-xy.y,xy.x-404)*sign)/(2*Math.PI)+1)%1;}
 else if(drag.mode==='flux')value=Math.acos(clamp((xy.x-401)/118,-1,1))*180/Math.PI;
 else return;
 update(drag.key,value);e.preventDefault();
});
function release(e){if(drag?.id!==e.pointerId)return;drag=null;try{if(scene.hasPointerCapture?.(e.pointerId))scene.releasePointerCapture(e.pointerId)}catch(_){}}
scene.addEventListener('pointerup',release);scene.addEventListener('pointercancel',release);
scene.addEventListener('lostpointercapture',e=>{if(drag?.id===e.pointerId)drag=null;});
})(window,document);