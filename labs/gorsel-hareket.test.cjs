'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
function mount(type){
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'],nodes=new Map(),events=new Map(),frames=[];
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,cb){events.set(id+':'+type,cb);}});
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id);},addEventListener(type,cb){events.set('doc:'+type,cb);}};
 const win={requestAnimationFrame(cb){frames.push(cb);}};
 const ctx=vm.createContext({window:win,document:doc,console});
 const sets={
  siga:['siga-math.js','mekanik-ui.js','kavramsal-hareket.js','siga-lab.js','SigaLab'],
  magnetic:['manyetizma-math.js','mekanik-ui.js','kavramsal-hareket.js','manyetizma-lab.js','ManyetizmaLab'],
  ac:['mekanik-ui.js','kavramsal-hareket.js','alternatif-akim-lab.js','AlternatifAkimLab']
 };
 const args=sets[type];for(const f of args.slice(0,-1))vm.runInContext(read(f),ctx,{filename:f});
 events.get('doc:DOMContentLoaded')();const api=win[args.at(-1)];
 const tab=id=>events.get('tabs:click')({target:{closest:()=>({dataset:{tab:id}})}});
 const input=(key,value)=>events.get('controls:input')({target:{closest:()=>({dataset:{control:key},value:String(value)})}});
 const action=id=>events.get('actions:click')({target:{closest:()=>({dataset:{action:id}})}});
 return {nodes,events,frames,api,tab,input,action};
}
test('all 6 capacitance tabs render physical plates, connections or storage instead of static text',()=>{
 const t=mount('siga');for(const id of ['plate','battery','isolated','series','parallel','compare']){
 t.tab(id);const svg=t.nodes.get('scene').innerHTML;assert.match(svg,/<svg/);assert.match(svg,/<(rect|circle|path)/,id);assert.equal(t.api.snapshot().questions,0);
 }
 t.tab('plate');const a=t.nodes.get('scene').innerHTML;t.input('distance',5);const b=t.nodes.get('scene').innerHTML;assert.notEqual(a,b);
});
test('all 11 magnetism tabs show real geometry, and field reverses when current changes sign',()=>{
 const t=mount('magnetic');for(const id of ['wire','coil','wire-force','particle','flux','faraday','rod','transformer','frame','self','motor']){t.tab(id);const svg=t.nodes.get('scene').innerHTML;assert.match(svg,/<svg/);assert.match(svg,/<(circle|rect|ellipse|path)/,id);}
 t.tab('wire');const a=t.nodes.get('scene').innerHTML;t.input('current',-5);assert.notEqual(a,t.nodes.get('scene').innerHTML);
});
test('all 5 AC tabs visualize circuits and no numerical AC time plots',()=>{
 const t=mount('ac');for(const id of ['acdc','resistor','inductor','capacitor','resonance']){t.tab(id);assert.match(t.nodes.get('scene').innerHTML,/<(circle|rect|path)/);assert.doesNotMatch(t.nodes.get('formula').textContent,/=[ \t]*\d+[,.]\d+/);}
 t.tab('acdc');const a=t.nodes.get('scene').innerHTML;t.input('type',1);assert.notEqual(a,t.nodes.get('scene').innerHTML);
});
test('opt-in magnetism motion progresses and stops after tab change',()=>{
 const t=mount('magnetic');t.tab('particle');assert.equal(t.frames.length,0);
 t.action('motion-play');assert.equal(t.frames.length,1);t.frames.shift()(1000);t.frames.shift()(1100);
 const a=t.api.snapshot();assert.ok(a.values.particle.phase>0);
 t.tab('wire');assert.equal(t.api.snapshot().state.playing,false);
});
test('visual scripts load in three HTML entrypoints',()=>{
 for(const h of ['siga.html','alternatif-akim.html','manyetizma.html'])assert.ok(read(h).includes('kavramsal-hareket.js'));
});

test('direct touch targets are present on capacitor plate, charged particle, rod and AC carrier',()=>{
 const cap=mount('siga');cap.tab('plate');assert.match(cap.nodes.get('scene').innerHTML,/data-drag="distance"/);
 const mag=mount('magnetic');for(const [tab,drag] of [['particle','phase'],['rod','phase'],['flux','angle']]){mag.tab(tab);assert.ok(mag.nodes.get('scene').innerHTML.includes('data-drag="'+drag+'"'));}
 const ac=mount('ac');ac.tab('resistor');assert.match(ac.nodes.get('scene').innerHTML,/data-drag="phase"/);
 for(const html of ['siga.html','manyetizma.html','alternatif-akim.html'])assert.ok(read(html).includes('kavramsal-pointer.js'));
 new vm.Script(read('kavramsal-pointer.js'));
});
test('magnetic diagrams visibly respond to current magnitude, flux area and magnetic field zero',()=>{
 const m=mount('magnetic');m.tab('wire');const initial=m.nodes.get('scene').innerHTML;m.input('current',9);assert.notEqual(initial,m.nodes.get('scene').innerHTML);
 m.input('current',0);assert.doesNotMatch(m.nodes.get('scene').innerHTML,/>B<\/text>/);
 m.tab('flux');const f=m.nodes.get('scene').innerHTML;m.input('area',300);assert.notEqual(f,m.nodes.get('scene').innerHTML);
 m.tab('particle');m.input('B',0);assert.doesNotMatch(m.nodes.get('scene').innerHTML,/>×<\/text>/);
});
