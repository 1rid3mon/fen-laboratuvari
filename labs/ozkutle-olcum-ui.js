(function(d,M){'use strict';
const $=id=>d.getElementById(id),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2}),G=M.G;
const s={material:'aluminum',volume:60,water:150,x:120,y:290,mass:null,volumeReading:null,prediction:'',records:[],drag:null};
const colors={aluminum:'#8de4d4',iron:'#f6bd85',copper:'#ceb8ff'};
function message(text,error=false){$('feedback').textContent=text;$('feedback').dataset.error=String(error);}
const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const text=(x,y,v,size=18)=>`<text x="${x}" y="${y}" font-family="system-ui" font-size="${size}" fill="#edf6f7">${v}</text>`;
const line=(x,y,x2,y2,c='#9bbac9',extra='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2" ${extra}/>`;
function current(){return M.sample(s.material,s.volume);}
function water(){return M.immersion(s);}
function render(){const o=current(),w=water(),weighing=M.onBalance(s.x,s.y,s.volume);let b='';
 b+=rect(60,350,500,12,'#536f7c')+text(80,455,'Tezgâh')+rect(290,350,240,45,'#304c60','rx="10"')+rect(300,395,220,38,'#081c27','rx="6"')+text(317,421,weighing?fmt(o.mass)+' g':'0 g',23)+text(330,470,'İdeal terazi');
 b+=rect(G.left,G.top,200,250,'#173846','stroke="#c7e3ec" stroke-width="3"')+rect(G.left,w.level,200,G.bottom-w.level,'#167ba1','opacity=".85"');
 for(let ml=0;ml<=500;ml+=50){const y=G.bottom-.5*ml;b+=line(850,y,866,y)+text(870,y+5,ml,16);}
 b+=line(640,G.bottom-.5*s.water,855,G.bottom-.5*s.water,'#ffd187','stroke-dasharray="7 5"')+line(650,w.level,850,w.level,'#7ee5ee')+text(650,105,'Dereceli kap (mL)')+text(650,136,'İlk seviye: kesikli çizgi',15);
 b+=rect(s.x,s.y,100,o.height,'#edb77d','rx="4" stroke="#ffe0b2" stroke-width="3"')+rect(s.x-5,s.y-Math.max(0,(64-o.height)/2),110,Math.max(64,o.height),'transparent','data-drag="sample" aria-hidden="true"')+text(s.x+8,s.y+Math.min(24,o.height-4),'Numune',15);
 if(!s.drag||s.drag.kind==='resize')b+=`<circle cx="${s.x+100}" cy="${s.y+o.height}" r="24" fill="#183e51" stroke="#ffcf9b" stroke-width="3" data-drag="resize"/><path d="M ${s.x+90} ${s.y+o.height-6} l 10 12 10 -12" stroke="#ffddb1" fill="none" stroke-width="3" pointer-events="none"/>`;
 b+=text(65,55,'Numune: 2,5 cm × 4 cm × '+fmt(s.volume/10)+' cm',19)+text(65,85,'Alt köşeden boyutu değiştir',16);
 $('drawing').innerHTML=b;$('volume-out').textContent=fmt(s.volume)+' cm³';$('volume').value=s.volume;$('water-out').textContent=fmt(s.water)+' mL';
 $('live').textContent='Terazi: '+(weighing?fmt(o.mass):'0')+' g · Kap okuması: '+fmt(w.reading)+' mL · '+(w.full?'Numune tamamen su altında':w.displaced>0?'Numune kısmen su altında':'Numune suyun dışında');
 $('measurements').textContent='Kaydedilmeyi bekleyen ölçümler · m: '+(s.mass===null?'—':fmt(s.mass)+' g')+' · V: '+(s.volumeReading===null?'—':fmt(s.volumeReading.final-s.volumeReading.initial)+' cm³');
}
function invalidate(){s.mass=null;s.volumeReading=null;}
function bench(){s.x=120;s.y=350-s.volume;}
function move(where){s.drag=null;if(where==='bench')bench();if(where==='balance'){s.x=360;s.y=350-s.volume;}if(where==='water'){s.x=700;s.y=G.bottom-s.volume-5;}if(where==='water'&&!water().full)message('Bu numuneyi tamamen örtmeye su yetmiyor. Başlangıç suyunu artır veya daha küçük numune seç.',true);if(where==='partial'){s.x=700;s.y=G.bottom-.5*s.water-.75*s.volume;}render();}
function changeSample(){s.volume=Number($('volume').value);s.material=$('material').value;invalidate();bench();message('Yeni numune seçtin. Kütle ve hacmini yeniden ölç.');render();}
for(const id of ['volume','material'])$(id).addEventListener('input',changeSample);
$('water').addEventListener('input',()=>{s.water=Number($('water').value);s.volumeReading=null;message('Başlangıç suyu değişti; hacim ölçümünü yenile.');render();});
for(const [id,where] of [['to-bench','bench'],['to-balance','balance'],['to-water','water'],['partial','partial']])$(id).addEventListener('click',()=>move(where));
const scene=$('scene');function point(e){const p=scene.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(scene.getScreenCTM().inverse());}
scene.addEventListener('pointerdown',e=>{const target=e.target.closest('[data-drag]');if(!target||s.drag)return;e.preventDefault();const p=point(e);s.drag={id:e.pointerId,kind:target.dataset.drag,dx:p.x-s.x,dy:p.y-s.y,startY:p.y,startVolume:s.volume};scene.setPointerCapture(e.pointerId);});
scene.addEventListener('pointermove',e=>{if(!s.drag||s.drag.id!==e.pointerId)return;e.preventDefault();const p=point(e);if(s.drag.kind==='resize'){s.volume=M.clamp(Math.round((s.drag.startVolume+p.y-s.drag.startY)/5)*5,25,150);invalidate();bench();}else{s.x=M.clamp(p.x-s.drag.dx,50,820);s.y=M.clamp(p.y-s.drag.dy,110,420-s.volume);}render();});
function end(e){if(!s.drag||s.drag.id!==e.pointerId)return;const kind=s.drag.kind;s.drag=null;if(kind==='sample'&&s.x>=290&&s.x+100<=530&&Math.abs(s.y+s.volume-350)<45)s.y=350-s.volume;if(scene.hasPointerCapture(e.pointerId))scene.releasePointerCapture(e.pointerId);render();}
scene.addEventListener('pointerup',end);scene.addEventListener('pointercancel',end);scene.addEventListener('lostpointercapture',()=>{s.drag=null;});
$('predict').addEventListener('click',()=>{const p=$('prediction').value;if(!p){message('Deneyden önce bir tahmin seç.',true);return;}s.prediction=p;$('prediction-status').textContent='Tahminin kaydedildi. Şimdi aynı maddeden iki farklı parça ölç.';message('Tahmin kaydedildi. Sonucu ölçümlerinle sınayacağız.');});
$('measure-mass').addEventListener('click',()=>{if(!M.onBalance(s.x,s.y,s.volume)){message('Kütleyi ölçmek için numuneyi terazi kefesine yerleştir. Tezgâhta veya suda terazi numunenin kütlesini ölçmez.',true);return;}s.mass=current().mass;message('Kütle ölçüldü. Şimdi numuneyi suya tamamen daldır.');render();});
$('measure-volume').addEventListener('click',()=>{const w=water();if(!w.full){message(w.displaced>0?'Kısmen batırmada su artışı yalnız batmış kısmın hacmidir. Tam hacmi ölçmek için numuneyi tamamen daldır.':'Önce numuneyi dereceli kabın içine tamamen daldır.',true);return;}s.volumeReading={initial:s.water,final:w.reading};message('Hacim ölçüldü: son okuma − ilk okuma. İki ölçümü deftere kaydedebilirsin.');render();});
$('record').addEventListener('click',()=>{if(!s.prediction){message('Önce tahminini kaydet.',true);return;}if(s.mass===null||s.volumeReading===null){message('Aynı numunenin hem kütlesini hem tam batmış hacmini ölçmelisin.',true);return;}const {initial,final}=s.volumeReading,rho=M.densityFromReadings(s.mass,initial,final);s.records.push({material:s.material,mass:s.mass,initial,final,volume:final-initial,density:rho,prediction:s.prediction});invalidate();message('Ölçüm deftere eklendi. Aynı maddeden başka büyüklükte bir parça seç.');render();renderRecords();});
function graph(id,density){const axis=$('density-axis').value,rows=s.records;const maxX=density&&axis==='mass'?1500:150,maxY=density?10:1500;
 let b=line(64,240,440,240)+line(64,240,64,35)+text(64,24,density?'ρ (g/cm³)':'m (g)',16)+text(282,285,density&&axis==='mass'?'m (g)':'V (cm³)',16);
 for(let i=0;i<=3;i++){const x=64+i*120,y=240-i*65;b+=text(x-8,261,fmt(i*maxX/3),13)+line(x,240,x,245)+text(5,y+5,fmt(i*maxY/3),13);}
 for(const material of Object.keys(M.MATERIALS)){const r=rows.filter(r=>r.material===material).sort((a,b)=>a.volume-b.volume);if(!r.length)continue;
  if(r.length>=2){const coords=density?r.map(v=>[v[axis],v.density]):[[0,0],...r.map(v=>[v.volume,v.mass])];b+=`<polyline points="${coords.map(([x,y])=>[64+x/maxX*360,240-y/maxY*195].join(',')).join(' ')}" fill="none" stroke="${colors[material]}" stroke-width="2"/>`;}
  for(const row of r){const x=density?row[axis]:row.volume,y=density?row.density:row.mass;b+=`<circle cx="${64+x/maxX*360}" cy="${240-y/maxY*195}" r="6" fill="${colors[material]}"><title>${M.MATERIALS[material].name}: ${fmt(x)}, ${fmt(y)}</title></circle>`;}
 }if(!rows.length)b+=text(120,135,'Ölçüm yaptıkça noktalar oluşur.',16);$(id).innerHTML=b;
}
function renderRecords(){$('records').innerHTML=s.records.map((r,i)=>`<tr><td>${i+1}</td><td style="color:${colors[r.material]}">${M.MATERIALS[r.material].name}</td><td>${fmt(r.mass)}</td><td>${fmt(r.initial)} / ${fmt(r.final)}</td><td>${fmt(r.volume)}</td><td>${fmt(r.density)}</td></tr>`).join('');graph('mass-graph',false);graph('density-graph',true);}
$('density-axis').addEventListener('change',renderRecords);
function comparison(){if(s.records.length<2)return'En az iki numuneyi ölçüp kaydet.';const a=s.records.at(-2),b=s.records.at(-1),r=M.compare(a,b);if(typeof r==='string')return r;return'V oranı '+fmt(r.volumeRatio)+'; m oranı '+fmt(r.massRatio)+'. İki numunede de m/V = '+fmt(r.densityA)+' g/cm³. Aynı madde, sabit sıcaklık ve basınçta özkütle parça büyüklüğüyle değişmez. '+(b.prediction==='same'?'Tahminin bu ölçümlerle uyumlu.':'Tahminini düzelt: hacim artarken kütle de aynı oranda artar; oran sabit kalır.');}
$('compare').addEventListener('click',()=>{$('comparison').textContent=comparison();});
$('explain').addEventListener('click',()=>{const value=$('explanation').value.trim();$('explanation-feedback').textContent=value.length<20?'Kütlenin ve hacmin nasıl değiştiğini, oranlarına ne olduğunu birkaç cümleyle açıkla.':'Öz değerlendirme: '+comparison()+' Kendi açıklamanda bu üç ilişkiyi kontrol et. Bu araç serbest metninin bilimsel doğruluğunu otomatik puanlamaz.';});
$('quiz-check').addEventListener('click',()=>{const chosen=d.querySelector('input[name="quiz"]:checked');$('quiz-feedback').textContent=!chosen?'Önce bir yanıt seç.':chosen.value==='a'?'Doğru: ρ = 54/20 = 2,7 g/cm³; m = 2,7 × 40 = 108 g. Aynı maddeden iki kat hacim iki kat kütle demektir.':chosen.value==='b'?'Kütle doğru, özkütle yanlış. Hacim ve kütle birlikte iki katına çıkar; m/V oranı yine 2,7 olur.':'Hacim iki katına çıkarken kütle aynı kalmaz. Aynı maddeden ikinci parçanın kütlesi 108 g, özkütlesi 2,7 g/cm³ olur.';});
$('download').addEventListener('click',()=>{if(!s.records.length){message('İndirmek için önce bir ölçüm kaydet.',true);return;}const rows=[['no','material','mass_g','initial_mL','final_mL','volume_cm3','density_g_cm3'],...s.records.map((r,i)=>[i+1,M.MATERIALS[r.material].name,r.mass,r.initial,r.final,r.volume,r.density])];const blob=new Blob(['\ufeff'+rows.map(r=>r.join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=d.createElement('a');a.href=url;a.download='ozkutle-deney-kaydi.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('clear-records').addEventListener('click',()=>{s.records=[];renderRecords();$('comparison').textContent='Defter temizlendi.';});
render();renderRecords();
})(document,DensityExperiment);
