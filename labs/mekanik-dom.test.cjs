'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
function harness(type){
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),listeners=new Map(),frameQueue=[],docEvents=new Map();
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,fn){listeners.set(id+':'+type,fn);}});
 const d={readyState:'loading',hidden:false,getElementById(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(){}});return nodes.get(id);},addEventListener(type,fn){docEvents.set(type,fn);}};
 const w={requestAnimationFrame(fn){frameQueue.push(fn);}};
 const ctx=vm.createContext({window:w,document:d,console});
 for(const file of [type==='energy'?'fizik-enerji-math.js':'momentum-math.js','mekanik-ui.js',type==='energy'?'fizik-enerji-lab.js':'momentum-lab.js'])
 vm.runInContext(read(file),ctx,{filename:file,timeout:3000});
 assert.equal(typeof docEvents.get('DOMContentLoaded'),'function');docEvents.get('DOMContentLoaded')();
 function fire(id,event,selector,dataset,value){
  const fn=listeners.get(id+':'+event);assert.equal(typeof fn,'function',id+' '+event);
  const el={dataset,value,closest(q){return q===selector?this:null;}};
  fn({target:{closest(q){return q===selector?el:null;}}});
 }
 return {w,d,nodes,frameQueue,fire,docEvents,lab:w[type==='energy'?'FizikEnerjiLab':'MomentumLab']};
}
test('energy: seven experiments render SVG + simple explanations, 18 questions, no idle animation',()=>{
 const h=harness('energy'),labs=['work','power','spring','gravity','projectile','friction','exchange'];
 assert.equal(h.lab.snapshot().questions,18);assert.equal(h.frameQueue.length,0);
 for(const id of labs){
 h.fire('tabs','click','[data-tab]',{tab:id});
 assert.equal(h.lab.snapshot().state.tab,id);
 assert.match(h.nodes.get('scene').innerHTML,/<svg/);
 assert.ok(h.nodes.get('measurements').innerHTML.length>80,id);
 assert.ok(h.nodes.get('formula').textContent.length>10,id);
 assert.ok(h.nodes.get('interpret').textContent.length>20,id);
 }
});
test('momentum: six experiments render, questions count and no idle RAF',()=>{
 const h=harness('momentum'),labs=['momentum','impulse','collision1d','explosion1d','collision2d','explosion2d'];
 assert.equal(h.lab.snapshot().questions,20);assert.equal(h.frameQueue.length,0);
 for(const id of labs){
 h.fire('tabs','click','[data-tab]',{tab:id});
 assert.equal(h.lab.snapshot().state.tab,id);
 assert.match(h.nodes.get('scene').innerHTML,/<svg/);
 assert.ok(h.nodes.get('measurements').innerHTML.length>80,id);
 }
});
test('slider changes underlying model without destroying focused input DOM',()=>{
 for(const type of ['energy','momentum']){
 const h=harness(type),s=h.lab.snapshot(),id=s.state.tab,c=type==='energy'?'f0':'v';
 const before=h.nodes.get('controls').innerHTML;
 h.fire('controls','input','input[data-control]',{control:c},type==='energy'?'-12':'-8');
 assert.equal(h.nodes.get('controls').innerHTML,before);
 assert.equal(h.lab.snapshot().values[id][c],type==='energy'?-12:-8);
 assert.match(h.nodes.get('scene').innerHTML,/<svg/);
 assert.equal(h.frameQueue.length,0);
 }
});
test('quiz allows single answer grading and next question',()=>{
 for(const type of ['energy','momentum']){
 const h=harness(type);
 h.fire('tabs','click','[data-tab]',{tab:'quiz'});
 assert.match(h.nodes.get('quiz').innerHTML,/Soru 1/);
 h.fire('quiz','click','[data-choice]',{choice:'0'});
 h.fire('actions','click','[data-action]',{action:'check'});
 assert.match(h.nodes.get('quiz').innerHTML,/Doğru cevap|Doğru\./);
 const score=h.lab.snapshot().state.score;
 h.fire('actions','click','[data-action]',{action:'check'});
 assert.equal(h.lab.snapshot().state.score,score,'double check cannot score twice');
 h.fire('actions','click','[data-action]',{action:'next'});
 assert.equal(h.lab.snapshot().state.quizIndex,1);
 h.fire('actions','click','[data-action]',{action:'restart'});
 assert.equal(h.lab.snapshot().state.quizIndex,0);
 }
});
test('playback only starts on user action and stops at endpoint or when hidden',()=>{
 for(const type of ['energy','momentum']){
 const h=harness(type),tab=type==='energy'?'projectile':'impulse';
 h.fire('tabs','click','[data-tab]',{tab});assert.equal(h.frameQueue.length,0);
 h.fire('actions','click','[data-action]',{action:'step'});
 assert.ok(h.lab.snapshot().values[tab].t>0);
 h.fire('actions','click','[data-action]',{action:'play'});
 assert.equal(h.frameQueue.length,1);
 h.d.hidden=true;h.docEvents.get('visibilitychange')();
 assert.equal(h.lab.snapshot().state.playing,false);
 h.frameQueue.shift()(123456);assert.equal(h.frameQueue.length,0,'stopped frame must not reschedule');
 }
});
test('physics pages carry old-program units and include local assets',()=>{
 for(const [f,label]of [['is-guc-enerji.html','11.1.6.1–11.1.6.3'],['itme-cizgisel-momentum.html','11.1.7.1–11.1.7.4']]){
 const s=read(f);assert.ok(s.includes(label));assert.ok(s.includes('mekanik-ui.js'));assert.ok(s.includes('mekanik-lab.css'));
 }
});
