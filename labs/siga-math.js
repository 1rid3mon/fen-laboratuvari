/* Electrostatic capacitance lab. Units: uF, V, uC, uJ, mm, cm2.
   2018 MEB AYT; ideal parallel plates with negligible edge effects. */
(function(w){'use strict';
const EPS0=8.8541878128e-12;
function finite(...xs){if(xs.some(x=>!Number.isFinite(x)))throw new RangeError('All inputs must be finite');}
function positive(...xs){finite(...xs);if(xs.some(x=>x<=0))throw new RangeError('Positive physical dimensions required');}
function plate({area,distance,dielectric=1,voltage}){
 positive(area,distance,dielectric);finite(voltage);
 const A=area*1e-4,d=distance*1e-3,C=EPS0*dielectric*A/d;
 const Q=C*voltage,U=.5*C*voltage*voltage,E=voltage/d;
 return {Cmicro:C*1e6,Qmicro:Q*1e6,U_microJ:U*1e6,E,area,distance,dielectric,voltage};
}
function battery({cap,voltage}){positive(cap);finite(voltage);return {Cmicro:cap,Qmicro:cap*voltage,U_microJ:.5*cap*voltage*voltage,voltage};}
function isolated({cap,charge}){positive(cap);finite(charge);return {Cmicro:cap,Qmicro:charge,voltage:charge/cap,U_microJ:charge*charge/(2*cap)};}
function series({c1,c2,voltage}){positive(c1,c2);finite(voltage);const C=c1*c2/(c1+c2),Q=C*voltage;return {Cmicro:C,Qmicro:Q,V1:Q/c1,V2:Q/c2,U_microJ:.5*C*voltage*voltage};}
function parallel({c1,c2,voltage}){positive(c1,c2);finite(voltage);const C=c1+c2;return {Cmicro:C,Q1:c1*voltage,Q2:c2*voltage,Qmicro:C*voltage,U_microJ:.5*C*voltage*voltage};}
function comparison({c1,c2,voltage}){return {series:series({c1,c2,voltage}),parallel:parallel({c1,c2,voltage})};}
w.SigaMath=Object.freeze({EPS0,plate,battery,isolated,series,parallel,comparison});
})(window);
