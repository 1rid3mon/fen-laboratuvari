'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
function setup(){
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),handlers=new Map(),frames=[];
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,fn){handlers.set(id+':'+type,fn);}});
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id)},addEventListener(type,fn){handlers.set('doc:'+type,fn);}};
 const win={requestAnimationFrame(fn){frames.push(fn)},Event:class{constructor(type,opts){this.type=type;this.bubbles=opts?.bubbles;}}};
 const ctx=vm.createContext({window:win,document:doc,console});
 for(const f of ['basit-makineler-math.js','mekanik-ui.js','basit-makineler-kinematik.js','basit-makineler-lab.js'])
 vm.runInContext(read(f),ctx,{filename:f});
 handlers.get('doc:DOMContentLoaded')();
 const change=id=>handlers.get('tabs:click')({target:{closest:()=>({dataset:{tab:id}})}});
 return {win,doc,nodes,handlers,frames,change,ctx};
}
test('eight independently movable machines have real SVG visuals and motion controls',()=>{
 const {win,nodes,change}=setup();for(const id of ['lever','pulley','incline','wheel','screw','gears','belts','design']){
 change(id);assert.match(nodes.get('scene').innerHTML,/<svg/);assert.match(nodes.get('scene').innerHTML,/data-drag="/,id);assert.match(nodes.get('actions').innerHTML,/data-action="motion-play"/,id);
 const snap=win.BasitMakineLab.snapshot();assert.equal(snap.state.tab,id);assert.equal(snap.questions,0);
 }
});
test('gear teeth ratio controls animated orientation and output spins backward',()=>{
 const {win,nodes,change}=setup();change('gears');
 const p={inputTeeth:20,outputTeeth:40,inputTurns:1.25,eta:1},o=win.BasitMakineMath.gears(p),svg=win.BasitKinematik.scenes.gears(p,o,win.MekanikUI.U);
 assert.equal(o.outputTurns,-.625);assert.match(svg,/rotate\(450/);assert.match(svg,/rotate\(-220\.5/);
 const n=win.BasitKinematik.scenes.gears({...p,inputTurns:1.5},win.BasitMakineMath.gears({...p,inputTurns:1.5}),win.MekanikUI.U);
 assert.notEqual(svg,n);assert.match(nodes.get('scene').innerHTML,/data-drag="inputTurns"/);
});
test('belt rotation direction changes for crossed and open belts',()=>{
 const {win}=setup();const p={driveRadius:.3,drivenRadius:.6,driveTurns:1.5,crossed:0,eta:1},m=win.BasitMakineMath;
 assert.equal(m.belts({...p,crossed:false}).outputTurns,.75);
 assert.equal(m.belts({...p,crossed:true}).outputTurns,-.75);
 const s1=win.BasitKinematik.scenes.belts(p,m.belts({...p,crossed:false}),win.MekanikUI.U),s2=win.BasitKinematik.scenes.belts({...p,crossed:1},m.belts({...p,crossed:true}),win.MekanikUI.U);
 assert.match(s1,/Açık kayış/);assert.match(s2,/Çapraz kayış/);assert.notEqual(s1,s2);
});
test('continuous motor is opt-in and has no idle frame loops',()=>{
 const {win,nodes,handlers,frames,change}=setup();change('gears');assert.equal(frames.length,0);
 handlers.get('actions:click')({target:{closest:()=>({dataset:{action:'motion-play'}})}});
 assert.equal(frames.length,1);const t1=frames.shift();t1(1000);const t2=frames.shift();assert.ok(t2);t2(1100);
 assert.ok(win.BasitMakineLab.snapshot().values.gears.inputTurns>0);
 assert.match(nodes.get('scene').innerHTML, /rotate\(/);
 handlers.get('actions:click')({target:{closest:()=>({dataset:{action:'motion-play'}})}});
 const prev=win.BasitMakineLab.snapshot().values.gears.inputTurns;
 frames.shift()(1200);assert.equal(win.BasitMakineLab.snapshot().values.gears.inputTurns,prev);
});
test('HTML includes pointer engine and iPad-friendly motion style',()=>{
 const h=read('basit-makineler.html');for(const f of ['basit-makineler-kinematik.js','basit-makineler-pointer.js'])assert.ok(h.includes(f));
 assert.match(h,/motion-scene/);assert.match(read('mekanik-lab.css'),/touch-action:none/);
});

test('every machine visibly changes its scene when the physically relevant displacement changes',()=>{
 const {win}=setup();const U=win.MekanikUI.U,M=win.BasitMakineMath,K=win.BasitKinematik.scenes;
 const cases=[
 ['lever',{load:100,effortArm:2,loadArm:1,travel:.5,eta:1},'travel',1],
 ['pulley',{load:120,moving:1,n:2,travel:1,eta:1},'travel',2],
 ['incline',{load:100,height:1,length:4,eta:1,progress:.2},'progress',.8],
 ['wheel',{load:100,wheelRadius:1,axleRadius:.25,turns:1,eta:1},'turns',2],
 ['screw',{load:100,pitch:.01,turns:1,handleRadius:.2,eta:.8},'turns',3],
 ['gears',{inputTeeth:20,outputTeeth:40,inputTurns:1,eta:1},'inputTurns',1.25],
 ['belts',{driveRadius:.3,drivenRadius:.6,driveTurns:1,crossed:0,eta:1},'driveTurns',1.25],
 ['design',{load:160,armEffort:2,armLoad:1,ropeCount:2,travel:2,eta1:.9,eta2:.85},'travel',3]
 ];
 for(const [id,p,key,next] of cases){
 const calc=x=>id==='wheel'?M.wheelAxle(x):id==='pulley'?M.pulley(x):id==='gears'?M.gears(x):id==='belts'?M.belts({...x,crossed:!!x.crossed}):M[id](x);
 const before=K[id](p,calc(p),U),modified={...p,[key]:next},after=K[id](modified,calc(modified),U);
 assert.notEqual(before,after,id+' displacement did not affect physical drawing');
 }
});
