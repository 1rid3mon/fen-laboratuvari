/* TYT 2018 MEB — isolated pressure laboratory physics helpers. No browser globals. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TYTPressureModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const G=10,PIXELS_PER_METRE=52;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const liquids={water:{name:'Su',rho:1000},oil:{name:'Yağ (örnek)',rho:900},salt:{name:'Tuzlu su (örnek)',rho:1050}};
function rotate(p,degrees,cx=450,cy=248){const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a),x=p.x-cx,y=p.y-cy;return{x:cx+x*c-y*s,y:cy+x*s+y*c};}
function vessel(shape='rect',tilt=0){
 const profiles={rect:[[210,75],[690,75],[690,420],[210,420]],topwide:[[165,75],[735,75],[650,420],[250,420]],bottomwide:[[255,75],[645,75],[725,420],[175,420]],slanted:[[275,75],[730,75],[625,420],[170,420]]};
 return (profiles[shape]||profiles.rect).map(([x,y])=>rotate({x,y},clamp(tilt,-12,12)));
}
function area(poly){let sum=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];sum+=a.x*b.y-b.x*a.y;}return Math.abs(sum)/2;}
function below(poly,waterY){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ia=a.y>=waterY,ib=b.y>=waterY;if(ia)out.push(a);if(ia!==ib){const t=(waterY-a.y)/(b.y-a.y);out.push({x:a.x+t*(b.x-a.x),y:waterY});}}return out;}
function waterline(poly,fill=0.64){const target=area(poly)*clamp(fill,0,1),ys=poly.map(p=>p.y);let low=Math.min(...ys)-1,high=Math.max(...ys)+1;for(let i=0;i<48;i++){const mid=(low+high)/2;if(area(below(poly,mid))>target)low=mid;else high=mid;}return(low+high)/2;}
function inside(poly,p){let found=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a.y>p.y)!==(b.y>p.y))&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)found=!found;}return found;}
function probe(poly,waterY,p,rho=1000,headKPa=0){if(!inside(poly,p))return{region:'outside',depth:0,gaugePa:null};if(p.y<waterY)return{region:'air',depth:0,gaugePa:null};const depth=(p.y-waterY)/PIXELS_PER_METRE;return{region:'liquid',depth,gaugePa:rho*G*depth,absoluteKPa:headKPa+rho*G*depth/1000};}
function solid(columnBlocks){const total=columnBlocks.reduce((n,b)=>n+b.massKg*G,0),bottom=columnBlocks[0];return{forceN:total,areaM2:bottom?bottom.areaM2:0,pressurePa:bottom?total/bottom.areaM2:0};}
function gas({referenceKPa=100,volumeL=4,temperatureK=300,particleCount=80}){return referenceKPa*(particleCount/80)*(temperatureK/300)*(4/volumeL);}
function floatBody({bodyDensity=700,liquidDensity=1000,volumeL=2,submerged=1}){const weightN=bodyDensity*G*volumeL/1000,upN=liquidDensity*G*volumeL*clamp(submerged,0,1)/1000;return{weightN,upN,netN:upN-weightN,equilibriumFraction:clamp(bodyDensity/liquidDensity,0,1),state:bodyDensity<liquidDensity?'yüzer':bodyDensity===liquidDensity?'askıda':'batar'};}
function balloon({liquidDensity=1000,volumeL=2,balloonMassKg=0.03}){const upN=liquidDensity*G*volumeL/1000,weightN=balloonMassKg*G;return{upN,weightN,tensionN:Math.max(0,upN-weightN)};}
return{G,PIXELS_PER_METRE,clamp,liquids,vessel,area,below,waterline,inside,probe,solid,gas,floatBody,balloon};
});
