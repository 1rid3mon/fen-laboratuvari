'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
function runtime(kind){
 const ids=['tabs','controls','actions','quiz','heading','intro','scene','diagram-title','interpret','formula','measurements','note'];
 const nodes=new Map(),handlers=new Map();for(const id of ids)nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(event,fn){handlers.set(id+':'+event,fn);}});
 const scene=nodes.get('scene'),controls=nodes.get('controls');
 scene.querySelector=q=>q==='svg'?{getBoundingClientRect(){return {left:0,top:0,width:800,height:360};}}:null;
 scene.setPointerCapture=id=>{scene.captured=id};scene.hasPointerCapture=id=>scene.captured===id;scene.releasePointerCapture=id=>{scene.captured=null};
 const inputs=new Map();
 controls.querySelector=q=>{const m=q.match(/input\[data-control="([^"]+)"\]/);return m?inputs.get(m[1]):null;};
 function field(key,val,min,max,step){const input={value:String(val),min:String(min),max:String(max),step:String(step),dataset:{control:key},dispatchEvent(){handlers.get('controls:input')({target:{closest:()=>input}})}};inputs.set(key,input);}
 const doc={readyState:'loading',hidden:false,getElementById(id){return nodes.get(id);},addEventListener(t,cb){handlers.set('doc:'+t,cb);}};
 const win={Event:class{constructor(type,options){this.type=type}},requestAnimationFrame(){}};
 const ctx=vm.createContext({window:win,document:doc,console});
 const files=kind==='simple'?['basit-makineler-math.js','mekanik-ui.js','basit-makineler-kinematik.js','basit-makineler-lab.js','basit-makineler-pointer.js']:['elektrik-alan-math.js','mekanik-ui.js','elektrik-alan-lab.js','elektrik-alan-pointer.js'];
 for(const f of files)vm.runInContext(read(f),ctx,{filename:f});
 handlers.get('doc:DOMContentLoaded')();
 return {nodes,handlers,field,win,scene,inputs};
}
const target=(handle,centerX,centerY)=>({closest:()=>({dataset:{drag:handle,centerX:String(centerX),centerY:String(centerY)}})});
test('iPad pointer capture: rotating input gear animates coupled gear with opposite spin and retains drag after SVG rerender',()=>{
 const {nodes,handlers,field,win,scene}=runtime('simple');
 handlers.get('tabs:click')({target:{closest:()=>({dataset:{tab:'gears'}})}});
 field('inputTurns',0,-8,8,.05);
 const e=(x,y)=>({clientX:x,clientY:y,pointerId:27,preventDefault(){},target:target('inputTurns',315,176)});
 handlers.get('scene:pointerdown')(e(371,176));assert.equal(scene.captured,27);
 handlers.get('scene:pointermove')(e(315,232));const snap=win.BasitMakineLab.snapshot();assert.equal(snap.values.gears.inputTurns,.25);
 assert.equal(win.BasitMakineMath.gears(snap.values.gears).outputTurns,-.125);
 assert.match(nodes.get('scene').innerHTML,/rotate\(90/);
 handlers.get('scene:pointerup')(e(315,232));assert.equal(scene.captured,null);
});
test('iPad pointer capture: move electric probe and recalculate field while drawing changes',()=>{
 const {nodes,handlers,field,win,scene}=runtime('electric');
 for(const [key,value]of [['px',3],['py',0],['x1',0],['y1',0]])field(key,value,-6,6,.5);
 const old=nodes.get('scene').innerHTML;
 const e=(x,y)=>({clientX:x,clientY:y,pointerId:3,preventDefault(){},target:target('probe',0,0)});
 handlers.get('scene:pointerdown')(e(526,178));
 handlers.get('scene:pointermove')(e(484,132));
 const s=win.ElektrikAlanLab.snapshot();assert.equal(s.values.single.px,2);assert.equal(s.values.single.py,2);
 assert.notEqual(nodes.get('scene').innerHTML,old);handlers.get('scene:pointerup')(e(484,132));
});
test('touch-optimized optics expose all three physical drag behaviors',()=>{
 for(const [filename,needle] of [['optik-golge.html','shadowPointer'],['optik-kirilma.html','depthPointer'],['optik-aydinlanma-yansima.html','lampPointer']]){
 const h=read(filename);assert.ok(h.includes(needle));const match=h.match(/<script>([\s\S]*?)<\/script>/);assert.ok(match);new vm.Script(match[1],{filename});
 }
 assert.match(read('optik-aydinlanma-yansima.html'),/y=300-h\*23/);
});
