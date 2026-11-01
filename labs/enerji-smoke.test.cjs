'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const registry={};
const U={
names:{LIGHT:'Foton',H2O:'H₂O',CO2:'CO₂',O2:'O₂',ATP:'ATP',NADPH:'NADPH',NADP:'NADP⁺',ADP:'ADP',NH3:'NH₃',NO2:'NO₂⁻',NO3:'NO₃⁻',CHLA:'Klorofil a',CHLB:'Klorofil b',CAR:'Karotenoit'},
gauss:(x,mu,sigma)=>Math.exp(-Math.pow((x-mu)/sigma,2)/2),
plot:()=>'<svg></svg>',zone:()=>'<button></button>',progress:()=>'<div></div>',
option:(value,label)=>({value,label}),card:(title,body)=>title+body,esc:x=>String(x)
};
const window={EnerjiLab:{registerExperiment:(id,x)=>{assert.ok(!registry[id]);registry[id]=x;},U}};
for(const name of ['foto-kloroplast.js','foto-isik.js','foto-calvin.js','foto-hiz.js','foto-pigment.js','kemo-enerji.js','kemo-dongu.js']){
vm.runInNewContext(fs.readFileSync(path.join(__dirname,name),'utf8'),{window},{filename:name,timeout:3000});
}
test('nine experiments register, render and advance',()=>{
assert.deepEqual(Object.keys(registry).sort(),Array.from({length:9},(_,i)=>'exp'+(i+1)));
for(const [id,exp] of Object.entries(registry)){
const state=exp.createState(),v=exp.render(state,U);
assert.equal(typeof v.scene,'string',id);
assert.ok(Array.isArray(v.metrics),id);
assert.ok(Array.isArray(v.molecules),id);
exp.next(state,U);
assert.equal(typeof exp.render(state,U).scene,'string',id);
}
});
test('chloroplast location checks',()=>{
const x=registry.exp1,s=x.createState();
assert.equal(x.interact(s,'stroma','LIGHT',U).ok,undefined);
assert.equal(x.interact(s,'tilakoit','LIGHT',U).ok,true);
assert.equal(x.interact(s,'stroma','CO2',U).ok,true);
});
test('PSII, photolysis, PSI, NADPH, ATP required in sequence',()=>{
const x=registry.exp2,s=x.createState();
assert.equal(x.interact(s,'psi','LIGHT',U).ok,undefined);
for(const [z,m] of [['psii','LIGHT'],['psii','H2O'],['psi','LIGHT'],['psi','NADP'],['atp','ADP']])assert.equal(x.interact(s,z,m,U).ok,true);
assert.equal(s.i,5);assert.match(x.render(s,U).metrics[1].value,/H₂O/);
});
test('six CO2 and 18 ATP and 12 NADPH required; no instant glucose',()=>{
const x=registry.exp3,s=x.createState();
x.interact(s,'carbon','CO2',U);assert.equal(x.render(s,U).metrics[3].value,'0');
for(let i=1;i<6;i++)x.interact(s,'carbon','CO2',U);
for(let i=0;i<6;i++)x.interact(s,'energy','ATP',U);
for(let i=0;i<5;i++)x.interact(s,'reducing','NADPH',U);
assert.equal(x.render(s,U).metrics[3].value,'0');
assert.equal(x.interact(s,'reducing','NADPH',U).complete,true);
assert.equal(x.render(s,U).metrics[3].value,'1');
assert.equal(x.interact(s,'carbon','CO2',U).ok,undefined);
});
test('CO2 and light color change modeled rate; green weaker than red',()=>{
const x=registry.exp4,s=x.createState();
const baseline=Number(x.render(s,U).metrics[0].value.split(' ')[0]);
x.change(s,'co2','50');
const low=Number(x.render(s,U).metrics[0].value.split(' ')[0]);assert.ok(baseline>low);
x.change(s,'color','green');const green=Number(x.render(s,U).metrics[0].value.split(' ')[0]);
x.change(s,'color','red');const red=Number(x.render(s,U).metrics[0].value.split(' ')[0]);assert.ok(red>green);
});
test('pigment absorption shows green dip; independent selection',()=>{
const x=registry.exp5,s=x.createState();s.wavelength=450;
const blue=Number(x.render(s,U).metrics[1].value.split(' ')[0]);
s.wavelength=550;const green=Number(x.render(s,U).metrics[1].value.split(' ')[0]);assert.ok(blue>green);
x.interact(s,'pigments','CAR',U);assert.equal(s.pigments.length,2);
x.change(s,'source','white');assert.equal(x.render(s,U).metrics[2].value,'Beyaz');
});
test('chemosynthesis cannot skip stages or recount same oxidation',()=>{
const x=registry.exp6,s=x.createState();
assert.equal(x.interact(s,'oxidizer','O2',U).ok,undefined);assert.equal(s.oxidations,0);
x.interact(s,'energy','NH3',U);x.interact(s,'oxidizer','O2',U);assert.equal(s.oxidations,1);
x.interact(s,'oxidizer','O2',U);assert.equal(s.oxidations,1);
x.interact(s,'carbon','CO2',U);assert.equal(s.food,1);
x.interact(s,'carbon','CO2',U);assert.equal(s.food,1);
});
test('comparison, nitrification and dark ecosystem',()=>{
const x=registry.exp7,s=x.createState();
assert.equal(x.interact(s,'energy','LIGHT',U).ok,true);
assert.equal(x.interact(s,'carbon','CO2',U).complete,true);
x.change(s,'mode','chemo');assert.equal(x.interact(s,'energy','H2S',U).ok,true);
const y=registry.exp8,t=y.createState();
assert.equal(y.interact(t,'nitrat','NO2',U).ok,undefined);
y.next(t,U);y.next(t,U);y.next(t,U);assert.equal(t.step,3);
const z=registry.exp9,q=z.createState();assert.equal(q.light,'dark');
z.interact(q,'test',null,U);assert.equal(q.last,true);
z.change(q,'oxygen','no');z.interact(q,'test',null,U);assert.equal(q.last,false);
});
test('separate HTML route includes all modules',()=>{
const html=fs.readFileSync(path.join(__dirname,'enerji-lab.html'),'utf8');
assert.match(html,/enerji-core\.js/);
for(const file of ['foto-kloroplast','foto-isik','foto-calvin','foto-hiz','foto-pigment','kemo-enerji','kemo-dongu'])assert.ok(html.includes(file+'.js'));
assert.match(fs.readFileSync(path.join(__dirname,'enerji-lab.css'),'utf8'),/@media/);
});