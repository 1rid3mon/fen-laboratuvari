/* AYT Fizik, 2018 MEB 11.1.8.1–3 / 11.1.9.1–3.
 * Static equilibrium and torque, no rotating-body dynamics.
 * +x right, +y up. +tau = counterclockwise, out of screen (right-hand rule).
 * Pure numerical physics: each view MUST derive from these models.
 */
(function(w){'use strict';
function finite(p,keys){for(const k of keys)if(!Number.isFinite(p[k]))throw new RangeError('Geçersiz '+k);}
function positive(p,keys){finite(p,keys);for(const k of keys)if(p[k]<=0)throw new RangeError('Pozitif olmalı: '+k);}
function nonnegative(p,keys){finite(p,keys);for(const k of keys)if(p[k]<0)throw new RangeError('Negatif olamaz: '+k);}
const rad=d=>d*Math.PI/180;
const near=x=>Math.abs(x)<1e-8;
function torque({r,F,angle}){
 finite({r,F,angle},['r','F','angle']);if(F<0)throw new RangeError('F negatif');
 const fx=F*Math.cos(rad(angle)),fy=F*Math.sin(rad(angle)),tau=r*fy,
 arm=Math.abs(r*Math.sin(rad(angle)));
 return {fx,fy,tau,arm,side:near(tau)?'none':tau>0?'ccw':'cw',z:near(tau)?0:Math.sign(tau)};
}
function seesaw({leftArm,rightArm,leftForce,rightForce,support}){
 positive({leftArm,rightArm},['leftArm','rightArm']);
 nonnegative({leftForce,rightForce,support},['leftForce','rightForce','support']);
 const tauLeft=leftArm*leftForce,tauRight=-rightArm*rightForce,
 netTau=tauLeft+tauRight,netFy=support-leftForce-rightForce;
 return {tauLeft,tauRight,netTau,netFy,requiredRight:tauLeft/rightArm,
 requiredSupport:leftForce+rightForce,rotationalBalance:near(netTau),
 translationalBalance:near(netFy),equilibrium:near(netTau)&&near(netFy)};
}
function supports({length,beamMass,loadMass,loadX,leftSupport,rightSupport,g=10}){
 positive({length,g},['length','g']);nonnegative({beamMass,loadMass},['beamMass','loadMass']);
 finite({loadX,leftSupport,rightSupport},['loadX','leftSupport','rightSupport']);
 if(leftSupport<0||rightSupport>length||rightSupport<=leftSupport||loadX<0||loadX>length)
  throw new RangeError('Destek/yük konumu kiriş sınırı dışında');
 const beamWeight=beamMass*g,loadWeight=loadMass*g,totalWeight=beamWeight+loadWeight,
 RB=(beamWeight*(length/2-leftSupport)+loadWeight*(loadX-leftSupport))/(rightSupport-leftSupport),
 RA=totalWeight-RB,netFy=RA+RB-totalWeight,
 netTauA=RB*(rightSupport-leftSupport)-beamWeight*(length/2-leftSupport)-loadWeight*(loadX-leftSupport);
 return {RA,RB,beamWeight,loadWeight,totalWeight,netFy,netTauA,feasible:RA>=-1e-8&&RB>=-1e-8};
}
function shelf({length,beamMass,loadMass,loadFraction,angle,g=10}){
 positive({length,g},['length','g']);nonnegative({beamMass,loadMass},['beamMass','loadMass']);
 finite({loadFraction,angle},['loadFraction','angle']);
 if(loadFraction<0||loadFraction>1||angle<=0||angle>=90)throw new RangeError('Geçersiz raf geometrisi');
 const beamWeight=beamMass*g,loadWeight=loadMass*g,
 loadX=length*loadFraction,total=beamWeight+loadWeight,
 torqueWeight=beamWeight*length/2+loadWeight*loadX,
 tension=torqueWeight/(length*Math.sin(rad(angle))),
 tensionX=-tension*Math.cos(rad(angle)),tensionY=tension*Math.sin(rad(angle)),
 hingeRx=-tensionX,hingeRy=total-tensionY;
 const netFx=hingeRx+tensionX,netFy=hingeRy+tensionY-total,
 netTau=tensionY*length-torqueWeight;
 return {beamWeight,loadWeight,loadX,total,torqueWeight,tension,tensionX,tensionY,
 hingeRx,hingeRy,netFx,netFy,netTau};
}
function center({masses,points}){
 if(!Array.isArray(masses)||!Array.isArray(points)||masses.length!==points.length||masses.length<2)throw new RangeError('Kütleler');
 let mass=0,sx=0,sy=0;
 for(let i=0;i<masses.length;i++){
  const m=masses[i],pt=points[i];positive({m},['m']);
  if(!Array.isArray(pt)||pt.length!==2||!pt.every(Number.isFinite))throw new RangeError('Koordinatlar');
  mass+=m;sx+=m*pt[0];sy+=m*pt[1];
 }
 return {mass,x:sx/mass,y:sy/mass};
}
function gravityCenter({m1,m2,x1,x2,g1,g2}){
 positive({m1,m2,g1,g2},['m1','m2','g1','g2']);finite({x1,x2},['x1','x2']);
 const massCenter=(m1*x1+m2*x2)/(m1+m2),
 w1=m1*g1,w2=m2*g2,weightCenter=(w1*x1+w2*x2)/(w1+w2);
 return {massCenter,weightCenter,difference:weightCenter-massCenter,w1,w2,totalWeight:w1+w2,
 same:near(weightCenter-massCenter)};
}
function baseSupport({width,centerX,m,g=10}){
 positive({width,m,g},['width','m','g']);finite({centerX},['centerX']);
 const left=-width/2,right=width/2,weight=m*g,
 inside=centerX>=left-1e-8&&centerX<=right+1e-8,
 edge=centerX<left?left:centerX>right?right:null,
 tippingTorque=inside?0:-weight*(centerX-edge);
 return {left,right,weight,inside,edge,tippingTorque,
 status:inside?'supported':tippingTorque>0?'left':'right'};
}
w.TorkDengeMath=Object.freeze({torque,seesaw,supports,shelf,center,gravityCenter,baseSupport});
})(window);
