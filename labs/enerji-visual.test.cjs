'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const Visual=require('./enerji-visual.js');
const reg={},W={EnerjiLab:{registerExperiment:(id,config)=>{reg[id]=config;},U:{
 names:{LIGHT:'Işık',H2O:'H₂O',CO2:'CO₂',O2:'O₂',ATP:'ATP',ADP:'ADP + Pi',NADPH:'NADPH',NADP:'NADP⁺',NH3:'NH₃',NO2:'NO₂⁻',NO3:'NO₃⁻',H2S:'H₂S',FE2:'Fe²⁺',H2:'H₂'},
 esc:x=>String(x),zone:(id,t)=>'<button data-zone="'+id+'">'+t+'</button>',
 card:(t,c)=>t+' '+c,progress:()=>'<div></div>',
 plot:()=>'<svg class="chart"></svg>',option:(value,label)=>({value,label}),
 gauss:(x,mu,sigma)=>Math.exp(-Math.pow((x-mu)/sigma,2)/2)
}}};
for(const f of ['foto-kloroplast.js','foto-isik.js','foto-calvin.js','foto-hiz.js','foto-pigment.js','kemo-enerji.js','kemo-dongu.js'])vm.runInNewContext(read(f),{window:W},{filename:f});
const view=(id,state)=>reg[id].render(state,W.EnerjiLab.U);
test('nine distinct living stages render real SVG and direct hit zones',()=>{
 assert.deepEqual(Visual.sceneIds,['exp1','exp2','exp3','exp4','exp5','exp6','exp7','exp8','exp9']);
 for(let i=1;i<=9;i++){
  const id='exp'+i,s=reg[id].createState(),html=Visual.render(id,s,view(id,s));
  assert.match(html,/<svg class="bio-stage-svg"/,id);
  assert.match(html,/data-zone="/,id);
  assert.match(html,/<(rect|path|ellipse|circle)/,id);
  assert.match(html,/Molekül|çizim|temsili|gerçek/i,id);
  assert.ok(html.length>900,id+' nontrivial physical drawing');
 }
});
test('chloroplast and thylakoid visibly respond to correct molecule placement',()=>{
 const a=reg.exp1,b=reg.exp2,s=a.createState(),t=b.createState();
 const first=Visual.render('exp1',s,view('exp1',s));
 a.interact(s,'tilakoit','LIGHT',W.EnerjiLab.U);a.interact(s,'tilakoit','H2O',W.EnerjiLab.U);
 assert.notEqual(Visual.render('exp1',s,view('exp1',s)),first);
 const initial=Visual.render('exp2',t,view('exp2',t));
 for(const [mol,zone] of [['LIGHT','inputs'],['H2O','inputs'],['ADP','inputs'],['NADP','inputs']])assert.equal(b.interact(t,zone,mol,W.EnerjiLab.U).ok,true);
 assert.notEqual(Visual.render('exp2',t,view('exp2',t)),initial);
});
test('Calvin animation depends on three separate real inputs (no fake stoichiometry)',()=>{
 const exp=reg.exp3,s=exp.createState(),start=Visual.render('exp3',s,view('exp3',s));
 for(const [mol,zone] of [['CO2','carbon'],['ATP','energy'],['NADPH','reducing']])exp.interact(s,zone,mol,W.EnerjiLab.U);
 const end=Visual.render('exp3',s,view('exp3',s));
 assert.notEqual(start,end);assert.match(end,/temel girdiler hazır/);
 assert.doesNotMatch(end,/18 ATP|12 NADPH|1 CO₂ = 1 glikoz/);
});
test('photosynthesis rate scene changes oxygen observation and lamp with environmental input',()=>{
 const exp=reg.exp4,s=exp.createState(),a=Visual.render('exp4',s,view('exp4',s));
 exp.change(s,'light','0',W.EnerjiLab.U);
 const dark=Visual.render('exp4',s,view('exp4',s));
 assert.notEqual(dark,a);assert.match(dark,/data-vcontrol="light"/);
 assert.match(dark,/Bağıl fotosentez hızı: 0/);
 exp.change(s,'light','100',W.EnerjiLab.U);assert.notEqual(dark,Visual.render('exp4',s,view('exp4',s)));
});
test('pigment spectral marker follows wavelength and selection, not static illustration',()=>{
 const exp=reg.exp5,s=exp.createState(),a=Visual.render('exp5',s,view('exp5',s));
 s.wavelength=680;const b=Visual.render('exp5',s,view('exp5',s));
 assert.notEqual(a,b);assert.match(b,/data-vcontrol="wavelength"/);
 exp.interact(s,'pigments','CHLB',W.EnerjiLab.U);
 assert.notEqual(b,Visual.render('exp5',s,view('exp5',s)));
});
test('chemosynthesis, producer comparisons and nitrification stages follow actual registered experiment state',()=>{
 for(const id of ['exp6','exp7','exp8']){
  const exp=reg[id],s=exp.createState(),before=Visual.render(id,s,view(id,s));
  exp.next(s,W.EnerjiLab.U);
  assert.notEqual(before,Visual.render(id,s,view(id,s)),id);
 }
});
test('ecosystem diagram switches on O2 and CO2 experiment conditions, shows result after measurement',()=>{
 const exp=reg.exp9,s=exp.createState(),start=Visual.render('exp9',s,view('exp9',s));
 assert.match(start,/data-vtoggle="oxygen"/);assert.match(start,/data-vtoggle="carbon"/);
 exp.change(s,'oxygen','no');const no=Visual.render('exp9',s,view('exp9',s));assert.notEqual(start,no);
 exp.interact(s,'test',null,W.EnerjiLab.U);
 assert.match(Visual.render('exp9',s,view('exp9',s)),/üretim yok/i);
});
test('Safari page keeps original syllabus and all core model scripts',()=>{
 const html=read('enerji-lab.html');
 assert.match(html,/AYT BİYOLOJİ/);assert.match(html,/2018 MEB/);
 assert.match(html,/enerji-visual\.js/);
 assert.ok(html.indexOf('enerji-core.js')<html.indexOf('enerji-visual.js'));
 assert.match(read('enerji-lab.css'),/prefers-reduced-motion/);
});
