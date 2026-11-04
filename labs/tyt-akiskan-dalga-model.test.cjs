'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),M=require('./tyt-akiskan-dalga-model.js');
const near=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<eps,a+' != '+b);
test('10.2.1.2: steady equal-height pipe throat is faster and lower in static pressure',()=>{
 const a=M.venturi({speed:2,constriction:.5,rho:1000});near(a.throatSpeed,4);
 near(a.pressureDifference,6000);assert.equal(a.direction,'throat lower');
 const equal=M.venturi({speed:2,constriction:1});near(equal.throatSpeed,2);near(equal.pressureDifference,0);
});
test('10.2.1.1: Torricelli column approaches 760 mm at standard reference conditions',()=>{
 const base=M.barometer(0);near(base.pressurePa,101325);
 assert.ok(base.heightM>0.75&&base.heightM<0.77);
 const above=M.barometer(3000);assert.ok(above.heightM<base.heightM&&above.pressurePa<base.pressurePa);
});
test('10.3.3.2: a planar barrier reverses the incident normal component and preserves tangent',()=>{
 for(const angle of [50,70,90,110,130])for(const offset of [-80,0,80]){
 const r=M.reflect({source:{x:200,y:320},center:{x:585,y:250},angleDeg:angle,impactOffset:offset});
 const dot=(a,b)=>a.x*b.x+a.y*b.y;
 near(dot(r.incident,r.normal),-dot(r.reflected,r.normal));
 near(dot(r.incident,r.tangent),dot(r.reflected,r.tangent));
 near(Math.hypot(r.reflected.x,r.reflected.y),1);
 }
});
test('normal incidence on vertical barrier reflects horizontally back to source',()=>{
 const r=M.reflect({source:{x:200,y:250},center:{x:585,y:250},angleDeg:90});
 near(r.incident.x,1);near(r.reflected.x,-1);near(r.reflected.y,0);
});
test('invalid parameters fail safely',()=>{
 assert.throws(()=>M.venturi({constriction:0}),RangeError);
 assert.throws(()=>M.barometer(-300),RangeError);
 assert.throws(()=>M.reflect({source:{x:585,y:250},center:{x:585,y:250}}),RangeError);
});
test('standalone TYT page includes scope warnings and its correct models',()=>{
 const html=fs.readFileSync(path.join(__dirname,'tyt-akiskan-dalga.html'),'utf8');
 for(const x of ['tyt-akiskan-dalga-model.js','tyt-akiskan-dalga.js','2018 MEB','sayısal hesap','iPad/Safari'])assert.ok(html.includes(x),'missing '+x);
});
