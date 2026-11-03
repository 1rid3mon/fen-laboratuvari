/* TYT Physics / 2018 MEB 9.6 Electrostatics.
 * Quantitative 1D Coulomb force ONLY (9.6.1.3), electric field is qualitative (9.6.1.4).
 * Discrete static-charge displays are educational representations, not full 3D solvers.
 */
(function(w){'use strict';
const K=9e9,elementaryCharge=1.602176634e-19;
const finite=(...xs)=>{if(xs.some(x=>typeof x!=='number'||!Number.isFinite(x)))throw RangeError('finite input required');};
const sign=x=>Math.sign(x),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function friction({electrons=4}={}){
 finite(electrons);if(!Number.isInteger(electrons)||Math.abs(electrons)>16)throw RangeError('integer electron count');
 return {rod:-electrons,cloth:electrons,total:0,receivedByRod:electrons,conserved:true};
}
function contact({first=8,second=0,progress=1}={}){
 finite(first,second,progress);if(progress<0||progress>1)throw RangeError('progress');
 const total=first+second,touched=progress>=.6,after=total/2;
 return {first:touched?after:first,second:touched?after:second,total,touched,initialTotal:total};
}
function induction({rodSign=-1,stage=0}={}){
 finite(rodSign,stage);if(![-1,1].includes(rodSign)||!Number.isInteger(stage)||stage<0||stage>4)throw RangeError('stage or sign');
 const rodPresent=stage>=1&&stage<=3,groundConnected=stage===2;
 const netSign=stage>=2?-rodSign:0,polarized=rodPresent,nearSign=polarized?-rodSign:netSign,farSign=polarized?rodSign:netSign;
 return {rodPresent,groundConnected,netSign,polarized,nearSign,farSign,step:stage,chargeAcquired:stage>=2};
}
function electroscope({known=0,rod=-1,approach=0}={}){
 finite(known,rod,approach);if(![-1,0,1].includes(known)||![-1,1].includes(rod)||approach<0||approach>1)throw RangeError('electroscope input');
 const baseline=known===0?0:.35,change=approach*(known===0?.58:known===rod?.55:-.48);
 const opening=Math.max(0,Math.min(1,baseline+change));
 return {opening,leafSign:known===0?(approach>0?rod:0):known,trend:known===0?(approach>0?'induction':'closed'):known===rod?'opens':'closes',baseline};
}
function distribution({material='conductor',charge=-6,grounded=false}={}){
 finite(charge);if(!['conductor','insulator'].includes(material))throw RangeError('material');
 return {material,net:grounded&&material==='conductor'?0:charge,surface:material==='conductor',localized:material==='insulator',grounded:!!grounded};
}
function grounding({initial=-6,stage=0}={}){
 finite(initial,stage);if(!Number.isInteger(stage)||stage<0||stage>3)throw RangeError('stage');
 return {charge:stage>=2?0:initial,connected:stage===1||stage===2,transfer:stage>=2?-initial:0,stage};
}
function cage({closed=true,external=-1}={}){
 finite(external);return {shielded:!!closed,insideField:closed?'negligible':'present',outsideField:external!==0};
}
function coulomb({q1=3,q2=-2,distance=1}={}){
 finite(q1,q2,distance);if(distance<=0)throw RangeError('r must be positive');
 const magnitude=K*Math.abs(q1*q2)*1e-12/(distance*distance),repel=q1*q2>0,attract=q1*q2<0;
 const forceOn1=repel?-magnitude:attract?magnitude:0;
 return {magnitude,forceOn1,forceOn2:-forceOn1,repel,attract,zero:q1===0||q2===0,distance};
}
function field({source=1,test=1}={}){
 finite(source,test);if(![-1,1].includes(source)||![-1,1].includes(test))throw RangeError('charge sign');
 return {fieldDirection:source,forceDirection:source*test,sourceSign:source,testSign:test,quantitative:false};
}
function polarize({rod=-1,near=0}={}){
 finite(rod,near);if(![-1,1].includes(rod)||near<0||near>1)throw RangeError('rod/near');
 return {nearSign:-rod,farSign:rod,attracted:near>.15,net:0};
}
w.TytElektroMath=Object.freeze({K,elementaryCharge,friction,contact,induction,electroscope,distribution,grounding,cage,coulomb,field,polarize});
})(window);
