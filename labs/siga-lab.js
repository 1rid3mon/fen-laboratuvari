/* Interactive electrostatic potential and capacitance observations. */
(function(w){'use strict';const M=w.SigaMath,U=w.MekanikUI;if(!M||!U)return;const u=U.U,f=u.fmt;
const c=(id,label,min,max,step,unit)=>({id,label,min,max,step,unit});
const cap=c('cap','Sığa',1,12,.5,'µF'),voltage=c('voltage','Pil gerilimi',0,24,1,'V'),charge=c('charge','Sabit yük',0,100,5,'µC');
const C1=c('c1','Birinci kondansatör',1,12,.5,'µF'),C2=c('c2','İkinci kondansatör',1,12,.5,'µF');
const meters=o=>[['Eşdeğer sığa',f(o.Cmicro,5)+' µF'],['Toplam yük',f(o.Qmicro,3)+' µC'],['Depolanan enerji',f(o.U_microJ,3)+' µJ']];
function plates(p,o){const x1=305,x2=495,y=72,h=220,span=Math.min(150,Math.max(35,p.distance*30));let s='';
 s+=u.line(x1,y,x1,y+h,'#8cd4eb',12)+u.line(x1+span,y,x1+span,y+h,'#ffc885',12);
 for(let i=0;i<5;i++){const yy=85+i*43;s+=u.arrow(x1+20,yy,span-45,0,'#78e4c8','');}
 s+=u.text(85,43,'Plaka aralığı: '+f(p.distance)+' mm · alan: '+f(p.area)+' cm²','#e1edf2');
 s+=u.text(85,334,'E = V/d · Saçak alan ihmal edilir','#c2dce7');
 return u.svg(s,'Paralel plaka ve düzgün alan yaklaşımı');}
function batteryScene(p,o){let s='<rect x="190" y="115" width="140" height="100" rx="14" fill="#2b5575" stroke="#91d4e5"/>'+
 '<rect x="480" y="115" width="140" height="100" rx="14" fill="#7b5b38" stroke="#e7c18b"/>';
 s+=u.text(215,172,'PİL','#e6f4fa',27)+u.text(508,172,'C','#fff3d8',28);
 s+=u.line(330,165,480,165,'#8ce2cf',5)+u.text(80,42,'Pil bağlı: gerilim sabit, yük değişebilir','#dbeaf1');
 return u.svg(s,'Pilin gerilimi sabit tuttuğu kondansatör');}
function isolatedScene(p,o){let s=u.line(325,85,325,270,'#8ed9eb',13)+u.line(475,85,475,270,'#f7c38c',13);
 s+=u.text(82,42,'Pil ayrılmış: yük sabit, gerilim değişebilir','#e6edf3');
 s+=u.text(110,324,'Yük: '+f(p.charge)+' µC · V: '+f(o.voltage)+' V','#c9f0dc');
 return u.svg(s,'Pil bağlantısı kesilmiş kondansatör');}
function connectionScene(p,o,mode){const parallel=mode==='parallel',s1=parallel?'║':'║',s2='║';
 let s='<rect x="240" y="104" width="118" height="75" rx="9" fill="#264d68" stroke="#8bcfdf"/>'+
 '<rect x="465" y="'+(parallel?104:104)+'" width="118" height="75" rx="9" fill="#765a3b" stroke="#f4ce91"/>';
 s+=u.text(258,148,'C₁ '+f(p.c1)+'µF','#fff')+u.text(481,148,'C₂ '+f(p.c2)+'µF','#fff');
 s+=parallel?u.line(180,75,630,75,'#70d7c9',5)+u.line(180,225,630,225,'#70d7c9',5)+u.line(298,75,298,104,'#70d7c9',4)+u.line(525,75,525,104,'#70d7c9',4)+u.line(298,179,298,225,'#70d7c9',4)+u.line(525,179,525,225,'#70d7c9',4):u.line(358,143,465,143,'#70d7c9',5);
 s+=u.text(90,39,parallel?'Paralel: V₁ = V₂ = V':'Seri: Q₁ = Q₂ = Q','#d8edf2');
 return u.svg(s,parallel?'Paralel kondansatör şeması':'Seri kondansatör şeması');}
const qualitative=(name,lines)=>u.svg(u.text(70,52,name,'#c9e9f3',22)+lines.map((x,i)=>u.text(70,117+i*51,x,i%2?'#eecb91':'#8de0ce',20)).join(''),'Kavramsal sığa karşılaştırması');
const level=x=>x>1.4?'Artar':x<.7?'Azalır':'Değişmez';
const sections=[
{id:'plate',tab:'Levha değişkenleri',title:'Sığa hangi değişkenlere bağlı?',intro:'Alanı, levhalar arası uzaklığı ve yalıtkan türünü değiştir. Sayısal sığa hesabı yerine oransal değişimi keşfet.',defaults:{area:100,distance:2,dielectric:1},controls:[c('area','Levha alanı',20,300,10,'cm²'),c('distance','Levha aralığı',.5,6,.5,'mm'),c('dielectric','Bağıl dielektrik katsayısı',1,5,.5,'')],model:p=>({ratio:(p.area/100)*(2/p.distance)*p.dielectric}),scene:(p,o)=>qualitative('Paralel levhalar',['Alan: '+f(p.area)+' cm²','Aralık: '+f(p.distance)+' mm','Sığa (başlangıca göre): '+level(o.ratio)]),interpret:(p,o)=>'Alan büyürse sığa artar, aralık büyürse azalır; yalıtkanın etkisi bağıl dielektrik katsayısına bağlıdır.',formula:()=> 'C ∝ εᵣ·A/d (matematiksel model; hesaplama yok)',metrics:(p,o)=>[['Başlangıca göre sığa',level(o.ratio)]],note:'11.2.3.4–5: Sığanın bağlı olduğu değişkenler ve matematiksel model; sayısal hesaplama yapılmaz.'},
{id:'battery',tab:'Pil bağlı',title:'Pil bağlıyken yük depolama',intro:'Sığayı ve pil gerilimini değiştir; depolanan yükün artış/azalış yönünü incele.',defaults:{cap:4,voltage:12},controls:[cap,voltage],model:p=>({more:p.cap*p.voltage/48}),scene:(p,o)=>qualitative('Pil bağlı',['Gerilim pil tarafından sabit tutulur','Daha büyük sığa → daha fazla yük','Pil, yük alışverişi sağlar']),interpret:()=> 'Pil bağlıyken gerilim sabittir. Sığa arttığında depolanabilen yük artar.',formula:()=> 'Kondansatör elektrik yükü ve enerji depolar.',metrics:(p,o)=>[['Yük eğilimi',level(o.more)]],note:'Kavramsal enerji ve yük depolama; sayısal Q, U ve sığa hesabı yok.'},
{id:'isolated',tab:'Pil ayrılmış',title:'Pil ayrılınca yük korunur',intro:'Bağlantı kesilince yük sabit kalır. Sığayı değiştirerek gerilim eğilimini gözlemle.',defaults:{cap:4,charge:40},controls:[cap,charge],model:p=>({ratio:(p.charge/40)*(4/p.cap)}),scene:(p,o)=>qualitative('Pil ayrılmış',['Yük kaçışı yoksa toplam yük korunur','Sığa artınca gerilim azalır','Sığa azalınca gerilim artar']),interpret:()=> 'Pil ayrıldığında yük sabit kabul edilir. Aynı yük daha büyük sığada daha düşük gerilim oluşturur.',formula:()=> 'Yük korunumu ve enerji depolama (nitel).',metrics:(p,o)=>[['Gerilim eğilimi',level(o.ratio)]],note:'İdeal yalıtılmış kondansatör; sayısal gerilim ve enerji hesabı yapılmaz.'},
{id:'series',tab:'Seri bağlama',title:'Seri bağlamada ne korunur?',intro:'İki sığacı seri bağla; yük ve gerilim ilişkisini kavramsal olarak incele.',defaults:{c1:3,c2:6},controls:[C1,C2],model:p=>({}),scene:(p,o)=>qualitative('Seri bağlı sığaçlar',['Her iki sığaçtaki yük büyüklüğü aynıdır','Toplam gerilim paylaşılır','Eşdeğer sığa tek tek sığalardan küçüktür']),interpret:()=> 'Başlangıçta yüksüz iki sığaç seri bağlandığında yük büyüklükleri eşittir.',formula:()=> 'Seri: yük büyüklükleri eşit (kavramsal).',metrics:()=>[['Eşdeğer sığa','Her birinden daha küçük']],note:'2018 MEB sığa bölümünün zorunlu sayısal hesaplamaları dışında, yalnız kavramsal karşılaştırma.'},
{id:'parallel',tab:'Paralel bağlama',title:'Paralelde ne eşittir?',intro:'Paralel sığaçlarda gerilimlerin eşitliğini ve toplam yükü gözlemle.',defaults:{c1:3,c2:6},controls:[C1,C2],model:p=>({}),scene:()=>qualitative('Paralel bağlı sığaçlar',['Her iki sığaçta gerilim aynıdır','Yükler toplanır','Eşdeğer sığa artar']),interpret:()=> 'Paralel bağlamada iki sığacın uçları aynı noktalara bağlıdır; gerilimleri eşittir.',formula:()=> 'Paralel: gerilimler eşit (kavramsal).',metrics:()=>[['Eşdeğer sığa','Her birinden daha büyük']],note:'Sayısal eşdeğer sığa, yük ve enerji hesapları kaldırılmıştır.'},
{id:'compare',tab:'Günlük kullanım',title:'Sığaçlar nerelerde kullanılır?',intro:'Kondansatörün yük ve enerji depolama işlevini günlük örneklerle karşılaştır.',defaults:{cap:4},controls:[cap],model:p=>({}),scene:()=>qualitative('Kondansatör ne işe yarar?',['Kamera flaşı: kısa süreli enerji aktarımı','Güç kaynağı: gerilim dalgalanmasını azaltma','Elektronik devre: yük depolama']),interpret:()=> 'Kondansatörler elektrik enerjisini elektrik alanda depolar; kullanım amacı devreye göre değişir.',formula:()=> 'Sığaç = yük ve elektriksel enerji depolama',metrics:()=>[['Kazanım','11.2.3.6']],note:'Günlük kullanım örnekleri idealize edilmiştir; gerçek devrelerin ayrıntılı analizi yapılmaz.'}
];
w.SigaLab=U.create({sections,questions:[]});
})(window);
