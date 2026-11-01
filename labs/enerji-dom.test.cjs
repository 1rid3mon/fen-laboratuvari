'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('browser-like DOM smoke: navigation, touch molecule matching, live range and pause',()=>{
  const ids=['experiment-nav','scene','feedback','palette','controls','metrics','insight',
    'current-group','experiment-title','experiment-subtitle','step-badge','guidance',
    'next-btn','reset-btn','pause-btn','start-btn'];
  const elements=new Map(),docEvents=new Map(),frames=new Map(),intervals=new Map();
  let frameId=0,intervalId=0;
  function createElement(tag){
    return {
      tagName:tag,innerHTML:'',textContent:'',className:'',dataset:{},children:[],listeners:{},
      appendChild(x){this.children.push(x);},
      addEventListener(t,cb){this.listeners[t]=cb;},
      clickEvent(t,target){assert.ok(this.listeners[t],'missing '+t+' handler');this.listeners[t]({target});}
    };
  }
  for(const id of ids)elements.set(id,createElement('div'));
  const document={
    readyState:'loading',
    getElementById(id){return elements.get(id)||null;},
    createElement,
    addEventListener(t,cb){docEvents.set(t,cb);}
  };
  const window={
    location:{hash:''},
    history:{replaceState(){}},
    setTimeout(fn){fn();return 0;},
    clearTimeout(){},
    requestAnimationFrame(cb){const id=++frameId;frames.set(id,cb);return id;},
    cancelAnimationFrame(id){frames.delete(id);},
    setInterval(fn){const id=++intervalId;intervals.set(id,fn);return id;},
    clearInterval(id){intervals.delete(id);}
  };
  const ctx=vm.createContext({document,window,console});
  const files=['enerji-core.js','foto-kloroplast.js','foto-isik.js','foto-calvin.js',
    'foto-hiz.js','foto-pigment.js','kemo-enerji.js','kemo-dongu.js'];
  for(const name of files)vm.runInContext(fs.readFileSync(path.join(__dirname,name),'utf8'),ctx,{filename:name,timeout:3000});
  assert.equal(typeof docEvents.get('DOMContentLoaded'),'function');
  docEvents.get('DOMContentLoaded')();
  assert.match(elements.get('experiment-title').textContent,/Kloroplast/);
  assert.ok(elements.get('experiment-nav').children.length>=11);

  function targetFor(selector,dataset,extra={}){
    const node=Object.assign({dataset},extra);
    return {closest(query){return query===selector?node:null;}};
  }
  const nav=elements.get('experiment-nav'),palette=elements.get('palette'),scene=elements.get('scene');
  nav.clickEvent('click',targetFor('[data-exp]',{exp:'exp2'}));
  assert.match(elements.get('experiment-title').textContent,/Işığa bağımlı/);
  palette.clickEvent('click',targetFor('[data-molecule]',{molecule:'LIGHT'}));
  assert.match(elements.get('feedback').textContent,/Seçildi/);
  scene.clickEvent('click',targetFor('[data-zone]',{zone:'inputs'}));
  assert.match(elements.get('feedback').textContent,/Doğru/);
  assert.match(elements.get('guidance').textContent,/H₂O|Girdiler/);
  palette.clickEvent('click',targetFor('[data-molecule]',{molecule:'CO2'}));
  scene.clickEvent('click',targetFor('[data-zone]',{zone:'products'}));
  assert.match(elements.get('feedback').className,/error/);

  nav.clickEvent('click',targetFor('[data-exp]',{exp:'exp4'}));
  assert.match(elements.get('experiment-title').textContent,/Fotosentez hızı/);
  const controls=elements.get('controls');
  const oldMarkup=controls.innerHTML,oldScene=scene.innerHTML;
  assert.match(oldMarkup,/type="range"/);
  const label={textContent:''};
  const slider={
    value:'85',dataset:{control:'light',unit:'bağıl'},nextElementSibling:label,
    closest(q){return q==='input[type="range"][data-control]'?this:null;}
  };
  controls.clickEvent('input',{closest:q=>slider.closest(q)});
  assert.equal(label.textContent,'85 bağıl');
  assert.equal(frames.size,1);
  const pending=Array.from(frames.entries());
  frames.clear();
  pending[0][1]();
  assert.equal(controls.innerHTML,oldMarkup,'range control must not be destroyed during input');
  assert.notEqual(scene.innerHTML,oldScene,'plot must update live');
  controls.clickEvent('change',targetFor('[data-control]',{control:'light'},{value:'85'}));
  assert.match(controls.innerHTML,/value="85"/);

  const start=elements.get('start-btn'),pause=elements.get('pause-btn');
  start.listeners.click();
  assert.equal(intervals.size,1);
  pause.listeners.click();
  assert.equal(intervals.size,0);
  elements.get('reset-btn').listeners.click();
  assert.match(elements.get('experiment-title').textContent,/Fotosentez hızı/);
});