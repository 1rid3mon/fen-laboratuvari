/* TYT 2018 MEB 9.5 — tangible, animated heat/temperature experiments.
 * Expansion geometry is VISUALLY EXAGGERATED; never presents prohibited
 * numerical thermal-expansion calculations to learners.
 */
(function(w){'use strict';const M=w.IsiSicaklikMath,U=w.MekanikUI;if(!M||!U)return;
const u=U.U,f=u.fmt,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const c=(id,label,min,max,step,unit='')=>({id,label,min,max,step,unit});
const TEMP=c('temp','Sıcaklık',-20,160,5,'°C'),BALLTEMP=c('ballTemp','Kürenin sıcaklığı',-20,300,10,'°C'),RINGTEMP=c('ringTemp','Halkanın sıcaklığı',-20,300,10,'°C');
const material=i=>['celik','aluminyum','pirinc'][i],matName=i=>M.metals[material(i)];
const liquidName=i=>['alkol','yag','civa'][i],liqLabel=i=>M.liquids[liquidName(i)];
const line=(x1,y1,x2,y2,color='#82dccc',thickness=4)=>u.line(x1,y1,x2,y2,color,thickness);
const txt=(x,y,t,color='#daecf4',size=17)=>u.text(x,y,t,color,size);
const rect=(x,y,ww,hh,fill='#345b75',stroke='#c3e8ef',r=8)=>'<rect x="'+x+'" y="'+y+'" width="'+Math.max(1,ww)+'" height="'+Math.max(1,hh)+'" rx="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
const dot=(x,y,r=8,color='#f5c98a',stroke='#f7ead4')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+color+'" stroke="'+stroke+'" stroke-width="2"/>';
const badge=(x,y,t)=>'<g transform="translate('+x+' '+y+')">'+rect(-58,-18,116,35,'#1b5060','#5fdbbf',16)+txt(-44,6,t,'#e7fff7',14)+'</g>';
const thermometer=(x,temperature,lo=-20,hi=160,drag='temp')=>{
 const fraction=clamp((temperature-lo)/(hi-lo),0,1),fill=200*fraction;
 return rect(x-17,74,34,225,'#173951','#a7d7e1',16)+rect(x-8,278-fill,16,fill+17,'#f5a16f','#f5a16f',5)+dot(x,298,25,'#f5a16f')+
 '<g data-drag="'+drag+'" aria-label="Termometreyi sürükle">'+rect(x-39,55,78,276,'transparent','transparent',0)+'</g>'+
 txt(x-53,46,f(temperature)+' °C','#f6d39f',17);
};
const flame=(x,y,n=3)=>{let b='';for(let i=0;i<n;i++)b+='<path d="M'+(x+i*25)+' '+y+' Q'+(x+i*25-16)+' '+(y-31)+' '+(x+i*25+6)+' '+(y-59)+' Q'+(x+i*25+23)+' '+(y-28)+' '+(x+i*25+15)+' '+y+'Z" fill="#ffad72" stroke="#ffc38c" stroke-width="1"/>';return b};
const snow=(x,y)=>txt(x,y,'❄','#afe4f8',29);
const rule=()=>line(90,285,700,285,'#547b93',2)+Array.from({length:15},(_,i)=>line(100+i*40,282,100+i*40,295,'#688fa6',1)).join('');
const svg=(body,desc)=>u.svg(body,desc);
const motion=(key,min,max,speed,step)=>({key,min,max,speed,step});
const observations={
 rod:(p,o)=>o.trend==='genlesme'?'Isıtılan çubuk uzar; soğutulan çubuk büzülür. Farklı metaller aynı ısıtılmada farklı miktarda genleşir.':o.trend==='buzulme'?'Çubuk soğutulduğu için kısalıyor. Genleşme yalnız ısınma değil, soğumada büzülme de demektir.':'Başlangıç sıcaklığında çubuğun boyu referans alınır.',
 ring:(p,o)=>o.passes?'Küre halkadan geçiyor. Halkanın deliği de ısınırken büyür; küre ve halka ayrı ayrı ısıtılabilir.':'Küre halkanın deliğinden geçemiyor. Küreyi soğutmayı veya halkayı ısıtmayı dene.',
 hole:()=>'Levhanın tamamı büyürken içindeki boşluk da büyür. Delik, içine metal doluyormuş gibi daralmaz.',
 liquid:()=>'Isıtılan sıvının hacmi genel olarak artar ve ince borudaki seviyesi yükselir. Farklı sıvılar farklı miktarda genleşir.',
 water:(p,o)=>p.temp<4?'Su 0 °C’den 4 °C’ye ısıtılırken büzülür ve yoğunluğu artar. En yoğun hâli yaklaşık 4 °C’dedir.':p.temp===4?'Sıvı suyun yoğunluğu yaklaşık 4 °C’de en büyüktür. Buz daha düşük yoğunluklu olduğu için suda yüzer.':'Su 4 °C’nin üzerinde ısıtıldıkça genleşir ve yoğunluğu azalır. Buzun yüzmesi bu özel davranışla ilişkilidir.',
 rail:(p,o)=>o.gapTrend==='daralir'?'Isınan rayın boyu arttığı için ayrılan boşluk küçülür. Yeterli genleşme payı bırakılmazsa ray eğilebilir.':'Soğuyan ray kısalır; ek yerindeki boşluk büyüme eğilimindedir.',
 bimetal:(p,o)=>p.temp>20?'Isıtılınca fazla genleşen metal, dış tarafta kalacak şekilde şerit eğilir. Bu etki termostatlarda kullanılır.':p.temp<20?'Soğutulunca bimetal ters yönde eğilir.':'İki metal referans sıcaklığında düz kabul edilir.',
 equilibrium:()=>'Isı kendiliğinden sıcak olandan soğuk olana aktarılır. Yalıtılmış sistemde sıcaklıklar birbirine yaklaşır; hesaplama zorunlu değildir.',
 capacity:()=>'Aynı ısı aktarımında öz ısısı veya kütlesi büyük olan maddenin sıcaklık değişimi daha küçüktür.',
 transfer:()=>'İletim, maddeyle temas yoluyla; taşınım, akışkanın hareketiyle; ışıma, elektromanyetik dalgalarla gerçekleşir. Yalıtım ve kalınlık etkisini deneyle gözlemle.',
 phase:()=>'Saf madde hâl değiştirirken verilen enerji, sıcaklığı yükseltmek yerine hâl değişiminde kullanılır. Erime ve kaynama süresince sıcaklık sabit kalır (sabit basınç).',
 thermometer:()=>'Celsius, Kelvin ve Fahrenheit aynı sıcaklığın farklı ölçekleridir. Kelvin mutlak sıfırdan başlar.'
};
const sections=[
{id:'rod',tab:'Metal çubuk',title:'Metal çubuğu gerçekten uzat ve kısalt',sceneTitle:'Katılarda genleşme ve büzülme',
intro:'Termometreyi sürükle veya ısıtma düğmesini çalıştır. Çubuğun sağ ucu yer değiştirsin; metal cinsini değiştirip karşılaştır.',
defaults:{temp:20,material:1},controls:[TEMP,c('material','0 Çelik · 1 Alüminyum · 2 Pirinç',0,2,1,'')],
model:p=>M.rod({material:material(p.material),temperature:p.temp}),
scene:(p,o)=>{const length=340+clamp((o.fraction-1)/M.alpha.aluminyum*1.15,-100,180);
const x=155,y=175,end=x+length;
const b=rule()+rect(x,y-23,length,46,'#76a8bf','#b9e2eb',5)+
 Array.from({length:7},(_,i)=>line(x+20+i*(length-40)/7,y-15,x+20+i*(length-40)/7,y+15,'#bad8e5',2)).join('')+
 dot(end,y,12,'#ffd497')+'<rect data-drag="temp" x="'+(end-27)+'" y="'+(y-52)+'" width="54" height="104" fill="transparent"/>'+
 line(155,107,155,256,'#e0eaf0',2)+txt(75,62,'Seçilen metal: '+matName(p.material),'#b6e5e6')+
 thermometer(689,p.temp,-20,160,'temp')+
 txt(180,245,'Başlangıç boyu: kesikli referans', '#e6d3a2',16)+line(495,127,495,252,'#b9ba9e',2);
return svg(b,'Isıtıldığında sağ ucu hareket eden metal çubuk; ölçekte büyütülmüştür');},
interpret:observations.rod,formula:()=> 'Genleşme ve büzülme: nitel karşılaştırma\nMetal türü ve sıcaklık değişimi sonucu etkiler.',
metrics:(p,o)=>[['Metal',matName(p.material)],['Davranış',o.trend==='genlesme'?'Uzuyor':o.trend==='buzulme'?'Kısalıyor':'Başlangıç boyu']],
note:'9.5.5.1 · MEB genleşme hesaplaması istemez. Gerçek boy değişimi çok küçük olabileceğinden ekrandaki uzama özellikle büyütülmüştür.',
motion:motion('temp',-20,160,17,10)},
{id:'ring',tab:'Küre ve halka',title:'Sıcak küre halkadan geçer mi?',sceneTitle:'İki cismi ayrı ayrı ısıt',
intro:'Kürenin ve halkanın sıcaklığını ayrı ayrı ayarla. Küreyi parmağınla halkaya sürükle; geçişi gerçek çap karşılaştırması belirler.',
defaults:{ballTemp:20,ringTemp:20,progress:0},controls:[BALLTEMP,RINGTEMP,c('progress','Küreyi halkaya yaklaştır',0,1,.01,'')],
model:p=>M.ring({ballTemp:p.ballTemp,ringTemp:p.ringTemp}),
scene:(p,o)=>{const ballR=44+clamp((o.diameter-50)*42,-13,23),holeR=46+clamp((o.opening-50.055)*42,-13,23);
const travel=clamp(p.progress,0,1)*(o.passes?340:194),ballX=186+travel,centerX=526,y=175;
const ringPath='<path fill-rule="evenodd" d="M'+(centerX-94)+' '+(y-95)+' H'+(centerX+94)+' V'+(y+95)+' H'+(centerX-94)+'Z M'+(centerX-holeR)+' '+y+' a'+holeR+' '+holeR+' 0 1 0 '+(2*holeR)+' 0 a'+holeR+' '+holeR+' 0 1 0 -'+(2*holeR)+' 0 Z" fill="#ceaa72" stroke="#ffe0a9" stroke-width="2"/>';
 const ball='<g data-drag="progress" aria-label="Küreyi halkaya götür">'+dot(ballX,y,ballR,'#8ed1e9','#ecf9ff')+txt(ballX-7,y+8,'●','#2d5a72',22)+'</g>';
 return svg(txt(70,52,'Küre: '+p.ballTemp+' °C', '#92d7f1')+txt(477,52,'Halka: '+p.ringTemp+' °C','#f9d79b')+
 ringPath+ball+(p.progress>.55?badge(392,288,o.passes?'GEÇTİ':'TAKILDI'):badge(392,288,'DENE'))+
 txt(50,329,'Küreyi tutup sağa sürükle','#c0dded',16),'Küre hareket ederek halkaya yaklaşır, çaplar ısıl genleşmeye göre karşılaştırılır');},
interpret:observations.ring,formula:()=> 'Küre de halka da ısınınca genleşir.\nMetal halkanın deliği de genişler.',
metrics:(p,o)=>[['Küre',p.ballTemp>20?'Genleşti':p.ballTemp<20?'Büzüldü':'Normal'],['Halka deliği',p.ringTemp>20?'Büyüdü':p.ringTemp<20?'Küçüldü':'Normal'],['Küre geçişi',o.passes?'Geçebilir':'Geçemez']],
note:'Dış çapı ~50 mm olan temsili düzenekte gerçek geçme/kalma fiziksel çaplarla hesaplanır; görüntüdeki küçük çap değişimleri görünürlük için abartılır. Sayısal genleşme sorusu yok.',
motion:motion('progress',0,1,.45,.1)},
{id:'hole',tab:'Levha ve delik',title:'Metal levhanın deliği ısınınca ne olur?',intro:'Delikli metal levhayı ısıt ya da soğut. Hem levhanın kenarını hem deliğin çapını izle.',
defaults:{temp:20,material:1},controls:[TEMP,c('material','0 Çelik · 1 Alüminyum · 2 Pirinç',0,2,1,'')],
model:p=>M.hole({material:material(p.material),temperature:p.temp}),
scene:(p,o)=>{const scale=1+clamp((o.fraction-1)*145,-.32,.56),side=250*scale,rad=66*scale;
const x=390,y=172;
return svg(txt(57,64,'Metal: '+matName(p.material),'#ace8dc')+
 '<path fill-rule="evenodd" d="M'+(x-side/2)+' '+(y-side/2)+' H'+(x+side/2)+' V'+(y+side/2)+' H'+(x-side/2)+' Z M'+(x-rad)+' '+y+' a'+rad+' '+rad+' 0 1 0 '+(rad*2)+' 0 a'+rad+' '+rad+' 0 1 0 -'+(rad*2)+' 0Z" fill="#698ea7" stroke="#cef0ed" stroke-width="4"/>'+
 '<circle cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="transparent" stroke="#ffe0a1" stroke-width="3" data-drag="temp"/>'+
 thermometer(695,p.temp,-20,160,'temp')+txt(53,308,'Aynı metal, tüm doğrultularda genleşir','#c2e7de',17),'Delikli metal levhanın deliği sıcaklık artışıyla birlikte genişler');},
interpret:observations.hole,formula:()=> 'Deliğin çevresi de metalin genleşmesiyle dışarı açılır.',
metrics:(p,o)=>[['Levha',o.trend==='genlesme'?'Büyüyor':o.trend==='buzulme'?'Küçülüyor':'Aynı'],['Delik',o.trend==='genlesme'?'Genişliyor':o.trend==='buzulme'?'Daralıyor':'Aynı']],
note:'Görsel boyut değişimi özellikle büyütülmüştür; hesaplama yok.'},
{id:'liquid',tab:'Sıvı termometresi',title:'Isıttıkça sıvının seviyesi yükseliyor',intro:'Farklı sıvıları seçip termometrenin haznesine sıcaklık uygula. Sıvının yükselmesini canlı gözlemle.',
defaults:{temp:20,liquid:0},controls:[c('temp','Sıvı sıcaklığı',0,60,2,'°C'),c('liquid','0 Alkol · 1 Yağ · 2 Cıva',0,2,1,'')],
model:p=>M.liquid({substance:liquidName(p.liquid),temperature:p.temp}),
scene:(p,o)=>{const height=78+clamp((o.fraction-1)*10500,-48,165),base=269,top=base-height,liquidColor=p.liquid===2?'#c8d5d9':p.liquid===1?'#dfba7b':'#ec8d8f';
const b=rect(364,46,71,265,'#142a42','#b5dbe7',24)+rect(380,top,38,height,liquidColor,liquidColor,13)+dot(399,276,36,liquidColor)+
 '<rect x="366" y="40" width="65" height="286" fill="transparent" data-drag="temp"/>'+
 Array.from({length:9},(_,i)=>line(446,60+i*28,468,60+i*28,'#a2bed2',2)).join('')+
 txt(45,71,'Sıvı: '+liqLabel(p.liquid),'#e6eaf2')+
 txt(49,113,'Sıcaklık: '+p.temp+' °C','#f9d2a5')+
 txt(482,190,p.temp>20?'Seviye yükselir ↑':p.temp<20?'Seviye düşer ↓':'Başlangıç seviyesi','#a6f2d9',19);
return svg(b,'Cam hazneli termometrede sıvı seviyesi sıcaklığa göre değişir');},
interpret:observations.liquid,formula:()=> 'Isınan sıvı genel olarak genleşir; kap ince olunca seviye değişimi belirginleşir.',
metrics:(p,o)=>[['Sıvı',liqLabel(p.liquid)],['Seviye',o.trend==='genlesme'?'Yükselir':o.trend==='buzulme'?'Alçalır':'Sabit']],
note:'Sıvı genleşmesi görünürlük için büyütülmüştür. 0–60 °C aralığında sıvı fazlar idealleştirilir. Cıva zehirlidir; bu kuramsal gösterimi gerçek ortamda tekrarlama.',
motion:motion('temp',0,60,8,4)},
{id:'water',tab:'Suyun özel durumu',title:'Su neden 4 °C’de en yoğundur?',intro:'0–10 °C arasında suyu ısıt. Önce hacim azalacak, 4 °C sonrasında artacak. Buzun neden yüzdüğünü de gör.',
defaults:{temp:0,ice:1},controls:[c('temp','Sıvı suyun sıcaklığı',0,10,.5,'°C'),c('ice','0 Buz yok · 1 Buz ekle',0,1,1,'')],
model:p=>M.water({temperature:p.temp}),
scene:(p,o)=>{const change=(o.relativeVolume-1)*21000,level=156+clamp(change,0,16);
 const b=rect(186,92,400,201,'#0c273f','#c4e7ed',11)+rect(196,101+level*.15,380,183-level*.15,'#3c98c3','#8cdaeb',4)+
 (p.ice?'<g transform="rotate(-15 316 113)">'+rect(279,99,76,56,'#d2f6f4','#fff',3)+'</g>':'')+
 txt(59,56,'Sıvı su: '+p.temp+' °C','#daf0f9')+
 txt(58,320,'Sıvı su: en büyük yoğunluk yaklaşık 4 °C','#8ff0d6')+
 txt(610,165,p.temp<4?'Isıtınca':'4 °C üstü','#e2eef1',16)+txt(610,194,p.temp<4?'büzülür':'genleşir','#ffd89e',18);
 return svg(b,'Sıvı suyun sıfır ile on derece arasındaki anormal genleşmesi ve yüzebilen buz');},
interpret:observations.water,formula:()=> '0–4 °C: su ısındıkça hacim azalır.\n4 °C sonrası: su ısındıkça hacim artar.\nBuzun yoğunluğu sıvı sudan düşüktür.',
metrics:(p,o)=>[['Suyun davranışı',p.temp===4?'En yoğun':p.temp<4?'Büzülme yönü':'Genleşme yönü'],['Buz',p.ice?'Yüzer':'Eklenmedi']],
note:'Su 0–10 °C aralığında sıvı kabul edilir; buz ayrı bir katı cisim olarak gösterilir. Hacim değişimi nitel gösterim için abartılmıştır. Su ve buzun özgül ısıları farklıdır.',
motion:motion('temp',0,10,1.7,.5)},
{id:'rail',tab:'Ray ve köprü',title:'Tren rayında neden genleşme boşluğu var?',intro:'Havayı ısıtıp soğut, ray parçalarının uçlarının birbirine yaklaşmasını veya ayrılmasını gözlemle.',
defaults:{temp:20},controls:[TEMP],model:p=>M.rail({temperature:p.temp}),
scene:(p,o)=>{const grow=clamp((o.fraction-1)*1100,-35,160),gap=62-grow;
let b=line(106,128,695,128,'#8297ac',9)+line(106,252,695,252,'#8297ac',9);
const leftRight=385-gap/2,rightLeft=385+gap/2;
b+=rect(95,167,leftRight-95,42,'#889ba9','#d0e4ec',5)+rect(rightLeft,167,704-rightLeft,42,'#889ba9','#d0e4ec',5);
b+=line(leftRight,151,leftRight,238,'#ffe2ab',4)+line(rightLeft,151,rightLeft,238,'#ffe2ab',4);
b+=txt(87,69,'Ray parçaları ısınıp boyca uzar','#dcebf4')+txt(77,319,'Genleşme payı: '+(gap>10?'Açık':gap>0?'Daraldı':'Yetersiz'),gap>10?'#a4efde':'#ffc2a2',20);
return svg(b,'Birbirine doğru uzayan iki ray ve değişen ek yeri açıklığı');},
interpret:observations.rail,formula:()=> 'Günlük yaşam: tren rayları, köprü derzleri ve genleşme boşlukları.',
metrics:(p,o)=>[['Ray boyu',o.trend==='genlesme'?'Uzuyor':o.trend==='buzulme'?'Kısalıyor':'Sabit'],['Ek yeri',o.gapTrend==='daralir'?'Daralır':o.gapTrend==='genisler'?'Genişler':'Sabit']],
note:'Görüntüdeki ray uzaması artırılmıştır; gerçek boşluk tasarımı, mesafe ve malzeme hesabı gerektirir. MEB sayısal genleşme çözümü istemez.',
motion:motion('temp',-20,160,15,10)},
{id:'bimetal',tab:'Bimetal termostat',title:'İki metalli şerit neden eğiliyor?',intro:'Birbirine yapışık alüminyum ve çelik şeridi ısıt. Termostatta temas açılıp kapanabilir.',
defaults:{temp:20},controls:[TEMP],model:p=>M.bimetal({temperature:p.temp}),
scene:(p,o)=>{const bend=clamp((p.temp-20)*.72,-65,104),y0=188;
const b=rect(75,131,75,110,'#364c61')+
 '<path d="M150 '+(y0-13)+' Q352 '+(y0-13+bend/4)+' 571 '+(y0+bend-13)+'" fill="none" stroke="#ffe2a0" stroke-width="16"/>'+
 '<path d="M150 '+(y0+4)+' Q352 '+(y0+4+bend/4)+' 571 '+(y0+bend+4)+'" fill="none" stroke="#85d9ed" stroke-width="16"/>'+
 dot(570,y0+bend-5,15,'#cef2d7')+rect(619,113,22,67,'#b9e1e6','#c5f2ee',3)+
 txt(236,68,'Pirinç/Alüminyum (çok genleşen)','#ffe2a0',16)+
 txt(236,98,'Çelik (az genleşen)','#8dd9ef',17)+
 thermometer(713,p.temp,-20,160,'temp');
return svg(b,'Isıtılınca eğilen iki metalli şerit ve termostat kontağı');},
interpret:observations.bimetal,formula:()=> 'İki metalin genleşme eğilimleri farklı olduğu için bimetal eğilir.',
metrics:(p,o)=>[['Şerit',p.temp>20?'Bir yana eğildi':p.temp<20?'Ters yana eğildi':'Düz'],['Uygulama','Termostat']],
note:'Bimetal gerçek eğriliği malzeme kalınlıkları ve tasarıma bağlıdır. Çizim şematik ve belirgin büyütülmüş; sayısal hesap yok.',
motion:motion('temp',-20,160,16,10)},
{id:'equilibrium',tab:'Isıl denge',title:'Sıcak ve soğuk suyu buluştur',intro:'Sıcaklık ve miktarlarını ayarla; oynatınca termometreler birbirine yaklaşsın.',
defaults:{hot:80,cold:20,massHot:1,massCold:1,progress:0},controls:[c('hot','Sıcak su',50,95,5,'°C'),c('cold','Soğuk su',0,40,5,'°C'),c('massHot','Sıcak su miktarı',1,4,1,'ölçek'),c('massCold','Soğuk su miktarı',1,4,1,'ölçek'),c('progress','Karışma aşaması',0,1,.01,'')],
model:p=>M.equilibrium({...p,specificHot:1,specificCold:1}),
scene:(p,o)=>{const h=clamp((o.hotNow/100)*185,0,190),cold=clamp((o.coldNow/100)*185,0,190);
const b=rect(132,93,175,209,'#182d47','#a6dae4')+rect(139,288-h,161,h,'#e9946d','#f2b58e')+
 rect(492,93,175,209,'#182d47','#a6dae4')+rect(499,288-cold,161,cold,'#6bb5e2','#b9e6f3')+
 txt(164,82,'Sıcak su','#ffc795',19)+txt(524,82,'Soğuk su','#a4d9fd',19)+
 u.arrow(332,192,123*(1-p.progress),0,'#bce9dc','ısı')+
 txt(113,332,p.progress>=1?'Sıcaklıklar eşitlendi':'Isı aktarımı sıcak olandan soğuk olana','#afe7df',18);
return svg(b,'İki kabın sıcaklık göstergeleri, ısıl dengeye yaklaşır');},
interpret:observations.equilibrium,formula:()=> 'Isı aktarımı: sıcaktan soğuğa.\nSon durumda ısıl denge; sayısal denge sıcaklığı hesabı yok.',
metrics:(p,o)=>[['Sıcak su',o.progress===1?'Dengeye ulaştı':'Soğuyor'],['Soğuk su',o.progress===1?'Dengeye ulaştı':'Isınıyor']],
note:'9.5.3.1: sayısal denge sıcaklığı hesaplanmaz. Modelde ısı kaybı ve buharlaşma yok; karışımın türü aynı (su).',
motion:motion('progress',0,1,.2,.1)},
{id:'capacity',tab:'Öz ısı ve ısı sığası',title:'Aynı ısıyla hangisi daha çok ısınır?',intro:'Kütle ile madde türünü değiştir. Aynı ısı verilen iki cismin sıcaklık artışını boy çubuklarında karşılaştır.',
defaults:{mass:1,substance:0,heat:1},controls:[c('mass','Örnek cismin kütlesi',1,4,1,'kat'),c('substance','0 Alüminyum · 1 Su',0,1,1,''),c('heat','Verilen ısı miktarı (nitel)',1,5,1,'seviye')],
model:p=>({sample:M.heatCapacity({mass:p.mass,specific:p.substance?4.18:.9,heat:p.heat}),reference:M.heatCapacity({mass:1,specific:.9,heat:p.heat})}),
scene:(p,o)=>{const max=Math.max(.1,o.sample.temperatureRise,o.reference.temperatureRise),s=190*o.sample.temperatureRise/max,r=190*o.reference.temperatureRise/max;
const b=rect(213,290-s,95,s,'#76c8ed','#b9e6f7')+rect(493,290-r,95,r,'#eab077','#f5d6a6')+
 txt(155,74,'Deney: '+(p.substance?'Su':'Alüminyum')+' × '+p.mass,'#95d7ef',20)+
 txt(474,74,'Karşılaştırma: Alüminyum × 1','#ffcb94',16)+
 txt(178,319,'Sıcaklık artışı','#aedfed',16)+txt(473,319,'Sıcaklık artışı','#f6ce9f',16);
return svg(b,'Aynı enerji verilen iki farklı ısı sığalı cismin sıcaklık artış eğilimi');},
interpret:observations.capacity,formula:()=> 'Q = m·c·ΔT (matematiksel model)\nBu kazanımda sayısal ısı hesabı yapılmaz.',
metrics:(p,o)=>[['Deneyde sıcaklık artışı',o.sample.temperatureRise>o.reference.temperatureRise?'Daha fazla':o.sample.temperatureRise<o.reference.temperatureRise?'Daha az':'Eşit'],['Kavram','Isı sığası = kütle × öz ısı']],
note:'9.5.1.4–5: matematiksel model verilebilir, sayısal hesap yapılmaz. Çubuklar yalnız göreli sıcaklık değişimini gösterir.'},
{id:'transfer',tab:'Isı iletimi ve yalıtım',title:'Isı nasıl yayılır? Yalıtım işe yarar mı?',intro:'İletim, taşınım, ışımayı seç. Duvar malzemesini ve kalınlığı değiştirerek sıcaklığın geçiş eğilimini gözlemle.',
defaults:{mode:0,material:0,thickness:2,phase:0},controls:[c('mode','0 İletim · 1 Taşınım · 2 Işıma',0,2,1,''),c('material','0 Tahta · 1 Tuğla · 2 Metal · 3 Köpük',0,3,1,''),c('thickness','Duvar kalınlığı',1,5,1,'kademe'),c('phase','Gözlem aşaması',0,1,.01,'')],
model:p=>M.conduction({material:['wood','brick','metal','foam'][p.material],thickness:p.thickness,area:1,temperatureDifference:40}),
scene:(p,o)=>{const mode=p.mode,rate=clamp(Math.log1p(o.relativeRate)/Math.log(101),0,.95),bar=34+p.thickness*23;let b='';
if(mode===0){const wallX=400-bar/2;
b=rect(85,99,wallX-85,181,'#8a553c','#e6b68c')+rect(wallX,99,bar,181,'#4a7390','#a6d5e3')+rect(wallX+bar,99,705-wallX-bar,181,'#285b76','#a9def1');
for(let i=0;i<5;i++){const x=wallX+bar+clamp((p.phase*rate)*215-i*19,0,180);b+=dot(x,139+i*29,6,'#f6bd8a');}
b+=txt(115,73,'SICAK','#fbd0a1')+txt(565,73,'SOĞUK','#a6e6fc')+txt(90,315,'Kalınlık ↑ → iletim yavaşlar','#b2e5d9',17);
}else if(mode===1){b=rect(235,89,340,207,'#22485f','#a5dbe6')+rect(249,103,312,180,'#4c9ac5','#a0d9f4');
const phase=p.phase*Math.PI*2;for(let i=0;i<6;i++){const ang=phase+i*2*Math.PI/6;b+=dot(398+112*Math.cos(ang),193+62*Math.sin(ang),10,i%2?'#f7c58d':'#9be6f5');}
b+=txt(264,71,'Akışkan yükselir / alçalır','#cde9ee',19);}
else{b=dot(185,178,68,'#f3b970')+rect(606,120,70,132,'#375d73','#b6deef');
for(let i=0;i<5;i++){const y=102+i*38;b+=u.arrow(270,y,clamp((p.phase+.2)*270,1,270),0,'#ffcb93','');}
b+=txt(83,74,'Sıcak kaynak → elektromanyetik ışıma','#f0dcb3',19);}
return svg(b,'İletim, taşınım veya ışımayla ısı aktarımının görsel karşılaştırması');},
interpret:observations.transfer,formula:()=> 'İletim: temas · Taşınım: akışkan hareketi · Işıma: elektromanyetik yayılma',
metrics:(p,o)=>[['İletim malzemesi',['Tahta','Tuğla','Metal','Köpük'][p.material]],['Kalınlık',p.thickness===1?'İnce':p.thickness===5?'Kalın':'Orta']],
note:'9.5.4: sayısal iletim hızı hesaplaması yok. Taşınım ve ışıma çizimlerinde duvar kalınlığının doğrudan fiziksel etkisi olmadığı özellikle dikkate alınır.',
motion:motion('phase',0,1,.3,.1)},
{id:'phase',tab:'Hâl değişimi',title:'Buzu ısıt: erime ve kaynamada ne olur?',intro:'Isıtma aşamasını parmağınla değiştir veya oynat. Erime ve kaynamada sıcaklığın neden sabit kaldığını gör.',
defaults:{progress:0},controls:[c('progress','Isıtma aşaması',0,1,.01,'')],
model:p=>M.phase(p),
scene:(p,o)=>{const labels={buz:'KATI / BUZ',erime:'ERİME',su:'SIVI / SU',kaynama:'KAYNAMA',buhar:'GAZ / BUHAR'};
const red=clamp((o.temperature+20)*1.1,4,155),yy=287-red;
const b=rect(138,82,360,216,'#132d41','#a5d8e3')+
 (o.stage==='buz'||o.stage==='erime'?Array.from({length:4},(_,i)=>rect(170+i*61,200-(i%2)*10,51,51,'#bceaf2','#e9fbff')).join(''):'')+
 (o.stage==='su'||o.stage==='erime'||o.stage==='kaynama'?rect(147,218,342,71,'#2c91c6','#a0deef'):'')+
 (o.stage==='buhar'||o.stage==='kaynama'?Array.from({length:8},(_,i)=>dot(177+(i%4)*80,113+Math.floor(i/4)*64,11,'#9ce7ee','#caeff2')).join(''):'')+
 rect(617,95,33,208,'#10273a','#a5dbe2',14)+rect(627,yy,13,287-yy,'#f5a36c','#ffd6a7',4)+dot(634,297,21,'#f5a36c')+
 txt(120,65,labels[o.stage],'#c8f0e6',23)+txt(572,59,'Termometre','#dceef0',17);
return svg(b,'Buz, eriyen buz, sıvı su, kaynayan su ve su buharının ısıtma aşamaları');},
interpret:observations.phase,formula:()=> 'Q = m·L (hâl değişiminde matematiksel model)\nSayısal hâl değişim ısısı hesabı yok.',
metrics:(p,o)=>[['Madde',['buz','erime'].includes(o.stage)?'Buz / erime':['su','kaynama'].includes(o.stage)?'Su / kaynama':'Buhar'],['Sıcaklık aşaması',o.stage==='erime'?'Erime sırasında sabit':o.stage==='kaynama'?'Kaynama sırasında sabit':'Artış']],
note:'9.5.2.1: suyun saf olduğu ve dış basıncın 1 atm olduğu varsayılmıştır; sıcaklık platoları 0 °C ve 100 °C için nitel gösterilir. Enerji miktarı hesaplanmaz.',
motion:motion('progress',0,1,.15,.05)},
{id:'thermometer',tab:'Termometre birimleri',title:'Aynı sıcaklığı üç farklı ölçekte gör',intro:'Dereceyi değiştir; Celsius, Fahrenheit ve Kelvin termometreleri birlikte hareket etsin.',
defaults:{c:20},controls:[c('c','Celsius sıcaklığı',-50,150,5,'°C')],
model:M.celsius,
scene:(p,o)=>{const inputs=[{x:235,val:o.C,min:-50,max:150,name:'°C',str:f(o.C)},{x:403,val:o.F,min:-58,max:302,name:'°F',str:f(o.F)},{x:565,val:o.K,min:223.15,max:423.15,name:'K',str:f(o.K)}];
let b='';for(const t of inputs){const fill=clamp((t.val-t.min)/(t.max-t.min),0,1)*178;b+=rect(t.x-25,83,50,221,'#132e43','#b4dbe3',16)+rect(t.x-11,279-fill,22,fill+12,'#f19f78','#f7c49e',7)+dot(t.x,292,24,'#f0a278')+txt(t.x-47,59,t.str+' '+t.name,'#f2daaa',18);}
return svg(b,'Celsius Fahrenheit Kelvin termometreleri aynı fiziksel sıcaklığı farklı sayılarla gösteriyor');},
interpret:observations.thermometer,formula:()=> 'K = °C + 273,15\n°F = (9/5) × °C + 32\nBu birim dönüşümleri 9.5.1.3 kapsamında hesaplanabilir.',
metrics:(p,o)=>[['Celsius',f(o.C)+' °C'],['Fahrenheit',f(o.F)+' °F'],['Kelvin',f(o.K)+' K']],
note:'9.5.1.3: MEB sıcaklık birimi hesaplamalarına izin verir. Burada yalnız birim dönüşümleri sayısal gösterilir.'}
];
w.IsiSicaklikLab=U.create({sections,questions:[]});
})(window);
