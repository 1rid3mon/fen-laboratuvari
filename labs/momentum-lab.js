/* 2018 MEB AYT 11.1.7.1–4 · Six interactive impulse, collision and explosion modules. */
(function(w){'use strict';
const M=w.MomentumMath,UI=w.MekanikUI;if(!M||!UI)return;
const f=UI.U.fmt,metric=(...rows)=>rows;
function track(U,top,bottom){return U.line(45,top,752,top,'#7095ae',2)+U.line(45,bottom,752,bottom,'#7095ae',2);}
function vecs(U,arrows,label){let body=U.text(48,31,label,'#c4e6f0',18);for(const ar of arrows){const [x,y,vx,vy,c,t]=ar;body+=U.arrow(x,y,Math.max(-155,Math.min(155,vx*13)),Math.max(-150,Math.min(150,-vy*13)),c,t);}return U.svg(body,label);}
const sections=[
 {id:'momentum',tab:'Momentum vektörü',title:'Momentumun yönü ve büyüklüğü',intro:'Çizgisel momentum bir vektördür. Cismin hızı tersine dönerse momentumunun işareti de değişir.',sceneTitle:'Momentum ve hız okları',
  defaults:{m:4,v:6},controls:[{id:'m',label:'Kütle',min:1,max:12,step:1,unit:'kg'},{id:'v',label:'İşaretli hız (+ sağ)',min:-12,max:12,step:1,unit:'m/s'}],
  model:p=>M.momentum(p),
  scene:(p,r,U)=>U.svg(track(U,273,273)+U.cart(380,260,'#327fab','cisim')+U.arrow(380,207,p.v*13,0,'#6fe6c6','v')+U.arrow(380,142,Math.max(-190,Math.min(190,r.p*2)),0,'#f8bd7c','p')+U.text(52,42,'Sağ: + · Sol: − · Momentum vektör','#b7d6e5'),'Çizgisel momentum okları'),
  interpret:(p,r)=>'Momentum '+(r.p>0?'sağa':r.p<0?'sola':'sıfır')+'. Kütle büyüdükçe aynı hızdaki momentum büyüklüğü artar.',
  formula:(p,r)=>'p = mv = '+f(p.m)+' × ('+f(p.v)+') = '+f(r.p)+' kg·m/s',
  metrics:(p,r)=>metric(['Momentum (+ sağ)',f(r.p)+' kg·m/s'],['Kinetik enerji',f(r.K)+' J'],['Sürat',f(Math.abs(p.v))+' m/s']),
  note:'Momentum vektöreldir; enerji skalerdir. Hız negatifken kinetik enerji negatif olmaz. Yalnız yatay doğrultu örneği.'},
 {id:'impulse',tab:'İtme & kuvvet–zaman',title:'Kuvvet–zaman grafiğinin alanı = momentum değişimi',intro:'Kuvvet zamanla doğrusal değişiyor. Grafiğin işaretli alanını ve cisimdeki momentum değişimini aynı anda gör.',sceneTitle:'F–t grafiği ve imzalı alan',
  defaults:{m:2,v0:3,f0:15,f1:5,duration:4,t:2},
  controls:[{id:'m',label:'Kütle',min:1,max:10,step:1,unit:'kg'},{id:'v0',label:'İlk hız (+ sağ)',min:-15,max:15,step:1,unit:'m/s'},{id:'f0',label:'İlk kuvvet',min:-25,max:25,step:1,unit:'N'},{id:'f1',label:'Son kuvvet',min:-25,max:25,step:1,unit:'N'},{id:'duration',label:'Kuvvet süresi',min:1,max:6,step:1,unit:'s'},{id:'t',label:'İncelenen an',min:0,max:6,step:.05,unit:'s'}],
  model:p=>M.impulse(p),animate:{key:'t',max:p=>p.duration},
  scene:(p,r,U)=>U.graph({points:[[0,p.f0],[p.duration,p.f1]],xLabel:'t (s)',yLabel:'F (N)',shade:true}),
  interpret:(p,r)=>'İlk momentum '+f(r.p0)+' kg·m/s iken şu ana kadar toplam itme '+f(r.J)+' N·s. Yeni momentum '+f(r.p)+' kg·m/s.',
  formula:(p,r)=>'J = F–t grafiğinin işaretli alanı\nJ(t) = '+f(r.J)+' N·s = Δp\np(t) = p₀ + J(t) = '+f(r.p)+' kg·m/s',
  metrics:(p,r)=>metric(['Şu ana kadarki itme',f(r.J)+' N·s'],['Tüm süredeki itme',f(r.fullJ)+' N·s'],['İlk momentum',f(r.p0)+' kg·m/s'],['Anlık momentum',f(r.p)+' kg·m/s'],['Anlık hız',f(r.v)+' m/s'],['Şu an uygulanan kuvvet',f(r.force)+' N']),
  note:'Sadece belirtilen kuvvetin net kuvvet olduğu ve kütlenin sabit kaldığı ideal model. İtme, günlük dildeki itmek eylemiyle aynı şey değildir.'},
 {id:'collision1d',tab:'1B çarpışma',title:'1 boyutlu çarpışmada momentumun korunumu',intro:'İki araç çarpışsın. Esneklik katsayısını değiştir; toplam momentum ve kinetik enerjiye ayrı ayrı bak.',sceneTitle:'Önce → sonra hız vektörleri',
  defaults:{m1:2,m2:3,u1:8,u2:-2,e:1},
  controls:[{id:'m1',label:'Mavi kütle',min:1,max:10,step:1,unit:'kg'},{id:'m2',label:'Sarı kütle',min:1,max:10,step:1,unit:'kg'},{id:'u1',label:'Mavi ilk hız (+ sağ)',min:-12,max:12,step:1,unit:'m/s'},{id:'u2',label:'Sarı ilk hız (+ sağ)',min:-12,max:12,step:1,unit:'m/s'},{id:'e',label:'Esneklik katsayısı (e)',min:0,max:1,step:.1,unit:''}],
  model:p=>M.collide1d(p),
  scene:(p,r,U)=>{let b=track(U,145,312)+U.text(50,33,'Çarpışmadan önce','#b2dbeb')+U.cart(250,132,'#237ea2','m₁')+U.cart(520,132,'#ca8f4e','m₂')+U.arrow(250,72,p.u1*9,0,'#75dfff','u₁')+U.arrow(520,72,p.u2*9,0,'#ffe08f','u₂');
   b+=U.text(50,190,'Çarpışmadan sonra','#b2dbeb')+U.cart(250,300,'#237ea2','m₁')+U.cart(520,300,'#ca8f4e','m₂')+U.arrow(250,235,r.v1*9,0,'#75dfff','v₁')+U.arrow(520,235,r.v2*9,0,'#ffe08f','v₂');
   return U.svg(b,'Bir boyutta çarpışma öncesi ve sonrası hız vektörleri');},
  interpret:(p,r)=>!r.approaching?'Bu seçili hızlarla araçlar birbirine yaklaşmıyor (u₁ ≤ u₂). İdeal modelde çarpışma gerçekleşmez.':r.lost<1e-7?'Esnek çarpışma: hem toplam momentum hem kinetik enerji korunur.':'Momentum korunur, fakat '+f(r.lost)+' J kinetik enerji başka biçimlere (ör. ısı, ses, şekil değiştirme) dönüşür.',
  formula:(p,r)=>'p_önce = m₁u₁ + m₂u₂ = '+f(r.initialP)+' kg·m/s\np_sonra = m₁v₁ + m₂v₂ = '+f(r.finalP)+' kg·m/s\nΔEₖ = '+f(r.finalK-r.initialK)+' J',
  metrics:(p,r)=>metric(['Toplam p önce',f(r.initialP)+' kg·m/s'],['Toplam p sonra',f(r.finalP)+' kg·m/s'],['Mavi son hız',f(r.v1)+' m/s'],['Sarı son hız',f(r.v2)+' m/s'],['İlk Eₖ',f(r.initialK)+' J'],['Son Eₖ',f(r.finalK)+' J'],['Kaybolan Eₖ',f(r.lost)+' J']),
  note:'Dış yatay itme yok. e=1 esnek; e=0 tam esnek olmayan (1B birlikte hız), 0<e<1 kısmen esnek olmayan çarpışma. Bir araç diğerini yakaladığında hesap yapılır.'},
 {id:'explosion1d',tab:'1B patlama',title:'Patlama: ilk momentum nereye gider?',intro:'Birlikte hareket eden iki parça iç enerjiyle zıt yönlerde ayrılır. Sistem momentumu değişmez; kinetik enerji artabilir.',sceneTitle:'İki parçanın ters yönlü ivmelenmesi',
  defaults:{m1:2,m2:4,vCenter:0,J:12},
  controls:[{id:'m1',label:'Mavi parça kütlesi',min:1,max:10,step:1,unit:'kg'},{id:'m2',label:'Sarı parça kütlesi',min:1,max:10,step:1,unit:'kg'},{id:'vCenter',label:'Patlama öncesi ortak hız',min:-6,max:6,step:1,unit:'m/s'},{id:'J',label:'İç itme büyüklüğü',min:0,max:30,step:1,unit:'N·s'}],
  model:p=>M.explode1d(p),
  scene:(p,r,U)=>U.svg(track(U,279,279)+U.cart(270,264,'#287c9c','parça 1')+U.cart(520,264,'#b88d50','parça 2')+U.arrow(270,205,r.v1*12,0,'#6ddcff','v₁')+U.arrow(520,148,r.v2*12,0,'#ffe091','v₂')+U.text(60,43,'Patlamanın iç kuvvetleri eşit ve zıt','#cbe8f0'),'Tek doğrultuda patlama'),
  interpret:(p,r)=>'Parça 1: '+f(r.v1)+' m/s, parça 2: '+f(r.v2)+' m/s. Kinetik enerjideki '+f(r.addedEnergy)+' J artış iç enerjiden gelir.',
  formula:(p,r)=>'p_önce = (m₁+m₂)V = '+f(r.initialP)+' kg·m/s\np_sonra = m₁v₁+m₂v₂ = '+f(r.finalP)+' kg·m/s\nΔEₖ = +'+f(r.addedEnergy)+' J (iç enerji kaynağı)',
  metrics:(p,r)=>metric(['p önce',f(r.initialP)+' kg·m/s'],['p sonra',f(r.finalP)+' kg·m/s'],['1. parça hızı',f(r.v1)+' m/s'],['2. parça hızı',f(r.v2)+' m/s'],['Kinetik artış',f(r.addedEnergy)+' J']),
  note:'Dış itme yok. Patlamanın enerjisi yoktan var olmaz; parçaların kinetik enerjisi sistemin iç enerjisinden gelir.'},
 {id:'collision2d',tab:'2B çarpışma',title:'2 boyutta momentum: x ve y ayrı ayrı korunur',intro:'Çarpışma temas doğrultusundaki hızı değiştirir; ideal sürtünmesiz noktasal çarpışmada teğetsel hız bileşeni korunur.',sceneTitle:'Önce/sonra hız vektörleri (2B)',
  defaults:{m1:2,m2:3,u1x:8,u1y:2,u2x:-2,u2y:1,angle:0,e:1},
  controls:[{id:'m1',label:'Mavi kütle',min:1,max:8,step:1,unit:'kg'},{id:'m2',label:'Sarı kütle',min:1,max:8,step:1,unit:'kg'},{id:'u1x',label:'Mavi vₓ',min:-10,max:10,step:1,unit:'m/s'},{id:'u1y',label:'Mavi vᵧ',min:-10,max:10,step:1,unit:'m/s'},{id:'u2x',label:'Sarı vₓ',min:-10,max:10,step:1,unit:'m/s'},{id:'u2y',label:'Sarı vᵧ',min:-10,max:10,step:1,unit:'m/s'},{id:'angle',label:'Temas normalinin açısı',min:-180,max:180,step:15,unit:'°'},{id:'e',label:'Esneklik katsayısı',min:0,max:1,step:.1,unit:''}],
  model:p=>M.collide2d(p),
  scene:(p,r,U)=>{let b=U.line(398,40,398,333,'#46657e',2)+U.text(65,31,'Önce','#e6e1cf')+U.text(465,31,'Sonra','#e6e1cf');
   b+=U.arrow(180,170,p.u1x*12,-p.u1y*12,'#68cfff','u₁')+U.arrow(180,170,p.u2x*12,-p.u2y*12,'#f8c775','u₂');
   b+=U.arrow(580,170,r.v1x*12,-r.v1y*12,'#68cfff','v₁')+U.arrow(580,170,r.v2x*12,-r.v2y*12,'#f8c775','v₂');
   b+=U.arrow(180,170,90*r.nx,-90*r.ny,'#e59dc8','n')+U.text(55,322,'Mavi: 1 · Sarı: 2 · Pembe: temas doğrultusu','#c3dce8');
   return U.svg(b,'İki boyutta çarpışma öncesi ve sonrası iki cismin hız vektörleri');},
  interpret:(p,r)=>!r.approaching?'Seçilen temas doğrultusunda cisimler yaklaşmıyor; çarpışma olmaz. Temas açısını veya hızları değiştir.':r.lost<1e-6?'Esnek durumda x/y momentumları ve toplam kinetik enerji korunur.':'x/y momentumları korunuyor. Kinetik enerji '+f(r.lost)+' J azalıyor. e=0 olsa bile 2B teğetsel bağıl hız kalabileceğinden cisimler mutlaka yapışmaz.',
  formula:(p,r)=>'pₓ: '+f(r.p0x)+' → '+f(r.p1x)+' kg·m/s\npᵧ: '+f(r.p0y)+' → '+f(r.p1y)+' kg·m/s\nEₖ: '+f(r.K0)+' → '+f(r.K1)+' J',
  metrics:(p,r)=>metric(['pₓ önce/sonra',f(r.p0x)+' / '+f(r.p1x)],['pᵧ önce/sonra',f(r.p0y)+' / '+f(r.p1y)],['İtme büyüklüğü',f(r.J)+' N·s'],['İlk Eₖ',f(r.K0)+' J'],['Son Eₖ',f(r.K1)+' J'],['Kayıp Eₖ',f(r.lost)+' J']),
  note:'Temas normali pembeyle gösterilir; tek doğrultuda dürtü aktarımı olan ideal çarpışma modeli. Dış kuvvet ihmal; teğetsel sürtünme ve dönme yok.'},
 {id:'explosion2d',tab:'2B patlama',title:'2 boyutlu patlamada x/y toplam momentumun korunumu',intro:'İki parçayı farklı yönlere ayır. Başlangıçta duruyorlarsa iki parçanın momentum vektörleri zıt olur.',sceneTitle:'x/y bileşenleri ayrı ayrı korunur',
  defaults:{m1:2,m2:3,vcx:0,vcy:0,J:15,angle:45},
  controls:[{id:'m1',label:'Mavi kütle',min:1,max:8,step:1,unit:'kg'},{id:'m2',label:'Sarı kütle',min:1,max:8,step:1,unit:'kg'},{id:'vcx',label:'İlk ortak vₓ',min:-5,max:5,step:1,unit:'m/s'},{id:'vcy',label:'İlk ortak vᵧ',min:-5,max:5,step:1,unit:'m/s'},{id:'J',label:'Patlama iç itmesi',min:0,max:30,step:1,unit:'N·s'},{id:'angle',label:'Mavi parçanın ayrılma açısı',min:0,max:360,step:15,unit:'°'}],
  model:p=>M.explode2d(p),
  scene:(p,r,U)=>U.svg(U.line(397,40,397,332,'#3d6179',2)+U.text(52,32,'Mavi parça','#80d6ff')+U.text(450,32,'Sarı parça','#ffe1a1')+U.arrow(200,192,r.v1x*18,-r.v1y*18,'#6dcfff','v₁')+U.arrow(580,192,r.v2x*18,-r.v2y*18,'#f7c47c','v₂')+U.text(50,326,'Vektörlerin bileşke momentumu başlangıçtakiyle aynıdır.','#c2dfe9'),'İki boyutta patlama vektörleri'),
  interpret:(p,r)=>'Kinetik enerji artışı '+f(r.addedEnergy)+' J, iç enerjiden gelir. x ve y yönlerinde momentum toplamı ayrı ayrı korunur.',
  formula:(p,r)=>'pₓ: '+f(r.p0x)+' → '+f(r.p1x)+' kg·m/s\npᵧ: '+f(r.p0y)+' → '+f(r.p1y)+' kg·m/s\nΔEₖ: +'+f(r.addedEnergy)+' J',
  metrics:(p,r)=>metric(['pₓ önce/sonra',f(r.p0x)+' / '+f(r.p1x)],['pᵧ önce/sonra',f(r.p0y)+' / '+f(r.p1y)],['Mavi vₓ / vᵧ',f(r.v1x)+' / '+f(r.v1y)],['Sarı vₓ / vᵧ',f(r.v2x)+' / '+f(r.v2y)],['Kinetik artış',f(r.addedEnergy)+' J']),
  note:'Başlangıçta parçalar birlikte hareket eder; iç itme iki parçaya eşit/zıt uygulanır. Patlama süresindeki dış itme ihmal.'}
];
const questions=[
['3 kg kütleli cisim +4 m/s hızla gidiyor. Momentum?',['−12','−7','+7','+12','+16'],3,'p=mv=3×4=+12 kg·m/s.'],
['2 kg cisim −5 m/s hızla gidiyorsa momentum?',['−10','−7','+7','+10','+20'],0,'p=2×(−5)=−10 kg·m/s.'],
['Momentum hangi tür büyüklüktür?',['Skaler','Vektörel','Temel SI birimi','Her zaman pozitif','Enerjiyle aynı'],1,'Momentumun yönü hız yönüdür.'],
['10 N sabit kuvvet 3 s uygulanırsa itme?',['3 N·s','10 N·s','13 N·s','30 N·s','300 N·s'],3,'J=FΔt=10×3=30 N·s.'],
['Kuvvet–zaman grafiğinin işaretli alanı hangi büyüklüktür?',['İş','Enerji','İtme','Güç','Yol'],2,'F–t işaretli alanı itmedir ve Δp ye eşittir.'],
['İtmenin birimi hangisidir?',['N/m','J/s','N·s','kg/s','m/s²'],2,'N·s=kg·m/s boyutundadır.'],
['Başlangıç momentumu 6, itme −10 N·s ise son momentum?',['−16','−4','0','4','16'],1,'p_son = p_ilk + J = 6−10=−4.'],
['2 kg kütleli cismin momentumunu 8 kg·m/s artıran itme sonrası hızı kaç m/s artar?',['1','2','4','8','16'],2,'Δv=J/m=8/2=4 m/s.'],
['Dış itmenin sıfır olduğu iki cisimli sistemde korunan büyüklük?',['Her cismin momentumu','Toplam momentum','Her cismin sürati','Kinetik enerji her zaman','Sıcaklık'],1,'İzolasyon varsa toplam momentum korunur.'],
['Tam esnek çarpışmada hangileri korunur?',['Yalnız kinetik enerji','Yalnız momentum','Momentum ve kinetik enerji','Sadece hız','Sadece kütle'],2,'Dış itme yokken hem momentum hem toplam kinetik enerji korunur.'],
['Tam esnek olmayan 1B merkezi çarpışmada cisimler?',['Aynı son hızla gider','Kesin zıt yönlere gider','Enerji artar','Momentum korunmaz','Kinetik korunur'],0,'e=0 ve 1B merkezî yaklaşmada ortak hız vardır.'],
['Esnek olmayan çarpışmada toplam kinetik enerji?',['Her zaman artar','Korunmak zorundadır','Azalabilir','Negatif olur','Sıfırdır'],2,'Bir bölümü başka enerji türlerine dönüşebilir.'],
['Patlamada başlangıçta duran sistemin toplam momentumu?',['Artar','Azalır','Sıfır kalır','Kinetik enerjiye dönüşür','Kütleye bağlı'],2,'Dış itme yoksa başlangıç 0 olan toplam momentum sıfır kalır.'],
['Patlamada parçaların toplam kinetik enerjisi nasıl artabilir?',['Momentum yaratıldığı için','İç enerji kinetiğe dönüştüğü için','Kütle ortadan kalktığı için','Yer çekimi durduğu için','İtme sıfırlandığı için'],1,'Patlama kinetiği sistem iç enerjisinden kaynaklanır.'],
['2 boyutta izole çarpışmada korunması gerekenler?',['Yalnız pₓ','Yalnız pᵧ','pₓ ve pᵧ ayrı ayrı','Yalnız sürat','Sadece p büyüklüğü'],2,'Toplam vektörel momentum korunur; bileşenler ayrı ayrı eşittir.'],
['2B çarpışmada esneklik e=0 olunca cisimler mutlaka yapışır mı?',['Evet','Hayır, teğetsel bağıl hız kalabilir','Her zaman durur','İvmeleri sıfırlanır','Kinetik enerji artar'],1,'İdeal sürtünmesiz 2B temas yalnız normal bileşeni eşitler.'],
['Kuvvet aynı işaretli değilse F–t grafiğinde işaretli alan nasıl hesaplanır?',['Mutlak alanlar toplanır','Pozitif alan eksi negatif alan','Kütleyle bölünür','Sıfır alınır','Her zaman pozitif'],1,'Net itme işaretli alanların cebirsel toplamıdır.'],
['İki cismin dış itmesi sıfırken çarpışma sırasında birbirlerine uyguladıkları itmeler?',['Aynı yönde','Eşit ve zıt','Sadece ağır olana','Farklı süreli','Sıfır'],1,'Newton üçüncü yasa gereği etkileşim itmeleri eşit büyüklükte ve zıt yönlüdür.'],
['Başlangıçta duran 2 kg ve 3 kg iki parça patlamayla ayrılıyor. Momentum büyüklükleri?',['2:3 oranında','3:2 oranında','Eşit','Yalnız hızlı olan','Toplamı pozitif'],2,'Toplam momentum 0 olduğundan momentum vektörleri zıt, büyüklükleri eşit.'],
['Bir cismin momentumunun yönünü hangisi belirler?',['Kütlesi','Hızı','Kinetik enerjisi','Sıcaklığı','Şekli'],1,'p=mv, kütle pozitif; momentum yönü hız yönüdür.']
].map(([q,options,answer,why])=>({q,options,answer,why}));
w.MomentumLab=UI.create({sections,questions});
})(window);
