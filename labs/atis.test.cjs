'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname,read=f=>fs.readFileSync(path.join(root,f),'utf8');
const w={};vm.runInNewContext(read('atis-math.js'),{window:w,Math,Number,Object,Array},{filename:'atis-math.js'});
const M=w.AtisMath,near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,a+' != '+b);
test('horizontal launch: 45m 20m/s has 3s flight, 60m range and impact',()=>{const r=M.solve({speed:20,angle:0,height:45,g:10,t:3});near(r.flight,3);near(r.range,60);near(r.x,60);near(r.y,0);near(r.vx,20);near(r.impactVy,-30);assert.equal(r.impacted,true);});
test('45-degree launch from ground: range 40m for speed 20 g10',()=>{const r=M.solve({speed:20,angle:45,height:0,g:10,t:0});near(r.range,40);near(r.peakY,10);near(r.peakT,Math.SQRT2);near(r.flight,2*Math.SQRT2);});
test('complementary angles equal range only at equal launch/impact heights',()=>{const a=M.solve({speed:20,angle:30,height:0,g:10,t:0}),b=M.solve({speed:20,angle:60,height:0,g:10,t:0});near(a.range,b.range);near(a.range,M.equalHeightRange(20,30,10));const c=M.solve({speed:20,angle:30,height:20,g:10,t:0}),d=M.solve({speed:20,angle:60,height:20,g:10,t:0});assert.ok(Math.abs(c.range-d.range)>1);});
test('apex vy zero but gravity remains, vx unchanged',()=>{const r=M.solve({speed:20,angle:60,height:5,g:10,t:Math.sqrt(3)});near(r.vy,0);near(r.ay,-10);near(r.ax,0);near(r.vx,10);});
test('after impact position remains at ground and impact speed retained',()=>{const r=M.solve({speed:15,angle:0,height:20,g:10,t:20});near(r.y,0);near(r.x,r.range);near(r.at,r.flight);assert.equal(r.impacted,true);near(r.impactSpeed,25);});
test('sample includes exact endpoint and no below-ground points',()=>{const p=M.sample({speed:30,angle:35,height:15,g:10},90);assert.equal(p.length,91);near(p.at(-1).y,0);assert.ok(p.every(r=>r.y>=0));});
test('invalid parameters rejected',()=>{for(const p of [{speed:-1},{g:0},{height:-1},{t:-1},{angle:Infinity}])assert.throws(()=>M.solve(p));});
test('2018 MEB link and source files available',()=>{const html=read('iki-boyutta-hareket.html');assert.match(html,/11\.1\.5\.1–11\.1\.5\.2/);assert.match(html,/atis-math\.js/);assert.match(html,/atis-lab\.js/);assert.match(read('../index.html'),/href="labs\/iki-boyutta-hareket\.html"/);});
function harness(){
 const nodes=new Map(),handlers=new Map(),win={AtisMath:M,requestAnimationFrame(fn){this.frames.push(fn);},frames:[]};
 for(const id of ['tabs','controls','buttons','quiz','scene','results','graphs','lesson','hint','heading','intro','tagline'])nodes.set(id,{id,innerHTML:'',textContent:'',value:'',max:'',addEventListener(type,cb){handlers.set(id+':'+type,cb);}});
 const d={readyState:'loading',hidden:false,getElementById(id){if(!nodes.has(id))nodes.set(id,{id,innerHTML:'',textContent:'',value:'',max:''});return nodes.get(id);},addEventListener(type,cb){handlers.set('doc:'+type,cb);}};
 vm.runInNewContext(read('atis-lab.js'),{window:win,document:d,Math,Number,JSON,String,Array},{filename:'atis-lab.js'});
 handlers.get('doc:DOMContentLoaded')();
 function fire(id,type,selector,dataset,value){const fn=handlers.get(id+':'+type);assert.ok(fn,id+':'+type);const item={dataset,value,closest(q){return q===selector?this:null;}};fn({target:{closest(q){return q===selector?item:null;}}});}
 return {nodes,win,fire,snapshot:()=>win.AtisLabDebug.snapshot()};
}
test('DOM: six simulations and quiz, 4 graphs, vectors and idle no frames',()=>{
 const h=harness();assert.equal(h.win.frames.length,0);assert.equal(h.win.AtisLabDebug.questions,20);
 for(const tab of ['horizontal','angled','components','comparison','target','graphs']){
 h.fire('tabs','click','[data-tab]',{tab});
 assert.equal(h.snapshot().tab,tab);assert.match(h.nodes.get('scene').innerHTML,/<svg/);
 assert.equal((h.nodes.get('graphs').innerHTML.match(/viewBox="0 0 350 185"/g)||[]).length,4);
 }
 h.fire('tabs','click','[data-tab]',{tab:'quiz'});assert.match(h.nodes.get('quiz').innerHTML,/Soru 1/);
});
test('DOM: live slider does not destroy focused controls; playback and reset',()=>{
 const h=harness(),before=h.nodes.get('controls').innerHTML;
 h.fire('controls','input','[data-range]',{range:'speed'},'30');
 near(h.snapshot().horizontal.speed,30);assert.equal(h.nodes.get('controls').innerHTML,before);
 h.fire('buttons','click','[data-action]',{action:'vectors'});assert.equal(h.snapshot().showVectors,false);
 h.fire('buttons','click','[data-action]',{action:'play'});assert.equal(h.win.frames.length,1);
 h.fire('buttons','click','[data-action]',{action:'reset'});near(h.snapshot().horizontal.speed,16);
});
test('DOM: target controls, quiz answer and scoring',()=>{
 const h=harness();h.fire('tabs','click','[data-tab]',{tab:'target'});
 h.fire('controls','input','[data-range]',{range:'targetX'},'50');near(h.snapshot().targetX,50);
 h.fire('tabs','click','[data-tab]',{tab:'quiz'});
 h.fire('quiz','click','[data-answer]',{answer:'1'});
 h.fire('buttons','click','[data-action]',{action:'check'});
 assert.equal(h.snapshot().score,1);assert.match(h.nodes.get('quiz').innerHTML,/Doğru/);
 h.fire('buttons','click','[data-action]',{action:'next'});assert.equal(h.snapshot().quizIndex,1);
});
