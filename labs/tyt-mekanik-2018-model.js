/* 2018 MEB TYT 9.3–9.4. Pure deterministic ideal horizontal models.
No inclined-plane, pulleys or 11th-grade force decomposition. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TYTMechanics2018=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function finite(...values){if(values.some(x=>!Number.isFinite(x)))throw RangeError('finite parameters required');}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function signed(n){return Object.is(n,-0)?0:n;}
function reference({x0=10,velocity=3,observerX0=0,observerVelocity=1,time=0}={}){
 finite(x0,velocity,observerX0,observerVelocity,time);
 const groundX=x0+velocity*time,observerX=observerX0+observerVelocity*time;
 return{groundX,observerX,relativeX:signed(groundX-observerX),relativeVelocity:signed(velocity-observerVelocity)};
}
function acceleration({v0=3,a=1,time=0}={}){
 finite(v0,a,time);if(time<0)throw RangeError('time');
 const v=signed(v0+a*time);
 return{velocity:v,acceleration:a,deltaX:v0*time+a*time*time/2,
 speeding:v===0?'anlık durma':v*a>0?'sürat artar':v*a<0?'sürat azalır':'sürat sabit',
 zeroCrossing:a!==0&&v0*a<0?-v0/a:null};
}
function forces({right=20,left=6,mass=4,v0=0,time=0}={}){
 finite(right,left,mass,v0,time);if(mass<=0||time<0||right<0||left<0)throw RangeError('force/mass/time');
 const net=right-left,a=net/mass;
 return{net,a,x:v0*time+a*time*time/2,v:v0+a*time,mass};
}
function friction({applied=20,mass=5,muStatic=0.5,muKinetic=0.3,g=10,time=0}={}){
 finite(applied,mass,muStatic,muKinetic,g,time);
 if(mass<=0||muStatic<0||muKinetic<0||muKinetic>muStatic||g<=0||time<0)throw RangeError('friction parameters');
 const normal=mass*g,limit=muStatic*normal,mode=Math.abs(applied)<=limit?'static':'kinetic';
 const frictionForce=mode==='static'?-applied:-Math.sign(applied)*muKinetic*normal;
 const net=signed(applied+frictionForce),a=net/mass;
 return{mode,normal,staticLimit:limit,frictionForce,net,acceleration:a,x:a*time*time/2};
}
function work({force=20,displacement=4,time=4}={}){
 finite(force,displacement,time);if(time<=0)throw RangeError('time > 0');
 return{work:force*displacement,power:force*displacement/time,displacement,time};
}
function energy({mass=3,initialHeight=6,height=3,lossFraction=0,g=10}={}){
 finite(mass,initialHeight,height,lossFraction,g);if(mass<=0||initialHeight<0||height<0||height>initialHeight||lossFraction<0||lossFraction>1||g<=0)throw RangeError('energy');
 const initial=mass*g*initialHeight,potential=mass*g*height;
 const available=initial-potential,thermal=available*lossFraction,kinetic=available-thermal;
 return{initial,potential,kinetic,thermal,mechanical:potential+kinetic,total:potential+kinetic+thermal};
}
function efficiency({input=100,useful=65}={}){finite(input,useful);if(input<=0||useful<0||useful>input)throw RangeError('efficiency');return{ratio:useful/input,loss:input-useful};}
return{clamp,signed,reference,acceleration,forces,friction,work,energy,efficiency};
});