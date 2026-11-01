'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const basedir=__dirname;
function file(p){return fs.readFileSync(path.join(basedir,p),'utf8');}
function context(){
 const window={};
 vm.runInNewContext(file('cografya-veri.js'),{window},{filename:'cografya-veri.js',timeout:5000});
 return window.GeoLabData;
}
const D=context();
function rings(g){
 if(g.type==='Polygon')return g.coordinates;
 if(g.type==='MultiPolygon')return g.coordinates.flat();
 return [];
}
function bboxContains(geometry,lon,lat){
 return rings(geometry).some(r=>r.length&&r.some(x=>Math.abs(x[0]-lon)<6&&Math.abs(x[1]-lat)<5));
}
test('real map GeoJSON: 180 countries + 81 Turkish provinces',()=>{
 const world=JSON.parse(file('cografya-dunya.geojson'));
 const turkey=JSON.parse(file('cografya-iller.geojson'));
 assert.equal(world.features.length,180);
 assert.equal(turkey.features.length,81);
 assert.ok(world.features.some(x=>x.id==='TUR'&&x.geometry.type==='MultiPolygon'));
 assert.deepEqual(new Set(turkey.features.map(x=>x.properties.il_adi)).size,81);
 assert.ok(turkey.features.every(f=>rings(f.geometry).length>0));
 assert.ok(world.features.every(f=>rings(f.geometry).length>0));
});
test('all world and Turkey pins use real-looking coordinates and bounded areas',()=>{
 const locations=Object.values(D.points);
 assert.ok(locations.length>=60);
 for(const p of locations){
  assert.ok(Number.isFinite(p.lon)&&Number.isFinite(p.lat),p.id);
  if(p.area==='turkey'){
   assert.ok(p.lon>=25&&p.lon<=45.5,p.id+' longitude');
   assert.ok(p.lat>=35&&p.lat<=42.5,p.id+' latitude');
  }else{
   assert.ok(p.lat>=-63&&p.lat<=83,p.id+' latitude');
   assert.ok(p.lon>=-180&&p.lon<=180,p.id+' longitude');
  }
  assert.ok(p.detail.length>35&&p.rule.length>15,p.id);
 }
});
test('all TYT questions: unique ids, five unique points, correct in options',()=>{
 assert.equal(D.questions.length,78);
 const ids=new Set();
 for(const q of D.questions){
  assert.ok(!ids.has(q.id),q.id);ids.add(q.id);
  assert.equal(q.pins.length,5,q.id);
  assert.equal(new Set(q.pins).size,5,q.id);
  assert.ok(q.pins.includes(q.answer),q.id);
  assert.ok(q.prompt.length>35&&q.why.length>35,q.id);
  assert.ok(['world','turkey','contour'].includes(q.area),q.id);
  for(const key of q.pins){
   if(q.area==='contour')assert.ok(D.contours.some(c=>c.id===key),q.id+' '+key);
   else{assert.ok(D.points[key],q.id+' missing '+key);assert.equal(D.points[key].area,q.area,q.id);}
  }
 }
 const byArea=D.questions.reduce((o,x)=>{o[x.area]=(o[x.area]||0)+1;return o;},{});
 assert.ok(byArea.turkey>=30&&byArea.world>=25&&byArea.contour>=5);
 const correctIndices=new Set(D.questions.map(q=>q.pins.indexOf(q.answer)));
 assert.equal(correctIndices.size,5,'correct answers should be distributed across I–V');
});
test('TYT only; exam-like map visuals remain grayscale and labels hidden in question mode',()=>{
 const html=file('cografya-harita.html'),css=file('cografya-harita.css'),app=file('cografya-harita.js');
 assert.match(html,/Yalnız TYT/);
 assert.doesNotMatch(html,/AYT müfredatı|AYT coğrafya/);
 assert.match(html,/Keşfet/);assert.match(html,/Hatırla/);assert.match(html,/TYT Sınavı/);
 assert.match(html,/Yanlışlarım/);assert.match(html,/OpenStreetMap/);
 assert.match(css,/#c9c9c5|#c5c5c1/);
 assert.match(css,/@media\(max-width:720px\)/);
 assert.match(css,/focus-visible/);
 assert.match(app,/S\.mode==='explore'&&S\.labels/);
 assert.match(app,/S\.mode==='recall'&&S\.answered/);
});
test('contour features and reasoning covered',()=>{
 for(const key of ['hill','valley','ridge','steep','saddle'])assert.ok(D.contours.some(c=>c.id===key));
 const questions=D.questions.filter(q=>q.area==='contour');
 assert.ok(questions.some(q=>/V/.test(q.prompt)));
 assert.ok(questions.some(q=>/sık/.test(q.prompt)));
 assert.ok(questions.some(q=>/geçit/.test(q.prompt)));
});
function domHarness(){
 const listeners=new Map(),nodes=new Map();
 const contextWindow={
  GeoLabData:D,localStorage:{
   m:new Map(),getItem(k){return this.m.has(k)?this.m.get(k):null;},
   setItem(k,v){this.m.set(k,String(v));}
  },confirm(){return true}
 };
 function fakeEl(id){
  return {
   id,innerHTML:'',textContent:'',className:'',disabled:false,dataset:{},checked:false,attributes:{},
   classList:{toggle(){},add(){},remove(){}},
   setAttribute(k,v){this.attributes[k]=v;},
   addEventListener(t,fn){listeners.set(id+':'+t,fn);}
  };
 }
 for(const id of ['mode-tabs','area-tabs','topic-select','label-toggle','label-toggle-wrap',
  'province-button','new-question','review-button','map','answer-options','question-actions',
  'clear-progress','mastery','wrong-count','review-summary','wrong-list','scene-kicker',
  'map-title','scene-description','pin-counter','map-caption','lesson-label','prompt-heading',
  'prompt-detail','result','lesson'])nodes.set(id,fakeEl(id));
 let docReady;
 const doc={
  readyState:'loading',
  getElementById(id){return nodes.get(id)||null;},
  querySelectorAll(){return [];},
  addEventListener(t,fn){if(t==='DOMContentLoaded')docReady=fn;}
 };
 const fetch=async url=>({ok:true,json:async()=>JSON.parse(file(url))});
 const env=vm.createContext({window:contextWindow,document:doc,fetch,console,Intl,Date,Math});
 vm.runInContext(file('cografya-harita.js'),env,{filename:'cografya-harita.js',timeout:10000});
 assert.equal(typeof docReady,'function');
 docReady();
 function send(id,event,selector,ds,value){
  assert.equal(typeof listeners.get(id+':'+event),'function',id+' '+event);
  const b=Object.assign({dataset:ds||{},disabled:false,value,closest(q){return q===selector?this:null;}});
  listeners.get(id+':'+event)({target:{value,closest(q){return q===selector?b:null;}}});
 }
 function click(id,selector,dataset){send(id,'click',selector,dataset);}
 function inspection(){return contextWindow.GeoLabInspection.getInfo();}
 return {doc,nodes,listeners,click,send,inspection,win:contextWindow};
}
test('DOM: explore pin selection really opens a lesson; area and topics change',async()=>{
 const h=domHarness();
 assert.equal(h.inspection().mode,'explore');
 assert.equal(h.inspection().area,'turkey');
 await new Promise(resolve=>setImmediate(resolve));
 assert.match(h.nodes.get('map').innerHTML,/svg/);
 const pin=h.nodes.get('map').innerHTML.match(/data-mark-id="([^"]+)"/);
 assert.ok(pin);
 h.click('map','[data-mark-id]',{markId:pin[1]});
 assert.equal(h.nodes.get('prompt-heading').textContent,D.points[pin[1]].name);
 h.click('area-tabs','[data-area]',{area:'world'});
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(h.inspection().area,'world');
 assert.match(h.nodes.get('map').innerHTML,/DÜNYA|svg/);
 h.click('area-tabs','[data-area]',{area:'contour'});
 assert.match(h.nodes.get('map').innerHTML,/contour-choice/);
 h.click('map','[data-mark-id]',{markId:'hill'});
 assert.equal(h.nodes.get('prompt-heading').textContent,'Tepe');
});
test('DOM: recall incorrect answer recorded and available through wrong-review',async()=>{
 const h=domHarness();
 h.click('mode-tabs','[data-mode]',{mode:'recall'});
 assert.equal(h.inspection().mode,'recall');
 const prompt=h.nodes.get('prompt-heading').textContent;
 const question=D.questions.find(q=>q.prompt===prompt);
 assert.ok(question);
 const wrong=question.pins.find(x=>x!==question.answer);
 h.click('answer-options','[data-answer]',{answer:wrong});
 assert.match(h.nodes.get('question-actions').innerHTML,/Cevabı kontrol et/);
 h.click('question-actions','[data-action]',{action:'submit-recall'});
 assert.equal(h.inspection().wrong,1);
 assert.match(h.nodes.get('result').className,/error/);
 assert.match(h.nodes.get('lesson').innerHTML,/Doğru/);
 h.click('review-button','[data-action]',{});
 assert.equal(h.inspection().mode,'recall');
});
test('DOM: exam five answers, score, wrong tracking and new test',()=>{
 const h=domHarness();
 h.click('mode-tabs','[data-mode]',{mode:'exam'});
 assert.equal(h.inspection().examIndex,0);
 for(let i=0;i<5;i++){
  const prompt=h.nodes.get('prompt-heading').textContent;
  const q=D.questions.find(q=>q.prompt===prompt);
  assert.ok(q,'question '+i);
  // Simulate both correct and intentionally incorrect answers.
  const choice=i%2===0?q.answer:q.pins.find(k=>k!==q.answer);
  h.click('answer-options','[data-answer]',{answer:choice});
  h.click('question-actions','[data-action]',{action:'submit-exam'});
 }
 assert.match(h.nodes.get('prompt-heading').textContent,/bitti/);
 assert.match(h.nodes.get('lesson').innerHTML,/Net/);
 assert.ok(h.inspection().wrong>=1);
 h.click('question-actions','[data-action]',{action:'new-exam'});
 assert.equal(h.inspection().examIndex,0);
});
test('map geometry source/license documentation is present',()=>{
 const html=file('cografya-harita.html');
 for(const f of ['cografya-veri.js','cografya-harita.js','cografya-harita.css'])assert.ok(html.includes(f));
 for(const f of ['cografya-iller.geojson','cografya-dunya.geojson'])assert.ok(file('cografya-harita.js').includes(f));
 assert.match(html,/ODbL 1\.0/);
});