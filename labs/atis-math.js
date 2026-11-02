/* AYT Fizik 2018 MEB §11.1.5 — two-dimensional ideal projectile motion.
   Coordinate convention: +x right, +y upward, launch at (0,h0).
   No air resistance, rotation or wind. t=0 is release, ground is y=0.
   All figures and quizzes must use this same physics model. */
(function(root){
'use strict';
const EPS=1e-9, RAD=Math.PI/180;
const finite=(...v)=>v.every(Number.isFinite);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function components({speed,angleDeg,schoolAngles=false}){
 if(!finite(speed,angleDeg)||speed<0)throw Error('Speed must be finite and nonnegative');
 // Standard YKS 3–4–5 triangle ONLY for signed special angles.
 if(schoolAngles){
  const lookup={'37':[.8,.6],'53':[.6,.8],'-37':[.8,-.6],'-53':[.6,-.8]};
  const pair=lookup[String(angleDeg)];
  if(pair)return {vx:speed*pair[0],vy:speed*pair[1]};
 }
 return {vx:speed*Math.cos(angleDeg*RAD),vy:speed*Math.sin(angleDeg*RAD)};
}
function projectile({speed=20,angleDeg=45,height=0,g=10,schoolAngles=false}={}){
 if(!finite(speed,angleDeg,height,g)||speed<0||height<0||g<=0)throw Error('Invalid launch parameters');
 const {vx,vy}=components({speed,angleDeg,schoolAngles});
 // Stable positive root of: h0 + vy*t - g*t²/2 = 0.
 const root=Math.sqrt(vy*vy+2*g*height);
 const impactTime=height<=EPS&&vy<=EPS ? 0 : 2*height/(root-vy)>0 && root-vy>EPS ? 2*height/(root-vy) : (vy+root)/g;
 // The algebraic alternate form above can lose precision near h0=0; use
 // the direct positive root for y0=0, and rationalized root for y0>0 & vy<0.
 const tImpact=height>EPS&&vy<0 ? 2*height/(root-vy) : Math.max(0,(vy+root)/g);
 const peakTime=vy>0?Math.min(tImpact,vy/g):0;
 const peakHeight=height+Math.max(0,vy)**2/(2*g);
 const range=vx*tImpact;
 const impactVy=vy-g*tImpact;
 const sameLevelTime=vy>0?2*vy/g:0;
 const sameLevelRange=vx*sameLevelTime;
 return Object.freeze({speed,angleDeg,height,g,schoolAngles,vx,vy,impactTime:tImpact,range,
   peakTime,peakHeight,impactVx:vx,impactVy,impactSpeed:Math.hypot(vx,impactVy),
   sameLevelTime,sameLevelRange,launchSpeed:Math.hypot(vx,vy)});
}
function at(model,time){
 if(!Number.isFinite(time)||time<0)throw Error('Time must be finite and >=0');
 const t=Math.min(time,model.impactTime);
 const x=model.vx*t;
 const y=Math.max(0,model.height+model.vy*t-.5*model.g*t*t);
 const ground=time>=model.impactTime-EPS;
 const vx=ground?0:model.vx,vy=ground?0:model.vy-model.g*t;
 return {t,time,x,y,vx,vy,speed:Math.hypot(vx,vy),ax:0,ay:ground?0:-model.g,
   landed:ground,inFlight:!ground,
   pathDisplacement:Math.hypot(x,y-model.height),
   heightChange:y-model.height};
}
function beforeImpactAt(model,time){
 const t=clamp(time,0,model.impactTime);
 return {t,x:model.vx*t,y:Math.max(0,model.height+model.vy*t-.5*model.g*t*t),
   vx:model.vx,vy:model.vy-model.g*t,ax:0,ay:-model.g};
}
function trajectory(model,segments=90){
 if(!Number.isInteger(segments)||segments<2||segments>2000)throw Error('Invalid trajectory precision');
 return Array.from({length:segments+1},(_,i)=>beforeImpactAt(model,model.impactTime*i/segments));
}
function timesAtHeight(model,targetY){
 if(!Number.isFinite(targetY)||targetY<0)throw Error('Invalid crossing height');
 const d=model.vy*model.vy+2*model.g*(model.height-targetY);
 if(d<-EPS)return [];
 const root=Math.sqrt(Math.max(0,d));
 const candidates=[(model.vy-root)/model.g,(model.vy+root)/model.g];
 const valid=candidates.filter(t=>t>=-EPS&&t<=model.impactTime+EPS).map(t=>clamp(t,0,model.impactTime));
 return valid.filter((t,i)=>valid.findIndex(other=>Math.abs(other-t)<EPS)===i).sort((a,b)=>a-b);
}
function positionAtX(model,x){
 if(!Number.isFinite(x)||x<0)return null;
 if(model.vx<=EPS)return null;
 const t=x/model.vx;
 if(t>model.impactTime+EPS)return null;
 return beforeImpactAt(model,t);
}
function possibleAngles({speed,height,targetX,g=10,minAngle=-60,maxAngle=85}){
 if(!finite(speed,height,targetX,g,minAngle,maxAngle)||speed<=0||height<0||targetX<=0||g<=0)return [];
 const A=g*targetX*targetX/(2*speed*speed);
 const discriminant=targetX*targetX-4*A*(A-height);
 if(discriminant<-EPS)return [];
 const roots=[(targetX-Math.sqrt(Math.max(0,discriminant)))/(2*A),
              (targetX+Math.sqrt(Math.max(0,discriminant)))/(2*A)];
 const angles=roots.map(v=>Math.atan(v)/RAD)
  .filter(t=>t>=minAngle-EPS&&t<=maxAngle+EPS)
  .filter(t=>Math.abs(projectile({speed,height,angleDeg:t,g}).range-targetX)<1e-5)
  .sort((a,b)=>a-b);
 return angles.filter((t,i)=>i===0||Math.abs(angles[i-1]-t)>1e-6);
}
function targetResult(model,targetX,tolerance=2){
 if(!Number.isFinite(targetX)||targetX<0||!Number.isFinite(tolerance)||tolerance<0)throw Error('Invalid target');
 const delta=model.range-targetX;
 return {delta,miss:Math.abs(delta),hit:Math.abs(delta)<=tolerance,
   side:delta>tolerance?'uzun':delta<-tolerance?'kısa':'isabet',tolerance};
}
root.AtisMath=Object.freeze({EPS,components,projectile,at,beforeImpactAt,trajectory,
 timesAtHeight,positionAtX,possibleAngles,targetResult});
})(window);