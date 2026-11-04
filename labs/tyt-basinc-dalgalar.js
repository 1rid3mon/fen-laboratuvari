(function(d){'use strict';
const tabs=[['solid','Katı basıncı'],['liquid','Sıvı basıncı'],['buoyancy','Kaldırma kuvveti'],['spring','Yay dalgaları'],['water','Su dalgaları'],['sound','Ses dalgaları']];
const s={tab:'solid',force:60,area:3,depth:3,density:1000,volume:3,bodyDensity:750,amplitude:34,frequency:2,speed:2,phase:0,playing:false};let drag=null,raf=0,last=0;
const $=id=>d.getElementById(id),fmt=(x)=>Number(x).toLocaleString('tr-TR',{maximumFractionDigits:2}),clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),G=10;
function shape(tag,attrs){return '<'+tag+' '+Object.entries(attrs).map(([k,v])=>k+'="'+v+'"').join(' ')+'/>';}
function txt(x,y,v,size=20){return '<text x="'+x+'" y="'+y+'" fill="#f1f8fa" font-size="'+size+'" font-family="system-ui">'+v+'</text>';}
function arrow(x,y,dx,dy,color='#f8b874'){const X=x+dx,Y=y+dy,a=Math.atan2(dy,dx);return shape('line',{x1:x,y1:y,x2:X,y2:Y,stroke:color,'stroke-width':5})+shape('polygon',{points:[X,Y,X-13*Math.cos(a-.45),Y-13*Math.sin(a-.45),X-13*Math.cos(a+.45),Y-13*Math.sin(a+.45)].map((v,i)=>i%2===0?v+',' : v+' ').join(''),fill:color});}
function control(key,label,min,max,step){return '<label>'+label+' <strong id="'+key+'-out">'+fmt(s[key])+'</strong><input type="range" data-key="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[key]+'"></label>';}
function draw(){
 let b=shape('rect',{x:0,y:0,width:900,height:470,fill:'#0c2538'}),stat='',info='';
 if(s.tab==='solid'){
 const width=60+s.area*28,height=120,y=355-height,x=450-width/2,p=s.force/s.area;
 b+=shape('rect',{x:70,y:355,width:760,height:13,fill:'#7c8d99'})+shape('rect',{x,y,width,height,rx:6,fill:'#438fc0',stroke:'#b7e9fb','stroke-width':3,'data-drag':'area'});
 b+=arrow(450,y-65,0,55,'#ffbf81')+txt(480,y-34,'F = '+fmt(s.force)+' N');
 for(let i=0;i<Math.max(1,Math.round(s.area));i++)b+=arrow(x+width*(i+.5)/Math.round(s.area),356,0,Math.min(65,p*2),'#90e6d7');
 stat='P = F/A = '+fmt(p)+' N/birim² (temsili alan ölçeği)';info='Aynı kuvvette temas alanı büyürse katı basıncı azalır. Mavi cismi yatay sürükleyerek temas alanını değiştir.';
 }else if(s.tab==='liquid'){
 const waterY=90,h=320,dy=s.depth/8*h,yy=waterY+dy,pressure=s.density*G*s.depth;
 b+=shape('rect',{x:175,y:waterY,width:540,height:h,fill:'#126e91','fill-opacity':.75,stroke:'#b8e5ef','stroke-width':3});
 b+=shape('circle',{cx:450,cy:yy,r:19,fill:'#ffc67e','data-drag':'depth'})+arrow(450,yy,Math.min(160,pressure/300),0);
 b+=txt(225,70,'Yüzey')+txt(500,yy-22,'h = '+fmt(s.depth)+' m');
 stat='Sıvı basıncı ρgh = '+fmt(pressure)+' Pa';info='Derinlik ve yoğunluk arttıkça basınç artar. Turuncu probu aşağı/yukarı sürükle. Kabın şekli basıncı değiştirmez.';
 }else if(s.tab==='buoyancy'){
 const waterY=180,vol=s.volume/10,bodyH=100+vol*160,bodyW=125,weight=s.bodyDensity*G*s.volume/1000,ratio=s.bodyDensity/s.density,immersedVolume=s.volume*clamp(ratio,0,1),up=s.density*G*immersedVolume/1000;
 const immersed=clamp(ratio,0,1),bodyY=ratio<1?waterY-bodyH*(1-immersed):ratio===1?waterY+55:waterY+235-bodyH;
 b+=shape('rect',{x:150,y:waterY,width:600,height:235,fill:'#126e91','fill-opacity':.75});
 b+=shape('rect',{x:400,y:bodyY,width:bodyW,height:bodyH,fill:'#ddae78',stroke:'#ffe2bd','stroke-width':3,'data-drag':'bodyDensity'});
 b+=arrow(560,bodyY+bodyH/2,0,80,'#f6b280')+arrow(360,bodyY+bodyH/2,0,-80,'#9af4db');
 stat=(ratio<1?'Yüzer · batan hacim oranı ≈ '+fmt(immersed*100)+'%':ratio===1?'Askıda kalır':'Batar')+' · Ağırlık '+fmt(weight)+' N · dengedeki kaldırma '+fmt(up)+' N';
 info='Arşimet ilkesi: kaldırma kuvveti yer değiştiren sıvının ağırlığıdır. Batan cisimde tabana değmeden önceki kaldırma kuvveti hesaplanır; tabanın tepki kuvveti çizilmemiştir. Cismi dikey sürükleyerek yoğunluğunu değiştir.';
 }else if(s.tab==='spring'||s.tab==='water'){
 const water=s.tab==='water',baseline=235,amp=s.amplitude,f=s.frequency,phase=s.phase;
 if(water)b+=shape('rect',{x:65,y:baseline,width:770,height:165,fill:'#145a78','fill-opacity':.45});
 let pts=[];for(let x=70;x<=830;x+=5){const y=baseline-amp*Math.sin((x-70)/760*f*Math.PI*2-phase);pts.push(x+','+y);}
 b+=shape('polyline',{points:pts.join(' '),fill:'none',stroke:water?'#78e5f4':'#f4cb8d','stroke-width':5});
 b+=shape('circle',{cx:260,cy:baseline-amp*Math.sin(190/760*f*Math.PI*2-phase),r:13,fill:'#fff0ac'});
 b+=txt(95,75,water?'Su yüzeyinde dalga':'Enine yay dalgası');
 stat='Dalga boyu görsel ölçek: '+fmt(760/s.frequency)+' px';info='Genliği artır: tepe/çukur yüksekliği değişir. Frekansı artır: aynı uzunluğa daha fazla dalga sığar. Sarı nokta ortamın titreşimini gösterir; dalgayla beraber sağa taşınmaz.';
 }else{
 let b2='';for(let x=105;x<800;x+=12){const displacement=s.amplitude*Math.sin((x-105)/760*s.frequency*Math.PI*2-s.phase);b2+=shape('circle',{cx:x+displacement*.45,cy:235,r:5,fill:'#91e9f0'});}
 b+=b2+txt(95,70,'Boyuna ses dalgası: sıkışma ve seyrelme');
 stat='Ses dalgası: boyuna titreşim · frekans = '+fmt(s.frequency)+' görsel kademe';info='Tanecikler denge konumları çevresinde ileri–geri titreşir; ses enerjisi ilerler, ortam bütünüyle taşınmaz. Boşlukta ses yayılmaz.';
 }
 $('scene').innerHTML=b;$('stats').textContent=stat;$('explain').textContent=info;
}
function controls(){
 const map={solid:[['force','Kuvvet (N)',10,120,5],['area','Temas alanı (birim)',1,10,1]],liquid:[['depth','Derinlik (m)',0,8,.5],['density','Sıvı yoğunluğu (kg/m³)',500,1400,50]],buoyancy:[['bodyDensity','Cisim yoğunluğu (kg/m³)',300,1600,50],['density','Sıvı yoğunluğu (kg/m³)',500,1400,50],['volume','Cisim hacmi (L)',1,8,1]],spring:[['amplitude','Genlik',5,80,5],['frequency','Frekans (görsel)',1,6,1]],water:[['amplitude','Genlik',5,80,5],['frequency','Frekans (görsel)',1,6,1]],sound:[['amplitude','Titreşim genliği',5,80,5],['frequency','Frekans (görsel)',1,6,1]]};
 $('controls').innerHTML=map[s.tab].map(a=>control(...a)).join('')+( ['spring','water','sound'].includes(s.tab)?'<button id="play">'+(s.playing?'Durdur':'▶ Oynat')+'</button>':'');
}
function render(){ $('tabs').innerHTML=tabs.map(([id,name])=>'<button data-tab="'+id+'" aria-pressed="'+(id===s.tab)+'">'+name+'</button>').join('');controls();draw();}
$('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t){s.tab=t.dataset.tab;s.playing=false;last=0;render();}});
$('controls').addEventListener('input',e=>{const key=e.target.dataset.key;if(key in s){s[key]=Number(e.target.value);const out=$(key+'-out');if(out)out.textContent=fmt(s[key]);draw();}});
$('controls').addEventListener('click',e=>{if(e.target.id==='play'){s.playing=!s.playing;controls();if(s.playing){last=0;requestAnimationFrame(tick);}}});
function tick(now){if(!s.playing)return;if(last)s.phase+=(now-last)/1000*s.speed*2*Math.PI;last=now;draw();requestAnimationFrame(tick);}
function pos(e){const r=$('scene').getBoundingClientRect();return {x:(e.clientX-r.left)*900/r.width,y:(e.clientY-r.top)*470/r.height};}
$('scene').addEventListener('pointerdown',e=>{const target=e.target.closest('[data-drag]');if(!target)return;drag={key:target.getAttribute('data-drag'),pointer:e.pointerId,start:pos(e),base:s[target.getAttribute('data-drag')]};$('scene').setPointerCapture?.(e.pointerId);e.preventDefault();});
$('scene').addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer)return;const p=pos(e),dx=p.x-drag.start.x,dy=p.y-drag.start.y;
 if(drag.key==='area')s.area=clamp(Math.round(drag.base+dx/28),1,10);
 if(drag.key==='depth')s.depth=clamp(Math.round((drag.base+dy/40)*2)/2,0,8);
 if(drag.key==='bodyDensity')s.bodyDensity=clamp(Math.round((drag.base+dy*3)/50)*50,300,1600);
 const slider=d.querySelector('[data-key="'+drag.key+'"]');if(slider){slider.value=s[drag.key];$(drag.key+'-out').textContent=fmt(s[drag.key]);}draw();e.preventDefault();});
for(const type of ['pointerup','pointercancel'])$('scene').addEventListener(type,e=>{if(drag&&drag.pointer===e.pointerId)drag=null;});
render();
})(document);