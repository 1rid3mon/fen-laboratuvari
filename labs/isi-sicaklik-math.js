/* TYT 2018 MEB 9.5: qualitative thermal simulations.
 * Numerical material data are used ONLY internally to preserve correct trend.
 * 9.5.5.1 explicitly excludes numerical thermal-expansion exercises.
 */
(function(w){'use strict';
const alpha=Object.freeze({celik:12e-6,aluminyum:23e-6,pirinc:19e-6});
const beta=Object.freeze({alkol:1.1e-3,yag:7e-4,civa:1.8e-4});
const metals=Object.freeze({celik:'Çelik',aluminyum:'Alüminyum',pirinc:'Pirinç'});
const liquids=Object.freeze({alkol:'Alkol',yag:'Yağ',civa:'Cıva (yalnız kuramsal)'});
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const finite=(...x)=>{if(x.some(n=>!Number.isFinite(n)))throw RangeError('Finite parameters required');};
const relative=(temp,reference=20)=>temp-reference;
function rod({material='aluminyum',temperature=20,reference=20}){
 finite(temperature,reference);if(!alpha[material])throw RangeError('material');
 const fraction=1+alpha[material]*relative(temperature,reference);
 if(fraction<=0)throw RangeError('temperature beyond linear approximation');
 return {fraction,deltaFraction:fraction-1,trend:temperature>reference?'genlesme':temperature<reference?'buzulme':'ayni',alpha:alpha[material]};
}
function ring({ballTemp=20,ringTemp=20,ballMaterial='celik',ringMaterial='pirinc',initialBall=50,initialHole=50.055}){
 finite(ballTemp,ringTemp,initialBall,initialHole);if(initialBall<=0||initialHole<=0)throw RangeError('dimensions');
 const diameter=initialBall*rod({material:ballMaterial,temperature:ballTemp}).fraction;
 const opening=initialHole*rod({material:ringMaterial,temperature:ringTemp}).fraction;
 return {diameter,opening,clearance:opening-diameter,passes:diameter<=opening+1e-10};
}
function hole({material='aluminyum',temperature=20}){
 const r=rod({material,temperature});return {fraction:r.fraction,trend:r.trend};
}
function liquid({substance='alkol',temperature=20}){
 finite(temperature);if(!beta[substance])throw RangeError('liquid');if(temperature<0&&substance==='yag')throw RangeError('not simulated');
 const fraction=1+beta[substance]*(temperature-20);
 return {fraction,trend:temperature>20?'genlesme':temperature<20?'buzulme':'ayni'};
}
function water({temperature=4}){
 finite(temperature);if(temperature<0||temperature>10)throw RangeError('liquid water only, 0..10 °C');
 // local smooth illustrative approximation; maximum density at ~4 C (not a numerical lesson)
 const density=999.972-.007*(temperature-4)**2;
 return {density,relativeVolume:999.972/density,trend:temperature===4?'en_yogun':temperature<4?'isitinca_buzulur':'isitinca_genlesir'};
}
function rail({temperature=20,material='celik'}){
 const s=rod({material,temperature});return {fraction:s.fraction,trend:s.trend,gapTrend:temperature>20?'daralir':temperature<20?'genisler':'ayni'};
}
function bimetal({temperature=20,high='aluminyum',low='celik'}){
 finite(temperature);if(alpha[high]<=alpha[low])throw RangeError('high coefficient must exceed low');
 return {bend:(alpha[high]-alpha[low])*(temperature-20),direction:temperature>20?'dusuk_katsayili_tarafa':temperature<20?'yuksek_katsayili_tarafa':'duz'};
}
function equilibrium({hot=80,cold=20,massHot=1,massCold=1,specificHot=1,specificCold=1,progress=0}){
 finite(hot,cold,massHot,massCold,specificHot,specificCold,progress);
 if(hot<cold||massHot<=0||massCold<=0||specificHot<=0||specificCold<=0)throw RangeError('parameters');
 const weightH=massHot*specificHot,weightC=massCold*specificCold,target=(hot*weightH+cold*weightC)/(weightH+weightC),p=clamp(progress,0,1);
 return {hotNow:hot+(target-hot)*p,coldNow:cold+(target-cold)*p,target,progress:p};
}
function heatCapacity({mass=1,specific=1,heat=1}){
 finite(mass,specific,heat);if(mass<=0||specific<=0||heat<0)throw RangeError('parameters');
 return {temperatureRise:heat/(mass*specific)};
}
function conduction({thickness=2,material='wood',area=1,temperatureDifference=40}){
 const conductivity={wood:.15,brick:.6,metal:60,foam:.04};
 finite(thickness,area,temperatureDifference);if(thickness<=0||area<=0||!conductivity[material])throw RangeError('parameters');
 return {relativeRate:conductivity[material]*area*temperatureDifference/thickness};
}
function phase({progress=0}){
 finite(progress);const p=clamp(progress,0,1);
 if(p<.2)return {stage:'buz',temperature:-20+100*p};
 if(p<.4)return {stage:'erime',temperature:0};
 if(p<.65)return {stage:'su',temperature:(p-.4)*400};
 if(p<.85)return {stage:'kaynama',temperature:100};
 return {stage:'buhar',temperature:100+(p-.85)*135};
}
function celsius({c=20}){finite(c);if(c< -273.15)throw RangeError('absolute zero');return {C:c,F:1.8*c+32,K:c+273.15};}
w.IsiSicaklikMath=Object.freeze({alpha,beta,metals,liquids,rod,ring,hole,liquid,water,rail,bimetal,equilibrium,heatCapacity,conduction,phase,celsius});
})(window);
