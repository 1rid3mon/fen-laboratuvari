/* Interactive observations for old 2018 MEB 11.1.10.1–3. No exam-question bank. */
(function(w){'use strict';const M=w.BasitMakineMath,U=w.MekanikUI;if(!M||!U)return;
const f=U.U.fmt,metric=(...x)=>x;
const c=(id,label,min,max,step,unit)=>({id,label,min,max,step,unit});
const base=[c('load','Yükün ağırlığı',20,300,10,'N'),c('eta','Verim',.5,1,.05,'×100%')];
const summary=(r)=>metric(['Gerekli kuvvet',f(r.effort)+' N'],['Kuvvet kazancı',f(r.actualAdvantage)+' kat'],['Kuvvet yolu',f(r.travel)+' m'],['Yük yolu',f(r.loadTravel)+' m'],['Verilen iş',f(r.workIn)+' J'],['Yararlı iş',f(r.workOut)+' J'],['Kayıp',f(r.loss)+' J']);
const explain=r=>(r.eta===1?'İdeal makine: giren iş = yararlı iş. ':'Verim %'+f(r.eta*100)+': giren işin bir kısmı kayıptır. ')+
 'Kuvvetten kazanç varsa aynı oranda yoldan kayıp vardır. Hiçbir basit makine enerji üretmez.';
const bars=(r,U)=>U.bars([['Kuvvet işi (giriş)',r.workIn,'#f7be76'],['Yüke geçen yararlı iş',r.workOut,'#6ae1c4'],['Kayıp enerji',r.loss,'#ff9aa3']]);
const leverScene=(p,r,U)=>{
 const ful=400,scale=110,l=ful-p.loadArm*scale,e=ful+p.effortArm*scale;
 let b='<rect x="'+Math.max(40,l-35)+'" y="196" width="'+Math.min(720,e-l+70)+'" height="16" rx="5" fill="#43738a" stroke="#b5e3ec"/>'+
 '<path d="M380 255 L400 211 L420 255 Z" fill="#64819a" stroke="#b8dfe9"/>';
 b+=U.arrow(l,104,0,92,'#ffc48a','Yük ↓')+U.arrow(e,297,0,-85,'#79e8c6','F ↑');
 b+=U.text(62,40,'Yük kolu: '+f(p.loadArm)+' m · Kuvvet kolu: '+f(p.effortArm)+' m','#d5eaf2');
 return U.svg(b,'Kaldıraç, destek, yük ve kuvvet kolları');
};
const pulleyScene=(p,r,U)=>{
 const n=p.moving?p.n:1,top=74,loadY=230,cent=395;
 let b=U.line(145,top,650,top,'#8aa9ba',5);
 for(let i=0;i<n;i++){const x=cent+(i-(n-1)/2)*30;b+=U.line(x,top,x,loadY,'#79dcd2',3);}
 b+='<rect x="326" y="'+loadY+'" width="138" height="50" rx="8" fill="#376781" stroke="#a9dfec"/>';
 b+=U.text(343,loadY+30,'Yük: '+f(p.load)+' N','#fff');
 b+=U.arrow(680,110,0,85,'#ffce85','F');
 b+=U.text(65,40,p.moving?'Hareketli makara / palanga: '+n+' taşıyan ip':'Sabit makara: yön değişir, ideal kazanç 1','#d5eaf2');
 return U.svg(b,'Taşıyan ip sayısı ve yük arasındaki ilişki');
};
const inclineScene=(p,r,U)=>{
 const x=115,y=290,L=560,dy=215*p.height/p.length;
 let b='<path d="M'+x+' '+y+' L'+(x+L)+' '+(y-dy)+' L'+(x+L)+' '+y+' Z" fill="#31596e" stroke="#9bcbd8" stroke-width="3"/>';
 b+='<rect x="'+(x+L*.45)+'" y="'+(y-dy*.45-29)+'" width="58" height="32" fill="#e1a774" stroke="#fff"/>';
 b+=U.arrow(385,y-dy*.45-10,112,-112*dy/215,'#7ce9c8','F');
 b+=U.text(50,40,'Uzunluk '+f(p.length)+' m · Yükseklik '+f(p.height)+' m','#e5edf1');
 return U.svg(b,'Eğik düzlemde yol ve yüksekliğin kuvvete etkisi');
};
const wheelScene=(p,r,U)=>{
 const cx=390,cy=192,R=115,small=R*p.axleRadius/p.wheelRadius;
 let b='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#244c68" stroke="#b8ddec" stroke-width="5"/>'+
 '<circle cx="'+cx+'" cy="'+cy+'" r="'+small+'" fill="#b47d53" stroke="#f3d3a5" stroke-width="4"/>';
 b+=U.arrow(cx+R,cy,0,110,'#7be6c8','F')+U.arrow(cx+small,cy,0,70,'#ffbf82','Yük');
 b+=U.text(58,40,'Büyük yarıçap '+f(p.wheelRadius)+' m · Küçük '+f(p.axleRadius)+' m','#e4f3f4');
 return U.svg(b,'Çıkrık, tekerlek ve mil yarıçapları');
};
const screwScene=(p,r,U)=>{
 let b='<rect x="340" y="80" width="110" height="225" rx="8" fill="#294e6a" stroke="#9cd3e0"/>';
 for(let i=0;i<8;i++)b+=U.line(335,98+i*25,460,98+i*25,'#f5cb83',3);
 b+=U.line(260,68,530,68,'#9bdce5',8)+U.arrow(530,68,0,76,'#80eacb','F');
 b+=U.text(58,36,'Bir turda yükselme: '+f(p.pitch)+' m','#d9eaf2');
 return U.svg(b,'Vida adımı ve kuvvet kolu; şematik');
};
const gearsScene=(p,r,U)=>{
 const x=295,y=184,R=75,R2=R*p.outputTeeth/p.inputTeeth;
 let b='<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="#27516b" stroke="#9fd9e8" stroke-width="4"/>'+
 '<circle cx="'+(x+R+R2)+'" cy="'+y+'" r="'+R2+'" fill="#775e44" stroke="#f3ca8c" stroke-width="4"/>';
 b+=U.text(65,39,'Diş sayıları: '+p.inputTeeth+' → '+p.outputTeeth,'#cfe8f0');
 b+=U.text(65,327,'Dıştan temas eden iki dişli zıt yönde döner.','#e0d4af');
 return U.svg(b,'Dişli çarklar, diş sayısı ve ters dönme yönü');
};
const beltsScene=(p,r,U)=>{
 const R=80,R2=R*p.drivenRadius/p.driveRadius,x1=230,x2=570,y=187;
 let b='<circle cx="'+x1+'" cy="'+y+'" r="'+R+'" fill="#274b66" stroke="#b7dbe8" stroke-width="4"/>'+
 '<circle cx="'+x2+'" cy="'+y+'" r="'+R2+'" fill="#8a6645" stroke="#f0c78d" stroke-width="4"/>';
 if(!p.crossed)b+=U.line(x1,y-R,x2,y-R2,'#6ee0cc',5)+U.line(x1,y+R,x2,y+R2,'#6ee0cc',5);
 else b+=U.line(x1,y-R,x2,y+R2,'#6ee0cc',5)+U.line(x1,y+R,x2,y-R2,'#6ee0cc',5);
 b+=U.text(58,38,p.crossed?'Çapraz kayış: dönüş yönü ters':'Açık kayış: dönüş yönü aynı','#d9f1f3');
 return U.svg(b,'Kasnak çapları, açık veya çapraz kayış');
};
const sections=[
{id:'lever',tab:'Kaldıraç',title:'Desteği ve kuvvet kolunu değiştir',sceneTitle:'Tork dengesi',
 intro:'Kaldıraç kollarını değiştir; gereken kuvveti ve yükün aldığı yolu birlikte izle.',
 defaults:{load:100,effortArm:2,loadArm:1,travel:1,eta:1},
 controls:[base[0],c('effortArm','Kuvvet kolu',.5,3,.25,'m'),c('loadArm','Yük kolu',.5,3,.25,'m'),c('travel','Kuvvetin yolu',.25,3,.25,'m'),base[1]],
 model:M.lever,scene:leverScene,interpret:(p,r)=>explain(r),
 formula:(p,r)=>'İdeal: F·rF = Yük·rY\nİdeal kuvvet kazancı = rF/rY = '+f(r.ratio)+'\nGerçek: F = Yük/(kazanç×verim) = '+f(r.effort)+' N',
 metrics:(p,r)=>summary(r),note:'Kütlesiz, ideal rijit çubuk; küçük dönme açısında yol oranı kol oranıdır. Verim, toplam sürtünme kayıplarını temsil eder.'},
{id:'pulley',tab:'Makara / palanga',title:'Taşıyan ip sayısını artır, kuvveti azalt',
 sceneTitle:'Sabit ve hareketli makara',
 intro:'Sabit makarada yön değişir; hareketli makarada yükü taşıyan ip sayısı kuvvet kazancını belirler.',
 defaults:{load:120,moving:1,n:2,travel:2,eta:1},
 controls:[base[0],c('moving','0=sabit, 1=hareketli',0,1,1,''),c('n','Yükü taşıyan ip sayısı',1,6,1,'ip'),c('travel','Çekilen ip uzunluğu',.5,6,.5,'m'),base[1]],
 model:M.pulley,scene:pulleyScene,interpret:(p,r)=>explain(r)+(p.moving?' Taşıyan ip sayısı '+p.n+'.':' Sabit makarada ip sayısı ayarı fiziksel kazancı değiştirmez.'),
 formula:(p,r)=>'İdeal kuvvet kazancı = '+f(r.ratio)+'\nF = Yük/(kazanç×verim) = '+f(r.effort)+' N\nYük yükselmesi = çekilen ip / kazanç = '+f(r.loadTravel)+' m',
 metrics:(p,r)=>summary(r),note:'İdeal kütlesiz, esnemez ip. Hareketli sistemde n bağımsız yük taşıyan ip parçası kabul edilir; sabit makarada n kontrolü etkisizdir. Şema gerçek palanga ip geçiş geometrisini göstermez.'},
{id:'incline',tab:'Eğik düzlem',title:'Aynı yüksekliğe daha uzun yoldan çık',
 sceneTitle:'Yükseklik – yol ilişkisi',
 intro:'Yol uzadığında aynı yükü daha küçük kuvvetle çıkarırsın; daha çok yol alırsın.',
 defaults:{load:100,height:1,length:4,eta:1},
 controls:[base[0],c('height','Yükselme yüksekliği',.5,2,.25,'m'),c('length','Eğik düzlem uzunluğu',2,8,.5,'m'),base[1]],
 model:M.incline,scene:inclineScene,interpret:(p,r)=>explain(r),
 formula:(p,r)=>'İdeal: F·L = Yük·h\nF = Yük·h/(L×verim) = '+f(r.effort)+' N',
 metrics:(p,r)=>summary(r),note:'Sabit hızlı yukarı çıkarma, düzgün eğik düzlem. Verim sürtünme dahil toplam kaybı temsil eder; ayrıntılı sürtünme kuvveti modeli değildir.'},
{id:'wheel',tab:'Çıkrık',title:'Büyük çarkla küçük mili çevir',
 sceneTitle:'Kuvvet ve yol oranı',
 intro:'Büyük tekerleğin yarıçapını büyüt; aynı yük için gereken kuvveti ve elinin katettiği yolu gör.',
 defaults:{load:100,wheelRadius:1,axleRadius:.25,turns:1,eta:1},
 controls:[base[0],c('wheelRadius','Kuvvet uygulama yarıçapı',.5,2,.25,'m'),c('axleRadius','Yükün sarıldığı mil yarıçapı',.1,.5,.05,'m'),c('turns','Tur sayısı',.5,4,.5,'tur'),base[1]],
 model:M.wheelAxle,scene:wheelScene,interpret:(p,r)=>explain(r),
 formula:(p,r)=>'F·R = Yük·r (ideal)\nKuvvet kazancı = R/r = '+f(r.ratio)+'\nYük yolu = 2πr×tur = '+f(r.loadTravel)+' m',
 metrics:(p,r)=>summary(r),note:'İp mil üzerinde kaymaz, ideal çıkrık. Yük sabit hızla kaldırılır. Dönme hareketinin ivmesi hesaplanmaz.'},
{id:'screw',tab:'Vida',title:'Vida adımı küçüldükçe ne olur?',
 sceneTitle:'Dönme hareketi → doğrusal yükselme',
 intro:'Kolu döndürdüğünde vidanın her turda ne kadar ilerlediğini ve gereken kuvveti değiştir.',
 defaults:{load:100,pitch:.01,turns:4,handleRadius:.2,eta:.8},
 controls:[base[0],c('pitch','Bir turdaki ilerleme',.005,.05,.005,'m'),c('handleRadius','Kolun yarıçapı',.1,.5,.05,'m'),c('turns','Tur sayısı',1,10,1,'tur'),base[1]],
 model:M.screw,scene:screwScene,interpret:(p,r)=>explain(r),
 formula:(p,r)=>'Bir tur: el yolu = 2πR, yük yolu = vida adımı\nF·2πR·verim = Yük·adım\nF = '+f(r.effort)+' N',
 metrics:(p,r)=>summary(r),note:'Vida ideal olarak her turda bir adım ilerler. Vida dişi geometrisi ve kendiliğinden kilitlenme modellenmez; verim kayıpları temsil eder.'},
{id:'gears',tab:'Dişli çark',title:'Dişli sayısı ve dönme yönü',
 sceneTitle:'İki dıştan dişli',
 intro:'Giriş ve çıkış diş sayılarını değiştir. Devir sayısı ve tork aktarımı ters orantılıdır.',
 defaults:{inputTeeth:20,outputTeeth:40,inputTurns:3,eta:1},
 controls:[c('inputTeeth','Giriş diş sayısı',10,60,5,'diş'),c('outputTeeth','Çıkış diş sayısı',10,60,5,'diş'),c('inputTurns','Giriş turu',1,8,1,'tur'),base[1]],
 model:M.gears,scene:gearsScene,
 interpret:(p,r)=>'Dıştan temas eden dişliler zıt yönde döner. Çıkış torku '+f(r.outputTorquePerInput)+' kat olur; çıkış devir sayısı '+f(Math.abs(r.outputTurns))+' tur. Verim azaldığında tork aktarımı düşer.',
 formula:(p,r)=>'n₂/n₁ = −z₁/z₂ = −'+f(r.speedRatio)+'\nτ₂/τ₁ = verim×z₂/z₁ = '+f(r.outputTorquePerInput),
 metrics:(p,r)=>metric(['Çıkış turu (işaretli)',f(r.outputTurns)+' tur'],['Hız oranı |n₂/n₁|',f(r.speedRatio)],['Tork oranı',f(r.outputTorquePerInput)],['Dönme yönü','Ters']),
 note:'İki dıştan dişli, kayma yok; dişlerin şekli çizimde şematiktir. Giriş/çıkış torku büyüklükleri oranı verilir, işaretli devir dönüş yönünü belirtir.'},
{id:'belts',tab:'Kasnak',title:'Açık ve çapraz kayışın yön farkı',
 sceneTitle:'Kaymadan dönen iki kasnak',
 intro:'Kasnak yarıçaplarını değiştir; açık ve çapraz kayışta dönüş yönlerini karşılaştır.',
 defaults:{driveRadius:.3,drivenRadius:.6,driveTurns:4,crossed:0,eta:1},
 controls:[c('driveRadius','Sürücü yarıçap',.2,.8,.1,'m'),c('drivenRadius','Sürülen yarıçap',.2,.8,.1,'m'),c('driveTurns','Sürücü turu',1,8,1,'tur'),c('crossed','0=açık, 1=çapraz',0,1,1,''),base[1]],
 model:p=>M.belts({...p,crossed:!!p.crossed}),scene:beltsScene,
 interpret:(p,r)=>(p.crossed?'Çapraz kayış, ters dönüş. ':'Açık kayış, aynı yön. ')+
 'Kayma yoksa kenarların çizgisel hızları eşittir. Verim kaybı tork oranını etkiler, geometrik devir oranını değil.',
 formula:(p,r)=>'n₂/n₁ = R₁/R₂ = '+f(r.speedRatio)+' (büyüklük)\nÇıkış turu = '+f(r.outputTurns)+'\nTork oranı = '+f(r.outputTorquePerInput),
 metrics:(p,r)=>metric(['Çıkış turu',f(r.outputTurns)+' tur'],['Devir oranı',f(r.speedRatio)],['Tork oranı',f(r.outputTorquePerInput)],['Dönme yönü',p.crossed?'Ters':'Aynı']),
 note:'İki kasnak arasında kaymasız ideal kayış; dönme yönü şematik olarak gösterilir. Kayışın gerginlik farkı veya ayrıntılı geometri modellenmez.'},
{id:'design',tab:'Güvenli tasarım',title:'Bir yükü kaldırmak için iki makineyi birleştir',
 sceneTitle:'Kaldıraç + hareketli makara (en fazla iki makine)',
 intro:'Günlük yaşam tasarımı: önce kaldıraç, sonra makara. Kullanılan kuvveti, toplam çekme yolunu ve verim kaybını karşılaştır. Güvenli kullanım için sınırları değerlendir.',
 defaults:{load:160,armEffort:2,armLoad:1,ropeCount:2,travel:4,eta1:.9,eta2:.85},
 controls:[base[0],c('armEffort','Kaldıraç kuvvet kolu',.5,3,.25,'m'),c('armLoad','Kaldıraç yük kolu',.5,3,.25,'m'),c('ropeCount','Makarada taşıyan ip',1,4,1,'ip'),c('travel','Elin çekme yolu',1,8,.5,'m'),c('eta1','Kaldıraç verimi',.5,1,.05,'×100%'),c('eta2','Makara verimi',.5,1,.05,'×100%')],
 model:M.design,
 scene:(p,r,U)=>U.svg('<rect x="100" y="145" width="200" height="65" rx="14" fill="#285776" stroke="#9bdeec"/>'+
  U.text(125,184,'1. Kaldıraç','#dcecf3')+U.arrow(305,180,140,0,'#78e7c8','aktarım')+
  '<rect x="470" y="145" width="210" height="65" rx="14" fill="#285776" stroke="#9bdeec"/>'+
  U.text(495,184,'2. Makara','#dcecf3')+
  U.text(75,72,'İki makine; toplam verim: %'+f(r.eta*100),'#ffe2a4')+
  U.text(75,284,'Giriş: '+f(r.workIn)+' J · Çıkış: '+f(r.workOut)+' J','#a7f0da')),
  interpret:(p,r)=>explain(r)+' Bu iki aşamalı idealize sistem için gereken kuvvet '+f(r.effort)+' N. Güvenli tasarımda taşıyıcıların, ipin ve bağlantıların gerçek yük kapasitesi ayrıca doğrulanmalıdır.',
 formula:(p,r)=>'Toplam kazanç = (kaldıraç kol oranı)×(taşıyan ip) = '+f(r.ratio)+'\nToplam verim = η₁×η₂ = '+f(r.eta)+'\nGiriş kuvveti = '+f(r.effort)+' N',
 metrics:(p,r)=>summary(r),
 note:'11.1.10.3 tasarım gözlemi. En fazla iki makine; üç veya daha fazla makinenin birleşik hesaplaması yapılmaz. Gerçek kullanım için halat, bağlantı ve devrilme güvenliği mühendislik kontrolü gerektirir; bu model güvenlik sertifikası değildir.'}
];
w.BasitMakineLab=U.create({sections,questions:[]});
})(window);
