/* TYT 2018 MEB: internal physics for 10.2.1–2 (qualitative output)
and 10.3.3.2 reflection of straight water waves at a planar barrier. */
(function(root,factory){const model=factory();if(typeof module==='object'&&module.exports)module.exports=model;else root.TYTFluidWaveModel=model;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v)),hypot=Math.hypot;
function venturi({speed=2,constriction=.65,rho=1000}={}){
 if(!Number.isFinite(speed)||!Number.isFinite(constriction)||!Number.isFinite(rho)||speed<=0||constriction<=0||constriction>1||rho<=0)throw RangeError('positive ideal flow');
 const throatSpeed=speed/constriction,pressureDifference=.5*rho*(throatSpeed*throatSpeed-speed*speed);
 return{wideSpeed:speed,throatSpeed,pressureDifference,direction:pressureDifference>0?'throat lower':'same'};
}
function barometer(altitudeM=0,{referencePa=101325,scaleHeightM=8500,rhoHg=13600,g=9.81}={}){
 if(![altitudeM,referencePa,scaleHeightM,rhoHg,g].every(Number.isFinite)||altitudeM<0||referencePa<=0||scaleHeightM<=0||rhoHg<=0||g<=0)throw RangeError('barometer inputs');
 const pressurePa=referencePa*Math.exp(-altitudeM/scaleHeightM);
 return{pressurePa,heightM:pressurePa/(rhoHg*g)};
}
function reflect({source={x:175,y:280},center={x:585,y:250},angleDeg=90,impactOffset=0}={}){
 if(![source.x,source.y,center.x,center.y,angleDeg,impactOffset].every(Number.isFinite))throw RangeError('finite coordinates');
 const a=angleDeg*Math.PI/180,tangent={x:Math.cos(a),y:Math.sin(a)},normal={x:-Math.sin(a),y:Math.cos(a)};
 const impact={x:center.x+tangent.x*impactOffset,y:center.y+tangent.y*impactOffset};
 const d={x:impact.x-source.x,y:impact.y-source.y},length=hypot(d.x,d.y);
 if(length<1e-8)throw RangeError('source at impact');
 const incident={x:d.x/length,y:d.y/length},scalar=incident.x*normal.x+incident.y*normal.y;
 const reflected={x:incident.x-2*scalar*normal.x,y:incident.y-2*scalar*normal.y};
 return{source,center,impact,tangent,normal,incident,reflected,incidenceNormal:Math.abs(scalar)};
}
function distanceToLine(point,origin,dir){const dx=point.x-origin.x,dy=point.y-origin.y;return Math.abs(dx*dir.y-dy*dir.x);}
return{clamp,venturi,barometer,reflect,distanceToLine};
});