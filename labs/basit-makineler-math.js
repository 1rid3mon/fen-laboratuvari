/* 2018 MEB 11.1.10.1–3. Ideal and explicitly dissipative simple machines.
   All lengths in m, forces N, energies J. Static / quasi-static only. */
(function(w){'use strict';
const chk=(p,positive=[])=>{for(const [k,v]of Object.entries(p)){if(!Number.isFinite(v))throw new RangeError(k);if(positive.includes(k)&&v<=0)throw new RangeError(k);}};
const result=(load,ratio,travel,eta=1)=>{
 chk({load,ratio,travel,eta},['ratio','travel']);if(load<0||eta<=0||eta>1)throw new RangeError('load/eta');
 const effort=load/(ratio*eta),loadTravel=travel/ratio;
 return {load,effort,ratio,eta,travel,loadTravel,workIn:effort*travel,workOut:load*loadTravel,
 loss:effort*travel-load*loadTravel,actualAdvantage:load===0?ratio*eta:load/effort};
};
function lever({load,effortArm,loadArm,travel,eta=1}){
 chk({load,effortArm,loadArm,travel,eta},['effortArm','loadArm']);return result(load,effortArm/loadArm,travel,eta);
}
function pulley({load,moving,n,travel,eta=1}){
 chk({load,moving,n,travel,eta},['n']);if(n!==Math.floor(n)||n<1||n>8)throw new RangeError('rope count');
 // A fixed pulley changes direction only; movable pulley supports load by n strands.
 return result(load,moving?n:1,travel,eta);
}
function incline({load,height,length,eta=1}){
 chk({load,height,length,eta},['height','length']);if(height>length||height<0)throw new RangeError('slope');
 return {...result(load,length/height,length,eta),height,length};
}
function wheelAxle({load,wheelRadius,axleRadius,turns,eta=1}){
 chk({load,wheelRadius,axleRadius,turns,eta},['wheelRadius','axleRadius']);
 return {...result(load,wheelRadius/axleRadius,2*Math.PI*wheelRadius*turns,eta),turns};
}
function screw({load,pitch,turns,handleRadius,eta=1}){
 chk({load,pitch,turns,handleRadius,eta},['pitch','handleRadius']);
 const travel=2*Math.PI*handleRadius*turns,ratio=2*Math.PI*handleRadius/pitch;
 return {...result(load,ratio,travel,eta),pitch,turns};
}
function gears({inputTeeth,outputTeeth,inputTurns,eta=1}){
 chk({inputTeeth,outputTeeth,inputTurns,eta},['inputTeeth','outputTeeth']);
 const speedRatio=inputTeeth/outputTeeth,torqueRatio=outputTeeth/inputTeeth;
 return {speedRatio,torqueRatio,outputTurns:-inputTurns*speedRatio,eta,
 outputTorquePerInput:eta*torqueRatio};
}
function belts({driveRadius,drivenRadius,driveTurns,crossed=false,eta=1}){
 chk({driveRadius,drivenRadius,driveTurns,eta},['driveRadius','drivenRadius']);
 return {speedRatio:driveRadius/drivenRadius,outputTurns:(crossed?-1:1)*driveTurns*driveRadius/drivenRadius,
 torqueRatio:drivenRadius/driveRadius,eta,outputTorquePerInput:eta*drivenRadius/driveRadius};
}
function design({load,armEffort,armLoad,ropeCount,eta1=1,eta2=1,travel}){
 chk({load,armEffort,armLoad,ropeCount,eta1,eta2,travel},['armEffort','armLoad','ropeCount']);
 if(!Number.isInteger(ropeCount)||ropeCount>8)throw new RangeError('rope count');
 // Exactly TWO machines: lever + pulley; no 3+ machine numerical problems.
 const ratio=(armEffort/armLoad)*ropeCount,eta=eta1*eta2;
 const r=result(load,ratio,travel,eta);
 return {...r,leverRatio:armEffort/armLoad,pulleyRatio:ropeCount,stages:2};
}
w.BasitMakineMath=Object.freeze({lever,pulley,incline,wheelAxle,screw,gears,belts,design});
})(window);
