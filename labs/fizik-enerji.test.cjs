'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const load=name=>fs.readFileSync(path.join(__dirname,name),'utf8'),near=(x,y,eps=1e-8)=>assert.ok(Math.abs(x-y)<=eps,'Expected '+x+' ≈ '+y);
const w={};vm.runInNewContext(load('fizik-enerji-math.js'),{window:w,Math,Number,Object},{filename:'fizik-enerji-math.js'});
const E=w.FizikEnerjiMath;
test('MEB 11.1.6.1: signed F-x trapezoid including negative and cancellation',()=>{
 near(E.forceArea({f0:10,f1:20,dx:4}).work,60);
 near(E.forceArea({f0:-20,f1:-10,dx:4}).work,-60);
 near(E.forceArea({f0:-10,f1:10,dx:4}).work,0);
});
test('angled work: perpendicular force zero, 120 degrees negative, average power signed',()=>{
 near(E.angled({force:20,angle:90,dx:3,m:2,v0:5}).work,0,1e-12);
 const r=E.angled({force:20,angle:120,dx:3,m:2,v0:10});
 near(r.work,-30);near(r.travelTime,6/(10+Math.sqrt(70)));near(r.averagePower,-30/r.travelTime);near(r.finalK,70);near(.5*2*r.finalSpeed*r.finalSpeed,70);
});
test('work-energy theorem rejects impossible travel instead of fake imaginary velocity',()=>{
 const r=E.angled({force:30,angle:180,dx:10,m:1,v0:1});
 assert.equal(r.reachable,false);assert.equal(r.finalSpeed,null);assert.ok(r.finalK<0);
});
test('Hooke spring force signed, stored energy always nonnegative, work signs correct',()=>{
 const a=E.spring({k:100,x:.2}),b=E.spring({k:100,x:-.2});
 near(a.force,-20);near(b.force,20);near(a.U,2);near(b.U,2);near(a.workSpring,-2);near(a.workStretch,2);
});
test('fall in ideal gravity conserves mechanical energy',()=>{
 const r=E.gravity({m:2,g:10,h0:40,h:10,v0:4});
 near(r.gravityWork,600);near(r.total,r.K+r.U);near(r.total,816);near(r.speed*r.speed,616);
});
test('spring exchange conserves total energy at ends and center',()=>{
 for(const x of [-.8,-.4,0,.4,.8]){
 const r=E.springExchange({m:2,k:100,amplitude:.8,x});
 near(r.K+r.U,r.total);assert.ok(r.K>=0);
 if(Math.abs(x)===.8)near(r.K,0);
 }
});
test('friction converts kinetic into thermal and clamps distance at stop',()=>{
 const p={m:2,v0:10,mu:.5,g:10};
 const a=E.friction({...p,distance:5}),b=E.friction({...p,distance:100});
 near(a.initialK,100);near(a.frictionForce,10);near(a.thermal,50);near(a.K,50);near(a.K+a.thermal,a.initialK);
 near(b.stopDistance,10);near(b.traveled,10);near(b.thermal,100);near(b.K,0);assert.equal(b.stopped,true);
 const c=E.friction({...p,mu:0,distance:100});near(c.K,100);near(c.thermal,0);assert.equal(c.stopDistance,Infinity);
});
test('projectile kinetic plus gravitational energy conserved, ground impact clipped',()=>{
 const p={m:2,v0:20,angle:45,h0:10,g:10};
 const flight=E.projectile({...p,t:0}).flight;
 for(const t of [0,.5,1,2,flight,flight+10]){
 const r=E.projectile({...p,t});near(r.K+r.U,r.total,1e-7);assert.ok(r.y>=0);
 }
 const landed=E.projectile({...p,t:flight+10});near(landed.y,0);near(landed.at,flight);assert.equal(landed.landed,true);
});
test('bad physical inputs throw',()=>{
 assert.throws(()=>E.gravity({m:2,g:10,h0:10,h:20}));
 assert.throws(()=>E.springExchange({k:100,m:1,amplitude:.5,x:.8}));
 assert.throws(()=>E.friction({m:0,v0:3,mu:.4,g:10,distance:1}));
});
test('energy and momentum pages use distinct files from biology photosynthesis lab',()=>{
 const html=load('is-guc-enerji.html');assert.match(html,/2018 MEB/);assert.match(html,/fizik-enerji-math.js/);assert.match(html,/mekanik-ui.js/);
 const biological=load('enerji-lab.html');assert.match(biological,/Fotosentez/);
});
