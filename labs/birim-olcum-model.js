(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MeasurementUnits=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const units={mass:{mg:{factor:.001,label:'mg'},g:{factor:1,label:'g'},kg:{factor:1000,label:'kg'},ton:{factor:1e6,label:'ton'}},volume:{mL:{factor:1,label:'mL'},cm3:{factor:1,label:'cm³'},L:{factor:1000,label:'L'},dm3:{factor:1000,label:'dm³'},m3:{factor:1e6,label:'m³'}}};
function unit(type,key){const u=units[type]?.[key];if(!u)throw RangeError('Bu birim seçilen büyüklüğe ait değil');return u;}
function fromBase(type,base,key){if(!Number.isFinite(base)||base<0)throw RangeError('Ölçüm pozitif ve sonlu olmalı');return base/unit(type,key).factor;}
function convert(type,value,from,to){if(!Number.isFinite(value)||value<0)throw RangeError('Ölçüm pozitif ve sonlu olmalı');return fromBase(type,value*unit(type,from).factor,to);}
function parseAnswer(value){const s=String(value).trim();if(!/^\d+(?:[.,]\d+)?$/.test(s))return null;const n=Number(s.replace(',','.'));return Number.isFinite(n)?n:null;}
function matches(answer,expected){return Number.isFinite(answer)&&Math.abs(answer-expected)<=Math.max(1e-12,Math.abs(expected)*1e-7);}
function compare(a,b){if(a.type!==b.type)return'Kütle ve hacim farklı büyüklüklerdir; birimleri birbirine dönüştürülemez.';if(a.base!==b.base)return'Fiziksel miktar da değişti. Yalnız birimin etkisini sınamak için aynı miktarı iki birimle kaydet.';if(a.unit===b.unit)return'Aynı miktarı farklı birimle kaydet.';return{quantitySame:true,valueRatio:b.value/a.value,from:a.unit,to:b.unit};}
return{units,unit,fromBase,convert,parseAnswer,matches,compare};});
