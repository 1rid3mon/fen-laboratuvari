'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const win={};vm.runInNewContext(read('elektrik-alan-math.js'),{window:win,Math,Number,Object},{filename:'elektrik-alan-math.js'});
const M=win.ElektrikAlanMath,near=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<=eps,String(a)+' != '+String(b));
test('single positive and negative point charges: exact Coulomb field and sign',()=>{
 const p=M.chargeField(1,0,0,100,0),n=M.chargeField(-1,0,0,100,0);
 near(p.mag,8.99);near(p.x,8.99);near(p.y,0);near(n.x,-8.99);near(n.mag,8.99);
 near(M.chargeField(1,0,0,200,0).mag,8.99/4);
 assert.equal(M.chargeField(1,0,0,0,0).valid,false);
});
test('two-charge superposition adds vectors and permits E=0',()=>{
 const a=M.field([{q:2,x:-100,y:0},{q:2,x:100,y:0}],0,0);
 near(a.x,0);near(a.y,0);near(a.mag,0);
 const b=M.field([{q:2,x:-100,y:0},{q:-2,x:100,y:0}],0,0);
 assert.ok(b.x>0);near(b.y,0);
});
test('Coulomb force in Newtons reverses with test charge',()=>{
 const source=[{q:5,x:0,y:0}];
 const pos=M.force(2,source,100,0),neg=M.force(-2,source,100,0);
 near(pos.x,-neg.x);near(pos.y,0);near(pos.x,pos.field.x*2e-9);
 near(M.force(0,source,100,0).mag,0);
});
test('potential is signed scalar, zero potential need not mean zero field',()=>{
 const charges=[{q:4,x:-3,y:0},{q:-4,x:3,y:0}];
 const v=M.potential(charges,0,0),e=M.field(charges,0,0);
 near(v.value,0);assert.ok(e.mag>0);
 assert.equal(M.potential(charges,-3,0).valid,false);
 near(M.energy(2,charges,0,0).U,0);
});
test('uniform field work and potential signs, positive/negative charges',()=>{
 const a=M.uniform(2,300,0,3,0);
 near(a.dV,-9);near(a.workByField,18e-9);near(a.dU,-18e-9);
 const b=M.uniform(-2,300,0,3,0);
 near(b.workByField,-18e-9);near(b.force.x,-600e-9);
 const c=M.uniform(2,0,400,3,0);near(c.dV,0);near(c.workByField,0);
});
test('energy and force scale consistently with charges and distance',()=>{
 const source=[{q:4,x:0,y:0}],a=M.force(2,source,100,0),b=M.force(4,source,100,0);
 near(b.mag,2*a.mag);near(M.force(2,source,200,0).mag,a.mag/4);
});
test('400 deterministic charge configurations obey vector superposition',()=>{
 let seed=42;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<400;i++){
 const c1={q:-6+12*rand(),x:-4,y:2},c2={q:-6+12*rand(),x:4,y:-2},px=-1+2*rand(),py=-1+2*rand();
 const a=M.chargeField(c1.q,c1.x,c1.y,px,py),b=M.chargeField(c2.q,c2.x,c2.y,px,py);
 const e=M.field([c1,c2],px,py);
 near(e.x,a.x+b.x,1e-5);near(e.y,a.y+b.y,1e-5);
 }
});
test('invalid or singular charge configurations cannot generate fake infinity',()=>{
 assert.throws(()=>M.chargeField(NaN,0,0,1,1));
 assert.throws(()=>M.chargeField(Infinity,0,0,1,1));
 assert.equal(M.field([{q:1,x:2,y:3}],2,3).valid,false);
});
test('HTML includes local scripts and no mandatory question bank',()=>{
 const html=read('elektrik-alan.html');
 for(const name of ['elektrik-alan-math.js','mekanik-ui.js','elektrik-alan-lab.js'])assert.ok(html.includes(name));
 assert.ok(read('../index.html').includes('labs/elektrik-alan.html'));
});
test('DOM: all six tabs render real-time field diagrams and measurements',()=>{
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),events=new Map();
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,cb){events.set(id+':'+type,cb);}});
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id);},addEventListener(type,cb){events.set('doc:'+type,cb);}};
 const w={requestAnimationFrame(){throw Error('No idle animations allowed');}};
 const ctx=vm.createContext({window:w,document:doc,console});
 for(const file of ['elektrik-alan-math.js','mekanik-ui.js','elektrik-alan-lab.js'])vm.runInContext(read(file),ctx,{filename:file});
 events.get('doc:DOMContentLoaded')();
 assert.equal(w.ElektrikAlanLab.snapshot().questions,0);
 for(const id of ['single','superposition','coulomb','potential','uniform','compare']){
  events.get('tabs:click')({target:{closest(q){return q==='[data-tab]'?{dataset:{tab:id}}:null;}}});
  assert.equal(w.ElektrikAlanLab.snapshot().state.tab,id);
  assert.match(nodes.get('scene').innerHTML,/<svg/);
  assert.ok(nodes.get('formula').textContent.length>10,id);
  assert.ok(nodes.get('measurements').innerHTML.length>30,id);
  assert.ok(nodes.get('interpret').textContent.length>20,id);
 }
});
