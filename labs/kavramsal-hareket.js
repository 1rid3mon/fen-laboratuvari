/* AYT 2018 MEB — state-driven, observable SVG for formerly text-only laboratories.
 * The diagrams are educational, not to scale. No numerical calculations added where restricted.
 * Animation is opt-in and paused if the tab changes or the document becomes hidden.
 */
(function(w){'use strict';
const PI=Math.PI,TAU=2*PI,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const circle=(x,y,r,fill,stroke='#c6e8ec',sw=2)=>'<circle cx="'+x+'" cy="'+y+'" r="'+Math.max(.1,r)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
const rect=(x,y,width,height,fill,stroke='#8fcfdb',rx=7)=>'<rect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
const path=(d,c='#87e6d4',sw=4,dash='')=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
const line=(x1,y1,x2,y2,c='#84d9cc',sw=4)=>path('M'+x1+' '+y1+' L'+x2+' '+y2,c,sw);
const txt=(u,x,y,t,color='#dae8f2',sz=18)=>u.text(x,y,t,color,sz);
const base=(u,title,body,desc)=>u.svg(txt(u,42,42,title,'#e5f5fc',21)+body+txt(u,42,332,desc,'#b7d9e1',15),title);
const arrow=(u,x,y,dx,dy,c='#85f4c6',t='')=>u.arrow(x,y,dx,dy,c,t);
function spark(x,y,n,charge=1){let s='';for(let i=0;i<Math.max(0,Math.min(16,n));i++){const yy=y+((i%4)-1.5)*35,xx=x+Math.floor(i/4)*27;s+=circle(xx,yy,7,charge>=0?'#ffc27e':'#82b9f1','#f1ebd8',1);}return s;}
function plate(x,y,height,fill){return line(x,y-height/2,x,y+height/2,fill,11);}
function capacitor(cx,cy,spacing,h){return plate(cx-spacing/2,cy,h,'#8ec9e4')+plate(cx+spacing/2,cy,h,'#f1b87d');}
function coil(cx,cy,loops=7,color='#9cdef1'){
 let b='';for(let i=0;i<loops;i++){const x=cx-((loops-1)*15)/2+i*15;b+='<ellipse cx="'+x+'" cy="'+cy+'" rx="11" ry="43" fill="none" stroke="'+color+'" stroke-width="4"/>';}
 return b;
}
function dotsInField(n,kind){let b='';for(let i=0;i<n;i++){const x=165+(i%7)*77,y=97+Math.floor(i/7)*67;b+=circle(x,y,14,'#10283e','#59819b',1)+txt({text:(a,b,c,d,e)=>'<text x="'+a+'" y="'+b+'" fill="'+d+'" font-size="'+e+'">'+c+'</text>'},x-6,y+5,kind==='out'?'•':'×','#84d9d2',17);}return b;}
function capPlate(p,o,u){
 const spacing=clamp(p.distance*30,40,178),h=clamp(110*Math.sqrt(p.area/100),65,216),cx=405;
 let b=capacitor(cx,179,spacing,h);
 b+='<rect data-drag="distance" data-mode="plate" x="'+(cx+spacing/2-19)+'" y="'+(179-h/2)+'" width="38" height="'+h+'" fill="transparent" stroke="none"/>';
 if(p.dielectric>1)b+=rect(cx-spacing/2+15,179-h/2,spacing-30,h,'#598d8a55','#79d9c4',2);
 const plus=clamp(Math.round(o.ratio*3),1,12);
 b+=spark(cx-spacing/2-88,174,plus,1)+spark(cx+spacing/2+35,174,plus,-1);
 b+=line(cx-spacing/2,67,cx+spacing/2,67,'#6ddccc',2);
 b+=txt(u,55,72,'Alan ↑ → sığa ↑','#8eedd5');
 b+=txt(u,55,112,'Aralık ↑ → sığa ↓','#f5cf9e');
 b+=txt(u,55,154,'Yalıtkan ↑ → sığa ↑','#bbd8f2');
 return base(u,'Paralel levhalar: boşluk ve yüzey gerçekten değişir',b,'Şematik yük sayısı, sayısal sığa hesabı değildir.');
}
function capBattery(p,o,u){
 let b=rect(94,141,125,91,'#254c69')+txt(u,124,195,'PİL','#e4f3ff',26);
 const num=clamp(Math.round(o.more*5),0,12);
 b+=capacitor(568,180,88,175)+spark(450,160,num,1)+spark(644,160,num,-1);
 b+=line(219,163,524,163,'#7fe0ce',5)+line(219,219,612,219,'#7fe0ce',5);
 b+=txt(u,84,92,'Pil bağlı → gerilim sabit, yük değişebilir','#b6eedf',19);
 return base(u,'Pil bağlı: sığa arttığında daha çok yük',b,'Renkli noktalar yük eğilimini gösterir, ölçülen tanecikler değildir.');
}
function capIsolated(p,o,u){
 const n=clamp(Math.round(p.charge/8),0,12),space=clamp(45+p.cap*5,56,140);
 const b=capacitor(425,173,space,170)+spark(410-space/2-120,180,n,1)+spark(470+space/2,180,n,-1)
 +txt(u,72,84,'Pil yok: toplam yük korunur','#a6f2da')
 +txt(u,72,124,'Sığa ↑ → gerilim ↓ (aynı yükte)','#f3ce9b');
 return base(u,'Yalıtılmış kondansatör',b,'Nitel karşılaştırma: yük miktarı seçimi, sayısal gerilim hesabı yok.');
}
function capNetwork(p,o,u,parallel){
 const c1=clamp(p.c1*5+28,35,90),c2=clamp(p.c2*5+28,35,90);
 let b='';
 if(parallel){
  b+=line(160,90,640,90)+line(160,272,640,272)+line(225,90,225,272)+line(568,90,568,272);
  b+=capacitor(370,137,30,c1)+capacitor(370,223,30,c2);
  b+=line(225,137,355,137)+line(385,137,568,137)+line(225,223,355,223)+line(385,223,568,223);
  b+=txt(u,80,70,'V₁ = V₂','#b5eedc')+txt(u,480,320,'Paralel: toplam yük artar','#f5d19b',17);
 }else{
  b+=line(90,182,270,182)+capacitor(300,182,25,c1)+line(315,182,450,182)+capacitor(478,182,25,c2)+line(493,182,665,182);
  b+=txt(u,94,102,'Q₁ = Q₂','#b5eedc')+txt(u,430,269,'Seri: gerilim paylaşılır','#f5d19b',17);
 }
 return base(u,parallel?'Paralel sığaçların gerçek bağlantısı':'Seri sığaçların gerçek bağlantısı',b,'İki sığacın levha boyu, seçilen sığaya göre şematik değişir.');
}
function capUses(p,o,u){
 const ratio=clamp(p.cap/12,0,1),width=ratio*200;
 const b=rect(117,102,132,123,'#254665')+circle(183,157,28,'#fad183','#fff6c7')+
 rect(355,122,215,87,'#112c43')+rect(365,132,width,67,'#47bca0','#88f4d5')+
 txt(u,95,258,'Kamera flaşı', '#f4c48e')+txt(u,343,258,'Yük depolama eğilimi', '#a6f2d8');
 return base(u,'Kondansatör: kısa süreli enerji depolama',b,'Çubuk nitel kapasiteyi gösterir; enerji veya sığa sayısı değildir.');
}
function magWire(p,o,u){
 const x=403,y=174,r=clamp(p.distance*9,28,160),dir=p.current>=0?1:-1;
 let b='';for(let i=0;i<Math.round(Math.abs(p.current)/3);i++){const rr=48+i*38;b+='<circle cx="'+x+'" cy="'+y+'" r="'+rr+'" fill="none" stroke="#35627b" stroke-width="2" stroke-dasharray="6 7"/>';}
 b+=circle(x,y,25,'#183751','#d0e5ed',3)+txt(u,x-9,y+8,p.current>=0?'•':'×','#8af0d2',30);
 b+=circle(x+r,y,12,'#f7d19b','#fff5d4');if(p.current!==0)b+=arrow(u,x+r,y,0,-dir*45,'#8cf4c9','B');
 b+=txt(u,63,104,'I yönü: '+(p.current>=0?'sayfadan dışarı':'sayfa içine'));
 b+=txt(u,63,145,'Ölçüm noktası: '+p.distance+' cm','#f1ce98');
 return base(u,'Düz tel: manyetik alan daireseldir',b,'Akımı ters çevir → alanın dönüş yönü tersine döner.');
}
function magCoil(p,o,u){
 const count=clamp(Math.round(p.turns/35),3,11);
 let b=coil(395,178,count,p.current>=0?'#9ce5ef':'#f0ad84');
 const countArrows=clamp(Math.round(Math.abs(p.current)*.6),0,6);
 for(let i=0;i<countArrows;i++){const y=141+i*17;b+=arrow(u,200,y,p.current>=0?355:-355,0,'#83eed1','');}
 b+=txt(u,80,86,'Temsili sarım: '+count+' / gerçek '+p.turns,'#bbdfee',17);
 return base(u,'Halka ve bobin: sarım ile alan ilişkisi',b,'Sarımlar artarsa alan artar; uzun bobin içi alan yaklaşık düzgündür.');
}
function magForce(p,o,u){
 const deg=p.angle,active=o.active,sign=Math.sign(p.current*Math.sin(deg*PI/180));
 let b='';
 if(p.B>0)for(let y=108;y<=258;y+=clamp(110-p.B/12,36,110))b+=arrow(u,148,y,478,0,'#73bfd9','B');
 b+='<g transform="rotate('+deg+' 399 174)">'+line(270,174,527,174,'#ffcf95',12)+arrow(u,367,174,p.current>=0?92:-92,0,'#85f0cb','I')+'</g>';
 b+=circle(399,174,27,'#193d53','#ffe2a3',3);
 b+=txt(u,386,183,active?(sign>0?'•':'×'):'0',active?'#ffe3ab':'#789baa',30);
 b+=txt(u,480,177,active?(sign>0?'F: sayfadan dışarı':'F: sayfa içine'):'F = 0','#f3dcae',17);
 b+=txt(u,75,75,'Alan → · tel açıyla döner · kuvvet sayfaya diktir','#e5e9ef',18);
 return base(u,'Manyetik kuvvet: telin alanla yaptığı açı',b,'B alanı düzlemde sağa; kuvvet işareti sağ el kuralına göredir.');
}
function magParticle(p,o,u){
 let b=p.B>0?dotsInField(21,'in'):'';let x,y;
 const phase=p.phase||0,sign=p.q>=0?1:-1;
 if(o.straight){x=170+440*phase;y=175;b+=path('M170 175 L610 175','#6ad6c3',3,'8 6');}
 else if(p.angle===90){x=404+94*Math.cos(TAU*phase*sign);y=176-94*Math.sin(TAU*phase*sign);b+='<circle cx="404" cy="176" r="94" fill="none" stroke="#7de3cc" stroke-dasharray="6 8" stroke-width="3"/>';}
 else{x=160+440*phase;y=176+45*Math.sin(TAU*phase*sign*3);b+=path('M160 176 Q260 77 360 176 T560 176','#6ad6c3',3,'8 6');}
 b+='<g data-drag="phase" data-mode="'+(o.straight?'linear':p.angle===90?'orbit':'linear')+'">'+circle(x,y,19,p.q>0?'#ffc78f':'#8dc9fd','#fff4d1',3)+txt(u,x-8,y+6,p.q>0?'+':'−','#173f50',22)+'</g>';
 return base(u,'Yüklü parçacık: yörünge hareket ediyor',b,'İşaret değişince sapma yönü tersine döner; yarıçap hesabı yok.');
}
function magFlux(p,o,u){
 const cosine=Math.cos(p.angle*PI/180),sz=Math.sqrt(p.area/100),visible=clamp(Math.abs(cosine)*118*sz,4,173);
 let b='';
 if(p.B>0)for(let x=165;x<=630;x+=clamp(120-p.B/10,42,120))b+=arrow(u,x,75,0,198,'#78c6e6','');
 b+='<ellipse cx="401" cy="178" rx="'+visible+'" ry="'+clamp(95*sz,26,135)+'" fill="#78dbc922" stroke="#f4d197" stroke-width="5" data-drag="angle" data-mode="flux"/>';
 b+=arrow(u,401,179,105*cosine,-100,'#ffd0a5','n');
 b+=txt(u,75,86,'Alan × yüzey yönelimi','#f5dfbf');
 return base(u,'Manyetik akı: halkayı eğ → geçen alan değişsin',b,'Açı yüzey normaline göre ölçülür; şema alan çizgilerini temsili gösterir.');
}
function magFaraday(p,o,u){
 const phase=p.phase||0,B=p.B1+(p.B2-p.B1)*phase,sign=Math.sign(o.emf);
 let b=coil(470,185,7,'#f4bf83');
 for(let i=0;i<clamp(Math.round(Math.abs(B)/120),0,7);i++){
  const yy=100+i*29;b+=arrow(u,165,yy,225*(B>=0?1:-1),0,'#85d5ec','');
 }
 b+=txt(u,62,79,'Başlangıç B → son B','#e1eeed');
 b+=arrow(u,618,177,0,sign===0?0:sign*68,'#7defb6','indüksiyon');
 return base(u,'Faraday–Lenz: alan değişirse EMK oluşur',b,'Zıt yön oku, seçilmiş pozitif dolaşım yönüne göre Lenz tepkisidir.');
}
function magRod(p,o,u){
 const x=175+360*(p.phase||0),half=clamp(p.length*1.08,50,132);
 let b=line(90,185-half,706,185-half,'#9bc8d6',6)+line(90,185+half,706,185+half,'#9bc8d6',6);
 b+=line(x,185-half,x,185+half,'#f9c88d',12)+'<rect data-drag="phase" data-mode="rod" x="'+(x-22)+'" y="'+(185-half)+'" width="44" height="'+(half*2)+'" fill="transparent"/>'+arrow(u,x+15,185,92,0,'#85f0cd','v');
 b+=rect(91,151,72,68,'#344f68')+txt(u,104,190,'R','#e1f6fb',28);
 if(p.B>0)b+=dotsInField(14,'in');
 return base(u,'Hareketli çubuk: indüksiyon kaynağı',b,'Çubuk ray üzerinde giderken hareket EMK’sı oluşur.');
}
function magTransformer(p,o,u){
 const n1=clamp(Math.round(p.primaryTurns/35),3,11),n2=clamp(Math.round(p.secondaryTurns/35),3,11);
 let b=rect(150,79,500,214,'#27495c','#779fb2',10)+rect(260,115,279,135,'#092035','#7da4b7',0);
 b+=coil(195,186,n1,'#78d9e6')+coil(599,186,n2,'#efbf80');
 b+=arrow(u,326,101,165,0,'#7debc7','değişen akı');
 b+=txt(u,67,69,'Primer: '+p.primaryTurns+' tur','#8bdfef')+txt(u,500,69,'Sekonder: '+p.secondaryTurns+' tur','#f9d29a');
 return base(u,'Transformatör: ortak demir çekirdek ve bobinler',b,'Sarım oranını değiştir; hesaplama olmadan yükseltme/düşürme gözle.');
}
function magFrame(p,o,u){
 const angle=p.angle+TAU*(p.phase||0)*180/PI;
 let b=dotsInField(21,'in');
 b+='<g transform="rotate('+angle+' 400 175)">'+rect(310,128,180,91,'#2f7e8844','#f3c58a')+
 arrow(u,304,165,0,p.current>=0?70:-70,'#88e4c9','I')+arrow(u,493,165,0,p.current>=0?-70:70,'#88e4c9','I')+'</g>';
 return base(u,'Tel çerçeve: zıt kuvvetler döndürür',b,'Akım yönü değişince dönme yönü değişir; hız modeli idealize.');
}
function magSelf(p,o,u){
 let b=coil(392,178,9,'#94d7f3')+arrow(u,90,177,155,0,'#f6c98f','I');
 b+=arrow(u,570,177,p.change>0?-135:135,0,'#7deace','öz EMK');
 b+=txt(u,86,86,'Bobin akım DEĞİŞİMİNE karşı koyar','#dceee9');
 return base(u,'Öz-indüksiyon: tepki akım değişimine zıttır',b,'Sabit akım için değişim yoktur; bu gösterim sayısal değildir.');
}
function magMotor(p,o,u){
 const rotate=(p.phase||0)*360;let b='';
 b+=circle(394,179,115,'#1d4c63')+
 '<g transform="rotate('+rotate+' 394 179)">'+rect(325,125,138,104,'#7ad4db44','#f7cb88')+line(325,179,463,179,'#e8bb85',4)+'</g>';
 b+=arrow(u,92,171,140,0,'#83ebca',p.mode?'mekanik':'elektrik')+
 arrow(u,542,171,153,0,'#ffd098',p.mode?'elektrik':'mekanik');
 return base(u,p.mode?'Dinamo: dönme → elektrik':'Motor: elektrik → dönme',b,'Motor kuvvetle, dinamo değişen akıyla çalışır.');
}
const siga={plate:capPlate,battery:capBattery,isolated:capIsolated,series:(p,o,u)=>capNetwork(p,o,u,false),parallel:(p,o,u)=>capNetwork(p,o,u,true),compare:capUses};
const manyetizma={wire:magWire,coil:magCoil,'wire-force':magForce,particle:magParticle,flux:magFlux,faraday:magFaraday,rod:magRod,transformer:magTransformer,frame:magFrame,self:magSelf,motor:magMotor};
function acCircuit(p,o,u,type){
 const phase=p.phase||0,ac=!!p.type,sign=ac?(Math.cos(TAU*phase)>=0?1:-1):1;
 let b=line(165,120,630,120)+line(630,120,630,254)+line(630,254,165,254)+line(165,254,165,120);
 b+=circle(165,186,35,'#1b4760')+txt(u,146,193,ac?'AC':'DC','#f5dfb5',19);
 if(type==='resistor'){
  b+=rect(328,101,155,38,'#986a47','#f3cb98',4);
  const strength=clamp(11-p.R,1,10);b+=rect(330,106,15*strength,28,'#eec990','#f8ddbb',1);
  b+=txt(u,340,89,'Direnç: R ↑ → akım ↓','#dcf0ef',17);
 }else if(type==='inductor'){
  b+=coil(400,120,8,'#a2dce9')+txt(u,299,78,p.type?'frekans ↑ → etki ↑':'DC kararlı: ideal engel yok','#daecf2',17);
 }else if(type==='capacitor'){
  b+=capacitor(405,120,34,63)+spark(364,92,clamp(Math.round(p.frequency/2),1,5),1)+spark(447,92,clamp(Math.round(p.frequency/2),1,5),-1);
  b+=txt(u,260,78,p.type?'frekans ↑ → etki ↓':'DC kararlı: akım geçmez','#daecf2',17);
 }else b+=rect(320,103,157,34,'#21546e');
 const z=clamp(Math.round((phase*11)%11),0,10),x=175+z*43;
 if(type!=='capacitor'||ac)b+='<g data-drag="phase" data-mode="track">'+circle(x,254,12,'#a0f7ce','#ddf4e6',1)+'</g>';
 b+=arrow(u,462,253,sign*70,0,'#a6f4ca',ac?'yön değişir':'sabit yön');
 return base(u,type==='resistor'?'Direnç: hareketli akım yönü':type==='inductor'?'Bobin: akım değişimine karşı koyar':'Sığaç: levhalarda yük birikimi',b,'AC devresi için sayısal hesap veya akım-zaman grafiği yok.');
}
function acdc(p,o,u){
 const phase=p.phase||0,sign=o.ac&&phase>.5?-1:1;
 let b=circle(376,171,110,'#163c53','#87c0cf',3);
 for(let i=0;i<4;i++){const a=i*PI/2+phase*TAU*(o.ac?sign:1);
 b+=circle(376+105*Math.cos(a),171+105*Math.sin(a),13,'#f5cb8b','#fbe9cf');}
 b+=arrow(u,533,170,sign*114,0,'#77f0c7',o.ac?'AC yönü değişir':'DC sabit yön');
 b+=txt(u,80,94,o.ac?'Jeneratör: alternatif yön':'Pil: tek yön','#e5f0ee',19);
 return base(u,o.ac?'Alternatif akım: ileri ↔ geri':'Doğru akım: tek yön',b,'Bu bir akım-zaman grafiği değildir; temsili yük hareketidir.');
}
function resonance(p,o,u){
 const distance=Math.abs(p.frequency-p.natural),width=clamp(280/(1+distance*.6),27,280);
 let b=rect(260,139,314,82,'#20445c')+rect(276,153,width,54,o.near?'#6ee7c2':'#77aac6','#b4d8e5');
 b+=txt(u,80,94,'Sürücü: '+p.frequency+' · doğal: '+p.natural,'#e5eef3',20);
 b+=txt(u,275,254,o.near?'REZONANSA YAKIN':'REZONANSTAN UZAK','#f3d199',20);
 return base(u,'Seri RLC: frekans uyumunun tepkiye etkisi',b,'Kavramsal yanıt büyüklüğü; akım-zaman grafiği veya sayısal hesap yok.');
}
const ac={'acdc':acdc,resistor:(p,o,u)=>acCircuit(p,o,u,'resistor'),inductor:(p,o,u)=>acCircuit(p,o,u,'inductor'),capacitor:(p,o,u)=>acCircuit(p,o,u,'capacitor'),resonance};
const configs={
 siga:{scenes:siga,motions:[]},
 manyetizma:{scenes:manyetizma,motions:['particle','faraday','rod','frame','motor']},
 ac:{scenes:ac,motions:['acdc','resistor','inductor','capacitor']}
};
function enhance(sections,kind){
 const config=configs[kind];if(!config)return;
 for(const s of sections){
  const visual=config.scenes[s.id];if(visual)s.scene=visual;
  if(config.motions.includes(s.id)){
   s.defaults.phase=0;s.controls.push({id:'phase',label:'Hareketin aşaması',min:0,max:1,step:.01,unit:''});
   s.motion={key:'phase',min:0,max:1,speed:p=>kind==='ac'&&p.frequency?clamp(p.frequency/20,.15,.6):kind==='manyetizma'&&s.id==='rod'?clamp(p.speed/20,.1,.7):.28,step:.1};
  }
 }
}
w.KavramsalHareket=Object.freeze({enhance});
})(window);
