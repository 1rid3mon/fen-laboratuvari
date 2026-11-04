'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const M=require('./tyt-dort-atolye-model.js');
function boot(topic='waves'){
 const nodes={};for(const key of ['topics','modes','controls','scene','result','explain','heading'])nodes[key]={
 innerHTML:'',textContent:'',handlers:{},
 addEventListener(type,fn){this.handlers[type]=fn;},
 querySelector(){return null;},
 getBoundingClientRect(){return{left:0,top:0,width:900,height:500};},
 setPointerCapture(){}
 };
 let frame=null;
 const sandbox={document:{body:{dataset:{}},getElementById:id=>nodes[id]},window:{location:{search:'?topic='+topic},TYTFourWorkshopModel:M},
 URLSearchParams,requestAnimationFrame(fn){frame=fn;return 1;}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'tyt-dort-atolye.js'),'utf8'),sandbox,{filename:'tyt-dort-atolye.js'});
 const click=(id,datasetKey,value)=>{
 const selector='[data-'+datasetKey+']';
 nodes[id].handlers.click({target:{closest(s){return s===selector?{dataset:{[datasetKey]:value}}:null;}}});
 };
 const mode=name=>click('modes','mode',name);
 const change=(key,value)=>nodes.controls.handlers.input({target:{dataset:{key},value:String(value),type:'range'}});
 const drag=(name,x,y)=>{
 nodes.scene.handlers.pointerdown({target:{closest(s){return s==='[data-drag]'?{dataset:{drag:name}}:null;}},pointerId:7,preventDefault(){}});
 nodes.scene.handlers.pointermove({pointerId:7,clientX:x,clientY:y,preventDefault(){}});
 nodes.scene.handlers.pointerup({pointerId:7});
 };
 return{nodes,mode,change,drag,frame(now){if(frame)frame(now);}};
}
test('all four requested topics open their own physical scenes',()=>{
 for(const [topic,fragment] of [['waves','Atma genliği'],['matter','İlk sıvı hacmi'],['intro','A vektörü'],['heat','başlangıç sıcaklığı']]){
 const x=boot(topic);assert.ok(x.nodes.controls.innerHTML.includes(fragment),topic);assert.ok(x.nodes.scene.innerHTML.length>1000,topic);
 }
});
test('wave source drag changes shape while fixed end remains constrained',()=>{
 const x=boot('waves'),prior=x.nodes.scene.innerHTML;
 x.drag('wave-amplitude',100,120);
 assert.notEqual(x.nodes.scene.innerHTML,prior);
 assert.match(x.nodes.explain.textContent,/Sabit uçta/);
});
test('water source and interface depth can be dragged without disappearing',()=>{
 const x=boot('waves');x.mode('water');
 x.drag('water-source',350,110);assert.match(x.nodes.scene.innerHTML,/cx="350" cy="115"/);
 x.drag('water-boundary',320,310);assert.match(x.nodes.scene.innerHTML,/y1="310"/);
 assert.match(x.nodes.result.textContent,/açısı/i);
});
test('matter: dragging a volume into graduated cylinder raises the measured level',()=>{
 const x=boot('matter');assert.match(x.nodes.result.textContent,/Ölçek okuması: 150 mL/);
 x.drag('matter-1',615,354);
 assert.match(x.nodes.result.textContent,/Ölçek okuması: 200 mL/);
 assert.match(x.nodes.result.textContent,/Cisim 1: ρ=2 g\/cm³/);
});
test('matter: capillary radius touch changes ideal height',()=>{
 const x=boot('matter');x.mode('capillary');
 const prior=x.nodes.result.textContent;x.drag('cap-1',368,110);
 assert.notEqual(x.nodes.result.textContent,prior);
 assert.match(x.nodes.explain.textContent,/Kılcallık/);
});
test('intro: one-dimensional vector endpoint can be dragged',()=>{
 const x=boot('intro');x.drag('vector-a',615,130);
 assert.match(x.nodes.result.textContent,/A = 5/);
 assert.match(x.nodes.result.textContent,/Bileşke = 3/);
});
test('intro: ruler endpoints adjust a positive measured length',()=>{
 const x=boot('intro');x.mode('ruler');
 x.drag('ruler-b',155+59*9,140);
 assert.match(x.nodes.result.textContent,/Uzunluk: 7 cm/);
});
test('heat: contact from drag triggers energy-conserving temperature exchange',()=>{
 const x=boot('heat');x.drag('heat-a',505,250);
 assert.match(x.nodes.result.textContent,/Temas var/);
 x.frame(1000);x.frame(2000);
 assert.doesNotMatch(x.nodes.result.textContent,/A: 80°C · B: 20°C/);
 assert.match(x.nodes.result.textContent,/İdeal denge: 50°C/);
});
test('heat: expansion illustration labels exaggerated scale',()=>{
 const x=boot('heat');x.mode('rod');x.change('rodTemp',120);
 assert.match(x.nodes.result.textContent,/uzama/i);
 assert.match(x.nodes.explain.textContent,/100 kat/);
});
