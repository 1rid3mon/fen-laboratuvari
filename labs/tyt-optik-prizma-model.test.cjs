'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),M=require('./tyt-optik-prizma-model.js');
const near=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<eps,a+' vs '+b);
test('10.4.8: single-color prism ray enters and exits triangular glass',()=>{
 for(const [name,color,n] of M.colors){
 const ray=M.prism({glassN:n,sourceY:225,angleDeg:58});
 assert.equal(ray.miss,false,name);assert.ok(ray.entry.x<ray.exit.x);
 near(M.length(ray.inside),1);near(M.length(ray.outside),1);
 }
});
test('prism enforces Snell tangential continuity at entry and exit',()=>{
 const ray=M.prism({glassN:1.52});
 const tangent1=M.norm({x:ray.left.x-ray.apex.x,y:ray.left.y-ray.apex.y});
 const tangent2=M.norm({x:ray.right.x-ray.apex.x,y:ray.right.y-ray.apex.y});
 near(M.dot({x:1,y:0},tangent1),1.52*M.dot(ray.inside,tangent1));
 near(1.52*M.dot(ray.inside,tangent2),M.dot(ray.outside,tangent2));
});
test('dispersion sends violet downward more than red in the illustrated prism',()=>{
 const red=M.prism({glassN:M.colors[0][2]});
 const violet=M.prism({glassN:M.colors[6][2]});
 assert.ok(violet.outside.y>red.outside.y);
});
test('moving prism and source changes ray geometry without changing physical units',()=>{
 const a=M.prism({centerX:485,sourceY:225}),b=M.prism({centerX:520,sourceY:225}),c=M.prism({centerX:485,sourceY:255});
 assert.notEqual(a.entry.x,b.entry.x);assert.notEqual(a.exit.y,c.exit.y);
});
test('invalid prism geometry rejected, rays that miss are not manufactured',()=>{
 assert.throws(()=>M.prism({glassN:.9}),RangeError);
 assert.equal(M.prism({sourceY:70}).miss,true);
});
test('prism page and other optics pages keep 2018 MEB compliance cautions',()=>{
 const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
 const html=read('tyt-optik-prizma.html');assert.ok(html.includes('10.4.8.1')&&html.includes('prizma-model.js'));
 const m=read('optik-ayna-mercek.html');assert.ok(m.includes('sayısal görüntü uzaklığı'));assert.ok(!m.includes("' · Görüntü uzaklığı: '+Math.abs(di)"));
 const k=read('optik-kirilma.html');assert.ok(k.includes('matematiksel hesap yapılmaz'));assert.ok(!k.includes('Yaklaşık görünür derinlik: '+"'+ap.toFixed(1)"));
 for(const source of [m,k]){
 const script=source.match(/<script>([\s\S]*?)<\/script>/);assert.ok(script);assert.doesNotThrow(()=>new vm.Script(script[1]));
 }
});
