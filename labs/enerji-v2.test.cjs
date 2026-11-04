'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const file=p=>fs.readFileSync(path.join(__dirname,p),'utf8'),V=require('./enerji-visual.js');
function registry(){
 const registered={};const U={
 esc:x=>String(x),zone:(id,title)=>'<button data-zone="'+id+'">'+title+'</button>',
 card:(name,text)=>name+': '+text,progress:()=>'<div class="progress"/>',
 plot:()=>'<svg/>',option:(value,label)=>({value,label}),names:{LIGHT:'Işık',H2O:'Su',CO2:'CO₂',O2:'O₂',ADP:'ADP',NADP:'NADP⁺',ATP:'ATP',NADPH:'NADPH'},
 gauss:(x,center,sigma)=>Math.exp(-Math.pow((x-center)/sigma,2)/2)
 };
 const ctx=vm.createContext({window:{EnerjiLab:{registerExperiment:(id,c)=>registered[id]=c,U}},console});
 for(const p of ['foto-kloroplast.js','foto-isik.js','foto-calvin.js','foto-hiz.js','foto-pigment.js','kemo-enerji.js','kemo-dongu.js'])vm.runInContext(file(p),ctx);
 return{registered,U};
}
test('new V2.1 is an obvious and unique iPad web page, not merely the old HTML in cache',()=>{
 const html=file('enerji-lab-v2.html'),old=file('enerji-lab.html'),main=file('../index.html');
 assert.match(html,/CANLI SİMÜLASYON V2\.1/);
 assert.match(html,/class="lab-v2"/);
 assert.match(html,/enerji-lab-v2\.css\?v=bio-v21/);
 assert.match(html,/enerji-visual\.js\?v=bio-v21/);
 assert.match(html,/CANLI DENEY ALANI/);
 assert.match(main,/href="labs\/enerji-lab-v2\.html"/);
 assert.match(old,/enerji-lab-v2\.html/);
 assert.match(old,/class="lab-v2"/);
 assert.doesNotMatch(html,/maarif-modeli-taslak/);
});
test('V2.1 creates first-screen wide interactive navigation, large stage and nearby molecular dock',()=>{
 const css=file('enerji-lab-v2.css');
 for(const selector of ['.lab-v2 .app{display:block','.lab-v2 .nav #experiment-nav{display:flex','.lab-v2 .workspace{grid-template-columns:','.lab-v2 .bio-stage-svg{','.lab-v2 .palette{','.lab-v2 .scene{min-height:510px']){
 assert.ok(css.includes(selector),'missing '+selector);
 }
 assert.match(css,/@media\(max-width:820px\)/);
 assert.match(css, /prefers-reduced-motion/);
});
test('chloroplast only animates product flow after both light and water are correctly matched',()=>{
 const {registered,U}=registry(),s=registered.exp1.createState();
 const before=V.render('exp1',s,registered.exp1.render(s,U));
 assert.doesNotMatch(before,/class="bio-transfer"/);
 assert.equal(registered.exp1.interact(s,'tilakoit','LIGHT',U).ok,true);
 const one=V.render('exp1',s,registered.exp1.render(s,U));
 assert.doesNotMatch(one,/class="bio-transfer"/);
 assert.equal(registered.exp1.interact(s,'tilakoit','H2O',U).ok,true);
 const after=V.render('exp1',s,registered.exp1.render(s,U));
 assert.match(after,/class="bio-transfer"/);
 assert.match(after,/Suyun fotolizi/);
 assert.notEqual(after,before);
});
test('light-dependent and Calvin animations only appear for biologically valid complete input sets',()=>{
 const {registered,U}=registry();
 const l=registered.exp2,s=l.createState();
 assert.doesNotMatch(V.render('exp2',s,l.render(s,U)),/class="bio-transfer"/);
 for(const [mol,z] of [['LIGHT','inputs'],['H2O','inputs'],['ADP','inputs'],['NADP','inputs']])assert.equal(l.interact(s,z,mol,U).ok,true);
 assert.match(V.render('exp2',s,l.render(s,U)),/class="bio-transfer"/);
 const c=registered.exp3,v=c.createState();
 for(const [mol,z] of [['CO2','carbon'],['ATP','energy'],['NADPH','reducing']])assert.equal(c.interact(v,z,mol,U).ok,true);
 assert.match(V.render('exp3',v,c.render(v,U)),/Organik besin/);
 assert.doesNotMatch(V.render('exp3',v,c.render(v,U)),/18 ATP|12 NADPH/);
});
test('relative oxygen representation stops at zero light rather than producing fake bubbles',()=>{
 const {registered,U}=registry(),exp=registered.exp4,s=exp.createState();
 exp.change(s,'light','0',U);
 const dark=V.render('exp4',s,exp.render(s,U));
 assert.match(dark,/IŞIK YOK/);
 assert.doesNotMatch(dark,/class="bio-transfer"/);
 exp.change(s,'light','100',U);
 const lit=V.render('exp4',s,exp.render(s,U));
 assert.match(lit,/class="bio-transfer"/);
});
test('selected aerobic chemo experiment only runs transfer after valid oxygen/carbon test',()=>{
 const {registered,U}=registry(),exp=registered.exp9,s=exp.createState();
 exp.interact(s,'test',null,U);
 assert.match(V.render('exp9',s,exp.render(s,U)),/class="bio-transfer"/);
 exp.change(s,'oxygen','no',U);exp.interact(s,'test',null,U);
 assert.doesNotMatch(V.render('exp9',s,exp.render(s,U)),/class="bio-transfer"/);
});
