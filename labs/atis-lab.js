/* AYT 2018 MEB projectile lab. Controls never re-mount during slider dragging. */
(function(w,d){
'use strict';
const M=w.AtisMath,R=w.AtisRender,Q=w.AtisQuestions,P=w.HareketMath;
if(!M||!R||!Q||!P)return;
const $=id=>d.getElementById(id),H=P.escapeHtml,F=P.f;
const tabs=[['horizontal','Yatay Atış'],['oblique','Eğik Atış'],['elevated','Yüksekten Eğik Atış'],
 ['compare','Açı & Menzil'],['target','Hedefi Vur'],['graphs','Grafikler & Bileşenler'],['quiz','YKS Mini Test']];
const defaults={
 horizontal:{speed:18,angleDeg:0,height:80,g:10,time:0,schoolAngles:true},
 oblique:{speed:24,angleDeg:45,height:0,g:10,time:0,schoolAngles:true},
 elevated:{speed:24,angleDeg:37,height:40,g:10,time:0,schoolAngles:true},
 compare:{speed:24,angleA:30,angleB:60,g:10,time:0,schoolAngles:true},
 target:{speed:26,angleDeg:35,height:40,targetX:90,g:10,time:0,schoolAngles:false},
 graphs:{speed:25,angleDeg:53,height:20,g:10,time:0,schoolAngles:true},
 quiz:{index:0,choice:null,checked:false,score:0,attempts:0}
};
const state={tab:'horizontal',playing:false,raf:null,last:0,vectors:true,trace:true,trial:null,trials:0,solution:false};
for(const [key,value]of Object.entries(defaults))state[key]=JSON.parse(JSON.stringify(value));
const details={
 horizontal:['Yatay Atış · Sabit vₓ, ivmeli vᵧ','Yatay hız sabit kalırken düşeyde serbest düşme yaşanır.'],
 oblique:['Eğik Atış · İki Bileşen','Aynı seviyeden atışta yörünge, tepe, menzil ve uçuş süresini birlikte incele.'],
 elevated:['Yüksekten Eğik Atış','Başlangıç ve iniş yüksekliği farklı; aşağı yönlü açıları da dene.'],
 compare:['Açı ve Menzil Karşılaştırması','Aynı hız ve yerçekiminde iki atışın yörüngesini kıyasla.'],
 target:['Hedefi Vur','Açıyı tahmin et ve dene. İstersen teorik çözüm açılarını göster.'],
 graphs:['Hareketi Grafiklerden Oku','x(t), y(t), vₓ(t), vᵧ(t) birlikte güncellenir.'],
 quiz:['YKS · İki Boyutta Hareket','2018 MEB kazanımlarından 20 özgün açıklamalı soru.']
};
function modelList(){
 const s=state[state.tab];
 if(state.tab==='compare')return [
  M.projectile({speed:s.speed,angleDeg:s.angleA,height:0,g:s.g,schoolAngles:s.schoolAngles}),
  M.projectile({speed:s.speed,angleDeg:s.angleB,height:0,g:s.g,schoolAngles:s.schoolAngles})];
 return [M.projectile({speed:s.speed,angleDeg:s.angleDeg,height:s.height,g:s.g,schoolAngles:s.schoolAngles})];
}
function endTime(){return Math.max(.01,...modelList().map(x=>x.impactTime));}
function slider(key,title,min,max,step,value,unit){
 return '<div class="control"><div class="control-top"><label for="pr-'+H(key)+'">'+H(title)+'</label>'
 +'<output id="pr-out-'+H(key)+'">'+H(F(value,unit))+'</output></div>'
 +'<input id="pr-'+H(key)+'" type="range" data-range="'+H(key)+'" data-unit="'+H(unit||'')+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'"></div>';
}
function selector(key,title,options,value){
 return '<div class="control"><label for="pr-'+key+'">'+H(title)+'</label>'
 +'<select id="pr-'+key+'" data-select="'+key+'">'
 +options.map(pair=>'<option value="'+H(pair[0])+'"'+(pair[0]===value?' selected':'')+'>'+H(pair[1])+'</option>').join('')
 +'</select></div>';
}
function btn(title,action,pressed=false,disabled=false){
 return '<button class="btn'+(['play','shoot'].includes(action)?' primary':'')+'" type="button" data-action="'+action+'" aria-pressed="'+pressed+'" '+(disabled?'disabled':'')+'>'+H(title)+'</button>';
}
function controls(){
 const t=state.tab,s=state[t];
 if(t==='quiz'){$('controls').innerHTML='<p class="muted">Beş seçenekli alıştırmalar. Seçeneği işaretle ve çözümü kontrol et.</p>';return;}
 let h=slider('speed','İlk hız büyüklüğü',5,45,1,s.speed,'m/s');
 if(t==='compare'){
  h+=slider('angleA','A açısı',5,85,1,s.angleA,'°');
  h+=slider('angleB','B açısı',5,85,1,s.angleB,'°');
 }else if(t!=='horizontal')h+=slider('angleDeg','Atış açısı',t==='elevated'||t==='target'?-45:5,85,1,s.angleDeg,'°');
 if(!['oblique','compare'].includes(t))h+=slider('height','Başlangıç yüksekliği',t==='horizontal'?10:0,160,5,s.height,'m');
 if(t==='target')h+=slider('targetX','Hedef yatay uzaklığı',15,175,5,s.targetX,'m');
 h+=slider('g','Yerçekimi ivmesi',8,10,.5,s.g,'m/s²');
 if(t!=='target')h+=selector('schoolAngles','37° / 53° trigonometrisi',
  [['yes','YKS 3–4–5 yaklaşımı'],['no','Gerçek sin/cos']],s.schoolAngles?'yes':'no');
 h+=slider('time','Zamanı değiştir',0,Number(endTime().toFixed(3)),.01,Math.min(s.time,endTime()),'s');
 $('controls').innerHTML=h;
}
function syncTime(){
 const input=$('pr-time'),out=$('pr-out-time');if(!input)return;
 const s=state[state.tab],T=endTime();s.time=Math.max(0,Math.min(s.time,T));
 input.max=String(T);input.value=String(s.time);
 if(out)out.textContent=F(s.time,'s');
}
function metric(label,value,note=''){return '<div class="metric"><small>'+H(label)+'</small><strong>'+H(value)+'</strong>'+(note?'<em>'+H(note)+'</em>':'')+'</div>';}
function measures(){
 const t=state.tab,s=state[t],models=modelList(),a=models[0];
 if(t==='compare'){
  const b=models[1];
  $('results').innerHTML=[
   metric('A menzili',F(a.range,'m')),metric('B menzili',F(b.range,'m')),
   metric('Menzil farkı',F(Math.abs(a.range-b.range),'m')),
   metric('A havada kalma',F(a.impactTime,'s')),
   metric('B havada kalma',F(b.impactTime,'s')),
   metric('A tepe yüksekliği',F(a.peakHeight,'m')),
   metric('B tepe yüksekliği',F(b.peakHeight,'m')),
   metric('Anlık A yüksekliği',F(M.at(a,s.time).y,'m')),
   metric('Anlık B yüksekliği',F(M.at(b,s.time).y,'m'))
  ].join('');return;
 }
 const pos=M.at(a,s.time);
 let rows=[['Zaman',F(pos.t,'s')],['Yatay konum x',F(pos.x,'m')],
  ['Yerden yükseklik y',F(pos.y,'m')],
  ['Başlangıç vₓ',F(a.vx,'m/s')],['Başlangıç vᵧ',F(a.vy,'m/s')],
  ['Anlık vₓ',F(pos.vx,'m/s')],['Anlık vᵧ',F(pos.vy,'m/s')],
  ['Tepe yüksekliği',F(a.peakHeight,'m')],
  ['Tepe zamanı',F(a.peakTime,'s')],
  ['Havada kalma süresi',F(a.impactTime,'s')]];
 if(t!=='target'||state.trial)rows.push(['Yatay menzil',F(a.range,'m')]);
 if(pos.landed)rows.push(['Çarpışma öncesi hız','('+F(a.impactVx)+', '+F(a.impactVy)+') m/s']);
 if(t==='target'){
  rows.push(['Hedef uzaklığı',F(s.targetX,'m')],['Deneme sayısı',String(state.trials)]);
  if(state.trial)rows.push(['İsabet farkı',F(state.trial.delta,'m'),state.trial.hit?'İsabet':'Sapma']);
 }
 rows.push(['Uçuş ivmesi','aₓ=0, aᵧ=−'+F(a.g,'m/s²')]);
 $('results').innerHTML=rows.map(x=>metric(...x)).join('');
}
function explain(){
 const mode=state.tab,s=state[mode];
 let f='',body='',caution='';
 if(mode==='horizontal'){
  f='vₓ=v₀, vᵧ₀=0;  y=h−½gt²';
  body='Uçuş süresi t=√(2h/g), menzil x=v₀t. Yatayda hız sabit, düşeyde −g ivmesi var.';
  caution='Aynı yükseklikten atışta yatay hızı iki katına çıkarmak süreyi değiştirmez; menzili iki katına çıkarır.';
 }else if(mode==='oblique'){
  f='vₓ=v₀ cosθ; vᵧ=v₀ sinθ−gt';
  body='Yatay hız sabit; düşey hız tepede sıfır, sonra negatiftir.';
  caution='Yalnız aynı yükseklikte başlayan ve biten atış için T=2v₀sinθ/g, R=v₀²sin(2θ)/g.';
 }else if(mode==='elevated'){
  f='x=v₀cosθ·t; y=h₀+v₀sinθ·t−½gt²';
  body='Pozitif uçuş süresi y(t)=0 denklemiyle bulunur; açı negatifse cisim başlangıçta aşağı yönde hareket eder.';
  caution='Yüksekten atışta R=v₀²sin(2θ)/g formülünü doğrudan kullanma; yükseklikler eşit değildir.';
 }else if(mode==='compare'){
  f='R=v₀²sin(2θ)/g   (aynı seviyede)';
  body='30° ve 60° menzilleri eşit olabilir, ancak havada kalma ve tepe yüksekliği farklıdır.';
  caution='Açı 45° olduğunda, aynı sürat ve aynı iniş düzleminde yatay menzil maksimum olur.';
 }else if(mode==='target'){
  f='0 = h₀+x·tanθ−gx²/(2v₀²cos²θ)';
  body='Açıyı değiştirerek yatay ve düşey hız bileşenlerini ayarla. Hedefe ±2 m yaklaşınca isabet sayılır.';
  caution='Tek bir hedefin iki farklı çözüm açısı olabilir veya hız yetersizse hiç olmayabilir.';
 }else{
  f='x(t)=vₓt; y(t)=h₀+vᵧ₀t−½gt²';
  body='x–t eğimi vₓ, y–t eğimi vᵧ. vₓ–t sabit çizgi, vᵧ–t eğimi −g olan doğrudur.';
  caution='Tepe noktasında vᵧ=0 fakat aᵧ=−g değişmez.';
 }
 $('lesson').innerHTML='<div class="formula">'+H(f)+'</div><p>'+H(body)+'</p><aside>'+H(caution)+'</aside>';
 let hint='▶ ile hareketi oynat; zamanı kaydır veya 0,25 s ilerlet.';
 if(mode==='target'){
  hint='🎯 Açıyı ayarla ve Atışı dene. Atıştan önce menzil açıklanmaz.';
  if(state.solution){
   const angles=M.possibleAngles({speed:s.speed,height:s.height,targetX:s.targetX,g:s.g,minAngle:-45,maxAngle:85});
   hint=angles.length?'Teorik isabet açıları: '+angles.map(a=>F(a,'°')).join(' veya ')+'.':'Verilen hızla seçilebilir açılarda isabet yok.';
  }
  if(state.trial){
   const result=state.trial;
   const status=result.hit?'🎯 İSABET!':result.side==='kısa'?'Kısa kaldı.':'Uzun gitti.';
   hint=status+' Hedef farkı: '+F(result.delta,'m')+'. '+hint;
  }
 }else{
  hint+=(s.schoolAngles?' 37°/53° için 3–4–5 yaklaşımı açık.':' Gerçek trigonometrik değerler açık.');
  if(mode==='compare')hint+=' Dört grafik A atışına aittir.';
 }
 $('hint').textContent=hint;
}
function buttons(){
 let h='';
 if(state.tab==='quiz'){
  h=btn('Cevabı kontrol et','check',false,state.quiz.choice===null||state.quiz.checked)
   +btn('Sonraki soru →','next')+btn('Testi sıfırla','reset');
 }else{
  h=btn(state.playing?'Ⅱ Duraklat':'▶ Oynat','play',state.playing)
   +btn('+0,25 s','step')+btn('Hız okları '+(state.vectors?'✓':'○'),'vectors',state.vectors)
   +btn('Yörünge '+(state.trace?'✓':'○'),'trace',state.trace);
  if(state.tab==='compare')h+=btn('30°/60°','preset');
  if(state.tab==='target')h+=btn('🎯 Atışı dene','shoot')+btn('Çözüm açılarını göster','solve');
  h+=btn('↺ Sıfırla','reset');
 }
 $('buttons').innerHTML=h;
}
function quiz(){
 const s=state.quiz,q=Q[s.index%Q.length];
 $('graphs-section').classList.add('hidden');
 $('scene').innerHTML='<svg viewBox="0 0 920 520" role="img" aria-label="YKS soru kartı"><rect width="920" height="520" fill="#0a2033"/>'
 +'<rect x="68" y="70" width="785" height="375" rx="22" fill="#14324a" stroke="#567c91"/>'
 +'<text x="99" y="148" fill="#50e2c2" font-family="system-ui" font-size="25" font-weight="800">AYT · İKİ BOYUTTA HAREKET</text>'
 +'<text x="99" y="234" fill="#e7f4ff" font-family="system-ui" font-size="22">Yatay / düşey hareketi ayır.</text>'
 +'<text x="99" y="298" fill="#bcd7e3" font-family="system-ui" font-size="18">vₓ sabit · vᵧ değişken · aᵧ=−g</text>'
 +'<text x="99" y="372" fill="#ffda99" font-family="system-ui" font-size="18">Soru '+(s.index+1)+' / '+Q.length+'</text></svg>';
 $('results').innerHTML=metric('Soru',(s.index+1)+' / '+Q.length)+metric('Doğru',String(s.score))+metric('Çözülen',String(s.attempts));
 $('lesson').innerHTML='<p>2018 MEB <strong>11.1.5.1–11.1.5.2</strong>: yatay/eğik atış, hız bileşenleri, menzil, tepe ve süre.</p><aside>20 özgün soru; resmî ÖSYM sorusu değildir.</aside>';
 $('quiz').innerHTML='<div class="quiz-prompt">'+H(q.q)+'</div>'+q.cs.map((v,i)=>
  '<button type="button" class="answer '+(s.checked?(i===q.a?'correct':i===s.choice?'wrong':''):'')+'" data-answer="'+i+'" '+(s.checked?'disabled':'')+'><span>'+('ABCDE'[i])+'</span>'+H(v)+'</button>').join('')
  +(s.checked?'<div class="feedback '+(s.choice===q.a?'success':'error')+'">'+H(q.why)+'</div>':'<div class="feedback info">Bir seçenek seç, sonra “Cevabı kontrol et”e bas.</div>');
 $('hint').textContent='Hava direnci yok. Hızları bileşenlere ayırıp yerçekimini yalnız düşey yönde uygula.';
 buttons();
}
function update(){
 if(state.tab==='quiz'){quiz();return;}
 $('graphs-section').classList.remove('hidden');
 const s=state[state.tab],m=modelList();
 $('scene').innerHTML=R.scene({models:m,mode:state.tab,time:s.time,showVectors:state.vectors,showTrace:state.trace,
  targetX:state.tab==='target'?s.targetX:null,trial:state.trial});
 measures();explain();
 $('graphs').innerHTML=R.charts(m[0],s.time);
 const p=M.beforeImpactAt(m[0],s.time);
 $('graph-summary').textContent=(state.tab==='compare'?'Grafikler A atışına aittir. ':'')
  +'Bu anda vₓ='+F(p.vx,'m/s')+' (sabit) ve vᵧ='+F(p.vy,'m/s')+'. Uçuş boyunca aₓ=0 ve aᵧ=−'+F(m[0].g,'m/s²')+'.';
 $('quiz').innerHTML='';buttons();
}
function switchTab(id){
 if(!tabs.some(t=>t[0]===id))return;
 state.tab=id;state.playing=false;state.last=0;state.trial=null;state.trials=0;state.solution=false;
 d.querySelectorAll('[data-tab]').forEach(el=>{const active=el.dataset.tab===id;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
 $('heading').textContent=details[id][0];$('intro').textContent=details[id][1];
 $('tagline').textContent=id==='quiz'?'2018 MEB · YKS KONTROL':'2018 MEB · 11.1.5.1–2';
 controls();update();
}
function change(key,val){
 const s=state[state.tab];if(!s||!(key in s)||state.tab==='quiz')return;
 state.playing=false;state.last=0;state.trial=null;state.solution=false;
 if(state.tab==='target'&&['speed','height','targetX','g'].includes(key))state.trials=0;
 s[key]=key==='schoolAngles'?val==='yes':Number(val);
 if(key!=='time'){s.time=0;syncTime();}
 else s.time=Math.max(0,Math.min(s.time,endTime()));
 update();
}
function act(id){
 const t=state.tab,s=state[t];
 if(id==='vectors'){state.vectors=!state.vectors;update();return;}
 if(id==='trace'){state.trace=!state.trace;update();return;}
 if(id==='preset'&&t==='compare'){s.angleA=30;s.angleB=60;s.time=0;state.playing=false;controls();update();return;}
 if(id==='solve'&&t==='target'){state.solution=true;explain();return;}
 if(id==='shoot'&&t==='target'){
  state.trial=M.targetResult(modelList()[0],s.targetX,2);state.trials++;
  s.time=0;state.playing=true;state.last=0;syncTime();update();schedule();return;
 }
 if(id==='play'&&t!=='quiz'){
  if(s.time>=endTime()-M.EPS)s.time=0;
  state.playing=!state.playing;state.last=0;syncTime();buttons();if(state.playing)schedule();return;
 }
 if(id==='step'&&t!=='quiz'){state.playing=false;s.time=Math.min(endTime(),s.time+.25);syncTime();update();return;}
 if(id==='reset'){
  state.playing=false;state[t]=JSON.parse(JSON.stringify(defaults[t]));state.trial=null;state.trials=0;state.solution=false;controls();update();return;
 }
 if(id==='check'&&t==='quiz'&&s.choice!==null&&!s.checked){
  s.checked=true;s.attempts++;if(s.choice===Q[s.index%Q.length].a)s.score++;update();return;
 }
 if(id==='next'&&t==='quiz'){s.index=(s.index+1)%Q.length;s.choice=null;s.checked=false;update();}
}
function schedule(){if(state.playing&&state.raf===null)state.raf=w.requestAnimationFrame(frame);}
function frame(now){
 state.raf=null;
 if(state.playing){
  const dt=Math.min(.07,state.last?(now-state.last)/1000:0),s=state[state.tab];
  if(s&&Number.isFinite(s.time)){
   s.time=Math.min(endTime(),s.time+dt);
   if(s.time>=endTime()-M.EPS)state.playing=false;
   syncTime();update();
  }else state.playing=false;
 }
 state.last=now;if(state.playing)schedule();
}
function init(){
 if(!$('tabs')||!$('scene')||!$('controls')||!$('graphs'))return;
 $('tabs').innerHTML=tabs.map(t=>'<button type="button" data-tab="'+t[0]+'" aria-pressed="false">'+H(t[1])+'</button>').join('');
 $('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)switchTab(b.dataset.tab);});
 $('controls').addEventListener('input',e=>{const b=e.target.closest('input[data-range]');if(!b)return;
  const out=$('pr-out-'+b.dataset.range);if(out)out.textContent=F(Number(b.value),b.dataset.unit);
  change(b.dataset.range,b.value);
 });
 $('controls').addEventListener('change',e=>{const b=e.target.closest('select[data-select]');if(b)change(b.dataset.select,b.value);});
 $('buttons').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)act(b.dataset.action);});
 $('quiz').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b&&state.tab==='quiz'&&!state.quiz.checked){state.quiz.choice=Number(b.dataset.answer);update();}});
 d.addEventListener('visibilitychange',()=>{if(d.hidden){state.playing=false;state.last=0;buttons();}});
 switchTab('horizontal');
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
w.AtisLabDebug=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({tab:state.tab,playing:state.playing,
 horizontal:state.horizontal,oblique:state.oblique,elevated:state.elevated,
 compare:state.compare,target:state.target,graphs:state.graphs,quiz:state.quiz,
 vectors:state.vectors,trace:state.trace,trial:state.trial,trials:state.trials,solution:state.solution}))});
})(window,document);