'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),M=require('./tyt-akiskan-dalga-model.js');
function boot(){
 const ids=['tabs','controls','scene','stats','explain'],nodes=Object.fromEntries(ids.map(id=>[id,{innerHTML:'',textContent:'',handlers:{},
 addEventListener(type,fn){this.handlers[type]=fn;},querySelector(){return null;},
 getBoundingClientRect(){return{left:0,top:0,width:900,height:500};},setPointerCapture(){}}]));
 const sandbox={document:{getElementById:id=>nodes[id]},window:{TYTFluidWaveModel:M},requestAnimationFrame(){}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'tyt-akiskan-dalga.js'),'utf8'),sandbox);
 const tab=name=>nodes.tabs.handlers.click({target:{closest(sel){return sel==='[data-tab]'?{dataset:{tab:name}}:null;}}});
 const input=(key,value)=>nodes.controls.handlers.input({target:{dataset:{key},type:'range',value:String(value)}});
 const drag=(kind,x,y)=>{nodes.scene.handlers.pointerdown({pointerId:7,target:{closest(sel){return sel==='[data-drag]'?{dataset:{drag:kind}}:null;}},preventDefault(){}});
 nodes.scene.handlers.pointermove({pointerId:7,clientX:x,clientY:y,preventDefault(){}});
 nodes.scene.handlers.pointerup({pointerId:7});};
 const action=name=>nodes.controls.handlers.click({target:{dataset:{action:name}}});
 return{nodes,tab,input,drag,action};
}
test('Venturi throat dragging changes static-pressure trend',()=>{
 const t=boot();assert.match(t.nodes.stats.textContent,/Dar kesitte/);
 t.drag('neck',535,185);assert.match(t.nodes.stats.textContent,/Kesitler eşit/);
});
test('Torricelli atmospheric column moves down when altitude increases',()=>{
 const t=boot();t.tab('torricelli');const first=t.nodes.scene.innerHTML;
 t.input('altitude',3000);assert.notEqual(t.nodes.scene.innerHTML,first);
 assert.match(t.nodes.stats.textContent,/atmosfer basıncı azalır/);
});
test('water wave source and barrier impact are independently draggable',()=>{
 const t=boot();t.tab('waves');const initial=t.nodes.scene.innerHTML;
 t.drag('source',270,320);assert.notEqual(t.nodes.scene.innerHTML,initial);
 const after=t.nodes.scene.innerHTML;t.drag('impact',610,270);assert.notEqual(t.nodes.scene.innerHTML,after);
 assert.match(t.nodes.stats.textContent,/yansıma açısı/);
});
test('wave barrier rotation changes physical ray without numeric Snell problem',()=>{
 const t=boot();t.tab('waves');const before=t.nodes.scene.innerHTML;
 t.input('angleDeg',115);assert.notEqual(t.nodes.scene.innerHTML,before);
 assert.doesNotMatch(t.nodes.stats.textContent,/\d+(?:\.\d+)?°/);
});
test('parabolic wave barrier focus handle updates reflected wave geometry',()=>{
 const t=boot();t.tab('parabola');assert.match(t.nodes.stats.textContent,/odakta toplanır/);
 const old=t.nodes.scene.innerHTML;t.drag('focus',545,250);
 assert.notEqual(t.nodes.scene.innerHTML,old);
 assert.match(t.nodes.explain.textContent,/yerel normale/);
});
test('earthquake cabinet can be anchored; safety note remains explicit',()=>{
 const t=boot();t.tab('earthquake');assert.match(t.nodes.stats.textContent,/sabit değil/);
 t.action('anchor');assert.match(t.nodes.stats.textContent,/duvara sabit/);
 assert.match(t.nodes.explain.textContent,/Çök–Kapan–Tutun/);
});
test('9.1 research example mode stays explanatory rather than posing as numeric simulation',()=>{
 const t=boot();t.tab('research');assert.match(t.nodes.stats.textContent,/parçacık/);
 assert.match(t.nodes.explain.textContent,/9.1.1–9.1.4/);
});
