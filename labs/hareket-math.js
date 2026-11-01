/* 2018 MEB AYT: reusable pure physics (SI unless explicitly labelled).
   Coordinate convention: +x east/right, +y north/up; signed vectors.
   No network, storage, DOM or external dependencies. */
(function(root){
'use strict';
const EPS=1e-9;
const round=(n,p=2)=>Number.isFinite(n)?Number(n.toFixed(p)):null;
const vec=(x,y)=>({x:Number(x),y:Number(y)});
const add=(a,b)=>vec(a.x+b.x,a.y+b.y);
const sub=(a,b)=>vec(a.x-b.x,a.y-b.y);
const scale=(a,k)=>vec(a.x*k,a.y*k);
const mag=a=>Math.hypot(a.x,a.y);
const dot=(a,b)=>a.x*b.x+a.y*b.y;
const angle=a=>Math.atan2(a.y,a.x)*180/Math.PI;
const fromPolar=(m,d)=>vec(m*Math.cos(d*Math.PI/180),m*Math.sin(d*Math.PI/180));
/* The 37°/53° 3-4-5 convention commonly used in AYT worked examples.
   Do not silently mix school approximations with exact math trig. */
function polarForSchool(speed,angleDeg,approx=false){
 if(approx){
  const lookup={'37':[.8,.6],'53':[.6,.8],'127':[-.6,.8],'143':[-.8,.6]};
  const pair=lookup[String(angleDeg)];
  if(pair)return vec(speed*pair[0],speed*pair[1]);
 }
 return fromPolar(speed,angleDeg);
}
const relative=(target,observer)=>sub(target,observer);
function river({speed,angleDeg,current,width,approx=false}){
 const water=polarForSchool(speed,angleDeg,approx);
 const stream=vec(current,0);
 const ground=add(water,stream);
 const time=water.y>EPS?width/water.y:null;
 return {water,stream,ground,time,exit:time===null?null:ground.x*time,drift:time===null?null:current*time,
  possibleAcross:Math.abs(current)<speed,headingForAcross:Math.abs(current)<speed?
  Math.acos(-current/speed)*180/Math.PI:null};
}
function wind({speed,angleDeg,windX,windY,northDistance,approx=false}){
 const air=polarForSchool(speed,angleDeg,approx),wind=vec(windX,windY),ground=add(air,wind);
 const time=ground.y>EPS?northDistance/ground.y:null;
 return {air,wind,ground,time,exit:time===null?null:ground.x*time};
}
function rendezvous({xA,xB,vA,vB}){
 const gap=xB-xA,closing=vA-vB;
 const time=Math.abs(closing)<=EPS?(Math.abs(gap)<=EPS?0:null):gap/closing;
 const t=time!==null&&time>=-EPS?Math.max(0,time):null;
 return {gap,closing,relative:closing,time:t,position:t===null?null:xA+vA*t,
  kind:t===null?'none':Math.abs(gap)<EPS?'already':vA*vB<0?'meeting':'catch'};
}
function horizontal({mass,force,g=10,muStatic=0,muKinetic=0}){
 if(!(mass>0)||!(g>0))throw Error('mass and g must be positive');
 const N=mass*g,maxStatic=Math.max(0,muStatic)*N;
 const kinetic=Math.min(Math.max(0,muKinetic),Math.max(0,muStatic));
 const staticMode=Math.abs(force)<=maxStatic+EPS;
 const friction=staticMode?-force:-Math.sign(force)*kinetic*N;
 const net=force+friction;
 return {N,maxStatic,friction,net,acceleration:net/mass,state:staticMode?'static':'sliding',speedAssumption:'initially at rest'};
}
function incline({mass,angleDeg,force=0,g=10,muStatic=0,muKinetic=0}){
 if(!(mass>0)||!(g>0))throw Error('mass and g must be positive');
 const th=angleDeg*Math.PI/180;
 const N=mass*g*Math.cos(th),down=mass*g*Math.sin(th);
 const driving=force-down;
 const maxStatic=Math.max(0,muStatic)*N;
 const kinetic=Math.min(Math.max(0,muKinetic),Math.max(0,muStatic));
 const staticMode=Math.abs(driving)<=maxStatic+EPS;
 const friction=staticMode?-driving:-Math.sign(driving)*kinetic*N;
 const net=driving+friction;
 return {N,down,driving,maxStatic,friction,net,acceleration:net/mass,state:staticMode?'static':'sliding'};
}
/* Body pressed horizontally against a vertical wall; initially at rest.
   +y upward. For a sliding body in this scenario motion begins downward. */
function wall({mass,push,g=10,muStatic=0,muKinetic=0}){
 if(!(mass>0)||!(g>0)||push<0)throw Error('mass, g must be positive and push >= 0');
 const N=push,weight=mass*g,maxStatic=Math.max(0,muStatic)*N;
 const staticMode=weight<=maxStatic+EPS;
 const kinetic=Math.min(Math.max(0,muKinetic),Math.max(0,muStatic));
 const friction=staticMode?weight:kinetic*N; // upwards to oppose downward slipping
 const net=friction-weight;
 return {N,weight,maxStatic,friction,net,acceleration:net/mass,state:staticMode?'static':'sliding'};
}
function elevator({mass,acceleration,g=10}){
 if(!(mass>0)||!(g>0))throw Error('mass and g must be positive');
 const normal=mass*(g+acceleration);
 return {weight:mass*g,normal:Math.max(0,normal),net:mass*acceleration,contact:normal>=-EPS};
}
const f=(n,unit='',p=2)=>Number.isFinite(n)?round(n,p).toLocaleString('tr-TR',{maximumFractionDigits:p})+(unit?' '+unit:''):'—';
const escapeHtml=str=>String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
root.HareketMath=Object.freeze({EPS,round,vec,add,sub,scale,mag,dot,angle,fromPolar,polarForSchool,relative,river,wind,rendezvous,horizontal,incline,wall,elevator,f,escapeHtml});
})(window);