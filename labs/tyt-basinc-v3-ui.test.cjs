'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const model=require('./tyt-basinc-v3-model.js');
function boot(){
 const nodes={};
 for(const id of ['tabs','controls','scene','stats','explain'])nodes[id]={
 innerHTML:'',textContent:'',handlers:{},
 addEventListener(name,handler){this.handlers[name]=handler;},
 querySelector(){return null;},
 getBoundingClientRect(){return{left:0,top:0,width:900,height:500};},
 setPointerCapture(){},
 };
 const context={document:{getElementById:id=>nodes[id]},window:{TYTPressureModel:model},requestAnimationFrame:()=>1};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'tyt-basinc-v3.js'),'utf8'),context,{filename:'tyt-basinc-v3.js'});
 const tab=name=>nodes.tabs.handlers.click({target:{closest:sel=>sel==='[data-tab]'?{dataset:{tab:name}}:null}});
 const action=name=>nodes.controls.handlers.click({target:{dataset:{action:name}}});
 const input=(field,value,type='range')=>nodes.controls.handlers.input({target:{dataset:{field},value:String(value),type}});
 const pointer=(type,id)=>nodes.scene.handlers.pointerdown({target:{closest:sel=>sel==='[data-'+type+']'?{dataset:{[type]:String(id)}}:null},pointerId:3,preventDefault(){}});
 const move=(x,y)=>nodes.scene.handlers.pointermove({clientX:x,clientY:y,pointerId:3,preventDefault(){}});
 const up=()=>nodes.scene.handlers.pointerup({pointerId:3});
 return{nodes,tab,action,input,pointer,move,up};
}
test('liquid view permits up to four probes and displays separate readings',()=>{
 const v=boot();v.action('add-probe');v.action('add-probe');v.action('add-probe');assert.match(v.nodes.scene.innerHTML,/data-probe="4"/);
 v.action('add-probe');assert.doesNotMatch(v.nodes.scene.innerHTML,/data-probe="5"/);
 assert.match(v.nodes.stats.textContent,/S1:/);assert.match(v.nodes.stats.textContent,/S4:/);
});
test('submerged tank floor and both side walls show normal-force arrows',()=>{
 const v=boot();assert.equal(v.nodes.scene.innerHTML.split('marker-end="url(#pa)"').length-1,3);
});
test('touch dragging of an individual liquid probe updates its geometry',()=>{
 const v=boot();v.pointer('probe',1);v.move(470,340);assert.match(v.nodes.scene.innerHTML,/data-probe="1" cx="470" cy="340"/);v.up();assert.match(v.nodes.stats.textContent,/S1:/);
});
test('solid blocks can be moved between load-bearing columns',()=>{
 const v=boot();v.tab('solid');assert.match(v.nodes.stats.textContent,/Sütun 1: F=70 N/);
 v.pointer('block',1);v.move(690,250);v.up();
 assert.match(v.nodes.stats.textContent,/Sütun 1: F=30 N/);
 assert.match(v.nodes.stats.textContent,/Sütun 3: F=40 N/);
});
test('gas piston drag changes the calculated pressure',()=>{
 const v=boot();v.tab('gas');assert.match(v.nodes.stats.textContent,/P = 100 kPa/);
 v.pointer('piston',0);v.move(305,240);v.up();
 assert.match(v.nodes.stats.textContent,/P = 200 kPa/);
});
test('ice melt and balloon inputs remain independent in closed vessel demonstration',()=>{
 const v=boot();v.tab('ice');assert.match(v.nodes.stats.textContent,/ip gerilmesi=19,7 N/);
 v.input('melt',100);assert.match(v.nodes.scene.innerHTML,/Buz: 0% kaldı/);
 assert.match(v.nodes.stats.textContent,/ip gerilmesi=19,7 N/);
});
