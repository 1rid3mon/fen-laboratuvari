(function(d){'use strict';
const $=id=>d.getElementById(id),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2}),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),g=10;
const s={tab:'liquid',rho:1000,depth:2,gasP:100,gasVolume:4,solidForce:60,solidArea:2,objects:[],selected:null,mode:'spring',end:'fixed',amp:35,phase:0,playing:false};let pointer=null,last=0,serial=0;
const rect=(x,y,w,h,fill,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" '+extra+'/>';
const txt=(x,y,v)=>'<text x="'+x+'" y="'+y+'" fill="#f0f9fc" font-size="19" font-family="system-ui">'+v+'</text>';
function add(){if(s.objects.length>=6)return;const i=serial++;s.objects.push({id:i,x:255+i%3*150,y:180+Math.floor(i/3)*75,rho:[500,1000,1500][i%3],volume:2});s.selected=i;render();}
function object(o){const side=50+o.volume*8,x=clamp(o.x,190,700-side),y=clamp(o.y,95,405-side);o.x=x;o.y=y;
const immersed=clamp((y+side-120)/side,0,1),weight=o.rho*g*o.volume/1000,buoy=s.rho*g*o.volume*immersed/1000;
return {svg:rect(x,y,side,side,['#ffd28c','#93d5ec','#f2a6b6'][o.id%3], 'rx="8" stroke="'+(s.selected===o.id?'#fff':'#31566a')+'" stroke-width="4" data-object="'+o.id+'"')+txt(x+8,y+27,'#'+(o.id+1)),weight,buoy,immersed};}
function render(){
$('tabs').innerHTML=[['liquid','Sıvı basıncı + çoklu cisim'],['solid','Katı basıncı'],['gas','Gaz basıncı'],['spring','Yay dalgası'],['water','Su dalgası'],['sound','Ses dalgası']].map(([id,t])=>'<button data-tab="'+id+'" aria-pressed="'+(s.tab===id)+'">'+t+'</button>').join('');
let b=rect(0,0,900,470,'#0c2538'),out='',note='',controls='';
const range=(key,name,min,max,step)=>'<label>'+name+': <strong>'+fmt(s[key])+'</strong><input type="range" data-key="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[key]+'"></label>';
if(s.tab==='liquid'){
controls='<button data-action="add">+ Cisim ekle (en fazla 6)</button><button data-action="remove">Seçileni kaldır</button>'+range('rho','Sıvı özkütlesi (kg/m³)',500,1400,50)+range('depth','Basınç probu derinliği (m)',0,5,.25);
const probeY=120+s.depth*54;b+=rect(175,120,565,290,'#166b91','fill-opacity=".78" stroke="#a9e5f0" stroke-width="4"')+'<circle cx="205" cy="'+probeY+'" r="13" fill="#fbe2a5" data-probe="true"/>';
let rows=[];for(const o of s.objects){const q=object(o);b+=q.svg;rows.push('#'+(o.id+1)+' Fg='+fmt(q.weight)+' N; Fk='+fmt(q.buoy)+' N (konuma göre)');}
out='Sıvı basıncı (gösterge) = ρgh = '+fmt(s.rho*g*s.depth)+' Pa. '+rows.join(' | ');
note='Cisimleri parmağınla sürükle, dokunarak seç. Cisimlerin konumları ayrı, basınç probu ayrı hareket eder. Fk = ρsıvı·g·Vbatan; cisimlerin konumları elle belirlenir, otomatik denge/çarpışma simülasyonu yoktur. Gösterilen batmış hacim, çizimdeki dik prizma kesitinin yaklaşık oranıdır; kabın su seviyesi sabittir. Üst üste binme ve kap duvarına temas kuvvetleri modellenmez.';
if(s.selected!==null){const o=s.objects.find(x=>x.id===s.selected);if(o)controls+='<label>Seçili cisim özkütlesi (kg/m³): <strong>'+fmt(o.rho)+'</strong><input type="range" data-key="selectedRho" min="300" max="1600" step="50" value="'+o.rho+'"></label>';}
}else if(s.tab==='solid'){
controls=range('solidForce','Yüzeye dik kuvvet (N)',10,200,5)+range('solidArea','Temas alanı (m²)',.5,5,.5);
b+=rect(130,340,650,18,'#8597a4')+rect(360,210,120+s.solidArea*30,130,'#5aa6cf','rx="7"');out='P = F/A = '+fmt(s.solidForce/s.solidArea)+' Pa';
note='Yatay zeminde yüzeye dik toplam kuvveti ve gerçek m² temas alanını değiştir. Bu bölüm ideal düzgün temas modelidir; cisimler arası yük aktarımı ayrıca geliştirilecektir.';
}else if(s.tab==='gas'){
controls=range('gasP','Başlangıç basıncı (kPa)',50,200,10)+range('gasVolume','Hacim (L)',2,8,.5);
b+=rect(230,125,450,245,'#234d65','stroke="#a2d7e5" stroke-width="4"')+rect(230+s.gasVolume*42,125,12,245,'#e2c185');
for(let i=0;i<25;i++){const x=245+(i*67)%(s.gasVolume*42-12),y=145+(i*43)%205;b+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#9fe7df"/>';}
out='İdeal sabit sıcaklık karşılaştırması: P = '+fmt(s.gasP*4/s.gasVolume)+' kPa (referans: V₀=4 L)';
note='Bu yalnız sabit sıcaklıkta, sabit miktarda ideal gaz için nitel ilişkiyi örnekleyen şemadır. Gaz tanecikleri gerçek zamanlı çarpışma fiziğiyle modellenmez; MEB TYT kapsamı dışında sayısal gaz yasası sorusu amaçlanmaz.';
}else{
controls=range('amp','Genlik (görsel birim)',5,65,5)+'<button data-action="play">'+(s.playing?'Durdur':'Oynat')+'</button>';
if(s.tab==='spring')controls+='<button data-action="end">Uç: '+(s.end==='fixed'?'Sabit':'Serbest')+'</button>';
const wave=s.tab==='spring',water=s.tab==='water',sound=s.tab==='sound';
let points=[];for(let x=75;x<=820;x+=6){const u=(x-75)/745,incident=s.amp*Math.exp(-Math.pow((u*745-200-s.phase*75)/95,2));const reflected=wave?(s.end==='fixed'?-1:1)*s.amp*Math.exp(-Math.pow((u*745-(1300-s.phase*75))/95,2)):0;points.push(x+','+(230-incident-reflected));}
if(sound){for(let x=95;x<810;x+=16){const dx=s.amp*.4*Math.sin(x/50-s.phase);b+='<circle cx="'+(x+dx)+'" cy="230" r="6" fill="#9ce5e9"/>';}}
else b+='<polyline points="'+points.join(' ')+'" stroke="'+(water?'#8ce5f4':'#ffd28b')+'" stroke-width="5" fill="none"/>';
out=wave?'Yay atması · '+(s.end==='fixed'?'Sabit uçta ters yansıma':'Serbest uçta düz yansıma'):water?'Su dalgası: atma profili (şematik)':'Ses: boyuna tanecik titreşimi (şematik)';
note=wave?'Yay ucundan yansıma işareti sabit uçta ters, serbest uçta düzdür. Bu sürüm, atma profilini ideal olarak gösterir; yay üzerindeki gerçek kütle ve gerilme çözümü değildir.':water?'Su yüzeyindeki atma temsili. Derinliğe bağlı hız, kırılma ve engel geometrisi henüz modellenmedi.':'Tanecikler denge konumları çevresinde titreşir; ses boşlukta yayılmaz. Bu gösterim gerçek gaz çarpışma simülasyonu değildir.';
}
$('controls').innerHTML=controls;$('scene').innerHTML=b;$('stats').textContent=out;$('explain').textContent=note;
}
$('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t){s.tab=t.dataset.tab;s.playing=false;render();}});
$('controls').addEventListener('click',e=>{const a=e.target.dataset.action;if(a==='add')add();if(a==='remove'){s.objects=s.objects.filter(o=>o.id!==s.selected);s.selected=null;render();}if(a==='end'){s.end=s.end==='fixed'?'free':'fixed';render();}if(a==='play'){s.playing=!s.playing;last=0;render();if(s.playing)requestAnimationFrame(tick);}});
$('controls').addEventListener('input',e=>{const k=e.target.dataset.key,v=Number(e.target.value);if(!Number.isFinite(v))return;if(k==='selectedRho'){const o=s.objects.find(o=>o.id===s.selected);if(o)o.rho=v;}else if(Object.hasOwn(s,k))s[k]=v;render();});
function position(e){const r=$('scene').getBoundingClientRect();return{x:(e.clientX-r.left)*900/r.width,y:(e.clientY-r.top)*470/r.height};}
$('scene').addEventListener('pointerdown',e=>{const id=e.target.getAttribute('data-object');if(id!==null){s.selected=Number(id);pointer={id:s.selected,p:e.pointerId};$('scene').setPointerCapture?.(e.pointerId);e.preventDefault();render();}else if(e.target.hasAttribute('data-probe')){pointer={probe:true,p:e.pointerId};$('scene').setPointerCapture?.(e.pointerId);e.preventDefault();}});
$('scene').addEventListener('pointermove',e=>{if(!pointer||pointer.p!==e.pointerId)return;const p=position(e);if(pointer.probe)s.depth=clamp((p.y-120)/54,0,5);else{const o=s.objects.find(o=>o.id===pointer.id);if(o){o.x=p.x-30;o.y=p.y-30;}}render();e.preventDefault();});
for(const event of ['pointerup','pointercancel'])$('scene').addEventListener(event,e=>{if(pointer&&pointer.p===e.pointerId)pointer=null;});
function tick(t){if(!s.playing)return;if(last)s.phase+=(t-last)/1000;last=t;render();requestAnimationFrame(tick);}
render();
})(document);