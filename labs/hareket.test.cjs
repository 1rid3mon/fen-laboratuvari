'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=__dirname;
const read=name=>fs.readFileSync(path.join(base,name),'utf8');
const near=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance,'expected '+actual+' ≈ '+expected);

function loadMath(){
 const window={};
 vm.runInNewContext(read('hareket-math.js'),{window,Intl,Number,Math,Object,JSON},{filename:'hareket-math.js'});
 return window.HareketMath;
}
const M=loadMath();

test('vector arithmetic: components, opposite frame velocities, Pythagoras, angle',()=>{
 assert.equal(M.add(M.vec(3,4),M.vec(2,-3)).x,5);
 assert.equal(M.add(M.vec(3,4),M.vec(2,-3)).y,1);
 assert.equal(M.dot(M.vec(3,4),M.vec(4,-3)),0);
 near(M.mag(M.vec(3,4)),5);
 const rel=M.relative(M.vec(3,4),M.vec(4,0));
 assert.equal(rel.x,-1);assert.equal(rel.y,4);
 const opp=M.relative(M.vec(4,0),M.vec(3,4));
 near(opp.x,-rel.x);near(opp.y,-rel.y);
 near(M.mag(M.fromPolar(10,53.1301023542)),10,1e-7);
 near(M.angle(M.vec(0,1)),90);
});

test('river crossing time, downstream drift, steering upstream and limiting cases',()=>{
 const r=M.river({speed:8,angleDeg:90,current:3,width:120});
 near(r.time,15);near(r.exit,45);near(r.drift,45);
 near(r.water.x,0);near(r.ground.x,3);
 assert.equal(r.possibleAcross,true);
 const correct=M.river({speed:8,angleDeg:r.headingForAcross,current:3,width:120});
 near(correct.ground.x,0);near(correct.exit,0);
 near(correct.time,120/Math.sqrt(8*8-3*3));
 const impossible=M.river({speed:5,angleDeg:90,current:5,width:100});
 assert.equal(impossible.possibleAcross,false);
 assert.equal(impossible.headingForAcross,null);
 const faster=M.river({speed:5,angleDeg:90,current:6,width:100});
 assert.equal(faster.possibleAcross,false);
 const zeroAcross=M.river({speed:5,angleDeg:0,current:3,width:100});
 assert.equal(zeroAcross.time,null);
 assert.equal(zeroAcross.exit,null);
 const upstream=M.river({speed:8,angleDeg:90,current:-3,width:120});
 near(upstream.exit,-45);
});
test('airplane wind vector, crosswind, headwind and corrected heading',()=>{
 const w=M.wind({speed:300,angleDeg:90,windX:40,windY:0,northDistance:600});
 near(w.time,2);near(w.exit,80);near(M.mag(w.ground),Math.hypot(300,40));
 const head=M.wind({speed:300,angleDeg:90,windX:0,windY:-60,northDistance:600});
 near(head.time,2.5);near(head.exit,0);
 const theta=Math.acos(-40/300)*180/Math.PI;
 const corrected=M.wind({speed:300,angleDeg:theta,windX:40,windY:0,northDistance:600});
 near(corrected.ground.x,0);near(corrected.exit,0);
 const impossible=M.wind({speed:300,angleDeg:270,windX:0,windY:0,northDistance:600});
 assert.equal(impossible.time,null);
});
test('same-line rendezvous: meeting, catching, no meeting, equal velocities, already',()=>{
 const meeting=M.rendezvous({xA:0,xB:100,vA:6,vB:-4});
 near(meeting.time,10);near(meeting.position,60);
 const chase=M.rendezvous({xA:0,xB:40,vA:12,vB:8});
 near(chase.time,10);near(chase.position,120);
 assert.equal(M.rendezvous({xA:0,xB:40,vA:5,vB:8}).time,null);
 assert.equal(M.rendezvous({xA:0,xB:40,vA:8,vB:8}).time,null);
 near(M.rendezvous({xA:10,xB:10,vA:6,vB:2}).time,0);
 const reversed=M.rendezvous({xA:80,xB:0,vA:-4,vB:6});
 near(reversed.time,8);
});
test('net force acceleration; static friction not automatically max',()=>{
 const staticF=M.horizontal({mass:5,force:20,muStatic:.5,muKinetic:.3,g:10});
 assert.equal(staticF.state,'static');near(staticF.N,50);near(staticF.maxStatic,25);
 near(staticF.friction,-20);near(staticF.net,0);near(staticF.acceleration,0);
 const edge=M.horizontal({mass:5,force:25,muStatic:.5,muKinetic:.3,g:10});
 assert.equal(edge.state,'static');near(edge.friction,-25);
 const moving=M.horizontal({mass:5,force:40,muStatic:.5,muKinetic:.3,g:10});
 assert.equal(moving.state,'sliding');near(moving.friction,-15);near(moving.net,25);near(moving.acceleration,5);
 const negative=M.horizontal({mass:5,force:-40,muStatic:.5,muKinetic:.3,g:10});
 near(negative.friction,15);near(negative.acceleration,-5);
 const noForce=M.horizontal({mass:5,force:0,muStatic:.5,muKinetic:.3,g:10});
 near(noForce.friction,0);
});
test('incline: normal, downhill gravity, static friction direction, sliding',()=>{
 const r=M.incline({mass:5,angleDeg:30,force:0,g:10,muStatic:0,muKinetic:0});
 near(r.N,25*Math.sqrt(3));near(r.down,25);
 near(r.acceleration,-5);
 const atRest=M.incline({mass:5,angleDeg:30,force:25,g:10,muStatic:.3,muKinetic:.2});
 near(atRest.net,0);near(atRest.friction,0);
 const sticking=M.incline({mass:5,angleDeg:30,force:30,g:10,muStatic:.4,muKinetic:.2});
 near(sticking.friction,-5);near(sticking.acceleration,0);
 const above=M.incline({mass:5,angleDeg:30,force:60,g:10,muStatic:.4,muKinetic:.2});
 assert.equal(above.state,'sliding');
 assert.ok(above.friction<0,'friction downhill when slipping uphill');
 assert.ok(above.acceleration>0);
 const below=M.incline({mass:5,angleDeg:30,force:0,g:10,muStatic:.4,muKinetic:.2});
 assert.ok(below.friction>0,'friction uphill when slipping downhill');
});
test('elevator display normal force, acceleration versus velocity',()=>{
 const up=M.elevator({mass:60,acceleration:2,g:10});
 near(up.normal,720);near(up.weight,600);
 const down=M.elevator({mass:60,acceleration:-3,g:10});
 near(down.normal,420);
 near(M.elevator({mass:60,acceleration:0,g:10}).normal,600);
 near(M.elevator({mass:60,acceleration:-10,g:10}).normal,0);
});
test('source boundaries and standalone AYT links',()=>{
 const relative=read('vektorler-bagil-hareket.html'),newton=read('newton-hareket-yasalari.html');
 const home=read('../index.html');
 for(const text of [relative,newton]){
  assert.match(text,/2018 MEB/);
  assert.match(text,/hareket-math\.js/);
  assert.match(text,/hareket-lab\.css/);
 }
 assert.match(home,/newton-hareket-yasalari\.html/);
 assert.match(home,/vektorler-bagil-hareket\.html/);
 assert.doesNotMatch(relative+newton,/Maarif Modeli esas alınır/);
 assert.match(relative,/bagil-lab\.js/);assert.match(newton,/newton-lab\.js/);
});
function harness(module,which){
 const win={HareketMath:loadMath(),requestAnimationFrame(fn){this.frames.push(fn);return this.frames.length;},frames:[]};
 const elements=new Map(),listeners=new Map(),tabObjects=[];
 function el(id){return {
  id,innerHTML:'',textContent:'',value:'',dataset:{},className:'',disabled:false,
  classList:{toggle(){}},
  setAttribute(){},
  addEventListener(k,f){listeners.set(id+':'+k,f);},
  querySelector(){return {getBoundingClientRect(){return {left:0,top:0,width:860,height:510};}};},
  setPointerCapture(){}
 };}
 for(const id of ['tabs','heading','intro','tagline','scene','buttons','hint','controls','results','lesson','quiz'])elements.set(id,el(id));
 const doc={readyState:'loading',getElementById(id){if(!elements.has(id))elements.set(id,el(id));return elements.get(id);},
  querySelectorAll(selector){if(selector!=='[data-tab]')return [];return [...elements.get('tabs').innerHTML.matchAll(/data-tab="([^"]+)"/g)].map(m=>({dataset:{tab:m[1]},classList:{toggle(){}},setAttribute(){}}));},
  addEventListener(type,fn){listeners.set('doc:'+type,fn);},hidden:false
 };
 const ctx=vm.createContext({window:win,document:doc,console,Math,Intl,Number,Date});
 vm.runInContext(read(module),ctx,{filename:module,timeout:7000});
 const start=listeners.get('doc:DOMContentLoaded');assert.equal(typeof start,'function');start();
 function event(id,kind,selector,values={}){
  const f=listeners.get(id+':'+kind);assert.equal(typeof f,'function',id+' '+kind);
  const node={dataset:values.dataset||{},value:values.value,disabled:!!values.disabled,
   closest(q){return q===selector?this:null;}};
  f({target:{closest(q){return q===selector?node:null;}},pointerId:values.pointerId??1,
   clientX:values.clientX??450,clientY:values.clientY??250,preventDefault(){}});
 }
 return {win,doc,elements,event,inspect:()=>win[which].snapshot()};
}
test('relative DOM: all six tabs render with user controls and no crashes',()=>{
 const h=harness('bagil-lab.js','BagilLabDebug');
 for(const tab of ['vectors','observer','meet','river','wind','quiz']){
  h.event('tabs','click','[data-tab]',{dataset:{tab}});
  assert.equal(h.inspect().tab,tab);
  assert.match(h.elements.get('scene').innerHTML,/<svg/);
  assert.ok(h.elements.get('results').innerHTML.length>35);
 }
});
test('relative DOM: observer switch, river correction, wind controls, quiz choice',()=>{
 const h=harness('bagil-lab.js','BagilLabDebug');
 h.event('tabs','click','[data-tab]',{dataset:{tab:'observer'}});
 h.event('controls','change','select[data-select]',{dataset:{select:'ref'},value:'A'});
 assert.equal(h.inspect().observer.ref,'A');
 assert.match(h.elements.get('scene').innerHTML,/Gözlemci: A/);
 h.event('buttons','click','[data-action]',{dataset:{action:'flip'}});
 assert.equal(h.inspect().observer.ref,'B');
 h.event('tabs','click','[data-tab]',{dataset:{tab:'river'}});
 h.event('buttons','click','[data-action]',{dataset:{action:'correct'}});
 const r=h.inspect().river;
 const ground=M.river({speed:r.speed,angleDeg:r.heading,current:r.current,width:r.width});
 assert.ok(Math.abs(ground.exit)<.07,'rounded heading should land near target');
 h.event('tabs','click','[data-tab]',{dataset:{tab:'quiz'}});
 h.event('quiz','click','[data-answer]',{dataset:{answer:'0'}});
 h.event('buttons','click','[data-action]',{dataset:{action:'check'}});
 assert.equal(h.inspect().quiz.score,1);
 assert.match(h.elements.get('quiz').innerHTML,/feedback/);
});
test('Newton DOM: six experiments and sliders; quiz scoring',()=>{
 const h=harness('newton-lab.js','NewtonLabDebug');
 for(const tab of ['net','friction','incline','elevator','third','quiz']){
  h.event('tabs','click','[data-tab]',{dataset:{tab}});
  assert.equal(h.inspect().tab,tab);
  assert.match(h.elements.get('scene').innerHTML,/<svg/);
  assert.ok(h.elements.get('results').innerHTML.length>35);
 }
 h.event('quiz','click','[data-answer]',{dataset:{answer:'1'}});
 h.event('buttons','click','[data-action]',{dataset:{action:'check'}});
 assert.equal(h.inspect().quiz.score,1);
 h.event('buttons','click','[data-action]',{dataset:{action:'next'}});
 assert.equal(h.inspect().quiz.index,1);
 h.event('tabs','click','[data-tab]',{dataset:{tab:'friction'}});
 h.event('controls','input','input[data-range]',{dataset:{range:'force',unit:'N'},value:'40'});
 assert.equal(h.inspect().friction.force,40);
 assert.match(h.elements.get('results').innerHTML,/Kinetik/);
});
