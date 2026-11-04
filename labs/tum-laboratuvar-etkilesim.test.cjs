'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname,pages=fs.readdirSync(root).filter(n=>n.endsWith('.html')).sort();
const exempt=new Set(['genden-proteine-rota.html']);
function parts(html){
 const sources=[...html.matchAll(/<script[^>]*src="([^"]+\.js)(?:\?[^\"]*)?"/gi)].map(m=>m[1]);
 const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 return {sources,inline};
}
function body(filename){
 const html=fs.readFileSync(path.join(root,filename),'utf8');
 const p=parts(html);
 const js=p.sources.map(name=>{const full=path.resolve(root,name);assert.ok(full.startsWith(root+path.sep),'Only local lab scripts allowed: '+name);assert.ok(fs.existsSync(full),'Missing JS '+filename+' → '+name);return fs.readFileSync(full,'utf8');});
 return {html,code:[html,...p.inline,...js].join('\n'),sources:p.sources};
}
test('every labs HTML page has a script and resolves every required local JS asset',()=>{
 assert.ok(pages.length>=33,'unexpected lab page loss: '+pages.length);
 for(const filename of pages){const p=body(filename);assert.ok(p.sources.length||p.html.includes('<script'),'No script: '+filename);}
});
test('every active experiment has real input/event behavior, not only headings or text',()=>{
 for(const filename of pages){if(exempt.has(filename))continue;const p=body(filename);
  assert.match(p.code,/addEventListener|\.oninput|\.onclick|onclick=|oninput=|onchange=|MekanikUI|U\.create\(|UI\.create\(|data-control|handleMove|pointermove|querySelectorAll|createElement|render\(/,
  'No observable interactive event source in '+filename);
 }
});
test('all experiment pages have a render surface or dynamically drawn output',()=>{
 for(const filename of pages){if(exempt.has(filename))continue;const p=body(filename);
  assert.match(p.code,/<canvas\b|<svg\b|id="scene"|getContext\(|\.svg\(|innerHTML|draw\(|render\(|createElement\(/,
  'No physical/dynamic visible output surface in '+filename);
 }
});
test('navigation route is a navigational page, not misclassified as a laboratory',()=>{
 const p=body('genden-proteine-rota.html');assert.match(p.html,/href=/);assert.ok(exempt.has('genden-proteine-rota.html'));
});
test('critical iPad touch modules and dynamic physical behavior remain linked',()=>{
 const must={
  'basit-makineler.html':['basit-makineler-kinematik.js','basit-makineler-pointer.js'],
  'elektrik-alan.html':['elektrik-alan-pointer.js'],
  'isi-sicaklik.html':['isi-sicaklik-pointer.js'],
  'tyt-elektrostatik.html':['tyt-elektro-pointer.js'],
  'tyt-devre.html':['tyt-devre-ui.js','tyt-devre-math.js'],
  'siga.html':['kavramsal-hareket.js'],
  'manyetizma.html':['kavramsal-hareket.js'],
  'alternatif-akim.html':['kavramsal-hareket.js'],
  'tork-denge.html':['tork-denge-pointer.js']};
 for(const [h,files] of Object.entries(must)){const b=body(h);for(const file of files)assert.ok(b.sources.includes(file),h+' lacks '+file);}
});
test('all embedded, inline JS tags parse in Node before browser deployment',()=>{
 for(const filename of pages){const html=fs.readFileSync(path.join(root,filename),'utf8');for(const [i,s] of parts(html).inline.entries())assert.doesNotThrow(()=>new vm.Script(s,{filename:filename+':'+i}),filename+' embedded script malformed');}
});
test('TYT and AYT navigation pages both remain reachable',()=>{
 const home=fs.readFileSync(path.join(root,'../index.html'),'utf8');
 assert.ok(home.includes('data-level="tyt"')&&home.includes('data-level="ayt"'));
 for(const filename of ['tyt-devre.html','tyt-elektrostatik.html','isi-sicaklik.html','basit-makineler.html','newton-hareket-yasalari.html','enerji-lab.html'])assert.ok(home.includes('labs/'+filename),filename+' not linked');
});
