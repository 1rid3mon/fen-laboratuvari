(function(d,M){'use strict';const $=id=>d.getElementById(id),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2}),clamp=M.clamp;
const topics=[['relative','Hareket / referans'],['accel','İvme / grafikler'],['newton','Newton ve net kuvvet'],['friction','Sürtünme'],['third','Etki–tepki'],['work','İş ve güç'],['energy','Enerji korunumu'],['efficiency','Verim ve kaynaklar']];
const s={tab:'relative',time:2,x0:10,velocity:3,observerX0:1,observerVelocity:1,
v0:3,a:-1,forceRight:20,forceLeft:6,mass:4,
applied:22,muStatic:.5,muKinetic:.3,thirdX:185,
workForce:20,workDisplacement:4,workTime:4,
initialHeight:6,height:3,lossFraction:.2,useful:65,
energySource:'solar',playing:false};let drag=null,previousTime=0;
const rect=(x,y,w,h,fill,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+Math.max(1,w)+'" height="'+Math.max(1,h)+'" fill="'+fill+'" '+extra+'/>';
const line=(x,y,X,Y,color='#a2e1e1',width=3,extra='')=>'<line x1="'+x+'" y1="'+y+'" x2="'+X+'" y2="'+Y+'" stroke="'+color+'" stroke-width="'+width+'" '+extra+'/>';
const dot=(x,y,r,fill,extra='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" '+extra+'/>';
const txt=(x,y,v,small=18,color='#e8f5f9')=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-family="system-ui" font-size="'+small+'">'+v+'</text>';
const arrows='<defs><marker id="marr" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" stroke="none" fill="#f3c584"/></marker></defs>';
function arrow(x,y,delta,color='#f3c584',name=''){if(Math.abs(delta)<.005)return dot(x,y,7,color);return line(x,y,x+delta,y,color,5,'marker-end="url(#marr)" '+(name?'data-drag="'+name+'"':''))+dot(x+delta,y,14,color,name?'data-drag="'+name+'"':'');}
function slider(key,name,min,max,step,unit=''){return'<label>'+name+' <strong data-out="'+key+'">'+fmt(s[key])+'</strong> '+unit+'<input type="range" data-key="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[key]+'"></label>';}
function button(action,caption){return'<button type="button" data-action="'+action+'">'+caption+'</button>';}
function buildControls(){
 $('tabs').innerHTML=topics.map(([key,name])=>'<button type="button" aria-pressed="'+(key===s.tab)+'" data-tab="'+key+'">'+name+'</button>').join('');
 let out='';
 if(s.tab==='relative')out=slider('x0','Aracın ilk konumu',-10,20,1,'m')+slider('velocity','Araç hızı (+ doğu)',-5,5,.5,'m/s')+slider('observerX0','Gözlemcinin ilk konumu',-10,20,1,'m')+slider('observerVelocity','Gözlemcinin hızı',-5,5,.5,'m/s')+slider('time','Süre',0,6,.25,'s');
 if(s.tab==='accel')out=slider('v0','Başlangıç hızı (işaretli)',-8,8,.5,'m/s')+slider('a','Sabit ivme (işaretli)',-4,4,.5,'m/s²')+slider('time','Geçen süre',0,6,.25,'s');
 if(s.tab==='newton')out=slider('forceRight','Sağa kuvvet',0,40,2,'N')+slider('forceLeft','Sola kuvvet',0,40,2,'N')+slider('mass','Kütle',1,10,1,'kg')+slider('time','Başlangıçtan geçen süre',0,6,.25,'s');
 if(s.tab==='friction')out=slider('applied','Uygulanan yatay kuvvet (+ sağ)',-60,60,2,'N')+slider('mass','Cisim kütlesi',1,10,1,'kg')+slider('muStatic','Statik sürtünme katsayısı',0,1,.05)+slider('muKinetic','Kinetik sürtünme katsayısı',0,1,.05)+slider('time','Başlangıçtan geçen süre',0,5,.25,'s');
 if(s.tab==='third')out='<p>Cisim A’yı parmağınla B’ye doğru it. Temas gerçekleştiğinde iki ayrı cisme etki eden kuvvetleri karşılaştır.</p>'+button('reset-third','Cisimleri ayır');
 if(s.tab==='work')out=slider('workForce','Sabit yatay kuvvet (+ sağ)',-30,30,1,'N')+slider('workDisplacement','Yatay yer değiştirme (+ sağ)',-8,8,.5,'m')+slider('workTime','Geçen süre',1,10,.5,'s');
 if(s.tab==='energy')out=slider('initialHeight','Başlangıç yüksekliği',1,8,1,'m')+slider('height','Cisim yüksekliği',0,s.initialHeight,.25,'m')+slider('lossFraction','Mekanik kayıp oranı (ideal şema)',0,.7,.05)+button('reset-energy','Baştan gözle');
 if(s.tab==='efficiency')out=slider('useful','Yararlı çıkış (100 birim girdi)',0,100,5,'%')+'<label>Enerji kaynağı<select data-key="energySource">'+[['solar','Güneş'],['wind','Rüzgâr'],['hydro','Hidroelektrik'],['coal','Kömür']].map(([k,n])=>'<option value="'+k+'" '+(k===s.energySource?'selected':'')+'>'+n+'</option>').join('')+'</select></label>';
 if(['accel','newton','relative','friction'].includes(s.tab))out+=button('play',s.playing?'Durdur':'▶ Hareketi oynat');
 $('controls').innerHTML=out;
}
function relativeScene(){
 const p=M.reference({x0:s.x0,velocity:s.velocity,observerX0:s.observerX0,observerVelocity:s.observerVelocity,time:s.time}),scale=13;
 let b=line(100,342,800,342,'#6b8997',3);
 for(let i=-20;i<=30;i+=5){let x=425+i*scale;b+=line(x,337,x,347,'#b2d4e3',2)+txt(x-13,368,i,13);}
 const ax=425+p.groundX*scale,ox=425+p.observerX*scale;
 b+=rect(ax-38,276,76,58,'#65bbc8','rx="8" data-drag="vehicle"')+dot(ax-17,338,11,'#2b4058')+dot(ax+20,338,11,'#2b4058');
 b+=rect(ox-29,219,58,50,'#f5bc92','rx="7" data-drag="observer"')+txt(ox-17,213,'G',14);
 b+=txt(110,80,'Aynı konuma farklı gözlemciler farklı sayılar verir.');
 return{b,stats:'Yerde x = '+fmt(p.groundX)+' m · Gözlemciden x = '+fmt(p.relativeX)+' m · Göreli hız = '+fmt(p.relativeVelocity)+' m/s',note:'9.3.1.6: Konum ve hız, seçilen gözlemciye bağlıdır. Yere göre hareket eden araç ve gözlemcinin hızları sabit varsayılır. Doğu pozitif seçilmiştir. Nesneleri yatay sürükle; ilk konumları değişir. Yüksek hızlar için ekran çizimi şematik ölçektedir.'};
}
function accelScene(){
 const v=M.acceleration({v0:s.v0,a:s.a,time:s.time});
 let b=arrows+rect(85,130,730,310,'#102d43','rx="10"');
 b+=line(135,305,790,305,'#95bdd0',2)+line(135,150,135,425,'#95bdd0',2);
 const points=[];for(let t=0;t<=6;t+=.15){const yy=305-(s.v0+s.a*t)*10;points.push((135+t*92)+','+yy);}
 b+='<polyline points="'+points.join(' ')+'" fill="none" stroke="#8ce7d2" stroke-width="5"/>';
 b+=line(135,365,685,365,'#aec6da',2)+line(135,365-s.a*10,685,365-s.a*10,'#ffc994',4);
 b+=dot(135+s.time*92,305-v.velocity*10,14,'#fff2a9','data-drag="vpoint"');
 b+=txt(145,169,'hız–zaman (üst grafik)')+txt(145,403,'ivme–zaman (alt grafik)');
 return{b,stats:'İşaretli hız = '+fmt(v.velocity)+' m/s · '+v.speeding, note:'9.3.1.5: Sabit ivmeli harekette hız-zaman grafiğinin eğimi ivmeyi, ivme-zaman grafiği sabit ivmeyi gösterir. Sıfır geçişinde hareketin yönü değişebilir. Bu TYT deneyinde konum–zaman grafiği veya sabit ivmeli hareketin sayısal soru çözümü yoktur.'};
}
function newtonScene(){
 const p=M.forces({right:s.forceRight,left:s.forceLeft,mass:s.mass,time:s.time}),cartX=450+clamp(p.x*6,-250,250);
 let b=arrows+line(100,345,800,345,'#a9d5e6',4)+rect(cartX-50,270,100,75,'#66b8cf','rx="9"');
 b+=arrow(cartX,283,s.forceRight*5,'#f3c584','forceRight')+arrow(cartX,305,-s.forceLeft*5,'#8ce8de','forceLeft');
 b+=txt(120,80,'SCD: yatay kuvvetler; düşeyde N ve mg dengede.');
 b+=line(cartX-70,318,cartX-70,251,'#f0e6b4',4)+txt(cartX-95,246,'N',15)+line(cartX+70,275,cartX+70,339,'#f0e6b4',4)+txt(cartX+77,347,'mg',15);
 return{b,stats:'Fnet = '+fmt(p.net)+' N ('+(p.net>0?'sağ':p.net<0?'sol':'dengeli')+') · a = '+fmt(p.a)+' m/s² · x(0)→x(t): '+fmt(p.x)+' m',note:'9.3.3.2: Yatay düzlemde tek cisim. Net kuvvet Fsağ−Fsol, ivme Fnet/m ile belirlenir. Düşeyde normal kuvvet ve ağırlık birbirini dengeler. Konum çizimi yalnız belirli görüş alanını gösterir; sayısal x bilgisi fiziksel modelden gelir.'};
}
function frictionScene(){
 const p=M.friction({applied:s.applied,mass:s.mass,muStatic:s.muStatic,muKinetic:s.muKinetic,time:s.time});
 let b=arrows+line(90,350,800,350,'#a4bed1',4);
 const x=420+clamp(p.x*5,-200,250);
 b+=rect(x-52,275,104,75,'#7ac7d5','rx="9"');
 b+=arrow(x,290,s.applied*4,'#ffc591','applied')+arrow(x,315,p.frictionForce*4,'#89efd4');
 b+=txt(100,75,'Uygulanan kuvvet ↔ sürtünme · yatay, başlangıçta duran blok');
 return{b,stats:(p.mode==='static'?'Statik sürtünme: uygulanan kuvveti dengeler':'Kinetik sürtünme: harekete zıt yönde')+' · '+(p.net===0?'net kuvvet dengeli':p.net>0?'net kuvvet sağa':'net kuvvet sola'),note:'9.3.4.1: Başlangıçta durgun blok, tek kuvvet ve yatay düzlem. Statik sürtünme uygulanan kuvveti sınırına kadar dengeler. Eşik aşılınca kinetik sürtünme hareketin tersine etki eder. Katsayılarla yapılan hesap iç modeldir; müfredattaki sürtünme formülü için sayısal soru sorulmaz. En büyük statik sürtünme, her zaman uygulanan sürtünme değildir.'};
}
function thirdScene(){
 const x=s.thirdX,touch=x+100>=490;
 let b=line(90,360,810,360,'#9bb8cb',3)+rect(x,255,100,105,'#71b8c8','rx="9" data-drag="bodyA"')+rect(490,255,100,105,'#deb179','rx="9"');
 b+=txt(x+35,312,'A')+txt(525,312,'B');
 if(touch){b+=arrow(510,245,110,'#ffd08b')+arrow(475,245,-110,'#ffd08b');}
 return{b,stats:touch?'A’nın B’ye uyguladığı kuvvet ile B’nin A’ya uyguladığı kuvvet eşit büyüklükte, zıt yöndedir.':'İki cisim henüz temas etmiyor. A’yı B’ye sürükle.',note:'9.3.3.3: Etki–tepki kuvvetleri farklı cisimler üzerindedir; bu nedenle birbirini tek cismin serbest cisim diyagramında götürmezler. Buradaki oklar yalnız temas kuvveti çiftidir. Diğer kuvvetler ve kütleye bağlı ivmeler modellenmemiştir.'};
}
function workScene(){
 const p=M.work({force:s.workForce,displacement:s.workDisplacement,time:s.workTime});
 let b=arrows+line(80,345,820,345,'#9cb8cd',4)+rect(380+s.workDisplacement*24,272,100,73,'#7eb8d5','rx="10"');
 b+=line(430,380,430+s.workDisplacement*24,380,'#95eedd',4,'marker-end="url(#marr)"');
 b+=arrow(430+s.workDisplacement*24,284,s.workForce*5,'#f3c584','workForce');
 b+=txt(110,86,'Yalnız yatay ve yer değiştirmeyle aynı doğrultudaki kuvvet');
 return{b,stats:'İş = '+fmt(p.work)+' J · Ortalama güç = '+fmt(p.power)+' W',note:'9.4.1.2: W=F·Δx, P=W/Δt. Pozitif iş, kuvvet ve yer değiştirmenin aynı yönlü olmasıdır; ters yönde negatif iş oluşur. Yer değiştirme sıfırsa iş sıfırdır. Bu deneyde kuvvet sabit ve yatay, kayma hızı modeli ayrıca çözülmez.'};
}
function energyScene(){
 const p=M.energy({mass:3,initialHeight:s.initialHeight,height:s.height,lossFraction:s.lossFraction});
 const y=390-s.height*34,bar=(i,v,label,color)=>{let h=p.initial>0?180*v/p.initial:0;return rect(580+i*95,370-h,64,h,color)+txt(575+i*95,403,label,13);};
 let b=line(90,390,795,390,'#7899a9',4)+line(180,80,180,390,'#b5d5e1',3);
 b+=line(200,390-s.initialHeight*34,420,390-s.initialHeight*34,'#789cb4',2,'stroke-dasharray="7 6"');
 b+=rect(280,y-37,90,37,'#f6c68c','rx="6" data-drag="energy-height"');
 b+=bar(0,p.potential,'Ep','#8ee2bd')+bar(1,p.kinetic,'Ek','#6faee7')+bar(2,p.thermal,'Isı','#f1b77f');
 return{b,stats:'Toplam enerji korunur · Mekanik enerji: '+(p.mechanical===p.initial?'tam korunur':'bir kısmı ısıya dönüşür'),note:'9.4.2.1 ve 9.4.3.1: Sürtünmesiz durumda enerji potansiyel ve kinetik arasında dönüşür. Sürtünme varsa mekanik enerji azalır, oluşan ısıl enerjiyle toplam enerji korunur. Enerji çubuklarının sayısal değerleri bilerek gösterilmiyor (MEB kazanımı nicel enerji hesabı istemez). Cismi düşey sürükle.'};
}
function efficiencyScene(){
 const p=M.efficiency({input:100,useful:s.useful});const sources={
 solar:'Güneş: yenilenebilir; gündüz/ışınım koşulları ve alan gereksinimi vardır.',
 wind:'Rüzgâr: yenilenebilir; rüzgâr hızına ve konuma bağımlıdır.',
 hydro:'Hidroelektrik: yenilenebilir su döngüsünü kullanır; ekosistem ve arazi etkileri olabilir.',
 coal:'Kömür: yenilenemez; yakıldığında sera gazı ve hava kirleticiler açığa çıkar.'
 };
 let b=rect(165,220,570,70,'#466276','rx="12"')+rect(165,220,570*s.useful/100,70,'#7bd8bd','rx="12"')+txt(165,170,'100 birim girdi')+txt(165,333,'Yeşil: yararlı çıktı · gri: kayıp/istenmeyen çıkış');
 return{b,stats:'Verim = %'+fmt(p.ratio*100)+' · Yararlı = '+fmt(s.useful)+' · Kayıp = '+fmt(p.loss),note:'9.4.4 ve 9.4.5: Verim, yararlı enerji çıktısının toplam girdiye oranıdır; kayıp enerji yok olmaz, çevreye farklı biçimde aktarılır. '+sources[s.energySource]+' Kaynakları maliyet, süreklilik, çevre ve erişilebilirlik açısından birlikte değerlendir.'};
}
function draw(){
 const which={relative:relativeScene,accel:accelScene,newton:newtonScene,friction:frictionScene,third:thirdScene,work:workScene,energy:energyScene,efficiency:efficiencyScene}[s.tab];
 const q=which();$('scene').innerHTML=rect(0,0,900,500,'#0b2539')+q.b;$('stats').textContent=q.stats;$('note').textContent=q.note;
}
function render(){buildControls();draw();}
$('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(!t)return;s.tab=t.dataset.tab;s.playing=false;previousTime=0;render();});
$('controls').addEventListener('input',e=>{const key=e.target.dataset.key;if(!Object.hasOwn(s,key))return;const v=e.target.type==='range'?Number(e.target.value):e.target.value;
 if(key==='muKinetic')s.muStatic=Math.max(s.muStatic,v);
 if(key==='muStatic')s.muKinetic=Math.min(s.muKinetic,v);
 s[key]=v;
 if(key==='initialHeight')s.height=Math.min(s.height,v);
 if(key==='height')s.height=clamp(v,0,s.initialHeight);
 if(['muStatic','muKinetic','initialHeight'].includes(key))render();else{let out=$('controls').querySelector('[data-out="'+key+'"]');if(out)out.textContent=fmt(s[key]);draw();}
});
$('controls').addEventListener('change',e=>{if(e.target.tagName==='SELECT'){s.energySource=e.target.value;draw();}});
$('controls').addEventListener('click',e=>{const a=e.target.dataset.action;if(a==='reset-third'){s.thirdX=185;draw();}if(a==='reset-energy'){s.height=s.initialHeight;render();}if(a==='play'){s.playing=!s.playing;previousTime=0;render();if(s.playing)requestAnimationFrame(tick);}});
function xy(e){const b=$('scene').getBoundingClientRect();return{x:(e.clientX-b.left)*900/b.width,y:(e.clientY-b.top)*500/b.height};}
$('scene').addEventListener('pointerdown',e=>{const target=e.target.closest('[data-drag]');if(!target)return;drag={name:target.dataset.drag,id:e.pointerId};$('scene').setPointerCapture?.(e.pointerId);e.preventDefault();});
$('scene').addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=xy(e);
 if(drag.name==='vehicle')s.x0=Math.round((p.x-425)/13-s.velocity*s.time);
 if(drag.name==='observer')s.observerX0=Math.round((p.x-425)/13-s.observerVelocity*s.time);
 if(drag.name==='vpoint')s.v0=clamp(Math.round((305-p.y)/5)/2-s.a*s.time,-8,8);
 if(drag.name==='forceRight')s.forceRight=clamp(Math.round((p.x-450)/5/2)*2,0,40);
 if(drag.name==='forceLeft')s.forceLeft=clamp(Math.round((450-p.x)/5/2)*2,0,40);
 if(drag.name==='applied')s.applied=clamp(Math.round((p.x-420)/4/2)*2,-60,60);
 if(drag.name==='bodyA')s.thirdX=clamp(p.x-50,115,390);
 if(drag.name==='workForce')s.workForce=clamp(Math.round((p.x-430-s.workDisplacement*24)/5),-30,30);
 if(drag.name==='energy-height')s.height=clamp(Math.round((390-p.y)/34*4)/4,0,s.initialHeight);
 draw();e.preventDefault();});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('scene').addEventListener(event,e=>{if(drag&&drag.id===e.pointerId){drag=null;render();}});
function tick(now){if(!s.playing||!['relative','accel','newton','friction'].includes(s.tab))return;
 if(previousTime)s.time=Math.min(6,s.time+(now-previousTime)/1000);
 previousTime=now;
 const slider=$('controls').querySelector('[data-key="time"]');if(slider)slider.value=s.time;
 const out=$('controls').querySelector('[data-out="time"]');if(out)out.textContent=fmt(s.time);
 draw();if(s.time>=6){s.playing=false;render();return;}requestAnimationFrame(tick);}
render();
})(document,window.TYTMechanics2018);