/* 2018 MEB AYT magnetic field and induction, idealized SI physics. */
(function(w){'use strict';const mu0=4*Math.PI*1e-7;
function finite(...a){if(a.some(v=>!Number.isFinite(v)))throw RangeError('Invalid input');}
function wire({current,distance}){finite(current,distance);if(distance<=0)throw RangeError('r>0');return {B:mu0*current/(2*Math.PI*distance),direction:Math.sign(current)};}
function loop({current,radius,turns=1}){finite(current,radius,turns);if(radius<=0||turns<=0)throw RangeError('positive dimensions');return {B:mu0*turns*current/(2*radius)};}
function solenoid({current,turns,length}){finite(current,turns,length);if(length<=0||turns<=0)throw RangeError('positive dimensions');return {B:mu0*(turns/length)*current};}
function wireForce({B,current,length,angle}){finite(B,current,length,angle);if(length<0||B<0)throw RangeError('magnitude');return {F:B*current*length*Math.sin(angle*Math.PI/180)};}
function particle({q,v,B,angle,mass}){finite(q,v,B,angle,mass);if(mass<=0||B<0||v<0)throw RangeError('magnitude');const F=q*v*B*Math.sin(angle*Math.PI/180);return {F,acceleration:F/mass,radius:Math.abs(q)>0&&B>0&&Math.abs(Math.sin(angle*Math.PI/180))>1e-10?mass*v/(Math.abs(q)*B):null};}
function flux({B,area,angle}){finite(B,area,angle);if(area<0)throw RangeError('area');return {phi:B*area*Math.cos(angle*Math.PI/180)};}
function induction({turns,B1,B2,area,angle,dt}){finite(turns,B1,B2,area,angle,dt);if(turns<=0||area<0||dt<=0)throw RangeError('dimensions');const p1=flux({B:B1,area,angle}).phi,p2=flux({B:B2,area,angle}).phi;return {emf:-turns*(p2-p1)/dt,fluxInitial:p1,fluxFinal:p2,change:p2-p1};}
function movingRod({B,length,speed,resistance}){finite(B,length,speed,resistance);if(length<0||resistance<=0)throw RangeError('dimensions');const emf=B*length*speed,current=emf/resistance;return {emf,current,power:emf*current,forceMagnitude:Math.abs(B*current*length)};}
function transformer({primaryTurns,secondaryTurns,primaryVoltage}){finite(primaryTurns,secondaryTurns,primaryVoltage);if(primaryTurns<=0||secondaryTurns<=0)throw RangeError('turns');return {secondaryVoltage:primaryVoltage*secondaryTurns/primaryTurns,ratio:secondaryTurns/primaryTurns};}
w.ManyetizmaMath=Object.freeze({mu0,wire,loop,solenoid,wireForce,particle,flux,induction,movingRod,transformer});
})(window);
