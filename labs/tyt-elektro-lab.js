/* TYT 2018 MEB 9.6 — electrostatics, interact with charges rather than a text-only dashboard.
 * All geometry is an explanatory 2D diagram. In electric-field section, NO numbers.
 */
(function(w){'use strict';const M=w.TytElektroMath,V=w.MekanikUI;if(!M||!V)return;
const U=V.U,fmt=U.fmt,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ctl=(id,label,min,max,step,unit='')=>({id,label,min,max,step,unit});
const red='#f2ae84',blue='#80cef4',mint='#86e9c5',pale='#e7f2f9';
const circle=(x,y,r,fill,stroke='#b2deec')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
const rect=(x,y,ww,hh,fill,stroke='#acdfe4',round=9)=>'<rect x="'+x+'" y="'+y+'" width="'+ww+'" height="'+hh+'" rx="'+round+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
const line=(x,y,X,Y,color='#9dcedb',width=3,dash=false)=>'<path d="M'+x+' '+y+' L'+X+' '+Y+'" fill="none" stroke="'+color+'" stroke-width="'+width+'"'+(dash?' stroke-dasharray="8 8"':'')+'/>';
const text=(x,y,t,col=pale,size=18)=>U.text(x,y,t,col,size);
const arrow=(x,y,dx,dy,col=mint,label='')=>U.arrow(x,y,dx,dy,col,label);
const symbol=s=>s>0?'+':s<0?'−':'0';
const hue=s=>s>0?red:s<0?blue:'#bdcddd';
function bead(x,y,q,r=15,draggable=null){
 return '<g'+(draggable?' data-drag="'+draggable+'"':'')+'>'+circle(x,y,r,q>0?'#ad6747':q<0?'#376e94':'#45566d')+
 text(x-8,y+7,symbol(q),'#fff',22)+'</g>';
}
function scatter(x,y,n,s,color,cols=4){
 let b='';const count=clamp(Math.round(Math.abs(n)),0,18);
 for(let i=0;i<count;i++)b+=circle(x+(i%cols)*23,y+Math.floor(i/cols)*24,7,color||hue(s),'#f3f5ef');
 return b;
}
const stage=(title,body,hint)=>U.svg(text(35,39,title,'#dceff6',21)+body+text(35,338,hint,'#b9d8e0',15),title);
function friction(p,o){
 const x=142+308*p.rub,y=151;let b=rect(507,124,170,116,'#645467','#f6d3ce',25)+text(534,185,'YÜN','#ffe5dc',25);
 b+=rect(x,80,48,208,'#357c9f','#aeddec',12);
 b+='<rect data-drag="rub" x="'+(x-22)+'" y="60" width="92" height="240" fill="transparent"/>';
 b+=scatter(x+12,97,Math.abs(o.rod),o.rod,'#91d8fb',2)+scatter(535,141,Math.abs(o.cloth),o.cloth,'#ffd6ab',4);
 b+=text(65,86,'Çubuk: '+symbol(o.rod)+Math.abs(o.rod)+' birim',hue(o.rod),19);
 b+=text(507,275,'Yün: '+symbol(o.cloth)+Math.abs(o.cloth)+' birim',hue(o.cloth),19);
 if(o.receivedByRod!==0)b+=arrow(487,110,-50,0,o.receivedByRod>0?blue:red,'e⁻');
 return stage('Sürtünme: elektronlar bir cisimden diğerine geçer',b,'Çubuğu yüne sürükle. Toplam yük her adımda sıfır kalır.');
}
function contact(p,o){
 const x1=244,x2=600-258*p.progress,y=174;
 let b=line(150,280,672,280,'#416075',4);
 b+='<g>'+bead(x1,y,o.first,49)+'</g><g data-drag="progress">'+bead(x2,y,o.second,49)+'</g>';
 b+=text(129,84,'A başlangıç: '+symbol(p.first)+Math.abs(p.first),hue(p.first),18);
 b+=text(505,84,'B başlangıç: '+symbol(p.second)+Math.abs(p.second),hue(p.second),18);
 b+=text(310,300,o.touched?'DEĞDİ: YÜK PAYLAŞILDI':'B küresini A üzerine sürükle',o.touched?mint:'#cfdfeb',19);
 b+=scatter(x1-22,215,o.first,o.first,null,4)+scatter(x2-22,215,o.second,o.second,null,4);
 return stage('Özdeş iletken kürelerde dokunmayla elektriklenme',b,'Birbirine değince toplam yük korunur; özdeş küreler eşit yük alır.');
}
function induction(p,o){
 const metalX=484,rodX=o.rodPresent?200:64;
 let b=circle(metalX,177,88,'#375d70','#c0dbe5');
 b+=rect(rodX,92,47,169,p.rodSign>0?'#965c44':'#35739f','#bfdde8',13);
 b+=bead(rodX+24,138,p.rodSign,21);
 if(o.polarized){
  b+=scatter(420,127,6,o.nearSign,null,2);
  if(o.farSign)b+=scatter(519,127,4,o.farSign,null,2);
 } else if(o.netSign)b+=Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return circle(metalX+75*Math.cos(a),177+75*Math.sin(a),7,hue(o.netSign),'#e6f1f7');}).join('');
 else b+=scatter(457,137,4,1,null,2)+scatter(504,137,4,-1,null,2);
 if(o.groundConnected)b+=line(484,265,484,309,'#d3e6ed',5)+line(457,310,511,310,'#dfc88f',5)+line(466,319,504,319,'#dfc88f',3);
 b+=text(69,75,'1: Yaklaştır · 2: Toprakla · 3: Kes · 4: Uzaklaştır','#e8eceb',17);
 b+=text(82,289,p.stage===0?'Başlangıç':p.stage===1?'Yük ayrıştı':p.stage===2?'Toprak bağlı':p.stage===3?'Toprak kesildi':'Çubuk uzaklaştı',mint,19);
 return stage('Etki ile elektriklenme: sıralama önemlidir',b,'Toprak bağlantısını çubuk yanındayken kes; net yük kalır.');
}
function scope(p,o){
 const x=435,y=125,opening=o.opening;
 let b=rect(376,99,118,46,'#315875','#a5d4e2',20)+line(x,145,x,215,'#dfdbcb',9);
 b+=line(x,216,x-17-opening*80,300,'#f9da9b',10)+line(x,216,x+17+opening*80,300,'#f9da9b',10);
 b+=rect(358,90,154,231,'transparent','#456a7f',65)+bead(635-190*p.approach,133,p.rodSign,28,'approach');
 b+=text(95,85,'Ön yük: '+(p.known===0?'Nötr':p.known>0?'+':'−'),'#d5eafb');
 b+=text(91,132,'Çubuk: '+symbol(p.rodSign),hue(p.rodSign),23);
 b+=text(480,299,opening<.08?'Yapraklar kapalı':'Yapraklar açıldı','#b6efd7',17);
 return stage('Elektroskop: yaprakların açısını izle',b,'Yüklü çubuğu yaklaştır. Önceden bilinen işaretle karşılaştır.');
}
function distribution(p,o){
 const s=p.material===0?'İLETKEN':'YALITKAN',x=403,y=172;
 let b=rect(238,94,331,161,o.surface?'#2d6580':'#715f4f','#bedbe3',26);
 if(o.net!==0){
  for(let i=0;i<Math.min(16,Math.abs(o.net)*2);i++){
   const xx=o.surface?250+(i%8)*44:290+(i%4)*24,yy=o.surface?(i<8?111:241):130+Math.floor(i/4)*26;
   b+=circle(xx,yy,8,hue(o.net),'#f5e8da');
  }
 }
 b+=text(300,190,s,'#e9f4f7',24);
 if(p.ground&&p.material===0)b+=line(x,255,x,313,'#cbdee9',4)+text(438,304,'TOPRAK','#f5d4a4',16);
 return stage('İletken: yüzeye dağılır · yalıtkan: yerel kalır',b,'Maddeyi değiştir veya iletkeni toprağa bağla; yük dağılımını izle.');
}
function grounding(p,o){
 const x=390,y=171;let b='<g data-step="stage">'+circle(x,y,77,'#30586e','#b8dce7')+'</g>';
 const n=clamp(Math.abs(o.charge)*2,0,16);
 for(let i=0;i<n;i++){const a=i/n*2*Math.PI;b+=circle(x+64*Math.cos(a),y+64*Math.sin(a),8,hue(o.charge),'#e9f0e9');}
 if(o.connected)b+=line(390,248,390,293,'#74dfc5',5)+line(347,298,433,298,'#e2d8b1',5)+line(358,306,423,306,'#e2d8b1',3)+line(372,315,410,315,'#e2d8b1',3);
 b+=text(52,88,'Aşama: '+p.stage,'#d9eaf2')+text(514,129,o.connected?'TOPRAK BAĞLI':'TOPRAK KESİK',mint,18);
 b+=text(513,180,o.charge===0?'NÖTR':o.charge>0?'POZİTİF':'NEGATİF',hue(o.charge),20);
 if(o.transfer)b+=arrow(503,285,o.transfer>0?-95:95,0,blue,'e⁻');
 return stage('Topraklama: yük elektron alışverişiyle dengelenir',b,'Başlangıç → toprak bağla → nötrleşsin → bağlantıyı kes.');
}
function cage(p,o){
 const x=415,y=174,r=119,rodX=149+clamp(p.approach,0,1)*120;
 let b='<circle data-toggle="closed" cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#143048" stroke="'+(p.closed?'#98e7dc':'#76919d')+'" stroke-width="13"'+(p.closed?'':' stroke-dasharray="12 25"')+'/>';
 b+=circle(x,y,20,'#4b6173','#9fc6d8')+text(x-17,y+7,'TEST','#f2dca7',11);
 b+=bead(rodX,174,p.externalSign,35,'approach');
 const n=7;
 for(let i=0;i<n;i++){
  const yy=76+i*34;
  b+=line(rodX+42,yy,rodX+75,yy,p.closed?'#63a7bd':'#8de3d4',2,true);
 }
 if(!p.closed)b+=arrow(328,172,65,0,'#f0c78a','E');
 b+=text(500,70,p.closed?'Kapalı iletken kafes':'Açık kafes',p.closed?mint:'#efc993',19);
 b+=text(505,307,p.closed?'İçeride E ≈ 0':'Alan içeri girebilir','#dbecf1',19);
 return stage('Faraday kafesi: elektrostatik alandan korunma',b,'İdeal kapalı iletken elektrostatik dengede iç kısmı korur.');
}
function coulomb(p,o){
 const x1=172,x2=172+p.distance*146,y=175,scale=clamp(Math.log1p(o.magnitude*4)*76,23,108);
 let b=line(90,280,734,280,'#3a5874',2,true);
 b+=bead(x1,y,p.q1,35)+bead(x2,y,p.q2,35,'distance');
 if(!o.zero){
  const dir=Math.sign(o.forceOn1);
  b+=arrow(x1,y,dir*scale,0,red,'F₁')+arrow(x2,y,-dir*scale,0,blue,'F₂');
 }
 b+=text(90,87,'q₁: '+symbol(p.q1)+Math.abs(p.q1)+' µC','#efceab')+
 text(425,87,'q₂: '+symbol(p.q2)+Math.abs(p.q2)+' µC','#b4e5f1');
 b+=text(250,306,'Uzaklık: '+fmt(p.distance,2)+' m','#dbedec');
 b+=text(353,245,o.zero?'F = 0':o.repel?'İTME':'ÇEKME',mint,23);
 return stage('Coulomb: noktasal yüklerde 1 boyutlu kuvvet',b,'Sağdaki yükü sürükle: uzaklık artarsa kuvvet 1/r² ile azalır.');
}
function field(p,o){
 const x=346,y=175,px=x+86+p.distance*66,r=137;
 let b='';
 for(let i=0;i<12;i++){
  const a=i*Math.PI/6,xx=x+Math.cos(a)*56,yy=y+Math.sin(a)*56;
  b+=arrow(xx,yy,Math.cos(a)*40*o.fieldDirection,Math.sin(a)*40*o.fieldDirection,'#6db3d0','');
 }
 b+=bead(x,y,p.source,38)+bead(px,y,p.test,25,'distance');
 b+=arrow(px,y,o.fieldDirection*93,0,mint,'E');
 b+=arrow(px,y+59,o.forceDirection*93,0,'#f6cb87','F');
 b+=text(53,80,'Kaynak: '+symbol(p.source),'#e6c8ae',22)+text(485,80,'Deneme yükü: '+symbol(p.test),'#c7e1ed',20);
 return stage('Alan yönü pozitif deneme yüküne göredir',b,'Alan E kaynağa bağlıdır; negatif yükte kuvvet F ters yöndedir.');
}
function polarize(p,o){
 const rodX=122+175*p.near,paperX=527-(p.near*103);
 let b=rect(rodX,101,58,154,p.rodSign>0?'#996848':'#316f95','#daebed',15);
 b+=bead(rodX+29,172,p.rodSign,22,'near');
 b+='<g data-drag="near" data-side="paper">'+rect(paperX-43,121,86,102,'#e6dfc8','#f5eed9',9)+scatter(paperX-28,147,4,o.nearSign,null,2)+scatter(paperX+11,147,4,o.farSign,null,2)+'</g>';
 b+=text(55,68,'Nötr kâğıt: toplam yük = 0','#e4ecf1',19);
 b+=text(403,287,o.attracted?'Kâğıt yaklaşıyor':'Çubuğu yaklaştır',mint,19);
 return stage('Nötr parçacıklar da yüklü çubuk tarafından çekilebilir',b,'Elektronlar yer değiştirir; nötr cismin yakın tarafı zıt yüklenir.');
}
const sections=[
{id:'friction',tab:'Sürtünme',title:'Elektronları iki cisim arasında taşı',intro:'Plastik çubuğu yüne doğru sürükle. Sürtünmeyle elektron transferi gerçekleşsin; yük korunumu canlı kalsın.',defaults:{electrons:6,rub:0},controls:[ctl('electrons','Elektron aktarımı yönü ve sayısı',-8,8,1,'e⁻'),ctl('rub','Sürtünme ilerlemesi',0,1,.01,'')],model:p=>M.friction({electrons:Math.round(p.electrons*p.rub)}),scene:friction,interpret:(p,o)=>o.receivedByRod>0?'Yün elektron verir ve pozitif; plastik çubuk elektron alır ve negatif olur. Toplam elektrik yükü korunur.':o.receivedByRod<0?'Elektron yönü ters çevrildi. Elektron alan negatif, elektron veren pozitif yüklenir. Toplam yük yine korunur.':'Başlangıçta iki cisim nötr; elektron transferi gerçekleşmedi.',formula:()=> 'Yük korunumu: q₁ + q₂ = sabit\nElektrik yükü birimi: C; birim yük e ≈ 1,60 × 10⁻¹⁹ C',metrics:(p,o)=>[['Çubuk yükü',o.rod+' e'],['Yün yükü',o.cloth+' e'],['Toplam',o.total+' e']],note:'9.6.1.1. Elektronlar aktarılır, protonlar katı cisimler arasında taşınmaz. e⁻ sayıları kavramsal temsildir.',motion:{key:'rub',min:0,max:1,speed:.4,step:.1}},
{id:'contact',tab:'Dokunma',title:'Özdeş metal küreleri birbirine değdir',intro:'İki özdeş iletken küreden sağdakini sürükle; temas edince yüklerin eşit paylaşıldığını izle.',defaults:{first:8,second:0,progress:0},controls:[ctl('first','A küresi başlangıç yükü',-8,8,2,'birim'),ctl('second','B küresi başlangıç yükü',-8,8,2,'birim'),ctl('progress','Kürelerin yaklaşması',0,1,.01,'')],model:M.contact,scene:contact,interpret:(p,o)=>o.touched?'Özdeş ve birbirinden yalıtılmış iletkenler temas ettiğinde toplam yükü eşit paylaşır. Toplam yük değişmez.':'Küreler henüz temas etmedi. Bu idealleştirilmiş modelde uzaktan yük alışverişi yok.',formula:()=> 'Özdeş iletkenlerde temas sonrası: q₁ = q₂ = (Q₁ + Q₂) / 2',metrics:(p,o)=>[['A son yük',fmt(o.first)+' birim'],['B son yük',fmt(o.second)+' birim'],['Toplam yük',fmt(o.total)+' birim']],note:'9.6.1.1 · İki özdeş iletken küre; çevreden yalıtılmış, yük kaybı yok. Uzakken kutuplaşma ayrıntısı burada gösterilmez.',motion:{key:'progress',min:0,max:1,speed:.45,step:.1}},
{id:'induction',tab:'Etki ile yükleme',title:'Çubuğu yaklaştır, toprakla, kabloyu kes',intro:'Aşamaları doğru sırayla uygula. Yüksüz iletkende elektronlar hareket etsin, topraklama sonrasında kalıcı net yük oluşsun.',defaults:{rodSign:-1,stage:0},controls:[ctl('rodSign','Çubuk işareti',-1,1,2,''),ctl('stage','0 Uzak · 1 Yakın · 2 Toprakla · 3 Kes · 4 Uzaklaştır',0,4,1,'aşama')],model:M.induction,scene:induction,interpret:(p,o)=>p.stage===0?'Yalıtılmış metal küre nötr.':p.stage===1?'Çubuk yaklaşınca iletkende yükler ayrışır. Toplam yük yine sıfırdır.':p.stage===2?'Yüklü çubuk yakınken toprak bağlantısı elektron alışverişi sağlar.':p.stage===3?'Toprak bağlantısı kesildi; etkiyle yüklenme korunur.':'Yüklü çubuk uzaklaştı; iletkenin net yük işareti çubukla zıttır.',formula:()=> 'Yalnız etki (kutuplaşma) net yük oluşturmaz.\nToprak üzerinden elektron alışverişi net yük oluşturur.',metrics:(p,o)=>[['Çubuk',symbol(p.rodSign)],['Küre net yük',symbol(o.netSign)],['Toprak',o.groundConnected?'Bağlı':'Kesik']],note:'9.6.1.1 ve 9.6.1.2. Toprakla yüklenme ancak uygun bağlantı ve sıralamayla olur. Sahnede nitel yük işaretleri vardır, net yük miktarı hesaplanmaz.'},
{id:'scope',tab:'Elektroskop',title:'Elektroskobun yaprakları neden ayrılıyor?',intro:'Ön yükü bilinen elektroskoba pozitif veya negatif çubuğu yaklaştır. Açılma artıyor mu azalıyor mu gözlemle.',defaults:{known:-1,rodSign:-1,approach:0},controls:[ctl('known','− Ön yüklü · 0 Nötr · + Ön yüklü',-1,1,1,''),ctl('rodSign','Yaklaştırılan çubuk',-1,1,2,''),ctl('approach','Çubuğun yakınlığı',0,1,.01,'')],model:p=>M.electroscope({known:p.known,rod:p.rodSign,approach:p.approach}),scene:p=>scope({...p},M.electroscope({known:p.known,rod:p.rodSign,approach:p.approach})),interpret:(p,o)=>p.known===0?'Nötr elektroskop yaklaştırılan yükün işaretini tek başına belirleyemez; yapraklar etkiyle açılabilir.':o.trend==='opens'?'Ön yükü bilinen elektroskopta açılma artarsa yaklaşan yükün işareti ön yükle aynıdır.':'Ön yükü bilinen elektroskopta açılma azalması zıt işarete işaret eder. Çok güçlü etki sonrasında yeniden açılma olabilir.',formula:()=> 'Aynı işaretli yükler birbirini iter.\nElektroskopun ön yükü bilinmeden çubuğun işareti kesin bulunamaz.',metrics:(p,o)=>[['Yaprakların durumu',o.opening<.08?'Kapalı':'Açık'],['Ön yük',symbol(p.known)],['Yaklaşan yük',symbol(p.rodSign)]],note:'9.6.1.1(c). Dokunmadan etkiyle elektroskop toplam yük kazanmaz; açılma yaklaşık modeldir.',motion:{key:'approach',min:0,max:1,speed:.35,step:.1}},
{id:'distribution',tab:'İletken–yalıtkan',title:'Yük nerede birikir?',intro:'İletken ve yalıtkan malzemeyi seç. Aynı net yükün yüzeye yayıldığını veya yerel kaldığını gör; iletkeni toprakla.',defaults:{material:0,charge:-6,ground:0},controls:[ctl('material','0 İletken · 1 Yalıtkan',0,1,1,''),ctl('charge','Yük işareti ve büyüklüğü',-8,8,2,'birim'),ctl('ground','Toprak bağlantısı',0,1,1,'')],model:p=>M.distribution({material:p.material===0?'conductor':'insulator',charge:p.charge,grounded:!!p.ground}),scene:(p,o)=>distribution(p,o),interpret:(p,o)=>o.surface?'İletkende serbest yükler elektrostatik dengede yüzey boyunca dağılır. Topraklanırsa uygun koşullarda fazlalık yük aktarılır.':'Yalıtkanda yükler sürtündürülen bölgenin yakınında kalır; serbestçe tüm yüzeye yayılamaz.',formula:()=> 'İletken: hareketli yükler · Yalıtkan: bağlı yükler',metrics:(p,o)=>[['Madde',o.surface?'İletken':'Yalıtkan'],['Toplam yük',fmt(o.net)+' birim'],['Dağılım',o.surface?'Yüzey':'Yerel']],note:'9.6.1.2. Sıfır dış alanlı, elektrostatik denge kabulü. Topraklama, yalıtkanın aniden tüm yükünü boşaltmaz.'},
{id:'ground',tab:'Topraklama',title:'Yüklü iletkeni güvenli biçimde nötrle',intro:'Toprak bağlantısı yap; elektronların yönünü gör ve sonrasında kabloyu kes.',defaults:{initial:-6,stage:0},controls:[ctl('initial','İlk yük',-8,8,2,'birim'),ctl('stage','0 Yüklü · 1 Kablo · 2 Nötr · 3 Ayrılmış',0,3,1,'aşama')],model:M.grounding,scene:grounding,interpret:(p,o)=>p.stage===0?'Yüklü iletken topraktan yalıtılmıştır.':p.stage===1?'İletken topraklandı; elektronlar potansiyel denge sağlanana kadar hareket eder.':p.stage===2?'Bu ideal modelde iletken nötr hale gelmiştir.':'Toprak bağlantısı kesildi, iletkenin nötr yük durumu korunur.',formula:()=> 'Toprak: büyük yük rezervuarı.\nElektron hareketiyle elektrik yükleri dengelenir.',metrics:(p,o)=>[['İletken son yük',fmt(o.charge)+' birim'],['Toprak',o.connected?'Bağlı':'Kesik']],note:'9.6.1.2(c). Yakında başka yüklü cisim yoktur; yalnız bağlantı olunca yük akışı olur.'},
{id:'cage',tab:'Faraday kafesi',title:'Kapalı iletken kafes elektrik alanı neden azaltır?',intro:'Kafesi aç/kapat, dışarıdaki yükü sürükle. İçerideki test noktasının alan etkisini karşılaştır.',defaults:{closed:1,externalSign:-1,approach:.4},controls:[ctl('closed','0 Açık · 1 Kapalı',0,1,1,''),ctl('externalSign','Dış yükün işareti',-1,1,2,''),ctl('approach','Dış yükün yakınlığı',0,1,.01,'')],model:p=>M.cage({closed:!!p.closed,external:p.externalSign}),scene:cage,interpret:(p,o)=>o.shielded?'Elektrostatik dengede kapalı iletkenin iç boşluğundaki dış kaynaklı elektrik alan sıfırdır (içeride yük yoksa).':'Kafes açıkken ideal elektrostatik koruma garantisi yoktur; dış elektrik alan içeri etki edebilir.',formula:()=> 'İdeal kapalı iletken içinde dış elektrostatik alan: E = 0\nBu bir elektrik alan büyüklüğü hesap sorusu değildir.',metrics:(p,o)=>[['Kafes',o.shielded?'Kapalı':'Açık'],['İç ortam',o.shielded?'Korunur':'Koruma eksik']],note:'9.6.1.2(b). Model yalnız elektrostatik dış alan ve ideal kapalı iletken için geçerlidir; yüksek frekans, kafes delikleri ve gerçek malzeme kayıpları incelenmez.'},
{id:'coulomb',tab:'Coulomb kuvveti',title:'İki yükü tutup aralarındaki kuvveti keşfet',intro:'Sağdaki yükü sürükle. Yükleri artı/eksi yap, uzaklığı iki katına çıkar; kuvvetin büyüklüğünü ve ok yönünü izle.',defaults:{q1:3,q2:-2,distance:1.5},controls:[ctl('q1','Birinci noktasal yük',-5,5,1,'µC'),ctl('q2','İkinci noktasal yük',-5,5,1,'µC'),ctl('distance','Yükler arası uzaklık',.5,3.5,.1,'m')],model:M.coulomb,scene:coulomb,interpret:(p,o)=>o.zero?'Yüklerden biri nötrse bu modelde iki noktasal yük arasındaki Coulomb kuvveti sıfırdır.':o.repel?'Yüklerin işaretleri aynı olduğundan birbirini iter. Kuvvetler eşit büyüklükte zıt yönlüdür.':'Yüklerin işaretleri zıttır; birbirini çeker. Kuvvetler eşit büyüklükte zıt yönlüdür.',formula:()=> 'F = k · |q₁ q₂| / r²\nk = 9 × 10⁹ N·m²/C²\n1 µC = 10⁻⁶ C (TYT 9.6.1.3: 1B sayısal hesap serbest)',metrics:(p,o)=>[['Kuvvet büyüklüğü',fmt(o.magnitude,4)+' N'],['1. yükün kuvvet yönü',o.zero?'Yok':o.forceOn1>0?'Sağa':'Sola'],['2. yükün kuvvet yönü',o.zero?'Yok':o.forceOn2>0?'Sağa':'Sola']],note:'9.6.1.3. Noktasal yükler, aynı doğru, vakum/hava yaklaşımı; yalıtkan diğer etkiler yok. 1/r² kanunu için sayısal hesap yapılabilir.'},
{id:'field',tab:'Elektrik alan',title:'Alan yönü ile kuvvet yönünü ayır',intro:'Kaynak yükün işaretini değiştir; deneme yükünü sağa–sola sürükle. Negatif yükte kuvvetin alan okuna ters olduğunu gör.',defaults:{source:1,test:1,distance:1.5},controls:[ctl('source','Kaynak yükün işareti',-1,1,2,''),ctl('test','Deneme yükünün işareti',-1,1,2,''),ctl('distance','Deneme yükünün uzaklığı',.5,3.5,.1,'m')],model:M.field,scene:field,interpret:(p,o)=>o.sourceSign>0?'Pozitif kaynak yükün elektrik alan yönü dışarı doğrudur. Negatif deneme yüküne etki eden kuvvet, alanın tersinedir.':'Negatif kaynak yükün elektrik alan yönü kaynağa doğrudur. Pozitif deneme yükünün kuvveti alanla aynı yöndedir.',formula:()=> 'E = F / q₀ (pozitif deneme yükü tanımı)\nAlan ile kuvvet arasındaki ilişki kavramsal; sayısal hesap yok.',metrics:(p,o)=>[['Alan yönü',o.fieldDirection>0?'Kaynak yükten dışarı':'Kaynak yüke doğru'],['Deneme yükünün kuvveti',o.forceDirection>0?'Sağa':'Sola']],note:'9.6.1.4. Elektrik alan sayısal büyüklük hesabı, potansiyel veya 2B alan vektörleri bu TYT deneyine eklenmez. Yön okları temsili çizilmiştir.'},
{id:'polar',tab:'Nötr kâğıt',title:'Nötr kâğıt parçaları neden çekilir?',intro:'Yüklü çubuğu nötr kâğıda yaklaştır. İç yüklerin ayrışmasını ve iki işarette de çekimi izle.',defaults:{rodSign:-1,near:0},controls:[ctl('rodSign','Çubuğun işareti',-1,1,2,''),ctl('near','Çubuğun yakınlığı',0,1,.01,'')],model:p=>M.polarize({rod:p.rodSign,near:p.near}),scene:polarize,interpret:()=> 'Nötr kâğıt polarize olur: yakın yüzey zıt, uzak yüzey aynı işaretli etki gösterir. Yakın taraftaki çekim daha büyük olduğundan net çekim oluşabilir.',formula:()=> 'Yük korunumu: kâğıdın toplam yükü hâlâ sıfır.',metrics:(p,o)=>[['Kâğıdın net yükü','0'],['Etkileşim',o.attracted?'Çekim':'Henüz zayıf']],note:'9.6.1.1 ve 9.6.1.3. Şemada yük ayrışması gösterilir; yük transferi olduğu iddia edilmez. Kuvvet hesabı yapılmaz.',motion:{key:'near',min:0,max:1,speed:.4,step:.1}}
];
w.TytElektroLab=V.create({sections,questions:[]});
})(window);
