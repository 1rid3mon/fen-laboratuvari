'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const m=require('./tyt-basinc-v3-model.js');
const near=(a,b,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon, a+' != '+b);
test('rotating a vessel does not change its enclosed area',()=>{
for(const shape of ['rect','topwide','bottomwide','slanted'])for(const tilt of [-12,-6,0,8,12])near(m.area(m.vessel(shape,tilt)),m.area(m.vessel(shape,0)),1e-6);
});
test('water surface conserves liquid cross-sectional area when vessel tilts',()=>{
for(const shape of ['rect','topwide','bottomwide','slanted'])for(const tilt of [-12,0,12]){const p=m.vessel(shape,tilt),w=m.waterline(p,.64);near(m.area(m.below(p,w))/m.area(p),.64,1e-8);}
});
test('same vertical depth means equal liquid gauge pressure, regardless of horizontal point',()=>{
const p=m.vessel('rect',0),w=m.waterline(p,.64);
const left=m.probe(p,w,{x:300,y:w+70},1000),right=m.probe(p,w,{x:600,y:w+70},1000);
assert.equal(left.region,'liquid');assert.equal(right.region,'liquid');near(left.gaugePa,right.gaugePa);near(left.depth,70/52);
});
test('hydrostatic pressure increases with density and depth',()=>{
const p=m.vessel('rect',0),w=m.waterline(p,.64);
const a=m.probe(p,w,{x:450,y:w+52},1000),b=m.probe(p,w,{x:450,y:w+104},1000),oil=m.probe(p,w,{x:450,y:w+52},900);
near(a.gaugePa,10000);near(b.gaugePa,20000);near(oil.gaugePa,9000);
});
test('dry and outside probes do not claim liquid pressure',()=>{
const p=m.vessel('rect'),w=m.waterline(p,.64);
assert.equal(m.probe(p,w,{x:450,y:90},1000).region,'air');assert.equal(m.probe(p,w,{x:30,y:100},1000).region,'outside');
});
test('solid pressure uses total weight and bottom contact area',()=>{
const z=m.solid([{massKg:4,areaM2:2},{massKg:3,areaM2:1}]);near(z.forceN,70);near(z.pressurePa,35);near(m.solid([]).pressurePa,0);
});
test('gas reference pressure and independent state ratios',()=>{
near(m.gas({volumeL:4,temperatureK:300,particleCount:80}),100);
near(m.gas({volumeL:2,temperatureK:300,particleCount:80}),200);
near(m.gas({volumeL:4,temperatureK:330,particleCount:80}),110);
near(m.gas({volumeL:4,temperatureK:300,particleCount:160}),200);
});
test('floating body pressure model preserves partial immersion',()=>{
const body=m.floatBody({bodyDensity:600,liquidDensity:1000,volumeL:2,submerged:0.6});
near(body.weightN,12);near(body.upN,12);near(body.equilibriumFraction,.6);assert.equal(body.state,'yüzer');
assert.equal(m.floatBody({bodyDensity:1600,liquidDensity:1000,volumeL:2}).state,'batar');
});
test('tethered submerged balloon tension is upward buoyancy minus weight',()=>{
const b=m.balloon({liquidDensity:1000,volumeL:2,balloonMassKg:0.03});
near(b.upN,20);near(b.weightN,.3);near(b.tensionN,19.7);
});
test('touch UI, module loader and explicit modeling cautions exist',()=>{
const ui=fs.readFileSync(path.join(__dirname,'tyt-basinc-v3.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'tyt-basinc-v3.html'),'utf8');
for(const text of ['data-probe','data-block','data-piston','data-body','pointerdown','pointermove','setPointerCapture','gasVolume','melt','equilibrium'])assert.ok(ui.includes(text),'Missing UI feature '+text);
for(const text of ['tyt-basinc-v3-model.js','tyt-basinc-v3.js','Geliştirme ön izlemesi','çarpışma'])assert.ok(html.includes(text),'Missing safety/entry '+text);
});
