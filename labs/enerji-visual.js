/* Interactive, scientific process visualisations — 2018 MEB AYT biology.
   Diagrams illustrate relationships, NOT stoichiometry, reaction rates or actual molecule paths. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EnerjiVisual=api;})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const clamp=(x,min,max)=>Math.max(min,Math.min(max,Number(x)||0));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const transfer=(sx,sy,ex,ey,color,title)=>'<g class="bio-transfer" aria-label="'+esc(title)+'"><path d="M'+sx+' '+sy+' L'+ex+' '+ey+'" stroke="'+color+'" stroke-width="4" fill="none" stroke-dasharray="10 8"/><circle cx="'+sx+'" cy="'+sy+'" r="9" fill="'+color+'" opacity=".85"><animateMotion dur="2.8s" repeatCount="indefinite" path="M0 0 L'+(ex-sx)+' '+(ey-sy)+'"/></circle></g>';
const circles=(x,y,n,color)=>Array.from({length:clamp(n,0,12)},(_,i)=>'<circle class="bio-particle" cx="'+(x+(i%5)*25)+'" cy="'+(y-Math.floor(i/5)*23)+'" r="'+(5+i%3)+'" fill="'+color+'" style="animation-delay:-'+(i*.25)+'s"/>').join('');
const circle=(x,y,r,color,attrs='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+color+'" '+attrs+'/>';
const rect=(x,y,w,h,color,attrs='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="'+color+'" '+attrs+'/>';
const text=(x,y,label,size=17,color='#e6f7fb',attrs='')=>'<text x="'+x+'" y="'+y+'" font-family="system-ui" font-size="'+size+'" fill="'+color+'" '+attrs+'>'+esc(label)+'</text>';
const path=(d,stroke,w=3,extra='')=>'<path d="'+d+'" fill="none" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linecap="round" '+extra+'/>';
const bubble=(x,y,w,h,label,ok,zoneId)=>'<g class="bio-target'+(ok?' completed':'')+'" role="button" tabindex="0" data-zone="'+esc(zoneId)+'" aria-label="'+esc(label)+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="14" fill="'+(ok?'#1b6b57':'#1e435b')+'" stroke="'+(ok?'#7beabb':'#709cae')+'" stroke-width="3" stroke-dasharray="'+(ok?'0':'7 5')+'"/>'+text(x+15,y+h/2+5,(ok?'✓ ':'＋ ')+label,17,ok?'#c9ffe1':'#e0f5ff')+'</g>';
function progressSvg(x,y,fraction){const f=clamp(fraction,0,1);return rect(x,y,410,14,'#2a4a60')+rect(x,y,410*f,14,'#79dfc5');}
function status(s,key){return !!(s?.placed?.[key]||s?.items?.[key]||s?.slots?.[key]);}
function chloroplast(s){const n=Object.keys(s.items||{}).length,okLight=status(s,'LIGHT')&&status(s,'H2O'),okCo2=status(s,'CO2');let out='';
 out+=rect(120,35,525,215,'#15554c','stroke="#74dcaa" stroke-width="5" rx="100"');
 for(let i=0;i<5;i++){const x=170+i*62;for(let j=0;j<4;j++)out+=rect(x,70+j*22,55,13,'#409e75','rx="6"');}
 out+=text(145,209,'TİLAKOİT',19,'#b9f8dc')+text(506,207,'STROMA',19,'#b9f8dc');
 out+=path('M430 95 Q490 65 555 110','#76dac2',4,'stroke-dasharray="8 10"');
 out+=circles(174,84,okLight?7:1,'#ffd78e')+circles(530,150,okCo2?7:1,'#9debcf');
 if(okLight){out+=transfer(260,96,380,105,'#ffdb88','Işık ve su eşleştiğinde ATP ve NADPH sentez ilişkisi gösterilir');
 out+='<g class="bio-product-pulse">'+circle(448,100,24,'#87e5c3')+text(434,105,'O₂',17,'#103b3e')+'</g>';
 out+=text(432,66,'Suyun fotolizi → O₂',16,'#f5e6bc');}
 if(okCo2)out+=transfer(560,195,430,172,'#b4d3ff','CO₂ stromada bağlanır');
 if(n===5)out+=text(408,244,'✓ Eşleştirme tamam',16,'#bdffde');
 out+=text(150,28,'Işık ve su → tilakoit; CO₂ → stroma',17);
 out+=text(150,236,n+' / 5 eşleştirme · ATP ve NADPH stromada kullanılır',15);
 return{svg:out,zones:[['tilakoit','Tilakoit',110,260,240],['stroma','Stroma',400,260,240]],label:'Kloroplast içindeki konumlar',progress:n/5};
}
function thylakoid(s){
 const n=Object.keys(s.placed||{}).length,inputs=['LIGHT','H2O','ADP','NADP'].every(k=>status(s,k)),products=['O2','ATP','NADPH'].every(k=>status(s,k));
 let out=rect(90,70,580,150,'#175a56','stroke="#5dd6c1" stroke-width="3"');
 out+=path('M120 150 C195 108 240 195 300 145 S450 104 520 150 S610 180 640 142','#6de4c6',16);
 out+=circles(125,105,inputs?8:3,'#f9d38a')+circles(450,105,products?9:1,'#8fdbff');
 if(inputs){out+=transfer(250,140,450,142,'#f7d48f','Girdiler sağlandığında enerji dönüşümü ve ürünler simgelenir');
 out+='<g class="bio-product-pulse">'+circle(560,92,27,'#abf1e0')+text(546,98,'O₂',18,'#0d3337')+'</g>';}
 if(products)out+=text(427,233,'✓ Ürünler yerleştirildi',16,'#b9ffdb');
 out+=text(112,51,'Tilakoit zarı: ışık enerjisinin kimyasal enerjiye dönüşümü',17);
 out+=text(120,203,'Işık / H₂O / ADP+Pi / NADP⁺',14)+text(438,203,'O₂ / ATP / NADPH',14);
 out+=text(170,247,products?'✓ Ürünler şemasında yerlerini aldı.':'İlk dört girdiyi eşleştir, sonra ürünleri tanımla.',16);
 return{svg:out,zones:[['inputs','Girdiler',80,260,245],['products','Ürünler',425,260,245]],label:'Işığa bağımlı tepkime ürün ve girdileri',progress:n/7};
}
function calvin(s){
 const n=Object.keys(s.placed||{}).length,ready=n===3;
 let out='<circle cx="380" cy="147" r="106" fill="#164d49" stroke="#72d9bc" stroke-width="6"/>';
 out+=path('M350 60 Q498 88 459 214 Q380 285 286 178','#b6f0d2',5,'stroke-dasharray="14 10"');
 out+=text(319,142,'CALVIN',27,'#a7f7d5')+text(315,172,'STROMA',18,'#a7f7d5');
 out+=circles(164,150,status(s,'CO2')?7:2,'#a2d8ff')+circles(566,148,status(s,'ATP')&&status(s,'NADPH')?8:2,'#f4d190');
 if(status(s,'CO2'))out+=transfer(210,148,293,147,'#a4d6ff','Karbon kaynağı stromaya gelir');
 if(status(s,'ATP')&&status(s,'NADPH'))out+=transfer(540,151,465,143,'#f8d49a','Enerji ve indirgeme gücü kullanılır');
 if(ready){out+='<g class="bio-product-pulse">'+rect(314,176,134,35,'#e9bc7c')+text(325,198,'Organik besin',15,'#0a3030')+'</g>';}
 out+=text(105,80,'CO₂',21)+text(564,78,'ATP / NADPH',20);
 out+=text(180,266,ready?'✓ Organik besin sentezi için temel girdiler hazır.':'Doğrudan ışık kullanılmaz; ATP ve NADPH gerekir.',17);
 return{svg:out,zones:[['carbon','CO₂',40,275,190],['energy','ATP',252,275,190],['reducing','NADPH',465,275,220]],label:'Stromadaki temel bileşenler',progress:n/3};
}
function speed(s,view){
 const val=parseFloat(String(view.metrics?.[0]?.value||0).replace(',','.'))||0,ratio=clamp(val/100,0,1),light=clamp(s.light/100,0,1),gas=clamp(s.co2/1000,0,1);
 let out='<g class="bio-leaf"><path d="M386 250 Q170 156 375 56 Q614 66 386 250" fill="#1b7659" stroke="#7ce2a5" stroke-width="4"/>'+path('M386 250 L375 76 M385 178 L295 137 M386 150 L463 116','#83ebc0',4)+'</g>';
 out+='<path d="M130 70 L260 155" stroke="#f6d981" stroke-width="'+(3+light*13)+'" opacity="'+(.25+light*.7)+'" stroke-linecap="round"/>';
 out+=circles(160,220,Math.round(12*ratio),'#a8e7ff')+text(125,266,'O₂ (temsili gözlem)',16);
 if(ratio>0.02){out+=transfer(354,210,230,165,'#a7e6f5','Oksijen çıkışının temsili işareti');
 out+='<g class="bio-product-pulse">'+circle(207,167,17,'#b9f3f6')+'</g>';}
 if(light===0)out+=text(250,275,'IŞIK YOK → modelde fotosentez hızı 0',17,'#ffcf95');
 out+=circles(585,130,Math.round(gas*11),'#d4c8fa')+text(540,195,'CO₂ ortamı',17);
 out+=text(100,40,'Sera: ışık, CO₂ ve sıcaklığı değiştir',20)+text(100,302,'Bağıl fotosentez hızı: '+(Math.round(val))+' / 100 · gerçek O₂ adedi değildir',16);
 out+=path('M115 325 H650','#527f98',3);
 out+=rect(115,319,535*light,12,'#f6c975');
 out+=circleHandle(115+535*light,325,'light',0,100);
 return{svg:out,zones:[['measure','Ölçümü kaydet',260,345,275]],label:'İçerikteki ölçümler gerçek deney verisi değildir',progress:ratio};
}
function circleHandle(x,y,key,min,max){return '<g class="bio-control" data-vcontrol="'+key+'" data-min="'+min+'" data-max="'+max+'" role="slider" tabindex="0" aria-label="'+(key==='light'?'Işık şiddetini ayarla':'Dalga boyunu ayarla')+'" aria-valuemin="'+min+'" aria-valuemax="'+max+'"><circle cx="'+x+'" cy="'+y+'" r="20" fill="#ffd89c" stroke="#0b283a" stroke-width="3"/></g>';}
function spectrum(s,view){
 const wl=clamp(s.wavelength,400,700),selected=s.pigments||[],colors=['#8366ff','#6ea3f6','#66d8ce','#a3ed8c','#f9e07f','#f8af78','#ef747e'];
 let out=text(100,45,'Dalga boyu: mor-mavi → yeşil → sarı → kırmızı',18);
 colors.forEach((color,i)=>{out+=rect(95+i*83,98,83,120,color,'rx="0"');});
 const x=95+(wl-400)/300*581;
 out+=path('M'+x+' 76 V237','#fcfcff',4)+circleHandle(x,242,'wavelength',400,700);
 out+=text(105,278,'Seçilen pigmentler: '+(selected.length?selected.join(' + '):'Yok'),18);
 out+=text(105,308,'Soğurma ile fotosentez etki spektrumu farklı kavramlardır.',16);
 return{svg:out,zones:[['pigments','Pigmenti eşleştir',95,340,300],['light','Işık kaynağı',420,340,230]],label:'Dalga boyunu ekrandaki işaretten sürükle',progress:selected.length/3};
}
function chemo(s){
 const step=clamp(s.step||0,0,3),name={nitrit:'Nitrit oksidasyonu',nitrat:'Nitrat oksidasyonu',kukurt:'Kükürt oksidasyonu',demir:'Demir oksidasyonu',hidrojen:'Hidrojen oksidasyonu'}[s.org]||'İnorganik madde oksidasyonu';
 let out=text(95,52,name,21);
 for(let i=0;i<4;i++){const x=165+i*130;out+=rect(x,107,90,90,'#24576b','stroke="#71c8cf"');out+=text(x+15,150,i===0?'Enerji':i===1?'O₂':i===2?'CO₂':'Besin',17);if(i<3)out+=path('M'+(x+93)+' 155 h32','#f5ce97',4);}
 out+=circles(165,89,step*3,'#b7f5d1')+text(112,238,'İnorganik madde kimyasal enerji sağlar; CO₂ karbon kaynağıdır.',16);
 for(let i=0;i<step;i++)out+=transfer(245+i*130,158,292+i*130,158,'#f8d39c','Doğru madde basamağı');
 out+=text(112,264,step===3?'✓ CO₂ kullanılarak organik besin sentezi mümkün.':'Aşamalar: inorganik kaynak → O₂ → CO₂',15,'#c3f2df');
 return{svg:out,zones:[['energy','Enerji kaynağı',48,270,204],['oxidizer','Oksitleyici',281,270,192],['carbon','Karbon kaynağı',502,270,207]],label:'Bu deney yalnız aerobik kemosentetik örnekler içerir',progress:step/3};
}
function compare(s){
 const slots=s.slots||{},count=['energy','carbon','donor'].filter(k=>slots[k]).length,modes={photo:'Yeşil bitki',cyan:'Siyanobakteri',purple:'Mor kükürt bakterisi',chemo:'Kükürt oksitleyen bakteri'};
 let out=rect(110,85,530,170,s.mode==='purple'?'#4f3b6e':s.mode==='chemo'?'#26566c':'#23644d','stroke="#7bcabb" stroke-width="4"');
 out+=text(152,135,modes[s.mode]||'Üretici',24);
 out+=text(145,184,s.mode==='chemo'?'Kimyasal oksidasyon':'Işıkla fotosentez',20);
 out+=text(145,220,s.mode==='purple'?'O₂ açığa çıkmaz.':s.mode==='chemo'?'Aerobik örnek; O₂ tüketilir.':'Oksijenli fotosentez: O₂ çıkışı.',16);
 return{svg:out,zones:[['energy','Enerji',60,280,205],['carbon','Karbon',286,280,205],['donor','Elektron kaynağı',512,280,207]],label:'Enerji ≠ karbon ≠ elektron/hidrojen kaynağı',progress:count/3};
}
function nitrogen(s){
 const step=clamp(s.step||0,0,3);
 let out=text(105,64,'Azot döngüsünde sıralı dönüşüm',22);
 const parts=[['NH₃','NO₂⁻'],['NO₂⁻','NO₃⁻'],['NO₃⁻','Bitki alımı']];
 for(let i=0;i<3;i++){const x=94+i*227;out+=rect(x,117,188,108,i<step?'#216954':'#25455e','stroke="'+(i<step?'#80eabd':'#76a0b5')+'" stroke-width="3"');out+=text(x+14,160,parts[i][0],21);out+=text(x+20,194,'→ '+parts[i][1],16);if(i<2)out+=path('M'+(x+188)+' 170 h33','#f8d597',5);}
 out+=text(106,265,'Bitkinin nitrat alımı kemosentez değildir.',18);
 for(let i=0;i<Math.min(2,step);i++)out+=transfer(250+i*227,130,320+i*227,130,'#b6eecb','Nitrifikasyon dönüşüm sırası');
 return{svg:out,zones:[['nitrit','Nitrit bakterisi',50,291,207],['nitrat','Nitrat bakterisi',276,291,207],['plant','Bitki kökü',502,291,208]],label:'Azot bileşiğini doğru adıma taşı',progress:step/3};
}
function ecosystem(s){
 const suitable=s.site==='vent'?'H2S':'NH3',ok=s.oxygen==='yes'&&s.carbon==='yes'&&s.substrate===suitable;
 let out=rect(65,70,630,220,s.site==='vent'?'#183e55':'#344e3d','stroke="#6996af" stroke-width="3"');
 out+=text(95,114,s.site==='vent'?'Işıksız hidrotermal baca ortamı':'Topraktaki aerobik nitrifikasyon örneği',21);
 out+=path('M178 272 L231 171 L279 272','#efae7f',12)+circles(220,163,ok?10:2,'#91e4ca');
 for(const [i,key,label] of [[0,'oxygen','O₂'],[1,'carbon','CO₂']]){
 const yes=s[key]==='yes',x=360+i*142;
 out+=rect(x,155,125,73,yes?'#216e5c':'#5e3439','data-vtoggle="'+key+'" data-value="'+(yes?'no':'yes')+'" role="button" tabindex="0"');
 out+=text(x+15,186,label,19);out+=text(x+15,211,yes?'Var':'Yok',15);
 }
 out+=text(350,257,s.last===null?'Koşulları değiştir, sonra ölç.':s.last?'✓ Kemosentez koşulları uygun.':'✕ Seçilen aerobik örnekte üretim yok.',15);
 if(s.last===true&&ok)out+=transfer(260,190,354,190,'#a5f1d0','İnorganik madde oksidasyonu ve CO₂ ile üretim');
 if(s.last===false)out+=rect(103,295,550,12,'#8b4746');
 return{svg:out,zones:[['test','Deneyi çalıştır',245,314,260]],label:'O₂ / CO₂ kutularına dokunarak ortamı değiştir',progress:s.last===null?0:s.last?1:0};
}
const scenes={exp1:chloroplast,exp2:thylakoid,exp3:calvin,exp4:speed,exp5:spectrum,exp6:chemo,exp7:compare,exp8:nitrogen,exp9:ecosystem};
function render(id,s,view){
 const fn=scenes[id];if(!fn)return'';
 const data=fn(s||{},view||{}),svg='<svg class="bio-stage-svg" viewBox="0 0 760 408" role="group" aria-label="'+esc(data.label)+'">'+
 rect(0,0,760,408,'#0b2637','stroke="#315d68" stroke-width="2"')+data.svg+
 data.zones.map(([key,label,x,y,width])=>bubble(x,y,width,55,label,((s?.placed||s?.slots||s?.items||{})[key]||false),key)).join('')+
 '</svg>';
 return'<section class="bio-stage"><div class="bio-stage-heading"><strong>CANLI DENEY SAHNESİ</strong><small>Parmakla taşı • yuvalara bırak • sonucu gözle</small></div>'+svg+'<p class="bio-stage-caption">'+esc(data.label)+' · Çizim temsili; molekül sayısı ve gerçek hız ölçümü değildir.</p></section>';
}
return{render,sceneIds:Object.keys(scenes),clamp};
});