'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'tyt-basinc-dalgalar.html'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'tyt-basinc-dalgalar.js'),'utf8');
test('six required TYT experiment modes are implemented',()=>{for(const id of ['solid','liquid','buoyancy','spring','water','sound'])assert.ok(js.includes("['"+id+"'"));});
test('pressure and buoyancy use F/A, rho g h, displaced water and floating density ratio',()=>{for(const expr of ['s.force/s.area','s.density*G*s.depth','s.bodyDensity/s.density','s.density*G*immersedVolume/1000'])assert.ok(js.includes(expr));});
test('real pointer drag and wave animation rather than static sliders',()=>{for(const e of ['pointerdown','pointermove','pointerup','setPointerCapture','requestAnimationFrame','phase'])assert.ok(js.includes(e));});
test('iPad responsive SVG scene, accessible status and linked scripts',()=>{assert.match(html,/viewBox="0 0 900 470"/);assert.match(html,/touch-action:none/);assert.match(html,/aria-live="polite"/);assert.match(html,/src="tyt-basinc-dalgalar.js"/);});
test('JS syntax parses and module initializes with fake DOM',()=>{assert.doesNotThrow(()=>new vm.Script(js));const nodes=new Map();for(const id of ['tabs','controls','scene','stats','explain'])nodes.set(id,{innerHTML:'',textContent:'',addEventListener(){}});const doc={getElementById:id=>nodes.get(id)};vm.runInNewContext(js,{document:doc,requestAnimationFrame(){}});assert.match(nodes.get('scene').innerHTML,/<rect/);assert.match(nodes.get('stats').textContent,/F\/A/);});
test('TYT homepage navigation exists',()=>{assert.ok(fs.readFileSync(path.join(__dirname,'../index.html'),'utf8').includes('labs/tyt-basinc-dalgalar.html'));});

test('buoyancy uses submerged volume and correct physical force rather than full volume for floaters',()=>{
 assert.ok(js.includes('immersedVolume=s.volume*clamp(ratio,0,1)'));
 assert.ok(js.includes('up=s.density*G*immersedVolume/1000'));
 assert.ok(js.includes('ratio===1?waterY+55'));
});
