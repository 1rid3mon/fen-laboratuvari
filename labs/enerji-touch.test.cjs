'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const files=['enerji-core.js','enerji-visual.js','foto-kloroplast.js','foto-isik.js','foto-calvin.js','foto-hiz.js','foto-pigment.js','kemo-enerji.js','kemo-dongu.js'];
function setup(){
 const names=['experiment-nav','scene','feedback','palette','controls','metrics','insight','current-group','experiment-title','experiment-subtitle','step-badge','guidance','next-btn','reset-btn','pause-btn','start-btn'];
 const events={},els={},frames=[];
 const elt=()=>({innerHTML:'',textContent:'',style:{},dataset:{},children:[],className:'',events:{},
 addEventListener(type,fn){this.events[type]=fn;},
 setAttribute(){},setPointerCapture(){},querySelector(){return null;},
 querySelectorAll(){return [];},getBoundingClientRect(){return{left:0,top:0,width:760,height:408};},
 appendChild(el){this.children.push(el);el.parentNode=this;},
 removeChild(el){this.children=this.children.filter(x=>x!==el);el.parentNode=null;}
 });
 for(const name of names)els[name]=elt();
 els.scene.querySelector=q=>q==='.bio-stage-svg'?{getBoundingClientRect:()=>({left:0,top:0,width:760,height:408})}:null;
 const sliders={light:{min:0,max:100,step:5,value:'50',dataset:{unit:'bağıl'},nextElementSibling:{textContent:''}},wavelength:{min:400,max:700,step:5,value:'450',dataset:{unit:'nm'},nextElementSibling:{textContent:''}}};
 els.controls.querySelector=q=>{const m=q.match(/data-control="([^"]+)"/);return m?sliders[m[1]]||null:null;};
 const body=elt();
 let hovered=null;
 const document={readyState:'loading',body,createElement:elt,getElementById:k=>els[k],addEventListener:(type,fn)=>{events[type]=fn;},elementFromPoint:()=>hovered};
 const window={location:{hash:''},history:{replaceState(){}},
 setTimeout(fn){frames.push(fn);return frames.length;},clearTimeout(){},
 requestAnimationFrame(fn){frames.push(fn);return frames.length;},cancelAnimationFrame(){},
 setInterval(fn){return 1;},clearInterval(){}
 };
 const ctx=vm.createContext({window,document,console,Math,Date});
 for(const file of files)vm.runInContext(read(file),ctx,{filename:file,timeout:5000});
 assert.equal(typeof events.DOMContentLoaded,'function');events.DOMContentLoaded();
 function nextZone(key){hovered={dataset:{zone:key},classList:{add(){}},closest:q=>q==='[data-zone]'?hovered:null};}
 function target(query,attr,key){const node={dataset:{[attr]:key}};return {closest:q=>q===query?node:null};}
 function touch(molecule,zone,move=true){
  const e={pointerType:'touch',pointerId:7,clientX:20,clientY:25,preventDefault(){},target:target('[data-molecule]','molecule',molecule)};
  els.palette.events.pointerdown(e);
  if(move){nextZone(zone);els.palette.events.pointermove({...e,clientX:310,clientY:250});els.palette.events.pointerup({...e,clientX:310,clientY:250});}
  else els.palette.events.pointerup(e);
 }
 function tab(id){els['experiment-nav'].events.click({target:target('[data-exp]','exp',id)});}
 function clickZone(id){els.scene.events.click({target:{closest:q=>q==='[data-zone]'?{dataset:{zone:id}}:null}});}
 function sceneKnob(key,start,end){els.scene.events.pointerdown({pointerId:8,clientX:start,clientY:325,preventDefault(){},target:target('[data-vcontrol]','vcontrol',key)});
 els.scene.events.pointermove({pointerId:8,clientX:end,clientY:325,preventDefault(){}});
 els.scene.events.pointerup({pointerId:8});}
 function toggle(key,value){els.scene.events.click({target:{closest:q=>q==='[data-vtoggle]'?{dataset:{vtoggle:key,value}}:null}});}
 return{els,document,window,ctx,touch,tab,clickZone,sceneKnob,toggle,sliders,body};
}
test('iPad Safari touch drag moves a real molecule to tilakoit and updates experiment state',()=>{
 const x=setup();assert.match(x.els.scene.innerHTML,/bio-stage-svg/);
 const before=x.els.metrics.innerHTML;
 x.touch('LIGHT','tilakoit');
 assert.notEqual(x.els.metrics.innerHTML,before);
 assert.match(x.els.feedback.textContent,/doğru|ışık|Foton/i);
 assert.equal(x.body.children.length,0,'drag ghost is removed');
});
test('iPad one-finger tap to select and then tap stage SVG drop zone also works',()=>{
 const x=setup();x.touch('LIGHT','tilakoit',false);assert.match(x.els.palette.innerHTML,/molecule selected/);
 x.clickZone('tilakoit');assert.match(x.els.metrics.innerHTML,/1 \/ 5/);
});
test('wrong molecule to a zone does not advance light reaction',()=>{
 const x=setup();x.tab('exp2');const first=x.els.metrics.innerHTML;
 x.touch('CO2','inputs');assert.equal(x.els.metrics.innerHTML,first);
 assert.match(x.els.feedback.className,/error/);
});
test('light knob inside live experiment scene changes photosynthesis model and SVG oxygen indicators',()=>{
 const x=setup();x.tab('exp4');const initial=x.els.scene.innerHTML;
 x.sceneKnob('light',380,115);
 assert.notEqual(x.els.scene.innerHTML,initial);assert.match(x.els.scene.innerHTML,/Bağıl fotosentez hızı: 0/);
 assert.equal(x.sliders.light.value,'0');
 x.sceneKnob('light',115,650);
 assert.equal(x.sliders.light.value,'100');
 assert.doesNotMatch(x.els.scene.innerHTML,/Bağıl fotosentez hızı: 0/);
});
test('pigment wavelength moves live inside the scene and updates graph',()=>{
 const x=setup();x.tab('exp5');const before=x.els.scene.innerHTML;
 x.sceneKnob('wavelength',160,650);
 assert.notEqual(before,x.els.scene.innerHTML);
 assert.equal(x.sliders.wavelength.value,'685');
});
test('ecosystem scene oxygen tap changes tested production outcome',()=>{
 const x=setup();x.tab('exp9');
 x.clickZone('test');assert.match(x.els.metrics.innerHTML,/Üretim mümkün/);
 x.toggle('oxygen','no');x.clickZone('test');
 assert.match(x.els.metrics.innerHTML,/Üretim yok/);
 assert.match(x.els.scene.innerHTML,/data-vtoggle="oxygen"/);
});
test('touch target keyboard works for accessible non-pointer operation',()=>{
 const x=setup();x.touch('LIGHT','tilakoit',false);
 x.els.scene.events.keydown({key:'Enter',preventDefault(){},target:{closest:q=>q==='[data-zone],[data-vtoggle],[data-vcontrol]'?{dataset:{zone:'tilakoit'}}:null}});
 assert.match(x.els.metrics.innerHTML,/1 \/ 5/);
});
