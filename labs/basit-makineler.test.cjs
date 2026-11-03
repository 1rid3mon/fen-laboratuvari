'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const w={};vm.runInNewContext(read('basit-makineler-math.js'),{window:w,Number,Math,Object},{filename:'basit-makineler-math.js'});
const M=w.BasitMakineMath,near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,String(a)+' != '+String(b));
test('lever: mechanical advantage and work conservation',()=>{
 const a=M.lever({load:100,effortArm:2,loadArm:1,travel:2,eta:1});
 near(a.effort,50);near(a.loadTravel,1);near(a.workIn,100);near(a.workOut,100);near(a.loss,0);
 const b=M.lever({load:100,effortArm:2,loadArm:1,travel:2,eta:.8});
 near(b.effort,62.5);near(b.loss,25);
});
test('fixed pulley only changes direction, moving rope strands give advantage',()=>{
 const a=M.pulley({load:120,moving:0,n:5,travel:2,eta:1});
 near(a.ratio,1);near(a.effort,120);near(a.loadTravel,2);
 const b=M.pulley({load:120,moving:1,n:3,travel:3,eta:1});
 near(b.effort,40);near(b.loadTravel,1);
});
test('incline force path tradeoff and efficiency',()=>{
 const a=M.incline({load:100,height:2,length:5,eta:1});near(a.effort,40);near(a.workIn,200);near(a.workOut,200);
 const b=M.incline({load:100,height:2,length:5,eta:.8});near(b.effort,50);near(b.loss,50);
 assert.throws(()=>M.incline({load:100,height:5,length:2,eta:1}));
});
test('wheel axle, screw conserve ideal work and pitch sets travel',()=>{
 const a=M.wheelAxle({load:100,wheelRadius:1,axleRadius:.25,turns:2,eta:1});
 near(a.effort,25);near(a.loadTravel,Math.PI);near(a.workIn,a.workOut);
 const b=M.screw({load:100,pitch:.01,turns:3,handleRadius:.2,eta:1});
 near(b.loadTravel,.03);near(b.effort,100*.01/(2*Math.PI*.2));near(b.workIn,3);
});
test('gears and belts preserve inverse speed-torque ratios',()=>{
 const a=M.gears({inputTeeth:20,outputTeeth:40,inputTurns:3,eta:1});
 near(a.outputTurns,-1.5);near(a.outputTorquePerInput,2);
 const b=M.belts({driveRadius:.3,drivenRadius:.6,driveTurns:4,crossed:false,eta:1});
 near(b.outputTurns,2);near(b.outputTorquePerInput,2);
 const c=M.belts({driveRadius:.3,drivenRadius:.6,driveTurns:4,crossed:true,eta:.8});
 near(c.outputTurns,-2);near(c.outputTorquePerInput,1.6);
});
test('two-stage designer only, efficiencies multiply and no free energy',()=>{
 const r=M.design({load:160,armEffort:2,armLoad:1,ropeCount:2,eta1:.9,eta2:.8,travel:4});
 near(r.ratio,4);near(r.eta,.72);near(r.effort,160/(4*.72));
 near(r.workOut,160);near(r.workIn,160/.72);near(r.loss,160/.72-160);
 assert.equal(r.stages,2);
 assert.throws(()=>M.design({load:100,armEffort:2,armLoad:1,ropeCount:9,travel:3}));
});
test('randomized conservation of work with realistic efficiencies',()=>{
 let seed=2018;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<400;i++){
 const load=10+rand()*300,eta=.5+.5*rand(),travel=.1+5*rand(),armEffort=.5+3*rand(),armLoad=.5+3*rand();
 const r=M.lever({load,effortArm:armEffort,loadArm:armLoad,travel,eta});
 near(r.workOut+r.loss,r.workIn);assert.ok(r.workIn>=r.workOut-1e-8);
 }
});
test('physical validation rejects invalid efficiency and rope counts',()=>{
 assert.throws(()=>M.lever({load:100,effortArm:2,loadArm:1,travel:1,eta:1.2}));
 assert.throws(()=>M.pulley({load:100,moving:1,n:2.5,travel:2,eta:1}));
 assert.throws(()=>M.screw({load:100,pitch:0,turns:3,handleRadius:.2,eta:1}));
});
test('HTML and 2018 MEB gain labels, no required quizzes',()=>{
 const html=read('basit-makineler.html');
 for(const token of ['11.1.10.1–11.1.10.3','basit-makineler-math.js','basit-makineler-lab.js'])assert.ok(html.includes(token));
 assert.ok(read('../index.html').includes('labs/basit-makineler.html'));
});
test('DOM: all eight experiments show live scene, calculations and no empty quiz',()=>{
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),listeners=new Map(),frames=[];
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,cb){listeners.set(id+':'+type,cb);}});
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id);},addEventListener(type,cb){listeners.set('doc:'+type,cb);}};
 const win={requestAnimationFrame(fn){frames.push(fn);}};
 const ctx=vm.createContext({window:win,document:doc,console});
 for(const file of ['basit-makineler-math.js','mekanik-ui.js','basit-makineler-lab.js'])vm.runInContext(read(file),ctx,{filename:file});
 listeners.get('doc:DOMContentLoaded')();
 assert.equal(win.BasitMakineLab.snapshot().questions,0);
 assert.doesNotMatch(nodes.get('tabs').innerHTML,/data-tab="quiz"/);
 for(const id of ['lever','pulley','incline','wheel','screw','gears','belts','design']){
  const el={dataset:{tab:id}},fn=listeners.get('tabs:click');
  fn({target:{closest(q){return q==='[data-tab]'?el:null;}}});
  assert.equal(win.BasitMakineLab.snapshot().state.tab,id);
  assert.match(nodes.get('scene').innerHTML,/<svg/);
  assert.ok(nodes.get('interpret').textContent.length>25,id);
  assert.ok(nodes.get('measurements').innerHTML.length>40,id);
  assert.ok(nodes.get('formula').textContent.length>10,id);
 }
 assert.equal(frames.length,0);
});
