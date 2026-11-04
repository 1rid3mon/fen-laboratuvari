'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const math=()=>{const win={};vm.runInNewContext(read('tyt-elektro-math.js'),{window:win,Math,Number,RangeError,Object});return win.TytElektroMath;};
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,String(a)+' differs from '+String(b));
test('electron exchange conserves net charge with sign reversal',()=>{
 const M=math();for(const n of [-8,-5,0,2,8]){const x=M.friction({electrons:n});assert.equal(x.rod,-n);assert.equal(x.cloth,n);assert.equal(x.total,0);assert.equal(x.rod+x.cloth,0);}
 assert.throws(()=>M.friction({electrons:1.2}));
});
test('identical isolated metal spheres share total charge only on physical contact',()=>{
 const M=math();for(const p of [{first:8,second:0},{first:8,second:-4},{first:-4,second:-8}]){
 const before=M.contact({...p,progress:.99}),after=M.contact({...p,progress:1});
 assert.equal(before.first,p.first);assert.equal(before.second,p.second);assert.equal(after.first,(p.first+p.second)/2);assert.equal(after.second,after.first);assert.equal(after.total,p.first+p.second);}
});
test('charging by induction depends on grounding sequence and rod polarity',()=>{
 const M=math();
 for(const sign of [-1,1]){
  const neutral=M.induction({rodSign:sign,stage:1});
  assert.equal(neutral.netSign,0);assert.equal(neutral.nearSign,-sign);assert.equal(neutral.farSign,sign);
  const grounded=M.induction({rodSign:sign,stage:2});
  assert.equal(grounded.groundConnected,true);assert.equal(grounded.netSign,-sign);
  const removed=M.induction({rodSign:sign,stage:4});
  assert.equal(removed.rodPresent,false);assert.equal(removed.netSign,-sign);
 }
});
test('charged electroscope leaves open for like charge and close for unlike charge',()=>{
 const M=math(),like=M.electroscope({known:-1,rod:-1,approach:1}),unlike=M.electroscope({known:-1,rod:1,approach:1}),neutral=M.electroscope({known:0,rod:1,approach:1});
 assert.ok(like.opening>unlike.opening);assert.ok(neutral.opening>0);assert.equal(neutral.trend,'induction');
});
test('conductor spreads surface charge and insulating charge remains localized',()=>{
 const M=math();const a=M.distribution({material:'conductor',charge:-6,grounded:true}),b=M.distribution({material:'insulator',charge:-6,grounded:true});
 assert.equal(a.net,0);assert.equal(b.net,-6);assert.equal(a.surface,true);assert.equal(b.localized,true);
});
test('grounding neutralizes either polarity and cage ideal static shielding',()=>{
 const M=math();assert.equal(M.grounding({initial:-8,stage:0}).charge,-8);assert.equal(M.grounding({initial:-8,stage:2}).charge,0);assert.equal(M.grounding({initial:8,stage:2}).transfer,-8);
 assert.equal(M.cage({closed:true}).shielded,true);assert.equal(M.cage({closed:false}).shielded,false);
});
test('quantitative 1D Coulomb correctly uses microcoulombs, inverse square and Newton third law',()=>{
 const M=math(),r=M.coulomb({q1:3,q2:-2,distance:1});
 near(r.magnitude,.054);near(r.forceOn1,.054);near(r.forceOn2,-.054);
 const twice=M.coulomb({q1:3,q2:-2,distance:2});near(twice.magnitude,.0135);
 const repulse=M.coulomb({q1:3,q2:2,distance:1});near(repulse.magnitude,.054);assert.equal(repulse.repel,true);assert.ok(repulse.forceOn1<0);assert.ok(repulse.forceOn2>0);
});
test('neutral charge gives no force, distance zero is rejected',()=>{const M=math();assert.equal(M.coulomb({q1:0,q2:5,distance:1}).magnitude,0);assert.throws(()=>M.coulomb({q1:2,q2:3,distance:0}));});
test('electric field is only qualitative, source sign controls E and test sign controls F',()=>{
 const M=math(),a=M.field({source:1,test:-1}),b=M.field({source:-1,test:1});
 assert.equal(a.fieldDirection,1);assert.equal(a.forceDirection,-1);assert.equal(b.fieldDirection,-1);assert.equal(b.forceDirection,-1);
 assert.equal('value' in a,false);assert.equal(a.quantitative,false);
});
test('neutral polarized paper stays net neutral and is attracted to either charge sign',()=>{
 const M=math();for(const sign of [-1,1]){const a=M.polarize({rod:sign,near:1});assert.equal(a.net,0);assert.equal(a.nearSign,-sign);assert.equal(a.attracted,true);}
});
function mount(){
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),events=new Map(),frames=[],inputs=new Map();
 for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(type,fn){events.set(id+':'+type,fn);}});
 const scene=nodes.get('scene'),controls=nodes.get('controls');
 scene.querySelector=q=>q==='svg'?{getBoundingClientRect(){return {left:0,top:0,width:800,height:360};}}:null;
 scene.setPointerCapture=id=>{scene.capture=id;};scene.hasPointerCapture=id=>scene.capture===id;scene.releasePointerCapture=()=>{scene.capture=null;};
 controls.querySelector=q=>{const match=q.match(/data-control="([^"]+)"/);return match?inputs.get(match[1]):null;};
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id);},addEventListener(type,fn){events.set('doc:'+type,fn);}};
 const win={requestAnimationFrame(fn){frames.push(fn);},Event:class{constructor(type,o){this.type=type;this.bubbles=!!o?.bubbles;}}};
 const ctx=vm.createContext({window:win,document:doc,console});
 for(const file of ['tyt-elektro-math.js','mekanik-ui.js','tyt-elektro-lab.js','tyt-elektro-pointer.js'])vm.runInContext(read(file),ctx,{filename:file});
 events.get('doc:DOMContentLoaded')();
 const tab=id=>events.get('tabs:click')({target:{closest:()=>({dataset:{tab:id}})}});
 const input=(key,value)=>events.get('controls:input')({target:{closest:()=>({dataset:{control:key},value:String(value)})}});
 const control=(key,value,min,max,step)=>{const i={dataset:{control:key},value:String(value),min:String(min),max:String(max),step:String(step),dispatchEvent(){events.get('controls:input')({target:{closest:()=>i}})}};inputs.set(key,i);return i;};
 const action=id=>events.get('actions:click')({target:{closest:()=>({dataset:{action:id}})}});
 const point=(x,y,key,extra={})=>({clientX:x,clientY:y,pointerId:77,preventDefault(){},target:{closest:()=>({dataset:{drag:key,...extra}})}});
 return {win,nodes,events,frames,scene,tab,input,control,action,point};
}
test('all 10 scenes draw physical geometry and offer live observations; no forced quizzes',()=>{
 const t=mount();assert.equal(t.win.TytElektroLab.snapshot().questions,0);
 for(const id of ['friction','contact','induction','scope','distribution','ground','cage','coulomb','field','polar']){
 t.tab(id);assert.match(t.nodes.get('scene').innerHTML,/<svg/);
 assert.match(t.nodes.get('scene').innerHTML,/<(circle|rect|path)/);
 assert.ok(t.nodes.get('interpret').textContent.length>25,id);
 assert.ok(t.nodes.get('measurements').innerHTML.length>15,id);
 }
});
test('charge sharing appears visually only when the two spheres touch',()=>{
 const t=mount();t.tab('contact');t.input('progress',.8);
 const a=t.nodes.get('scene').innerHTML;
 assert.match(t.nodes.get('interpret').textContent,/henüz temas etmedi/);
 t.input('progress',1);assert.match(t.nodes.get('interpret').textContent,/eşit paylaşır/);assert.notEqual(a,t.nodes.get('scene').innerHTML);
});
test('Coulomb dragging changes 1/r² force and updates SVG vectors',()=>{
 const t=mount();t.tab('coulomb');t.control('distance',1.5,.5,3.5,.1);
 const a=t.nodes.get('measurements').innerHTML,b=t.nodes.get('scene').innerHTML;
 t.events.get('scene:pointerdown')(t.point(391,175,'distance'));
 assert.equal(t.scene.capture,77);
 t.events.get('scene:pointermove')(t.point(537,175,'distance'));
 assert.ok(t.win.TytElektroLab.snapshot().values.coulomb.distance>1.5);
 assert.notEqual(t.nodes.get('measurements').innerHTML,a);assert.notEqual(t.nodes.get('scene').innerHTML,b);
 t.events.get('scene:pointerup')(t.point(537,175,'distance'));assert.equal(t.scene.capture,null);
});
test('finger drag transfers electrons and preserves charge total',()=>{
 const t=mount();t.tab('friction');t.control('rub',0,0,1,.01);
 t.events.get('scene:pointerdown')(t.point(163,175,'rub'));
 t.events.get('scene:pointermove')(t.point(470,175,'rub'));
 const o=t.win.TytElektroLab.snapshot().values.friction;assert.ok(o.rub>.9);
 const M=math(),r=M.friction({electrons:Math.round(o.electrons*o.rub)});
 assert.equal(r.rod+r.cloth,0);
});
test('electroscope dragging changes leaf spread and induction click advances its stage',()=>{
 const t=mount();t.tab('scope');t.control('approach',0,0,1,.01);const a=t.nodes.get('scene').innerHTML;
 t.events.get('scene:pointerdown')(t.point(635,133,'approach'));
 t.events.get('scene:pointermove')(t.point(445,133,'approach'));
 assert.notEqual(a,t.nodes.get('scene').innerHTML);
 t.tab('induction');t.control('stage',0,0,4,1);
 const click={pointerId:99,preventDefault(){},target:{closest:()=>({dataset:{step:'stage'}})}};
 t.events.get('scene:pointerdown')(click);assert.equal(t.win.TytElektroLab.snapshot().values.induction.stage,1);
});
test('Faraday cage tap changes shield state',()=>{
 const t=mount();t.tab('cage');t.control('closed',1,0,1,1);
 t.events.get('scene:pointerdown')({pointerId:1,preventDefault(){},target:{closest:()=>({dataset:{toggle:'closed'}})}});
 assert.equal(t.win.TytElektroLab.snapshot().values.cage.closed,0);
 assert.match(t.nodes.get('interpret').textContent,/koruma garantisi yok/);
});
test('animated charge movement only runs when explicitly started, stops on tab change',()=>{
 const t=mount();t.tab('friction');assert.equal(t.frames.length,0);
 t.action('motion-play');assert.equal(t.frames.length,1);
 t.frames.shift()(1000);const next=t.frames.shift();assert.equal(typeof next,'function');next(1100);
 assert.ok(t.win.TytElektroLab.snapshot().values.friction.rub>0);
 t.tab('coulomb');assert.equal(t.win.TytElektroLab.snapshot().state.playing,false);
});
test('TYT entrypoint, homepage and official scope present, AYT lab remains independent',()=>{
 const html=read('tyt-elektrostatik.html');for(const src of ['tyt-elektro-math.js','tyt-elektro-lab.js','tyt-elektro-pointer.js'])assert.ok(html.includes(src));
 assert.match(html,/TYT FİZİK/);assert.match(html,/9\.6/);
 const index=read('../index.html');assert.ok(index.includes('labs/tyt-elektrostatik.html'));assert.ok(index.includes('data-level="ayt"'));
 assert.doesNotMatch(html,/Maarif Modeli/);
});
test('2018 MEB 9.6.1.4 forbids electric-field numerical calculation in the UI',()=>{
 const t=mount();t.tab('field');
 assert.doesNotMatch(t.nodes.get('measurements').innerHTML,/N\/C|V\/m|kV\/m/);
 assert.doesNotMatch(t.nodes.get('formula').textContent,/9 × 10⁹/);
 t.tab('coulomb');assert.match(t.nodes.get('measurements').innerHTML,/ N/);
});
