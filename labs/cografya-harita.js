/* TYT Coğrafya · Harita Laboratuvarı — bağımsız statik uygulama.
 * World: Natural Earth country polygons; Turkey: OSM/ODbL provinces.
 * Coğrafi noktalar GeoLabData içindeki WGS84 lon/lat değerlerine dayanır.
 */
(function(window,document){
 'use strict';
 const D=window.GeoLabData;
 if(!D)return;
 const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
 const KEY='begumTYTCografyaV1';
 const INTERVAL=[0,1,3,7,14,30];
 const LOCALE='tr-TR';
 const PATHS={turkey:'cografya-iller.geojson',world:'cografya-dunya.geojson'};
 const BOUNDS={
  turkey:{west:25.4,east:45.25,south:35.45,north:42.6,w:1000,h:520},
  world:{west:-180,east:180,south:-63,north:83,w:1000,h:520}
 };
 const $=id=>document.getElementById(id);
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const geom={world:null,turkey:null},shapeCache={world:null,turkey:null},pending={};
 const S={mode:'explore',area:'turkey',topic:'all',labels:false,province:false,explorePage:0,
  exploreSelection:null,contourSelection:null,question:null,answered:false,choice:null,
  reviewOnly:false,previousQuestion:null,exam:null,save:loadSaved(),viewToken:0};
 let pendingScroll=false;

 function loadSaved(){
  try{
   const data=JSON.parse(window.localStorage.getItem(KEY)||'{}');
   if(data&&data.version===1&&data.items&&typeof data.items==='object')return data;
  }catch(e){}
  return {version:1,items:{}};
 }
 function persist(){
  try{window.localStorage.setItem(KEY,JSON.stringify(S.save));}catch(e){}
 }
 function recordQuestion(q,ok){
  const prev=S.save.items[q.id]||{wrong:0,right:0,box:0,due:0};
  if(ok){prev.right++;prev.box=Math.min(5,prev.box+1);
    prev.due=Date.now()+INTERVAL[prev.box]*86400000;
  }else{prev.wrong++;prev.box=0;prev.due=Date.now();}
  prev.last=Date.now();S.save.items[q.id]=prev;persist();
 }
 function wrongItems(){
  return D.questions.filter(q=>S.save.items[q.id]?.wrong>0);
 }
 function dueItems(){
  return wrongItems().filter(q=>S.save.items[q.id].due<=Date.now());
 }
 function fmtDate(ms){
  try{return new Intl.DateTimeFormat(LOCALE,{day:'numeric',month:'short'}).format(new Date(ms));}
  catch(e){return 'ileride';}
 }
 function shuffled(a){
  let copy=a.slice();
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
 }
 function available(){
  return D.questions.filter(q=>q.area===S.area&&(S.topic==='all'||q.topic===S.topic));
 }
 function itemName(id){return S.area==='contour'?D.contours.find(c=>c.id===id)?.name||id:D.points[id]?.name||id;}
 function pt(id){return D.points[id];}
 function setText(id,value){const el=$(id);if(el)el.textContent=value;}
 function setHTML(id,value){const el=$(id);if(el)el.innerHTML=value;}
 function renderMastery(){
  const all=Object.values(S.save.items);
  const mastered=all.filter(x=>x.box>=2).length;
  setText('mastery',mastered+' pekişen konu/soru · '+dueItems().length+' tekrar zamanı gelen yanlış');
  setText('wrong-count',String(wrongItems().length));
  setText('review-summary',wrongItems().length
   ?wrongItems().length+' soruda en az bir yanlışın var. '+dueItems().length+' sorunun tekrar zamanı geldi; doğru cevaplar aralıklı tekrar sırasına alınır.'
   :'Henüz yanlış kaydı yok. Yanlış yaptığın konumlar burada belirir ve bu cihazda saklanır.');
  setHTML('wrong-list',wrongItems().slice(0,6).map(q=>{
   const st=S.save.items[q.id],name=D.topics.find(t=>t.id===q.topic)?.label||q.topic;
   return '<div class="wrong-entry"><strong>'+esc(name)+'</strong> · '
    +esc(q.area==='turkey'?'Türkiye':q.area==='world'?'Dünya':'İzohips')
    +'<div>Yanlış: '+st.wrong+' · Tekrar: '+(st.due<=Date.now()?'şimdi':fmtDate(st.due))+'</div></div>';
  }).join('')||'<div class="empty-state">İlk sorunu çözdüğünde yanlış defterin burada çalışmaya başlar. 🦋</div>');
 }
 function markTabs(){
  document.querySelectorAll('[data-mode]').forEach(b=>{
   const current=b.dataset.mode===S.mode;b.classList.toggle('active',current);b.setAttribute('aria-pressed',String(current));
  });
  document.querySelectorAll('[data-area]').forEach(b=>{
   const current=b.dataset.area===S.area;b.classList.toggle('active',current);b.setAttribute('aria-pressed',String(current));
  });
  $('label-toggle-wrap').classList.toggle('hidden',S.mode!=='explore'||S.area==='contour');
  $('province-button').classList.toggle('hidden',S.area!=='turkey');
  $('province-button').textContent='İl sınırları: '+(S.province?'Açık':'Kapalı');
  $('province-button').setAttribute('aria-pressed',String(S.province));
  $('new-question').textContent=S.mode==='explore'?'↻ Sonraki konumlar':S.mode==='recall'?'↻ Başka soru':'↻ Yeni mini deneme';
  $('review-button').textContent=S.reviewOnly?'✓ Yanlışlarım modu açık':'✦ Yanlışlarımı tekrarla';
 }
 function selectTopics(){
  const availableTopics=new Set(D.questions.filter(q=>q.area===S.area).map(q=>q.topic));
  const choices=S.area==='contour'?[D.topics.find(t=>t.id==='izohips')]:
   D.topics.filter(t=>t.id==='all'||availableTopics.has(t.id));
  if(!choices.some(t=>t.id===S.topic))S.topic=S.area==='contour'?'izohips':'all';
  setHTML('topic-select',choices.map(t=>'<option value="'+esc(t.id)+'"'+(S.topic===t.id?' selected':'')+'>'+esc(t.label)+'</option>').join(''));
  $('topic-select').disabled=choices.length===1;
 }
 function project(area,lon,lat){
  const b=BOUNDS[area];
  return {x:(lon-b.west)/(b.east-b.west)*b.w,
   y:(b.north-lat)/(b.north-b.south)*b.h};
 }
 function polyRings(g){
  if(!g)return [];
  if(g.type==='Polygon')return g.coordinates;
  if(g.type==='MultiPolygon')return g.coordinates.flat();
  return [];
 }
 function pathFor(g,area){
  const b=BOUNDS[area];let path='';
  for(const ring of polyRings(g)){
   if(!Array.isArray(ring)||ring.length<3)continue;
   let prev=null,drawn=0;
   for(const xy of ring){
    if(!Array.isArray(xy)||xy.length<2)continue;
    const lon=Number(xy[0]),lat=Number(xy[1]);
    if(!Number.isFinite(lon)||!Number.isFinite(lat))continue;
    const p=project(area,lon,lat);
    // Antimeridian: a 300° segment is a wrap, not a diagonal across the globe.
    const jump=prev&&Math.abs(lon-prev.lon)>180;
    path+=(drawn===0||jump?'M':'L')+p.x.toFixed(1)+' '+p.y.toFixed(1)+' ';
    drawn++;prev={lon,lat};
   }
   if(drawn>2)path+='Z ';
  }
  return path.trim();
 }
 function geometrySVG(area){
  if(shapeCache[area])return shapeCache[area];
  const x=geom[area];
  if(!x||!Array.isArray(x.features))return '';
  const b=BOUNDS[area];
  const paths=x.features.map(f=>{
   const d=pathFor(f.geometry,area);
   if(!d)return '';
   const name=area==='turkey'?(f.properties?.il_adi||'il'):(f.properties?.name||'ülke');
   return '<path class="'+(area==='turkey'?'province'+(S.province?'':' calm'):'land')
    +'" d="'+d+'" data-feature="'+esc(name)+'"/>';
  }).join('');
  // Stroke toggled by CSS class on entire map; polygons remain geographically grounded.
  shapeCache[area]='<g class="shape-set">'+paths+'</g>';
  return shapeCache[area];
 }
 function loadGeometry(area){
  if(geom[area])return Promise.resolve(geom[area]);
  if(pending[area])return pending[area];
  pending[area]=fetch(PATHS[area],{cache:'force-cache'}).then(res=>{
   if(!res.ok)throw Error('HTTP '+res.status);
   return res.json();
  }).then(json=>{
   if(!Array.isArray(json.features)||json.features.length<1)throw Error('Geometri eksik');
   geom[area]=json;shapeCache[area]=null;return json;
  }).finally(()=>{pending[area]=null;});
  return pending[area];
 }
 function mapGraticule(area){
  const b=BOUNDS[area],lats=area==='world'?[-60,-30,0,30,60]:[36,38,40,42];
  const longs=area==='world'?[-120,-60,0,60,120]:[28,32,36,40,44];
  let out='';
  for(const lat of lats){const p=project(area,0,lat);out+='<path class="gridline" d="M0 '+p.y+' H'+b.w+'"/>';if(area==='world')out+='<text class="lat-label" x="7" y="'+(p.y-6)+'">'+(lat===0?'Ekvator':Math.abs(lat)+'° '+(lat>0?'K':'G'))+'</text>';}
  for(const lon of longs){const p=project(area,lon,0);out+='<path class="gridline" d="M'+p.x+' 0 V'+b.h+'"/>';}
  return '<g aria-hidden="true">'+out+'</g>';
 }
 function svgMarkers(ids,letters,labels,selected,revealed,answer){
  const entries=ids.map((id,i)=>{
   const p=pt(id);if(!p)return null;
   const pos=project(S.area,p.lon,p.lat);
   return {id,i,x:pos.x,y:pos.y,mx:pos.x,my:pos.y};
  }).filter(Boolean),placed=[];
  // Small leader line separates close city markers without moving the true geographic anchor.
  return entries.map(item=>{
   const b=BOUNDS[S.area];let attempts=0;
   while(placed.some(p=>Math.hypot(p.x-item.mx,p.y-item.my)<38)&&attempts<6){
    const sign=attempts%2===0?1:-1;
    item.mx=clamp(item.x+sign*(32+Math.floor(attempts/2)*16),22,b.w-22);
    item.my=clamp(item.y+(attempts%3===0?-31:31),22,b.h-22);
    attempts++;
   }
   placed.push({x:item.mx,y:item.my});
   const cls=item.id===selected?' selected':'';
   const resolved=revealed&&answer?(item.id===answer?' correct':item.id===selected?' wrong':''):'';
   const p=pt(item.id);
   const leader=Math.hypot(item.mx-item.x,item.my-item.y)>5?
    '<line x1="'+item.x.toFixed(1)+'" y1="'+item.y.toFixed(1)+'" x2="'+item.mx.toFixed(1)+'" y2="'+item.my.toFixed(1)+'" stroke="#757d80" stroke-width="1.5"/><circle cx="'+item.x.toFixed(1)+'" cy="'+item.y.toFixed(1)+'" r="3" fill="#596268"/>':'';
   const caption=labels?'<text class="label" x="'+(item.mx+18).toFixed(1)+'" y="'+(item.my-18).toFixed(1)+'">'+esc(p.name)+'</text>':'';
   return '<g class="pin'+cls+resolved+'" data-mark-id="'+esc(item.id)+'" role="button" tabindex="0" aria-label="'+(letters?ROMAN[item.i]+' numaralı nokta': 'Konum '+(item.i+1))+'">'
    +leader+'<circle cx="'+item.mx.toFixed(1)+'" cy="'+item.my.toFixed(1)+'" r="16"/>'
    +'<text x="'+item.mx.toFixed(1)+'" y="'+(item.my+.5).toFixed(1)+'">'+esc(ROMAN[item.i]||String(item.i+1))+'</text>'
    +caption+'</g>';
  }).join('');
 }
 function geographyView(ids,letters,labels,selected,revealed,answer){
  const b=BOUNDS[S.area];
  const legend=S.area==='turkey'?'TÜRKİYE · TYT HARİTA SORULARI':'DÜNYA · TYT HARİTA SORULARI';
  const base='<rect class="ocean" width="'+b.w+'" height="'+b.h+'"/>'+mapGraticule(S.area)
    +'<g class="'+(S.province?'borders-on':'borders-off')+'">'+geometrySVG(S.area)+'</g>';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+b.w+' '+b.h+'" role="img" aria-label="'+esc(legend)+'" preserveAspectRatio="xMidYMid meet">'+base
   +'<text class="title-small" x="'+(b.w-20)+'" y="28" text-anchor="end">'+esc(legend)+'</text>'
   +svgMarkers(ids,letters,labels,selected,revealed,answer)+'</svg>';
  setHTML('map',svg);
  $('map').setAttribute('aria-label',legend);
 }
 function contourSVG(id){
  const prefix='<svg viewBox="0 0 230 110" role="img" aria-label="Şematik izohips eğrileri" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="228" height="108" rx="7" fill="#fafaf9"/>';
  let s='';
  if(id==='hill'){
   for(const [rx,ry] of [[91,49],[65,36],[37,22]])s+='<ellipse class="contour-line" cx="115" cy="56" rx="'+rx+'" ry="'+ry+'"/>';
   s+='<circle cx="115" cy="56" r="3.5" fill="#787878"/>';
  }else if(id==='valley'){
   for(const y of [37,65,93])s+='<path class="contour-line" d="M10 '+y+' L115 '+(y-27)+' L220 '+y+'"/>';
   s+='<path class="contour-flow" d="M115 4 V108"/><path d="M109 96 L115 106 L121 96" fill="none" stroke="#9b9b97" stroke-width="1.5"/>';
  }else if(id==='ridge'){
   for(const y of [5,32,59])s+='<path class="contour-line" d="M10 '+y+' L115 '+(y+27)+' L220 '+y+'"/>';
   s+='<path class="contour-flow" d="M115 6 V105"/>';
  }else if(id==='steep'){
   for(const x of [37,53,67,79,89,98,107,116,130,160,198])s+='<path class="contour-line" d="M'+x+' 8 L'+(x+13)+' 100"/>';
  }else if(id==='saddle'){
   s+='<path class="contour-line" d="M10 60 C8 0 58 -4 96 31 C122 51 121 51 139 31 C181 -4 223 0 222 60 C222 108 181 114 139 80 C121 63 120 63 96 80 C56 114 10 112 10 60Z"/>';
   for(const x of [60,170]){
    s+='<ellipse class="contour-line" cx="'+x+'" cy="56" rx="34" ry="32"/>';
    s+='<ellipse class="contour-line" cx="'+x+'" cy="56" rx="17" ry="17"/>';
   }
  }
  return prefix+s+'</svg>';
 }
 function contourView(ids,selected,revealed,answer,labels){
  const html='<div class="contour-set" role="group" aria-label="Beş izohips şekli">'
   +ids.map((id,i)=>{
    const d=D.contours.find(x=>x.id===id),cls=(selected===id?' selected':'')+(revealed&&answer?(id===answer?' correct':id===selected?' wrong':''):'');
    return '<button type="button" class="contour-choice'+cls+'" data-mark-id="'+esc(id)+'" aria-label="'+ROMAN[i]+' numaralı izohips şekli">'
     +contourSVG(id)+'<b>'+ROMAN[i]+(labels?' · '+esc(d.name):'')+'</b></button>';
   }).join('')+'</div><p class="legend-small">Beş gri izohips çizimi temsili topoğrafya şemasıdır. Eğriler yükseklikleri gösterir; çizimler gerçek bir yerin topoğrafya verisi değildir.</p>';
  setHTML('map',html);
 }
 function getExploreItems(){
  if(S.area==='contour')return D.contours.map(x=>x.id);
  const all=Object.values(D.points).filter(p=>p.area===S.area&&(S.topic==='all'||p.tags.includes(S.topic)));
  const size=8,offset=(S.explorePage*size)%Math.max(all.length,1);
  // Pick an unsaturated page: exclude points too close together when possible.
  const take=[],span=[];
  for(let n=0;n<all.length&&take.length<size;n++){
   const p=all[(offset+n)%all.length],xy=project(S.area,p.lon,p.lat);
   if(span.every(other=>Math.hypot(xy.x-other.x,xy.y-other.y)>=49)){take.push(p.id);span.push(xy);}
  }
  for(const p of all){if(take.length>=size)break;if(!take.includes(p.id))take.push(p.id);}
  return take;
 }
 function currentQuestion(){
  return S.mode==='recall'?S.question:S.exam?.items[S.exam.index]||null;
 }
 function drawCurrentMap(){
  const token=++S.viewToken;
  const q=currentQuestion();
  const ids=S.mode==='explore'?getExploreItems():(q?.pins||[]);
  const labels=S.mode==='explore'&&S.labels;
  const selected=S.mode==='explore'?(S.area==='contour'?S.contourSelection:S.exploreSelection):S.mode==='recall'?S.choice:S.exam?.selection;
  const reveal=S.mode==='recall'&&S.answered;
  const answer=q?.answer||null;
  setText('pin-counter',ids.length+' işaret');
  setText('map-caption',S.area==='contour'
   ?'İzohipsler öğretim amaçlı şemalardır; V şeklinin yönünü ve eğrilerin sıklığını incele.'
   :'Gri harita gerçek koordinat ve sınır geometrilerine dayanır; sorularda yer adları gizlidir.');
  if(S.area==='contour'){contourView(ids,selected,reveal,answer,labels);return;}
  setHTML('map','<div class="loading">Gerçek sınırlar yükleniyor…</div>');
  loadGeometry(S.area).then(()=>{
   if(token!==S.viewToken)return;
   geographyView(ids,S.mode!=='explore',labels,selected,reveal,answer);
  }).catch(()=>{
   if(token!==S.viewToken)return;
   setHTML('map','<div class="empty-state">Harita geometrisi yüklenemedi. İnternet bağlantısı veya dosya erişimini kontrol edip sayfayı yenile. Bu görünümde konumları tahmin etmeye zorlama.</div>');
  });
 }
 function topicLabel(id){return D.topics.find(t=>t.id===id)?.label||id;}
 function pointDetail(id){
  const p=S.area==='contour'?D.contours.find(c=>c.id===id):pt(id);
  if(!p)return '<div class="empty-state">Bir nokta seç.</div>';
  return '<div class="lesson-card"><h3>'+esc(p.name)+'</h3><p>'+esc(p.detail)+'</p><p class="rule">TYT ipucu: '+esc(p.rule)+'</p>'
   +(S.area==='contour'?'':'<p class="notice">Yaklaşık koordinat: '+p.lat.toFixed(2)+'° enlem, '+p.lon.toFixed(2)+'° boylam</p>')
   +'</div>';
 }
 function setResult(msg,kind){
  const box=$('result');box.className='result'+(kind?' '+kind:'');box.textContent=msg||'';
 }
 function setActions(html){setHTML('question-actions',html||'');}
 function showExplore(){
  const ids=getExploreItems(),sel=S.area==='contour'?S.contourSelection:S.exploreSelection;
  setText('scene-kicker','KEŞFET • '+(S.area==='contour'?'İZOHİPS':S.area==='turkey'?'TÜRKİYE':'DÜNYA'));
  setText('map-title',S.area==='contour'?'İzohips şekilleri':S.area==='turkey'?'Türkiye · İsimsiz Harita':'Dünya · İsimsiz Harita');
  setText('scene-description','Noktaya dokun, bilgiyi gör; sonra isimleri kapatıp hatırlamayı dene.');
  setText('lesson-label','KEŞİF KARTI');
  setText('prompt-heading',sel?itemName(sel):'Haritadaki bir noktayı seç.');
  setText('prompt-detail','Haritadaki gri harfli noktalara dokun. Önce nedenini öğren, sonra Hatırla modunda kendini sınav yap.');
  setHTML('answer-options','');
  setResult('');
  setHTML('lesson',sel?pointDetail(sel):'<div class="empty-state">Bir harfli işarete dokunduğunda o yerin iklim, yer şekli, ekonomi veya afet açısından TYT ipucu burada açılır. 🦋</div>');
  setActions('<button type="button" class="primary" data-action="goto-recall">Hatırla moduna geç →</button>');
 }
 function sourceEligible(){
  const a=available();
  if(!S.reviewOnly)return a;
  const ids=new Set(wrongItems().map(x=>x.id));
  const filtered=a.filter(q=>ids.has(q.id));
  return filtered;
 }
 function chooseRecall(){
  let qs=sourceEligible();
  if(!qs.length){S.question=null;S.answered=false;S.choice=null;return;}
  const due=qs.filter(q=>S.save.items[q.id]&&S.save.items[q.id].due<=Date.now());
  if(due.length)qs=due;
  const fresh=qs.filter(q=>q.id!==S.previousQuestion);
  S.question=shuffled(fresh.length?fresh:qs)[0]||null;
  S.previousQuestion=S.question?.id||null;S.answered=false;S.choice=null;
 }
 function presentQuestion(){
  const q=currentQuestion();
  if(!q){showEmptyQuestion();return;}
  const test=S.mode==='exam',idx=test?(S.exam.index+1):null;
  setText('scene-kicker',test?'TYT MİNİ DENEME · '+idx+' / '+S.exam.items.length:'HATIRLA · AKTİF HATIRLAMA');
  setText('map-title',S.area==='contour'?'İzohips test haritası':S.area==='world'?'Dünya haritası':'Türkiye haritası');
  setText('scene-description','İşaretler I, II, III, IV, V. Yer adları gizlidir. Harfleri inceleyerek karar ver.');
  setText('lesson-label',test?'TYT COĞRAFYA · '+idx+'. SORU':'KONU · '+topicLabel(q.topic));
  setText('prompt-heading',q.prompt);
  setText('prompt-detail',test?'Cevap için haritadan bir işaret veya aşağıdaki harfi seç; sınavda doğru cevaplar sonuç ekranına kadar açıklanmaz.'
    :'Haritadaki beş işareti karşılaştır. Önce tahmin et, sonra cevabını kontrol et.');
  renderOptions(q);
  const answered=S.mode==='recall'&&S.answered;
  setResult(answered?(S.choice===q.answer?'Doğru! Yeri ve nedeni doğru eşleştirdin.':'Yanlış. Doğru konum '+ROMAN[q.pins.indexOf(q.answer)]+': '+itemName(q.answer)+'.'): '',answered?(S.choice===q.answer?'success':'error'):'');
  setHTML('lesson',answered?'<div class="lesson-card"><h3>🧠 Neden bu cevap?</h3><p>'+esc(q.why)+'</p><p class="rule">Doğru: '+ROMAN[q.pins.indexOf(q.answer)]+' — '+esc(itemName(q.answer))+'</p></div>':'');
  if(S.mode==='recall'){
   setActions(answered?'<button type="button" class="primary" data-action="next-recall">Başka soru →</button>'
    :'<button type="button" class="primary" data-action="submit-recall" '+(!S.choice?'disabled':'')+'>Cevabı kontrol et</button>');
  }else{
   const n=S.exam.items.length,isLast=S.exam.index===n-1;
   setActions('<button type="button" class="primary" data-action="submit-exam" '+(!S.exam.selection?'disabled':'')+'>'
    +(isLast?'Cevapla ve sonucu gör':'Cevabı kaydet →')+'</button>'
    +'<button type="button" class="secondary" data-action="skip-exam">'+(isLast?'Boş bırak ve bitir':'Boş bırak →')+'</button>');
  }
 }
 function renderOptions(q){
  const selected=S.mode==='exam'?S.exam.selection:S.choice;
  const revealed=S.mode==='recall'&&S.answered;
  setHTML('answer-options',q.pins.map((key,i)=>{
   const cls=(selected===key?' selected':'')
    +(revealed?(q.answer===key?' correct':selected===key?' wrong':''):'');
   return '<button type="button" class="'+cls+'" data-answer="'+esc(key)+'" aria-pressed="'+(selected===key)+'" '
    +(revealed?'disabled':'')+'><span class="letter">'+ROMAN[i]+'</span><span>'+ROMAN[i]+'. numaralı nokta</span></button>';
  }).join(''));
 }
 function showEmptyQuestion(){
  setText('scene-kicker',S.reviewOnly?'TEKRAR DEFTERİ':'HATIRLA');
  setText('map-title','Bu filtrede soru bulunamadı');
  setText('scene-description','Konu veya bölgeyi değiştir.');
  setText('lesson-label','SORU YOK');
  setText('prompt-heading',S.reviewOnly?'Bu alanda yanlışın henüz yok. 🎉':'Bu alanda soru bulunamadı.');
  setText('prompt-detail','Yanlışlarım filtresini kapatabilir, başka bir alan seçebilir veya keşif moduna dönebilirsin.');
  setHTML('answer-options','');setHTML('lesson','');setResult('');
  setActions('<button type="button" class="primary" data-action="toggle-review">Tüm soruları göster</button>');
 }
 function selectAnswer(id){
  const q=currentQuestion();
  if(!q||!q.pins.includes(id))return;
  if(S.mode==='explore'){
   if(S.area==='contour')S.contourSelection=id;else S.exploreSelection=id;
   showExplore();drawCurrentMap();return;
  }
  if(S.mode==='recall'){
   if(S.answered)return;
   S.choice=id;presentQuestion();drawCurrentMap();return;
  }
  if(S.mode==='exam'&&!S.exam.finished){
   S.exam.selection=id;presentQuestion();drawCurrentMap();
  }
 }
 function submitRecall(){
  if(!S.question||S.answered||!S.choice)return;
  S.answered=true;
  recordQuestion(S.question,S.choice===S.question.answer);
  renderMastery();presentQuestion();drawCurrentMap();
 }
 function chooseExam(){
  const bank=sourceEligible();
  if(!bank.length){S.exam=null;return;}
  const due=bank.filter(q=>S.save.items[q.id]?.due<=Date.now()&&S.save.items[q.id]?.wrong>0);
  const picked=[],topics=new Set();
  for(const q of shuffled(due)){if(picked.length>=5)break;if(!picked.some(x=>x.id===q.id)){picked.push(q);topics.add(q.topic);}}
  for(const q of shuffled(bank)){if(picked.length>=5)break;if(!topics.has(q.topic)&&!picked.some(x=>x.id===q.id)){picked.push(q);topics.add(q.topic);}}
  for(const q of shuffled(bank)){if(picked.length>=5)break;if(!picked.some(x=>x.id===q.id))picked.push(q);}
  S.exam={items:picked,index:0,answers:[],selection:null,finished:false};
 }
 function submitExam(skip){
  if(!S.exam||S.exam.finished)return;
  if(!skip&&!S.exam.selection)return;
  const answer=skip?null:S.exam.selection;
  S.exam.answers[S.exam.index]=answer;
  if(S.exam.index===S.exam.items.length-1){
   finishExam();return;
  }
  S.exam.index++;S.exam.selection=null;
  presentQuestion();drawCurrentMap();
 }
 function finishExam(){
  const e=S.exam;if(!e||e.finished)return;
  e.finished=true;
  let good=0,bad=0,blank=0;
  const rows=e.items.map((q,i)=>{
   const choice=e.answers[i],ok=choice===q.answer;
   if(!choice)blank++;else if(ok)good++;else bad++;
   if(choice)recordQuestion(q,ok);
   return {q,choice,ok};
  });
  renderMastery();
  const net=good-bad/4;
  setText('scene-kicker','TYT MİNİ DENEME SONUCU');
  setText('map-title','Deneme tamamlandı');
  setText('scene-description','Yanlışlarını incele; sonra aynı tür soruları tekrar çöz.');
  setText('lesson-label','SONUÇ RAPORU');
  setText('prompt-heading','5 soruluk harita sınavı bitti! 🦋');
  setText('prompt-detail','Doğrular ve yanlışlar kaydedildi. ÖSYM soru dağılımı simülasyonu değildir; özel hazırlanmış TYT harita alıştırmasıdır.');
  setHTML('answer-options','');
  const html='<div class="summary-score"><strong>'+good+' doğru · '+bad+' yanlış · '+blank+' boş</strong><p>Net: '+net.toLocaleString(LOCALE,{maximumFractionDigits:2})+' · (doğru − yanlış / 4)</p></div>'
   +rows.map((r,i)=>'<div class="wrong-entry"><strong>'+(i+1)+'. soru · '+(r.ok?'✓ Doğru':r.choice?'✕ Yanlış':'— Boş')+'</strong>'
    +'<div>'+esc(r.q.prompt)+'</div><div>Doğru: '+ROMAN[r.q.pins.indexOf(r.q.answer)]+' · '+esc(D.points[r.q.answer]?.name||D.contours.find(x=>x.id===r.q.answer)?.name||'')
    +'</div><div>'+esc(r.q.why)+'</div></div>').join('');
  setHTML('lesson',html);
  setResult(bad>0?'Yanlışların Hatırla modundaki tekrar defterine eklendi.':'Tamamlandı. Dilersen yeni bir sınavla devam et.',bad>0?'error':'success');
  setActions('<button type="button" class="primary" data-action="new-exam">Yeni 5 soru →</button><button type="button" class="secondary" data-action="review">Yanlışlarımı tekrar et</button>');
  // Do not reveal answer on the map itself; the summary lists explanations.
  drawCurrentMap();
 }
 function renderState(){
  markTabs();renderMastery();
  if(S.mode==='explore')showExplore();
  else if(S.mode==='recall')presentQuestion();
  else if(!S.exam)showEmptyQuestion();
  else if(S.exam.finished){finishExam();return;}
  else presentQuestion();
  drawCurrentMap();
 }
 function switchMode(mode){
  if(!['explore','recall','exam'].includes(mode))return;
  S.mode=mode;S.answered=false;S.choice=null;
  if(mode==='recall')chooseRecall();
  if(mode==='exam')chooseExam();
  renderState();
 }
 function switchArea(area){
  if(!['turkey','world','contour'].includes(area))return;
  S.area=area;S.topic=area==='contour'?'izohips':'all';S.explorePage=0;
  S.exploreSelection=null;S.contourSelection=null;
  selectTopics();
  if(S.mode==='recall')chooseRecall();
  if(S.mode==='exam')chooseExam();
  renderState();
 }
 function updateTopic(topic){
  if(!D.topics.some(t=>t.id===topic))return;
  S.topic=topic;S.explorePage=0;S.exploreSelection=null;S.contourSelection=null;
  if(S.mode==='recall')chooseRecall();
  if(S.mode==='exam')chooseExam();
  renderState();
 }
 function advance(){
  if(S.mode==='explore'){
   if(S.area==='contour')S.contourSelection=null;
   else{S.explorePage++;S.exploreSelection=null;}
  }else if(S.mode==='recall')chooseRecall();
  else chooseExam();
  renderState();
 }
 function review(){
  S.reviewOnly=!S.reviewOnly;
  if(S.reviewOnly){S.mode='recall';S.answered=false;chooseRecall();}
  else if(S.mode==='recall')chooseRecall();
  else if(S.mode==='exam')chooseExam();
  renderState();
 }
 function triggerAction(action){
  if(action==='goto-recall')switchMode('recall');
  else if(action==='submit-recall')submitRecall();
  else if(action==='next-recall')advance();
  else if(action==='submit-exam')submitExam(false);
  else if(action==='skip-exam')submitExam(true);
  else if(action==='new-exam')advance();
  else if(action==='review'){if(!S.reviewOnly)review();else switchMode('recall');}
  else if(action==='toggle-review'){S.reviewOnly=false;chooseRecall();renderState();}
 }
 function boot(){
  if(!$('mode-tabs')||!$('map')||!$('topic-select'))return;
  $('mode-tabs').addEventListener('click',e=>{
   const b=e.target.closest('[data-mode]');if(b)switchMode(b.dataset.mode);
  });
  $('area-tabs').addEventListener('click',e=>{
   const b=e.target.closest('[data-area]');if(b)switchArea(b.dataset.area);
  });
  $('topic-select').addEventListener('change',e=>updateTopic(e.target.value));
  $('label-toggle').addEventListener('change',e=>{S.labels=!!e.target.checked;drawCurrentMap();});
  $('province-button').addEventListener('click',()=>{
   S.province=!S.province;
   $('province-button').textContent='İl sınırları: '+(S.province?'Açık':'Kapalı');
   $('province-button').setAttribute('aria-pressed',String(S.province));
   drawCurrentMap();
  });
  $('map').addEventListener('click',e=>{
   const b=e.target.closest('[data-mark-id]');
   if(b)selectAnswer(b.dataset.markId);
  });
  $('map').addEventListener('keydown',e=>{
   if(e.key!=='Enter'&&e.key!==' ')return;
   const b=e.target.closest('[data-mark-id]');
   if(b){e.preventDefault();selectAnswer(b.dataset.markId);}
  });
  $('answer-options').addEventListener('click',e=>{
   const b=e.target.closest('[data-answer]');
   if(b&&!b.disabled)selectAnswer(b.dataset.answer);
  });
  $('question-actions').addEventListener('click',e=>{
   const b=e.target.closest('[data-action]');
   if(b&&!b.disabled)triggerAction(b.dataset.action);
  });
  $('new-question').addEventListener('click',advance);
  $('review-button').addEventListener('click',review);
  $('clear-progress').addEventListener('click',()=>{
   if(!window.confirm('Yanlışlarım haritasındaki bütün öğrenme kayıtları silinsin mi?'))return;
   S.save={version:1,items:{}};persist();S.reviewOnly=false;
   if(S.mode==='recall')chooseRecall();if(S.mode==='exam')chooseExam();renderState();
  });
  selectTopics();renderState();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
 else boot();
 // Read-only model diagnostics for automated tests. No privileged mutators.
 window.GeoLabInspection=Object.freeze({getInfo:()=>({
   mode:S.mode,area:S.area,topic:S.topic,questionCount:D.questions.length,
   locations:D.stats.locationCount,examIndex:S.exam?.index??null,wrong:wrongItems().length,
   hasWorldGeometry:!!geom.world,hasTurkeyGeometry:!!geom.turkey
 })});
})(window,document);