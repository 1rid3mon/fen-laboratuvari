'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,p),'utf8');
const root=read('../index.html');
const courses=[
 {unit:'9.1 Fizik Bilimine Giriş',pages:['tyt-fizige-giris.html','tyt-dort-atolye.html','tyt-akiskan-dalga.html'],scripts:['tyt-fizige-giris.js','tyt-dort-atolye.js']},
 {unit:'9.2 Madde ve Özellikleri',pages:['tyt-madde-ozellikleri.html','tyt-madde-tamamlayici.html','tyt-dort-atolye.html'],scripts:['tyt-madde-ozellikleri.js','tyt-madde-tamamlayici.js']},
 {unit:'9.3 Hareket ve Kuvvet',pages:['tyt-hareket-temelleri.html','tyt-mekanik-2018.html'],scripts:['tyt-hareket-temelleri.js','tyt-mekanik-2018.js']},
 {unit:'9.4 Enerji',pages:['tyt-mekanik-2018.html'],scripts:['tyt-mekanik-2018.js']},
 {unit:'9.5 Isı ve Sıcaklık',pages:['isi-sicaklik.html','tyt-dort-atolye.html'],scripts:['isi-sicaklik-lab.js','tyt-dort-atolye.js']},
 {unit:'9.6 Elektrostatik',pages:['tyt-elektrostatik.html'],scripts:['tyt-elektro-lab.js','tyt-elektro-pointer.js']},
 {unit:'10.1 Elektrik ve Manyetizma',pages:['tyt-devre.html'],scripts:['tyt-devre-math.js','tyt-devre-ui.js']},
 {unit:'10.2 Basınç ve Kaldırma',pages:['tyt-basinc-v3.html','tyt-akiskan-dalga.html'],scripts:['tyt-basinc-v3.js','tyt-akiskan-dalga.js']},
 {unit:'10.3 Dalgalar',pages:['tyt-dort-atolye.html','tyt-akiskan-dalga.html'],scripts:['tyt-dort-atolye.js','tyt-akiskan-dalga.js']},
 {unit:'10.4 Optik',pages:['optik-ayna-mercek.html','optik-golge.html','optik-kirilma.html','optik-renkler.html','tyt-optik-prizma.html'],scripts:['tyt-optik-prizma.js']}
];
test('all ten 2018 MEB TYT physics units have a real linked experiment and existing source files',()=>{
 assert.equal(courses.length,10);
 for(const course of courses){assert.ok(course.pages.length&&course.scripts.length,course.unit);
 for(const page of course.pages)assert.ok(read(page).length>100,'missing '+page+' for '+course.unit);
 for(const script of course.scripts)assert.ok(read(script).length>200,'missing '+script+' for '+course.unit);}
 for(const html of ['tyt-fizige-giris.html','tyt-madde-ozellikleri.html','tyt-hareket-temelleri.html','tyt-mekanik-2018.html','isi-sicaklik.html','tyt-elektrostatik.html','tyt-devre.html','tyt-basinc-dalgalar.html','tyt-akiskan-dalga.html','tyt-optik-prizma.html']){
 assert.ok(root.includes('labs/'+html),'missing root navigation to '+html);
 }
});
test('AYT Newton, inclined plane and energy pages remain separate from TYT 9.3/9.4',()=>{
 const t=read('tyt-mekanik-2018.html');
 assert.match(t,/TYT Fizik/);assert.doesNotMatch(t,/src="(?:newton-lab|fizik-enerji-lab)\.js"/);
 assert.match(read('newton-hareket-yasalari.html'),/AYT FİZİK/);
 assert.match(read('is-guc-enerji.html'),/AYT FİZİK/);
});
test('direct touch inputs exist in physics scenes rather than pure slider copy',()=>{
 const interactive=['tyt-basinc-v3.js','tyt-dort-atolye.js','tyt-mekanik-2018.js','tyt-akiskan-dalga.js','tyt-optik-prizma.js'];
 for(const script of interactive){const code=read(script);assert.ok(code.includes('pointerdown')&&code.includes('pointermove')&&code.includes('setPointerCapture'),script);}
});
test('student facing gas, visible depth, capillarity and heat energy solutions respect no-numerical-rule',()=>{
 const gas=read('tyt-basinc-v3.js'),workshops=read('tyt-dort-atolye.js'),optics=read('optik-kirilma.html');
 assert.ok(!gas.includes("'İdeal model: P = '+fmt(p)"));
 assert.ok(!workshops.includes("'Kırılma açısı '+fmt(r.theta2)"));
 assert.ok(!workshops.includes("'Sol göreli seviye farkı: '+fmt("));
 assert.ok(!workshops.includes("'°C · İdeal denge: '+fmt(final)"));
 assert.ok(!optics.includes("'Gerçek derinlik: '+d+' birim · Yaklaşık görünür derinlik: '"));
});
test('2018 MEB documented scope and known iPad manual acceptance gap remain visible',()=>{
 const doc=read('TYT-2018-MEB-TAM-KAPSAM-DENETIMI.md');
 for(const word of ['9.1','9.2','9.3','9.4','9.5','9.6','10.1','10.2','10.3','10.4','iPad','Maarif Modeli','taslak','Vercel'])assert.ok(doc.includes(word),'missing '+word);
});
