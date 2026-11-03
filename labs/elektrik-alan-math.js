/* AYT electrostatics: point charges in vacuum/air approximation, SI units.
 * Uses dimensionless display scale (cm/nC) but converts to SI before solving. */
(function(w){'use strict';
const K=8.99e9;
function check(q){if(!Number.isFinite(q)||Math.abs(q)>1e12)throw new RangeError('nonfinite/overflow input');}
function vec(x,y){check(x);check(y);return {x,y,mag:Math.hypot(x,y),angle:Math.atan2(y,x)*180/Math.PI};}
function chargeField(q,x,y,px,py){
 [q,x,y,px,py].forEach(check);
 const dx=(px-x)/100,dy=(py-y)/100,r2=dx*dx+dy*dy;
 if(r2<1e-12)return {valid:false,reason:'Yükün bulunduğu noktada noktasal yük alanı tanımsızdır.'};
 const r=Math.sqrt(r2),s=K*(q*1e-9)/(r2*r);
 return {valid:true,...vec(s*dx,s*dy),r};
}
function field(charges,px,py){
 let ex=0,ey=0;
 for(const c of charges){const e=chargeField(c.q,c.x,c.y,px,py);if(!e.valid)return e;ex+=e.x;ey+=e.y;}
 return {valid:true,...vec(ex,ey)};
}
function force(qTest,charges,px,py){
 check(qTest);const e=field(charges,px,py);if(!e.valid)return e;
 return {valid:true,...vec(e.x*qTest*1e-9,e.y*qTest*1e-9),field:e};
}
function potential(charges,px,py){
 let v=0;
 for(const c of charges){[c.q,c.x,c.y,px,py].forEach(check);
  const r=Math.hypot(px-c.x,py-c.y)/100;
  if(r<1e-6)return {valid:false,reason:'Yükün bulunduğu noktada noktasal yük potansiyeli tanımsızdır.'};
  v+=K*c.q*1e-9/r;
 }
 return {valid:true,value:v};
}
function energy(qTest,charges,px,py){
 const p=potential(charges,px,py);return p.valid?{valid:true,U:qTest*1e-9*p.value,V:p.value}:p;
}
function uniform(q,ex,ey,dx,dy){
 [q,ex,ey,dx,dy].forEach(check);
 const E=vec(ex,ey),dV=-(ex*dx+ey*dy)/100;
 return {field:E,force:vec(q*1e-9*ex,q*1e-9*ey),dV,workByField:q*1e-9*(-dV),dU:q*1e-9*dV};
}
function flux(ex,ey,area,normalAngle){
 [ex,ey,area,normalAngle].forEach(check);if(area<0)throw new RangeError('area');
 const a=normalAngle*Math.PI/180;
 return {flux:area*(ex*Math.cos(a)+ey*Math.sin(a))};
}
w.ElektrikAlanMath=Object.freeze({K,vec,chargeField,field,force,potential,energy,uniform,flux});
})(window);
