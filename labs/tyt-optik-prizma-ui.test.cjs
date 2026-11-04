'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),M=require('./tyt-optik-prizma-model.js');
function boot(){
 const n={};for(const id of ['scene','stats','explain','controls'])n[id]={innerHTML:'',textContent:'',handlers:{},
 addEventListener(type,fn){this.handlers[type]=fn;},
 getBoundingClientRect(){return{left:0,top:0,width:900,height:500};},
 setPointerCapture(){}};
 const ctx={document:{getElementById:id=>n[id]},window:{TYTPrismModel:M}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'tyt-optik-prizma.js'),'utf8'),ctx);
 const drag=(name,x,y)=>{
 n.scene.handlers.pointerdown({pointerId:3,target:{closest(sel){return sel==='[data-drag]'?{dataset:{drag:name}}:null;}},clientX:name==='source'?120:485,clientY:220,preventDefault(){}});
 n.scene.handlers.pointermove({pointerId:3,clientX:x,clientY:y,preventDefault(){}});
 n.scene.handlers.pointerup({pointerId:3});
 };
 const input=(key,v)=>n.controls.handlers.input({target:{dataset:{key},value:String(v),type:'range'}});
 const select=(key,v)=>n.controls.handlers.change({target:{dataset:{key},value:String(v)}});
 return{n,drag,input,select};
}
test('touch preview starts with seven white-light spectral colors',()=>{
 const x=boot();assert.match(x.n.stats.textContent,/Beyaz ışık ayrıştı/);
 for(const name of M.colors)assert.ok(x.n.scene.innerHTML.includes(name[1]),name[0]);
});
test('laser source vertically dragged changes refraction and prism exit rays',()=>{
 const x=boot(),before=x.n.scene.innerHTML;
 x.drag('source',120,265);assert.notEqual(x.n.scene.innerHTML,before);
});
test('prism body itself is draggable and rays update',()=>{
 const x=boot(),before=x.n.scene.innerHTML;
 x.drag('prism',530,240);assert.notEqual(x.n.scene.innerHTML,before);
});
test('white and monochromatic light are independently selectable',()=>{
 const x=boot();x.select('spectrum',0);assert.match(x.n.stats.textContent,/Kırmızı ışık/);
 assert.doesNotMatch(x.n.scene.innerHTML,/#ca92f2/);
 x.select('spectrum','white');assert.match(x.n.stats.textContent,/Beyaz ışık ayrıştı/);
});
test('prism apex angle input changes ray geometry',()=>{
 const x=boot(),before=x.n.scene.innerHTML;x.input('prismAngle',70);assert.notEqual(x.n.scene.innerHTML,before);
});
