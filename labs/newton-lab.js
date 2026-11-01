/* Newton Laws AYT 2018: 11.1.3.1 and 11.1.3.2, explanatory FBD simulations. */
(function(w,d){
'use strict';
const P=w.HareketMath;if(!P)return;
const $=id=>d.getElementById(id),H=P.escapeHtml,F=P.f,PI=Math.PI;
const tabs=[['net','Net kuvvet · F=ma'],['friction','Yatay sürtünme'],['incline','Eğik düzlem'],['wall','Düşey duvar'],['elevator','Asansör'],['third','Etki–tepki'],['quiz','YKS mini test']];
const defaults={
 net:{mass:5,F1:16,F2:-6,v0:0,time:0},
 friction:{mass:5,force:20,muStatic:.5,muKinetic:.3,g:10,time:0},
 incline:{mass:5,angle:30,force:0,muStatic:.35,muKinetic:.25,g:10,time:0},
 wall:{mass:2,push:30,muStatic:.8,muKinetic:.5,g:10,time:0},
 elevator:{mass:70,a:2,g:10,time:0},
 third:{m1:2,m2:5,F:20,time:0},
 quiz:{index:0,choice:null,checked:false,score:0,attempts:0}
};
const st={tab:'net',playing:false};
for(const id of Object.keys(defaults))st[id]=JSON.parse(JSON.stringify(defaults[id]));
const Q=[
 {q:'5 kg kütleli cisme sağa 18 N, sola 8 N kuvvet uygulanıyor. İvme kaç m/s²?',cs:['1 sağ','2 sağ','2 sol','5 sağ','0'],a:1,why:'Fnet=18−8=10 N sağ. a=10/5=2 m/s².'},
 {q:'Net kuvvet sıfır olan ve sürtünmesiz düzlemde 4 m/s hızla giden cismin hareketi?',cs:['Hızlanır','Yavaşlar','4 m/s sabit hız','Durur','Zıt yönde ivmelenir'],a:2,why:'Fnet=0 olduğunda ivme sıfırdır; sıfırdan farklı başlangıç hızı sabit kalır.'},
 {q:'Kütle 3 katına çıkarsa, net kuvvet sabitken ivme nasıl değişir?',cs:['3 kat artar','Değişmez','9 kat artar','3’te bire iner','Sıfır olur'],a:3,why:'a=Fnet/m: kütle üç katına çıkarsa ivme üçte bire iner.'},
 {q:'Durgun 10 kg blok, N=100 N, μs=0,4, μk=0,2; yatay F=30 N. Sürtünme?',cs:['0','10 N zıt','20 N zıt','30 N zıt','40 N zıt'],a:3,why:'En büyük statik sürtünme 40 N. 30<40; sürtünme uygulanan kuvveti dengeleyerek 30 N olur.'},
 {q:'Aynı 10 kg blok, μs=0,4 μk=0,2, F=50 N. Hareket başladıktan sonraki sürtünme?',cs:['0','10 N','20 N','40 N','50 N'],a:2,why:'Kinetik sürtünme μkN=0,2×100=20 N. Başlangıçtaki hareket sağa kabul edilir.'},
 {q:'5 kg cisim 37° sürtünmesiz eğik düzlemde. g=10, sin37=0,6. Eğim boyunca ağırlık bileşeni?',cs:['10 N','20 N','30 N','40 N','50 N'],a:2,why:'mg sinθ=5×10×0,6=30 N aşağı yönde.'},
 {q:'2 kg cisim sürtünmesiz 30° eğik düzlemde, g=10. İvme büyüklüğü?',cs:['0','2,5','5','8,7','10'],a:2,why:'a=g sin30°=10×0,5=5 m/s²; eğim aşağı yönündedir.'},
 {q:'60 kg kişi yukarı yönde 2 m/s² ivmelenen asansörde, g=10. Baskül kaç N gösterir?',cs:['480','600','720','120','840'],a:2,why:'N−mg=ma ⇒ N=m(g+a)=60×12=720 N.'},
 {q:'60 kg kişi aşağı yönde 3 m/s² ivmelenen asansörde, g=10. Baskül?',cs:['420 N','600 N','780 N','180 N','0'],a:0,why:'a_yukarı=−3. N=m(10−3)=420 N.'},
 {q:'A cismi B’ye 15 N itme kuvveti uygularsa, B’nin A’ya kuvveti?',cs:['0 N','7,5 N aynı yönde','15 N ters yönde','30 N ters yönde','B’nin kütlesine göre değişir'],a:2,why:'Etki–tepki kuvvetleri eşit büyüklükte ve ters yöndedir, farklı cisimlere etkir.'},
 {q:'2 kg blok duvara 50 N kuvvetle bastırılıyor; μs = 0,5, g=10. Blok duruyorsa sürtünme büyüklüğü?',cs:['0','10 N','20 N','25 N','50 N'],a:2,why:'mg=20 N, max statik=0,5×50=25 N. Gereken statik sürtünme 20 N yukarıdır.'},
 {q:'Etki ve tepki neden birbirini dengeleyip sıfırlamaz?',cs:['Büyüklükleri farklı','Aynı cisim üzerindedir','Farklı cisimlere etkir','Daima sürtünme vardır','Sadece durgunken oluşur'],a:2,why:'F_A→B, B üzerinde; F_B→A, A üzerinde etkilidir. Bir cismin net kuvvetinde toplanmazlar.'},
 {q:'5 kg blok üzerinde sağa 35 N, sola 10 N net dış kuvvet varsa ivme?',cs:['1 sağ','3 sağ','5 sağ','7 sağ','9 sol'],a:2,why:'Fnet=35−10=25 N sağ; a=25/5=5 m/s².'}
];
const marker='<defs><marker id="newton-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#64bcff"/></marker><marker id="newton-gold" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#f5c978"/></marker><marker id="newton-pink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#ff8c9f"/></marker><marker id="newton-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#50e2c2"/></marker></defs>';
function graph(content){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 510" role="img" aria-label="Serbest cisim diyagramı">'+marker+content+'</svg>';}
function label(x,y,text,color='#d6edfa',size=14){return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" fill="'+color+'" font-size="'+size+'" font-family="system-ui">'+H(text)+'</text>';}
function vector(x,y,fx,fy,color,id,name,scale=3){
 const len=Math.hypot(fx,fy);if(len<.1)return '';
 const endX=x+fx*scale,endY=y-fy*scale;
 return '<line x1="'+x.toFixed(2)+'" y1="'+y.toFixed(2)+'" x2="'+endX.toFixed(2)+'" y2="'+endY.toFixed(2)+'" stroke="'+color+'" stroke-width="3.4" marker-end="url(#newton-'+id+')"/>'
 +label(endX+8,endY-10,name,color,15);
}
function box(x,y,text,color='#64bcff'){return '<rect x="'+(x-36).toFixed(1)+'" y="'+(y-33).toFixed(1)+'" width="72" height="66" rx="10" fill="'+color+'" stroke="#d1ecf7" stroke-width="1.4"/>'
 +label(x-25,y+5,text,'#081625',16);}
function staticFloor(y){return '<rect x="0" y="'+y+'" width="860" height="'+(510-y)+'" fill="#1e3447"/><path d="M0 '+y+'H860" stroke="#b2cbda" stroke-width="3"/>';}
function control(id,text,min,max,step,val,unit=''){return '<div class="control"><div class="control-top"><label for="n-'+id+'">'+H(text)+'</label><output id="out-'+id+'">'+H(F(val,unit))+'</output></div><input id="n-'+id+'" data-range="'+id+'" data-unit="'+H(unit)+'" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"></div>';}
function btn(text,action){return '<button type="button" class="btn" data-action="'+action+'">'+H(text)+'</button>';}
function meter(rows){$('results').innerHTML=rows.map(a=>'<div class="metric"><small>'+H(a[0])+'</small><strong>'+H(a[1])+'</strong>'+(a[2]?'<em>'+H(a[2])+'</em>':'')+'</div>').join('');}
function lesson(formula,details,warning=''){$('lesson').innerHTML='<div class="formula">'+H(formula)+'</div><p>'+H(details)+'</p>'+(warning?'<aside>'+H(warning)+'</aside>':'');}
function hint(text){$('hint').textContent=text;}
function setTitle(t){
 const titles={net:'Net kuvvet ve Newton’un ikinci yasası',friction:'Yatay düzlemde statik ve kinetik sürtünme',incline:'Eğik düzlem: ağırlık bileşenleri',wall:'Düşey duvarda sürtünme',elevator:'Asansörde görünür ağırlık',third:'Etki–tepki: Newton’un üçüncü yasası',quiz:'Newton Yasaları · YKS mini test'};
 const descriptions={
 net:'Kütle, dış kuvvet ve başlangıç hızını değiştir. Net kuvvetin ivmeye etkisini gözle.',
 friction:'Cisim ilk anda durgun. Statik sürtünme sınırını aşınca kinetik sürtünme başlar.',
 incline:'Eğimin açısı ve kuvvetler değiştikçe blok durabilir veya aşağı/yukarı kayabilir.',
 wall:'Duvara basma kuvveti, normal kuvveti ve statik sürtünme sınırını belirler.',
 elevator:'Asansörün ivmesi baskülün okuduğu normal kuvveti değiştirir.',
 third:'İki cismin birbirine uyguladığı etki–tepki kuvvetleri daima eşit büyüklükte ve zıt yönlüdür.',
 quiz:'2018 MEB Newton kazanımlarına yönelik 13 özgün, beş seçenekli soru.'
 };
 $('heading').textContent=titles[t];$('intro').textContent=descriptions[t];
 $('tagline').textContent=t==='quiz'?'AYT SORU ANTRENMANI':'2018 MEB · 11.1.3';
}
function drawNet(){
 const s=st.net,net=s.F1+s.F2,a=net/s.mass,t=s.time,dx=s.v0*t+.5*a*t*t;
 const x=Math.max(82,Math.min(780,430+dx*10)),y=310;
 let g=staticFloor(343)+label(16,33,'Sürtünmesiz yatay düzlem · x pozitif sağa →');
 for(let i=0;i<18;i++)g+='<path d="M'+(40+i*45)+' 358l-16 16" stroke="#59798e" stroke-width="1"/>';
 g+=box(x,y,s.mass+' kg');
 g+=vector(x,y,s.F1,0,'#64bcff','blue','F1',4)+vector(x,y+18,s.F2,0,'#f5c978','gold','F2',4);
 g+=vector(x,y,0,24,'#50e2c2','green','N',3)+vector(x,y,0,-24,'#ff8c9f','pink','mg',3);
 g+=label(20,471,'Kinematik gösterim: x(t) = x₀ + v₀t + ½at²');
 $('scene').innerHTML=graph(g);
 meter([['Net kuvvet',F(net,'N'),net===0?'Dengedeki kuvvetler (ivme sıfır)':'Yön: '+(net>0?'sağ':'sol')],
 ['İvme',F(a,'m/s²')],['Anlık hız',F(s.v0+a*t,'m/s')],['Yer değiştirme',F(dx,'m')],['Zaman',F(t,'s')]]);
 lesson('ΣFₓ = m aₓ,  ΣFᵧ = 0','Yatayda iki uygulanan kuvvetin işaretli toplamı net kuvveti verir. Düşeyde normal kuvvet N ve ağırlık mg birbirini dengeler.',
 'Net kuvvet sıfırsa ivme sıfırdır; cisim zaten hareket ediyorsa hızını korur. Kuvvet olmadan hareket olmaz yanlıştır.');
 hint('F1 ve F2 kuvvetlerini karşılaştır. Aynı net kuvvet altında kütleyi büyüttüğünde ivmenin nasıl değiştiğini gör.');
}
function drawFriction(){
 const s=st.friction,r=P.horizontal(s),N=r.N,t=s.time,dx=r.acceleration*t*t/2;
 const x=Math.max(84,Math.min(780,430+dx*12)),y=322;
 let g=staticFloor(357)+label(16,33,'Cisim ilk anda durgun · Uygulanan kuvvet + sürtünme');
 g+=box(x,y,s.mass+' kg')+vector(x,y,s.force,0,'#64bcff','blue','F',3.7)
 +vector(x,y+24,r.friction,0,'#ff8c9f','pink','f',3.7)
 +vector(x,y,0,26,'#50e2c2','green','N',3)
 +vector(x,y,0,-26,'#f5c978','gold','mg',3);
 g+=label(20,465,'En fazla statik sürtünme = μs N; kayma varsa fkinetik = μk N.');
 $('scene').innerHTML=graph(g);
 meter([
 ['Sürtünme rejimi',r.state==='static'?'Statik (denge)':'Kinetik (kayma)'],
 ['Normal N',F(N,'N')],['Maksimum statik',F(r.maxStatic,'N')],
 ['Gerçek sürtünme kuvveti',F(r.friction,'N'),'İşaret +sağ, −sol'],
 ['Net yatay kuvvet',F(r.net,'N')],['İvme',F(r.acceleration,'m/s²')]
 ]);
 lesson('Statik: |fs| ≤ μs N; kayarken |fk| = μk N',
 'Durgun blokta gereken statik sürtünme, uygulanan kuvvete karşı koyacak kadar oluşur; her zaman μs N değerinde değildir. Eşik aşılırsa model kayma yönünü uygulanan kuvvetin yönü kabul eder.',
 'Hareket etmekte olan blokta sürtünme, uygulanan kuvvete değil bağıl kayma hızına zıttır. Bu simülasyonda başlangıç durgun olduğundan kaymanın ilk yönünü kuvvet belirler.');
 hint('Örneğin m=5 kg, g=10, μs=0,5 iken fmax=25 N. F=20 N olursa sürtünme 20 N, F=40 N olursa kinetik rejim olur.');
}
function drawIncline(){
 const s=st.incline,theta=s.angle*PI/180,r=P.incline({mass:s.mass,angleDeg:s.angle,force:s.force,g:s.g,muStatic:s.muStatic,muKinetic:s.muKinetic});
 const low=P.vec(135,440),len=500,tx=Math.cos(theta),ty=-Math.sin(theta),high=P.vec(low.x+len*tx,low.y+len*ty);
 const slide=Math.max(-200,Math.min(180,.5*r.acceleration*s.time*s.time*9));
 const ratio=Math.max(.1,Math.min(.85,.53+slide/len));
 const center=P.vec(low.x+len*tx*ratio,low.y+len*ty*ratio);
 const forceScale=Math.min(2.4,125/Math.max(1,s.mass*s.g,r.N,Math.abs(s.force),Math.abs(r.friction)));
 let g='<path d="M'+low.x+' '+low.y+'L'+high.x.toFixed(1)+' '+high.y.toFixed(1)+'L'+high.x.toFixed(1)+' 475L'+low.x+' 475Z" fill="#30465b" stroke="#a3c6d7" stroke-width="2"/>';
 g+='<g transform="rotate('+-s.angle+' '+center.x.toFixed(1)+' '+center.y.toFixed(1)+')">'+box(center.x,center.y-35,s.mass+' kg')+'</g>';
 const ox=center.x,oy=center.y-35;
 g+=vector(ox,oy,s.force*tx,s.force*Math.sin(theta),'#64bcff','blue','F',forceScale);
 g+=vector(ox,oy,r.friction*tx,r.friction*Math.sin(theta),'#ff8c9f','pink','f',forceScale);
 g+=vector(ox,oy,0,-s.mass*s.g,'#f5c978','gold','mg',forceScale);
 g+=vector(ox,oy,r.N*(-Math.sin(theta)),r.N*Math.cos(theta),'#50e2c2','green','N',forceScale);
 g+=label(18,34,'Pozitif eksen: eğim yukarı · mg sinθ eğim aşağı.');
 g+=label(18,485,'mg·sinθ eğim aşağı, mg·cosθ düzleme dik');
 $('scene').innerHTML=graph(g);
 meter([
 ['Eğim açısı',F(s.angle,'°')],['mg sinθ (aşağı)',F(r.down,'N')],
 ['mg cosθ = N',F(r.N,'N')],['Statik sınır',F(r.maxStatic,'N')],
 ['Sürtünme (işaretli)',F(r.friction,'N')],['Net eğim kuvveti',F(r.net,'N')],
 ['İvme (+yukarı)',F(r.acceleration,'m/s²')],['Zaman',F(s.time,'s')]
 ]);
 lesson('ΣF∥ = Fuygulanan − mg sinθ + fsürtünme = ma',
 'Düzlemin dik bileşenindeki kuvvetler dengedeyse normal N=mg cosθ. Eğim boyunca ağırlık bileşeni mg sinθ daima aşağı yönlüdür.',
 'Statik sürtünme, kendiliğinden aşağı yönlü olmak zorunda değildir: blok yukarı doğru kayma eğilimindeyse sürtünme aşağı, aşağı kayma eğilimindeyse yukarı yönlüdür.');
 hint('Eğimi arttır; mg sinθ büyürken N=mg cosθ azalır. Durgun kalma sınırı nasıl değişiyor gör.');
}
function drawWall(){
 const s=st.wall,r=P.wall({mass:s.mass,push:s.push,muStatic:s.muStatic,muKinetic:s.muKinetic,g:s.g});
 const displacement=Math.min(125,Math.max(-60,-.5*r.acceleration*s.time*s.time*3));
 const x=450,y=225+displacement,scale=Math.min(3,125/Math.max(1,r.N,r.weight,Math.abs(r.friction)));
 let g='<rect x="500" y="40" width="82" height="410" rx="7" fill="#3c5160" stroke="#acc4d3" stroke-width="2"/>';
 for(let i=0;i<9;i++)g+='<line x1="505" y1="'+(55+i*45)+'" x2="565" y2="'+(85+i*45)+'" stroke="#6c8496"/>';
 g+=box(x,y,s.mass+' kg');
 g+=vector(x,y,s.push,0,'#64bcff','blue','F basma',scale);
 g+=vector(x,y,-r.N,0,'#f5c978','gold','N',scale);
 g+=vector(x,y,0,r.friction,'#50e2c2','green','f',scale);
 g+=vector(x,y,0,-r.weight,'#ff8c9f','pink','mg',scale);
 g+=label(18,31,'Düşey duvar: +y yukarı, +x sağ → cisim başlangıçta durgun');
 g+=label(18,488,'ΣFₓ = Fbasma − N = 0; ΣFᵧ = f − mg = m·a');
 $('scene').innerHTML=graph(g);
 meter([['Duvara basma kuvveti',F(s.push,'N')],['Normal N',F(r.N,'N')],
 ['Ağırlık mg',F(r.weight,'N')],['Maksimum statik sürtünme',F(r.maxStatic,'N')],
 ['Gerçek sürtünme (+yukarı)',F(r.friction,'N')],['Rejim',r.state==='static'?'Denge':'Aşağı kayıyor'],
 ['Düşey ivme',F(r.acceleration,'m/s²')],['Zaman',F(s.time,'s')]]);
 lesson('ΣFᵧ = f − mg = m·a; N = Fbasma',
 'Duvara bastırılan ve ilk anda durgun blokta sürtünme düşmeye karşı koyar. Gereken statik sürtünme mg; ama ancak mg ≤ μs N ise statik denge sağlanır. Bu sınır aşılırsa kayma başlar, kinetik sürtünme μkN yukarı yönlüdür.',
 'Burada normal kuvvet yataydır ve uygulanan basma kuvvetiyle dengededir. Düşey düzlemde hareketin olup olmadığını düşey sürtünme ve ağırlık belirler.');
 hint('Örneğin m=2 kg, g=10, μs=0,8: Fbasma=30 N iken max sürtünme 24 N ve blok durur. Basma kuvvetini azaltırsan blok aşağı kayar.');
}
function drawElevator(){
 const s=st.elevator,r=P.elevator({mass:s.mass,acceleration:s.a,g:s.g});
 const shift=Math.max(-78,Math.min(78,-.5*s.a*s.time*s.time*2));
 const personY=295+shift,platformY=337+shift,forceScale=Math.min(.15,110/Math.max(1,r.normal,r.weight));
 let g='<rect x="215" y="60" width="430" height="386" rx="16" fill="#102b40" stroke="#6f9aaf" stroke-width="4"/>'
  +'<path d="M430 60 V446" stroke="#436f86" stroke-width="2"/><rect x="280" y="'+platformY.toFixed(1)+'" width="300" height="35" rx="10" fill="#4b6e80"/>';
 g+=box(430,personY,s.mass+' kg');
 g+=vector(430,personY,0,r.normal,'#50e2c2','green','N',forceScale);
 g+=vector(430,personY,0,-r.weight,'#ff8c9f','pink','mg',forceScale);
 g+=vector(680,260,0,s.a*20,'#f5c978','gold','a',3);
 g+=label(20,32,'Asansör ivmesi yukarı +a, aşağı −a');
 g+=label(20,483,'Baskülün gösterdiği değer: Normal kuvvet N (birimi N).');
 $('scene').innerHTML=graph(g);
 meter([['Ağırlık mg',F(r.weight,'N')],['Baskül N',F(r.normal,'N')],['Net kuvvet (yukarı +)',F(r.net,'N')],['Asansör ivmesi',F(s.a,'m/s²')],['Zaman',F(s.time,'s')]]);
 lesson('N − mg = m a ⇒ N = m(g+a)',
 'Yukarı yönde ivmelenen asansörde N>mg olur. Aşağı yönde ivmelenirse N<mg olur. Sabit hızla hareket ederse a=0 ve N=mg.',
 'Baskül kütleyi değil normal kuvveti ölçer; kütle değişmez. Serbest düşüşte ideal N=0 olur.');
 hint('İvmeyi pozitif, sıfır ve negatif yap. Asansörün yukarı hareket etmesi ile yukarı ivmelenmesi aynı şey değildir.');
}
function drawThird(){
 const s=st.third,F0=s.F,m1=s.m1,m2=s.m2,t=s.time;
 // Two blocks interact, starting at rest, on a frictionless horizontal plane.
 // Equal-and-opposite internal forces act on DIFFERENT bodies, so accelerations differ.
 const xA=270-Math.min(140,.5*(F0/m1)*t*t*1.4);
 const xB=590+Math.min(140,.5*(F0/m2)*t*t*1.4);
 let g=staticFloor(361)+box(xA,315,'A','#64bcff')+box(xB,315,'B','#f5c978');
 const factor=Math.min(3.2,125/Math.max(1,F0));
 g+=vector(xB+22,295,F0,0,'#50e2c2','green','F(A→B)',factor);
 g+=vector(xA-22,335,-F0,0,'#ff8c9f','pink','F(B→A)',factor);
 g+=label(18,32,'Etki–tepki: eşit kuvvet, farklı kütle → farklı ivme.');
 $('scene').innerHTML=graph(g);
 meter([['A’nın B’ye kuvveti',F(F0,'N'),'B üzerinde, sağa'],['B’nin A’ya kuvveti',F(F0,'N'),'A üzerinde, sola'],
 ['A kütlesi',F(m1,'kg')],['B kütlesi',F(m2,'kg')],
 ['A ivmesi (yalnız yatay etkileşim)',F(-F0/m1,'m/s²')],
 ['B ivmesi (yalnız yatay etkileşim)',F(F0/m2,'m/s²')],['Zaman',F(t,'s')]]);
 lesson('F⃗(A→B) = −F⃗(B→A)','Etki ve tepki eşit büyüklükte, aynı doğrultuda ve ters yönde olup farklı cisimleri etkiler. İki cismin kütleleri farklıysa, aynı kuvvete karşı farklı ivmeler oluşabilir.','Şemada yatay doğrultuda yalnız çiftin kuvvetleri, dik doğrultuda N ve mg dengesi varsayılır. Etki–tepki farklı cisimlerde olduğu için birbirini bir cismin Fnet hesabında sıfırlamaz.');
 hint('Kütleleri ve kuvveti değiştir; oynatınca blokların farklı ivmeyle birbirinden uzaklaştığını gör. Eşit kuvvet, eşit ivme demek değildir.');
}
function paintQuiz(){
 const q=Q[st.quiz.index%Q.length],s=st.quiz;
 $('scene').innerHTML=graph('<rect x="66" y="61" width="728" height="390" rx="22" fill="#102c40" stroke="#587688"/>'
  +label(88,126,'AYT FİZİK · NEWTON YASALARI', '#50e2c2',20)
  +label(88,201,'Önce serbest cisim diyagramını çiz.','#e6f5ff',21)
  +label(88,269,'Yön işaretlerini belirle; kuvvetleri topla.', '#d6ebf8',18)
  +label(88,333,'Fnet = ma, sürtünme yönü ve N hesabını yap.', '#d6ebf8',18));
 meter([['Soru',String(s.index+1)+' / '+Q.length],['Doğru',String(s.score)],['Çözülen',String(s.attempts)]]);
 $('quiz').innerHTML='<div class="quiz-prompt">'+H(q.q)+'</div>'+q.cs.map((x,i)=>'<button type="button" class="answer '+(s.checked?(i===q.a?'correct':i===s.choice?'wrong':''):'')+'" data-answer="'+i+'" '+(s.checked?'disabled':'')+'><span>'+('ABCDE'[i])+'</span>'+H(x)+'</button>').join('')
 +(s.checked?'<div class="feedback '+(s.choice===q.a?'success':'error')+'">'+H(q.why)+'</div>':'<div class="feedback info">Bir şıkkı seç; cevabı kontrol ettiğinde nedenini de göreceksin.</div>');
 $('lesson').innerHTML='<p><strong>11.1.3.1/2:</strong> Net kuvvet, serbest cisim diyagramı ve sürtünmeli/sürtünmesiz günlük yaşam soruları.</p><aside>Özgün alıştırmalar; resmî ÖSYM sorusu değildir.</aside>';
 hint('13 temel soru. Formül seçmekten önce kuvvetlerin hangi cisme uygulandığını belirle.');
}
function paint(){
 $('quiz').innerHTML='';
 if(st.tab==='net')drawNet();
 else if(st.tab==='friction')drawFriction();
 else if(st.tab==='incline')drawIncline();
 else if(st.tab==='wall')drawWall();
 else if(st.tab==='elevator')drawElevator();
 else if(st.tab==='third')drawThird();
 else paintQuiz();
 actions();
}
function makeControls(){
 const s=st[st.tab],t=st.tab;let html='';
 if(t==='net')html=control('mass','Kütle',1,20,1,s.mass,'kg')+control('F1','F1 (sağ +)',-50,50,1,s.F1,'N')
  +control('F2','F2 (sağ +)',-50,50,1,s.F2,'N')+control('v0','İlk hız',-10,10,.5,s.v0,'m/s');
 else if(t==='friction')html=control('mass','Kütle',1,20,1,s.mass,'kg')+control('force','Yatay kuvvet',-100,100,1,s.force,'N')
  +control('muStatic','Statik sürtünme katsayısı',0,1,.05,s.muStatic,'')
  +control('muKinetic','Kinetik sürtünme katsayısı',0,1,.05,s.muKinetic,'')
  +control('g','g',8,10,1,s.g,'m/s²');
 else if(t==='incline')html=control('mass','Kütle',1,20,1,s.mass,'kg')+control('angle','Eğim açısı',0,60,1,s.angle,'°')
  +control('force','Eğime paralel kuvvet (+yukarı)',-100,100,1,s.force,'N')
  +control('muStatic','Statik sürtünme',0,1,.05,s.muStatic,'')
  +control('muKinetic','Kinetik sürtünme',0,1,.05,s.muKinetic,'')
  +control('g','g',8,10,1,s.g,'m/s²');
 else if(t==='wall')html=control('mass','Kütle',1,20,1,s.mass,'kg')+control('push','Duvara yatay basma kuvveti',0,100,1,s.push,'N')
  +control('muStatic','Statik sürtünme',0,1,.05,s.muStatic,'')
  +control('muKinetic','Kinetik sürtünme',0,1,.05,s.muKinetic,'')
  +control('g','g',8,10,1,s.g,'m/s²');
 else if(t==='elevator')html=control('mass','Kütle',20,120,5,s.mass,'kg')+control('a','Yukarı (+) ivme',-8,8,.5,s.a,'m/s²')+control('g','g',8,10,1,s.g,'m/s²');
 else if(t==='third')html=control('m1','A kütlesi',1,20,1,s.m1,'kg')+control('m2','B kütlesi',1,20,1,s.m2,'kg')
  +control('F','Etkileşim kuvveti',1,80,1,s.F,'N');
 else html='<div class="hint">Her soruda kuvvet diyagramı ve yön işaretlerini kullan.</div>';
 $('controls').innerHTML=html;
}
function actions(){
 let h='';
 if(st.tab==='quiz')h='<button class="btn primary" type="button" data-action="check" '+(st.quiz.choice===null||st.quiz.checked?'disabled':'')+'>Cevabı kontrol et</button>'
  +btn('Sonraki →','next')+btn('Testi sıfırla','reset');
 else h=btn(st.playing?'Ⅱ Duraklat':'▶ Oynat','play')+btn('↺ Sıfırla','reset');
 $('buttons').innerHTML=h;
}
function switchTab(t){
 if(!tabs.some(x=>x[0]===t))return;
 st.tab=t;st.playing=false;
 d.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===t;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 setTitle(t);makeControls();paint();
}
function onChange(k,val){
 const s=st[st.tab];if(!s||!(k in s)||k==='time')return;
 st.playing=false;
 s[k]=Number(val);
 // Typical school model: kinetic coefficient cannot exceed static coefficient.
 if(['friction','incline','wall'].includes(st.tab)&&s.muKinetic>s.muStatic){
  const other=k==='muStatic'?'muKinetic':'muStatic';
  s[other]=s[k];
  const inp=$('n-'+other),out=$('out-'+other);
  if(inp)inp.value=s[other];if(out)out.textContent=F(s[other]);
 }
 if('time' in s)s.time=0;
 paint();
}
function act(a){
 const s=st[st.tab];
 if(a==='play'){st.playing=!st.playing;last=0;actions();if(st.playing)schedule();}
 if(a==='reset'){st.playing=false;st[st.tab]=JSON.parse(JSON.stringify(defaults[st.tab]));makeControls();paint();}
 if(a==='check'&&st.tab==='quiz'&&s.choice!==null&&!s.checked){s.checked=true;s.attempts++;if(s.choice===Q[s.index%Q.length].a)s.score++;paint();}
 if(a==='next'&&st.tab==='quiz'){s.index=(s.index+1)%Q.length;s.choice=null;s.checked=false;paint();}
}
let last=0,frameHandle=null;
function schedule(){if(st.playing&&frameHandle===null)frameHandle=w.requestAnimationFrame(frame);}
function frame(now){
 frameHandle=null;
 if(st.playing){
  const dt=Math.min(.05,last?(now-last)/1000:0);
  const s=st[st.tab];
  if(s&&typeof s.time==='number'){s.time=Math.min(12,s.time+dt);if(s.time>=12)st.playing=false;}
  paint();
 }
 last=now;if(st.playing)schedule();
}
function init(){
 if(!$('tabs')||!$('scene'))return;
 $('tabs').innerHTML=tabs.map(([k,name])=>'<button type="button" data-tab="'+k+'" aria-pressed="false">'+H(name)+'</button>').join('');
 $('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)switchTab(b.dataset.tab);});
 $('controls').addEventListener('input',e=>{const b=e.target.closest('input[data-range]');if(!b)return;
  const out=$('out-'+b.dataset.range);if(out)out.textContent=F(Number(b.value),b.dataset.unit);
  onChange(b.dataset.range,b.value);
 });
 $('buttons').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)act(b.dataset.action);});
 $('quiz').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b&&st.tab==='quiz'&&!st.quiz.checked){st.quiz.choice=Number(b.dataset.answer);paint();}});
 d.addEventListener('visibilitychange',()=>{if(d.hidden){st.playing=false;last=0;actions();}});
 switchTab('net');
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
w.NewtonLabDebug=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({tab:st.tab,net:st.net,friction:st.friction,incline:st.incline,elevator:st.elevator,third:st.third,quiz:st.quiz}))});
})(window,document);