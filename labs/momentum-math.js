/* 2018 MEB AYT 11.1.7.1–4 · signed momentum/impulse/collision physics, in 1D and 2D.
   Collisions assume isolated system, frictionless point contacts, defined contact normal. */
(function(root){'use strict';
const finite=(o,ks)=>{for(const k of ks)if(!Number.isFinite(o[k]))throw new RangeError('Invalid '+k);};
const positive=(o,ks)=>{finite(o,ks);for(const k of ks)if(o[k]<=0)throw new RangeError('Nonpositive '+k);};
const kinetic=(m,v)=>.5*m*v*v;
function momentum({m,v}){positive({m},['m']);finite({v},['v']);return {p:m*v,K:kinetic(m,v)};}
function impulse({m,v0,f0,f1,duration,t}){
 positive({m,duration},['m','duration']);finite({v0,f0,f1,t},['v0','f0','f1','t']);if(t<0)throw new RangeError('Negative time');
 const at=Math.min(t,duration),slope=(f1-f0)/duration,J=f0*at+.5*slope*at*at,
 fullJ=.5*(f0+f1)*duration,force=f0+slope*at;
 return {at,J,fullJ,force,v:v0+J/m,p0:m*v0,p:m*v0+J,deltaP:J};
}
function collide1d({m1,m2,u1,u2,e}){
 positive({m1,m2},['m1','m2']);finite({u1,u2,e},['u1','u2','e']);if(e<0||e>1)throw new RangeError('Invalid restitution');
 const approaching=u1>u2,initialP=m1*u1+m2*u2,initialK=kinetic(m1,u1)+kinetic(m2,u2);
 if(!approaching)return {approaching,v1:u1,v2:u2,initialP,finalP:initialP,initialK,finalK:initialK,lost:0,impulse:0};
 const impulse=(1+e)*m1*m2/(m1+m2)*(u1-u2),v1=u1-impulse/m1,v2=u2+impulse/m2,
 finalP=m1*v1+m2*v2,finalK=kinetic(m1,v1)+kinetic(m2,v2);
 return {approaching,v1,v2,initialP,finalP,initialK,finalK,lost:Math.max(0,initialK-finalK),impulse};
}
function explode1d({m1,m2,vCenter,J}){
 positive({m1,m2},['m1','m2']);finite({vCenter,J},['vCenter','J']);
 const initialP=(m1+m2)*vCenter,v1=vCenter+J/m1,v2=vCenter-J/m2,
 initialK=.5*(m1+m2)*vCenter*vCenter,finalK=kinetic(m1,v1)+kinetic(m2,v2);
 return {initialP,finalP:m1*v1+m2*v2,v1,v2,initialK,finalK,addedEnergy:finalK-initialK};
}
function collide2d({m1,m2,u1x,u1y,u2x,u2y,angle,e}){
 positive({m1,m2},['m1','m2']);finite({u1x,u1y,u2x,u2y,angle,e},['u1x','u1y','u2x','u2y','angle','e']);
 if(e<0||e>1)throw new RangeError('Invalid restitution');
 const a=angle*Math.PI/180,nx=Math.cos(a),ny=Math.sin(a),
 relative=(u1x-u2x)*nx+(u1y-u2y)*ny,approaching=relative>1e-12,
 J=approaching?(1+e)*m1*m2/(m1+m2)*relative:0;
 const v1x=u1x-J*nx/m1,v1y=u1y-J*ny/m1,v2x=u2x+J*nx/m2,v2y=u2y+J*ny/m2;
 const p0x=m1*u1x+m2*u2x,p0y=m1*u1y+m2*u2y,p1x=m1*v1x+m2*v2x,p1y=m1*v1y+m2*v2y;
 const K0=.5*m1*(u1x*u1x+u1y*u1y)+.5*m2*(u2x*u2x+u2y*u2y);
 const K1=.5*m1*(v1x*v1x+v1y*v1y)+.5*m2*(v2x*v2x+v2y*v2y);
 return {approaching,nx,ny,J,v1x,v1y,v2x,v2y,p0x,p0y,p1x,p1y,K0,K1,lost:Math.max(0,K0-K1)};
}
function explode2d({m1,m2,vcx,vcy,J,angle}){
 positive({m1,m2},['m1','m2']);finite({vcx,vcy,J,angle},['vcx','vcy','J','angle']);
 const ux=Math.cos(angle*Math.PI/180),uy=Math.sin(angle*Math.PI/180),
 v1x=vcx+J*ux/m1,v1y=vcy+J*uy/m1,v2x=vcx-J*ux/m2,v2y=vcy-J*uy/m2,
 p0x=(m1+m2)*vcx,p0y=(m1+m2)*vcy,
 p1x=m1*v1x+m2*v2x,p1y=m1*v1y+m2*v2y,
 K0=.5*(m1+m2)*(vcx*vcx+vcy*vcy),
 K1=.5*m1*(v1x*v1x+v1y*v1y)+.5*m2*(v2x*v2x+v2y*v2y);
 return {v1x,v1y,v2x,v2y,p0x,p0y,p1x,p1y,K0,K1,addedEnergy:K1-K0};
}
root.MomentumMath=Object.freeze({momentum,impulse,collide1d,explode1d,collide2d,explode2d});
})(window);
