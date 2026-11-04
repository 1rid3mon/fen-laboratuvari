/* TYT 2018 MEB / 10.1: interactive wiring board + qualitative experiments.
 * Port-to-port wiring is real user topology; numbers come from the circuit engine.
 * The backend may solve a network numerically but Kirchhoff laws aren't taught.
 */
(function(w,d){'use strict';
const M=w.TytDevreMath;if(!M)return;
const $=id=>d.getElementById(id);
const pt={
 Bp:[88,147],Bm:[88,369],Sl:[232,108],Sr:[326,108],
 Rl:[458,108],Rr:[566,108],L1l:[456,273],L1r:[568,273],
 L2l:[456,444],L2r:[568,444],Al:[738,108],Ar:[850,108],
 Vl:[738,291],Vr:[850,291]
};
const labels={Bp:'Pil +',Bm:'Pil −',Sl:'Anahtar giriş',Sr:'Anahtar çıkış',Rl:'Direnç giriş',Rr:'Direnç çıkış',L1l:'Ampul 1 giriş',L1r:'Ampul 1 çıkış',L2l:'Ampul 2 giriş',L2r:'Ampul 2 çıkış',Al:'Ampermetre +',Ar:'Ampermetre −',Vl:'Voltmetre +',Vr:'Voltmetre −'};
const tabs=[['circuit','Kablo bağla · Devre Tahtası'],['resistance','İletkenin direnci'],['generator','Üreteçler'],['power','Güç ve parlaklık'],['conduction','İletim ortamları'],['magnet','Mıknatıs ve pusula'],['poles','Mıknatıs kutupları'],['electromagnet','Elektromıknatıs'],['wirefield','Akımın manyetik alanı'],['safety','Elektrik güvenliği']];
const state={
 tab:'circuit',preset:'single',wires:M.normalizeWires(M.presets.single),voltage:6,r:8,lamp1:6,lamp2:6,closed:true,
 picked:null,gesture:null,ghost:null,playing:false,frame:0,clock:0,
 length:5,area:5,material:'copper',
 cells:2,batteryMode:'series',reversed:false,
 deviceVoltage:6,deviceR:6,elapsed:0,
 medium:0,
 magnetAngle:0,magnetStrength:5,compassDistance:2,polesDistance:3,polesFlip:0,coilTurns:7,coilCurrent:4,coilCore:1,
 current:4,wireDistance:2,earth:true,
 wet:false,frayed:false,grounded:true,fuse:true
};
let runningToken=0;
function fmt(x,places=2){return Number.isFinite(x)?Number(x).toLocaleString('tr-TR',{maximumFractionDigits:places}):'—';}
function esc(s){return String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function wrap(body,desc){return '<svg viewBox="0 0 980 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(desc)+'">'+
 '<rect width="980" height="560" fill="#0a2032"/><defs><radialGradient id="shine"><stop offset="0" stop-color="#ffda91" stop-opacity=".95"/><stop offset=".65" stop-color="#ffc975" stop-opacity=".3"/><stop offset="1" stop-color="#ffc975" stop-opacity="0"/></radialGradient></defs>'+body+'</svg>';}
function path(d,col='#87cbd5',width=4,other=''){return '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round" '+other+'/>';}
function line(x,y,X,Y,col='#a4ced8',sw=4,other=''){return path('M '+x+' '+y+' L '+X+' '+Y,col,sw,other);}
function text(x,y,value,col='#dceff6',size=19){return '<text x="'+x+'" y="'+y+'" fill="'+col+'" font-size="'+size+'" font-family="system-ui" font-weight="600" pointer-events="none">'+esc(value)+'</text>';}
function circle(x,y,r,fill,stroke='#8db5c8',sw=3,other=''){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'" '+other+'/>';}
function rect(x,y,ww,hh,color='#244e65',stroke='#8fb5c5',radius=8,other=''){return '<rect x="'+x+'" y="'+y+'" width="'+ww+'" height="'+hh+'" rx="'+radius+'" fill="'+color+'" stroke="'+stroke+'" stroke-width="3" '+other+'/>';}
function arrow(x,y,dx,dy,col='#8debd3',name=''){
 const a=Math.atan2(dy,dx),ex=x+dx,ey=y+dy;
 return line(x,y,ex,ey,col,4)+path('M '+(ex-12*Math.cos(a-.55))+' '+(ey-12*Math.sin(a-.55))+' L '+ex+' '+ey+' L '+(ex-12*Math.cos(a+.55))+' '+(ey-12*Math.sin(a+.55)),col,4)+text(ex+7,ey-8,name,col,16);
}
function ports(){
 return Object.keys(pt).map(key=>{
 const [x,y]=pt[key],picked=state.picked===key;
 return circle(x,y,picked?24:19,picked?'#ffda9b':'#153b54',picked?'#ffe8ac':'#90dcca',3,'data-port="'+key+'" aria-label="'+esc(labels[key])+'"')+
 circle(x,y,7,picked?'#ffca7a':'#91e3c9','#d5f4e8',1,'data-port="'+key+'"')}).join('');
}
function componentGraphics(result){
 const i=result.elements,l1=clamp(result.brightness.L1,0,1),l2=clamp(result.brightness.L2,0,1),e=result.overload;
 let b='';
 // Battery, main switch and variable resistor
 b+=line(88,174,88,224,'#d7dbe6',5)+line(88,292,88,345,'#d7dbe6',5)+line(49,226,127,226,'#ffcf8d',9)+line(64,252,112,252,'#dbe7f1',9)+line(49,278,127,278,'#ffcf8d',9);
 b+=text(146,191,'PİL '+fmt(state.voltage,1)+' V','#f6d7a5',18)+text(120,243,'+','#ffe8bb',22)+text(118,285,'−','#d6e4ec',22);
 b+=line(232,108,256,108,'#e4eaf2',8)+line(310,108,326,108,'#e4eaf2',8)+line(256,108,310,state.closed?108:68,state.closed?'#6fe9b6':'#ffb591',7);
 b+='<rect x="220" y="55" width="121" height="85" fill="transparent" data-switch="1" role="button" aria-label="Anahtarı aç veya kapat"/>';
 b+=text(234,53,state.closed?'ANAHTAR KAPALI':'ANAHTAR AÇIK',state.closed?'#83ebc5':'#efb997',15);
 b+=rect(473,83,78,50,'#735c48','#ffd2a2',6)+text(494,114,'R','#fff0d1',27)+text(467,65,fmt(state.r,1)+' Ω','#b5dfd8',16);
 // Lamps with power-based light brightness; circle glow only if connected.
 for(const [key,y,glow] of [['L1',273,l1],['L2',444,l2]]){
  const active=glow>.01&&!e;
  if(active)b+=circle(512,y,94*glow+32,'url(#shine)','none',0);
  b+=circle(512,y,42,active?'#d3b16d':'#2d4c60',active?'#ffe7a5':'#8db9ca',4);
  b+=line(483,y-24,541,y+24,active?'#fff5c5':'#a2b7c6',5)+line(541,y-24,483,y+24,active?'#fff5c5':'#a2b7c6',5);
  b+=text(486,y-58,key+' · '+fmt(state[key==='L1'?'lamp1':'lamp2'],1)+' Ω','#c7e1ed',16);
  if(active)b+=text(605,y+8,'IŞIK '+Math.round(glow*100)+'%','#ffe7a6',19);
 }
 // Meters
 b+=circle(794,108,47,'#1b4960','#b3dce8',4)+text(778,120,'A','#d7f5ff',34)+text(747,47,'Ampermetre','#bbe4e8',17);
 b+=text(758,177,fmt(result.readings.A,3)+' A','#ffd8a5',17);
 b+=circle(794,291,47,'#1b4960','#b3dce8',4)+text(778,304,'V','#d7f5ff',34)+text(749,233,'Voltmetre','#bbe4e8',17);
 b+=text(755,366,fmt(Math.abs(result.readings.V),3)+' V','#ffd8a5',17);
 return b;
}
function wireGeometry(a,b){
 const [x,y]=pt[a],[X,Y]=pt[b],mid=(x+X)/2;
 return [[x,y],[mid,y],[mid,Y],[X,Y]];
}
function svgPath(points){return points.map(([x,y],i)=>(i?' L ':'M ')+x+' '+y).join('');}
function sample(points,t){
 let lengths=[],total=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];const l=Math.hypot(b[0]-a[0],b[1]-a[1]);lengths.push(l);total+=l;}
 let offset=clamp(t,0,1)*total;
 for(let i=0;i<lengths.length;i++){if(offset<=lengths[i]||i===lengths.length-1){const a=points[i],b=points[i+1],p=lengths[i]?offset/lengths[i]:0;return [a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p];}offset-=lengths[i];}
 return points[0];
}
function sceneCircuit(){
 const result=M.solve({wires:state.wires,voltage:state.voltage,r:state.r,lamp1:state.lamp1,lamp2:state.lamp2,closed:state.closed});
 state.last=result;let body='';
 for(let x=20;x<980;x+=40)for(let y=20;y<560;y+=40)body+=circle(x,y,1,'#264055','none',0);
 body+=text(30,32,'KABLOLARI UÇTAN UCA SÜRÜKLE','#97eadb',17);
 body+=text(30,522,'Mavi: bağlantı · Yeşil: akım · Kırmızı: kısa devre','#b8d8e1',16);
 const flowIndex=[];
 state.wires.forEach(([a,b],i)=>{
  const points=wireGeometry(a,b),D=svgPath(points),current=result.wireCurrents[i]||0,active=!result.overload&&Math.abs(current)>.0003;
  const color=result.overload?'#f27f81':active?'#72e4be':'#6e9cb5';
  body+=path(D,'#213e52',14,'data-wire="'+i+'"')+path(D,color,5,'data-wire="'+i+'"');
  if(active){
   const [x,y]=sample(points,.1);
   body+=circle(x,y,6,'#ffdfb2','#effce9',1,'data-flow="'+i+'"');
   flowIndex.push(i);
  }
 });
 body+=componentGraphics(result)+ports();
 if(state.picked){const [x,y]=pt[state.picked];body+=circle(x,y,31,'transparent','#ffdfa1',4);}
 if(state.ghost){const [x,y]=pt[state.ghost.from];body+=path('M '+x+' '+y+' L '+state.ghost.x+' '+state.ghost.y,'#ffe2a5',4,'stroke-dasharray="8 7" id="preview-wire"');}
 $('scene').innerHTML=wrap(body,'İstediğin terminalleri kabloyla bağlayabildiğin canlı elektrik devresi. Anahtar, pil, direnç, iki ampul, voltmetre, ampermetre.');
 const readings=[
 ['Devre akımı',result.overload?'AŞIRI AKIM':fmt(result.totalCurrent,3)+' A'],
 ['1. ampul',result.overload?'Koruma: kapalı':fmt(result.elements.L1?.power||0,2)+' W'],
 ['2. ampul',result.overload?'Koruma: kapalı':fmt(result.elements.L2?.power||0,2)+' W'],
 ['Dirençte güç',result.overload?'Koruma':fmt(result.elements.R?.power||0,2)+' W'],
 ['Ampermetre',fmt(result.readings.A,3)+' A'],
 ['Voltmetre',fmt(Math.abs(result.readings.V),3)+' V']];
 showReadings(readings);
 const ok=result.complete&&!result.overload;
 const status=result.short?'KISA DEVRE: pilin uçları doğrudan birleşmiş. Sanal koruma devreyi durdurdu.':result.overload?'AŞIRI AKIM: dirençsiz yol var. Sanal koruma ampulleri kapattı.':result.complete?'Devre kapalı. Akım uygun bağlı elemanlardan geçiyor.':'Devre açık: pilin iki ucu arasında tamamlanmış yol yok.';
 $('status').className='status'+(!ok?' warning':'');
 $('status').textContent=status;
 $('help').textContent='Bir ucun üstüne dokunup diğer uca sürükle veya iki terminale sırayla dokun. Kabloya dokunarak silebilirsin. Anahtara dokunarak aç/kapat. Öğretimsel simülasyondur; gerçek priz bağlantısı yapma.';
}
function showReadings(rows){$('readings').innerHTML='<div class="readings">'+rows.map(([label,value])=>'<div class="reading"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong></div>').join('')+'</div>';}
function setStatus(s,bad=false){$('status').textContent=s;$('status').className='status'+(bad?' warning':'');}
function range(id,name,min,max,step,value,unit=''){
 return '<div class="group"><label for="'+id+'">'+esc(name)+' <strong id="'+id+'-out">'+fmt(Number(value),2)+' '+esc(unit)+'</strong></label><input type="range" id="'+id+'" data-range="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'"></div>';
}
function choice(id,name,values,current){return '<div class="group"><label for="'+id+'">'+esc(name)+'</label><select data-select="'+id+'" id="'+id+'">'+values.map(([v,name])=>'<option value="'+esc(v)+'"'+(String(v)===String(current)?' selected':'')+'>'+esc(name)+'</option>').join('')+'</select></div>';}
function bools(pairs){return pairs.map(([id,name])=>'<div class="group"><label><input type="checkbox" data-check="'+id+'"'+(state[id]?' checked':'')+'> '+esc(name)+'</label></div>').join('');}
function controls(){
 const s=state;
 $('tabs').innerHTML=tabs.map(([key,name])=>'<button data-tab="'+key+'" type="button" class="'+(s.tab===key?'active':'')+'" aria-current="'+(s.tab===key?'page':'false')+'">'+name+'</button>').join('');
 $('title').textContent=({circuit:'Devre Tahtası · Kabloları sen bağla',resistance:'İletken direnci neye bağlı?',generator:'Pilleri seri ve paralel bağla',power:'Ampulün gücü ve enerji dönüşümü',conduction:'Katı, sıvı, gaz ve plazmada iletim',magnet:'Mıknatıs ve pusula',poles:'Mıknatısların itme–çekmesi',electromagnet:'Elektromıknatıs: bobin ve akım',wirefield:'Akımın oluşturduğu manyetik alan',safety:'Elektrikle güvenli çalışma'})[s.tab];
 let pane='';
 if(s.tab==='circuit'){
  pane+='<h3>Örnek devreyi yükle</h3><div class="preset">'+[['single','Tek ampul'],['serial','İki ampul seri'],['parallel','İki ampul paralel'],['meters','A–V ölçü aletleri'],['ohm','Ohm deneyi'],['short','Kısa devreyi göster']].map(([key,name])=>'<button data-preset="'+key+'" class="'+(s.preset===key?'active':'')+'">'+name+'</button>').join('')+'</div>';
  pane+=range('voltage','Pil gerilimi',1,12,.5,s.voltage,'V')+range('r','Direnç R',2,25,1,s.r,'Ω')+
  range('lamp1','Ampul 1 direnci',3,15,1,s.lamp1,'Ω')+range('lamp2','Ampul 2 direnci',3,15,1,s.lamp2,'Ω');
  pane+='<div class="group"><button data-command="switch" class="toolbtn">'+(s.closed?'Anahtarı aç':'Anahtarı kapat')+'</button> <button data-command="undo" class="toolbtn">Son kabloyu sil</button> <button data-command="clear" class="toolbtn">Boş devre</button></div>';
 }else if(s.tab==='resistance'){
  pane+=range('length','Tel uzunluğu',1,10,.5,s.length,'kademe')+range('area','Kesit alanı',1,10,.5,s.area,'kademe')+
  choice('material','Tel malzemesi',[['copper','Bakır'],['iron','Demir'],['nichrome','Nikel-krom']],s.material);
 }else if(s.tab==='generator'){
  pane+=range('cells','Üreteç sayısı',1,3,1,s.cells,'pil')+choice('batteryMode','Bağlanma biçimi',[['series','Seri'],['parallel','Paralel (özdeş piller)']],s.batteryMode);
  pane+=bools([['reversed','Bir pili ters bağla (yalnız seri)']]);
 }else if(s.tab==='power'){
  pane+=range('deviceVoltage','Direnç üzerindeki gerilim',1,12,.5,s.deviceVoltage,'V')+range('deviceR','Direnç',2,24,1,s.deviceR,'Ω')+range('elapsed','Gözlem süresi',0,10,.5,s.elapsed,'adım');
 }else if(s.tab==='conduction'){pane+=range('medium','Ortam: 0 katı · 1 sıvı · 2 gaz · 3 plazma',0,3,1,s.medium,'');}
 else if(s.tab==='magnet'){pane+=range('magnetAngle','Mıknatıs yönü',-180,180,15,s.magnetAngle,'°')+range('magnetStrength','Mıknatısın etkisi',1,10,1,s.magnetStrength,'kademe')+range('compassDistance','Pusula uzaklığı',1,6,.5,s.compassDistance,'birim');}
 else if(s.tab==='poles'){pane+=range('polesDistance','Mıknatısların uzaklığı',1,6,.5,s.polesDistance,'kademe')+range('polesFlip','0 Zıt kutup · 1 Aynı kutup',0,1,1,s.polesFlip,'');}
 else if(s.tab==='electromagnet'){pane+=range('coilTurns','Bobin sarım sayısı',2,12,1,s.coilTurns,'tur')+range('coilCurrent','Akım yönü ve şiddeti',-10,10,1,s.coilCurrent,'kademe')+range('coilCore','0 Hava · 1 Demir çekirdek',0,1,1,s.coilCore,'');}
 else if(s.tab==='wirefield'){pane+=range('current','Akımın yönü/şiddeti',-10,10,1,s.current,'kademe')+range('wireDistance','Telden uzaklık',1,6,.5,s.wireDistance,'birim')+bools([['earth','Dünya alanını göster']]);}
 else if(s.tab==='safety'){pane+=bools([['wet','Islak ortam'],['frayed','Kablo yalıtımı hasarlı'],['grounded','Topraklama var'],['fuse','Sigorta var']]);}
 $('settings').innerHTML=pane;
 $('controls-title').textContent=s.tab==='circuit'?'Devreyi kur':'Deneyi değiştir';
}
function presentScene(body,description,observations,status,warning=false){
 $('scene').innerHTML=wrap(body,description);
 showReadings(observations);setStatus(status,warning);
}
function drawResistance(){
 const o=M.wireResistanceTrend({length:state.length,area:state.area,material:state.material});
 const width=clamp(state.length*54,58,546),height=clamp(state.area*9+10,19,94),x=80,y=235-height/2;
 let b=rect(x,y,width,height,'#35748e','#b9dce8',Math.min(10,height/2));
 b+=circle(x+width,235,27,'transparent','#f5c990',3,'data-exp-drag="length"')+line(x+width+15,115,x+width+15,354,'#ebd498',2)+text(80,107,'Telin uzunluğu', '#f4d4a3',25)+text(80,412,'KALINLIK ↑ → DİRENÇ ↓','#92ead7',21);
 b+=text(80,452,'UZUNLUK ↑ → DİRENÇ ↑','#f3d49a',21);
 b+=text(80,494,'Malzeme: '+({copper:'Bakır',iron:'Demir',nichrome:'Nikel-krom'})[state.material],'#daeaf5',20);
 for(let i=0;i<9;i++){const xx=x+20+(i*37+state.clock*48)%Math.max(25,width-25);b+=circle(xx,235,7,'#92e7d5','#e4faf1',1);}
 presentScene(b,'Uzayan ve kalınlaşan metal telin direnç eğilimi',[['Direnç eğilimi',o.trend],['Uzunluk',fmt(state.length)+' kademe'],['Kesit',fmt(state.area)+' kademe'],['Matematiksel ilişki',o.formula]],'MEB 10.1.1.2: R, uzunlukla artar; kesit alanıyla azalır. Özdirenç malzemeye bağlıdır. Sayısal direnç hesabı yoktur.');
 $('help').textContent='Uzunluğu ve kesiti değiştir. Tel ekranda gerçekten uzar veya kalınlaşır. Malzeme değişince direnç eğilimi değişir; sıcaklık ve renk kodları bu kazanımda yoktur.';
}
function drawGenerator(){
 const p=state,forcedMode=p.reversed&&p.batteryMode==='parallel'?'series':p.batteryMode;
 const o=M.generators({count:p.cells,mode:forcedMode,reversed:p.reversed,load:6});
 let b=text(55,61,p.batteryMode==='parallel'?'Özdeş piller paralel':'Piller seri bağlandı','#d6edf1',26);
 for(let i=0;i<p.cells;i++){
  const x=p.batteryMode==='series'?153+i*235:390,y=p.batteryMode==='series'?180:113+i*105;
  const reverse=p.reversed&&p.batteryMode==='series'&&i===p.cells-1;
  b+=rect(x,y,129,59,reverse?'#aa6557':'#277c82','#d7e6e6',12);
  b+=text(x+14,y+39,reverse?'−  1,5 V  +':'+  1,5 V  −','#f9e7c0',16);
 }
 b+=text(70,409,'Aynı harici yük: 6 Ω','#cfeaf1',20);
 b+=text(70,447,'Seri: gerilim artabilir · Paralel: kapasite artar','#a2ecd4',18);
 const batteryLife=o.E===0?'Akım yok':o.runtime>7?'Görece uzun':'Görece kısa';
 presentScene(b,'Özdeş pillerin seri, paralel ve ters bağlantılarının görünür karşılaştırması',[['Toplam gerilim',fmt(o.E,2)+' V'],['Akım eğilimi',o.currentTrend],['Tükenme süresi',batteryLife],['İç direnç','Hesaplanmıyor']],o.E===0?'Zıt piller eşit ve seri olduğunda toplam elektromotor kuvvet sıfıra inebilir.':p.batteryMode==='parallel'?'Özdeş piller paralelde aynı gerilimi, daha yüksek toplam kapasiteyi sağlar.':'Seri piller gerilimlerini toplar. Sabit dirençte akım artar ve pillerin tüketim süresi kısalabilir.');
 $('help').textContent='10.1.2.2: Aynı 1,5 V piller; yalnız eş elektromotor kuvvetli üreteçler paralel. İç direnç sayısal hesaba girmez. Galvani, hayvan dokusunun elektrik kaynağı olabileceğini savunurken Volta, farklı metaller ve iletken ortamların oluşturduğu etkiye odaklandı.';
}
function drawPower(){
 const p=state,I=p.deviceVoltage/p.deviceR,P=I*I*p.deviceR,glow=clamp(Math.sqrt(P/12),0,1);
 let b=line(175,155,720,155,'#8fe1ce',6)+line(175,370,720,370,'#8fe1ce',6)+line(175,155,175,370,'#8fe1ce',6)+line(720,155,720,370,'#8fe1ce',6);
 b+=circle(448,155,100*glow+25,'url(#shine)','none',0)+circle(448,155,48,glow>.1?'#d8b478':'#2b5261','#ffe0ad',5);
 b+=line(412,126,485,183,'#f2e6cb',5)+line(485,126,412,183,'#f2e6cb',5);
 b+=rect(144,226,60,61,'#355d77','#bddbe8')+text(148,264,fmt(p.deviceVoltage)+'V','#fce2af',22);
 b+=text(120,463,'Elektrik enerjisi → ışık + ısı','#d6eff2',24);
 b+=text(120,504,'Aynı ampul: güç arttıkça parlaklık artma eğilimindedir','#9ce9d5',17);
 presentScene(b,'Ampulün ışık şiddeti harcadığı elektrik gücüyle değişir',[['Direnç gücü',fmt(P,2)+' W'],['Akım',fmt(I,3)+' A'],['Gözlem aşaması',fmt(p.elapsed)+' kademe'],['Parlaklık',Math.round(glow*100)+'%']],'10.1.2.3: Bir direncin birim zamanda harcadığı enerji yani güç hesaplanabilir (P=I²R). Enerji dönüşümü: elektrik → ışık ve ısı.');
 $('help').textContent='Gerilimi ve direnci değiştir. Ampulün parlaklığı güçle birlikte değişir. Gerçek tungsten ampuller sıcaklıkla direnç değiştirir; burada sabit ideal direnç yaklaşımı kullanılır.';
}
function drawConduction(){
 const names=['Metal: hareketli elektronlar','İyonlu sıvı: zıt iyonlar','Gaz: iyonlaşma gerekebilir','Plazma: iyonlar ve elektronlar'],p=state.medium;
 let b=rect(110,141,744,231,p===0?'#315c73':p===1?'#24576b':p===2?'#263e54':'#5b3d60','#9cbfce',16);
 for(let i=0;i<21;i++){
  const x=140+(i%7)*102,y=173+Math.floor(i/7)*71;
  const sign=p===0?-1:p===1?(i%2?-1:1):i%3?-1:1;
  const drift=(state.clock*34)%(p===0?46:67),xx=x+(sign<0?-drift:drift);
  const col=sign>0?'#f5c095':'#87c6eb';
  b+=circle(clamp(xx,120,827),y,p===0?9:11,col,'#ecf7f8',1)+text(x+10,y-20,sign>0?'+':'−','#d1dce2',14);
 }
 b+=text(100,92,names[p],'#edf3f5',26)+arrow(110,404,250,0,'#8ef0ca','Geleneksel akım yönü');
 presentScene(b,'Farklı maddelerde elektron ve iyon hareketinin temsili görselleştirmesi',[['Ortam',['Katı','Sıvı','Gaz','Plazma'][p]],['Taşıyıcı',p===0?'Elektronlar':p===1?'İyonlar':'Elektron + iyon'],['Enerji aktarımı','Elektriksel']],'10.1.1.1: Metallerde serbest elektronlar, elektrolitlerde iyonlar, iyonlaşmış gazlarda ve plazmada çeşitli yüklü taşıyıcılar akımı oluşturur.');
 $('help').textContent='Dört ortamı değiştir, temsili yük taşıyıcılarını karşılaştır. Gerçek iyonlaşma koşulları ve kimyasal süreçler bu basit çizimde çözülmez.';
}
function drawMagnet(){
 const p=state,angle=p.magnetAngle*Math.PI/180,mx=Math.cos(angle),my=Math.sin(angle),cx=418,cy=262;
 const magnetic=(x,y)=>{const dx=x-cx,dy=y-cy,r2=dx*dx+dy*dy,r=Math.sqrt(r2)||1,rx=dx/r,ry=dy/r,md=mx*rx+my*ry;return [3*rx*md-mx,3*ry*md-my].map(v=>v*p.magnetStrength/(r2*r)*1e6);};
 const px=635+p.compassDistance*29,py=263;
 let b='';
 for(let x=75;x<914;x+=76)for(let y=78;y<494;y+=69){
  if(Math.abs(x-cx)<155&&Math.abs(y-cy)<95)continue;
  const [fx,fy]=magnetic(x,y),mag=Math.hypot(fx,fy);
  if(mag<.0001)continue;const l=clamp(12+Math.sqrt(mag)*2.2,12,32);
  b+=arrow(x,y,fx/mag*l,fy/mag*l,'#3e8794','');
 }
 b+='<g data-exp-drag="magnetAngle" transform="rotate('+p.magnetAngle+' '+cx+' '+cy+')">'+rect(cx-135,cy-46,135,92,'#386f94','#9cd5ec',0)+rect(cx,cy-46,135,92,'#af6049','#f7c2ad',0)+text(cx-88,cy+9,'S','#fff',32)+text(cx+52,cy+9,'N','#fff',32)+'</g>';
 // Idealised Earth field points to diagram north. The compass responds to both fields.
 const [bx,by]=magnetic(px,py),fieldX=bx,fieldY=by-1.3;
 const heading=Math.atan2(fieldX,-fieldY)*180/Math.PI;
 b+=circle(px,py,57,'#153449','#b2d5e5',4,'data-exp-drag="compassDistance"');
 b+='<g transform="rotate('+heading+' '+px+' '+py+')">'+arrow(px,py,0,-42,'#ffbd90','N')+arrow(px,py,0,29,'#84d2ef','S')+'</g>';
 b+=text(70,60,'Dış alanda manyetik oklar: N → S','#dfedf2',22);
 b+=text(63,523,'Pusula mıknatıs + Dünya alanının yönüne döner','#9ee6d5',18);
 presentScene(b,'Dönen çubuk mıknatısın dipol alanına tepki veren gerçek pusula yönü',[['Mıknatıs yönü',fmt(p.magnetAngle)+'°'],['Pusula açısı',fmt(heading)+'°'],['Uzaklık',fmt(p.compassDistance)+' kademe']],'10.1.3.1 ve 10.1.4.2: Pusula bileşke manyetik alan yönüne döner. Dipol modeli temsili, kuvvet hesabı yoktur.');
 $('help').textContent='Mıknatısın açısını değiştir veya pusulayı uzaklaştır. Alan okları ve pusula gerçekten birlikte yön değiştirir; bu 2B şema, gerçek mıknatısın tam 3B alanı değildir.';
}
function drawPoles(){
 const p=state,x2=524+p.polesDistance*53,gap=x2-439,attract=p.polesFlip===0,force=clamp(106/p.polesDistance,14,89);
 let b=rect(179,207,131,112,'#356b92','#bce1f0',3)+rect(310,207,129,112,'#b06650','#f4c7b9',3);
 b+=text(234,275,'S','#eaf5fa',33)+text(356,275,'N','#fff1e4',33);
 b+=rect(x2,207,129,112,attract?'#356b92':'#b06650','#d4dce4',3);
 b+=rect(x2+129,207,129,112,attract?'#b06650':'#356b92','#d4dce4',3);
 b+=text(x2+47,275,attract?'S':'N','#fff',33)+text(x2+179,275,attract?'N':'S','#fff',33);
 b+='<rect x="'+(x2-4)+'" y="200" width="267" height="125" fill="transparent" data-exp-drag="polesDistance"/>';
 b+=arrow(455,271,attract?force:-force,0,attract?'#80edc7':'#f4b892','F');
 b+=arrow(x2-17,270,attract?-force:force,0,attract?'#80edc7':'#f4b892','F');
 b+=text(75,81,attract?'Zıt kutuplar birbirini ÇEKER':'Aynı kutuplar birbirini İTER',attract?'#a7efdb':'#ffc89e',25);
 b+=text(78,113,'Uzaklık arttıkça kuvvetin etkisi zayıflar','#d1e4ed',18);
 presentScene(b,'İki mıknatıs kutuplarının itmesi veya çekmesi görsel tepki verir',[['Etkileşim',attract?'Çekme':'İtme'],['Kutuplar',attract?'N–S':'N–N'],['Uzaklık',fmt(p.polesDistance)+' kademe']],'10.1.3.1: Aynı kutuplar birbirini iter, zıt kutuplar birbirini çeker. Kuvvetin sayısal modeli ve büyüklüğü hesaplanmaz.');
 $('help').textContent='İkinci mıknatısın kutbunu ters çevir veya uzaklığını değiştir. Kuvvet oklarının yönü ve iki mıknatısın konumu gerçek kurala göre değişir; çizim ölçekli kuvvet ölçümü değildir.';
}
function drawElectromagnet(){
 const p=state,sign=Math.sign(p.coilCurrent),count=p.coilTurns,core=p.coilCore!==0,force=count*Math.abs(p.coilCurrent)*(core?1.8:1),strength=clamp(force/90,0,1);
 let b='';
 b+=rect(131,174,559,138,core?'#576a76':'#203f54',core?'#e0e7e5':'#9ecbdc',14);
 for(let i=0;i<count;i++){const x=163+i*500/(count-1);b+='<ellipse cx="'+x+'" cy="242" rx="12" ry="93" fill="none" stroke="'+(sign>=0?'#9de6df':'#f1bd98')+'" stroke-width="6"/>';}
 if(sign!==0)for(let y=193;y<=304;y+=40)b+=arrow(sign>0?198:610,y,sign*408*strength,0,'#8de4d8','');
 b+='<rect x="151" y="147" width="526" height="200" fill="transparent" data-exp-drag="coilCurrent"/>';
 const compassX=797; b+=circle(compassX,236,61,'#193b51','#b4dbe5',4);
 b+='<g transform="rotate('+(sign*84*strength)+' '+compassX+' 236)">'+arrow(compassX,236,0,-47,'#f3ba92','N')+'</g>';
 b+=text(72,86,sign===0?'Akım yok: bobin alanı yok':sign>0?'Akım sağ el kuralına göre alan oluşturur':'Akım ters: kutupların yönü ters',sign===0?'#bbd4df':'#abe9dd',21);
 b+=text(80,426,'Tur ↑ · akım ↑ · demir çekirdek → etki güçlenir','#e5d7aa',21);
 presentScene(b,'Sarımı, akımı ve çekirdeği değiştirilebilen elektromıknatıs',[['Sarım',fmt(count)+' tur'],['Akım',sign===0?'Yok':sign>0?'İleri yön':'Ters yön'],['Çekirdek',core?'Demir':'Hava'],['Alan eğilimi',sign===0?'Yok':strength>.6?'Güçlü':'Zayıf']],'10.1.4.1: Akımın şiddeti ve yönü, sarım ve demir çekirdek elektromıknatısın etkisini değiştirir. Sayısal B/kuvvet hesabı yoktur.');
 $('help').textContent='Sarım sayısını ve akımı değiştir. İbre ve alan okları yön değiştirir. Akım kesilince bobin alanı kaybolur; çekirdeğin kalıcı mıknatıslanması modellenmemiştir. Kullanım: röle, vinç, elektrikli zil.';
}
function drawWireField(){
 const p=state,o=M.compass({current:p.current,distance:p.wireDistance,earth:p.earth});
 let b='';
 for(let r=50;r<=190;r+=47)b+='<circle cx="390" cy="260" r="'+r+'" stroke="#407888" stroke-width="3" fill="none" stroke-dasharray="8 8"/>';
 b+=circle(390,260,34,'#1f546a','#cbe6e8',4)+text(375,274,p.current>0?'•':p.current<0?'×':'0',p.current?'#f9d6a2':'#91b3c0',40);
 const x=390+p.wireDistance*45,y=260;
 b+=circle(x,y,35,'#243e51','#bbdce3',4,'data-exp-drag="wireDistance"')+arrow(x,y,0,p.current>0?31:p.current<0?-31:0,'#96edcd','B');
 b+=text(55,85,'Sağ el kuralı: akımı ters çevir','#dbebf2',24)+text(55,118,'Manyetik alanın dolanım yönü değişsin','#a1e3d4',17);
 presentScene(b,'Akım taşıyan düz telin çevresindeki dairesel manyetik alan',[['Akım yönü',p.current>0?'Sayfadan dışarı':p.current<0?'Sayfa içine':'Akım yok'],['Alan eğilimi',p.current===0?'Yok':o.fieldTrend],['Tel uzaklığı',fmt(p.wireDistance)+' kademe']],'10.1.4.1: Akım ve tele uzaklık manyetik alanı etkiler; sağ el kuralı kullanılır. Sayısal alan veya kuvvet hesabı yoktur. Yüksek gerilim hatlarının yakınında risk vardır.');
 $('help').textContent='Akımı ters çevir veya pusulayı telden uzaklaştır. Elektromıknatıslar, geri dönüşümlü mıknatıslanma ile birçok cihazda kullanılabilir.';
}
function drawSafety(){
 const p=state,o=M.safety(p),color=o.danger?'#e99390':'#89e9c9';
 let b=line(120,206,515,206,p.frayed?'#e59a85':'#9bc8d8',19)+rect(499,143,150,130,'#34556b','#d0e4ed',19);
 b+=circle(535,204,14,'#203a4f','#9bc8db')+circle(612,204,14,'#203a4f','#9bc8db')+
 rect(669,143,155,130,p.wet?'#35618a':'#204459','#a9d1db',24);
 if(p.frayed)b+=path('M310 203 L326 172 L341 227 L355 174','#ffc28b',5);
 if(p.grounded)b+=line(743,273,743,329,'#b5e2ce',6)+text(648,371,'TOPRAK VAR','#a6f3d9',19);
 if(p.wet)b+=Array.from({length:7},(_,i)=>circle(690+i*17,310+i%2*23,5,'#77cdeb','#e9f7f8',1)).join('');
 b+=text(110,97,o.danger?'⚠ Riskli ortam · gerçek devrede deneme yapma':'Koruyucu önlemler etkin','#f1daae',26);
 presentScene(b,'Kablo yalıtımı, topraklama, sigorta ve ıslak ortam koşulları',[['Güvenlik',o.danger?'RİSKLİ':'Daha güvenli'],['Topraklama',p.grounded?'Var':'Yok'],['Sigorta',p.fuse?'Var':'Yok'],['Kablo',p.frayed?'Hasarlı':'Sağlam']],o.notes.join(' · ')+'. Sadece sanal deneme yapılır; evde gerçek priz tesisatıyla deney yapma.',o.danger);
 $('help').textContent='10.1.2.4: Elektrik çarpması ve yangın risklerine karşı yalıtım, topraklama ve uygun aşırı akım koruması önemlidir. Bu simülasyon elektrik güvenliği denetimi yerine geçmez.';
}
function draw(){
 if(state.tab==='circuit')sceneCircuit();
 else if(state.tab==='resistance')drawResistance();
 else if(state.tab==='generator')drawGenerator();
 else if(state.tab==='power')drawPower();
 else if(state.tab==='conduction')drawConduction();
 else if(state.tab==='magnet')drawMagnet();
 else if(state.tab==='poles')drawPoles();
 else if(state.tab==='electromagnet')drawElectromagnet();
 else if(state.tab==='wirefield')drawWireField();
 else if(state.tab==='safety')drawSafety();
 $('play').textContent=state.playing?'Ⅱ Hareketi durdur':'▶ Yük akışını hareket ettir';
 $('play').hidden=!['circuit','resistance','conduction'].includes(state.tab);
}
function render(){controls();draw();}
function changeTab(tab){if(!tabs.some(t=>t[0]===tab))return;state.tab=tab;state.picked=null;state.gesture=null;state.ghost=null;stop();render();}
function applyPreset(name){if(!M.presets[name])return;state.wires=M.normalizeWires(M.presets[name]);state.preset=name;state.picked=null;state.ghost=null;stop();render();}
function addWire(a,b){
 try{state.wires=M.normalizeWires([...state.wires,[a,b]]);state.preset='custom';state.picked=null;state.ghost=null;stop();render();return true;}catch(_){setStatus('Bu iki ucu birleştiremiyoruz. Farklı terminal seç.',true);return false;}
}
function pointFromEvent(e){
 const svg=$('scene').querySelector('svg');if(!svg)return null;const bb=svg.getBoundingClientRect();if(!bb.width||!bb.height)return null;return [(e.clientX-bb.left)*980/bb.width,(e.clientY-bb.top)*560/bb.height];
}
function nearPort(p,limit=33){if(!p)return null;let best=null,dist=Infinity;for(const [key,xy]of Object.entries(pt)){const d=Math.hypot(xy[0]-p[0],xy[1]-p[1]);if(d<dist){best=key;dist=d;}}return dist<=limit?best:null;}
function handleDown(e){
 if(state.tab!=='circuit'){
  const exp=e.target.closest?.('[data-exp-drag],[data-exp-tap]');if(!exp)return;
  if(exp.hasAttribute('data-exp-tap')){const key=exp.getAttribute('data-exp-tap');if(Object.prototype.hasOwnProperty.call(state,key)){state[key]=state[key]?0:1;stop();render();}return;}
  const key=exp.getAttribute('data-exp-drag');const input=$(key);
  const pos=pointFromEvent(e);if(!input||!pos)return;
  state.gesture={id:e.pointerId,experiment:true,key,started:pos,base:state[key]};
  e.preventDefault();try{$('scene').setPointerCapture?.(e.pointerId)}catch(_){}return;
 }
 const hit=e.target.closest?.('[data-switch],[data-port],[data-wire]');
 if(!hit)return;
 if(hit.hasAttribute('data-switch')){state.closed=!state.closed;state.picked=null;stop();draw();return;}
 if(hit.hasAttribute('data-wire')){const i=Number(hit.getAttribute('data-wire'));if(Number.isInteger(i)&&state.wires[i]){state.wires.splice(i,1);state.preset='custom';state.picked=null;stop();draw();}return;}
 const port=hit.getAttribute('data-port');if(!port||!pt[port])return;
 if(state.picked&&state.picked!==port){addWire(state.picked,port);return;}
 state.picked=port;state.gesture={id:e.pointerId,from:port,started:pointFromEvent(e),moved:false};
 e.preventDefault();try{$('scene').setPointerCapture?.(e.pointerId);}catch(_){}
 draw();
}
function handleMove(e){
 if(!state.gesture||state.gesture.id!==e.pointerId)return;
 const pos=pointFromEvent(e);if(!pos)return;
 const a=state.gesture;
 if(a.experiment){const slider=$(a.key),scales={magnetAngle:.48,compassDistance:1/29,polesDistance:1/53,coilCurrent:1/19,wireDistance:1/45,length:1/54};const gain=scales[a.key];if(!slider||!gain)return;
  const min=Number(slider.min),max=Number(slider.max),step=Number(slider.step)||1,next=clamp(min+Math.round((a.base+(pos[0]-a.started[0])*gain-min)/step)*step,min,max);
  state[a.key]=Number(next.toFixed(4));slider.value=String(next);const out=$(a.key+'-out');if(out)out.textContent=fmt(next,2);
  stop();draw();e.preventDefault();return;
 }
 if(Math.hypot(pos[0]-a.started[0],pos[1]-a.started[1])>12)a.moved=true;
 state.ghost={from:a.from,x:pos[0],y:pos[1]};
 const preview=$('preview-wire');if(preview)preview.setAttribute('d','M '+pt[a.from][0]+' '+pt[a.from][1]+' L '+pos[0]+' '+pos[1]);
 else draw();
 e.preventDefault();
}
function handleUp(e){
 if(!state.gesture||state.gesture.id!==e.pointerId)return;
 const a=state.gesture,pos=pointFromEvent(e),end=a.experiment?null:nearPort(pos);
 state.gesture=null;state.ghost=null;
 try{if($('scene').hasPointerCapture?.(e.pointerId))$('scene').releasePointerCapture(e.pointerId);}catch(_){}
 if(a.experiment)return;
 if(a.moved&&end&&end!==a.from){addWire(a.from,end);return;}
 state.picked=a.from;draw();
}
function stop(){state.playing=false;runningToken++;state.frame=0;}
function tick(now,token){
 if(!state.playing||token!==runningToken||d.hidden)return;
 const dt=Math.min(.045,Math.max(0,(now-state.frame)/1000||0));state.frame=now;state.clock+=dt*.7;
 const s=$('scene');
 if(state.tab==='circuit'){
  const result=state.last;
  for(const node of s.querySelectorAll('[data-flow]')){
   const i=Number(node.getAttribute('data-flow')),I=result?.wireCurrents[i]||0;
   const p=wireGeometry(...state.wires[i]),sign=I>=0?1:-1;
   const xy=sample(p,((state.clock*(.2+Math.sqrt(Math.abs(I))*.25)*sign)%1+1)%1);
   node.setAttribute('cx',String(xy[0]));node.setAttribute('cy',String(xy[1]));
  }
 }else if(state.tab==='resistance'||state.tab==='conduction'){
  if(now%100<50)draw();
 }
 w.requestAnimationFrame(t=>tick(t,token));
}
function togglePlay(){if(state.playing){stop();draw();return;}state.playing=true;const token=++runningToken;state.frame=0;state.clock=0;draw();w.requestAnimationFrame(t=>tick(t,token));}
function events(){
 $('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)changeTab(b.dataset.tab);});
 $('settings').addEventListener('click',e=>{
  const preset=e.target.closest('[data-preset]');if(preset){applyPreset(preset.dataset.preset);return;}
  const button=e.target.closest('[data-command]');if(!button)return;
  if(button.dataset.command==='switch'){state.closed=!state.closed;stop();render();}
  if(button.dataset.command==='undo'){state.wires.pop();state.preset='custom';stop();render();}
  if(button.dataset.command==='clear'){state.wires=[];state.preset='custom';stop();render();}
 });
 $('settings').addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset.range&&Object.prototype.hasOwnProperty.call(state,el.dataset.range)){
   state[el.dataset.range]=Number(el.value);
   if(el.dataset.range==='cells'&&state.cells===1)state.reversed=false;
   const out=$(el.dataset.range+'-out');if(out)out.textContent=fmt(Number(el.value),2);
   stop();draw();
  }
  if(el.dataset.select&&Object.prototype.hasOwnProperty.call(state,el.dataset.select)){
   state[el.dataset.select]=el.value;if(el.dataset.select==='batteryMode'&&state.batteryMode==='parallel')state.reversed=false;stop();render();
  }
  if(el.dataset.check&&Object.prototype.hasOwnProperty.call(state,el.dataset.check)){
   state[el.dataset.check]=el.checked;if(el.dataset.check==='reversed'&&state.batteryMode==='parallel')state.reversed=false;stop();render();
  }
 });
 $('play').addEventListener('click',togglePlay);
 $('scene').addEventListener('pointerdown',handleDown,{passive:false});
 $('scene').addEventListener('pointermove',handleMove,{passive:false});
 $('scene').addEventListener('pointerup',handleUp);
 $('scene').addEventListener('pointercancel',e=>{if(state.gesture?.id===e.pointerId){state.gesture=null;state.ghost=null;draw();}});
 $('scene').addEventListener('lostpointercapture',e=>{if(state.gesture?.id===e.pointerId){state.gesture=null;state.ghost=null;draw();}});
 d.addEventListener('visibilitychange',()=>{if(d.hidden){stop();draw();}});
}
function init(){events();render();}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
w.TytDevreApp=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({state:{...state,gesture:null,ghost:null},model:state.tab==='circuit'?M.solve({wires:state.wires,voltage:state.voltage,r:state.r,lamp1:state.lamp1,lamp2:state.lamp2,closed:state.closed}):null})),preset:applyPreset,wire:addWire,stop});
})(window,document);
