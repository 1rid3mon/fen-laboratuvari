'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('./tyt-dort-atolye-model.js');
const near=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<eps,a+' should equal '+b);
test('fixed spring end has exactly zero total displacement at all times',()=>{
 for(const time of [0,1,3,4,5,6,8])near(M.pulse(680,time,{length:680,end:'fixed'}).displacement,0);
});
test('free spring end doubles the arriving pulse without inversion',()=>{
 const time=(680-100)/120;const v=M.pulse(680,time,{length:680,end:'free',start:100,speed:120,amplitude:28});
 near(v.displacement,56);assert.ok(v.reflected>0);
});
test('wave reflection sends a reflected pulse in the opposite direction',()=>{
 const p=M.pulse(580,6.5,{length:680,start:100,speed:120,end:'fixed',amplitude:30,width:50});
 assert.ok(p.reflected<0);
});
test('shallow-water refraction approaches normal when entering shallower water',()=>{
 const r=M.refract(30,4,1);near(r.speedRatio,.5);near(r.theta2,Math.asin(.25)*180/Math.PI);
 const same=M.refract(37,2,2);near(same.theta2,37);
});
test('possible total internal reflection is surfaced instead of impossible refraction',()=>{
 const r=M.refract(55,.5,5);assert.equal(r.totalReflection,true);assert.equal(r.theta2,null);
});
test('sound particles oscillate about resting location',()=>{
 const x=35,A=20;near(M.longitudinal(x,0,{amplitude:A,wavelength:140,frequency:2}),x+A);
 near(M.longitudinal(x,.25,{amplitude:A,wavelength:140,frequency:2}),x-A);
});
test('one dimensional signed vector resultant and magnitude remain distinct',()=>{
 assert.deepEqual(M.vector1d(5,-5),{result:0,magnitude:0,direction:'yönsüz (sıfır)'});
 assert.deepEqual(M.vector1d(-3,1),{result:-2,magnitude:2,direction:'batı'});
});
test('ruler measurement is positive and order independent',()=>{
 near(M.measureCm(2.5,8),5.5);near(M.measureCm(8,2.5),5.5);
});
test('graduated cylinder conserves water volume and fully immersed displacement',()=>{
 const empty=M.displacement([],{waterMl:150});near(empty.readingMl,150);
 const full=M.displacement([{inside:true,y:345,height:48,volumeMl:60}],{waterMl:150});
 near(full.displacedMl,60,1e-5);near(full.readingMl,210,1e-5);
});
test('partially immersed volume is less than total object volume',()=>{
 const p=M.displacement([{inside:true,y:260,height:60,volumeMl:80}],{waterMl:150});
 assert.ok(p.displacedMl>0 && p.displacedMl<80);
 near(p.readingMl,150+p.displacedMl);
});
test('objects outside cylinder produce no false reading',()=>{
 const outside=M.displacement([{inside:false,y:310,height:60,volumeMl:80}],{waterMl:150});
 near(outside.displacedMl,0);near(outside.readingMl,150);
});
test('density and relative capillary trends',()=>{
 near(M.density(200,50),4);
 assert.throws(()=>M.density(100,0),RangeError);
 near(M.capillary(1,true),2*M.capillary(2,true));
 near(M.capillary(3,false),-25/3);
});
test('two-body heat equilibrium uses masses and heat capacities',()=>{
 near(M.equilibrium({aTemp:80,bTemp:20,aMass:2,bMass:2}),50);
 near(M.equilibrium({aTemp:80,bTemp:20,aMass:3,bMass:1}),65);
});
test('heat transfer conserves energy and does not overshoot ideal equilibrium',()=>{
 const s={aTemp:80,bTemp:20,aMass:2,bMass:4,aCapacity:2,bCapacity:1};
 const e0=s.aTemp*s.aMass*s.aCapacity+s.bTemp*s.bMass*s.bCapacity;
 let r=s;for(let i=0;i<100;i++)r=M.heatStep(r,.5,1.2);
 const e1=r.aTemp*r.aMass*r.aCapacity+r.bTemp*r.bMass*r.bCapacity;
 near(e0,e1,1e-6);near(r.aTemp,r.bTemp,1e-6);
 near(r.aTemp,M.equilibrium(s),1e-6);
});
test('four entrypoints link to the touch-first preview',()=>{
 const paths=['tyt-madde-ozellikleri.html','tyt-fizige-giris.html','isi-sicaklik.html','tyt-basinc-dalgalar.html'];
 const keys=['matter','intro','heat','waves'];
 for(let i=0;i<paths.length;i++){const s=fs.readFileSync(path.join(__dirname,paths[i]),'utf8');assert.ok(s.includes('tyt-dort-atolye.html?topic='+keys[i]),paths[i]);}
 const html=fs.readFileSync(path.join(__dirname,'tyt-dort-atolye.html'),'utf8');
 assert.ok(html.includes('tyt-dort-atolye-model.js'));assert.ok(html.includes('tyt-dort-atolye.js'));assert.ok(html.includes('Geliştirme')||html.includes('Deneysel sürüm'));
});
