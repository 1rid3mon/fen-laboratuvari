/* Touch/pen/mouse direct manipulation for Tork & Denge. Sliders remain the
 * accessible alternative. Pointer capture stays on the stable scene container;
 * changing SVG contents cannot drop an active drag. No idle loop/third party.
 */
(function(w,d){'use strict';
const scene=d.getElementById('scene'),controls=d.getElementById('controls');
if(!scene||!controls||!w.TorkDengeLab)return;
let pointer=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function update(key,v){
 const input=controls.querySelector('input[data-control="'+key+'"]');if(!input)return;
 const min=Number(input.min),max=Number(input.max),step=Number(input.step)||1;
 const snapped=clamp(min+Math.round((v-min)/step)*step,min,max);
 // Reuse the same delegated input callback used by touch-friendly range sliders.
 if(Math.abs(Number(input.value)-snapped)<1e-9)return;
 input.value=String(Number(snapped.toFixed(6)));
 input.dispatchEvent(new w.Event('input',{bubbles:true}));
}
function point(e){
 const svg=scene.querySelector('svg');if(!svg)return null;
 const box=svg.getBoundingClientRect();if(box.width<=0||box.height<=0)return null;
 return {x:(e.clientX-box.left)/box.width*800,y:(e.clientY-box.top)/box.height*360};
}
function move(e){
 if(!pointer||e.pointerId!==pointer.id)return;
 const xy=point(e);if(!xy)return;
 const {x,y}=xy,tab=w.TorkDengeLab.snapshot().state.tab,h=pointer.handle;
 if((tab==='torque'||tab==='door')&&h==='r')update('r',tab==='door'?(x-160)/420:(x-400)/85);
 if(tab==='seesaw'&&h==='leftArm')update('leftArm',(400-x)/86);
 if(tab==='seesaw'&&h==='rightArm')update('rightArm',(x-400)/86);
 if(tab==='supports'&&['loadX','leftSupport','rightSupport'].includes(h))update(h,(x-90)/100);
 if(tab==='shelf'&&h==='loadFraction')update(h,(x-135)/515);
 if(tab==='center'&&/^point[123]$/.test(h)){
  const i=h.slice(-1);update('x'+i,(x-74)/80);update('y'+i,(300-y)/49);
 }
 if(tab==='cg'&&(h==='x1'||h==='x2'))update(h,(x-65)/81);
 if(tab==='base'&&h==='centerX')update(h,(x-400)/53);
}
function release(e){
 if(pointer&&e.pointerId===pointer.id){pointer=null;
  if(scene.hasPointerCapture?.(e.pointerId))scene.releasePointerCapture(e.pointerId);
 }
}
scene.addEventListener('pointerdown',e=>{
 const t=e.target.closest?.('[data-drag]');if(!t)return;
 pointer={id:e.pointerId,handle:t.dataset.drag};
 e.preventDefault();
 try{scene.setPointerCapture?.(e.pointerId);}catch(_){/* not supported */}
 move(e);
});
scene.addEventListener('pointermove',move);
scene.addEventListener('pointerup',release);
scene.addEventListener('pointercancel',release);
scene.addEventListener('lostpointercapture',e=>{if(pointer&&e.pointerId===pointer.id)pointer=null;});
})(window,document);
