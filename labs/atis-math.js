/* 2018 MEB AYT 11.1.5.1-2 — ideal projectile, no air resistance. */
(function(w){'use strict';
const rad=d=>d*Math.PI/180,eps=1e-10;
function solve(p){
 const {speed=20,angle=45,height=0,g=10,t=0}=p;
 if(![speed,angle,height,g,t].every(Number.isFinite)||speed<0||height<0||g<=0||t<0)throw Error('Invalid projectile parameters');
 const vx=speed*Math.cos(rad(angle)),vy0=speed*Math.sin(rad(angle));
 const discriminant=vy0*vy0+2*g*height;
 const flight=(vy0+Math.sqrt(discriminant))/g;
 const at=Math.min(t,flight);
 const x=vx*at,y=Math.max(0,height+vy0*at-.5*g*at*at),vy=vy0-g*at;
 const peakT=Math.max(0,Math.min(flight,vy0/g)),peakY=height+vy0*peakT-.5*g*peakT*peakT;
 return {vx,vy0,flight,range:vx*flight,peakT,peakY,at,x,y,vy,speedAt:Math.hypot(vx,vy),impacted:t>=flight-eps,
 impactVx:vx,impactVy:vy0-g*flight,impactSpeed:Math.hypot(vx,vy0-g*flight),
 ax:0,ay:-g,displacementX:x,displacementY:y-height};
}
function sample(p,count=80){const end=solve({...p,t:0}).flight;return Array.from({length:count+1},(_,i)=>solve({...p,t:end*i/count}));}
function equalHeightRange(speed,angle,g=10){return speed*speed*Math.sin(2*rad(angle))/g;}
w.AtisMath=Object.freeze({solve,sample,equalHeightRange});
})(window);