(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DensityExperiment=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const MATERIALS={aluminum:{name:'Alüminyum',density:2.7},iron:{name:'Demir',density:7.8},copper:{name:'Bakır',density:8.9}};
const G={left:650,right:850,top:170,bottom:420,capacity:500,pxPerMl:.5,sampleWidth:100};
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
function sample(material,volume){if(!MATERIALS[material]||!Number.isFinite(volume)||volume<25||volume>150)throw RangeError('Geçersiz numune');return{material,volume,mass:MATERIALS[material].density*volume,height:volume,heightCm:volume/10,width:G.sampleWidth};}
function immersion({x,y,volume,water}){if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(water)||water<100||water>250)throw RangeError('Geçersiz düzenek');const o=sample('aluminum',volume);const inside=x>=G.left&&x+o.width<=G.right&&y>=G.top&&y+o.height<=G.bottom;
 let lo=G.top,hi=G.bottom;for(let i=0;i<60;i++){const level=(lo+hi)/2,sub=inside?volume*clamp((y+o.height-level)/o.height,0,1):0;const reading=(G.bottom-level)/G.pxPerMl;if(reading>water+sub)lo=level;else hi=level;}
 const level=(lo+hi)/2,displaced=inside?volume*clamp((y+o.height-level)/o.height,0,1):0;return{inside,level,displaced,reading:water+displaced,full:inside&&Math.abs(displaced-volume)<1e-7,overflow:water+displaced>G.capacity};}
function onBalance(x,y,volume){return x>=290&&x+G.sampleWidth<=530&&Math.abs(y+volume-350)<1;}
function densityFromReadings(mass,initial,final){if(![mass,initial,final].every(Number.isFinite)||mass<=0||final<=initial)throw RangeError('Önce geçerli kütle ve hacim ölç');return mass/(final-initial);}
function compare(a,b){if(a.material!==b.material)return'Değişen malzeme: yalnız hacmin etkisi ayrılamaz.';if(Math.abs(a.volume-b.volume)<1e-7)return'Hacimler aynı: farklı hacimde ikinci bir numune ölç.';const mr=b.mass/a.mass,vr=b.volume/a.volume;return{massRatio:mr,volumeRatio:vr,densityA:a.mass/a.volume,densityB:b.mass/b.volume};}
return{MATERIALS,G,clamp,sample,immersion,onBalance,densityFromReadings,compare};});
