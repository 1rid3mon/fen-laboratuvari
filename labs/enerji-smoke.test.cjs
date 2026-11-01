'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const registry={};
const U={
  names:{
    LIGHT:'Foton',H2O:'H₂O',CO2:'CO₂',O2:'O₂',ATP:'ATP',NADPH:'NADPH',NADP:'NADP⁺',
    ADP:'ADP',NH3:'NH₃',NO2:'NO₂⁻',NO3:'NO₃⁻',CHLA:'Klorofil a',CHLB:'Klorofil b',
    CAR:'Karotenoit',FE2:'Fe²⁺',H2S:'H₂S',H2:'H₂',BACT:'Bakteri'
  },
  gauss:(x,mu,sigma)=>Math.exp(-Math.pow((x-mu)/sigma,2)/2),
  plot:()=>'<svg class="chart"></svg>',
  zone:(id,title,body,done,active)=>'<button data-zone="'+id+'">'+title+' '+body+'</button>',
  progress:()=>'<div class="progress"></div>',
  option:(value,label)=>({value,label}),
  card:(title,body)=>title+' '+body,
  esc:x=>String(x)
};
const window={EnerjiLab:{registerExperiment:(id,x)=>{
  assert.ok(!registry[id],'duplicate experiment '+id);
  registry[id]=x;
},U}};
const scripts=['foto-kloroplast.js','foto-isik.js','foto-calvin.js','foto-hiz.js','foto-pigment.js','kemo-enerji.js','kemo-dongu.js'];
for(const name of scripts){
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,name),'utf8'),{window},{filename:name,timeout:3000});
}

test('nine experiments register and all render as independent states',()=>{
  assert.deepEqual(Object.keys(registry).sort(),Array.from({length:9},(_,i)=>'exp'+(i+1)));
  for(const [id,exp] of Object.entries(registry)){
    const state=exp.createState(),v=exp.render(state,U);
    assert.equal(typeof v.scene,'string',id);
    assert.ok(v.scene.length>80,id);
    assert.ok(Array.isArray(v.metrics),id);
    assert.ok(Array.isArray(v.molecules),id);
    exp.next(state,U);
    assert.equal(typeof exp.render(state,U).scene,'string',id);
  }
});

test('chloroplast matches molecules to correct compartments',()=>{
  const x=registry.exp1,s=x.createState();
  assert.notEqual(x.interact(s,'stroma','LIGHT',U).ok,true);
  assert.equal(x.interact(s,'tilakoit','LIGHT',U).ok,true);
  assert.equal(x.interact(s,'stroma','CO2',U).ok,true);
  assert.equal(Object.keys(s.items).length,2);
});

test('photosynthesis scientists and significance are in YKS-level material',()=>{
  const x=registry.exp1,s=x.createState();
  assert.match(x.render(s,U).scene,/Fotosentez.*neden|Fotosentez nerede/i);
  for(const name of ['vanhelmont','priestley','ingenhousz','engelmann','calvin']){
    x.change(s,'scientist',name,U);
    assert.ok(x.render(s,U).scene.length>500);
  }
  x.change(s,'scientist','priestley',U);
  assert.match(x.render(s,U).scene,/Priestley/);
});

test('light-dependent schema separates input and output without detailed reaction steps',()=>{
  const x=registry.exp2,s=x.createState();
  assert.notEqual(x.interact(s,'products','O2',U).ok,true);
  assert.notEqual(x.interact(s,'inputs','CO2',U).ok,true);
  assert.notEqual(x.interact(s,'products','ATP',U).ok,true);
  assert.equal(x.interact(s,'inputs','LIGHT',U).ok,true);
  assert.equal(x.interact(s,'inputs','H2O',U).ok,true);
  assert.equal(x.interact(s,'products','O2',U).ok,true);
  assert.equal(x.interact(s,'products','ATP',U).ok,true);
  assert.equal(x.interact(s,'products','NADPH',U).complete,true);
  assert.equal(Object.keys(s.placed).length,5);
  assert.notEqual(x.interact(s,'products','NADPH',U).ok,true);
  x.change(s,'tracer','18o',U);
  assert.match(x.render(s,U).scene,/¹⁸O/);
  assert.doesNotMatch(x.render(s,U).scene,/P680|P700|4e⁻/);
});

test('Calvin schema uses CO2 ATP NADPH; no 18 ATP/12 NADPH drill',()=>{
  const x=registry.exp3,s=x.createState();
  assert.equal(x.interact(s,'carbon','CO2',U).ok,true);
  assert.match(x.render(s,U).metrics[3].value,/eksik/i);
  assert.equal(x.interact(s,'energy','ATP',U).ok,true);
  assert.equal(x.interact(s,'reducing','NADPH',U).complete,true);
  assert.match(x.render(s,U).metrics[3].value,/mümkün/i);
  assert.doesNotMatch(x.render(s,U).scene,/18 ATP|12 NADPH|3-PGA|P680|P700/);
  assert.notEqual(x.interact(s,'carbon','CO2',U).ok,true);
});

test('photosynthesis model responds to CO2, light and wavelength with green dip',()=>{
  const x=registry.exp4,s=x.createState();
  const initial=Number(x.render(s,U).metrics[0].value.split(' ')[0]);
  x.change(s,'co2','50');
  const low=Number(x.render(s,U).metrics[0].value.split(' ')[0]);
  assert.ok(initial>low);
  x.change(s,'color','green');
  const green=Number(x.render(s,U).metrics[0].value.split(' ')[0]);
  x.change(s,'color','red');
  const red=Number(x.render(s,U).metrics[0].value.split(' ')[0]);
  assert.ok(red>green);
});

test('controlled science experiment validates independent variable, saves observations',()=>{
  const x=registry.exp4,s=x.createState();
  assert.equal(x.interact(s,'measure',null,U).ok,true);
  assert.equal(s.records.length,1);
  x.change(s,'light','70',U);
  assert.equal(x.interact(s,'measure',null,U).level,'success');
  assert.equal(s.records[1].good,true);
  x.change(s,'temp','34',U);x.change(s,'co2','500',U);
  assert.equal(x.interact(s,'measure',null,U).level,'warning');
  assert.equal(s.records[2].good,false);
  assert.match(x.render(s,U).scene,/LED|yapay ışık/i);
  x.change(s,'scan','co2',U);
  assert.match(x.render(s,U).metrics[3].value,/CO₂/);
});

test('light wavelength is also a selectable controlled variable',()=>{
  const x=registry.exp4,s=x.createState();
  x.interact(s,'measure',null,U);
  x.change(s,'scan','color',U);
  x.change(s,'color','green',U);
  assert.equal(x.interact(s,'measure',null,U).level,'success');
  assert.equal(s.records[1].good,true);
  assert.match(x.render(s,U).scene,/Renk kodları/);
  const previous=s.color;
  x.next(s,U);
  assert.notEqual(s.color,previous);
});

test('pigment graph responds to wavelength, selection; action spectrum separate',()=>{
  const x=registry.exp5,s=x.createState();s.wavelength=450;
  const blue=Number(x.render(s,U).metrics[1].value.split(' ')[0]);
  s.wavelength=550;
  const green=Number(x.render(s,U).metrics[1].value.split(' ')[0]);
  assert.ok(blue>green);
  x.interact(s,'pigments','CAR',U);
  assert.equal(s.pigments.length,2);
  x.interact(s,'pigments','CHLA',U);
  assert.deepEqual(Array.from(s.pigments),['CAR']);
  assert.match(String(x.render(s,U).metrics[3].value),/modellenmiyor/i);
  assert.match(x.render(s,U).scene,/Engelmann/i);
  assert.match(x.render(s,U).scene,/etki spektrumu/i);
  x.change(s,'source','white',U);
  assert.equal(x.render(s,U).metrics[2].value,'Beyaz');
});

test('aerobic chemo experiment enforces molecule order without double counting',()=>{
  const x=registry.exp6,s=x.createState();
  assert.notEqual(x.interact(s,'oxidizer','O2',U).ok,true);
  assert.equal(s.oxidations,0);
  assert.notEqual(x.interact(s,'energy','CO2',U).ok,true);
  assert.equal(x.interact(s,'energy','NH3',U).ok,true);
  assert.equal(x.interact(s,'oxidizer','O2',U).ok,true);
  assert.equal(s.oxidations,1);
  assert.notEqual(x.interact(s,'oxidizer','O2',U).ok,true);
  assert.equal(s.oxidations,1);
  assert.equal(x.interact(s,'carbon','CO2',U).ok,true);
  assert.equal(s.food,1);
  assert.notEqual(x.interact(s,'carbon','CO2',U).ok,true);
  assert.equal(s.food,1);
});

test('chemosynthesis automatic steps visit five distinct organisms and stop',()=>{
  const x=registry.exp6,s=x.createState();
  for(let k=0;k<5;k++){
    for(let i=0;i<3;i++)x.next(s,U);
    if(k<4)x.next(s,U);
  }
  assert.equal(s.visited.length,5);
  assert.equal(new Set(s.visited).size,5);
  assert.equal(s.oxidations,5);
  assert.equal(s.food,5);
  assert.equal(x.next(s,U).complete,true);
});

test('oxygenic and anoxygenic photoautotrophs differ from chemotrophs',()=>{
  const x=registry.exp7,s=x.createState();
  for(const [mode,energy,donor] of [
    ['photo','LIGHT','H2O'],['cyan','LIGHT','H2O'],
    ['purple','LIGHT','H2S'],['chemo','H2S','H2S']
  ]){
    x.change(s,'mode',mode,U);
    assert.equal(x.interact(s,'energy',energy,U).ok,true);
    assert.equal(x.interact(s,'carbon','CO2',U).ok,true);
    assert.equal(x.interact(s,'donor',donor,U).ok,true);
  }
  assert.equal(s.visited.length,4);
  assert.equal(x.next(s,U).complete,true);
  x.change(s,'mode','purple',U);
  assert.notEqual(x.interact(s,'energy','H2S',U).ok,true);
  assert.match(x.render(s,U).insight,/elektron|hidrojen/i);
  assert.match(x.render(s,U).metrics[3].value,/O₂ açığa çıkmaz/);
});

test('nitrit first, nitrat second, plant absorption third',()=>{
  const x=registry.exp8,s=x.createState();
  assert.notEqual(x.interact(s,'nitrat','NO2',U).ok,true);
  for(let i=0;i<3;i++)x.next(s,U);
  assert.equal(s.step,3);
  assert.match(x.render(s,U).insight,/denitrifikasyon/i);
});

test('dark eco model, O2 and carbon depletion, industrial application select',()=>{
  const x=registry.exp9,s=x.createState();
  assert.equal(s.light,'dark');
  x.interact(s,'test',null,U);
  assert.equal(s.last,true);
  x.change(s,'oxygen','no',U);
  x.interact(s,'test',null,U);
  assert.equal(s.last,false);
  x.change(s,'oxygen','yes',U);
  x.change(s,'industry','mining',U);
  assert.match(x.render(s,U).scene,/Biyomadencilik/);
  x.change(s,'industry','water',U);
  assert.match(x.render(s,U).scene,/denitrifikasyon/i);
});

test('curriculum boundaries and responsive standalone route',()=>{
  const html=fs.readFileSync(path.join(__dirname,'enerji-lab.html'),'utf8');
  assert.match(html,/enerji-core\.js/);
  for(const file of ['foto-kloroplast','foto-isik','foto-calvin','foto-hiz','foto-pigment','kemo-enerji','kemo-dongu'])assert.ok(html.includes(file+'.js'));
  const css=fs.readFileSync(path.join(__dirname,'enerji-lab.css'),'utf8');
  assert.match(css,/@media/);
  assert.match(css,/focus-visible/);
  const light=registry.exp2.render(registry.exp2.createState(),U);
  const calvin=registry.exp3.render(registry.exp3.createState(),U);
  assert.doesNotMatch(light.scene+calvin.scene,/P680|P700|18 ATP|12 NADPH/);
});