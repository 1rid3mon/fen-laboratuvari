'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const scripts=['foto-kloroplast.js','foto-isik.js','foto-calvin.js','foto-hiz.js','foto-pigment.js','kemo-enerji.js','kemo-dongu.js'];
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
function runtime(readyState){
 const ids=['experiment-nav','scene','feedback','palette','controls','metrics','insight','current-group','experiment-title','experiment-subtitle','step-badge','guidance','next-btn','reset-btn','pause-btn','start-btn'],dom={},docEvents={},timeouts=[],intervals=[];
 function element(){return{innerHTML:'',textContent:'',className:'',dataset:{},children:[],events:{},
 appendChild(c){this.children.push(c);},addEventListener(t,f){this.events[t]=f;},querySelector(){return {addEventListener(){}};}};}
 for(const id of ids)dom[id]=element();
 const doc={readyState,getElementById:id=>dom[id],createElement:element,addEventListener:(name,fn)=>{docEvents[name]=fn;}};
 const w={location:{hash:''},history:{replaceState(){}},setTimeout(fn){timeouts.push(fn);return timeouts.length;},clearTimeout(){},requestAnimationFrame(fn){timeouts.push(fn);return timeouts.length;},cancelAnimationFrame(){},setInterval(fn){intervals.push(fn);return intervals.length;},clearInterval(){intervals.length=0;}};
 const context=vm.createContext({window:w,document:doc,console});
 const load=name=>vm.runInContext(read(name),context,{filename:name,timeout:3000});
 const event=name=>{assert.equal(typeof docEvents[name],'function');docEvents[name]();};
 const flush=()=>{const pending=timeouts.splice(0);pending.forEach(fn=>fn());};
 return{dom,doc,docEvents,timeouts,intervals,load,event,flush};
}
test('Safari: interactive readyState waits for later deferred modules before loading experiment #1',()=>{
 const s=runtime('interactive');s.load('enerji-core.js');
 assert.equal(typeof s.docEvents.DOMContentLoaded,'function');
 assert.equal(s.timeouts.length,0,'boot must not queue a timer while defer bundles are downloading');
 assert.equal(s.dom['experiment-nav'].children.length,0);
 for(const name of scripts)s.load(name);
 s.event('DOMContentLoaded');
 assert.match(s.dom['experiment-title'].textContent,/Kloroplast/);
 assert.ok(s.dom['experiment-nav'].children.length>=11,'navigation includes nine experiments');
 assert.ok(s.dom.scene.innerHTML.length>180,'experiment SVG/cards must render');
 assert.ok(s.dom.palette.innerHTML.length>10,'molecule palette must render');
 assert.ok(s.dom.metrics.innerHTML.length>10,'observation metrics must render');
 assert.ok(s.dom.guidance.textContent.length>10);
 s.dom['start-btn'].events.click();
 assert.equal(s.intervals.length,1,'auto-show starts only after experiment state exists');
 s.dom['pause-btn'].events.click();
 assert.equal(s.intervals.length,0);
});
test('failed deferred module: show actionable diagnostic rather than empty lab',()=>{
 const s=runtime('interactive');s.load('enerji-core.js');s.event('DOMContentLoaded');
 assert.match(s.dom.scene.innerHTML,/Deneyler yüklenemedi/);
 assert.match(s.dom.feedback.textContent,/9 \/ 9 eksik/);
 assert.equal(s.dom['experiment-title'].textContent,'');
 for(const name of scripts)s.load(name);
 assert.equal(s.timeouts.length,1,'last registration triggers self-healing retry');
 s.flush();
 assert.match(s.dom['experiment-title'].textContent,/Kloroplast/);
 assert.ok(s.dom.palette.innerHTML.includes('data-molecule'));
 assert.ok(s.dom.scene.innerHTML.length>180);
 s.event('DOMContentLoaded');
 assert.equal(s.dom['experiment-nav'].children.length,11,'bootstrap is idempotent');
});
test('already complete document loads after all modules and never starts before registration',()=>{
 const s=runtime('complete');s.load('enerji-core.js');
 assert.equal(s.timeouts.length,1);for(const name of scripts)s.load(name);
 s.flush();assert.match(s.dom['experiment-title'].textContent,/Kloroplast/);
});
test('HTML includes all seven deferred experiment bundles in stable order',()=>{
 const h=read('enerji-lab.html');const found=[...h.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(x=>x[1]);
 assert.deepEqual(found,['enerji-core.js','enerji-visual.js',...scripts]);
});
