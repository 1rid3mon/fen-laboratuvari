(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VolumeExperiment=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const names={cube:'Küp',prism:'Dikdörtgenler prizması',cylinder:'Silindir',sphere:'Küre'};
function keys(shape){if(!names[shape])throw RangeError('Geçersiz cisim');return shape==='cube'?['a']:shape==='prism'?['a','b','h']:shape==='cylinder'?['r','h']:['r'];}
function calculate(shape,d){for(const k of keys(shape))if(!Number.isFinite(d[k])||d[k]<1||d[k]>6)throw RangeError('Boyutlar 1–6 cm arasında olmalı');let volume,base,formula;
 if(shape==='cube'){base=d.a*d.a;volume=base*d.a;formula='a³';}
 if(shape==='prism'){base=d.a*d.b;volume=base*d.h;formula='a·b·h';}
 if(shape==='cylinder'){base=Math.PI*d.r*d.r;volume=base*d.h;formula='πr²h';}
 if(shape==='sphere'){base=null;volume=4*Math.PI*d.r**3/3;formula='4πr³/3';}
 return{shape,dimensions:Object.fromEntries(keys(shape).map(k=>[k,d[k]])),volume,base,formula,liters:volume/1000,ml:volume};}
function compare(a,b){if(a.shape!==b.shape)return{controlled:false,message:'Cisim türü değişti; tek boyutun etkisini ayıramazsın. Aynı türde iki cisim kaydet.'};const ratios=keys(a.shape).map(k=>b.dimensions[k]/a.dimensions[k]);const changed=keys(a.shape).filter(k=>Math.abs(b.dimensions[k]-a.dimensions[k])>1e-9);return{controlled:true,changed,ratios,similar:ratios.every(k=>Math.abs(k-ratios[0])<1e-9),factor:b.volume/a.volume};}
function task(shape,mode){const d={a:2,b:3,h:3,r:2},before=calculate(shape,d),after={...d};if(mode==='all')for(const k of keys(shape))after[k]*=2;else if(shape==='cylinder'||shape==='sphere')after.r*=2;else after.a*=2;const result=calculate(shape,after);return{before,after:result,factor:result.volume/before.volume,changed:mode==='all'?'Bütün uzunluklar 2 kat':'Yalnız '+((shape==='cylinder'||shape==='sphere')?'r':'a')+' 2 kat'};}
return{names,keys,calculate,compare,task};});
