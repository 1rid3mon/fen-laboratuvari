(function(d,M){'use strict';
const el=id=>d.getElementById(id),fmt=(n,digits=2)=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:digits}),clamp=M.clamp;
const topicNames={waves:'Dalgalar',matter:'Madde ve Özellikleri',intro:'Fizik Bilimine Giriş',heat:'Isı–Sıcaklık'};
const modes={waves:[['spring','Yayda atma ve yansıma'],['water','Su dalgasında kırılma'],['sound','Ses ve tanecikler']],matter:[['cylinder','Özkütle ve suyla hacim ölçümü'],['capillary','Kılcallık karşılaştırması']],intro:[['vectors','Tek boyutta vektör'],['ruler','Cetvelle ölçüm']],heat:[['exchange','Temasla ısı alışverişi'],['rod','Genleşme gözlemi']]};
const state={topic:(new URLSearchParams(window.location.search).get('topic')||d.body.dataset.topic||'waves'),mode:'',playing:false,time:0,amplitude:36,end:'fixed',
water1:3,water2:1.5,waterY:280,sourceX:250,theta:30,soundA:20,soundF:2,soundMedium:'air',
waterMl:150,selectedObject:1,objects:[{id:1,x:120,y:350,volumeMl:50,massG:100,height:50,inside:false},{id:2,x:235,y:350,volumeMl:80,massG:120,height:50,inside:false},{id:3,x:345,y:350,volumeMl:30,massG:90,height:50,inside:false}],
radius1:2,radius2:5,wetting:'yes',a:3,b:-2,rulerA:2,rulerB:7,
aMass:2,bMass:2,aCapacity:1,bCapacity:1,aInitial:80,bInitial:20,aTemp:80,bTemp:20,blockX:155,heatOn:true,heatQ:0,
rodTemp:20,rodMaterial:'steel'};
if(!modes[state.topic])state.topic='waves';state.mode=modes[state.topic][0][0];
let moving=null,lastFrame=0;
const shape=(name,attrs,content='')=>'<'+name+' '+attrs+'>'+content+'</'+name+'>';
const rect=(x,y,w,h,fill,attrs='')=>'<rect x="'+x+'" y="'+y+'" width="'+Math.max(1,w)+'" height="'+Math.max(1,h)+'" fill="'+fill+'" '+attrs+'/>';
const circle=(x,y,r,fill,attrs='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" '+attrs+'/>';
const line=(x1,y1,x2,y2,color='#a0dfea',width=3,attr='')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+width+'" '+attr+'/>';
const text=(x,y,t,size=18,color='#eaf6fb')=>shape('text','x="'+x+'" y="'+y+'" font-size="'+size+'" font-family="system-ui" fill="'+color+'"',String(t));
const arrowDef='<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#f7c88e"/></marker></defs>';
const input=(key,label,min,max,step,unit='')=>'<label>'+label+' <output data-output="'+key+'">'+fmt(state[key])+'</output> '+unit+'<input type="range" data-key="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+state[key]+'"></label>';
const select=(key,label,choices)=>'<label>'+label+'<select data-key="'+key+'">'+choices.map(([val,label])=>'<option value="'+val+'" '+(state[key]===val?'selected':'')+'>'+label+'</option>').join('')+'</select></label>';
const button=(key,label)=>'<button type="button" data-action="'+key+'">'+label+'</button>';
function controls(){
 el('topics').innerHTML=Object.entries(topicNames).map(([name,title])=>'<button data-topic="'+name+'" aria-pressed="'+(state.topic===name)+'">'+title+'</button>').join('');
 el('modes').innerHTML=modes[state.topic].map(([key,name])=>'<button data-mode="'+key+'" aria-pressed="'+(state.mode===key)+'">'+name+'</button>').join('');
 let c='';
 if(state.topic==='waves'&&state.mode==='spring')c=input('amplitude','Atma genliği (yukarı +, aşağı −)',-65,65,5)+select('end','Yayın ucu',[['fixed','Sabit uç'],['free','Serbest uç']])+button('send-pulse','Atma gönder')+button('play-pause',state.playing?'Durdur':'Oynat');
 if(state.topic==='waves'&&state.mode==='water')c=input('theta','Geliş açısı (normale göre)',0,55,1,'°')+input('water1','1. bölge derinliği',0.5,5,0.5,'göreli birim')+input('water2','2. bölge derinliği',0.5,5,0.5,'göreli birim');
 if(state.topic==='waves'&&state.mode==='sound')c=input('soundA','Titreşim genliği',0,35,5,'görsel birim')+input('soundF','Frekans',1,4,1,'göreli birim')+select('soundMedium','Ortam',[['air','Hava (tanecik modeli)'],['vacuum','Boşluk (ses yayılmaz)']])+button('play-pause',state.playing?'Durdur':'Oynat');
 if(state.topic==='matter'&&state.mode==='cylinder'){const o=state.objects.find(o=>o.id===state.selectedObject);c=input('waterMl','İlk sıvı hacmi',100,230,10,'mL');if(o)c+='<label>Seçili cismin kütlesi <output data-output="massG">'+fmt(o.massG)+'</output> g<input data-key="massG" type="range" min="20" max="300" step="10" value="'+o.massG+'"></label><label>Seçili cismin hacmi <output data-output="volumeMl">'+fmt(o.volumeMl)+'</output> cm³<input data-key="volumeMl" type="range" min="20" max="100" step="10" value="'+o.volumeMl+'"></label>';c+=button('reset-objects','Cisimleri çıkar');}
 if(state.topic==='matter'&&state.mode==='capillary')c=input('radius1','Sol borunun yarıçapı',1,6,0.5,'göreli')+input('radius2','Sağ borunun yarıçapı',1,6,0.5,'göreli')+select('wetting','Sıvı-yüzey etkileşimi',[['yes','Islatan sıvı (yükselme)'],['no','Islatmayan sıvı (alçalma)']]);
 if(state.topic==='intro'&&state.mode==='vectors')c=input('a','A vektörü',-5,5,1,'birim')+input('b','B vektörü',-5,5,1,'birim');
 if(state.topic==='intro'&&state.mode==='ruler')c=input('rulerA','Başlangıç işareti',0,10,0.5,'cm')+input('rulerB','Bitiş işareti',0,10,0.5,'cm');
 if(state.topic==='heat'&&state.mode==='exchange')c=input('aInitial','A başlangıç sıcaklığı',20,100,5,'°C')+input('bInitial','B başlangıç sıcaklığı',0,80,5,'°C')+input('aMass','A kütlesi',1,5,0.5,'kg')+input('bMass','B kütlesi',1,5,0.5,'kg')+button('heat-reset','Başlangıç değerlerini uygula')+button('heat-toggle',state.heatOn?'Isı akışını duraklat':'Isı akışını sürdür');
 if(state.topic==='heat'&&state.mode==='rod')c=input('rodTemp','Metal sıcaklığı',-20,120,5,'°C')+select('rodMaterial','Malzeme',[['steel','Çelik'],['aluminum','Alüminyum'],['brass','Pirinç']]);
 el('controls').innerHTML=c;
 el('heading').textContent=topicNames[state.topic]+' · '+modes[state.topic].find(x=>x[0]===state.mode)[1];
}
function waveSpring(){
 let b=arrowDef+line(100,235,790,235,'#5e8193',2)+line(780,110,780,365,'#e3c498',6);
 const points=[];for(let x=100;x<=780;x+=4){const v=M.pulse(x-100,state.time,{length:680,start:90,speed:140,width:46,amplitude:state.amplitude,end:state.end});points.push(x+','+(235-v.displacement));}
 b+=shape('polyline','points="'+points.join(' ')+'" stroke="#9fe4d4" stroke-width="5" fill="none"');
 b+=circle(100,235-state.amplitude,14,'#fbd59e','data-drag="wave-amplitude"')+text(110,74,'Kaynağı yukarı/aşağı sürükle · atma gönder')+text(590,92,state.end==='fixed'?'Sabit uç: ters yansıma':'Serbest uç: düz yansıma');
 const incoming=M.pulse(680,state.time,{length:680,start:90,speed:140,width:46,amplitude:state.amplitude,end:state.end});
 return{b,result:'Uçtaki toplam yer değiştirme: '+fmt(incoming.displacement)+' görsel birim · t='+fmt(state.time)+' s',note:'İdeal, küçük genlikli enine atma: uçtaki gelen ve yansıyan atmalar üst üste biner. Sabit uçta toplam yer değiştirme sıfırdır, serbest uçta atma ters dönmeden yansır. Yayı oluşturan tanecikler dalgayla birlikte uzağa taşınmaz.'};
}
function waveWater(){
 const theta=state.theta*Math.PI/180,y=state.waterY,sx=state.sourceX,sy=115,ix=sx+(y-sy)*Math.tan(theta),r=M.refract(state.theta,state.water1,state.water2);
 let b=arrowDef+rect(80,70,745,y-70,'#1b7089','opacity=".65"')+rect(80,y,745,440-y,'#10527b','opacity=".80"')+line(80,y,825,y,'#ffe0ae',5,'data-drag="water-boundary"');
 const tx=r.totalReflection?ix+(y-120)*Math.tan(theta):ix+(430-y)*Math.tan(r.theta2*Math.PI/180),ty=r.totalReflection?120:430;
 b+=line(ix,90,ix,450,'#90bac8',2,'stroke-dasharray="6 8"')+line(sx,sy,ix,y,'#fbd68e',5,'marker-end="url(#arr)"')+line(ix,y,tx,ty,r.totalReflection?'#fc9f9f':'#a6f9d9',5,'marker-end="url(#arr)"');
 b+=circle(sx,sy,16,'#fff0c0','data-drag="water-source"')+circle(ix,y,15,'#f8b7a0','data-drag="water-boundary"')+text(93,98,'Bölge 1: h='+fmt(state.water1))+text(93,428,'Bölge 2: h='+fmt(state.water2));
 return{b,result:r.totalReflection?'Kırılan ilerleyen ışın yok: tam yansıma sınırı (ideal dalga modeli)':'Geliş açısı '+fmt(state.theta)+'° · Kırılma açısı '+fmt(r.theta2)+'°',note:'Dalgalar farklı derinliklerde farklı hızla ilerler. Sığ su uzun dalgası yaklaşımında hızın karekök(derinlik) ile değiştiği ideal model gösterilir. Derinlik azalınca dalga normale yaklaşır; frekansı sınırda değişmez. Kaynağı yatay, sınır çizgisini düşey sürükle. Akıntı, saçılma ve yüzey dalgasının tam dispersiyonu modellenmez.'};
}
function waveSound(){
 let b=rect(80,135,735,230,'#123e55','rx="12" stroke="#456e80" stroke-width="3"')+text(110,87,state.soundMedium==='vacuum'?'Boşlukta ses iletimi yok':'Tanecikler denge konumunda ileri–geri titreşir');
 b+=rect(80,195,14,120,'#ffe0a2','rx="5" data-drag="sound-amplitude"');
 if(state.soundMedium==='air'){for(let y=177;y<=335;y+=30)for(let x=120;x<=780;x+=17){const xp=M.longitudinal(x,state.time,{amplitude:state.soundA,wavelength:140,frequency:state.soundF});b+=circle(xp,y,3.5,'#85e7ef');}}
 else b+=text(300,245,'Ortam taneciği yok → ses yayılmaz',21,'#ffe09f');
 return{b,result:'Genlik: '+fmt(state.soundA)+' görsel birim · Frekans: '+fmt(state.soundF)+' göreli',note:'Ses mekanik ve boyuna dalgadır. İşaretlenen noktalar ortamın titreşen tanecikleridir; tanecikler kaynaktan alıcıya taşınmaz. Boşlukta ses yayılamaz. Temsilî genlik ve frekans değerleri gerçek dB/Hz ölçümü değildir.'};
}
function matterCylinder(){
 const items=state.objects.map(o=>({...o,inside:o.x>525&&o.x<748&&o.y>100&&o.y<415}));
 const v=M.displacement(items,{waterMl:state.waterMl});
 let b=arrowDef+rect(502,78,260,340,'#254a59','rx="15" stroke="#acd6e8" stroke-width="4"')+rect(506,v.level,252,415-v.level,'#2084ad','opacity=".82"')+line(506,v.level,758,v.level,'#b2efff',4);
 for(let ml=0;ml<=500;ml+=50){const y=408-ml*318/500;b+=line(510,y,532,y,'#e3eef8',2)+text(452,y+5,ml,14);}
 for(const o of state.objects){const selected=o.id===state.selectedObject;const volScale=44+o.volumeMl*.28;
 b+=rect(o.x,o.y,volScale,o.height,'#eec28d','rx="6" stroke="'+(selected?'#fff':'#425f7c')+'" stroke-width="4" data-drag="matter-'+o.id+'"')+text(o.x+5,o.y+24,'#'+o.id+' '+fmt(o.volumeMl,0),15);}
 b+=text(108,78,'Cisimleri silindire taşı, sonra geri çıkar');
 return{b,result:'Başlangıç: '+fmt(state.waterMl)+' mL · Ölçek okuması: '+fmt(v.readingMl)+' mL · Yer değiştiren sıvı: '+fmt(v.displacedMl)+' mL · '+state.objects.map(o=>'Cisim '+o.id+': ρ='+fmt(M.density(o.massG,o.volumeMl))+' g/cm³').join(' | '),note:'Mavi seviye, silindirdeki sıvı hacmi ile cisimlerin batmış hacminden hesaplanır. Her cisim, seçilen hacmi olan dik prizma gibi ve elle tutuluyor kabul edilir; kendiliğinden yüzme/batma modellenmez. Tam batmış bir cismin hacmi, mL artışıyla cm³ cinsinden aynıdır (1 mL = 1 cm³). Kısmen batırmada yalnız batmış kısmın hacmi ölçülür.'};
}
function matterCapillary(){
 const wet=state.wetting==='yes';let b=rect(145,320,615,105,'#146c93','opacity=".8"')+line(145,320,760,320,'#a9e4ff',4);
 for(let i=0;i<2;i++){const x=i===0?315:575,r=i===0?state.radius1:state.radius2,w=15+15*r;
 const h=M.capillary(r,wet)*2,level=320-h; b+=rect(x-w/2,110,w,255,'#1b3544','stroke="#b4dae9" stroke-width="4" rx="6"');
 b+=rect(x-w/2+4,level,w-8,365-level,'#1785a8','opacity=".9"')+line(x-w/2+4,level,x+w/2-4,level,'#a3f7e4',4);
 b+=circle(x+w/2,110,11,'#f8c588','data-drag="cap-'+(i+1)+'"')+text(x-74,78,'Boru '+(i+1)+' · r='+fmt(r));}
 return{b,result:'Sol göreli seviye farkı: '+fmt(M.capillary(state.radius1,wet))+' · Sağ: '+fmt(M.capillary(state.radius2,wet)),note:'Kılcallıkta boru daraldıkça seviye değişimi büyür. Islatan sıvıda yükselme, ıslatmayan sıvıda alçalma görülür. Çizim göreli bir modeldir: gerçek kılcal yükselme; yüzey gerilimi, temas açısı, özkütle ve yerçekimine de bağlıdır. Noktalardan boru genişliğini sürükle.'};
}
function introVectors(){
 let b=arrowDef+line(95,200,805,200,'#6b90a2',3);for(let k=-10;k<=10;k++){const x=450+k*33;b+=line(x,195,x,205,'#cce4f3',2);if(k%2===0)b+=text(x-10,224,k,13);}
 const make=(val,y,color,drag)=>{const x1=450,x2=450+val*33;return line(x1,y,x2,y,color,6,'marker-end="url(#arr)"')+circle(x2,y,13,color,'data-drag="'+drag+'"');};
 b+=make(state.a,130,'#8be5dd','vector-a')+make(state.b,275,'#fdc792','vector-b')+make(state.a+state.b,355,'#f7a1c4','vector-result');
 b+=text(110,92,'A ve B ok uçlarını yatay sürükle')+text(85,132,'A')+text(85,278,'B')+text(85,355,'R');
 const v=M.vector1d(state.a,state.b);
 return{b,result:'A = '+fmt(state.a)+' · B = '+fmt(state.b)+' · Bileşke = '+fmt(v.result)+' · Büyüklük = '+fmt(v.magnitude)+' · Yön = '+v.direction,note:'2018 MEB 9.1: yalnız tek boyutta işaretli vektör toplama. Okların tamamı aynı ölçekli eksende çizilir. Bileşke negatifse sola yönelir; sıfırsa yönü yoktur. İşaret yönü, büyüklük ise negatif olmayan sayıyı ifade eder.'};
}
function introRuler(){
 let b=rect(120,200,665,100,'#d5bf88','rx="6" stroke="#ffe8ac" stroke-width="3"');
 for(let cm=0;cm<=10;cm++){const x=155+cm*59;b+=line(x,202,x,cm%2===0?244:232,'#384557',3)+text(x-7,271,cm,15,'#142938');}
 const a=155+state.rulerA*59,bx=155+state.rulerB*59;
 b+=line(a,145,a,311,'#7beddf',4)+line(bx,145,bx,311,'#ffc58a',4)+circle(a,145,16,'#7beddf','data-drag="ruler-a"')+circle(bx,145,16,'#ffc58a','data-drag="ruler-b"');
 b+=text(180,86,'Cetvel uçlarını sürükle. Uzunluk işaret farkının mutlak değeridir.');
 const len=M.measureCm(state.rulerA,state.rulerB);
 return{b,result:'İşaretler: '+fmt(state.rulerA)+' ve '+fmt(state.rulerB)+' cm · Uzunluk: '+fmt(len)+' cm = '+fmt(len/100,4)+' m = '+fmt(len*10)+' mm',note:'Birimi cm olan cetvelde uzunluk iki işaretin farkının mutlak değeridir. SI uzunluk birimi metredir. Ölçümde sıfır noktası mutlak olarak gerekli değildir; başlangıç ve bitiş okumasının farkı gerekir. Cetveldeki görsel ölçek sabittir.'};
}
function heatExchange(){
 const x=state.blockX,contact=x+175>=590;let b=rect(85,340,735,24,'#758fa0')+rect(x,165,175,175,'#bf7853','rx="12" stroke="#ffd8b1" stroke-width="4" data-drag="heat-a"')+rect(590,165,175,175,'#509cb1','rx="12" stroke="#cff1ff" stroke-width="4"');
 b+=text(x+24,222,'A: '+fmt(state.aTemp)+'°C')+text(614,222,'B: '+fmt(state.bTemp)+'°C')+text(160,83,'A bloğunu B’ye sürükleyerek temas ettir');
 if(contact)b+=line(540,130,588,130,'#ffe4a0',5,'marker-end="url(#arr)"')+text(350,117,'Termal temas');
 const final=M.equilibrium({aTemp:state.aInitial,bTemp:state.bInitial,aMass:state.aMass,bMass:state.bMass});
 return{b:arrowDef+b,result:'A: '+fmt(state.aTemp)+'°C · B: '+fmt(state.bTemp)+'°C · İdeal denge: '+fmt(final)+'°C · Q(A→B)='+fmt(state.heatQ)+' temsilî J'+(contact?' · Temas var':' · Temas yok'),note:'İki cisim dış ortamdan yalıtılmış, hâl değişimi olmayan ve sıcaklık başına sabit ısı sığaları eşit örnek maddelerdir. Temas ettiğinde ısı sıcak olandan soğuk olana akar; iç enerji aktarımı eşittir, son sıcaklıklar dengeye yaklaşır. Q işaretlidir: A soğursa pozitif, A ısınırsa negatif. Sürükleme ya da başlangıç ayarları deneyi değiştirir.'};
}
function heatRod(){
 const alpha={steel:12,aluminum:23,brass:19}[state.rodMaterial],ratio=1+alpha*1e-6*(state.rodTemp-20),exaggerated=1+(ratio-1)*100;
 let b=rect(160,215,570*exaggerated,75,'#b5af9c','rx="12" stroke="#eff5f2" stroke-width="3"')+rect(160,195,5,120,'#f9d2a6');
 b+=line(730,120,730,355,'#8ce8e2',3,'stroke-dasharray="8 7"')+text(165,80,'Başlangıç boyu: 570 görsel birim · referans 20 °C');
 return{b,result:'Sıcaklık '+fmt(state.rodTemp)+'°C · Uzama eğilimi: '+(ratio>1?'uzama':ratio<1?'kısalma':'değişim yok')+' · Ölçek büyütmesi 100×',note:'Metal çubuğun gerçek boy değişimi çok küçüktür, bu yüzden görsel fark 100 kat büyütülür. Çizilen uzunluk doğrudan gerçek boy değildir. Katsayılar yalnız eğilim ve karşılaştırma için iç hesapta kullanılır; 2018 TYT genleşme kapsamında sayısal soru amaçlanmaz.'};
}
function scene(){
 const data=state.topic==='waves'?(state.mode==='spring'?waveSpring():state.mode==='water'?waveWater():waveSound()):
 state.topic==='matter'?(state.mode==='cylinder'?matterCylinder():matterCapillary()):
 state.topic==='intro'?(state.mode==='vectors'?introVectors():introRuler()):
 state.mode==='exchange'?heatExchange():heatRod();
 el('scene').innerHTML=rect(0,0,900,500,'#0b2538')+data.b;
 el('result').textContent=data.result;el('explain').textContent=data.note;
}
function render(){controls();scene();}
function resetHeat(){state.aTemp=state.aInitial;state.bTemp=state.bInitial;state.heatQ=0;state.blockX=155;}
function playNeeded(){if(state.topic==='waves'&&(state.mode==='spring'||state.mode==='sound'))state.playing=true;}
el('topics').addEventListener('click',e=>{const t=e.target.closest('[data-topic]');if(!t)return;state.topic=t.dataset.topic;state.mode=modes[state.topic][0][0];state.playing=false;state.time=0;render();});
el('modes').addEventListener('click',e=>{const t=e.target.closest('[data-mode]');if(!t)return;state.mode=t.dataset.mode;state.playing=false;state.time=0;render();});
el('controls').addEventListener('click',e=>{const action=e.target.dataset.action;if(!action)return;
 if(action==='send-pulse'){state.time=0;state.playing=true;}
 if(action==='play-pause')state.playing=!state.playing;
 if(action==='reset-objects'){state.objects.forEach((o,i)=>{o.x=120+i*112;o.y=350;o.inside=false;});}
 if(action==='heat-reset')resetHeat();
 if(action==='heat-toggle')state.heatOn=!state.heatOn;
 render();});
function applyInput(e){const key=e.target.dataset.key;if(!key)return;const value=e.target.type==='range'?Number(e.target.value):e.target.value;
 if(key==='massG'||key==='volumeMl'){const o=state.objects.find(o=>o.id===state.selectedObject);if(o)o[key]=value;}
 else state[key]=value;
 const output=el('controls').querySelector('[data-output="'+key+'"]');if(output)output.textContent=fmt(value);
 scene();}
el('controls').addEventListener('input',applyInput);el('controls').addEventListener('change',applyInput);
function coords(e){const b=el('scene').getBoundingClientRect();return{x:(e.clientX-b.left)*900/b.width,y:(e.clientY-b.top)*500/b.height};}
el('scene').addEventListener('pointerdown',e=>{
 const t=e.target.closest('[data-drag]');if(!t)return;
 const key=t.dataset.drag;moving={key,pointer:e.pointerId};
 if(key.startsWith('matter-')){state.selectedObject=Number(key.slice(7));controls();}
 el('scene').setPointerCapture?.(e.pointerId);e.preventDefault();});
el('scene').addEventListener('pointermove',e=>{if(!moving||moving.pointer!==e.pointerId)return;const p=coords(e),key=moving.key;
 if(key==='wave-amplitude'){state.amplitude=Math.round(clamp((235-p.y)/5,-13,13))*5;state.time=0;}
 if(key==='water-source'){state.sourceX=clamp(p.x,115,430);}
 if(key==='water-boundary'){state.waterY=clamp(p.y,205,345);}
 if(key==='sound-amplitude'){state.soundA=clamp(Math.round((p.x-80)/5)*5,0,35);}
 if(key.startsWith('matter-')){const o=state.objects.find(o=>o.id===Number(key.slice(7)));if(o){o.x=clamp(p.x-26,80,810);o.y=clamp(p.y-25,90,420);}}
 if(key==='cap-1')state.radius1=clamp(Math.round((p.x-315-7.5)/7.5*2)/2,1,6);
 if(key==='cap-2')state.radius2=clamp(Math.round((p.x-575-7.5)/7.5*2)/2,1,6);
 if(key==='vector-a')state.a=clamp(Math.round((p.x-450)/33),-5,5);
 if(key==='vector-b')state.b=clamp(Math.round((p.x-450)/33),-5,5);
 if(key==='vector-result')state.b=clamp(Math.round((p.x-450)/33)-state.a,-5,5);
 if(key==='ruler-a')state.rulerA=clamp(Math.round((p.x-155)/29.5)/2,0,10);
 if(key==='ruler-b')state.rulerB=clamp(Math.round((p.x-155)/29.5)/2,0,10);
 if(key==='heat-a')state.blockX=clamp(p.x-90,110,415);
 scene();e.preventDefault();});
['pointerup','pointercancel','lostpointercapture'].forEach(type=>el('scene').addEventListener(type,e=>{if(moving&&moving.pointer===e.pointerId){moving=null;controls();}}));
function frame(now){const dt=lastFrame?Math.min((now-lastFrame)/1000,.08):0;lastFrame=now;
 if(state.playing&&state.topic==='waves'){state.time+=dt;if(state.mode==='spring'&&state.time>10){state.playing=false;controls();}}
 if(state.topic==='heat'&&state.mode==='exchange'&&state.heatOn&&state.blockX+175>=590&&dt>0){
 const old=state.aTemp,after=M.heatStep({aTemp:state.aTemp,bTemp:state.bTemp,aMass:state.aMass,bMass:state.bMass,aCapacity:1,bCapacity:1},dt,1.1);
 state.aTemp=after.aTemp;state.bTemp=after.bTemp;state.heatQ+=(old-after.aTemp)*state.aMass;}
 if((state.playing&&state.topic==='waves')||(state.topic==='heat'&&state.mode==='exchange'&&state.blockX+175>=590&&state.heatOn))scene();
 requestAnimationFrame(frame);}
render();requestAnimationFrame(frame);
})(document,window.TYTFourWorkshopModel);