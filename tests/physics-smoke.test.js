// Run: node tests/physics-smoke.test.js
// TYT/AYT existing curriculum: numerical sanity checks for idealized models.
const assert=require('node:assert/strict');
const near=(actual,expected,tol=0.001)=>assert.ok(Math.abs(actual-expected)<tol,actual+' != '+expected);
const rad=Math.PI/180;
near(Math.asin(Math.sin(30*rad)/1.33)/rad,22.0824);
near(Math.asin(1/1.33)/rad,48.7535);
near(133/1.33,100);
near(100/2**2,25);
near(100/4**2,6.25);
near(Math.hypot(3+3+0,4+0-3),Math.sqrt(37));
near(Math.hypot(3-0,0-4),5);
near(25*250/(2*200),15.625);
const fs=require('node:fs'),vm=require('node:vm');
for(const path of [
'index.html',
'labs/vektorler-bagil-hareket.html',
'labs/optik-ayna-mercek.html',
'labs/optik-golge.html',
'labs/optik-renk-sorulari.html',
'labs/optik-kirilma.html',
'labs/optik-aydinlanma-yansima.html',
'labs/optik-renkler.html'
]){const html=fs.readFileSync(path,'utf8');assert.ok(html.includes('</html>'),path+' missing HTML closing tag');for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:path});console.log('PASS '+path)}
console.log('PASS 8 numerical physics checks');
