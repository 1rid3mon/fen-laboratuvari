/* 2018 MEB AYT 11.1.6.1–3 · Seven interactive work/energy demonstrations. */
(function(w){'use strict';
const M=w.FizikEnerjiMath,UI=w.MekanikUI;if(!M||!UI)return;
const f=UI.U.fmt;
const metric=(...entries)=>entries;
function block(U,x=340,label='cisim'){return U.cart(x,258,'#217d98',label);}
function potentialBars(U,o,thermal=0){return U.energyBars([{label:'Kinetik enerji',value:o.K,color:'#65b9ff'},{label:'Potansiyel enerji',value:o.U,color:'#86e3be'},...(thermal?[{label:'Isı / termal enerji',value:thermal,color:'#f8b472'}]:[])]);}
const sections=[
 {id:'work',tab:'Kuvvet – yol grafiği',title:'Kuvvet–yol grafiğinde imzalı alan',intro:'Kuvvet, yer değiştirme doğrultusunda sabit ya da doğrusal değişiyor. Grafiğin x ekseninin üstündeki alan pozitif, altındaki alan negatiftir.',sceneTitle:'Grafikte alan = iş (J)',
  defaults:{f0:18,f1:8,dx:6},
  controls:[{id:'f0',label:'Başlangıç kuvveti',min:-30,max:30,step:1,unit:'N'},{id:'f1',label:'Bitiş kuvveti',min:-30,max:30,step:1,unit:'N'},{id:'dx',label:'Yer değiştirme',min:1,max:12,step:1,unit:'m'}],
  model:p=>M.forceArea(p),scene:(p,r,U)=>U.graph({points:[[0,p.f0],[p.dx,p.f1]],xLabel:'Yol x (m)',yLabel:'F (N)',shade:true}),
  interpret:(p,r)=>r.work>0?'Kuvvetin net işi pozitif: cismin kinetik enerjisini artırma yönünde etki eder.':r.work<0?'Net iş negatif: kinetik enerjiyi azaltma yönünde etki eder.':'Pozitif ve negatif iş alanları birbirini götürüyor; bu kuvvetin toplam işi sıfır.',
  formula:(p,r)=>'W = F–x grafiğindeki işaretli alan\nW = (F₁ + F₂) / 2 × Δx = '+f(r.work)+' J',
  metrics:(p,r)=>metric(['İşaretli iş',f(r.work)+' J'],['Ortalama kuvvet',f(r.meanForce)+' N'],['Yer değiştirme',f(p.dx)+' m']),
  note:'Alan hesabı yalnız bu grafikte doğrusal değişen ve harekete paralel kuvvet için geçerlidir. Genel durumda alan parçalar hâlinde toplanır.'},
 {id:'power',tab:'İş, hız ve güç',title:'Açılı kuvvetin yaptığı iş ve ortalama güç',intro:'Cisim +x yönünde ilerliyor. Kuvvetin yalnız yol doğrultusundaki bileşeni iş yapar. Başlangıç kinetik enerjisine net iş eklenir.',sceneTitle:'Kuvvet oku ve iş yapan bileşen',
  defaults:{force:20,angle:60,dx:4,m:2,v0:2,seconds:2},
  controls:[{id:'force',label:'Kuvvet büyüklüğü',min:0,max:60,step:2,unit:'N'},{id:'angle',label:'Kuvvetin +x ile açısı',min:0,max:180,step:5,unit:'°'},{id:'dx',label:'Yer değiştirme',min:0,max:10,step:1,unit:'m'},{id:'seconds',label:'Geçen süre',min:1,max:10,step:1,unit:'s'},{id:'m',label:'Kütle',min:1,max:10,step:1,unit:'kg'},{id:'v0',label:'İlk sürat (+x)',min:0,max:12,step:1,unit:'m/s'}],
  model:p=>M.angled(p),
  scene:(p,r,U)=>{let b=U.line(65,267,750,267,'#7192a5',3)+block(U,295,'m='+p.m+' kg');
    const a=-p.angle*Math.PI/180,big=p.force*2.3;b+=U.arrow(295,220,big*Math.cos(a),big*Math.sin(a),'#efb873','F');
    b+=U.arrow(295,257,Math.max(-110,Math.min(110,r.parallel*3)),0,'#68e4c4','Fₓ');
    b+=U.arrow(380,306,p.dx*25,0,'#83bcf9','Δx')+U.text(70,52,'Yol: +x · Açının işareti Fₓ belirler', '#b4e6e8');
    return U.svg(b,'Açılı kuvvet ve hareket yönü');},
  interpret:(p,r)=>!r.reachable?'Bu negatif iş büyüklüğü, verilen başlangıç enerjisiyle bu yolun tamamlanmasına izin vermez. Gerçek cisim daha önce durur.':r.work>0?'Pozitif iş, bu modelde kinetik enerjiyi artırdı.':r.work<0?'Negatif iş, kinetik enerjiyi azalttı.':'Kuvvet yola dikse yaptığı iş sıfırdır.',
  formula:(p,r)=>'W = F × Δx × cosθ = '+f(r.work)+' J\nP̄ = W / Δt = '+f(r.averagePower)+' W\nW_net = ΔEₖ'+(r.reachable?' → v_son = '+f(r.finalSpeed)+' m/s':' → belirtilen yol fiziksel olarak tamamlanamaz'),
  metrics:(p,r)=>metric(['İş',f(r.work)+' J'],['Ortalama güç',f(r.averagePower)+' W'],['İlk Eₖ',f(r.initialK)+' J'],['Son Eₖ (formal)',f(r.finalK)+' J'],['Ulaşılabilir mi?',r.reachable?'Evet':'Hayır']),
  note:'Güç burada belirtilen kuvvetin ortalama gücüdür. Hareket doğrultusu +x ve bu kuvvet tek net iş yapan kuvvet varsayılmıştır.'},
 {id:'spring',tab:'Hooke & yay',title:'Hooke Yasası: yay kuvveti ve esneklik enerjisi',intro:'Yay denge konumundan x kadar uzatılır veya sıkıştırılır. Yay kuvveti her zaman dengeye doğru yönelir.',sceneTitle:'F = −kx ve esneklik potansiyel enerjisi',
  defaults:{k:80,x:.5},
  controls:[{id:'k',label:'Yay sabiti',min:10,max:200,step:10,unit:'N/m'},{id:'x',label:'Uzama (+) / sıkışma (−)',min:-1,max:1,step:.05,unit:'m'}],
  model:p=>M.spring(p),
  scene:(p,r,U)=>{let b=U.line(60,248,744,248,'#648699',3)+U.line(160,80,160,249,'#b0cfdb',6);
    const bx=490+p.x*120;b+='<path d="M160 215 '+Array.from({length:19},(_,i)=>'L'+(180+i*(bx-216)/18).toFixed(1)+' '+(i%2?192:238)).join(' ')+' L'+(bx-35)+' 215" stroke="#72dabf" fill="none" stroke-width="4"/>';
    b+=U.cart(bx,249,'#276ba0','yay ucu')+U.arrow(bx,155,Math.max(-130,Math.min(130,r.force*1.8)),0,'#ffa9ad','F_yay');
    b+=U.text(35,40,'Denge: x=0 · Sağ: uzama · Sol: sıkışma','#cfe7f2');
    return U.svg(b,'Hooke yay kuvveti ve yay uzaması');},
  interpret:(p,r)=>'Yayı denge konumundan '+(p.x>=0?'uzattın.':'sıkıştırdın.')+' Yayın geri çağırıcı kuvveti '+f(r.force)+' N. Yayda '+f(r.U)+' J enerji depolanır.',
  formula:(p,r)=>'F_yay = −kx = '+f(r.force)+' N\nE_yay = ½kx² = '+f(r.U)+' J\nYayı yavaşça geren dış kuvvetin işi = +'+f(r.workStretch)+' J',
  metrics:(p,r)=>metric(['Yay kuvveti',f(r.force)+' N'],['Depolanan E',f(r.U)+' J'],['Dış iş (0 → x)',f(r.workStretch)+' J'],['Yayın yaptığı iş (0 → x)',f(r.workSpring)+' J']),
  note:'İdeal ve esneklik sınırları içindeki yay varsayılmıştır. İşaretli x ve F önemlidir; enerji x² ile daima sıfır veya pozitiftir.'},
 {id:'gravity',tab:'Yer çekimi enerjisi',title:'Yükseklik azaldıkça potansiyel enerji kinetiğe dönüşür',intro:'Serbest düşmenin belirli bir yüksekliğindeki enerji değerlerini değiştir. Hava direnci ve sürtünme yok.',sceneTitle:'Mekanik enerji: Eₖ + Eₚ sabit',
  defaults:{m:2,g:10,h:25,v0:0},
  controls:[{id:'m',label:'Kütle',min:1,max:10,step:1,unit:'kg'},{id:'g',label:'Yerçekimi',min:5,max:15,step:1,unit:'m/s²'},{id:'h',label:'Yer seviyesinden yükseklik',min:0,max:40,step:1,unit:'m'},{id:'v0',label:'İlk sürat (aşağı)',min:0,max:12,step:1,unit:'m/s'}],
  model:p=>M.gravity({m:p.m,g:p.g,h0:40,h:p.h,v0:p.v0}),
  scene:(p,r,U)=>{const y=292-p.h*5.2;return U.svg(U.line(90,295,730,295,'#91c0d4',3)+U.line(175,45,175,295,'#a5c3d6',3)+U.line(175,y,500,y,'#8de3cf',2)+U.text(40,40,'Başlangıç: 40 m','#b6e3ec')+U.text(200,y-18,'h = '+p.h+' m','#f6d091')+'<circle cx="175" cy="'+y+'" r="17" fill="#f6bf70"/>'+U.text(320,330,'Yer: h = 0 m','#b6d5e3'),'Yükseklik ve düşen top')+potentialBars(U,r);},
  interpret:(p,r)=>'Yer çekiminin yaptığı iş '+f(r.gravityWork)+' J. Bu kadar kinetik enerji kazanılır. Toplam mekanik enerji '+f(r.total)+' J olarak kalır.',
  formula:(p,r)=>'Eₖ = ½mv² = '+f(r.K)+' J\nEₚ = mgh = '+f(r.U)+' J\nE_m = Eₖ + Eₚ = '+f(r.total)+' J',
  metrics:(p,r)=>metric(['Kinetik enerji',f(r.K)+' J'],['Potansiyel enerji',f(r.U)+' J'],['Toplam enerji',f(r.total)+' J'],['Sürat',f(r.speed)+' m/s']),
  note:'Başlangıç konumu 40 m, ilk hız aşağı doğrudur. Yalnız yer çekimi iş yapıyor; referans potansiyel sıfırı yerdir.'},
 {id:'projectile',tab:'Atışta enerji',title:'Eğik atışta enerji dönüşümü',intro:'Hava direnci yokken atışın hem çıkış hem iniş aşamasında mekanik enerji sabit kalır. Tepe noktasında yatay hız genellikle sıfır değildir.',sceneTitle:'Parabol boyunca Eₖ ↔ Eₚ',
  defaults:{m:2,v0:20,angle:45,h0:10,g:10,t:1},
  controls:[{id:'m',label:'Kütle',min:1,max:8,step:1,unit:'kg'},{id:'v0',label:'İlk hız',min:5,max:30,step:1,unit:'m/s'},{id:'angle',label:'Atış açısı',min:0,max:80,step:5,unit:'°'},{id:'h0',label:'İlk yükseklik',min:0,max:30,step:5,unit:'m'},{id:'g',label:'Yer çekimi',min:5,max:15,step:1,unit:'m/s²'},{id:'t',label:'İnceleme anı',min:0,max:10,step:.05,unit:'s'}],
  model:p=>M.projectile(p),animate:{key:'t',max:p=>M.projectile({...p,t:0}).flight},
  scene:(p,r,U)=>{const pts=Array.from({length:61},(_,i)=>M.projectile({...p,t:r.flight*i/60}));const xmax=Math.max(1,pts.at(-1).x),ymax=Math.max(1,...pts.map(q=>q.y)),sx=650/xmax,sy=240/ymax;
   const path=pts.map((q,i)=>(i?'L':'M')+(80+q.x*sx).toFixed(1)+' '+(294-q.y*sy).toFixed(1)).join(' ');
   return U.svg(U.line(56,295,755,295,'#b5d7e1',3)+'<path d="'+path+'" fill="none" stroke="#59dbc5" stroke-width="4"/><circle cx="'+(80+r.x*sx)+'" cy="'+(294-r.y*sy)+'" r="12" fill="#ffdc91"/>'+U.text(60,35,'Hava direnci yok · x yatay, y yukarı','#d3e3ed'),'Enerji korunumlu eğik atış')+potentialBars(U,r);},
  interpret:(p,r)=>r.landed?'Cisim yere ulaştı. Çarpmadan hemen önceki toplam mekanik enerji yine '+f(r.total)+' J.':'Bu anda Eₖ = '+f(r.K)+' J ve Eₚ = '+f(r.U)+' J. Toplamları değişmiyor.',
  formula:(p,r)=>'E_m = ½mv₀² + mgh₀ = '+f(r.total)+' J\nEₖ(t) = '+f(r.K)+' J · Eₚ(t) = '+f(r.U)+' J',
  metrics:(p,r)=>metric(['Geçen süre',f(r.at)+' s'],['Uçuş süresi',f(r.flight)+' s'],['Yükseklik',f(r.y)+' m'],['Eₖ',f(r.K)+' J'],['Eₚ',f(r.U)+' J'],['Eₘ',f(r.total)+' J']),
  note:'İdeal atış, hava direnci yok. Top yere indiğinde simülasyon durdurulur; yere çarpışmanın enerjisi modellenmez.'},
 {id:'friction',tab:'Sürtünme ve ısı',title:'Sürtünme mekanik enerjiyi termal enerjiye dönüştürür',intro:'Yatay zeminde hareket eden blok sürtünmeyle yavaşlar ve durur. Blok durduktan sonra ısı miktarı artmaz.',sceneTitle:'Eₖ(ilk) = Eₖ(son) + E_termal',
  defaults:{m:2,v0:12,mu:.3,g:10,distance:10},
  controls:[{id:'m',label:'Kütle',min:1,max:10,step:1,unit:'kg'},{id:'v0',label:'İlk sürat',min:2,max:20,step:1,unit:'m/s'},{id:'mu',label:'Kinetik sürtünme katsayısı',min:0,max:1,step:.05,unit:''},{id:'g',label:'Yerçekimi',min:5,max:15,step:1,unit:'m/s²'},{id:'distance',label:'İstenen yol',min:0,max:50,step:1,unit:'m'}],
  model:p=>M.friction(p),
  scene:(p,r,U)=>U.svg(U.line(65,266,745,266,'#a1c5d3',3)+U.cart(145+Math.min(r.traveled,50)*11,257,'#328b9b','blok')+U.arrow(145+Math.min(r.traveled,50)*11,160,-Math.min(140,r.frictionForce*3),0,'#ffa49c','fₖ')+U.text(60,45,'Alınan gerçek yol = '+f(r.traveled)+' m','#cfeaf2'),'Sürtünmeli düzlem ve blok')+U.energyBars([{label:'Kalan kinetik',value:r.K,color:'#66b9ff'},{label:'Termal enerji',value:r.thermal,color:'#ffa776'},{label:'Başlangıç kinetik',value:r.initialK,color:'#9be7cb'}]),
  interpret:(p,r)=>r.stopped?'Blok '+f(r.stopDistance)+' m sonra durdu. Yol sürgüsünü daha çok artırmak fiziksel yolu artırmaz.':'Bu mesafede sürtünme '+f(r.thermal)+' J mekanik enerjiyi termal enerjiye dönüştürdü.',
  formula:(p,r)=>'fₖ = μₖmg = '+f(r.frictionForce)+' N\nW_sürtünme = −'+f(r.thermal)+' J\nEₖ(ilk) = Eₖ(son) + E_termal',
  metrics:(p,r)=>metric(['Başlangıç Eₖ',f(r.initialK)+' J'],['Son Eₖ',f(r.K)+' J'],['Termal enerji',f(r.thermal)+' J'],['Durma mesafesi',Number.isFinite(r.stopDistance)?f(r.stopDistance)+' m':'Sürtünme yok'],['Gerçek yol',f(r.traveled)+' m'],['Sürat',f(r.speed)+' m/s']),
  note:'Yalnız kinetik sürtünme ve yatay hareket; sıcaklık artışı değil, termal enerjiye dönüşen miktar hesaplanır. μₖ=0 için durma mesafesi sonsuzdur.'},
 {id:'exchange',tab:'Yayda enerji',title:'Yayda potansiyel ve kinetik enerji değişimi',intro:'İdeal sürtünmesiz yay sisteminde uç konumda enerji yayda; denge konumunda kinetik enerjidedir.',sceneTitle:'Yay + blok · enerji paylaşımı',
  defaults:{k:100,m:2,amplitude:.8,percent:50},
  controls:[{id:'k',label:'Yay sabiti',min:20,max:180,step:10,unit:'N/m'},{id:'m',label:'Blok kütlesi',min:1,max:10,step:1,unit:'kg'},{id:'amplitude',label:'En büyük uzama (genlik)',min:.2,max:1.2,step:.1,unit:'m'},{id:'percent',label:'Anlık konum / genlik',min:-100,max:100,step:5,unit:'%'}],
  model:p=>M.springExchange({k:p.k,m:p.m,amplitude:p.amplitude,x:p.amplitude*p.percent/100}),
  scene:(p,r,U)=>{const x=p.amplitude*p.percent/100,bx=420+x*180;return U.svg(U.line(60,265,738,265,'#90b2c5',3)+U.line(125,120,125,265,'#b5d0dd',5)+'<path d="M125 235 '+Array.from({length:19},(_,i)=>'L'+(150+i*(bx-190)/18)+' '+(i%2?218:252)).join(' ')+' L'+(bx-35)+' 235" stroke="#83e1ca" fill="none" stroke-width="4"/>'+U.cart(bx,259,'#338d9c','m')+U.text(60,43,'Denge: x=0 · Anlık x='+f(x)+' m','#dbebf0'),'Yay ve blok enerji paylaşımı')+potentialBars(U,r);},
  interpret:(p,r)=>'Konum '+f(p.amplitude*p.percent/100)+' m. Enerjinin '+f(r.U)+' J kısmı yayda, '+f(r.K)+' J kısmı blokta.',
  formula:(p,r)=>'E_yay = ½kx² = '+f(r.U)+' J\nEₖ = ½k(A²−x²) = '+f(r.K)+' J\nE_m = ½kA² = '+f(r.total)+' J',
  metrics:(p,r)=>metric(['Yay potansiyeli',f(r.U)+' J'],['Kinetik enerji',f(r.K)+' J'],['Toplam enerji',f(r.total)+' J'],['Sürat büyüklüğü',f(r.speed)+' m/s']),
  note:'Yalnız ideal yay ve sürtünmesiz zemin. Konum sürgüsü zamanı temsil etmez; hızın yönü verilmez, sadece sürat büyüklüğü gösterilir.'}
];
const questions=[
['10 N kuvvet cismi kuvvet yönünde 5 m götürürse yaptığı iş?',['2 J','15 J','50 J','0 J','500 J'],2,'W = FΔx = 10×5 = 50 J.'],
['Kuvvet ile yer değiştirme arasında 90° varsa yapılan iş?',['Pozitif','Negatif','Sıfır','Kuvvet kadar','Sonsuz'],2,'cos90°=0 olduğu için iş sıfırdır.'],
['F–x grafiğinin işaretli alanı neyi verir?',['Güç','İş','Kütle','İvme','Hız'],1,'F–x altında kalan işaretli alan iştir.'],
['Bir kuvvetin yaptığı iş 60 J ve süre 3 s. Ortalama gücü?',['10 W','20 W','30 W','60 W','180 W'],1,'P̄=W/Δt=60/3=20 W.'],
['Kinetik enerji hangi değişkene göre karesel artar?',['Kütle','Yer çekimi','Sürat','Yükseklik','Zaman'],2,'Eₖ=½mv². Sürat iki katına çıkarsa enerji dört katına çıkar.'],
['Kütle 2 kg, sürat 3 m/s. Kinetik enerji?',['3 J','6 J','9 J','12 J','18 J'],2,'Eₖ=½×2×9=9 J.'],
['Yerden 5 m yüksekte 2 kg cisim için Eₚ (g=10)?',['10 J','20 J','50 J','100 J','200 J'],3,'Eₚ=mgh=2×10×5=100 J.'],
['İdeal yayda uzama iki katına çıkarsa depolanan enerji?',['Yarıya','Değişmez','İki katına','Dört katına','Sekiz katına'],3,'E_yay=½kx².'],
['Hooke yasası yay kuvvetini nasıl verir?',['F=k/x','F=−kx','F=mv','F=mgx','F=kx²'],1,'Geri çağırıcı kuvvet F=−kx: işaret dengeye yönelişi gösterir.'],
['Yay 100 N/m ve 0,2 m uzatılmışsa depolanan enerji?',['1 J','2 J','4 J','10 J','20 J'],1,'E=½×100×(0,2)²=2 J.'],
['Yalnız yer çekiminin etkisiyle düşen cismin mekanik enerjisi?',['Artar','Azalır','Değişmez','Daima sıfır','Kütleye bağlı değildir'],2,'Hava direnci yoksa Eₖ+Eₚ sabittir.'],
['Bir cisim sürtünmeli yatay zeminde durursa kinetik enerji nereye gider?',['Yok olur','Yalnız potansiyele','Termal enerjiye','Kütleye','Momentum olur'],2,'Enerji kaybolmaz; sürtünmeyle termal enerjiye dönüşür.'],
['Sürtünme kuvveti harekete zıt 5 N ve alınan yol 4 m. Sürtünmenin yaptığı iş?',['−20 J','−9 J','0 J','20 J','40 J'],0,'W=−f×d=−5×4=−20 J.'],
['Sürtünmesiz düşüşte potansiyel enerji 30 J azaldıysa kinetik enerji değişimi?',['−30 J','0 J','+15 J','+30 J','+60 J'],3,'Toplam mekanik enerji sabit; ΔEₖ=−ΔEₚ.'],
['Bir cismin kinetik enerjisini değiştiren büyüklük?',['Net iş','Net momentum','Zaman tek başına','Basınç','Kütle tek başına'],0,'İş–enerji teoremi W_net=ΔEₖ.'],
['Yer çekimi potansiyeli için referans yüksekliği değiştirmek hangi sonucu değiştirir?',['Kuvvet','İş','Enerji farkı','Seçilen Eₚ değeri','Hız'],3,'Referans değişirse Eₚ sayısal değeri değişir; enerji farkı ve hareket değişmez.'],
['Eğik atışın tepe noktasında (hava direnci yok) toplam hız?',['Her zaman sıfır','Sadece yatay bileşen kalır','Artar','Yer çekimi sıfırdır','Hız sonsuz'],1,'Düşey hız sıfırlanır, yatay hız kalır.'],
['Bir yay + blok sürtünmesiz sistemde denge konumunda hangi enerji en büyüktür?',['Esneklik potansiyeli','Kinetik','Termal','Yer çekimi potansiyeli','Hiçbiri'],1,'Yay x=0 konumunda E_yay=0; toplam enerji kinetiktedir.']
].map(([q,options,answer,why])=>({q,options,answer,why}));
w.FizikEnerjiLab=UI.create({sections,questions});
})(window);
