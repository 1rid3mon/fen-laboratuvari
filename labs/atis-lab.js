/* 2018 MEB 11.1.5.1–2: projectile motion interactive lab. */
(function(w,d){'use strict';
const M=w.AtisMath;if(!M)return;
const $=id=>d.getElementById(id),fmt=(n,digits=2)=>Number(n.toFixed(digits)).toLocaleString('tr-TR',{maximumFractionDigits:digits});
const tabs=[['horizontal','Yatay atış'],['angled','Eğik atış'],['components','Hız bileşenleri'],['comparison','Açı–menzil karşılaştırması'],['target','Hedef vurma'],['graphs','Dört grafik'],['quiz','AYT mini test']];
const presets={horizontal:{speed:16,angle:0,height:45,g:10,t:0},angled:{speed:24,angle:45,height:0,g:10,t:0},components:{speed:20,angle:35,height:10,g:10,t:0},comparison:{speed:24,angle:30,height:0,g:10,t:0},target:{speed:20,angle:40,height:0,g:10,t:0},graphs:{speed:20,angle:50,height:0,g:10,t:0}};
const S={tab:'horizontal',playing:false,last:0,showVectors:true,targetX:34,targetY:0,quizIndex:0,answer:null,checked:false,score:0};
for(const k of Object.keys(presets))S[k]={...presets[k]};
const Q=[
 ['Yerden 45 m yükseklikten 20 m/s yatay atılan cismin yere düşme süresi (g=10)?',['2 s','3 s','4 s','4,5 s','5 s'],1,'Düşeyde ilk hız 0: 45=5t² → t=3 s.'],
 ['Aynı yatay atışta yatay menzil kaç metredir?',['20','40','45','60','90'],3,'x=vₓt=20×3=60 m.'],
 ['Hava direnci yokken yatay atış yapan cismin vₓ bileşeni nasıl değişir?',['Artar','Azalır','Sabit kalır','Önce artar','Sıfır olur'],2,'Yatay yönde ivme sıfır: vₓ sabit.'],
 ['Yatay atışta cismin düşey hızı hangi bağıntıyla değişir (aşağı pozitif)?',['vᵧ=v₀','vᵧ=gt','vᵧ=0','vᵧ=v₀t²','vᵧ=g/t'],1,'İlk düşey hız 0 olduğundan vᵧ=gt.'],
 ['Eğik atışın tepe noktasında hangi ifade doğrudur?',['Toplam hız sıfırdır','İvme sıfırdır','Yatay hız sıfırdır','Düşey hız sıfırdır','Yerçekimi sıfırdır'],3,'Tepe noktasında vᵧ=0; vₓ sabit ve aᵧ=−g.'],
 ['20 m/s hızla 30° açıyla atışta ilk düşey hız? (sin30°=0,5)',['5','10','15','20','40'],1,'v₀ᵧ=v₀sin30°=10 m/s.'],
 ['20 m/s hızla 60° açıyla atışta ilk yatay hız? (cos60°=0,5)',['5','10','15','20','40'],1,'v₀ₓ=v₀cos60°=10 m/s.'],
 ['Aynı seviyeye düşen eğik atışta uçuş süresi neye eşittir?',['v₀/g','2v₀sinθ/g','v₀cosθ/g','v₀²/g','2v₀²/g'],1,'Yukarı çıkış ve aşağı iniş simetriktir: T=2v₀sinθ/g.'],
 ['Aynı hızla, aynı seviyeden atılan 30° ve 60° atışların menzili?',['30° daha büyük','60° daha büyük','Eşit','Sıfır','g ile ilgisiz'],2,'R=v₀²sin(2θ)/g; sin60°=sin120°.'],
 ['Aynı hızla ve aynı seviyeye atışta en büyük menzil hangi açıdadır?',['15°','30°','45°','60°','90°'],2,'R en büyük olduğunda sin(2θ)=1 → θ=45°.'],
 ['20 m/s, 30° ile atışta tepeye çıkış süresi (g=10)?',['0,5','1','2','3','4'],1,'v₀ᵧ=10 m/s; tepeye çıkış süresi 10/10=1 s.'],
 ['Aynı atışta maksimum yükselme miktarı?',['2,5 m','5 m','10 m','20 m','40 m'],1,'H=(v₀ᵧ)²/(2g)=100/20=5 m.'],
 ['İki boyutta atış hareketinde ivme vektörü hangi yöndedir?',['Hız yönünde','Yatay sağa','Daima aşağı','Teğet yönde','Tepe noktasında sıfır'],2,'Hava direnci yoksa ivme yalnızca aşağı yönde g büyüklüğündedir.'],
 ['Atışta cismin hızının büyüklüğü nasıl hesaplanır?',['vₓ+vᵧ','vₓ−vᵧ','√(vₓ²+vᵧ²)','vₓvᵧ','g/t'],2,'Birbirine dik hız bileşenleri Pisagor ile birleştirilir.'],
 ['Yatay atışta yükseklik dört katına çıkarılırsa düşme süresi?',['Yarıya iner','İki katına çıkar','Dört katına çıkar','Değişmez','Sekiz katına çıkar'],1,'t=√(2h/g); h dört katına çıkarsa t iki katına çıkar.'],
 ['Aynı yatay hızda yükseklik dört katına çıkarılırsa menzil?',['Yarıya iner','İki katına çıkar','Dört katına çıkar','Değişmez','Sekiz katına çıkar'],1,'R=vₓ√(2h/g), süre iki katına çıkar.'],
 ['Hava direnci yokken aynı yükseklikten aynı anda yatay atılan ve serbest bırakılan cisimler?',['Yatay atılan önce düşer','Serbest bırakılan önce düşer','Aynı anda yere ulaşır','Kütlesi büyük olan önce','Hızı büyük olan önce'],2,'İlk düşey hızlar eşit (0), düşey ivmeleri aynı g olduğundan süreleri eşittir.'],
 ['Yerden atılıp aynı seviyeye düşen bir cismin tepe noktası yörüngede nerede?',['Başlangıçta','Yatay mesafenin ortasında','Menzilin sonunda','Her zaman ilk çeyrekte','Açıya bağlı rastgele'],1,'Yatay hız sabit ve yükseliş–iniş süresi eşit: tepe x=R/2.'],
 ['Yatay atışta düşey yer değiştirme −20 m ve g=10 iken süre?',['1 s','2 s','3 s','4 s','5 s'],1,'−20=−5t² → t=2 s.'],
 ['İki boyutta hareket için x ve y denklemleri hangi ilkeye göre çözülür?',['Tek eksende toplam hız','Bağımsız eksenlerde aynı zaman','Düşey hareket yatayı durdurur','Yatay ivme g','Yalnız enerji korunumu'],1,'Yatay ve düşey bileşenler bağımsız hesaplanır; zamanları aynıdır.']
];
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function active(){return S[S.tab];}
function selectTab(tab){if(!tabs.some(x=>x[0]===tab))return;S.playing=false;S.tab=tab;S.last=0;S.answer=null;S.checked=false;renderControls();render();}
function btn(action,text){return '<button type="button" data-action="'+action+'">'+text+'</button>';}
function control(key,label,min,max,step,val,unit){return '<label>'+label+' <output id="out-'+key+'">'+fmt(val)+' '+unit+'</output><input type="range" id="in-'+key+'" data-range="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"></label>';}
function renderControls(){
 if(S.tab==='quiz'){$('controls').innerHTML='';return;}
 const p=active(),isHorizontal=S.tab==='horizontal';
 let h=control('speed','İlk hız',0,40,1,p.speed,'m/s');
 if(!isHorizontal)h+=control('angle','Atış açısı',0,85,1,p.angle,'°');
 h+=control('height','Başlangıç yüksekliği',0,100,5,p.height,'m');
 h+=control('g','Yerçekimi ivmesi',5,15,1,p.g,'m/s²');
 h+=control('t','Zaman',0,Math.max(.1,M.solve({...p,t:0}).flight),.05,p.t,'s');
 if(S.tab==='target'){h+=control('targetX','Hedefin yatay konumu',5,120,1,S.targetX,'m');h+=control('targetY','Hedef yüksekliği',0,60,1,S.targetY,'m');}
 $('controls').innerHTML=h;
}
function pathFor(p,scaleX,scaleY,left,bottom){return M.sample(p,90).map((r,i)=>(i?'L':'M')+(left+r.x*scaleX).toFixed(1)+' '+(bottom-r.y*scaleY).toFixed(1)).join(' ');}
function arrow(x,y,dx,dy,color,label){
 if(Math.hypot(dx,dy)<2)return '';
 const endX=x+dx,endY=y+dy,a=Math.atan2(dy,dx),wing=8;
 return '<path d="M'+x+' '+y+' L'+endX+' '+endY+' M'+(endX-wing*Math.cos(a-.55))+' '+(endY-wing*Math.sin(a-.55))+' L'+endX+' '+endY+' L'+(endX-wing*Math.cos(a+.55))+' '+(endY-wing*Math.sin(a+.55))+'" fill="none" stroke="'+color+'" stroke-width="3"/><text x="'+(endX+5)+'" y="'+(endY-6)+'" fill="'+color+'" font-size="13">'+label+'</text>';
}
function scene(p,r){
 const compare=S.tab==='comparison',target=S.tab==='target',comp=compare?{...p,angle:90-p.angle,t:0}:null;
 const end=M.solve({...p,t:0}),end2=comp?M.solve(comp):null;
 const xmax=Math.max(18,end.range,end2?.range||0,target?S.targetX:0),ymax=Math.max(10,end.peakY,end2?.peakY||0,target?S.targetY:0);
 const sx=730/(xmax+5),sy=340/(ymax+5),left=62,bottom=428;
 let h='<svg viewBox="0 0 860 490" role="img" aria-label="Yatay düşey atış yörüngesi, hız ve ivme vektörleri"><rect width="860" height="490" fill="#091c2e"/>';
 for(let i=0;i<=8;i++){let x=left+i*91;h+='<line x1="'+x+'" y1="30" x2="'+x+'" y2="'+bottom+'" stroke="#1d3b50"/>';}
 for(let i=0;i<=6;i++){let y=bottom-i*62;h+='<line x1="'+left+'" y1="'+y+'" x2="814" y2="'+y+'" stroke="#1d3b50"/>';}
 h+='<path d="M'+left+' 28 V'+bottom+' H816" fill="none" stroke="#b7d2de" stroke-width="2"/><text x="805" y="449" fill="#d2eaf1">x (m)</text><text x="18" y="30" fill="#d2eaf1">y (m)</text>';
 h+='<path d="'+pathFor(p,sx,sy,left,bottom)+'" fill="none" stroke="#68e6d4" stroke-width="4"/>';
 if(comp)h+='<path d="'+pathFor(comp,sx,sy,left,bottom)+'" fill="none" stroke="#f5c978" stroke-dasharray="8 5" stroke-width="3"/>';
 const px=left+r.x*sx,py=bottom-r.y*sy;
 h+='<circle cx="'+px+'" cy="'+py+'" r="9" fill="#fff0a5" stroke="#f4b95e" stroke-width="3"/>';
 if(S.showVectors&&!r.impacted){
 const factor=Math.min(4,90/Math.max(1,r.speedAt));
 h+=arrow(px,py,r.vx*factor,0,'#66b8ff','vₓ');
 h+=arrow(px,py,0,-r.vy*factor,'#ff99b0','vᵧ');
 h+=arrow(px,py,0,30,'#f5c978','g');
 }
 if(target){const tx=left+S.targetX*sx,ty=bottom-S.targetY*sy;h+='<circle cx="'+tx+'" cy="'+ty+'" r="13" fill="none" stroke="#f5c978" stroke-width="3"/><path d="M'+(tx-19)+' '+ty+' H'+(tx+19)+' M'+tx+' '+(ty-19)+' V'+(ty+19)+'" stroke="#f5c978" stroke-width="2"/>';}
 h+='<text x="75" y="22" fill="#b6e9db" font-size="14">Yeşil: atış yolu'+(compare?' · Sarı: tamamlayıcı açı':'')+'</text>';
 h+='<text x="75" y="473" fill="#b3cddd" font-size="12">Hava direnci yok; x ve y aynı zaman parametresini paylaşır. Ölçek görseldir.</text></svg>';
 return h;
}
function graph(name,p,key,unit,color){
 const flight=M.solve({...p,t:0}).flight;
 const values=Array.from({length:61},(_,i)=>{const r=M.solve({...p,t:flight*i/60});return {t:r.at,y:key==='x'?r.x:key==='y'?r.y:key==='vx'?r.vx:r.vy};});
 const ys=values.map(v=>v.y),lo=Math.min(0,...ys),hi=Math.max(1,...ys),span=Math.max(1,hi-lo);
 const pts=values.map(v=>[30+v.t/Math.max(.0001,flight)*290,144-(v.y-lo)/span*120]);
 const line=pts.map((v,i)=>(i?'L':'M')+v[0].toFixed(1)+' '+v[1].toFixed(1)).join(' ');
 const r=M.solve(p),cur=key==='x'?r.x:key==='y'?r.y:key==='vx'?r.vx:r.vy;
 const xx=30+r.at/Math.max(.0001,flight)*290,yy=144-(cur-lo)/span*120;
 return '<div><strong>'+name+'</strong><svg viewBox="0 0 350 185" role="img" aria-label="'+name+' grafiği"><path d="M30 12 V144 H330" stroke="#aec9d6" fill="none" stroke-width="2"/><path d="'+line+'" stroke="'+color+'" stroke-width="3" fill="none"/><circle cx="'+xx+'" cy="'+yy+'" r="5" fill="#fff"/><text x="34" y="16" fill="#e5f4fb" font-size="11">'+fmt(hi)+' '+unit+'</text><text x="34" y="161" fill="#e5f4fb" font-size="11">'+fmt(lo)+' '+unit+'</text><text x="270" y="174" fill="#b8d0db" font-size="11">t (s)</text></svg></div>';
}
function showQuiz(){
 const q=Q[S.quizIndex];$('quiz').innerHTML='<h3>🧠 Soru '+(S.quizIndex+1)+' / '+Q.length+'</h3><p>'+escape(q[0])+'</p>'+q[1].map((v,i)=>'<button type="button" class="pchoice" data-answer="'+i+'" aria-pressed="'+(S.answer===i)+'">'+String.fromCharCode(65+i)+') '+escape(v)+'</button>').join('')+(S.checked?'<p class="projectile-note">'+(S.answer===q[2]?'✅ Doğru!':'❌ Yanlış. Doğru: '+String.fromCharCode(65+q[2]))+' '+escape(q[3])+'</p>':'')+'<p>Doğru sayısı: '+S.score+' / '+Q.length+'</p>';
}
function render(){
 const t=S.tab,p=active();
 $('tabs').innerHTML=tabs.map(x=>'<button type="button" data-tab="'+x[0]+'" aria-current="'+(t===x[0]?'page':'false')+'">'+x[1]+'</button>').join('');
 if(t==='quiz'){
 $('heading').textContent='20 özgün AYT sorusu';$('intro').textContent='Hız bileşenleri, yatay/eğik atış, menzil, uçuş süresi ve grafik yorumlama.';
 $('scene').innerHTML='';$('buttons').innerHTML=btn('check','Cevabı kontrol et')+btn('next','Sonraki soru')+btn('restart','Testi sıfırla');$('hint').textContent='Her sorunun açıklaması cevap kontrolünden sonra görünür.';$('results').innerHTML='';$('graphs').innerHTML='';$('lesson').textContent='MEB 2018 kazanımları: 11.1.5.1 ve 11.1.5.2.';showQuiz();return;
 }
 const r=M.solve(p),end=M.solve({...p,t:0}),titles={horizontal:'Yatay atış: yatayda sabit hız, düşeyde serbest düşme',angled:'Eğik atış: ilk hızı bileşenlerine ayır',components:'Hız vektörlerini ayrı ayrı izle',comparison:'Tamamlayıcı açılar ve menzil',target:'Hedefi vur: açıyı ve ilk hızı ayarla',graphs:'Konum ve hız grafiklerini karşılaştır'};
 $('heading').textContent=titles[t];$('intro').textContent='İki boyutta hareketin ortak zamanı vardır: x=v₀ₓt, y=h+v₀ᵧt−½gt². İvme yatayda 0, düşeyde −g.';
 $('scene').innerHTML=scene(p,r);
 $('buttons').innerHTML=btn('play',S.playing?'Ⅱ Duraklat':'▶ Oynat')+btn('step','+0,2 saniye')+btn('vectors',S.showVectors?'Vektörleri gizle':'Vektörleri göster')+btn('reset','↺ Sıfırla');
 let hint='Başlangıç yüksekliğini, ilk hızı veya açıyı değiştir. Top zemine çarptığında hareket durur; çarpma hızı ayrı gösterilir.';
 if(t==='horizontal')hint='Yatay atışta v₀ᵧ=0, vₓ sabit. Aynı yükseklikten serbest bırakılan cisimle yere ulaşma süresi eşittir.';
 if(t==='comparison')hint='Başlangıç ve bitiş yüksekliği eşitse θ ile 90°−θ menzilleri eşittir. Farklı yüksekliklerde bu simetri geçerli değildir.';
 if(t==='target'){
 const atX=S.targetX/Math.max(.00001,r.vx),heightAtX=p.height+r.vy0*atX-.5*p.g*atX*atX;
 const miss=atX<=end.flight&&Math.abs(heightAtX-S.targetY)<=2;
 hint=miss?'🎯 İsabet! Hedefin x konumunda top, hedefin yüksekliğine ±2 m yaklaşıyor.':'🎯 Hedefin x konumunda hesaplanan yükseklik: '+fmt(heightAtX)+' m. Hedef: '+fmt(S.targetY)+' m. İpucu: hız ve açıyı değiştir.';
 }
 $('hint').textContent=hint;
 const vals=[['Zaman',fmt(r.at)+' s'],['Yatay konum',fmt(r.x)+' m'],['Yükseklik',fmt(r.y)+' m'],['Yatay hız vₓ',fmt(r.vx)+' m/s'],['Düşey hız vᵧ',fmt(r.vy)+' m/s'],['Toplam sürat',fmt(r.speedAt)+' m/s'],['Uçuş süresi',fmt(end.flight)+' s'],['Menzil',fmt(end.range)+' m'],['Tepe yüksekliği',fmt(end.peakY)+' m'],['Tepe zamanı',fmt(end.peakT)+' s'],['Çarpma sürati',fmt(end.impactSpeed)+' m/s'],['İvme','(0, −'+fmt(p.g)+') m/s²']];
 $('results').innerHTML=vals.map(x=>'<div><small>'+x[0]+'</small><strong>'+x[1]+'</strong></div>').join('');
 $('graphs').innerHTML=graph('x–t',p,'x','m','#70e6d0')+graph('y–t',p,'y','m','#f5c978')+graph('vₓ–t',p,'vx','m/s','#66b8ff')+graph('vᵧ–t',p,'vy','m/s','#ff99b0');
 $('lesson').textContent='Kazanım 11.1.5.1–2: Yatay ve düşey hareket birbirinden bağımsız çözülür. Hava direnci yokken vₓ sabit; vᵧ=v₀sinθ−gt. Aynı seviyeden eğik atışta menzil R=v₀²sin(2θ)/g; farklı başlangıç yüksekliğinde bu kısa formül kullanılmaz.';
 $('quiz').innerHTML='';
}
function syncTime(){const p=active(),n=$('in-t'),o=$('out-t');if(n){n.max=String(Math.max(.1,M.solve({...p,t:0}).flight));n.value=String(p.t);}if(o)o.textContent=fmt(p.t)+' s';}
function update(key,value){
 if(S.tab==='quiz')return;
 const p=active();
 if(key==='targetX'||key==='targetY'){S[key]=Number(value);}else{p[key]=Number(value);if(S.tab==='horizontal')p.angle=0;if(key!=='t')p.t=0;}
 p.t=Math.min(p.t,M.solve({...p,t:0}).flight);syncTime();S.playing=false;render();
}
function frame(ms){if(!S.playing)return;if(!S.last)S.last=ms;const p=active(),end=M.solve({...p,t:0}).flight;p.t=Math.min(end,p.t+Math.min(.08,(ms-S.last)/1000));S.last=ms;syncTime();render();if(p.t>=end){S.playing=false;render();return;}w.requestAnimationFrame(frame);}
function action(a){
 if(S.tab==='quiz'){
 if(a==='check'&&S.answer!==null&&!S.checked){S.checked=true;if(S.answer===Q[S.quizIndex][2])S.score++;showQuiz();}
 if(a==='next'){S.quizIndex=(S.quizIndex+1)%Q.length;S.answer=null;S.checked=false;showQuiz();}
 if(a==='restart'){S.quizIndex=0;S.answer=null;S.checked=false;S.score=0;showQuiz();}
 return;
 }
 const p=active();
 if(a==='vectors'){S.showVectors=!S.showVectors;render();}
 if(a==='reset'){S.playing=false;Object.assign(p,presets[S.tab]);renderControls();render();}
 if(a==='step'){S.playing=false;p.t=Math.min(M.solve({...p,t:0}).flight,p.t+.2);syncTime();render();}
 if(a==='play'){if(S.playing){S.playing=false;render();return;}if(p.t>=M.solve({...p,t:0}).flight)p.t=0;S.playing=true;S.last=0;render();w.requestAnimationFrame(frame);}
}
function init(){
 $('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)selectTab(b.dataset.tab);});
 $('controls').addEventListener('input',e=>{const b=e.target.closest('[data-range]');if(b)update(b.dataset.range,b.value);});
 $('buttons').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)action(b.dataset.action);});
 $('quiz').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b&&!S.checked){S.answer=Number(b.dataset.answer);showQuiz();}});
 d.addEventListener('visibilitychange',()=>{if(d.hidden){S.playing=false;S.last=0;}});
 renderControls();render();
}
w.AtisLabDebug={snapshot:()=>JSON.parse(JSON.stringify(S)),questions:Q.length};
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
})(window,document);