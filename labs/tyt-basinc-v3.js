(function(d,m){'use strict';
const $=id=>d.getElementById(id),fmt=(n,d=2)=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:d}),clamp=m.clamp;
const s={tab:'liquid',shape:'rect',tilt:0,fill:0.64,liquid:'water',probes:[{id:1,x:350,y:270},{id:2,x:550,y:270}],serial:2,
blocks:[{id:1,column:0,massKg:4,areaM2:2},{id:2,column:0,massKg:3,areaM2:1}],blockSerial:2,selectedBlock:1,
gasVolume:4,gasTemp:300,gasCount:80,gasPlay:false,phase:0,
bodies:[{id:1,x:260,y:195,rho:600,volume:2},{id:2,x:410,y:285,rho:1000,volume:2},{id:3,x:580,y:325,rho:1400,volume:2}],bodySerial:3,selectedBody:1,
melt:0,balloonVolume:2,balloonMass:0.03};
let drag=null,loopTime=0;
const svg=(tag,attrs='',content='')=>'<'+tag+' '+attrs+'>'+content+'</'+tag+'>';
const rect=(x,y,w,h,fill,more='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" '+more+'/>';
const text=(x,y,str,extra='')=>svg('text','x="'+x+'" y="'+y+'" fill="#ecf8ff" font-family="system-ui" font-size="17" '+extra,str);
const line=(x1,y1,x2,y2,color='#94ecdb',width=3,other='')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+width+'" '+other+'/>';
const polygon=(points,extra)=>svg('polygon','points="'+points.map(p=>p.x+','+p.y).join(' ')+'" '+extra);
const range=(field,label,min,max,step,unit='')=>'<label>'+label+' <output data-output="'+field+'">'+fmt(s[field])+'</output> '+unit+'<input data-field="'+field+'" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[field]+'"></label>';
const button=(action,title)=>'<button data-action="'+action+'" type="button">'+title+'</button>';
function controls(){
 const tabs=[['liquid','Sıvı / sensörler'],['solid','Katı / bloklar'],['gas','Gaz / piston'],['float','Kaldırma / cisimler'],['ice','Kapalı kap / buz / balon']];
 $('tabs').innerHTML=tabs.map(([k,t])=>'<button type="button" data-tab="'+k+'" aria-pressed="'+(s.tab===k)+'">'+t+'</button>').join('');
 let html='';
 if(s.tab==='liquid'){
 html='<label>Kap şekli<select data-field="shape">'+[['rect','Dik kap'],['topwide','Üste doğru genişleyen'],['bottomwide','Alta doğru genişleyen'],['slanted','Eğik yan duvarlı']].map(([k,t])=>'<option value="'+k+'" '+(s.shape===k?'selected':'')+'>'+t+'</option>').join('')+'</select></label>';
 html+='<label>Sıvı<select data-field="liquid">'+Object.entries(m.liquids).map(([k,v])=>'<option value="'+k+'" '+(s.liquid===k?'selected':'')+'>'+v.name+'</option>').join('')+'</select></label>';
 html+=range('tilt','Kabın eğimi',-12,12,2,'°')+range('fill','Doluluk oranı',0.3,0.8,0.05)+button('add-probe','+ Basınç sensörü ekle')+button('del-probe','Son sensörü sil');
 }else if(s.tab==='solid'){
 html+=button('add-block','+ Blok ekle')+button('del-block','Seçileni sil');
 const b=s.blocks.find(x=>x.id===s.selectedBlock);
 if(b)html+='<label>Seçili blok kütlesi <output data-output="blockMass">'+fmt(b.massKg)+'</output> kg<input data-field="blockMass" type="range" min="1" max="20" step="1" value="'+b.massKg+'"></label><label>Seçili blok temas alanı <output data-output="blockArea">'+fmt(b.areaM2)+'</output> m²<input data-field="blockArea" type="range" min="0.5" max="5" step="0.5" value="'+b.areaM2+'"></label>';
 }else if(s.tab==='gas'){
 html+=range('gasVolume','Piston hacmi',2,8,0.5,'L')+range('gasTemp','Sıcaklık',250,400,10,'K')+range('gasCount','Tanecik miktarı (göreli model)',40,160,20)+button('gas-play',s.gasPlay?'Tanecikleri durdur':'Tanecikleri hareket ettir');
 }else if(s.tab==='float'){
 html+=button('add-body','+ Cisim ekle')+button('del-body','Seçileni kaldır')+button('equilibrium','İdeal denge konumlarını göster');
 const b=s.bodies.find(x=>x.id===s.selectedBody);
 if(b)html+='<label>Seçili cisim özkütlesi <output data-output="bodyRho">'+fmt(b.rho)+'</output> kg/m³<input data-field="bodyRho" type="range" min="300" max="1600" step="50" value="'+b.rho+'"></label><label>Seçili cisim hacmi <output data-output="bodyVolume">'+fmt(b.volume)+'</output> L<input data-field="bodyVolume" type="range" min="1" max="6" step="1" value="'+b.volume+'"></label>';
 }else if(s.tab==='ice'){
 html+=range('melt','Buzun erime yüzdesi',0,100,5,'%')+range('balloonVolume','Balon hacmi',1,4,0.5,'L')+range('balloonMass','Balon + gaz kütlesi',0.01,0.12,0.01,'kg');
 }
 $('controls').innerHTML=html;
}
function drawLiquid(){
 const poly=m.vessel(s.shape,s.tilt),wl=m.waterline(poly,s.fill),rho=m.liquids[s.liquid].rho;
 let b='<defs><clipPath id="tankClip">'+polygon(poly,'')+'</clipPath><marker id="pa" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0 L0 6 L7 3z" fill="#ffc285"/></marker></defs>';
 b+=polygon(poly,'fill="#1c4258" stroke="#b0d3e2" stroke-width="3"');
 b+=rect(90,wl,725,500-wl,'#187fa6','clip-path="url(#tankClip)" opacity=".78"')+polygon(poly,'fill="none" stroke="#b0d3e2" stroke-width="4"');
 for(let i=1;i<4;i++){const a=poly[i],z=poly[(i+1)%4],p={x:a.x*.38+z.x*.62,y:a.y*.38+z.y*.62};if(p.y>wl+20){const dx=z.y-a.y,dy=-(z.x-a.x),length=Math.hypot(dx,dy);b+=line(p.x,p.y,p.x+dx/length*36,p.y+dy/length*36,'#ffc285',4,'marker-end="url(#pa)"');}}
 let report=[];for(const p of s.probes){const value=m.probe(poly,wl,p,rho);b+='<circle data-probe="'+p.id+'" cx="'+p.x+'" cy="'+p.y+'" r="19" fill="'+(value.region==='liquid'?'#ffe1a8':'#b4bfc9')+'" stroke="#213b51" stroke-width="4"/>'+text(p.x+23,p.y-11,'S'+p.id);
 report.push('S'+p.id+': '+(value.region==='liquid'?fmt(value.depth)+' m · '+fmt(value.gaugePa)+' Pa (sıvının gösterge basıncı)':value.region==='air'?'Su üstünde':'Kap dışında'));}
 return{b,note:'Durgun sıvıda basınç yalnız düşey derinliğe ve sıvının özkütlesine bağlıdır. Kap döndüğünde serbest yüzey yatay kalır; çizim, sıvı alanını sabit tutan ideal durağan son durumu gösterir. Oklar basınç vektörü değil, yüzeye dik basınç kuvveti yönüdür. Tanecik hareketi ve dökülme modellenmez.',stats:report.join(' | ')+' · ρ='+fmt(rho)+' kg/m³'};
}
function drawSolid(){
 const centers=[245,450,655],floor=410;let b=rect(130,floor,640,17,'#899ea9')+text(150,65,'Bloku parmağınla başka sütuna sürükle; üst üste yerleştir.');
 let values=[];for(let col=0;col<3;col++){const blocks=s.blocks.filter(o=>o.column===col);const result=m.solid(blocks);for(let i=0;i<blocks.length;i++){const o=blocks[i],w=70+o.areaM2*22,y=floor-(i+1)*60;
 b+=rect(centers[col]-w/2,y,w,59,'#6aaed5','rx="7" stroke="'+(o.id===s.selectedBlock?'#fff':'#35617a')+'" stroke-width="4" data-block="'+o.id+'"')+text(centers[col]-w/2+9,y+26,'#'+o.id+' · '+fmt(o.massKg)+' kg');}
 b+=text(centers[col]-90,450,'P'+(col+1)+' = '+fmt(result.pressurePa)+' Pa');
 values.push('Sütun '+(col+1)+': F='+fmt(result.forceN)+' N; A='+fmt(result.areaM2)+' m²');}
 return{b,stats:values.join(' | '),note:'Bloklar yatay, merkezlenmiş ve rijit kabul edilir. Her sütunun zemine ilettiği toplam ağırlık / en alttaki bloğun zemine temas alanı kullanılır. Kayma, devrilme ve temas gerilimi dağılımı modellenmez.'};
}
function drawGas(){
 const x0=195,y0=120,vol=s.gasVolume,right=x0+55*vol,h=270,p=m.gas({volumeL:vol,temperatureK:s.gasTemp,particleCount:s.gasCount});
 let b=rect(x0,y0,right-x0,h,'#153d60','stroke="#9bd6e7" stroke-width="3"')+rect(right-8,y0,16,h,'#e4c08a','data-piston="true" rx="5"');
 const count=Math.round(s.gasCount/2);for(let i=0;i<count;i++){let u=((i*0.61803398875+Math.sin(s.phase+i)*0.015)%1+1)%1,v=((i*0.41421356237+Math.cos(s.phase*1.3+i)*0.015)%1+1)%1;b+='<circle cx="'+(x0+15+u*(right-x0-40))+'" cy="'+(y0+15+v*(h-30))+'" r="4.5" fill="#97e9e5"/>';}
 b+=text(570,150,'← Pistonu sürükle')+text(570,184,'Sabit gaz miktarı yoksa')+text(570,208,'basınç da değişir.');
 return{b,stats:'İdeal model: P = '+fmt(p)+' kPa · V='+fmt(vol)+' L · T='+fmt(s.gasTemp)+' K · göreli N='+fmt(s.gasCount),note:'Bu nitel/örnek hesap, ideal gazın sabit sayıda tanecik varsayımı altındaki P ∝ N·T/V ilişkisini kullanır. Her sürgü ayrı bir değişkeni kontrol eder. Tanecik hareketi şematiktir, gerçek çarpışma çözümü değildir; TYT kapsamına ileri gaz yasası hesabı eklenmez.'};
}
function drawFloat(){
 let b=rect(160,160,590,270,'#167aa0','opacity=".85"')+line(160,160,750,160,'#a5ecff',4),rows=[];
 for(const o of s.bodies){const side=48+o.volume*7,x=clamp(o.x,170,735-side),y=clamp(o.y,95,430-side);o.x=x;o.y=y;
 const sub=clamp((y+side-160)/side,0,1),v=m.floatBody({bodyDensity:o.rho,liquidDensity:1000,volumeL:o.volume,submerged:sub});
 b+=rect(x,y,side,side,'#edc184','rx="7" stroke="'+(o.id===s.selectedBody?'#fff':'#48637b')+'" stroke-width="4" data-body="'+o.id+'"')+text(x+8,y+25,'#'+o.id);
 rows.push('#'+o.id+': '+v.state+' · Fg '+fmt(v.weightN)+' N · Fk '+fmt(v.upN)+' N');}
 return{b,stats:rows.join(' | '),note:'Cisimleri parmakla taşı. Fk yalnız o andaki suya batan hacimle hesaplanır; denge düğmesi bağımsız cisimlerin ideal son konumlarını yerleştirir. Birbirine çarpma, taban tepki kuvveti ve su seviyesi değişimi bu modelde hesaplanmaz.'};
}
function drawIce(){
 const iceLeft=1-s.melt/100,ball=m.balloon({volumeL:s.balloonVolume,balloonMassKg:s.balloonMass});
 const r=24+s.balloonVolume*6;let b=rect(170,70,560,355,'#143c55','stroke="#b7d9ed" stroke-width="5" rx="8"')+rect(174,166,552,255,'#187da0','opacity=".8"')+line(174,166,726,166,'#b8f4ff',4);
 if(iceLeft>0){const width=90*Math.sqrt(iceLeft);b+=rect(270-width/2,152,width,55*Math.sqrt(iceLeft),'#c6f2fc','rx="6" stroke="#fff" stroke-width="2"');}
 b+=line(510,422,510,315+r,'#f5da9e',3)+svg('ellipse','cx="510" cy="315" rx="'+r+'" ry="'+r+'" fill="#e9b3d5" stroke="#ffe1f4" stroke-width="3"')+text(475,315,'Balon');
 b+=text(205,110,'Kapalı kap · sabit T ve üst gaz hacmi varsayımı')+text(205,138,'Buz: '+fmt(100-s.melt,0)+'% kaldı');
 return{b,stats:'Balon: Fk='+fmt(ball.upN)+' N · Fg='+fmt(ball.weightN)+' N · ideal ip gerilmesi='+fmt(ball.tensionN)+' N',note:'İdeal karşılaştırma: Saf suda serbestçe yüzen saf buz erirse, değişen buz hacmi ile oluşan su birbirini dengeler; su seviyesi sabit kalır (ısıya bağlı hacim değişimi ihmal). Balonun hacmi ve gazın koşulları sabit varsayılır: buzun erimesinden tek başına balon gerilmesinin değiştiği sonucu çıkmaz. Gerçekte kapalı gaz hacmi/sıcaklık, balon esnekliği ve ısı alışverişi verilmeden basınç değişimi hesaplanamaz. İp gergin ve balon tamamen su içinde varsayılır.'};
}
function scene(){
 let data=s.tab==='liquid'?drawLiquid():s.tab==='solid'?drawSolid():s.tab==='gas'?drawGas():s.tab==='float'?drawFloat():drawIce();
 $('scene').innerHTML=rect(0,0,900,500,'#0b263b')+data.b;
 $('stats').textContent=data.stats;$('explain').textContent=data.note;
}
function render(){controls();scene();}
function addProbe(){if(s.probes.length>=4)return;s.probes.push({id:++s.serial,x:320+(s.probes.length%3)*115,y:240});render();}
function addBlock(){if(s.blocks.length>=9)return;const id=++s.blockSerial;s.blocks.push({id,column:(id-1)%3,massKg:5,areaM2:2});s.selectedBlock=id;render();}
function addBody(){if(s.bodies.length>=6)return;const id=++s.bodySerial;s.bodies.push({id,x:220+(id%4)*100,y:210,rho:850,volume:2});s.selectedBody=id;render();}
function settle(){for(const o of s.bodies){const side=48+o.volume*7,ratio=o.rho/1000;o.y=ratio<1?160-side*(1-ratio):ratio===1?210:430-side;}}
$('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(!t)return;s.gasPlay=false;s.tab=t.dataset.tab;render();});
$('controls').addEventListener('click',e=>{const a=e.target.dataset.action;if(!a)return;
 if(a==='add-probe')addProbe();else if(a==='del-probe'){if(s.probes.length>1)s.probes.pop();render();}
 else if(a==='add-block')addBlock();else if(a==='del-block'){s.blocks=s.blocks.filter(b=>b.id!==s.selectedBlock);s.selectedBlock=s.blocks[0]?.id??null;render();}
 else if(a==='add-body')addBody();else if(a==='del-body'){s.bodies=s.bodies.filter(b=>b.id!==s.selectedBody);s.selectedBody=s.bodies[0]?.id??null;render();}
 else if(a==='equilibrium'){settle();render();}
 else if(a==='gas-play'){s.gasPlay=!s.gasPlay;loopTime=0;render();if(s.gasPlay)requestAnimationFrame(tick);}
});
function updateInput(e){const k=e.target.dataset.field;if(!k)return;
 const v=e.target.type==='range'?Number(e.target.value):e.target.value;if(k==='blockMass'||k==='blockArea'){const b=s.blocks.find(b=>b.id===s.selectedBlock);if(b)b[k==='blockMass'?'massKg':'areaM2']=v;}
 else if(k==='bodyRho'||k==='bodyVolume'){const b=s.bodies.find(b=>b.id===s.selectedBody);if(b)b[k==='bodyRho'?'rho':'volume']=v;}
 else s[k]=v;
 const out=$('controls').querySelector('[data-output="'+k+'"]');if(out)out.textContent=fmt(v);
 scene();}
$('controls').addEventListener('input',updateInput);$('controls').addEventListener('change',updateInput);
function pointerPos(e){const r=$('scene').getBoundingClientRect();return{x:(e.clientX-r.left)*900/r.width,y:(e.clientY-r.top)*500/r.height};}
$('scene').addEventListener('pointerdown',e=>{
 const probe=e.target.closest('[data-probe]'),block=e.target.closest('[data-block]'),body=e.target.closest('[data-body]'),piston=e.target.closest('[data-piston]');
 if(probe)drag={kind:'probe',id:Number(probe.dataset.probe),pointer:e.pointerId};
 else if(block){s.selectedBlock=Number(block.dataset.block);drag={kind:'block',id:s.selectedBlock,pointer:e.pointerId};controls();}
 else if(body){s.selectedBody=Number(body.dataset.body);drag={kind:'body',id:s.selectedBody,pointer:e.pointerId};controls();}
 else if(piston)drag={kind:'piston',pointer:e.pointerId};
 if(drag){$('scene').setPointerCapture?.(e.pointerId);e.preventDefault();}
});
$('scene').addEventListener('pointermove',e=>{if(!drag||drag.pointer!==e.pointerId)return;const p=pointerPos(e);
 if(drag.kind==='probe'){const b=s.probes.find(b=>b.id===drag.id);if(b){b.x=clamp(p.x,90,810);b.y=clamp(p.y,35,470);}}
 if(drag.kind==='block'){const b=s.blocks.find(b=>b.id===drag.id);if(b)b.column=p.x<350?0:p.x<550?1:2;}
 if(drag.kind==='body'){const b=s.bodies.find(b=>b.id===drag.id);if(b){b.x=p.x-35;b.y=p.y-35;}}
 if(drag.kind==='piston'){s.gasVolume=Math.round(clamp((p.x-195)/55,2,8)*2)/2;const a=$('controls').querySelector('[data-field="gasVolume"]');if(a)a.value=s.gasVolume;const out=$('controls').querySelector('[data-output="gasVolume"]');if(out)out.textContent=fmt(s.gasVolume);}
 scene();e.preventDefault();
});
['pointerup','pointercancel','lostpointercapture'].forEach(type=>$('scene').addEventListener(type,e=>{if(drag&&drag.pointer===e.pointerId){drag=null;render();}}));
function tick(now){if(!s.gasPlay||s.tab!=='gas')return;if(loopTime&&now-loopTime<30){requestAnimationFrame(tick);return;}s.phase+=0.12*(s.gasTemp/300);loopTime=now;scene();requestAnimationFrame(tick);}
render();
})(document,window.TYTPressureModel);
