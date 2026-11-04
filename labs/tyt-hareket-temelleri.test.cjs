'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,p),'utf8');
const js=read('tyt-hareket-temelleri.js');
function mount(){
 const nodes=new Map(),events=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',addEventListener(type,fn){events.set(id+':'+type,fn)}});return nodes.get(id)};
 vm.runInNewContext(js,{document:{getElementById:get}});return {get,events};
}
function tab(m,name){m.events.get('tabs:click')({target:{closest:()=>({dataset:{tab:name}})}});}
function set(m,key,value){m.events.get('controls:input')({target:{dataset:{key},value:String(value)}});}
test('distance sums both legs, displacement subtracts return and averages divide by total time',()=>{
 const m=mount();const r=m.get('result').textContent;
 assert.match(r,/Alınan yol = 70 m/);assert.match(r,/Yer değiştirme = 30 m/);
 assert.match(r,/Ortalama sürat = 3,5 m\/s/);assert.match(r,/Ortalama hız = 1,5 m\/s/);
 assert.match(m.get('note').textContent,/son konum − ilk konum/);
});
test('return to start has nonzero distance but zero displacement and mean velocity',()=>{
 const m=mount();set(m,'back',50);const r=m.get('result').textContent;
 assert.match(r,/Alınan yol = 100 m/);assert.match(r,/Yer değiştirme = 0 m/);
 assert.match(r,/Ortalama sürat = 5 m\/s/);assert.match(r,/Ortalama hız = 0 m\/s/);
});
test('negative displacement yields negative signed average velocity not negative speed',()=>{
 const m=mount();set(m,'out',20);set(m,'back',50);
 assert.match(m.get('result').textContent,/Alınan yol = 70 m/);
 assert.match(m.get('result').textContent,/Yer değiştirme = -30 m/);
 assert.match(m.get('result').textContent,/Ortalama hız = -1,5 m\/s/);
 assert.match(m.get('result').textContent,/Ortalama sürat = 3,5 m\/s/);
});
test('uniform velocity graphs change with signed speed and selected time',()=>{
 const m=mount();tab(m,'uniform');assert.match(m.get('result').textContent,/Konum x = 30 m/);
 const first=m.get('scene').innerHTML;
 set(m,'velocity',-4);assert.match(m.get('result').textContent,/Konum x = -40 m/);
 assert.notEqual(first,m.get('scene').innerHTML);
 assert.match(m.get('note').textContent,/Konum–zaman grafiğinin eğimi/);
 set(m,'time',0);assert.match(m.get('result').textContent,/Konum x = 0 m/);
 set(m,'velocity',0);set(m,'time',20);assert.match(m.get('result').textContent,/v = 0 m\/s/);
 assert.match(m.get('result').textContent,/Konum x = 0 m/);
});
test('scope safety, navigation and script syntax',()=>{
 const h=read('tyt-hareket-temelleri.html');assert.match(h,/2018 MEB 9\.3\.1\.2/);
 assert.match(h,/İvme hesaplaması/);assert.match(h,/tyt-hareket-temelleri.js/);
 assert.match(read('../index.html'),/labs\/tyt-hareket-temelleri.html/);
 assert.doesNotThrow(()=>new vm.Script(js));
});
test('input values constrained and nonfinite inputs ignored',()=>{
 const m=mount();set(m,'out',999);assert.match(m.get('result').textContent,/Alınan yol = 100 m/);
 set(m,'out','NaN');assert.match(m.get('result').textContent,/Alınan yol = 100 m/);
});
