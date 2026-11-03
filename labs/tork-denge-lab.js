/* AYT 2018 MEB: Tork 11.1.8.1–3; Denge 11.1.9.1–3.
 * Eight completely parameter-driven observations. No mandatory quiz.
 * The diagrams show forces and balance, not unmodeled rotation animation.
 */
(function(w){'use strict';
const M=w.TorkDengeMath,UI=w.MekanikUI;if(!M||!UI)return;
const f=UI.U.fmt,rows=(...r)=>r;
const color={good:'#6fe7c5',bad:'#ff9b9d',gold:'#f5c974',blue:'#82c6ff'};
const tol=n=>Math.abs(n)<1e-8;
const statusTorque=t=>tol(t)?'Net tork sıfır: dönme eğilimi yok.':t>0?'Net tork saat yönünün tersine (⟲): sağ el başparmağı ekrandan dışarı (⊙).':'Net tork saat yönünde (⟳): sağ el başparmağı ekrana doğru (⊗).';
const marker=(U,x,y,s,c='#f5c974')=>'<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+c+'" stroke="#fff" stroke-width="1.3"/>'+U.text(x+10,y-11,s,c,15);
const stripe=(U,y=256)=>U.line(45,y,754,y,'#779eb5',3);
const torqScene=(p,o,U,door)=>{
 const cx=door?160:400,cy=215,scale=door?420:85,x=cx+p.r*scale,a=p.angle*Math.PI/180;
 let b=door?'<rect x="160" y="185" width="520" height="56" fill="#17445c" stroke="#7dc7ce" stroke-width="3" rx="10"/>'+U.text(500,286,'Üstten bakış · kapı','#b8d5df'):
  stripe(U,cy)+'<rect x="114" y="205" width="576" height="20" fill="#1a5874" stroke="#94d5df"/>';
 b+=marker(U,cx,cy,'Dönme ekseni ⊙','#e2ce89');
 b+=marker(U,x,cy,'F uygulama noktası','#78d4e9');
 const len=Math.min(135,p.F*1.5);
 b+=U.arrow(x,cy,-Math.cos(a)*0+Math.cos(a)*len,-Math.sin(a)*len,'#fcbe84','F');
 b+=U.text(45,46,'+ tork: ⟲ ve ⊙   |   − tork: ⟳ ve ⊗','#c9e7ed',16);
 b+=U.text(45,81,'Dik kuvvet bileşeni: '+f(o.fy)+' N','#d0c7af',16);
 b+=U.text(45,330,'Dik uzaklık: '+f(o.arm)+' m   ·   τ = '+f(o.tau)+' N·m','#92e8d2',18);
 if(door)b+=U.text(45,112,'Kol uzunluğu arttıkça aynı dik kuvvet daha büyük tork üretir.','#b2dce6',15);
 return U.svg(b,'Kuvvet kolu, açı, uygulama noktası ve tork yönü');
};
const sections=[
 {id:'torque',tab:'Torku keşfet',title:'Dönme etkisini kuvvet, uzaklık ve açıyla keşfet',
  intro:'Çubuğun ortası dönme ekseni. Kuvvetin uygulama noktasını, yönünü ve büyüklüğünü değiştir; torku sıfırla veya tersine çevir. Şekildeki dönme oku hareket animasyonu değil, dönme eğilimidir.',
  sceneTitle:'Uygulama noktası + kuvvet vektörü + dönme yönü',
  defaults:{r:2,F:40,angle:90},
  controls:[{id:'r',label:'Eksenden işaretli uzaklık (+ sağ)',min:-3,max:3,step:.25,unit:'m'},
   {id:'F',label:'Kuvvet büyüklüğü',min:0,max:80,step:5,unit:'N'},
   {id:'angle',label:'Kuvvetin +x ile açısı',min:-180,max:180,step:5,unit:'°'}],
  model:p=>M.torque(p),scene:(p,o,U)=>torqScene(p,o,U,false),
  interpret:(p,o)=>statusTorque(o.tau)+(tol(o.tau)?' Eksene uygulanırsa veya kuvvet çubuğa paralelse tork sıfır olabilir.':' Dönme etkisini hem kuvvet hem dik uzaklık belirler.'),
  formula:(p,o)=>'τ = r × F × sinθ = '+f(o.tau)+' N·m\nFᵧ = F sinθ = '+f(o.fy)+' N\nDik kuvvet kolu = |r sinθ| = '+f(o.arm)+' m',
  metrics:(p,o)=>rows(['İşaretli tork',f(o.tau)+' N·m'],['Dik kuvvet',f(o.fy)+' N'],['Dik kuvvet kolu',f(o.arm)+' m'],['Dönme yönü',o.side==='ccw'?'⟲ Saatin tersi':o.side==='cw'?'⟳ Saat yönü':'Tork yok']),
  note:'Tork ekrana dik bir vektördür: saat yönünün tersi (+) dışarı ⊙, saat yönü (−) içeri ⊗. Bu laboratuvar dönme eğilimini hesaplar; açısal ivme veya gerçek dönme zamanı hesaplamaz.'},
 {id:'door',tab:'Kapı kolu',title:'Kapıyı neden menteşeden uzaktan, dik itersin?',
  intro:'Aynı kapıda menteşeye yakın/uzak noktayı ve kuvvetin açısını değiştir. Kapıyı döndürmek için kuvvetin kapıya dik bileşeni önemlidir.',
  sceneTitle:'Kapı · üstten görünüş',
  defaults:{r:.9,F:30,angle:90},
  controls:[{id:'r',label:'Menteşeden uygulama uzaklığı',min:.1,max:1.2,step:.1,unit:'m'},
  {id:'F',label:'İtme kuvveti',min:0,max:80,step:5,unit:'N'},
  {id:'angle',label:'Kapıya göre kuvvet açısı',min:-180,max:180,step:5,unit:'°'}],
  model:p=>M.torque(p),scene:(p,o,U)=>torqScene(p,o,U,true),
  interpret:(p,o)=>tol(o.tau)?'Kapı dönme eğilimi göstermiyor: kuvvet menteşe doğrultusunda olabilir veya kuvvet sıfırdır.':o.tau>0?'Kapıyı saat yönünün tersine döndürmeye çalışıyorsun.':'Kapıyı saat yönünde döndürmeye çalışıyorsun.',
  formula:(p,o)=>'τ = rF sinθ = '+f(o.tau)+' N·m\nEtkin dik kol = '+f(o.arm)+' m',
  metrics:(p,o)=>rows(['Dönme etkisi',f(o.tau)+' N·m'],['Dik kuvvet',f(o.fy)+' N'],['Uygulama uzaklığı',f(p.r)+' m']),
  note:'Günlük yaşam örneği: kapı kolunun menteşeye uzak olması, aynı dik kuvvetle daha büyük tork üretir. Kolun dönmeye etkisi, çubuk boyu tek başına değildir.'},
 {id:'seesaw',tab:'Tahterevalliyi dengele',title:'İki ayrı şart: net kuvvet sıfır, net tork sıfır',
  intro:'Sol ve sağ aşağı yönlü kuvvetleri, eksene uzaklıkları ve yukarı destek kuvvetini değiştir. İkisini de aynı anda sıfıra getirmeyi dene.',
  sceneTitle:'Kendi denge deneyin',
  defaults:{leftArm:2,rightArm:2,leftForce:40,rightForce:40,support:80},
  controls:[{id:'leftArm',label:'Sol ağırlığın kolu',min:.5,max:3,step:.25,unit:'m'},
  {id:'rightArm',label:'Sağ ağırlığın kolu',min:.5,max:3,step:.25,unit:'m'},
  {id:'leftForce',label:'Sol aşağı kuvvet',min:0,max:100,step:5,unit:'N'},
  {id:'rightForce',label:'Sağ aşağı kuvvet',min:0,max:100,step:5,unit:'N'},
  {id:'support',label:'Yukarı destek kuvveti',min:0,max:200,step:5,unit:'N'}],
  model:p=>M.seesaw(p),
  scene:(p,o,U)=>{const l=400-p.leftArm*86,r=400+p.rightArm*86;
   let b=stripe(U,221)+U.arrow(l,130,0,Math.min(95,p.leftForce*.9),'#ffa8a4','F_sol')
    +U.arrow(r,130,0,Math.min(95,p.rightForce*.9),'#ffcb8a','F_sağ')
    +U.arrow(400,285,0,-Math.min(110,p.support*.5),'#7fe5c6','R');
   b+='<path d="M375 277 L400 232 L425 277 Z" fill="#546e85" stroke="#e1eff0" stroke-width="2"/>';
   b+=marker(U,l,221,'sol')+marker(U,r,221,'sağ');
   b+=U.text(70,43,'ΣFᵧ = '+f(o.netFy)+' N','#d8eaf4')+U.text(70,73,'Στ = '+f(o.netTau)+' N·m','#9eecd6');
   return U.svg(b,'Sol ve sağ kuvvetler ile destek tepkisi');},
  interpret:(p,o)=>o.equilibrium?'✅ Tam dengeyi buldun! Hem ΣFᵧ = 0 hem Στ = 0.':
   (o.rotationalBalance?'Net tork sıfır, ama net kuvvet sıfır değil. Dönmemek, tek başına tam denge demek değildir.':
   o.translationalBalance?'Net kuvvet sıfır, ama net tork sıfır değil. Cisim dönme eğilimi gösterir.':
   'İki denge şartı da sağlanmıyor. Önce sol–sağ torkları eşitle, sonra destek kuvvetini ayarla.')+
   ' Sağ kuvvet için denge hedefi '+f(o.requiredRight)+' N; destek için '+f(o.requiredSupport)+' N.',
  formula:(p,o)=>'Στ = F_sol × r_sol − F_sağ × r_sağ = '+f(o.netTau)+' N·m\nΣFᵧ = R − F_sol − F_sağ = '+f(o.netFy)+' N',
  metrics:(p,o)=>rows(['Sol tork (+)',f(o.tauLeft)+' N·m'],['Sağ tork (−)',f(o.tauRight)+' N·m'],
   ['Net tork',f(o.netTau)+' N·m'],['Net kuvvet',f(o.netFy)+' N'],['Hedef sağ F',f(o.requiredRight)+' N'],['Hedef destek',f(o.requiredSupport)+' N']),
  note:'Tek destekten yukarı yönlü kuvvet gelen, kütlesiz ideal tahterevalli. Denge için ΣF=0 ve Στ=0 birlikte gereklidir. Kararlı/dinamik dönme ayrıntıları burada modellenmez.'},
 {id:'supports',tab:'İki destekli kiriş',title:'Yükü kaydır: hangi destek daha çok kuvvet uygular?',
  intro:'Bir kiriş iki serbest desteğe dayanıyor. Kirişin kendi ağırlığı ortasından, ek yük kendi konumundan aşağı etkir. Kütleleri ve destek yerlerini değiştir.',
  sceneTitle:'Düşey kuvvetler ve destek tepkileri',
  defaults:{length:6,beamMass:4,loadMass:3,loadX:4,leftSupport:0,rightSupport:5,g:10},
  controls:[{id:'beamMass',label:'Düzgün kiriş kütlesi',min:0,max:10,step:1,unit:'kg'},
  {id:'loadMass',label:'Ek yük kütlesi',min:0,max:12,step:1,unit:'kg'},
  {id:'loadX',label:'Ek yükün konumu',min:0,max:6,step:.5,unit:'m'},
  {id:'leftSupport',label:'Sol destek konumu',min:0,max:2,step:.5,unit:'m'},
  {id:'rightSupport',label:'Sağ destek konumu',min:4,max:6,step:.5,unit:'m'},
  {id:'g',label:'Yerçekimi',min:5,max:15,step:1,unit:'m/s²'}],
  model:p=>M.supports(p),
  scene:(p,o,U)=>{const xx=x=>90+x*100,A=xx(p.leftSupport),B=xx(p.rightSupport),load=xx(p.loadX);
   let b='<rect x="90" y="172" width="600" height="20" fill="#305e78" stroke="#a3cfdc" stroke-width="2" rx="3"/>';
   b+=U.arrow(xx(3),100,0,Math.min(80,o.beamWeight),'#ffa6b1','W_kiriş');
   b+=U.arrow(load,104,0,Math.min(80,o.loadWeight*1.3),'#ffd084','W_yük');
   const ra=Math.max(12,Math.min(105,Math.abs(o.RA))),rb=Math.max(12,Math.min(105,Math.abs(o.RB)));
   b+=U.arrow(A,272,0,o.RA>=0?-ra:ra,o.RA>=0?'#70e6c6':'#ff9b9d','R_A');
   b+=U.arrow(B,272,0,o.RB>=0?-rb:rb,o.RB>=0?'#70e6c6':'#ff9b9d','R_B');
   b+='<path d="M'+(A-25)+' 289 L'+A+' 261 L'+(A+25)+' 289 Z M'+(B-25)+' 289 L'+B+' 261 L'+(B+25)+' 289 Z" fill="#42586e" stroke="#e0eff4" stroke-width="2"/>';
   b+=U.text(52,34,'Yeşil: basan destek · Kırmızı: olamayacak negatif tepki','#cfe9ed',15);
   return U.svg(b,'Kirişin ağırlığı, yük ve iki destek tepkisi');},
  interpret:(p,o)=>!o.feasible?'⚠️ Bu konumda cebirsel olarak negatif destek kuvveti gerekiyor. Serbest destek aşağı çekemez; kiriş bir destekten ayrılır. Bu düzen 2 destekle fiziksel olarak dengede tutulamaz.':
   '✅ İki destek de kirişe yukarı itme uyguluyor. R_A + R_B = toplam ağırlık ve momentler sıfır. Ek yükün yerini değiştirince tepkiler yeniden paylaşılır.',
  formula:(p,o)=>'R_A + R_B = (m_kiriş + m_yük)g = '+f(o.totalWeight)+' N\nR_B(b−a) = m_kiriş g(L/2−a) + m_yük g(x−a)\nR_A = '+f(o.RA)+' N; R_B = '+f(o.RB)+' N',
  metrics:(p,o)=>rows(['Sol destek',f(o.RA)+' N'],['Sağ destek',f(o.RB)+' N'],['Toplam ağırlık',f(o.totalWeight)+' N'],['ΣFᵧ (cebirsel)',f(o.netFy)+' N'],['Στ, A noktasında',f(o.netTauA)+' N·m'],['Fiziksel denge',o.feasible?'Mümkün':'Mümkün değil']),
  note:'Düzgün ve yatay kiriş, noktasal ek yük, düşey kuvvetler; destekler sadece yukarı itebilir. Negatif tepki gerçek denge değildir; o destek yerden ayrılır.'},
 {id:'shelf',tab:'Halatlı raf',title:'Duvara bağlı rafta halat ve menteşe kuvvetleri',
  intro:'Yatay, düzgün bir rafı ucundan çekerek tutan ideal halatın açısını değiştir. Halatın düşey bileşeni gerekli torku sağlar; yatay bileşeni menteşe dengeler.',
  sceneTitle:'Raf + halat + menteşe kuvvetleri',
  defaults:{length:4,beamMass:3,loadMass:4,loadFraction:.75,angle:45,g:10},
  controls:[{id:'length',label:'Raf boyu',min:2,max:6,step:.5,unit:'m'},
  {id:'beamMass',label:'Rafın kütlesi',min:0,max:10,step:1,unit:'kg'},
  {id:'loadMass',label:'Üzerindeki yük',min:0,max:10,step:1,unit:'kg'},
  {id:'loadFraction',label:'Yükün göreli konumu',min:0,max:1,step:.05,unit:'×L'},
  {id:'angle',label:'Halatın yataya açısı',min:20,max:85,step:5,unit:'°'},
  {id:'g',label:'Yerçekimi',min:5,max:15,step:1,unit:'m/s²'}],
  model:p=>M.shelf(p),
  scene:(p,o,U)=>{const Lx=650,y=233,load=135+(Lx-135)*p.loadFraction;
   let b='<rect x="110" y="57" width="24" height="260" fill="#416078"/><rect x="135" y="222" width="515" height="24" fill="#2b7391" stroke="#92d5df" rx="5"/>';
   b+=U.arrow(650,222,-140*Math.cos(p.angle*Math.PI/180),-140*Math.sin(p.angle*Math.PI/180),'#6ee8cb','T');
   b+=U.arrow(390,122,0,70,'#ffb9a0','W_raf')+U.arrow(load,112,0,90,'#ffd085','W_yük');
   b+=U.arrow(135,200,Math.min(120,o.hingeRx),0,'#89baff','Rₓ');
   b+=U.arrow(135,256,0,-Math.sign(o.hingeRy)*Math.min(80,Math.abs(o.hingeRy)),'#c0a4ff','Rᵧ');
   b+=U.text(50,40,'Halat yönü: sola + yukarı, raf yatay','#cfe8ed',16);
   return U.svg(b,'Rafın üzerine etki eden kuvvetler; halat çekmesi ve menteşe');},
  interpret:(p,o)=>'Halat gerilmesi '+f(o.tension)+' N. Açı küçülürse aynı denge torku için daha yüksek gerilme gerekir. Menteşenin düşey tepkisi yukarı veya aşağı yönlü olabilir.',
  formula:(p,o)=>'Στ_menteşe = TL sinθ − W_raf(L/2) − W_yük x = 0\nT = '+f(o.tension)+' N\nRₓ = '+f(o.hingeRx)+' N ; Rᵧ = '+f(o.hingeRy)+' N',
  metrics:(p,o)=>rows(['Halat gerilmesi',f(o.tension)+' N'],['Halat yatay kuvveti',f(o.tensionX)+' N'],['Halat düşey kuvveti',f(o.tensionY)+' N'],['Menteşe Rₓ',f(o.hingeRx)+' N'],['Menteşe Rᵧ',f(o.hingeRy)+' N'],['Στ',f(o.netTau)+' N·m']),
  note:'Halat sürtünmesiz, raf yatay ve düzgün, menteşe her iki yönde kuvvet aktarabilen ideal sabit pimdir. Rafın üzerine etki eden kuvvetler gösterilir; halat uzunluğu veya elastikliği modellenmez.'},
 {id:'center',tab:'Kütle merkezi (2B)',title:'Üç kütlenin ortak kütle merkezini bul',
  intro:'Üç kütleyi x-y düzleminde farklı konumlara taşı ve kütlelerini değiştir. Mor işaret, tüm noktasal kütlelerin ortak kütle merkezidir.',
  sceneTitle:'İki boyutta ağırlıklı ortalama',
  defaults:{m1:2,m2:3,m3:4,x1:1,y1:1,x2:6,y2:1,x3:4,y3:4},
  controls:[{id:'m1',label:'1. noktanın kütlesi',min:1,max:10,step:1,unit:'kg'},
  {id:'x1',label:'1. nokta x',min:0,max:8,step:.5,unit:'m'},
  {id:'y1',label:'1. nokta y',min:0,max:5,step:.5,unit:'m'},
  {id:'m2',label:'2. noktanın kütlesi',min:1,max:10,step:1,unit:'kg'},
  {id:'x2',label:'2. nokta x',min:0,max:8,step:.5,unit:'m'},
  {id:'y2',label:'2. nokta y',min:0,max:5,step:.5,unit:'m'},
  {id:'m3',label:'3. noktanın kütlesi',min:1,max:10,step:1,unit:'kg'},
  {id:'x3',label:'3. nokta x',min:0,max:8,step:.5,unit:'m'},
  {id:'y3',label:'3. nokta y',min:0,max:5,step:.5,unit:'m'}],
  model:p=>M.center({masses:[p.m1,p.m2,p.m3],points:[[p.x1,p.y1],[p.x2,p.y2],[p.x3,p.y3]]}),
  scene:(p,o,U)=>{const xx=x=>74+x*80,yy=y=>300-y*49;let b=U.line(64,300,750,300,'#8fb4c8',2)+U.line(74,313,74,33,'#8fb4c8',2);
   const places=[[p.x1,p.y1,p.m1,'#72c6f0'],[p.x2,p.y2,p.m2,'#fac17e'],[p.x3,p.y3,p.m3,'#8ce7af']];
   for(let i=0;i<3;i++){const [x,y,m,c]=places[i];b+='<circle cx="'+xx(x)+'" cy="'+yy(y)+'" r="'+(9+m*1.8)+'" fill="'+c+'" stroke="white" stroke-width="1.5"/>'+U.text(xx(x)+14,yy(y)-15,'m'+(i+1)+'='+m+' kg',c,14);}
   b+=U.line(xx(o.x)-18,yy(o.y),xx(o.x)+18,yy(o.y),'#e5a5ff',4)+U.line(xx(o.x),yy(o.y)-18,xx(o.x),yy(o.y)+18,'#e5a5ff',4)+U.text(58,38,'✳ Mor: ortak kütle merkezi','#e5a5ff',17);
   return U.svg(b,'İki boyutta üç noktasal kütle ve ortak kütle merkezi');},
  interpret:(p,o)=>'Kütle merkezi: ('+f(o.x)+' m, '+f(o.y)+' m). Büyük kütleye yaklaşır, fakat konumu her noktanın hem kütlesi hem konumuna bağlıdır.',
  formula:(p,o)=>'x_KM = (m₁x₁ + m₂x₂ + m₃x₃)/(m₁+m₂+m₃) = '+f(o.x)+' m\ny_KM = (m₁y₁ + m₂y₂ + m₃y₃)/(m₁+m₂+m₃) = '+f(o.y)+' m',
  metrics:(p,o)=>rows(['Toplam kütle',f(o.mass)+' kg'],['Kütle merkezi x',f(o.x)+' m'],['Kütle merkezi y',f(o.y)+' m']),
  note:'Noktasal kütlelerin düzlemdeki kütle merkezi hesaplanır. Her noktadaki g aynıysa ağırlık merkezi de aynı yerdedir.'},
 {id:'cg',tab:'Kütle ≠ ağırlık merkezi?',title:'Kütle merkezi ve ağırlık merkezi ne zaman ayrılır?',
  intro:'Günlük küçük cisimlerde yerçekimi yaklaşık eşittir, merkezler çakışır. İkinci noktadaki yerçekimi farklı olursa iki merkez arasındaki farkı gözlemle.',
  sceneTitle:'Mor: KM · Sarı: ağırlık merkezi',
  defaults:{m1:3,m2:3,x1:1,x2:7,g1:10,g2:10},
  controls:[{id:'m1',label:'Soldaki kütle',min:1,max:10,step:1,unit:'kg'},
  {id:'m2',label:'Sağdaki kütle',min:1,max:10,step:1,unit:'kg'},
  {id:'x1',label:'Sol konum',min:0,max:3,step:.5,unit:'m'},
  {id:'x2',label:'Sağ konum',min:5,max:8,step:.5,unit:'m'},
  {id:'g1',label:'Sol noktada g',min:5,max:15,step:1,unit:'m/s²'},
  {id:'g2',label:'Sağ noktada g',min:5,max:15,step:1,unit:'m/s²'}],
  model:p=>M.gravityCenter(p),
  scene:(p,o,U)=>{const xx=x=>65+x*81;let b=stripe(U,232)+
   marker(U,xx(p.x1),232,'m₁='+p.m1+' kg','#81caff')+
   marker(U,xx(p.x2),232,'m₂='+p.m2+' kg','#9fe3aa');
   b+=U.line(xx(o.massCenter),150,xx(o.massCenter),290,'#d7a9ff',3)+U.text(xx(o.massCenter)-35,136,'KM','#d7a9ff');
   b+=U.line(xx(o.weightCenter),185,xx(o.weightCenter),325,'#ffd17e',3)+U.text(xx(o.weightCenter)+5,180,'AM','#ffd17e');
   b+=U.text(55,43,'Farklı g: yer çekimi kuvvetleri farklı ağırlıklanır.','#cce7f0');
   return U.svg(b,'Kütle merkezi ve ağırlık merkezinin farklı g alanlarında ayrılması');},
  interpret:(p,o)=>o.same?'✅ Yerçekimi değerleri eşitse bu örnekte kütle merkezi ve ağırlık merkezi aynı yerde.':'Bu düşünce deneyinde yerçekimi iki noktada farklı. Ağırlık merkezi, daha büyük mg üreten noktaya kütle merkezinden daha yakın olabilir.',
  formula:(p,o)=>'x_KM = Σ(mx)/Σm = '+f(o.massCenter)+' m\nx_AM = Σ(mgx)/Σ(mg) = '+f(o.weightCenter)+' m\nFark = '+f(o.difference)+' m',
  metrics:(p,o)=>rows(['Kütle merkezi',f(o.massCenter)+' m'],['Ağırlık merkezi',f(o.weightCenter)+' m'],['Aralarındaki fark',f(o.difference)+' m'],['Sol ağırlık',f(o.w1)+' N'],['Sağ ağırlık',f(o.w2)+' N']),
  note:'MEB kapsamındaki kavram farkını göstermek için yerçekimi yönleri paralel ama büyüklükleri farklı seçilmiştir. Yeryüzündeki küçük cisimlerde g yaklaşık düzgün olduğundan merkezler genellikle çakışır. Bu değişken g örneği sınav hesabı zorunluluğu değildir.'},
 {id:'base',tab:'Devrilme sınırı',title:'Ağırlık doğrusu destek alanının dışına çıkarsa?',
  intro:'Bir cismin ağırlık bileşkesinin yere uzanan doğrusu destek tabanının içinde mi? Tabanı genişlet veya ağırlık doğrultusunu kaydır.',
  sceneTitle:'Destek aralığı, ağırlık çizgisi ve devrilme eğilimi',
  defaults:{width:3,centerX:0,m:4,g:10},
  controls:[{id:'width',label:'Tabanın genişliği',min:1,max:6,step:.5,unit:'m'},
  {id:'centerX',label:'Ağırlık doğrusunun yatay konumu',min:-5,max:5,step:.25,unit:'m'},
  {id:'m',label:'Toplam kütle',min:1,max:10,step:1,unit:'kg'},
  {id:'g',label:'Yerçekimi',min:5,max:15,step:1,unit:'m/s²'}],
  model:p=>M.baseSupport(p),
  scene:(p,o,U)=>{const xx=x=>400+x*53,lp=xx(o.left),rp=xx(o.right),c=xx(p.centerX);
   let b=U.line(48,284,752,284,'#627f96',3)+'<rect x="'+lp+'" y="268" width="'+(rp-lp)+'" height="18" rx="4" fill="#4b98a0" stroke="#a5f2e5"/>';
   b+=U.line(c,80,c,305,p.centerX<o.left||p.centerX>o.right?'#ff9a9e':'#79ecd2',3);
   b+=U.arrow(c,95,0,125,'#f4c77c','mg')+'<circle cx="'+c+'" cy="80" r="12" fill="#d4a0f6"/>';
   b+=U.text(48,36,'Yeşil: destek tabanı · Mor: kütle merkezi · Sarı: ağırlık','#c9e9ef',15);
   b+=U.text(48,332,'Ağırlık doğrusu: x='+f(p.centerX)+' m · taban: '+f(o.left)+' … '+f(o.right)+' m','#d1e6f0',16);
   return U.svg(b,'Ağırlık doğrusu ile destek tabanının izdüşümü');},
  interpret:(p,o)=>!o.inside?'⚠️ Ağırlık doğrusu destek alanının dışında: yalnız yukarı itebilen taban tepkisi dengeyi sağlayamaz; '+(o.status==='left'?'sola':'sağa')+' devrilme eğilimi var.':
   Math.abs(Math.abs(p.centerX)-p.width/2)<1e-8?'⚠️ Ağırlık doğrusu tam kenarda: sınır durum. Küçük bir kayma devrilmeye yol açabilir.':
   '✅ Ağırlık doğrusu tabanın içinde. Düz zeminde uygun destek tepkisiyle statik denge kurulabilir.',
  formula:(p,o)=>'Destek alanı: ['+f(o.left)+', '+f(o.right)+'] m\nAğırlık = mg = '+f(o.weight)+' N\n'+(o.inside?'Destek tepkisinin uygulama noktası, ağırlık doğrultusunda olabilir.':'Kenara göre devrilme torku = '+f(o.tippingTorque)+' N·m'),
  metrics:(p,o)=>rows(['Taban sınırları',f(o.left)+' … '+f(o.right)+' m'],['Ağırlık doğrusu',f(p.centerX)+' m'],['Ağırlık büyüklüğü',f(o.weight)+' N'],['Destek dengesi',o.inside?'Kurulabilir':'Kurulamaz']),
  note:'Bu deney denge ve kütle merkezi kavramının günlük yaşam uygulamasıdır; cismi düşürüp döndürmez. Sürtünmesiz yatay doğrultu ve tabanın sadece yukarı tepki vermesi varsayılır.'}
];
w.TorkDengeLab=UI.create({sections,questions:[]});
})(window);
