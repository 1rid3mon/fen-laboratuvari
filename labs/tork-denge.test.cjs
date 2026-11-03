'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const near=(x,y,eps=1e-7)=>assert.ok(Math.abs(x-y)<eps,'Expected '+x+' close to '+y);
const w={};vm.runInNewContext(read('tork-denge-math.js'),{window:w,Number,Math,Array,Object},{filename:'tork-denge-math.js'});
const M=w.TorkDengeMath;
test('2018 MEB torque: force, arm, angle and sign exactly',()=>{
 const a=M.torque({r:2,F:30,angle:90}),b=M.torque({r:-2,F:30,angle:90});
 near(a.tau,60);near(b.tau,-60);near(a.arm,2);near(a.fx,0);
 assert.equal(a.side,'ccw');assert.equal(b.side,'cw');near(a.fy,30);
 near(M.torque({r:2,F:30,angle:0}).tau,0);
 near(M.torque({r:2,F:30,angle:-90}).tau,-60);
 near(M.torque({r:0,F:30,angle:90}).tau,0);
 near(M.torque({r:2,F:0,angle:90}).tau,0);
});
test('signed torque respects inverse force and lever-arm proportionalities',()=>{
 const t=M.torque({r:1,F:20,angle:30}).tau;
 near(M.torque({r:2,F:20,angle:30}).tau,2*t);
 near(M.torque({r:1,F:40,angle:30}).tau,2*t);
 near(M.torque({r:1,F:20,angle:150}).tau,t);
});
test('seesaw: both force and torque equilibrium must hold simultaneously',()=>{
 const p={leftArm:2,rightArm:2,leftForce:40,rightForce:40,support:80},a=M.seesaw(p);
 assert.equal(a.equilibrium,true);near(a.netFy,0);near(a.netTau,0);
 const noSupport=M.seesaw({...p,support:0});
 assert.equal(noSupport.rotationalBalance,true);assert.equal(noSupport.translationalBalance,false);
 const noTorque=M.seesaw({...p,rightForce:20,support:60});
 assert.equal(noTorque.rotationalBalance,false);assert.equal(noTorque.translationalBalance,true);
 near(noTorque.requiredRight,40);near(noTorque.requiredSupport,60);
});
test('two simple supports, uniform beam plus load exactly conserve forces and moments',()=>{
 const r=M.supports({length:6,beamMass:4,loadMass:3,loadX:4,leftSupport:0,rightSupport:5,g:10});
 near(r.RA+r.RB,70);near(r.RB,48);near(r.RA,22);near(r.netFy,0);near(r.netTauA,0);
 assert.equal(r.feasible,true);
});
test('free support cannot pull down: required negative reaction flagged impossible',()=>{
 const r=M.supports({length:6,beamMass:0,loadMass:10,loadX:6,leftSupport:0,rightSupport:4,g:10});
 near(r.RB,150);near(r.RA,-50);assert.equal(r.feasible,false);
});
test('supports validate physical geometry and allow unloaded beam',()=>{
 assert.throws(()=>M.supports({length:6,beamMass:1,loadMass:1,loadX:0,leftSupport:4,rightSupport:4,g:10}));
 assert.throws(()=>M.supports({length:6,beamMass:1,loadMass:1,loadX:8,leftSupport:0,rightSupport:5,g:10}));
 const r=M.supports({length:6,beamMass:0,loadMass:0,loadX:4,leftSupport:0,rightSupport:6,g:10});
 near(r.RA,0);near(r.RB,0);assert.equal(r.feasible,true);
});
test('hinged shelf: tension, signed hinge reactions satisfy ΣFx, ΣFy, Στ',()=>{
 const r=M.shelf({length:4,beamMass:3,loadMass:4,loadFraction:.75,angle:30,g:10});
 near(r.torqueWeight,180);near(r.tension,90);near(r.tensionY,45);
 near(r.hingeRx,90*Math.cos(Math.PI/6));
 near(r.hingeRy,25);near(r.netFx,0);near(r.netFy,0);near(r.netTau,0);
});
test('shelf cable tension grows when angle gets smaller',()=>{
 const p={length:4,beamMass:3,loadMass:5,loadFraction:1,g:10};
 assert.ok(M.shelf({...p,angle:25}).tension>M.shelf({...p,angle:75}).tension);
 assert.throws(()=>M.shelf({...p,angle:0}));
});
test('2D center of mass weighted coordinates',()=>{
 const r=M.center({masses:[1,2,3],points:[[0,0],[3,0],[0,4]]});
 near(r.mass,6);near(r.x,1);near(r.y,2);
 const e=M.center({masses:[2,2],points:[[0,1],[8,1]]});near(e.x,4);near(e.y,1);
});
test('mass center and gravity center coincide for uniform field, diverge for varied parallel field',()=>{
 const p={m1:2,m2:2,x1:0,x2:8,g1:10,g2:10};
 const a=M.gravityCenter(p);near(a.massCenter,4);near(a.weightCenter,4);assert.equal(a.same,true);
 const b=M.gravityCenter({...p,g2:15});near(b.massCenter,4);near(b.weightCenter,4.8);
 assert.equal(b.same,false);assert.ok(b.weightCenter>b.massCenter);
});
test('support polygon 1D projection: inside, edge and outside tipping direction',()=>{
 const p={width:2,m:4,g:10};
 assert.equal(M.baseSupport({...p,centerX:0}).inside,true);
 assert.equal(M.baseSupport({...p,centerX:1}).inside,true);
 const right=M.baseSupport({...p,centerX:2});assert.equal(right.inside,false);near(right.tippingTorque,-40);assert.equal(right.status,'right');
 const left=M.baseSupport({...p,centerX:-2});assert.equal(left.inside,false);near(left.tippingTorque,40);assert.equal(left.status,'left');
});
test('numerical 500 randomized static equilibria including reactions',()=>{
 let seed=8809;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<500;i++){
  const leftArm=.5+2*rand(),rightArm=.5+2*rand(),leftForce=100*rand(),rightForce=leftForce*leftArm/rightArm;
  const s=M.seesaw({leftArm,rightArm,leftForce,rightForce,support:leftForce+rightForce});
  near(s.netFy,0);near(s.netTau,0);assert.equal(s.equilibrium,true);
  const length=4+4*rand(),a=rand(),b=length-rand(),loadX=length*rand(),beamMass=10*rand(),loadMass=10*rand();
  const r=M.supports({length,beamMass,loadMass,loadX,leftSupport:a,rightSupport:b,g:10});
  near(r.netFy,0);near(r.netTauA,0);
  const sh=M.shelf({length,beamMass,loadMass,loadFraction:rand(),angle:20+60*rand(),g:10});
  near(sh.netFx,0);near(sh.netFy,0);near(sh.netTau,0);
 }
});
test('invalid physical masses, gravity and positions rejected',()=>{
 assert.throws(()=>M.gravityCenter({m1:0,m2:1,x1:0,x2:3,g1:10,g2:10}));
 assert.throws(()=>M.torque({r:1,F:-3,angle:90}));
 assert.throws(()=>M.baseSupport({width:0,m:1,centerX:0,g:10}));
 assert.throws(()=>M.center({masses:[1,-2],points:[[0,0],[2,0]]}));
});
test('new lab page serves local assets and exact 2018 MEB gain labels, without mandatory quiz',()=>{
 const html=read('tork-denge.html');
 for(const x of ['11.1.8.1–3','11.1.9.1–3','tork-denge-math.js','mekanik-ui.js','tork-denge-lab.js','tork-denge-pointer.js'])assert.ok(html.includes(x),x);
 assert.ok(read('../index.html').includes('labs/tork-denge.html'));
});
function domHarness(){
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),events=new Map(),frames=[];
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,cb){events.set(id+':'+type,cb);}});
 const doc={readyState:'loading',hidden:false,getElementById(id){
  if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(){}});
  return nodes.get(id);
 },addEventListener(type,cb){events.set('doc:'+type,cb);}};
 const win={requestAnimationFrame(fn){frames.push(fn);}};
 const ctx=vm.createContext({window:win,document:doc,console});
 for(const file of ['tork-denge-math.js','mekanik-ui.js','tork-denge-lab.js'])
  vm.runInContext(read(file),ctx,{filename:file,timeout:3000});
 events.get('doc:DOMContentLoaded')();
 function fire(id,event,selector,dataset,value){
  const cb=events.get(id+':'+event);assert.equal(typeof cb,'function');
  const target={dataset,value,closest(q){return selector===q?this:null;}};
  cb({target:{closest(q){return selector===q?target:null;}}});
 }
 return {nodes,win,frames,events,fire,snapshot:()=>win.TorkDengeLab.snapshot()};
}
test('DOM: all eight interactive observations render live SVG and explanation, no quiz tab or idle loop',()=>{
 const h=domHarness();assert.equal(h.snapshot().questions,0);assert.doesNotMatch(h.nodes.get('tabs').innerHTML,/data-tab="quiz"/);
 assert.equal(h.frames.length,0);
 for(const id of ['torque','door','seesaw','supports','shelf','center','cg','base']){
  h.fire('tabs','click','[data-tab]',{tab:id});
  assert.equal(h.snapshot().state.tab,id);
  assert.match(h.nodes.get('scene').innerHTML,/<svg/);
  assert.ok(h.nodes.get('formula').textContent.length>20,id);
  assert.ok(h.nodes.get('interpret').textContent.length>20,id);
  assert.ok(h.nodes.get('measurements').innerHTML.length>50,id);
 }
});
test('DOM: changing torque angle updates real model without replacing active touch slider',()=>{
 const h=domHarness(),before=h.nodes.get('controls').innerHTML;
 h.fire('controls','input','input[data-control]',{control:'angle'},'0');
 assert.equal(h.nodes.get('controls').innerHTML,before);
 assert.ok(h.nodes.get('interpret').textContent.includes('sıfır'));
 near(h.snapshot().values.torque.angle,0);
 h.fire('controls','input','input[data-control]',{control:'angle'},'-90');
 assert.ok(h.nodes.get('interpret').textContent.includes('saat yönünde'));
 assert.equal(h.frames.length,0);
});
test('DOM: independent translation/rotation equilibrium and impossible support states react to user input',()=>{
 const h=domHarness();h.fire('tabs','click','[data-tab]',{tab:'seesaw'});
 assert.match(h.nodes.get('interpret').textContent,/Tam denge/);
 h.fire('controls','input','input[data-control]',{control:'support'},'0');
 assert.match(h.nodes.get('interpret').textContent,/Net tork sıfır, ama net kuvvet sıfır değil/);
 h.fire('tabs','click','[data-tab]',{tab:'supports'});
 h.fire('controls','input','input[data-control]',{control:'beamMass'},'0');
 h.fire('controls','input','input[data-control]',{control:'loadMass'},'10');
 h.fire('controls','input','input[data-control]',{control:'loadX'},'6');
 h.fire('controls','input','input[data-control]',{control:'rightSupport'},'4');
 assert.match(h.nodes.get('interpret').textContent,/negatif destek kuvveti/);
 h.fire('tabs','click','[data-tab]',{tab:'cg'});
 h.fire('controls','input','input[data-control]',{control:'g2'},'14');
 assert.match(h.nodes.get('interpret').textContent,/farklı/);
 assert.equal(h.frames.length,0);
});

test('direct drag: pointer movement updates existing torque and 2D center sliders with snapping',()=>{
 const listeners=new Map(),events=[],inputs=new Map();let tab='torque';
 function input(id,min,max,step,val){const t={min:String(min),max:String(max),step:String(step),value:String(val),
 dispatchEvent(evt){events.push({id,value:Number(this.value),type:evt.type,bubbles:evt.bubbles});}};inputs.set(id,t);return t;}
 const r=input('r',-3,3,.25,2),x1=input('x1',0,8,.5,1),y1=input('y1',0,5,.5,1);
 const svg={getBoundingClientRect(){return {left:0,top:0,width:800,height:360};}};
 const scene={addEventListener(type,cb){listeners.set(type,cb);},querySelector(q){assert.equal(q,'svg');return svg;},
 setPointerCapture(){},hasPointerCapture(){return false;}};
 const controls={querySelector(q){return inputs.get(q.match(/data-control="([^"]+)"/)?.[1])||null;}};
 const d={getElementById(id){return id==='scene'?scene:id==='controls'?controls:null;}};
 const w={TorkDengeLab:{snapshot(){return {state:{tab}};}},Event:class Event{constructor(type,opts){this.type=type;this.bubbles=opts.bubbles;}}};
 vm.runInNewContext(read('tork-denge-pointer.js'),{window:w,document:d,Math,Number},{filename:'tork-denge-pointer.js'});
 const pointer=(handle,x,y=215,id=42)=>({pointerId:id,clientX:x,clientY:y,preventDefault(){},
 target:{closest(sel){return sel==='[data-drag]'?{dataset:{drag:handle}}:null;}}});
 listeners.get('pointerdown')(pointer('r',400));
 near(Number(r.value),0);
 listeners.get('pointermove')(pointer('r',570));near(Number(r.value),2);
 listeners.get('pointerup')(pointer('r',570));
 tab='center';
 listeners.get('pointerdown')(pointer('point1',314,202));
 near(Number(x1.value),3);near(Number(y1.value),2);
 listeners.get('pointercancel')(pointer('point1',314,202));
 assert.ok(events.length>=4);
 assert.ok(events.every(e=>e.type==='input'&&e.bubbles));
 assert.equal(listeners.has('pointermove'),true);
});
