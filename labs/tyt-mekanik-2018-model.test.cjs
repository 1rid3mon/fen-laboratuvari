'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./tyt-mekanik-2018-model.js'),close=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,a+' != '+b);
test('9.3.1.6: reference frames produce signed relative velocity and position',()=>{
 let p=M.reference({x0:10,velocity:3,observerX0:1,observerVelocity:1,time:2});
 close(p.groundX,16);close(p.observerX,3);close(p.relativeX,13);close(p.relativeVelocity,2);
 close(M.reference({x0:0,velocity:-2,observerX0:4,observerVelocity:3,time:3}).relativeVelocity,-5);
});
test('9.3.1.5: velocity crosses zero and changes direction with constant acceleration',()=>{
 const p=M.acceleration({v0:4,a:-2,time:3});
 close(p.velocity,-2);close(p.deltaX,3);close(p.zeroCrossing,2);
 assert.equal(p.speeding,'sürat artar');assert.equal(M.acceleration({v0:4,a:-2,time:1}).speeding,'sürat azalır');
});
test('9.3.3: net force and acceleration for one horizontal mass',()=>{
 const p=M.forces({right:18,left:8,mass:5,v0:0,time:2});
 close(p.net,10);close(p.a,2);close(p.x,4);close(p.v,4);
 close(M.forces({right:5,left:5,mass:2,time:3}).a,0);
});
test('9.3.4: static friction balances applied force below threshold, including signs',()=>{
 const p=M.friction({applied:10,mass:5,muStatic:.5,muKinetic:.3,time:2});
 assert.equal(p.mode,'static');close(p.frictionForce,-10);close(p.net,0);close(p.x,0);
 const rev=M.friction({applied:-10,mass:5,muStatic:.5,muKinetic:.3});
 close(rev.frictionForce,10);close(rev.net,0);
});
test('9.3.4: kinetic friction is less than limiting static friction and opposes motion',()=>{
 const p=M.friction({applied:32,mass:5,muStatic:.5,muKinetic:.3,time:2});
 assert.equal(p.mode,'kinetic');close(p.frictionForce,-15);close(p.net,17);close(p.acceleration,3.4);
 close(M.friction({applied:-32,mass:5,muStatic:.5,muKinetic:.3}).frictionForce,15);
});
test('9.4.1: horizontal work is signed and average power is work divided by time',()=>{
 close(M.work({force:20,displacement:4,time:2}).work,80);
 close(M.work({force:-20,displacement:4,time:2}).power,-40);
 close(M.work({force:20,displacement:0,time:2}).work,0);
 assert.throws(()=>M.work({force:10,displacement:2,time:0}),RangeError);
});
test('9.4.2/3: energy conversion conserves total including thermal without creating energy',()=>{
 const p=M.energy({mass:3,initialHeight:6,height:2,lossFraction:.25,g:10});
 close(p.initial,180);close(p.potential,60);close(p.thermal,30);close(p.kinetic,90);close(p.mechanical,150);close(p.total,180);
 close(M.energy({mass:3,initialHeight:6,height:0,lossFraction:0}).kinetic,180);
});
test('9.4.4: efficiency rejects impossible output and conserves useful plus loss',()=>{
 const p=M.efficiency({input:100,useful:65});close(p.ratio,.65);close(p.loss,35);
 assert.throws(()=>M.efficiency({input:100,useful:150}),RangeError);
});
test('invalid mass, negative time and nonphysical friction limits are rejected',()=>{
 assert.throws(()=>M.forces({mass:0}),RangeError);
 assert.throws(()=>M.acceleration({time:-1}),RangeError);
 assert.throws(()=>M.friction({muKinetic:.7,muStatic:.4}),RangeError);
 assert.throws(()=>M.energy({mass:1,initialHeight:4,height:5}),RangeError);
});
test('dedicated TYT page must not load AYT Newton or AYT energy engines',()=>{
 const fs=require('node:fs'),path=require('node:path'),html=fs.readFileSync(path.join(__dirname,'tyt-mekanik-2018.html'),'utf8');
 assert.ok(html.includes('tyt-mekanik-2018-model.js')&&html.includes('tyt-mekanik-2018.js'));
 assert.ok(!html.includes('newton-lab.js')&&!html.includes('fizik-enerji-lab.js'));
 assert.ok(html.includes('2018 MEB')&&html.includes('Geliştirme'));
});
