(function(d){'use strict';
const tabs=[['interference','Çift yarık girişimi'],['diffraction','Tek yarık kırınımı'],['doppler','Doppler olayı'],['em','Elektromanyetik dalgalar'],['photo','Fotoelektrik olay'],['compton','Compton saçılması'],['matter','Madde dalgaları'],['relativity','Özel görelilik'],['blackbody','Siyah cisim ışıması'],['semiconductor','Yarı iletken ve diyot']];
const s={tab:'interference',lambda:550,slit:2,distance:2,speed:0.3,frequency:3,voltage:0,work:2.3,angle:45,momentum:3,beta:.5,temp:4200,bias:1,phase:0,playing:false};const $=id=>d.getElementById(id),clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),fmt=x=>Number(x).toLocaleString('tr-TR',{maximumFractionDigits:3});
const svg=(tag,attrs)=>'<'+tag+' '+Object.entries(attrs).map(([k,v])=>k+'="'+v+'"').join(' ')+'/>';const label=(x,y,v,size=20)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="#f0f8fb" font-family="system-ui">'+v+'</text>';
const line=(x,y,X,Y,c='#9adfee',w=3)=>svg('line',{x1:x,y1:y,x2:X,y2:Y,stroke:c,'stroke-width':w});
function draw(){
 let b=svg('rect',{width:900,height:470,fill:'#0a2638'}),read='',note='';
 const wave=s.lambda/550,dist=s.distance;
 if(['interference','diffraction'].includes(s.tab)){
  const double=s.tab==='interference',spacing=s.slit,fringe=double?70*wave*dist/spacing:110*wave*dist/spacing;
  b+=line(240,70,240,400,'#d8e7e9',8)+line(750,70,750,400,'#b4cbd6',8);
  for(let n=-5;n<=5;n++){const y=235+n*fringe;if(y<82||y>389)continue;const intensity=double?1:n===0?1:0.015; // maxima for two slits; minima for single-slit diffraction
   b+=svg('rect',{x:730,y:y-8,width:38,height:16,fill:'#85f4d9',opacity:clamp(intensity,.05,1)});
   b+=line(240,235+(double?(n%2?spacing*8:-spacing*8):0),730,y,'#2f8796',1);
  }
  b+=label(65,65,'Işık kaynağı')+label(194,435,double?'Çift yarık':'Tek yarık')+label(708,435,'Perde');
  read=double?'Saçak aralığı Δx = λL/d · göreli '+fmt(fringe)+' px':'Merkez maksimum genişliği ∝ λL/a · göreli '+fmt(fringe)+' px';
  note='Dalga boyu büyürse ve yarık–perde uzaklığı artarsa desen genişler. Yarık aralığı/genişliği artarsa desen daralır. Çizim şematiktir.';
 }else if(s.tab==='doppler'){
  const shift=s.speed*100;
  for(let i=1;i<=6;i++)b+=svg('ellipse',{cx:440+(6-i)*shift,cy:230,rx:i*50,ry:i*50,fill:'none',stroke:'#79cfe9','stroke-width':2});
  b+=svg('circle',{cx:440,cy:230,r:18,fill:'#f3c285'})+label(65,75,'Kaynak sağa hareket eder');
  read=s.speed===0?'Durgun kaynak: dalga cepheleri simetrik':'Öndeki dalga cepheleri sıklaşır; arkadakiler seyrekleşir';
  note='Kaynak ve gözlemcinin göreli hareketi algılanan frekansı değiştirir. Kaynak dururken hız sıfırsa simetrik cepheler görülür.';
 }else if(s.tab==='em'){
  let p1=[],p2=[];for(let x=80;x<820;x+=6){const t=(x-80)/740*s.frequency*Math.PI*2-s.phase;p1.push(x+','+(235-75*Math.sin(t)));p2.push(x+','+(235-55*Math.sin(t)));}
  b+=svg('polyline',{points:p1.join(' '),fill:'none',stroke:'#f7c587','stroke-width':4})+svg('polyline',{points:p2.join(' '),fill:'none',stroke:'#81e7d8','stroke-width':4});
  read='E ve B aynı fazdadır; birbirine ve ilerleme yönüne diktir';note='İki eğri aynı fazda çizilir; E ve B uzayda farklı, birbirine dik eksenlerdedir. 2B çizim 3B alan yönlerini temsil etmez.';
 }else if(s.tab==='photo'){
  const photon=s.frequency,kinetic=Math.max(0,photon-s.work),emits=photon>s.work;
  b+=svg('rect',{x:260,y:290,width:390,height:60,fill:'#8a9aa9'})+label(350,392,'Metal yüzey');
  for(let i=0;i<4;i++){const x=180+i*85;b+=line(x,110,x+85,270,'#f2d27b',3);if(emits)b+=svg('circle',{cx:300+i*75,cy:260-kinetic*30,r:8,fill:'#8be8e5'});}
  read=emits?'Elektron kopar · maksimum kinetik enerji = '+fmt(kinetic)+' eV':photon===s.work?'Eşik enerjiye ulaşıldı · elektron sıfır kinetik enerjiyle çıkabilir':'Eşik frekans aşılmadı · elektron kopmaz';
  note='Foton enerjisi hf iş fonksiyonunu aşınca fotoelektron çıkar. Işık şiddeti tek başına eşik altı frekansta elektron koparamaz. Burada frekans kaydırıcısı foton enerjisi (eV) ölçeğiyle temsil edilir.';
 }else if(s.tab==='compton'){
  const theta=s.angle*Math.PI/180,delta=1-Math.cos(theta);
  b+=line(130,235,440,235,'#f6d180',5)+svg('circle',{cx:440,cy:235,r:16,fill:'#9ee4ec'})+line(440,235,440+260*Math.cos(theta),235-260*Math.sin(theta),'#f6d180',5)+line(440,235,580,365,'#91e8d2',4);
  read='Saçılan fotonun dalga boyu artışı ∝ 1 − cosθ = '+fmt(delta);
  note='Compton saçılmasında foton enerji ve momentum aktarır. Dalga boyu artışı saçılma açısına bağlıdır; 0° için sıfır, 180° için en büyüktür.';
 }else if(s.tab==='matter'){
  const wavelength=240/s.momentum;let pts=[];for(let x=80;x<820;x+=4)pts.push(x+','+(235-60*Math.sin((x-80)*Math.PI*2/wavelength)));
  b+=svg('polyline',{points:pts.join(' '),stroke:'#85e5dc','stroke-width':4,fill:'none'});
  read='de Broglie: λ = h/p · göreli dalga boyu '+fmt(wavelength)+' px';
  note='Momentum arttıkça madde dalga boyu küçülür. Dalga boyunun ekrandaki uzunluğu yalnız görsel ölçeklemedir.';
 }else if(s.tab==='relativity'){
  const gamma=1/Math.sqrt(1-s.beta*s.beta),contract=1/gamma;
  b+=svg('rect',{x:150,y:175,width:580,height:110,fill:'#194d6c',stroke:'#c6e6ee','stroke-width':3})+svg('rect',{x:150,y:325,width:580*contract,height:75,fill:'#3e9eab'});
  read='γ = '+fmt(gamma)+' · hareket yönünde boy oranı L/L₀ = '+fmt(contract);
  note='Özel görelilikte hareketli saatin zaman aralığı γ ile büyür; boy kısalması yalnız hareket doğrultusundadır. Bu çizim farklı referans çerçevelerindeki ölçümleri karşılaştırır.';
 }else if(s.tab==='blackbody'){
  const peak=2.898e6/s.temp;let pts=[];const planckShape=nm=>{const z=1.4387769e7/(nm*s.temp);return 1/(Math.pow(nm,5)*Math.expm1(z));};const peakValue=planckShape(peak);for(let x=60;x<840;x+=4){const wavelength=100+x*3.5,y=395-300*planckShape(wavelength)/peakValue;pts.push(x+','+clamp(y,80,400));}
  b+=svg('polyline',{points:pts.join(' '),fill:'none',stroke:'#f4c586','stroke-width':4});
  read='Wien yasası: λmaks ≈ '+fmt(peak)+' nm';
  note='Sıcaklık arttıkça ışımanın tepe dalga boyu küçülür. Eğri, öğretici yaklaşık spektral şekildir; mutlak güç ölçeği değildir.';
 }else{
  const forward=s.bias>0,active=forward;
  b+=line(110,235,390,235,'#98d6e8',5)+svg('polygon',{points:'390,155 390,315 525,235',fill:'#f0c47e'})+line(525,155,525,315,'#eaf3f6',7)+line(525,235,780,235,'#98d6e8',5);
  if(active)for(let i=0;i<5;i++)b+=svg('circle',{cx:170+i*100,cy:235,r:8,fill:'#8cebcf'});
  read=forward?'İleri kutuplama: ideal diyot iletim yönünde':'Ters kutuplama: ideal diyot akımı engeller';
  note='Gerçek diyotun eşik gerilimi, ters sızıntısı ve kırılma bölgesi bu nitel modelde temsil edilmez. Yarı iletkenler ve p–n birleşimi.';
 }
 $('scene').innerHTML=b;$('readout').textContent=read;$('note').textContent=note;
}
const configs={interference:[['lambda','Dalga boyu (nm)',380,750,10],['slit','Yarık aralığı (göreli)',1,6,.5],['distance','Perde uzaklığı (göreli)',1,4,.5]],diffraction:[['lambda','Dalga boyu (nm)',380,750,10],['slit','Yarık genişliği (göreli)',1,6,.5],['distance','Perde uzaklığı (göreli)',1,4,.5]],doppler:[['speed','Kaynak hızı / dalga hızı',0,.7,.05]],em:[['frequency','Frekans (görsel)',1,7,.5]],photo:[['frequency','Foton enerjisi (eV)',1,6,.1],['work','İş fonksiyonu (eV)',1,5,.1]],compton:[['angle','Saçılma açısı (°)',0,180,5]],matter:[['momentum','Momentum (göreli)',1,9,.5]],relativity:[['beta','Hız v/c',0,.95,.05]],blackbody:[['temp','Sıcaklık (K)',2000,9000,100]],semiconductor:[['bias','Kutuplama (− ters / + ileri)',-1,1,2]]};
function render(){ $('tabs').innerHTML=tabs.map(([id,name])=>'<button data-tab="'+id+'" aria-pressed="'+(id===s.tab)+'">'+name+'</button>').join('');$('controls').innerHTML=configs[s.tab].map(([key,name,min,max,step])=>'<label>'+name+' <strong id="'+key+'-out">'+fmt(s[key])+'</strong><input type="range" data-key="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[key]+'"></label>').join('');draw();}
$('tabs').addEventListener('click',e=>{const el=e.target.closest('[data-tab]');if(el){s.tab=el.dataset.tab;render();}});
$('controls').addEventListener('input',e=>{const k=e.target.dataset.key;if(Object.prototype.hasOwnProperty.call(s,k)){s[k]=Number(e.target.value);$(k+'-out').textContent=fmt(s[k]);draw();}});
render();
})(document);