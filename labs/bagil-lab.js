/* AYT 2018: Vectors + relative frames + rendezvous + river + wind. */
(function(w,d){
'use strict';
const P=w.HareketMath;if(!P)return;
const $=id=>d.getElementById(id),H=P.escapeHtml,F=P.f,PI=Math.PI;
const tabs=[['vectors','Vektörler'],['observer','Gözlemci (2B)'],['meet','Karşılaşma / Yetişme'],['river','Nehir ve akıntı'],['wind','Rüzgârlı uçak'],['quiz','AYT mini test']];
const defaults={
 vectors:{items:[{id:'K',x:3,y:4,k:1,color:'#64bcff'},{id:'L',x:-2,y:3,k:1,color:'#f5c978'},{id:'M',x:2,y:-1,k:1,color:'#b5a3ff'}],parallel:false,snap:true},
 observer:{a:{x:-6,y:2,vx:3,vy:0},b:{x:6,y:-3,vx:0,vy:4},ref:'Yer',time:0},
 meet:{xA:0,xB:80,vA:6,vB:-4,time:0},
 river:{speed:8,heading:90,current:3,width:120,approx:true,time:0},
 wind:{speed:300,heading:90,windX:45,windY:0,distance:600,approx:true,time:0},
 quiz:{index:0,choice:null,checked:false,score:0,attempts:0}
};
const st={tab:'vectors',playing:false,drag:null,changed:false};
for(const k of Object.keys(defaults))st[k]=JSON.parse(JSON.stringify(defaults[k]));
const Q=[
 {q:'K doğuya 7 m/s, L doğuya 3 m/s gidiyor. K’nın L’ye göre hızı?',choices:['Doğu 4 m/s','Batı 4 m/s','Doğu 10 m/s','Batı 10 m/s','0'],a:0,why:'v(K/L) = +7 − (+3) = +4 m/s.'},
 {q:'K doğuya 5 m/s, L batıya 3 m/s. K’nın L’ye göre hızı?',choices:['Batı 2 m/s','Doğu 2 m/s','Doğu 8 m/s','Batı 8 m/s','0'],a:2,why:'v(K/L) = +5 − (−3) = +8 m/s.'},
 {q:'K kuzeye 3 m/s, L doğuya 4 m/s. K’nın L’ye göre hız büyüklüğü?',choices:['1','5','7','12','25'],a:1,why:'(0,3) − (4,0) = (−4,3). |v| = 5 m/s.'},
 {q:'Kayığın suya göre dik hızı 5 m/s, nehir genişliği 40 m. Akıntı 3 m/s. Geçiş süresi?',choices:['5 s','8 s','10 s','13,3 s','20 s'],a:1,why:'Akıntı yalnız yataydır; t = 40/5 = 8 s.'},
 {q:'Önceki 5 m/s kayık, 3 m/s akıntı ve 40 m genişlikte sürüklenme?',choices:['8 m','15 m','24 m','40 m','64 m'],a:2,why:'t = 8 s; akıntı yönündeki sapma = 3 × 8 = 24 m.'},
 {q:'Suya göre sürati 5 m/s, akıntı 3 m/s olan kayık tam karşıya gitsin. Dik hız bileşeni?',choices:['2','3','4','5','8'],a:2,why:'Yatay kayık bileşeni −3; dik bileşen √(25 − 9) = 4 m/s.'},
 {q:'Kayık 5 m/s, akıntı 6 m/s. Tam karşı kıyı noktasına çıkar mı?',choices:['Her zaman','45° yönelirse','Nehir dar ise','Hayır','Süre uzarsa'],a:3,why:'Gerekli ters yatay hız 6 m/s; kayığın toplam sürati 5 m/s.'},
 {q:'Aynı yöne 12 ve 8 m/s giden araçlarda hızlı olan 40 m geride. Yetişme süresi?',choices:['2 s','4 s','5 s','10 s','20 s'],a:3,why:'Bağıl hız 12−8=4 m/s; t=40/4=10 s.'},
 {q:'Birbirine 6 ve 4 m/s ile yaklaşan araçlar 100 m uzakta. Karşılaşma zamanı?',choices:['5 s','8 s','10 s','12 s','20 s'],a:2,why:'Yaklaşma hızı 10 m/s; 100/10=10 s.'},
 {q:'Havaya göre kuzeye 200 km/h, rüzgâr batıya 50 km/h. Yere göre sürat?',choices:['150','200','206,2','250','300'],a:2,why:'√(200²+50²)=206,2 km/h.'},
 {q:'Kuzeye 300 km/h uçak, doğuya 40 km/h rüzgâr. Kuzeyde 600 km ilerleyince sapma?',choices:['0 km','40 km','60 km','80 km','120 km'],a:3,why:'Uçuş süresi 600/300 = 2 saat, sürüklenme 40×2=80 km.'},
 {q:'K gözlemcisine göre K’nın kendi hızı kaçtır?',choices:['vK','−vK','vL−vK','0','vK+vL'],a:3,why:'v(K/K) = vK − vK = 0.'},
 {q:'A’nın B’ye göre hızı (3,4). B’nin A’ya göre hızı?',choices:['(3,4)','(−3,−4)','(4,3)','(−4,3)','(0,0)'],a:1,why:'Bağıl hızların yönleri ters ve büyüklükleri aynıdır.'}
];
const label=(x,y,s,size=13,color='#bbd4e2')=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+size+'" font-family="system-ui">'+H(s)+'</text>';
function markers(){return '<defs>'+[['blue','#64bcff'],['gold','#f5c978'],['green','#50e2c2'],['pink','#ff8c9f'],['purple','#b5a3ff']].map(([id,color])=>'<marker id="ah-'+id+'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10Z" fill="'+color+'"/></marker>').join('')+'</defs>';}
function graph(body,grid=true){let base='';if(grid){for(let i=0;i<=860;i+=43)base+='<path d="M'+i+' 0V510" stroke="#18344a" stroke-width=".75"/>';for(let j=0;j<=510;j+=43)base+='<path d="M0 '+j+'H860" stroke="#18344a" stroke-width=".75"/>';base+='<path d="M0 255H860 M430 0V510" stroke="#58778c" stroke-width="1.5"/>';}return '<svg viewBox="0 0 860 510" role="img" aria-label="Fizik hareket çizimi" xmlns="http://www.w3.org/2000/svg">'+markers()+base+body+'</svg>';}
function arrow(x,y,vx,vy,color,id,title,dash){
 const xx=x+vx,yy=y-vy;if(Math.hypot(vx,vy)<1)return '';
 return '<path d="M'+x.toFixed(2)+' '+y.toFixed(2)+'L'+xx.toFixed(2)+' '+yy.toFixed(2)+'" stroke="'+color+'" stroke-width="3" fill="none" '+(dash?'stroke-dasharray="8 5" ':'')+'marker-end="url(#ah-'+id+')"/>'
 +(title?label(xx+8,yy-9,title,15,'#e6f7ff'):'');
}
function dot(x,y,s,color){return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="15" fill="'+color+'" stroke="#d5f5ff" stroke-width="1.5"/>'
 +'<text x="'+x.toFixed(1)+'" y="'+(y+5).toFixed(1)+'" text-anchor="middle" font-size="15" font-weight="800" fill="#0c2334">'+H(s)+'</text>';}
function meter(items){$('results').innerHTML=items.map(a=>'<div class="metric"><small>'+H(a[0])+'</small><strong>'+H(a[1])+'</strong>'+(a[2]?'<em>'+H(a[2])+'</em>':'')+'</div>').join('');}
function note(formula,body,warning){
 $('lesson').innerHTML='<div class="formula">'+H(formula)+'</div><p>'+H(body)+'</p>'+(warning?'<aside>'+H(warning)+'</aside>':'');
}
function tip(s){$('hint').textContent=s;}
function control(id,name,low,high,step,val,unit=''){
 return '<div class="control"><div class="control-top"><label for="r-'+H(id)+'">'+H(name)+'</label><output id="out-'+H(id)+'">'+H(F(val,unit))+'</output></div>'
 +'<input id="r-'+H(id)+'" type="range" min="'+low+'" max="'+high+'" step="'+step+'" value="'+val+'" data-range="'+H(id)+'" data-unit="'+H(unit)+'"></div>';
}
function select(id,title,options,selected){
 return '<div class="control"><label for="s-'+id+'">'+H(title)+'</label><select id="s-'+id+'" data-select="'+id+'">'
 +options.map(a=>'<option value="'+H(a[0])+'"'+(a[0]===selected?' selected':'')+'>'+H(a[1])+'</option>').join('')+'</select></div>';
}
function btn(name,action,pressed=false){return '<button type="button" class="btn" data-action="'+action+'" aria-pressed="'+pressed+'">'+H(name)+'</button>';}
function paintVector(){
 const s=st.vectors,scale=37;let body=label(15,31,'+x doğu/sağ, +y kuzey/yukarı',13);
 let sum=P.vec(0,0),chain=P.vec(0,0);
 for(const v of s.items){
  const u=P.vec(v.x*v.k,v.y*v.k);
  const color=v.id==='K'?'blue':v.id==='L'?'gold':'purple';
  body+=arrow(430,255,u.x*scale,u.y*scale,v.color,color,v.id);
  body+=arrow(430+chain.x*scale,255-chain.y*scale,u.x*scale,u.y*scale,v.color,color,v.id+'′',true);
  body+='<circle data-drag-vector="'+v.id+'" class="hit" cx="'+(430+u.x*scale).toFixed(1)+'" cy="'+(255-u.y*scale).toFixed(1)+'" r="23" fill="transparent" stroke="'+v.color+'" stroke-width="1.4" stroke-dasharray="4 6"/>';
  chain=P.add(chain,u);sum=P.add(sum,u);
 }
 body+=arrow(430,255,sum.x*scale,sum.y*scale,'#50e2c2','green','Bileşke',false);
 if(s.parallel){const a=s.items[0],b=s.items[1],aa=P.vec(a.x*a.k,a.y*a.k),bb=P.vec(b.x*b.k,b.y*b.k);
  body+=arrow(430+aa.x*scale,255-aa.y*scale,bb.x*scale,bb.y*scale,b.color,'gold','L′',true);
  body+=arrow(430+bb.x*scale,255-bb.y*scale,aa.x*scale,aa.y*scale,a.color,'blue','K′',true);}
 $('scene').innerHTML=graph(body);
 const a=s.items[0],b=s.items[1],va=P.vec(a.x*a.k,a.y*a.k),vb=P.vec(b.x*b.k,b.y*b.k);
 meter([['Toplam Rₓ',F(sum.x,'br')],['Toplam Rᵧ',F(sum.y,'br')],['Bileşke |R|',F(P.mag(sum),'br')],['Yön (+x ile)',F((P.angle(sum)+360)%360,'°')],['K·L nokta çarpımı',F(P.dot(va,vb),'br²')]]);
 note('Rₓ = Σvₓ, Rᵧ = Σvᵧ, |R| = √(Rₓ² + Rᵧ²)','Uç uca ve paralelkenar yöntemi eşdeğerdir. Kosinüs teoremi iki vektörün arasındaki açıya uygulanır.','MEB 2018: i, j, k ile birim vektör cebirine girilmez. 0° için 2A, 180° için 0, 120° için A özel durumlarına dikkat.');
 tip('Üç vektörün ok ucunu sürükle; toplam yeşil ok değişir. Negatif katsayı yönü ters çevirir.');
}
function paintObserver(){
 const s=st.observer,t=s.time,pa=P.vec(s.a.x+s.a.vx*t,s.a.y+s.a.vy*t),pb=P.vec(s.b.x+s.b.vx*t,s.b.y+s.b.vy*t);
 const ref=s.ref==='Yer'?P.vec(0,0):s.ref==='A'?P.vec(s.a.vx,s.a.vy):P.vec(s.b.vx,s.b.vy);
 const posRef=s.ref==='Yer'?P.vec(0,0):s.ref==='A'?pa:pb;
 let body=label(14,31,'Gözlemci: '+s.ref+' • tüm oklar bu gözlemciye göredir.');
 for(const k of ['A','B']){
  const m=s[k.toLowerCase()],pos=k==='A'?pa:pb,dpos=P.sub(pos,posRef),vel=P.relative(P.vec(m.vx,m.vy),ref);
  const x=430+dpos.x*20,y=255-dpos.y*20,color=k==='A'?'#64bcff':'#f5c978',mi=k==='A'?'blue':'gold';
  body+=dot(x,y,k,color)+arrow(x,y,vel.x*20,vel.y*20,color,mi,'v('+k+'/'+s.ref+')');
  body+='<circle class="hit" data-drag-car="'+k+'" cx="'+(x+vel.x*20).toFixed(1)+'" cy="'+(y-vel.y*20).toFixed(1)+'" r="21" fill="transparent" stroke="'+color+'" stroke-width="1.5" stroke-dasharray="3 5"/>';
 }
 body+=label(20,486,'Gözlemci '+s.ref+' kendine göre sıfır hız görür; okların çizimi gerçekten bağıl hıza göre yapılır.');
 $('scene').innerHTML=graph(body);
 const vAB=P.sub(P.vec(s.a.vx,s.a.vy),P.vec(s.b.vx,s.b.vy));
 meter([['v(A/B)', '('+F(vAB.x)+', '+F(vAB.y)+') m/s'],['v(B/A)','('+F(-vAB.x)+', '+F(-vAB.y)+') m/s'],['Bağıl sürat',F(P.mag(vAB),'m/s')],['Seçili gözlemci',s.ref],['Geçen süre',F(t,'s')]]);
 note('v⃗(A/B) = v⃗A − v⃗B','İzlenenin hızından gözlemcinin hızını çıkar. Referans değişince oklar ve göreli konumlar birlikte değişir.','Gözlemcinin hızı sıfır değilse bile kendisine göre hızı sıfırdır. Sadece kamerayı takip ettirmek yeterli değildir.');
 tip('Gözlemciyi Yer/A/B yap. Hız vektörü ucunu sürükleyebilir veya hız bileşenlerini ayarlayabilirsin.');
}
function paintMeet(){
 const s=st.meet,r=P.rendezvous(s),t=s.time,xa=s.xA+s.vA*t,xb=s.xB+s.vB*t;
 const nums=[s.xA,s.xB,xa,xb];if(r.time!==null)nums.push(r.position);
 const min=Math.min(...nums,0)-10,max=Math.max(...nums,80)+10,sc=740/Math.max(40,max-min),xp=v=>65+(v-min)*sc;
 let body='<rect x="23" y="220" width="814" height="82" rx="12" fill="#16314a" stroke="#52728b" stroke-width="2"/>';
 for(let i=0;i<17;i++)body+='<path d="M'+(50+i*45)+' 261h20" stroke="#829eaf" stroke-width="2"/>';
 body+=dot(xp(xa),246,'A','#64bcff')+dot(xp(xb),286,'B','#f5c978');
 body+=arrow(xp(xa),196,s.vA*12,0,'#64bcff','blue','vA');
 body+=arrow(xp(xb),328,s.vB*12,0,'#f5c978','gold','vB');
 body+=label(23,31,'Sabit hızlı hareket: x(t) = x₀ + v·t');
 body+=label(25,459,r.time===null?'Bu başlangıç ve hızlarla gelecekte buluşma yok.':'Buluşma: t = '+F(r.time,'s')+', x = '+F(r.position,'m'));
 $('scene').innerHTML=graph(body,false);
 meter([['İlk aralık',F(Math.abs(r.gap),'m')],['vA − vB',F(r.relative,'m/s')],['Buluşma süresi',r.time===null?'Gelecekte yok':F(r.time,'s')],['Şu an aralık',F(Math.abs(xb-xa),'m')],['Geçen süre',F(t,'s')]]);
 note('xA₀ + vA·t = xB₀ + vB·t','Önce yönlere +/− işaretlerini koy; sonra iki konumu eşitle. Karşılıklı yaklaşma ve aynı yönde yetişme aynı denklemin farklı durumlarıdır.','Körlemesine süratleri toplama/çıkarma. Hesaplanan zaman negatifse gelecekte karşılaşma gerçekleşmez.');
 tip('Ön ayarlardan karşılaşma, yetişme ve hiç buluşmama seç; ardından hızları ve başlangıç aralığını değiştir.');
}
function paintMedium(plane){
 const s=plane?st.wind:st.river;
 const r=plane?P.wind({speed:s.speed,angleDeg:s.heading,windX:s.windX,windY:s.windY,northDistance:s.distance,approx:s.approx}):P.river({speed:s.speed,angleDeg:s.heading,current:s.current,width:s.width,approx:s.approx});
 const object=plane?r.air:r.water,environment=plane?r.wind:r.stream,ground=r.ground,dist=plane?s.distance:s.width;
 const t=r.time===null?0:Math.min(s.time,r.time),left=430,low=440,high=73,sy=(low-high)/dist,dx=r.exit??0,sx=Math.min(2.8,280/Math.max(1,Math.abs(dx)));
 const px=left+ground.x*t*sx,py=low-ground.y*t*sy;
 let body='<rect width="860" height="510" fill="'+(plane?'#0b1e35':'#071a2a')+'"/>';
 if(!plane){body+='<rect x="0" y="'+high+'" width="860" height="'+(low-high)+'" fill="#123a53"/>';for(let i=0;i<5;i++)body+='<path d="M0 '+(120+i*60)+'H860" stroke="#4a89a5" stroke-width="1" stroke-dasharray="16 15" opacity=".4"/>';}
 body+='<path d="M0 '+low+'H860 M0 '+high+'H860" stroke="#9ac1d1" stroke-width="3"/>';
 if(r.time!==null)body+='<path d="M'+left+' '+low+'L'+(left+dx*sx)+' '+high+'" stroke="#50e2c2" fill="none" stroke-width="3" stroke-dasharray="7 6"/>';
 body+=dot(px,py,plane?'✈':'⛵','#f5c978');
 const scale=Math.min(2.7,120/Math.max(1,P.mag(object),P.mag(environment),P.mag(ground))),ox=120,oy=404;
 body+=arrow(ox,oy,object.x*scale,object.y*scale,'#64bcff','blue',plane?'v hava':'v su');
 body+=arrow(ox,oy,environment.x*scale,environment.y*scale,'#f5c978','gold',plane?'rüzgâr':'akıntı');
 body+=arrow(ox,oy,ground.x*scale,ground.y*scale,'#50e2c2','green','v yer');
 body+=label(20,32,plane?'UÇAK: hava + rüzgâr = yer':'KAYIK: su + akıntı = yer');
 body+=label(21,493,'+x doğu →  +y karşı kıyı / kuzey ↑ ; açı +x ekseninden ölçülür.');
 $('scene').innerHTML=graph(body,false);
 const unit=plane?'km/h':'m/s',dunit=plane?'km':'m',tunit=plane?'saat':'s';
 const m=[
 ['Ortamına göre hız','('+F(object.x)+', '+F(object.y)+') '+unit],
 ['Akıntı / rüzgâr','('+F(environment.x)+', '+F(environment.y)+') '+unit],
 ['Yere göre hız','('+F(ground.x)+', '+F(ground.y)+') '+unit],
 ['Yere göre sürat',F(P.mag(ground),unit)],
 ['Geçiş / ulaşma süresi',r.time===null?'Bu rotada hedefe ulaşılamaz':F(r.time,tunit)],
 ['Yatay sapma',r.time===null?'—':F(r.exit,dunit)]
 ];
 if(plane){
  const correction=Math.abs(s.windX)<s.speed?Math.acos(-s.windX/s.speed)*180/PI:null;
  const north=correction===null?null:s.speed*Math.sin(correction*PI/180)+s.windY;
  m.push(['Sapmasız kuzey yönü',correction!==null&&north>0?F(correction,'°'):'Bu koşullarda yok','Doğu-batı rüzgârını ters bileşenle dengeler.']);
 }else m.push(['Tam karşıya çıkış',r.possibleAcross?F(r.headingForAcross,'°'):'Mümkün değil','|akıntı| kayık süratinden küçük olmalı.']);
 m.push(['Trigonometrik hesap',s.approx?'YKS: 37°/53° ≈ 3–4–5':'Gerçek sin/cos','Yaklaşım yalnız 37°, 53°, 127°, 143° için uygulanır.']);
 meter(m);
 note(plane?'v⃗(yer) = v⃗(hava) + v⃗(rüzgâr)':'v⃗(yer) = v⃗(su) + v⃗(akıntı)',
 'Kuzey/karşı kıyı bileşenini kullan: t = mesafe / yere göre kuzey hızı. Yatay sapma = yere göre yatay hız × t.',
 plane?'Kuyruk rüzgârı kuzey hızını ve süreyi de etkiler. Havaya göre sürati yere göre sürat sanma.':'Akıntı yalnız yataysa geçiş süresi kayığın suya göre dik bileşenine bağlıdır. Kayık hızı akıntıya eşitse tam karşıya geçiş için dik bileşen sıfıra iner; gerçek geçiş gerçekleşmez.');
 tip(plane?'Uçağın havaya göre yönünü ve rüzgârın x/y bileşenlerini değiştir. Hedefe düzelt düğmesi yatay sürüklenmeyi yok eder.':'Yön açısını +x ekseninden ölç. Dik karşıya en hızlı geçiş ile tam karşıya sapmadan geçiş farklı hedeflerdir.');
}
function paintQuiz(){
 const s=st.quiz,q=Q[s.index%Q.length];
 $('scene').innerHTML=graph('<rect x="70" y="70" width="720" height="360" rx="20" fill="#112c44" stroke="#416a80"/>'
 +label(97,124,'YKS • BAĞIL HAREKET / GÜNLÜK HAYAT',18,'#50e2c2')
 +label(97,183,'Vektörü çiz, gözlemcinin hızını çıkar.',21,'#e6f5ff')
 +label(97,236,'Nehre / rüzgâra göre hızları bir kez topla.',18)
 +label(97,290,'Sürat ile yönlü hızı birbirinden ayır.',18),false);
 meter([['Soru',String(s.index+1)+' / '+Q.length],['Doğru',String(s.score)],['Çözülen',String(s.attempts)]]);
 $('quiz').innerHTML='<div class="quiz-prompt">'+H(q.q)+'</div>'+q.choices.map((text,i)=>'<button type="button" data-answer="'+i+'" class="answer '+(s.checked?(i===q.a?'correct':i===s.choice?'wrong':''):'')+'" '+(s.checked?'disabled':'')+'><span>'+('ABCDE'[i])+'</span>'+H(text)+'</button>').join('')
 +(s.checked?'<div class="feedback '+(s.choice===q.a?'success':'error')+'">'+H(q.why)+'</div>':'<div class="feedback info">Bir seçeneği işaretle ve Cevabı kontrol et düğmesine bas.</div>');
 $('lesson').innerHTML='<p><strong>11.1.2.3:</strong> Bağıl hareketle ilgili hesaplamalar; günlük hayat örnekleriyle.</p><aside>Bu sorular özgündür; ÖSYM sorusu değildir.</aside>';
 tip('13 farklı temel soru. Her yanlışta önce hızların yön işaretlerini yaz.');
}
function paint(){
 $('quiz').innerHTML='';
 if(st.tab==='vectors')paintVector();
 else if(st.tab==='observer')paintObserver();
 else if(st.tab==='meet')paintMeet();
 else if(st.tab==='river')paintMedium(false);
 else if(st.tab==='wind')paintMedium(true);
 else paintQuiz();
 drawActions();
}
function renderControls(){
 const t=st.tab,s=st[t];let html='';
 if(t==='vectors'){
  for(const v of s.items){
   html+=control('x_'+v.id,v.id+' x bileşeni',-8,8,.5,v.x,'br');
   html+=control('y_'+v.id,v.id+' y bileşeni',-6,6,.5,v.y,'br');
   html+=control('k_'+v.id,v.id+' katsayısı',-2,2,.5,v.k,'×');
  }
  html+=select('snap','Sürükleme hassasiyeti',[['yes','Tam sayıya yapış'],['no','0,1 birim']],s.snap?'yes':'no');
 }else if(t==='observer'){
  for(const k of ['a','b']){html+=control(k+'vx',k.toUpperCase()+' x hızı',-8,8,.5,s[k].vx,'m/s');html+=control(k+'vy',k.toUpperCase()+' y hızı',-8,8,.5,s[k].vy,'m/s');}
  html+=select('ref','Gözlemci',[['Yer','Yer'],['A','A aracı'],['B','B aracı']],s.ref);
 }else if(t==='meet'){
  html+=control('xA','A başlangıç konumu',-60,80,1,s.xA,'m')+control('xB','B başlangıç konumu',-60,160,1,s.xB,'m')
   +control('vA','A hız (+sağ)',-15,15,1,s.vA,'m/s')+control('vB','B hız (+sağ)',-15,15,1,s.vB,'m/s');
 }else if(t==='river'){
  html+=control('speed','Kayık suya göre sürat',1,20,1,s.speed,'m/s')+control('heading','Yön açısı (+x ile)',5,175,1,s.heading,'°')
   +control('current','Akıntı hızı (+sağ)',-12,12,.5,s.current,'m/s')+control('width','Nehir genişliği',20,300,10,s.width,'m')
   +select('approx','37° / 53° trigonometrisi',[['yes','YKS 3–4–5 yaklaşımı'],['no','Gerçek sin/cos değerleri']],s.approx?'yes':'no');
 }else if(t==='wind'){
  html+=control('speed','Uçak havaya göre sürat',100,650,10,s.speed,'km/h')+control('heading','Uçuş açısı (+x ile)',5,175,1,s.heading,'°')
   +control('windX','Rüzgâr doğu-batı',-120,120,10,s.windX,'km/h')+control('windY','Rüzgâr kuzey-güney',-100,100,10,s.windY,'km/h')
   +control('distance','Kuzey hedefi',100,1200,50,s.distance,'km')
   +select('approx','37° / 53° trigonometrisi',[['yes','YKS 3–4–5 yaklaşımı'],['no','Gerçek sin/cos değerleri']],s.approx?'yes':'no');
 }else html='<p class="muted">Cevabı seçerek 2018 MEB düzeyinde pratik yap.</p>';
 $('controls').innerHTML=html;
}
function drawActions(){
 let html='';
 if(st.tab==='vectors')html=btn('Paralelkenar '+(st.vectors.parallel?'✓':'○'),'parallel',st.vectors.parallel)+btn('↺ Sıfırla','reset');
 else if(st.tab==='observer')html=btn(st.playing?'Ⅱ Duraklat':'▶ Oynat','play')+btn('Referansı değiştir','flip')+btn('↺ Sıfırla','reset');
 else if(st.tab==='meet')html=btn(st.playing?'Ⅱ Duraklat':'▶ Oynat','play')+btn('Karşılaşma','meeting')+btn('Yetişme','chase')+btn('Buluşmama','none')+btn('↺','reset');
 else if(['river','wind'].includes(st.tab))html=btn(st.playing?'Ⅱ Duraklat':'▶ Oynat','play')+btn('Hedefe düzelt','correct')+btn('Dik yöne dön','perpendicular')+btn('↺','reset');
 else html='<button type="button" class="btn primary" data-action="check" '+(st.quiz.choice===null||st.quiz.checked?'disabled':'')+'>Cevabı kontrol et</button>'+btn('Sonraki soru →','next')+btn('Testi sıfırla','reset');
 $('buttons').innerHTML=html;
}
function change(id,val){
 const t=st.tab,s=st[t];st.playing=false;
 if(t==='vectors'){
  const match=id.match(/^([xyk])_([KLM])$/);
  if(match){const v=s.items.find(x=>x.id===match[2]);if(v)v[match[1]]=Number(val);}
  if(id==='snap')s.snap=val==='yes';
 }else if(t==='observer'){
  const mat=id.match(/^([ab])(vx|vy)$/);
  if(mat)s[mat[1]][mat[2]]=Number(val);
  if(id==='ref')s.ref=val;
  s.time=0;
 }else if(t==='meet'||t==='river'||t==='wind'){
  if(id==='approx'&&'approx' in s){s.approx=val==='yes';s.time=0;}
  else if(id in s&&id!=='time'){s[id]=Number(val);s.time=0;}
 }
 paint();
}
function sync(id,val){
 const e=$('r-'+id)||$('s-'+id);if(!e)return;
 e.value=val;
 const out=$('out-'+id);if(out)out.textContent=F(val,e.dataset.unit);
}
function action(id){
 const t=st.tab,s=st[t];
 if(id==='play'){st.playing=!st.playing;last=0;paint();if(st.playing)schedule();return;}
 if(id==='parallel'){s.parallel=!s.parallel;paint();return;}
 if(id==='flip'){s.ref=s.ref==='A'?'B':'A';sync('ref',s.ref);paint();return;}
 if(id==='meeting'||id==='chase'||id==='none'){
  Object.assign(st.meet,id==='meeting'?{xA:0,xB:80,vA:6,vB:-4,time:0}:id==='chase'?{xA:0,xB:80,vA:12,vB:8,time:0}:{xA:0,xB:80,vA:4,vB:8,time:0});
  st.playing=false;renderControls();paint();return;
 }
 if(id==='correct'){
  const x=t==='river'?s.current:s.windX;
  if(!(Math.abs(x)<s.speed)){tip('Yatay akıntı/rüzgâr araç hızını dengeliyor veya aşıyor; sapmasız karşıya geçiş mümkün değil.');return;}
  const heading=Math.acos(-x/s.speed)*180/PI;
  if(t==='wind'&&s.speed*Math.sin(heading*PI/180)+s.windY<=0){tip('Yatay sapma giderilse bile kuzey yönünde net hız yok.');return;}
  s.heading=Math.round(heading*10)/10;s.time=0;st.playing=false;sync('heading',s.heading);paint();return;
 }
 if(id==='perpendicular'){s.heading=90;s.time=0;st.playing=false;sync('heading',90);paint();return;}
 if(id==='check'&&t==='quiz'&&!s.checked&&s.choice!==null){s.checked=true;s.attempts++;if(s.choice===Q[s.index%Q.length].a)s.score++;paint();return;}
 if(id==='next'&&t==='quiz'){s.index=(s.index+1)%Q.length;s.checked=false;s.choice=null;paint();return;}
 if(id==='reset'){st.playing=false;st[t]=JSON.parse(JSON.stringify(defaults[t]));renderControls();paint();}
}
function switchTab(id){
 if(!tabs.some(x=>x[0]===id))return;
 st.tab=id;st.playing=false;st.drag=null;
 d.querySelectorAll('[data-tab]').forEach(b=>{const yes=b.dataset.tab===id;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
 const names={vectors:'Vektör bileşenleri ve bileşke',observer:'2B hareketli gözlemci',meet:'Karşılaşma ve yetişme',river:'Nehirde akıntılı hareket',wind:'Rüzgârlı uçak ve rota',quiz:'AYT Bağıl Hareket mini test'};
 const intros={vectors:'Üç vektörün uçlarını sürükle; koordinatlarını ve toplamını gör.',observer:'Yer, A veya B gözlemcisinin gördüğü hareketi karşılaştır.',meet:'Sabit hızlı iki cismin aynı konuma gelme süresini bul.',river:'Akıntı, kayığın suya göre hızına vektörel eklenir.',wind:'Rüzgâr, uçağın havaya göre hızına vektörel eklenir.',quiz:'13 özgün YKS seviyesi kavrama/hesap sorusu.'};
 $('heading').textContent=names[id];$('intro').textContent=intros[id];$('tagline').textContent=id==='vectors'?'2018 MEB · 11.1.1':id==='quiz'?'2018 MEB · TEST':'2018 MEB · 11.1.2';
 renderControls();paint();
}
function ptr(e){
 const rect=$('scene').querySelector('svg')?.getBoundingClientRect();
 if(!rect||!rect.width||!rect.height)return null;
 return {x:(e.clientX-rect.left)*860/rect.width,y:(e.clientY-rect.top)*510/rect.height};
}
function startDrag(e){
 const node=e.target.closest('[data-drag-vector],[data-drag-car]');if(!node)return;
 const id=node.dataset.dragVector||node.dataset.dragCar;
 st.drag={id,type:node.dataset.dragVector?'vector':'car',pointerId:e.pointerId};
 if($('scene').setPointerCapture)$('scene').setPointerCapture(e.pointerId);
 e.preventDefault();
}
function moveDrag(e){
 if(!st.drag||st.drag.pointerId!==e.pointerId)return;
 const p=ptr(e);if(!p)return;
 const snap=(n,step,low,high)=>Math.max(low,Math.min(high,Math.round(n/step)*step));
 if(st.drag.type==='vector'){
  const v=st.vectors.items.find(x=>x.id===st.drag.id);if(!v)return;
  if(v.k===0){v.k=1;sync('k_'+v.id,1);}
  const step=st.vectors.snap?1:.1;
  v.x=snap((p.x-430)/37/v.k,step,-8,8);v.y=snap((255-p.y)/37/v.k,step,-6,6);
  sync('x_'+v.id,v.x);sync('y_'+v.id,v.y);
 }else{
  const s=st.observer,id=st.drag.id.toLowerCase(),v=s[id],t=s.time;
  const pos=P.vec(v.x+v.vx*t,v.y+v.vy*t);
  const ref=s.ref==='Yer'?P.vec(0,0):s.ref==='A'?P.vec(s.a.vx,s.a.vy):P.vec(s.b.vx,s.b.vy);
  const refPos=s.ref==='Yer'?P.vec(0,0):s.ref==='A'?P.vec(s.a.x+s.a.vx*t,s.a.y+s.a.vy*t):P.vec(s.b.x+s.b.vx*t,s.b.y+s.b.vy*t);
  const rel=P.sub(pos,refPos),x=430+rel.x*20,y=255-rel.y*20;
  v.vx=snap((p.x-x)/20+ref.x,.5,-8,8);v.vy=snap((y-p.y)/20+ref.y,.5,-8,8);
  sync(id+'vx',v.vx);sync(id+'vy',v.vy);
 }
 paint();
}
let last=0,frameHandle=null;
function schedule(){if(st.playing&&frameHandle===null)frameHandle=w.requestAnimationFrame(frame);}
function frame(now){
 frameHandle=null;
 if(st.playing){
  const dt=Math.min(.05,last?(now-last)/1000:0);
  let s=st[st.tab];
  if(st.tab==='observer'){s.time=Math.min(18,s.time+dt);if(s.time>=18)st.playing=false;}
  if(st.tab==='meet'){
   const r=P.rendezvous(s),max=r.time===null?20:Math.max(12,r.time+2);
   s.time=Math.min(max,s.time+dt);if(s.time>=max)st.playing=false;
  }
  if(st.tab==='river'||st.tab==='wind'){
   const r=st.tab==='river'?P.river({speed:s.speed,angleDeg:s.heading,current:s.current,width:s.width,approx:s.approx}):P.wind({speed:s.speed,angleDeg:s.heading,windX:s.windX,windY:s.windY,northDistance:s.distance,approx:s.approx});
   s.time=Math.min(r.time||0,s.time+dt);if(r.time===null||s.time>=r.time)st.playing=false;
  }
  paint();
 }
 last=now;if(st.playing)schedule();
}
function init(){
 if(!$('tabs')||!$('scene'))return;
 $('tabs').innerHTML=tabs.map(([id,name])=>'<button type="button" data-tab="'+id+'" aria-pressed="false">'+H(name)+'</button>').join('');
 $('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)switchTab(b.dataset.tab);});
 $('controls').addEventListener('input',e=>{const el=e.target.closest('input[data-range]');if(!el)return;
  const out=$('out-'+el.dataset.range);if(out)out.textContent=F(Number(el.value),el.dataset.unit);
  change(el.dataset.range,el.value);
 });
 $('controls').addEventListener('change',e=>{const el=e.target.closest('select[data-select]');if(el)change(el.dataset.select,el.value);});
 $('buttons').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)action(b.dataset.action);});
 $('quiz').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b&&st.tab==='quiz'&&!st.quiz.checked){st.quiz.choice=Number(b.dataset.answer);paint();}});
 $('scene').addEventListener('pointerdown',startDrag);
 $('scene').addEventListener('pointermove',moveDrag);
 $('scene').addEventListener('pointerup',e=>{if(st.drag&&st.drag.pointerId===e.pointerId)st.drag=null;});
 $('scene').addEventListener('pointercancel',()=>{st.drag=null;});
 $('scene').addEventListener('lostpointercapture',()=>{st.drag=null;});
 d.addEventListener('visibilitychange',()=>{if(d.hidden){st.playing=false;last=0;drawActions();}});
 switchTab('vectors');
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
w.BagilLabDebug=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({tab:st.tab,observer:st.observer,river:st.river,wind:st.wind,meet:st.meet,quiz:st.quiz}))});
})(window,document);