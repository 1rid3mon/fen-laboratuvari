'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),model=require('./tyt-mekanik-2018-model.js');
function boot(){
 const elements={};for(const name of ['tabs','controls','scene','stats','note'])elements[name]={
 innerHTML:'',textContent:'',handlers:{},
 addEventListener(type,cb){this.handlers[type]=cb;},
 querySelector(){return null;},
 getBoundingClientRect(){return{left:0,top:0,width:900,height:500};},
 setPointerCapture(){}
 };
 const win={TYTMechanics2018:model};
 const c={document:{getElementById:k=>elements[k]},window:win,requestAnimationFrame:()=>0};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'tyt-mekanik-2018.js'),'utf8'),c,{filename:'tyt-mekanik-2018.js'});
 function tab(key){elements.tabs.handlers.click({target:{closest(sel){return sel==='[data-tab]'?{dataset:{tab:key}}:null;}}});}
 function input(key,value){elements.controls.handlers.input({target:{dataset:{key},value:String(value),type:'range'}});}
 function drag(name,x,y){elements.scene.handlers.pointerdown({pointerId:9,target:{closest(sel){return sel==='[data-drag]'?{dataset:{drag:name}}:null;}},preventDefault(){}});
 elements.scene.handlers.pointermove({pointerId:9,clientX:x,clientY:y,preventDefault(){}});
 elements.scene.handlers.pointerup({pointerId:9});}
 return{elements,tab,input,drag};
}
test('default motion scene responds to observer velocity and preserves signed relative result',()=>{
 const x=boot();x.tab('relative');assert.match(x.elements.stats.textContent,/Göreli hız = 2 m\/s/);
 x.input('observerVelocity',4);assert.match(x.elements.stats.textContent,/Göreli hız = -1 m\/s/);
 x.drag('vehicle',600,290);assert.match(x.elements.stats.textContent,/Yerde x/);
});
test('motion types scene shows translation, rotation and vibration',()=>{
 const x=boot();assert.match(x.elements.stats.textContent,/öteleme, dönme, titreşim/);
 const before=x.elements.scene.innerHTML;x.input('time',4);assert.notEqual(x.elements.scene.innerHTML,before);
});
test('contact and noncontact forces show different interaction boundaries',()=>{
 const x=boot();x.tab('forceKinds');assert.match(x.elements.stats.textContent,/temas olmadan/);
 x.elements.controls.handlers.change({target:{tagName:'SELECT',dataset:{key:'forceExample'},value:'hand'}});
 assert.match(x.elements.stats.textContent,/Temas yok/);
 x.drag('source',480,300);assert.match(x.elements.stats.textContent,/temas ediyor/);
});
test('acceleration scene shows v-t and a-t graphs and a velocity-zero crossing',()=>{
 const x=boot();x.tab('accel');assert.match(x.elements.scene.innerHTML,/polyline/);
 x.input('time',3);assert.match(x.elements.stats.textContent,/İşaretli hız = 0 m\/s/);
});
test('Newton scene updates actual acceleration after changing a force',()=>{
 const x=boot();x.tab('newton');assert.match(x.elements.stats.textContent,/Fnet = 14 N/);
 x.input('forceRight',30);assert.match(x.elements.stats.textContent,/Fnet = 24 N/);
});
test('horizontal friction reverses direction and correctly holds a block static',()=>{
 const x=boot();x.tab('friction');x.input('applied',-10);
 assert.match(x.elements.stats.textContent,/Statik sürtünme/);
 x.input('applied',-40);assert.match(x.elements.stats.textContent,/Kinetik sürtünme/);
});
test('third-law pair only appears when objects make contact by dragging',()=>{
 const x=boot();x.tab('third');assert.match(x.elements.stats.textContent,/temas etmiyor/);
 x.drag('bodyA',470,300);assert.match(x.elements.stats.textContent,/eşit büyüklükte/);
});
test('work and power update with negative and zero signed displacement',()=>{
 const x=boot();x.tab('work');assert.match(x.elements.stats.textContent,/80 J/);
 x.input('workDisplacement',-4);assert.match(x.elements.stats.textContent,/-80 J/);
 x.input('workDisplacement',0);assert.match(x.elements.stats.textContent,/0 J/);
});
test('energy section keeps visual bars and allows an object to move vertically',()=>{
 const x=boot();x.tab('energy');assert.match(x.elements.scene.innerHTML,/data-drag="energy-height"/);
 x.drag('energy-height',340,350);
 assert.match(x.elements.stats.textContent,/Toplam enerji korunur/);
 assert.match(x.elements.note.textContent,/sayısal değerleri bilerek gösterilmiyor/);
});
test('efficiency source selection is explicitly conceptual and does not claim energy vanishes',()=>{
 const x=boot();x.tab('efficiency');x.input('useful',80);
 assert.match(x.elements.stats.textContent,/Verim = %80/);
 assert.match(x.elements.note.textContent,/enerji yok olmaz/);
});
