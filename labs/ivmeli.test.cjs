'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
function loadCore(){
 const window={};
 vm.runInNewContext(read('hareket-math.js'),{window,Intl,Number,Math,Object,JSON},{filename:'hareket-math.js'});
 vm.runInNewContext(read('ivmeli-math.js'),{window,Intl,Number,Math,Object,JSON},{filename:'ivmeli-math.js'});
 return window;
}
const {IvmeliMath:M,HareketMath:P}=loadCore();
const near=(x,y,tol=1e-8)=>assert.ok(Number.isFinite(x)&&Math.abs(x-y)<=tol,'Expected '+x+' ≈ '+y);

test('signed 1D constant acceleration: equations, turning point and path length',()=>{
 const r=M.motion({x0:2,v0:4,a:2,t:3});
 near(r.x,23);near(r.displacement,21);near(r.v,10);near(r.distance,21);
 const reversing=M.motion({x0:0,v0:10,a:-5,t:4});
 near(reversing.x,0);near(reversing.v,-10);
 near(reversing.turnTime,2);near(reversing.turnPosition,10);
 near(reversing.displacement,0);near(reversing.distance,20);
 const uniform=M.motion({x0:-5,v0:-3,a:0,t:4});
 near(uniform.x,-17);near(uniform.distance,12);near(uniform.displacement,-12);
 assert.equal(uniform.turnTime,null);
});
test('graph derivative and signed area, not absolute traveled path',()=>{
 const pts=[{t:0,y:3},{t:1,y:5},{t:2,y:7}];
 near(M.slope(pts,0,2),2);
 near(M.trapezoidArea(pts),10);
 const mixed=[{t:0,y:10},{t:2,y:0},{t:4,y:-10}];
 near(M.trapezoidArea(mixed),0);
 near(M.slope(mixed,0,2),-5);
});
test('braking stops and does not mathematically drive backwards',()=>{
 const b=M.braking({speed:20,brakingAcceleration:5});
 near(b.time,4);near(b.distance,40);
 near(M.motion({v0:20,a:-5,t:4}).x,40);
 assert.throws(()=>M.braking({speed:10,brakingAcceleration:0}));
});
test('free fall: mass-independent, impact at ground, separate impact speed',()=>{
 const r=M.freeFall({height:80,g:10,t:3});
 near(r.fallen,45);near(r.height,35);near(r.v,30);near(r.acceleration,10);
 near(r.impactTime,4);
 const landed=M.freeFall({height:80,g:10,t:9});
 near(landed.height,0);near(landed.fallen,80);
 near(landed.v,0);near(landed.acceleration,0);
 near(landed.impactSpeed,40);assert.equal(landed.impacted,true);
});
test('vertical upwards and downwards throwing: peak v=0, acceleration stays down',()=>{
 const up=M.verticalThrow({height:0,v0:20,g:10,t:2});
 near(up.y,20);near(up.v,0);near(up.acceleration,-10);near(up.peakTime,2);near(up.peakHeight,20);
 const end=M.verticalThrow({height:0,v0:20,g:10,t:6});
 near(end.impactTime,4);near(end.y,0);near(end.v,0);near(end.impactVelocity,-20);
 const down=M.verticalThrow({height:45,v0:-5,g:10,t:1});
 near(down.y,35);near(down.v,-15);
 const downImpact=M.verticalThrow({height:45,v0:-5,g:10,t:20});
 near(downImpact.y,0);assert.ok(downImpact.impactTime>0);
});
test('quadratic drag: vacuum exact, terminal speed asymptote, impact resets displayed v',()=>{
 const vac=M.resistance({mass:1,k:0,g:10,height:500,t:5});
 near(vac.v,50);near(vac.fallen,125);assert.equal(vac.terminalSpeed,null);
 const slow=M.resistance({mass:1,k:.1,g:10,height:1000,t:10});
 near(slow.terminalSpeed,10);near(slow.v/slow.terminalSpeed,Math.tanh(10),1e-8);
 near(slow.acceleration,10-slow.drag,1e-7);
 assert.ok(slow.fallen<500);
 const heavy=M.resistance({mass:4,k:.1,g:10,height:1000,t:10});
 assert.ok(heavy.terminalSpeed>slow.terminalSpeed);
 assert.ok(heavy.v>slow.v);
 const finished=M.resistance({mass:1,k:.1,g:10,height:100,t:40});
 near(finished.height,0);near(finished.v,0);
 assert.ok(finished.impactSpeed>0);assert.equal(finished.impacted,true);
 assert.throws(()=>M.resistance({mass:0,k:.1,g:10,height:100,t:1}));
});
test('connected two bodies, tension and Atwood direction, acceleration',()=>{
 const c=M.connected({mA:2,mB:3,force:20});
 near(c.acceleration,4);near(c.tension,8);
 near(c.acceleration*(2+3),20);
 const a=M.atwood({mA:2,mB:3,g:10});
 near(a.acceleration,2);near(a.tension,24);
 near(a.weightB-a.tension,3*a.acceleration);
 near(a.tension-a.weightA,2*a.acceleration);
 const equal=M.atwood({mA:4,mB:4,g:10});
 near(equal.acceleration,0);near(equal.tension,40);
 const reverse=M.atwood({mA:3,mB:2,g:10});
 near(reverse.acceleration,-2);
});
test('angled pulling: normal reaction falls, contact loss is detected',()=>{
 const r=M.angledPull({mass:5,force:40,angleDeg:30,muStatic:.4,muKinetic:.2,g:10});
 near(r.normal,30);near(r.fx,20*Math.sqrt(3));near(r.fy,20);
 assert.equal(r.state,'sliding');near(r.friction,-6);
 const pushing=M.angledPull({mass:5,force:40,angleDeg:-30,muStatic:.4,muKinetic:.2,g:10});
 near(pushing.normal,70);assert.ok(pushing.normal>r.normal);
 const lifted=M.angledPull({mass:2,force:100,angleDeg:60,muStatic:.4,muKinetic:.2,g:10});
 assert.equal(lifted.state,'airborne');near(lifted.normal,0);near(lifted.friction,0);
 assert.ok(lifted.ay>0);
});
test('both new labs link, declare old curriculum and route to next topic',()=>{
 const k=read('bir-boyutta-sabit-ivmeli-hareket.html'),n=read('newton-hareket-yasalari.html'),home=read('../index.html');
 assert.match(k,/2018 MEB/);assert.match(k,/11\.1\.4\.1–11\.1\.4\.6/);
 assert.match(k,/ivmeli-math\.js/);assert.match(k,/ivmeli-lab\.js/);
 assert.match(n,/newton-lab\.js/);assert.match(n,/ivmeli-math\.js/);
 assert.match(n,/bir-boyutta-sabit-ivmeli-hareket\.html/);
 assert.match(home,/bir-boyutta-sabit-ivmeli-hareket\.html/);
 assert.doesNotMatch(k,/11\.1\.5\.1 ·/);
});
function harness(){
 const listeners=new Map(),nodes=new Map(),windows=loadCore();
 windows.frames=[];
 windows.requestAnimationFrame=fn=>{windows.frames.push(fn);return windows.frames.length;};
 const keys=['scene','tabs','tagline','heading','intro','controls','buttons','hint','graphs','graphs-section','graph-summary','results','lesson','quiz'];
 function makeNode(id){
  return {id,innerHTML:'',textContent:'',dataset:{},value:'',disabled:false,attributes:{},children:[],
   classList:{toggle(){},add(){},remove(){}},
   addEventListener(type,fn){listeners.set(id+':'+type,fn);},
   setAttribute(k,v){this.attributes[k]=v;}
  };
 }
 for(const id of keys)nodes.set(id,makeNode(id));
 const doc={
  readyState:'loading',hidden:false,
  getElementById(id){if(!nodes.has(id))nodes.set(id,makeNode(id));return nodes.get(id);},
  querySelectorAll(sel){if(sel!=='[data-tab]')return [];
   return [...nodes.get('tabs').innerHTML.matchAll(/data-tab="([^"]+)"/g)].map(m=>({
    dataset:{tab:m[1]},classList:{toggle(){}},setAttribute(){}
   }));},
  addEventListener(k,cb){listeners.set('doc:'+k,cb);}
 };
 const ctx=vm.createContext({window:windows,document:doc,console,Intl,Math,Date,Number});
 vm.runInContext(read('ivmeli-lab.js'),ctx,{filename:'ivmeli-lab.js',timeout:7000});
 const init=listeners.get('doc:DOMContentLoaded');assert.equal(typeof init,'function');init();
 const fire=(id,type,selector,data={})=>{
  const fn=listeners.get(id+':'+type);assert.equal(typeof fn,'function',id+':'+type);
  const node={dataset:data.dataset||{},value:data.value,disabled:!!data.disabled,
   closest(q){return q===selector?this:null;}};
  fn({target:{closest(q){return q===selector?node:null;}}});
 };
 return {nodes,windows,fire,snapshot:()=>windows.IvmeliLabDebug.snapshot()};
}
test('DOM: seven tabs render track, 3 real charts and one quiz without throwing',()=>{
 const h=harness();
 assert.equal(h.windows.frames.length,0,'no idle animation');
 assert.equal(h.nodes.get('graphs').innerHTML.match(/class="plot"/g).length,3);
 for(const tab of ['motion','graphs','brake','fall','throw','drag','quiz']){
  h.fire('tabs','click','[data-tab]',{dataset:{tab}});
  assert.equal(h.snapshot().tab,tab);
  assert.match(h.nodes.get('scene').innerHTML,/<svg/);
  assert.ok(h.nodes.get('results').innerHTML.length>40);
  if(tab!=='quiz')assert.equal((h.nodes.get('graphs').innerHTML.match(/class="plot"/g)||[]).length,3);
 }
});
test('DOM: interactive scrub/slider, free fall, air resistance, quiz and lazy playback',()=>{
 const h=harness();
 const controlsBefore=h.nodes.get('controls').innerHTML;
 h.fire('controls','input','[data-range]',{dataset:{range:'v0',unit:'m/s'},value:'10'});
 near(h.snapshot().motion.v0,10);
 assert.equal(h.nodes.get('controls').innerHTML,controlsBefore,'active mobile slider must not be destroyed by input');
 h.fire('controls','input','[data-range]',{dataset:{range:'a',unit:'m/s²'},value:'-5'});
 h.fire('controls','input','[data-range]',{dataset:{range:'t',unit:'s'},value:'4'});
 near(h.snapshot().motion.t,4);
 assert.match(h.nodes.get('graph-summary').textContent,/toplam alınan yol/);
 h.fire('buttons','click','[data-action]',{dataset:{action:'play'}});
 assert.equal(h.windows.frames.length,1);
 h.fire('tabs','click','[data-tab]',{dataset:{tab:'fall'}});
 h.fire('controls','input','[data-range]',{dataset:{range:'t',unit:'s'},value:'3'});
 assert.match(h.nodes.get('results').innerHTML,/m\/s/);
 h.fire('tabs','click','[data-tab]',{dataset:{tab:'drag'}});
 assert.match(h.nodes.get('graph-summary').textContent,/Hava direnci/);
 assert.match(h.nodes.get('controls').innerHTML,/kesit alanı/i);
 h.fire('controls','input','[data-range]',{dataset:{range:'area',unit:'m²'},value:'0.2'});
 near(h.snapshot().drag.area,0.2);
 h.fire('controls','change','select[data-select]',{dataset:{select:'shape'},value:'parachute'});
 assert.equal(h.snapshot().drag.shape,'parachute');
 assert.match(h.nodes.get('results').innerHTML,/Etkin direnç katsayısı/);
 h.fire('controls','input','[data-range]',{dataset:{range:'rho',unit:'kg\/m³'},value:'1.5'});
 near(h.snapshot().drag.rho,1.5);
 h.fire('tabs','click','[data-tab]',{dataset:{tab:'quiz'}});
 h.fire('quiz','click','[data-answer]',{dataset:{answer:'3'}});
 h.fire('buttons','click','[data-action]',{dataset:{action:'check'}});
 assert.equal(h.snapshot().quiz.score,1);
 assert.match(h.nodes.get('quiz').innerHTML,/feedback success/);
 h.fire('buttons','click','[data-action]',{dataset:{action:'next'}});
 assert.equal(h.snapshot().quiz.index,1);
});
