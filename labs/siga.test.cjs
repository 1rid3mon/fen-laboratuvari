'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const win={};vm.runInNewContext(read('siga-math.js'),{window:win,Math,Number,Object},{filename:'siga-math.js'});
const M=win.SigaMath,near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,String(a)+' != '+String(b));
test('plate C = epsilon A/d with real SI conversions',()=>{
 const p=M.plate({area:100,distance:1,dielectric:1,voltage:10});
 near(p.Cmicro,8.8541878128e-5,1e-12);
 near(p.Qmicro,p.Cmicro*10,1e-12);near(p.U_microJ,.5*p.Cmicro*100,1e-12);
 near(p.E,10000);
 const d=M.plate({area:200,distance:1,dielectric:2,voltage:10});
 near(d.Cmicro,4*p.Cmicro,1e-12);
});
test('battery holds V constant; isolated holds Q constant',()=>{
 const a=M.battery({cap:4,voltage:12}),b=M.battery({cap:8,voltage:12});
 near(a.Qmicro,48);near(b.Qmicro,96);near(b.U_microJ,2*a.U_microJ);
 const c=M.isolated({cap:4,charge:40}),d=M.isolated({cap:8,charge:40});
 near(c.voltage,10);near(d.voltage,5);near(d.U_microJ,c.U_microJ/2);
});
test('series: same charge, voltages add, capacitance lower than either',()=>{
 const o=M.series({c1:3,c2:6,voltage:12});
 near(o.Cmicro,2);near(o.Qmicro,24);near(o.V1,8);near(o.V2,4);near(o.U_microJ,144);
 assert.ok(o.Cmicro<3&&o.Cmicro<6);
});
test('parallel: same voltage, charges add, capacitance increases',()=>{
 const o=M.parallel({c1:3,c2:6,voltage:12});
 near(o.Cmicro,9);near(o.Q1,36);near(o.Q2,72);near(o.Qmicro,108);near(o.U_microJ,648);
});
test('series vs parallel at fixed V and identical C values',()=>{
 const o=M.comparison({c1:4,c2:4,voltage:10});
 near(o.series.Cmicro,2);near(o.parallel.Cmicro,8);
 near(o.parallel.U_microJ/o.series.U_microJ,4);
});
test('physical validation rejects negative capacitance and zero separation',()=>{
 assert.throws(()=>M.battery({cap:0,voltage:10}));
 assert.throws(()=>M.plate({area:100,distance:0,voltage:10}));
 assert.throws(()=>M.series({c1:1,c2:-1,voltage:10}));
});
test('300 reproducible checks: charge and energy conservation',()=>{
 let seed=11;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<300;i++){
 const c1=1+rand()*12,c2=1+rand()*12,v=rand()*24;
 const s=M.series({c1,c2,voltage:v}),p=M.parallel({c1,c2,voltage:v});
 near(s.V1+s.V2,v,1e-7);near(p.Q1+p.Q2,p.Qmicro,1e-7);
 near(s.U_microJ,.5*s.Cmicro*v*v,1e-7);
 near(p.U_microJ,.5*p.Cmicro*v*v,1e-7);
 }
});
test('HTML includes modules and is staged on home page',()=>{
 const h=read('siga.html');for(const x of ['siga-math.js','siga-lab.js','mekanik-ui.js'])assert.ok(h.includes(x));
 assert.ok(read('../index.html').includes('labs/siga.html'));
});
test('six live DOM tabs render physical measurements without quiz',()=>{
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),events=new Map();
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,cb){events.set(id+':'+type,cb);}});
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id);},addEventListener(type,cb){events.set('doc:'+type,cb);}};
 const w={requestAnimationFrame(){throw Error('Unexpected animation loop');}};
 const ctx=vm.createContext({window:w,document:doc,console});
 for(const file of ['siga-math.js','mekanik-ui.js','siga-lab.js'])vm.runInContext(read(file),ctx,{filename:file});
 events.get('doc:DOMContentLoaded')();
 assert.equal(w.SigaLab.snapshot().questions,0);
 for(const id of ['plate','battery','isolated','series','parallel','compare']){
  events.get('tabs:click')({target:{closest(q){return q==='[data-tab]'?{dataset:{tab:id}}:null;}}});
  assert.equal(w.SigaLab.snapshot().state.tab,id);
  assert.match(nodes.get('scene').innerHTML,/<svg/);
  assert.ok(nodes.get('measurements').innerHTML.length>30,id);
  assert.ok(nodes.get('formula').textContent.length>10,id);
  assert.ok(nodes.get('interpret').textContent.length>20,id);
 }
});
