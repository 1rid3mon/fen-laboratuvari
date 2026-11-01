/* AYT Fizik · 2018 MEB 11.1.4: one-dimensional motion.
   SI units, signed velocities, +up in vertical throwing; +down in freefall.
   Pure deterministic physics, no DOM, network, background jobs. */
(function(root){
'use strict';
const EPS=1e-10;
function finite(...x){if(x.some(v=>!Number.isFinite(v)))throw new Error('Finite parameters required');}
function motion({x0=0,v0=0,a=0,t=0}){
 finite(x0,v0,a,t);if(t<0)throw new Error('t must be >=0');
 const v=v0+a*t,dx=v0*t+0.5*a*t*t,x=x0+dx;
 let distance=Math.abs(dx),turnTime=null,turnPosition=null;
 if(Math.abs(a)>EPS&&v0*a<0){
   const z=-v0/a;
   if(z>EPS&&z<t-EPS){
     turnTime=z;turnPosition=x0+v0*z+.5*a*z*z;
     distance=Math.abs(turnPosition-x0)+Math.abs(x-turnPosition);
   }
 }
 return {x,v,a,t,x0,v0,displacement:dx,distance,turnTime,turnPosition};
}
function braking({speed,brakingAcceleration}){
 finite(speed,brakingAcceleration);
 if(speed<0||brakingAcceleration<=0)throw new Error('speed >=0; braking acceleration >0 required');
 return {time:speed/brakingAcceleration,distance:speed*speed/(2*brakingAcceleration)};
}
function freeFall({height=80,g=10,t=0}){
 finite(height,g,t);if(height<0||g<=0||t<0)throw new Error('invalid freefall parameters');
 const impactTime=Math.sqrt(2*height/g);
 const elapsed=Math.min(t,impactTime);
 const fallen=.5*g*elapsed*elapsed;
 return {impactTime,elapsed,height:Math.max(0,height-fallen),fallen,v:t<impactTime-EPS?g*elapsed:0,
  impactSpeed:g*impactTime,impacted:t>=impactTime-EPS,acceleration:t<impactTime-EPS?g:0};
}
function verticalThrow({height=0,v0=20,g=10,t=0}){
 finite(height,v0,g,t);if(height<0||g<=0||t<0)throw new Error('invalid vertical throw');
 // +y upward, ground y=0, initial height y0>=0
 const impactTime=(v0+Math.sqrt(v0*v0+2*g*height))/g;
 const elapsed=Math.min(t,impactTime);
 const y=Math.max(0,height+v0*elapsed-.5*g*elapsed*elapsed);
 const v=v0-g*elapsed;
 const peakTime=v0>0?v0/g:0;
 const peakHeight=height+(v0>0?v0*v0/(2*g):0);
 return {impactTime,elapsed,y,v:t<impactTime-EPS?v:0,impactVelocity:v0-g*impactTime,
  peakTime,peakHeight,impacted:t>=impactTime-EPS,acceleration:t<impactTime-EPS?-g:0};
}
function logCosh(z){const a=Math.abs(z);return a+Math.log1p(Math.exp(-2*a))-Math.LN2;}
function resistance({mass=1,k=.05,g=10,t=0,height=100}){
 finite(mass,k,g,t,height);if(mass<=0||k<0||g<=0||t<0||height<0)throw new Error('invalid drag parameters');
 const terminal=k>0?Math.sqrt(mass*g/k):null;
 const sampled=time=>{
   if(k<EPS)return {v:g*time,s:.5*g*time*time,drag:0};
   const z=g*time/terminal;
   const v=terminal*Math.tanh(z);
   const s=terminal*terminal/g*logCosh(z);
   return {v,s,drag:k*v*v};
 };
 let impactTime;
 if(height===0)impactTime=0;
 else if(k<EPS)impactTime=Math.sqrt(2*height/g);
 else{
   let hi=Math.max(1,Math.sqrt(2*height/g));
   while(sampled(hi).s<height&&hi<1e8)hi*=2;
   let lo=0;
   for(let i=0;i<72;i++){const mid=(hi+lo)/2;if(sampled(mid).s<height)lo=mid;else hi=mid;}
   impactTime=(hi+lo)/2;
 }
 const elapsed=Math.min(t,impactTime);
 const p=sampled(elapsed),vacuum=freeFall({height,g,t:elapsed});
 return {terminalSpeed:terminal,impactTime,elapsed,fallen:Math.min(height,p.s),
  height:Math.max(0,height-p.s),v:t<impactTime-EPS?p.v:0,drag:t<impactTime-EPS?p.drag:0,weight:mass*g,
  impactSpeed:sampled(impactTime).v,acceleration:t<impactTime-EPS?g-p.drag/mass:0,
  vacuumFallen:Math.min(height,.5*g*elapsed*elapsed),vacuumV:g*elapsed,
  ratio:terminal? p.v/terminal:null,impacted:t>=impactTime-EPS};
}
function slope(points,i,j){
 if(!points[i]||!points[j]||points[i].t===points[j].t) return null;
 return (points[j].y-points[i].y)/(points[j].t-points[i].t);
}
function trapezoidArea(points){
 let area=0;for(let i=1;i<points.length;i++)area+=(points[i].y+points[i-1].y)/2*(points[i].t-points[i-1].t);
 return area;
}
function connected({mA=2,mB=3,force=20}){
 finite(mA,mB,force);if(mA<=0||mB<=0)throw new Error('mass >0 required');
 const a=force/(mA+mB),tension=mA*a;
 return {acceleration:a,tension,force,mA,mB,net:force};
}
function atwood({mA=2,mB=3,g=10}){
 finite(mA,mB,g);if(mA<=0||mB<=0||g<=0)throw new Error('valid Atwood parameters required');
 const acceleration=(mB-mA)*g/(mA+mB);
 const tension=2*mA*mB*g/(mA+mB);
 return {acceleration,tension,weightA:mA*g,weightB:mB*g,mA,mB,g};
}
function angledPull({mass=5,force=30,angleDeg=30,muStatic=.4,muKinetic=.25,g=10}){
 finite(mass,force,angleDeg,muStatic,muKinetic,g);
 if(mass<=0||force<0||g<=0||muStatic<0||muKinetic<0)throw Error('invalid angled pull parameters');
 const rad=angleDeg*Math.PI/180,fx=force*Math.cos(rad),fy=force*Math.sin(rad),rawN=mass*g-fy;
 const contact=rawN>EPS,normal=Math.max(0,rawN),limit=muStatic*normal;
 const sliding=!contact||Math.abs(fx)>limit+EPS;
 const friction=contact?(sliding?-Math.sign(fx)*muKinetic*normal:-fx):0;
 return {fx,fy,normal,contact,limit,friction,
  ax:(fx+friction)/mass,ay:contact?0:(fy-mass*g)/mass,
  state:!contact?'airborne':sliding?'sliding':'static'};
}
root.IvmeliMath=Object.freeze({motion,braking,freeFall,verticalThrow,resistance,slope,trapezoidArea,connected,atwood,angledPull,EPS});
})(window);