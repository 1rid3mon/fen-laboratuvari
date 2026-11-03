'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');const w={};vm.runInNewContext(read('manyetizma-math.js'),{window:w,Math,Number,Object});const M=w.ManyetizmaMath,near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,String(a)+' != '+String(b));
test('straight wire inverse radius, current reversal',()=>{const a=M.wire({current:5,distance:.1});near(a.B,1e-5);near(M.wire({current:5,distance:.2}).B,a.B/2);near(M.wire({current:-5,distance:.1}).B,-a.B);});
test('loop and long solenoid SI field',()=>{near(M.loop({current:2,radius:.1,turns:10}).B,4*Math.PI*1e-7*100);near(M.solenoid({current:2,turns:100,length:.5}).B,4*Math.PI*1e-7*400);});
test('force on wire zero when parallel, maximum when perpendicular',()=>{near(M.wireForce({B:.4,current:3,length:.5,angle:0}).F,0);near(M.wireForce({B:.4,current:3,length:.5,angle:90}).F,.6);});
test('charged particle magnetic force does no work and helical radius uses v perpendicular',()=>{const p=M.particle({q:2e-6,v:4000,B:.5,angle:90,mass:2e-6});near(p.F,.004);near(p.radius,8);const h=M.particle({q:2e-6,v:4000,B:.5,angle:30,mass:2e-6});near(h.radius,4);assert.equal(M.particle({q:2e-6,v:4000,B:0,angle:90,mass:2e-6}).radius,null);});
test('flux uses surface normal angle',()=>{near(M.flux({B:.5,area:.02,angle:0}).phi,.01);near(M.flux({B:.5,area:.02,angle:90}).phi,0);near(M.flux({B:.5,area:.02,angle:180}).phi,-.01);});
test('Faraday-Lenz sign and zero flux change',()=>{const a=M.induction({turns:100,B1:.1,B2:.5,area:.02,angle:0,dt:2});near(a.emf,-.4);const b=M.induction({turns:100,B1:.5,B2:.1,area:.02,angle:0,dt:2});near(b.emf,.4);near(M.induction({turns:100,B1:.5,B2:.5,area:.02,angle:0,dt:2}).emf,0);});
test('moving conductor converts mechanical power into electric',()=>{const r=M.movingRod({B:.5,length:.4,speed:3,resistance:5});near(r.emf,.6);near(r.current,.12);near(r.power,.072);near(r.forceMagnitude,.024);near(r.forceMagnitude*3,r.power);});
test('ideal transformer only AC voltage ratio',()=>{const r=M.transformer({primaryTurns:100,secondaryTurns:200,primaryVoltage:12});near(r.secondaryVoltage,24);near(r.ratio,2);});
test('reject nonphysical geometry',()=>{assert.throws(()=>M.wire({current:1,distance:0}));assert.throws(()=>M.induction({turns:3,B1:0,B2:1,area:.1,angle:0,dt:0}));assert.throws(()=>M.transformer({primaryTurns:0,secondaryTurns:100,primaryVoltage:12}));});
test('HTML staged with correct scripts',()=>{const h=read('manyetizma.html');for(const x of ['manyetizma-math.js','manyetizma-lab.js','mekanik-ui.js'])assert.ok(h.includes(x));assert.ok(read('../index.html').includes('labs/manyetizma.html'));});
test('eight tabs render without mandatory quiz',()=>{
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];const nodes=new Map(),events=new Map();
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,cb){events.set(id+':'+type,cb);}});
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id);},addEventListener(type,cb){events.set('doc:'+type,cb);}};
 const win={requestAnimationFrame(){throw Error('Unexpected animation loop');}},ctx=vm.createContext({window:win,document:doc,console});
 for(const file of ['manyetizma-math.js','mekanik-ui.js','manyetizma-lab.js'])vm.runInContext(read(file),ctx,{filename:file});
 events.get('doc:DOMContentLoaded')();assert.equal(win.ManyetizmaLab.snapshot().questions,0);
 for(const id of ['wire','coil','wire-force','particle','flux','faraday','rod','transformer']){
 events.get('tabs:click')({target:{closest(q){return q==='[data-tab]'?{dataset:{tab:id}}:null;}}});
 assert.equal(win.ManyetizmaLab.snapshot().state.tab,id);
 assert.match(nodes.get('scene').innerHTML,/<svg/);assert.ok(nodes.get('measurements').innerHTML.length>20,id);assert.ok(nodes.get('interpret').textContent.length>20,id);
 }
});
