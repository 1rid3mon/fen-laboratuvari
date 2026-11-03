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
const sections=[
{id:'plate',tab:'Paralel levhalar',title:'Levha alanı ve uzaklık sığayı nasıl değiştirir?',
intro:'Plaka alanını, uzaklığını ve aradaki yalıtkanın bağıl dielektrik katsayısını değiştir. Pil bağlı kabul edilir.',
defaults:{area:100,distance:2,dielectric:1,voltage:12},
controls:[c('area','Levha alanı',20,300,10,'cm²'),c('distance','Levha aralığı',.5,6,.5,'mm'),c('dielectric','Bağıl dielektrik katsayısı',1,5,.5,''),voltage],
model:M.plate,scene:plates,
interpret:(p,o)=>'Alan büyüdükçe sığa artar; aralık büyüdükçe sığa azalır. C = '+f(o.Cmicro,6)+' µF, Q = '+f(o.Qmicro,6)+' µC.',
formula:()=> 'C = ε₀ εᵣ A / d\nQ = CV\nU = ½ CV²\nE = V/d',
metrics:(p,o)=>[...meters(o),['Elektrik alan',f(o.E)+' V/m']],
note:'İdeal geniş paralel levhalar, düzgün alan; kenar/saçak etkileri ihmal edilir. εᵣ≥1 sabit, lineer yalıtkan. Pil bağlı olduğu için V sabittir.'},
{id:'battery',tab:'Pil bağlı',title:'Gerilim sabitken sığayı değiştir',
intro:'Pilin gerilimi sabit tuttuğu durumda sığayı artırınca kondansatördeki yük ve enerji ne olur?',
defaults:{cap:4,voltage:12},controls:[cap,voltage],model:M.battery,scene:batteryScene,
interpret:(p,o)=>'Pil bağlı: V = '+f(p.voltage)+' V sabit. Sığa büyürse Q = CV ve U = ½CV² büyür; ek enerji pil tarafından sağlanır.',
formula:()=> 'Q = C·V\nU = ½ C V²\nV sabit tutulur.',
metrics:(p,o)=>meters(o),note:'İdeal pil ve kondansatör; enerji hesabı yalnız kondansatörde depolanan enerjidir, pilin toplam enerji bilançosu değildir.'},
{id:'isolated',tab:'Pil ayrılmış',title:'Yük sabitken sığayı değiştir',
intro:'Pilden ayrılmış kondansatörde yük sabit kalır. Sığa değişirse gerilim ve depolanan enerji değişir.',
defaults:{cap:4,charge:40},controls:[cap,charge],model:M.isolated,scene:isolatedScene,
interpret:(p,o)=>'Pil ayrılmış: Q = '+f(p.charge)+' µC sabit. Sığa büyüdükçe V = Q/C ve U = Q²/(2C) küçülür.',
formula:()=> 'V = Q/C\nU = Q²/(2C)\nQ sabit tutulur.',
metrics:(p,o)=>meters(o).concat([['Gerilim',f(o.voltage)+' V']]),
note:'Yük kaçağı yoktur; mekanik iş ve dielektrik üzerindeki kuvvetler ayrı hesaplanmaz.'},
{id:'series',tab:'Seri bağlama',title:'Seri bağlanan kondansatörlerde yük neden eşit?',
intro:'İki kondansatörün sığasını değiştir. Eşdeğer sığa her birinden küçüktür; gerilim paylaşılır.',
defaults:{c1:3,c2:6,voltage:12},controls:[C1,C2,voltage],model:M.series,scene:(p,o)=>connectionScene(p,o,'series'),
interpret:(p,o)=>'Seride iki kondansatörün yük büyüklüğü aynı: '+f(o.Qmicro)+' µC. Gerilimler '+f(o.V1)+' V ve '+f(o.V2)+' V; toplamları pil gerilimidir.',
formula:()=> '1/Ceş = 1/C₁ + 1/C₂\nQ₁ = Q₂ = Q\nV = V₁ + V₂',
metrics:(p,o)=>meters(o).concat([['V₁',f(o.V1)+' V'],['V₂',f(o.V2)+' V']]),
note:'Başlangıçta yüksüz, ideal iki kondansatör ve ideal pil; bağlantıdaki kaçak kapasite ihmal edilir.'},
{id:'parallel',tab:'Paralel bağlama',title:'Paralelde gerilim neden eşit?',
intro:'İki kondansatörün sığasını değiştir. Eşdeğer sığa artar; her iki uçta aynı gerilim vardır.',
defaults:{c1:3,c2:6,voltage:12},controls:[C1,C2,voltage],model:M.parallel,scene:(p,o)=>connectionScene(p,o,'parallel'),
interpret:(p,o)=>'Paralelde V₁ = V₂ = '+f(p.voltage)+' V. Toplam yük Q₁+Q₂ = '+f(o.Qmicro)+' µC.',
formula:()=> 'Ceş = C₁ + C₂\nV₁ = V₂ = V\nQtoplam = Q₁ + Q₂',
metrics:(p,o)=>meters(o).concat([['Q₁',f(o.Q1)+' µC'],['Q₂',f(o.Q2)+' µC']]),
note:'İdeal pil ve iki kondansatör; aynı iki düğüme bağlanmışlardır.'},
{id:'compare',tab:'Karşılaştır',title:'Aynı iki kondansatör: seri mi paralel mi?',
intro:'Aynı kondansatörleri aynı pile seri ve paralel bağlayınca eşdeğer sığa ve enerji nasıl değişir?',
defaults:{c1:3,c2:6,voltage:12},controls:[C1,C2,voltage],model:M.comparison,
scene:(p,o)=>u.svg(u.text(85,75,'SERİ','#bfe3f0',24)+u.text(440,75,'PARALEL','#bfe3f0',24)+
 u.text(85,145,'Ceş = '+f(o.series.Cmicro)+' µF','#f6c98a',22)+u.text(440,145,'Ceş = '+f(o.parallel.Cmicro)+' µF','#82dfcc',22)+
 u.text(85,220,'U = '+f(o.series.U_microJ)+' µJ','#f6c98a',20)+u.text(440,220,'U = '+f(o.parallel.U_microJ)+' µJ','#82dfcc',20),
 'Seri ve paralel sığa ve enerji karşılaştırması'),
interpret:(p,o)=>'Aynı pil geriliminde paralel eşdeğer sığa '+f(o.parallel.Cmicro)+' µF, seri eşdeğer sığa '+f(o.series.Cmicro)+' µF. Daha büyük sığa aynı V altında daha fazla enerji depolar.',
formula:()=> 'Seri: Ceş = C₁C₂/(C₁+C₂)\nParalel: Ceş = C₁+C₂\nU = ½ Ceş V²',
metrics:(p,o)=>[['Seri sığa',f(o.series.Cmicro)+' µF'],['Paralel sığa',f(o.parallel.Cmicro)+' µF'],['Seri enerji',f(o.series.U_microJ)+' µJ'],['Paralel enerji',f(o.parallel.U_microJ)+' µJ']],
note:'İki kondansatör, başlangıçta yüksüz ve aynı ideal pil gerilimine bağlanır. Birinden diğerine geçişte anahtarlama kayıpları modellenmez.'}
];
w.SigaLab=U.create({sections,questions:[]});
})(window);
