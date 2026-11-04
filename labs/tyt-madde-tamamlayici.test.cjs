'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const source=read('tyt-madde-tamamlayici.js');
function mount(){
 const nodes=new Map(),events=new Map();
 function el(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',addEventListener(type,handler){events.set(id+':'+type,handler)}});return nodes.get(id);}
 vm.runInNewContext(source,{document:{getElementById:el}});
 return {el,events};
}
function choose(m,id){m.events.get('controls:click')({target:{closest:()=>({getAttribute:()=>String(id)})}});}
function tab(m,id){m.events.get('tabs:click')({target:{closest:()=>({getAttribute:()=>id})}});}
function change(m,key,value){m.events.get('controls:input')({target:{dataset:{key},value:String(value)}});}
test('2018 MEB 9.2.1.1(b): cubes and prisms use actual volume formulas',()=>{
 const m=mount();assert.match(m.el('result').textContent,/V = a³ = 2³ = 8 cm³/);
 change(m,'a',4);assert.match(m.el('result').textContent,/64 cm³/);
 choose(m,2);assert.match(m.el('result').textContent,/4 × 3 × 4 = 48 cm³/);
 change(m,'b',5);assert.match(m.el('result').textContent,/80 cm³/);
 assert.match(m.el('scene').innerHTML,/<polygon/);
});
test('2018 MEB 9.2.1.1(b): cylinder and sphere use π and radius, not diameter',()=>{
 const m=mount();choose(m,3);assert.match(m.el('result').textContent,/πr²h/);assert.match(m.el('result').textContent,/50,265 cm³/);
 change(m,'r',3);assert.match(m.el('result').textContent,/113,097 cm³/);
 choose(m,4);assert.match(m.el('result').textContent,/4πr³\/3/);assert.match(m.el('result').textContent,/113,097 cm³/);
 assert.match(m.el('scene').innerHTML,/<circle/);
});
test('mixture is qualitative and correctly distinguishes miscible solution and immiscible layers',()=>{
 const m=mount();tab(m,'mixture');assert.match(m.el('note').textContent,/matematiksel hesaplama yapılmaz/);
 change(m,'amount',4);assert.match(m.el('result').textContent,/genellikle artar/);
 const saltSvg=m.el('scene').innerHTML;choose(m,2);assert.match(m.el('result').textContent,/yağ üstte/);
 assert.match(m.el('note').textContent,/farklı tabaka/);
 assert.notEqual(saltSvg,m.el('scene').innerHTML);
 assert.doesNotMatch(m.el('result').textContent,/g\/cm³|kg\/m³/);
});
test('daily applications avoid false certainty and include the explicit 2018 MEB domains',()=>{
 const m=mount();tab(m,'examples');assert.match(m.el('result').textContent,/Kuyumculuk/);assert.match(m.el('note').textContent,/kesin kanıtlamaz/);
 choose(m,2);assert.match(m.el('result').textContent,/Porselen/);
 choose(m,3);assert.match(m.el('result').textContent,/Ebruda/);assert.match(m.el('note').textContent,/yalnız özkütleyle açıklanamaz/);
});
test('safety boundaries and laboratory navigation are present',()=>{
 const html=read('tyt-madde-tamamlayici.html');assert.match(html,/2018 MEB 9\.2\.1\.1/);assert.match(html,/Kum–su soruları/);
 assert.match(html,/Arşimet/);assert.match(html,/el-Hazinî/);assert.match(html,/tyt-madde-tamamlayici.js/);
 assert.match(read('tyt-madde-ozellikleri.html'),/tyt-madde-tamamlayici.html/);
 assert.doesNotThrow(()=>new vm.Script(source));
});
test('numeric sliders reject NaN and clamp to configured bounds',()=>{
 const m=mount();change(m,'a',500);assert.match(m.el('result').textContent,/216 cm³/);change(m,'a','not-a-number');assert.match(m.el('result').textContent,/216 cm³/);
});
