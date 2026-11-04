(function(d,M){'use strict';const $=id=>d.getElementById(id),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:3}),clamp=x=>Math.max(1,Math.min(6,Math.round(x*4)/4));
const s={shape:'cube',dimensions:{a:2,b:3,h:3,r:2},saved:null,rows:[],drag:null};
const names={a:'a · en / kenar',b:'b · derinlik',h:'h · yükseklik',r:'r · yarıçap'};
const text=(x,y,value,size=19)=>`<text x="${x}" y="${y}" fill="#edf6f7" font-size="${size}" font-family="system-ui">${value}</text>`;
const line=(x,y,X,Y,extra='')=>`<line x1="${x}" y1="${y}" x2="${X}" y2="${Y}" stroke="#b2d6df" stroke-width="2" ${extra}/>`;
const handle=(x,y,key)=>`<circle cx="${x}" cy="${y}" r="26" class="dimension-handle" data-dimension="${key}"/><text x="${x-6}" y="${y+6}" fill="#132a37" font-family="system-ui" font-size="18" pointer-events="none">${key}</text>`;
function message(v){$('shape-feedback').textContent=v;}
function current(){return M.calculate(s.shape,s.dimensions);}
function renderControls(){$('dimensions').innerHTML=M.keys(s.shape).map(k=>`<label>${names[k]} (cm) <output id="dim-${k}-out"></output><input id="dim-${k}" data-key="${k}" type="range" min="1" max="6" step="0.25" value="${s.dimensions[k]}"></label>`).join('');render();}
function render(){const v=current(),{a,b,h,r}=s.dimensions;let svg='';
 if(s.shape==='cube'||s.shape==='prism'){const x=200,bottom=345,w=a*35,height=(s.shape==='cube'?a:h)*35,depth=(s.shape==='cube'?a*.6:b)*25,y=bottom-height,dy=depth*.6;
 svg+=`<path d="M ${x} ${y} h ${w} v ${height} h ${-w} Z M ${x} ${y} l ${depth} ${-dy} h ${w} l ${-depth} ${dy} M ${x+w} ${y} l ${depth} ${-dy} v ${height} l ${-depth} ${dy}" stroke="#a0ece1" stroke-width="3" fill="#28718a" fill-opacity=".6"/>`;
 svg+=line(x,bottom+20,x+w,bottom+20)+text(x,bottom+62,'a = '+fmt(a)+' cm')+handle(x+w,bottom,'a');
 if(s.shape==='cube')svg+=text(470,410,'Bütün kenarlar a');else svg+=handle(x+w+depth,bottom-dy,'b')+handle(x,y,'h')+text(50,130,'h = '+fmt(h)+' cm')+text(535,300,'b = '+fmt(b)+' cm');
 }else if(s.shape==='cylinder'){const x=390,bottom=350,rx=r*26,ry=rx*.24,top=bottom-h*35;
 svg+=`<path d="M ${x-rx} ${top} v ${h*35} a ${rx} ${ry} 0 0 0 ${rx*2} 0 v ${-h*35}" fill="#2a758e" fill-opacity=".7" stroke="#91e5da" stroke-width="3"/><ellipse cx="${x}" cy="${top}" rx="${rx}" ry="${ry}" fill="#254f63" stroke="#9beddd" stroke-width="3"/>`+line(x,top,x+rx,top)+handle(x+rx,top,'r')+handle(x-rx,top,'h')+text(570,225,'h = '+fmt(h)+' cm')+text(520,405,'r = '+fmt(r)+' cm');
 }else{const x=390,y=230,rr=r*26;svg+=`<circle cx="${x}" cy="${y}" r="${rr}" fill="#286d87" stroke="#a5e8df" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr*.24}" fill="none" stroke="#afd8e3" stroke-dasharray="7 6"/>`+line(x,y,x+rr,y)+handle(x+rr,y,'r')+text(535,420,'r = '+fmt(r)+' cm');}
 svg+=text(40,35,M.names[s.shape],24)+text(40,440,'Sarı uçları sürükle · ölçüleri kur',18);$('shape-drawing').innerHTML=svg;
 for(const k of M.keys(s.shape)){$('dim-'+k).value=s.dimensions[k];$('dim-'+k+'-out').textContent=fmt(s.dimensions[k]);}
 const unit=$('volume-unit').value,number=unit==='dm3'?v.volume/1000:unit==='m3'?v.volume/1e6:v.volume,label={cm3:'cm³',mL:'mL',dm3:'dm³ = '+fmt(v.volume/1000)+' L',m3:'m³'}[unit];
 $('volume-result').textContent='V = '+v.formula+' = '+fmt(number)+' '+label;$('base-result').textContent=v.base===null?'Küre: yarıçapın küpüne bağlı hacim. r yarıçaptır; çap 2r olur.':'Taban alanı '+fmt(v.base)+' cm²; yükseklik '+fmt(s.shape==='cube'?a:h)+' cm. Taban alanı × yükseklik = hacim.';
 const task=M.task(s.shape,$('task-mode').value);$('task-description').textContent=M.names[s.shape]+': '+task.changed+'. Başlangıç: '+dims(task.before.dimensions)+'.';
}
function dims(v){return Object.entries(v).map(([k,n])=>k+'='+fmt(n)).join(' · ');}
function invalidateHypothesis(){s.saved=null;$('hypothesis-status').textContent='Cisim veya deney koşulu değişti. Yeni hipotez kaydet.';}
$('shape').addEventListener('change',()=>{s.shape=$('shape').value;s.drag=null;invalidateHypothesis();renderControls();});$('task-mode').addEventListener('change',()=>{invalidateHypothesis();render();});$('volume-unit').addEventListener('change',render);
$('dimensions').addEventListener('input',e=>{const key=e.target.dataset.key;if(!M.keys(s.shape).includes(key))return;s.dimensions[key]=clamp(Number(e.target.value));render();});
const scene=$('shape-scene');function point(e){const p=scene.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(scene.getScreenCTM().inverse());}
scene.addEventListener('pointerdown',e=>{const node=e.target.closest('[data-dimension]');if(!node||s.drag)return;e.preventDefault();const p=point(e);s.drag={id:e.pointerId,key:node.dataset.dimension,x:p.x,y:p.y,start:s.dimensions[node.dataset.dimension]};scene.setPointerCapture(e.pointerId);});
scene.addEventListener('pointermove',e=>{if(!s.drag||s.drag.id!==e.pointerId)return;e.preventDefault();const p=point(e),t=s.drag,delta=t.key==='h'?(t.y-p.y)/35:(p.x-t.x)/(t.key==='r'?26:t.key==='b'?25:35);s.dimensions[t.key]=clamp(t.start+delta);render();});
function end(e){if(!s.drag||s.drag.id!==e.pointerId)return;s.drag=null;if(scene.hasPointerCapture(e.pointerId))scene.releasePointerCapture(e.pointerId);}scene.addEventListener('pointerup',end);scene.addEventListener('pointercancel',end);scene.addEventListener('lostpointercapture',()=>{s.drag=null;});
$('save-hypothesis').addEventListener('click',()=>{const prediction=Number($('hypothesis').value);if(!prediction){message('Önce bir hipotez seç.');return;}s.saved={shape:s.shape,mode:$('task-mode').value,prediction};$('hypothesis-status').textContent='Tahmin: hacim '+prediction+' kat olacak. Şimdi ilk modeli kur ve kaydet.';});
$('start-task').addEventListener('click',()=>{if(!s.saved){message('Önce hipotezi kaydet.');return;}s.dimensions={...s.dimensions,...M.task(s.shape,s.saved.mode).before.dimensions};render();message('İlk modeli kurdun. Ölçümünü deftere kaydet; sonra değişikliği uygula.');});
$('apply-task').addEventListener('click',()=>{if(!s.saved){message('Önce hipotezi kaydet.');return;}s.dimensions={...s.dimensions,...M.task(s.shape,s.saved.mode).after.dimensions};render();message('Değişikliği uyguladın. İkinci hacmi ölçüp deftere kaydet.');});
$('record-shape').addEventListener('click',()=>{if(!s.saved){message('Ölçümden önce bir hipotez kaydet.');return;}s.rows.push({...current(),hypothesis:{...s.saved}});records();message('Model deftere kaydedildi. Bir veya birden fazla boyutu değiştirip karşılaştır.');});
function records(){$('shape-records').innerHTML=s.rows.map((r,i)=>`<tr><td>${i+1}</td><td>${M.names[r.shape]}</td><td>${dims(r.dimensions)}</td><td>${fmt(r.volume)}</td></tr>`).join('');const last=s.rows.slice(-4),max=Math.max(1,...last.map(r=>r.volume));let b='';last.forEach((r,i)=>{const y=20+i*54;b+=text(0,y+24,'#'+(s.rows.length-last.length+i+1),17)+`<rect x="60" y="${y}" width="${r.volume/max*560}" height="32" fill="#83ddcb"/>`+text(635,y+24,fmt(r.volume),16);});$('volume-bars').innerHTML=b||text(70,110,'Kaydettiğin modellerin hacimleri burada karşılaştırılır.',18);}
function compare(){if(s.rows.length<2)return'Önce iki modeli kaydet.';const a=s.rows.at(-2),b=s.rows.at(-1),r=M.compare(a,b);if(!r.controlled)return r.message;if(!r.changed.length)return'Ölçüler aynı; bir boyutu değiştirip yeni model kaydet.';
 let msg='Değişen: '+r.changed.join(', ')+'. Hacim oranı '+fmt(r.factor)+'. ';
 if(r.similar)msg+='Bütün uzunluklar '+fmt(r.ratios[0])+' kat: hacim bu oranın küpü kadar değişir. ';else msg+='Cisimler benzer büyütülmedi. Formülde değişen boyutların etkisini ayrı ayrı değerlendir. ';
 const task=M.task(b.shape,b.hypothesis.mode),same=(v,w)=>M.keys(v.shape).every(k=>Math.abs(v.dimensions[k]-w.dimensions[k])<1e-7);
 if(same(a,task.before)&&same(b,task.after))msg+=Math.abs(r.factor-b.hypothesis.prediction)<1e-7?'Hipotezin bu deneyle uyumlu.':'Hipotezini düzelt: hacim '+fmt(r.factor)+' kat oldu. Yalnız yarıçapı büyütmek ile bütün uzunlukları büyütmek farklı sonuç verebilir.';else msg+='Kaydettiğin çift, seçilen hipotezin başlangıç/son koşullarıyla aynı değil; hipotezi bu çiftle doğrulama.';
 return msg;
}
$('compare-shapes').addEventListener('click',()=>{$('shape-comparison').textContent=compare();});$('clear-shapes').addEventListener('click',()=>{s.rows=[];records();$('shape-comparison').textContent='Defter temizlendi.';});
$('explain-shape').addEventListener('click',()=>{$('shape-explanation-feedback').textContent=$('shape-explanation').value.trim().length<20?'Değişen boyutları ve hacim formülündeki etkilerini yaz.':'Öz değerlendirme: '+compare()+' Bu araç serbest metnini otomatik bilimsel olarak puanlamaz.';});
$('check-volume-quiz').addEventListener('click',()=>{const v=d.querySelector('input[name="volume-quiz"]:checked')?.value;$('volume-quiz-feedback').textContent=!v?'Bir seçenek seç.':v==='4'?'Doğru: V=πr²h. r iki kat olunca r² dört kat olur; h sabittir.':v==='8'?'8 kat, yarıçap ve yükseklik birlikte iki katına çıkarsa olur. Bu soruda yükseklik sabit; hacim 4 kat olur.':'Yarıçap taban alanına karesiyle etki eder. Yükseklik sabitken yarıçap iki kat, hacim dört kat olur.';});
renderControls();records();
})(document,VolumeExperiment);
