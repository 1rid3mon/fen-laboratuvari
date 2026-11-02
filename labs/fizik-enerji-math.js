/* AYT 2018 MEB 11.1.6.1–3 · Pure deterministic work/energy equations.
   Signed directions: displacement +x, height +y. No simulation parameters are empirical. */
(function(root){'use strict';
const finite=(o,keys)=>{for(const k of keys)if(!Number.isFinite(o[k]))throw new RangeError('Invalid '+k);};
const nonnegative=(o,keys)=>{finite(o,keys);for(const k of keys)if(o[k]<0)throw new RangeError('Negative '+k);};
function forceArea({f0,f1,dx}){
 finite({f0,f1,dx},['f0','f1','dx']);if(dx<0)throw new RangeError('Displacement length must be nonnegative');
 return {work:(f0+f1)*dx/2,meanForce:(f0+f1)/2,dx};
}
function angled({force,angle,dx,m,v0,seconds}){
 nonnegative({force,dx,m,seconds},['force','dx','m','seconds']);finite({angle,v0},['angle','v0']);if(m===0)throw new RangeError('Mass zero');
 const parallel=force*Math.cos(angle*Math.PI/180),work=parallel*dx,initialK=.5*m*v0*v0,finalK=initialK+work;
 return {parallel,work,initialK,finalK,reachable:finalK>=-1e-10,
 finalSpeed:finalK>=-1e-10?Math.sqrt(2*Math.max(0,finalK)/m):null,
 averagePower:seconds>0?work/seconds:null};
}
function gravity({m,h0,h,v0=0,g=10}){
 nonnegative({m,h0,h,g},['m','h0','h','g']);finite({v0},['v0']);
 if(m===0||g===0||h>h0)throw new RangeError('Invalid gravity heights/mass');
 const initialK=.5*m*v0*v0,initialU=m*g*h0,U=m*g*h,K=initialK+initialU-U;
 return {initialK,initialU,K,U,total:initialK+initialU,speed:Math.sqrt(2*K/m),gravityWork:m*g*(h0-h)};
}
function projectile({m,v0,angle,h0,g=10,t}){
 nonnegative({m,v0,h0,g,t},['m','v0','h0','g','t']);finite({angle},['angle']);if(m===0||g===0)throw new RangeError('Mass/gravity must be positive');
 const th=angle*Math.PI/180,vx=v0*Math.cos(th),vy0=v0*Math.sin(th),
 flight=(vy0+Math.sqrt(vy0*vy0+2*g*h0))/g,at=Math.min(t,flight),
 x=vx*at,y=Math.max(0,h0+vy0*at-.5*g*at*at),vy=vy0-g*at,
 K=.5*m*(vx*vx+vy*vy),U=m*g*y,total=.5*m*v0*v0+m*g*h0;
 return {x,y,vx,vy,at,flight,K,U,total,impactSpeed:Math.sqrt(v0*v0+2*g*h0),landed:t>=flight};
}
function spring({k,x}){
 nonnegative({k},['k']);finite({x},['x']);return {force:-k*x,U:.5*k*x*x,workSpring:-.5*k*x*x,workStretch:.5*k*x*x};
}
function springExchange({k,m,amplitude,x}){
 nonnegative({k,m,amplitude},['k','m','amplitude']);finite({x},['x']);
 if(k===0||m===0||Math.abs(x)>amplitude+1e-10)throw new RangeError('Spring input invalid');
 const total=.5*k*amplitude*amplitude,U=.5*k*x*x,K=Math.max(0,total-U);
 return {total,U,K,speed:Math.sqrt(2*K/m),force:-k*x};
}
function friction({m,v0,mu,g=10,distance}){
 nonnegative({m,mu,g,distance},['m','mu','g','distance']);finite({v0},['v0']);
 if(m===0||g===0)throw new RangeError('Mass/gravity zero');
 const initialK=.5*m*v0*v0,frictionForce=mu*m*g,stopDistance=frictionForce===0?Infinity:initialK/frictionForce,
 traveled=Math.min(distance,stopDistance),thermal=frictionForce*traveled,
 K=Math.max(0,initialK-thermal);
 return {initialK,frictionForce,stopDistance,traveled,thermal,K,speed:Math.sqrt(2*K/m),stopped:distance>=stopDistance};
}
root.FizikEnerjiMath=Object.freeze({forceArea,angled,gravity,projectile,spring,springExchange,friction});
})(window);
