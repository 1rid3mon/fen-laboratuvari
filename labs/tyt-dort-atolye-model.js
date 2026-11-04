/* 2018 MEB TYT — four touch-first physics workshops. Pure, inspectable models. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TYTFourWorkshopModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function pulse(x,t,{length=680,start=100,speed=120,width=48,amplitude=36,end='fixed'}={}){
 const gauss=z=>Math.exp(-0.5*Math.pow(z/width,2));
 const incident=amplitude*gauss(x-start-speed*t);
 const reflected=(end==='fixed'?-1:1)*amplitude*gauss(x-(2*length-start-speed*t));
 return {incident,reflected,displacement:incident+reflected};
}
function collide(x,t,{leftX=160,rightX=760,speed=120,width=48,a=30,b=-30}={}){
 const gaussian=z=>Math.exp(-0.5*Math.pow(z/width,2));
 const left=a*gaussian(x-leftX-speed*t),right=b*gaussian(x-rightX+speed*t);
 return{left,right,displacement:left+right};
}
function refract(thetaDeg,deep1,deep2){
 if(!(deep1>0&&deep2>0))throw RangeError('positive depths required');
 const speedRatio=Math.sqrt(deep2/deep1),theta1=thetaDeg*Math.PI/180,sin2=Math.sin(theta1)*speedRatio;
 if(Math.abs(sin2)>1)return{totalReflection:true,theta2:null,speedRatio};
 return{totalReflection:false,theta2:Math.asin(sin2)*180/Math.PI,speedRatio};
}
function longitudinal(x,time,{amplitude=15,wavelength=120,frequency=2}={}){
 const phase=2*Math.PI*(x/wavelength-frequency*time);
 return x+amplitude*Math.sin(phase);
}
function vector1d(a,b){return{result:a+b,magnitude:Math.abs(a+b),direction:a+b>0?'doğu':a+b<0?'batı':'yönsüz (sıfır)'};}
function measureCm(a,b){return Math.abs(b-a);}
function displacement(items,{waterMl=150,capacityMl=500,bottomY=408,topY=90}={}){
 const height=bottomY-topY,mlPerPx=capacityMl/height;
 const submerged=(item,level)=>item.inside?item.volumeMl*clamp((item.y+item.height-level)/item.height,0,1):0;
 let lo=topY,hi=bottomY;
 for(let i=0;i<54;i++){
 const level=(lo+hi)/2;
 const liquid=waterMl+items.reduce((total,item)=>total+submerged(item,level),0);
 const displayed=(bottomY-level)*mlPerPx;
 if(displayed>liquid)lo=level;else hi=level;
 }
 const level=(lo+hi)/2;
 const displaced=items.reduce((sum,item)=>sum+submerged(item,level),0);
 return{level,displacedMl:displaced,readingMl:waterMl+displaced,overflow:waterMl+displaced>capacityMl};
}
function density(massG,volumeMl){if(volumeMl<=0)throw RangeError('volume must be positive');return massG/volumeMl;}
function capillary(radius,wetting=true){if(radius<=0)throw RangeError('radius');return(wetting?1:-1)*25/radius;}
function equilibrium({aTemp,bTemp,aMass,bMass,aCapacity=1,bCapacity=1}){
 const ca=aMass*aCapacity,cb=bMass*bCapacity;
 if(ca<=0||cb<=0)throw RangeError('positive heat capacity');
 return(aTemp*ca+bTemp*cb)/(ca+cb);
}
function heatStep(state,dt=1,conductance=0.35){
 const ca=state.aMass*state.aCapacity,cb=state.bMass*state.bCapacity;
 if(!(ca>0&&cb>0))throw RangeError('positive heat capacity');
 const gap=state.aTemp-state.bTemp;
 const q=gap*(1-Math.exp(-conductance*dt*(1/ca+1/cb)))/(1/ca+1/cb);
 return{...state,aTemp:state.aTemp-q/ca,bTemp:state.bTemp+q/cb,transferredJ:(state.transferredJ||0)+q};
}
return{clamp,pulse,collide,refract,longitudinal,vector1d,measureCm,displacement,density,capillary,equilibrium,heatStep};
});