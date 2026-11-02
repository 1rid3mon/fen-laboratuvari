'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const load=name=>fs.readFileSync(path.join(__dirname,name),'utf8'),near=(x,y,eps=1e-7)=>assert.ok(Math.abs(x-y)<=eps,'Expected '+x+' ≈ '+y);
const w={};vm.runInNewContext(load('momentum-math.js'),{window:w,Math,Number,Object},{filename:'momentum-math.js'});
const M=w.MomentumMath;
test('vector sign and kinetic energy',()=>{const r=M.momentum({m:3,v:-4});near(r.p,-12);near(r.K,24);});
test('force-time signed area equals delta momentum; time-clamped',()=>{
 const p={m:2,v0:3,f0:20,f1:-20,duration:4};
 const a=M.impulse({...p,t:1}),b=M.impulse({...p,t:4}),c=M.impulse({...p,t:100});
 near(a.J,15);near(b.J,0);near(c.J,0);near(a.p-a.p0,a.J);
 near(b.v,3);near(c.at,4);
});
test('rectangular and triangular force-time impulses',()=>{
 near(M.impulse({m:1,v0:0,f0:10,f1:10,duration:3,t:3}).J,30);
 near(M.impulse({m:1,v0:0,f0:0,f1:10,duration:3,t:3}).J,15);
});
test('perfectly elastic head-on collision preserves both p and K',()=>{
 const r=M.collide1d({m1:2,m2:3,u1:8,u2:-2,e:1});
 near(r.initialP,r.finalP);near(r.initialK,r.finalK);near(r.lost,0);
 near(r.v1,-4);near(r.v2,6);
});
test('e=0 1D collision yields shared final velocity, K may decrease',()=>{
 const r=M.collide1d({m1:2,m2:3,u1:8,u2:-2,e:0});
 near(r.v1,r.v2);near(r.v1,2);near(r.initialP,r.finalP);assert.ok(r.lost>0);
});
test('nonapproaching velocities do not create fake 1D collision',()=>{
 const r=M.collide1d({m1:1,m2:3,u1:-2,u2:8,e:1});
 assert.equal(r.approaching,false);near(r.v1,-2);near(r.v2,8);near(r.lost,0);
});
test('1D explosion conserves momentum; energy comes from internal supply',()=>{
 const r=M.explode1d({m1:2,m2:4,vCenter:0,J:12});
 near(r.v1,6);near(r.v2,-3);near(r.initialP,0);near(r.finalP,0);near(r.addedEnergy,54);
 const m=M.explode1d({m1:2,m2:4,vCenter:3,J:12});near(m.initialP,m.finalP);near(m.addedEnergy,54);
});
test('2D oblique elastic collision conserves px, py, kinetic energy',()=>{
 const r=M.collide2d({m1:2,m2:3,u1x:8,u1y:2,u2x:-2,u2y:1,angle:35,e:1});
 assert.equal(r.approaching,true);near(r.p0x,r.p1x);near(r.p0y,r.p1y);near(r.K0,r.K1);
});
test('2D inelastic collision reduces K without destroying tangential relative velocity',()=>{
 const p={m1:2,m2:3,u1x:8,u1y:2,u2x:-2,u2y:1,angle:0,e:0};
 const r=M.collide2d(p);
 near(r.p0x,r.p1x);near(r.p0y,r.p1y);assert.ok(r.K1<r.K0);
 near(r.v1x,r.v2x);near(r.v1y-r.v2y,p.u1y-p.u2y);
 assert.ok(Math.abs(r.v1y-r.v2y)>0,'e=0 does not always mean sticking in 2D');
});
test('2D no approach returns original velocity (no collision)',()=>{
 const r=M.collide2d({m1:2,m2:3,u1x:-8,u1y:0,u2x:2,u2y:0,angle:0,e:1});
 assert.equal(r.approaching,false);near(r.J,0);near(r.v1x,-8);near(r.v2x,2);
});
test('2D explosions conserve both components and add only internal energy',()=>{
 for(let angle=0;angle<=360;angle+=15){
 const r=M.explode2d({m1:2,m2:3,vcx:2,vcy:-1,J:15,angle});
 near(r.p0x,r.p1x);near(r.p0y,r.p1y);assert.ok(r.addedEnergy>=-1e-8);
 }
});
test('randomized 1D/2D momentum invariant stress',()=>{
 let seed=38102;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<300;i++){
  const m1=.1+9*random(),m2=.1+9*random(),u1=-10+20*random(),u2=-10+20*random(),e=random();
  const r=M.collide1d({m1,m2,u1,u2,e});near(r.initialP,r.finalP,1e-6);assert.ok(r.finalK<=r.initialK+1e-6);
  const t=M.collide2d({m1,m2,u1x:u1,u1y:-10+20*random(),u2x:u2,u2y:-10+20*random(),angle:360*random(),e});
  near(t.p0x,t.p1x,1e-6);near(t.p0y,t.p1y,1e-6);assert.ok(t.K1<=t.K0+1e-6);
 }
});
test('invalid mass and coefficient rejected',()=>{
 assert.throws(()=>M.collide1d({m1:0,m2:2,u1:3,u2:1,e:1}));
 assert.throws(()=>M.collide2d({m1:1,m2:2,u1x:1,u1y:1,u2x:0,u2y:0,angle:0,e:1.1}));
});
test('momentum landing page contains correct 2018 MEB scope and assets',()=>{
 const html=load('itme-cizgisel-momentum.html');assert.match(html,/11\.1\.7\.1–11\.1\.7\.4/);assert.match(html,/momentum-lab.js/);assert.match(html,/mekanik-ui.js/);
});
