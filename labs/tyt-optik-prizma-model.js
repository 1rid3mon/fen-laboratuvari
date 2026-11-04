/* TYT 2018 MEB 10.4.8: internal geometric ray tracing for triangular prism.
No numerical prism laws or refractive index computations exposed to students. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TYTPrismModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const colors=[['Kırmızı','#ff6869',1.508],['Turuncu','#ffac63',1.512],['Sarı','#f5e681',1.516],['Yeşil','#82e6ad',1.52],['Mavi','#85c6ff',1.525],['Lacivert','#aaa1f6',1.53],['Mor','#ca92f2',1.535]];
const length=v=>Math.hypot(v.x,v.y),norm=v=>{const r=length(v);if(r<1e-10)throw RangeError('zero vector');return{x:v.x/r,y:v.y/r};};
const dot=(a,b)=>a.x*b.x+a.y*b.y,cross=(a,b)=>a.x*b.y-a.y*b.x;
const diff=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
const add=(a,b,k=1)=>({x:a.x+k*b.x,y:a.y+k*b.y});
function bend(direction,tangent,normal,n1,n2){
 const t=dot(direction,tangent)*n1/n2;
 if(Math.abs(t)>1)return null;
 const n=Math.sqrt(Math.max(0,1-t*t));
 return norm(add({x:normal.x*n,y:normal.y*n},tangent,t));
}
function prism({centerX=485,sourceX=120,sourceY=225,angleDeg=58,glassN=1.52}={}){
 if(![centerX,sourceX,sourceY,angleDeg,glassN].every(Number.isFinite)||angleDeg<35||angleDeg>75||glassN<=1)throw RangeError('prism parameters');
 const apex={x:centerX,y:105},height=260,side=height*Math.tan(angleDeg*Math.PI/360);
 const left={x:centerX-side,y:365},right={x:centerX+side,y:365};
 const fraction=(sourceY-apex.y)/height;
 if(fraction<=0||fraction>=1)return{apex,left,right,miss:true};
 const entry={x:apex.x-side*fraction,y:sourceY},source={x:sourceX,y:sourceY};
 if(source.x>=entry.x)return{apex,left,right,miss:true};
 const leftT=norm(diff(left,apex)),leftN={x:leftT.y,y:-leftT.x},incoming={x:1,y:0};
 const inside=bend(incoming,leftT,leftN,1,glassN);if(!inside)return{apex,left,right,miss:true};
 const rightSegment=diff(right,apex),delta=diff(apex,entry),denominator=cross(inside,rightSegment);
 if(Math.abs(denominator)<1e-10)return{apex,left,right,miss:true};
 const t=cross(delta,rightSegment)/denominator,u=cross(delta,inside)/denominator;
 if(!(t>0&&u>=0&&u<=1))return{apex,left,right,miss:true};
 const exit=add(entry,inside,t);
 const rightT=norm(rightSegment),rightN={x:rightT.y,y:-rightT.x};
 const outside=bend(inside,rightT,rightN,glassN,1);
 if(!outside)return{apex,left,right,miss:true,totalReflection:true,entry,exit};
 return{apex,left,right,source,entry,inside,exit,outside,end:add(exit,outside,290),miss:false};
}
return{colors,prism,dot,length,norm,bend};
});